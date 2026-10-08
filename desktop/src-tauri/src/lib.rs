use serde::Serialize;
use std::process::Command;
use sysinfo::{System, Components};
use std::sync::Mutex;
use std::collections::HashMap;

// ─── Structs ────────────────────────────────────────────────────────────────

#[derive(Serialize, Clone)]
pub struct CpuTelemetry {
    // Utilization
    global_usage: f32,
    per_core_usage: Vec<f32>,
    // Identity
    model_name: String,
    vendor: String,
    architecture: String,
    byte_order: String,
    physical_cores: u32,
    logical_cores: u32,
    threads_per_core: u32,
    sockets: u32,
    // Clocks
    base_clock_mhz: f32,
    // Cache
    l1d_cache: String,
    l1i_cache: String,
    l2_cache: String,
    l3_cache: String,
    // Flags / features
    has_avx: bool,
    has_avx2: bool,
    has_avx512: bool,
    has_aes: bool,
    has_vt: bool,
    // Extra lscpu fields
    stepping: String,
    microcode: String,
    bogomips: String,
    virtualization: String,
    numa_nodes: String,
    // Thermal
    temperature_c: f32,
    thermal_available: bool,
    // Power & Voltage (Linux RAPL / hwmon)
    power_draw_w: f32,
    core_voltage_v: f32,
    power_available: bool,
    voltage_available: bool,
    // System
    uptime_secs: u64,
    process_count: u32,
    thread_count: u32,
}

struct SysState {
    sys: Mutex<System>,
    // Store last energy reading for delta calculation
    last_energy_uj: Mutex<u64>,
    last_energy_time: Mutex<std::time::Instant>,
    // Cache slow hardware info
    cached_dimm: Mutex<Option<(String, String, u32, u32, u32, String, String, Vec<SlotInfo>, String, bool, bool)>>,
    cached_lscpu: Mutex<Option<HashMap<String, String>>>,
}


// ─── Helper: read a sysfs file ───────────────────────────────────────────────

fn read_sysfs(path: &str) -> Option<String> {
    std::fs::read_to_string(path)
        .ok()
        .map(|s| s.trim().to_string())
}

// ─── Helper: parse lscpu --json ─────────────────────────────────────────────

#[derive(serde::Deserialize)]
struct LscpuOutput {
    lscpu: Vec<LscpuField>,
}

#[derive(serde::Deserialize)]
struct LscpuField {
    field: String,
    data: String,
    #[serde(default)]
    children: Vec<LscpuField>,
}

fn flatten_lscpu(fields: Vec<LscpuField>, map: &mut HashMap<String, String>) {
    for f in fields {
        let key = f.field.trim_end_matches(':').trim().to_string();
        map.insert(key, f.data.clone());
        if !f.children.is_empty() {
            flatten_lscpu(f.children, map);
        }
    }
}

fn get_lscpu_map() -> HashMap<String, String> {
    let mut map = HashMap::new();
    if let Ok(output) = Command::new("lscpu").arg("--json").output() {
        if let Ok(text) = String::from_utf8(output.stdout) {
            if let Ok(parsed) = serde_json::from_str::<LscpuOutput>(&text) {
                flatten_lscpu(parsed.lscpu, &mut map);
            }
        }
    }
    map
}

// ─── Helper: CPU temperature from sysinfo Components or sysfs ───────────────

fn get_cpu_temp(_sys: &System) -> (f32, bool) {
    // Try sysinfo components first (works on many Linux systems)
    let comps = Components::new_with_refreshed_list();
    for comp in comps.iter() {
        let label = comp.label().to_lowercase();
        if label.contains("cpu") || label.contains("package") || label.contains("tdie") || label.contains("core 0") {
            return (comp.temperature().unwrap_or(0.0), true);
        }
    }
    // Fallback: hwmon coretemp via sysfs
    for hwmon_dir in glob_dirs("/sys/class/hwmon/hwmon*") {
        if let Some(name) = read_sysfs(&format!("{}/name", hwmon_dir)) {
            if name.contains("coretemp") || name.contains("k10temp") || name.contains("zenpower") {
                // Find input files
                for i in 1..=32 {
                    let label_path = format!("{}/temp{}_label", hwmon_dir, i);
                    let input_path = format!("{}/temp{}_input", hwmon_dir, i);
                    if let Some(label) = read_sysfs(&label_path) {
                        if label.to_lowercase().contains("package") || label.to_lowercase().contains("tdie") {
                            if let Some(raw) = read_sysfs(&input_path) {
                                if let Ok(millicelsius) = raw.parse::<f32>() {
                                    return (millicelsius / 1000.0, true);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    (0.0, false)
}

// ─── Helper: CPU power draw from Intel RAPL (Linux) ─────────────────────────

fn get_power_draw_w(last_uj: &mut u64, last_time: &mut std::time::Instant) -> (f32, bool) {
    // Intel RAPL via powercap
    let rapl_paths = [
        "/sys/class/powercap/intel-rapl/intel-rapl:0/energy_uj",
        "/sys/class/powercap/intel-rapl:0/energy_uj",
        "/sys/devices/virtual/powercap/intel-rapl/intel-rapl:0/energy_uj",
    ];
    for path in &rapl_paths {
        if let Some(raw) = read_sysfs(path) {
            if let Ok(current_uj) = raw.parse::<u64>() {
                let now = std::time::Instant::now();
                let delta_uj = current_uj.wrapping_sub(*last_uj) as f32;
                let delta_t = now.duration_since(*last_time).as_secs_f32();
                *last_uj = current_uj;
                *last_time = now;
                if delta_t > 0.0 && delta_uj >= 0.0 {
                    let watts = delta_uj / 1_000_000.0 / delta_t;
                    return (watts, true);
                }
            }
        }
    }
    // AMD hwmon power
    for hwmon_dir in glob_dirs("/sys/class/hwmon/hwmon*") {
        if let Some(name) = read_sysfs(&format!("{}/name", hwmon_dir)) {
            if name.contains("k10temp") || name.contains("zenpower") || name.contains("amdgpu") {
                for i in 1..=4 {
                    let path = format!("{}/power{}_input", hwmon_dir, i);
                    if let Some(raw) = read_sysfs(&path) {
                        if let Ok(microwatts) = raw.parse::<f32>() {
                            return (microwatts / 1_000_000.0, true);
                        }
                    }
                }
            }
        }
    }
    (0.0, false)
}

// ─── Helper: CPU core voltage from hwmon ─────────────────────────────────────

fn get_core_voltage_v() -> (f32, bool) {
    for hwmon_dir in glob_dirs("/sys/class/hwmon/hwmon*") {
        if let Some(name) = read_sysfs(&format!("{}/name", hwmon_dir)) {
            if name.contains("coretemp") || name.contains("k10temp") || name.contains("zenpower") || name.contains("it8") || name.contains("nct") {
                for i in 1..=16 {
                    let label_path = format!("{}/in{}_label", hwmon_dir, i);
                    let input_path = format!("{}/in{}_input", hwmon_dir, i);
                    let label = read_sysfs(&label_path).unwrap_or_default().to_lowercase();
                    if label.contains("vcore") || label.contains("cpu") || label.contains("vccp") || i == 1 {
                        if let Some(raw) = read_sysfs(&input_path) {
                            if let Ok(millivolts) = raw.parse::<f32>() {
                                if millivolts > 500.0 && millivolts < 3000.0 {
                                    return (millivolts / 1000.0, true);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    (0.0, false)
}

// ─── Helper: glob directory entries ─────────────────────────────────────────

fn glob_dirs(pattern: &str) -> Vec<String> {
    // Simple glob: find all entries matching a wildcard path
    let (base, _prefix) = pattern.split_once('*').unwrap_or((pattern, ""));
    let mut results = Vec::new();
    if let Ok(entries) = std::fs::read_dir(base.trim_end_matches('/').rsplit_once('/').map(|p| p.0).unwrap_or("/sys/class/hwmon")) {
        for entry in entries.flatten() {
            results.push(entry.path().to_string_lossy().to_string());
        }
    }
    results
}

// ─── Tauri Commands ──────────────────────────────────────────────────────────

#[tauri::command]
fn get_cpu_telemetry(state: tauri::State<SysState>) -> CpuTelemetry {
    let mut sys = state.sys.lock().unwrap();
    sys.refresh_cpu_all();

    let cpus = sys.cpus();
    let global_usage = sys.global_cpu_usage();
    let per_core_usage: Vec<f32> = cpus.iter().map(|c| c.cpu_usage()).collect();
    let logical_cores = cpus.len() as u32;
    let physical_cores = sys.physical_core_count().unwrap_or(logical_cores as usize) as u32;
    let threads_per_core = if physical_cores > 0 { logical_cores / physical_cores } else { 1 };
    let base_clock_mhz = cpus.first().map(|c| c.frequency() as f32).unwrap_or(0.0);
    let model_name = cpus.first().map(|c| c.brand().to_string()).unwrap_or_default();
    let vendor = cpus.first().map(|c| c.vendor_id().to_string()).unwrap_or_default();

    // Fast process count via /proc
    let mut process_count = 0;
    if let Ok(entries) = std::fs::read_dir("/proc") {
        for e in entries.flatten() {
            if e.file_name().to_string_lossy().chars().all(char::is_numeric) {
                process_count += 1;
            }
        }
    }
    let thread_count = process_count * 2; // rough estimate to avoid heavy iteration

    // Thermal
    drop(sys);
    let sys_ref = state.sys.lock().unwrap();
    let (temperature_c, thermal_available) = get_cpu_temp(&sys_ref);
    drop(sys_ref);

    // Power
    let mut last_uj = state.last_energy_uj.lock().unwrap();
    let mut last_time = state.last_energy_time.lock().unwrap();
    let (power_draw_w, power_available) = get_power_draw_w(&mut last_uj, &mut last_time);
    drop(last_uj);
    drop(last_time);

    // Voltage
    let (core_voltage_v, voltage_available) = get_core_voltage_v();

    // lscpu enrichment (Linux only) - CACHED
    let mut cache = state.cached_lscpu.lock().unwrap();
    if cache.is_none() {
        *cache = Some(get_lscpu_map());
    }
    let lscpu = cache.clone().unwrap();
    let architecture = lscpu.get("Architecture").cloned()
        .unwrap_or_else(|| std::env::consts::ARCH.to_string());
    let stepping = lscpu.get("Stepping").cloned().unwrap_or_else(|| "N/A".to_string());
    let microcode = lscpu.get("Microcode").cloned().unwrap_or_else(|| "N/A".to_string());
    let bogomips = lscpu.get("BogoMIPS").cloned().unwrap_or_else(|| "N/A".to_string());
    let virtualization = lscpu.get("Virtualization").cloned().unwrap_or_else(|| "N/A".to_string());
    let numa_nodes = lscpu.get("NUMA node(s)").cloned().unwrap_or_else(|| "1".to_string());
    let sockets = lscpu.get("Socket(s)").and_then(|s| s.parse().ok()).unwrap_or(1u32);
    let byte_order = lscpu.get("Byte Order").cloned().unwrap_or_else(|| "Little Endian".to_string());
    let l1d_cache = lscpu.get("L1d cache").cloned().unwrap_or_else(|| "N/A".to_string());
    let l1i_cache = lscpu.get("L1i cache").cloned().unwrap_or_else(|| "N/A".to_string());
    let l2_cache  = lscpu.get("L2 cache").cloned().unwrap_or_else(|| "N/A".to_string());
    let l3_cache  = lscpu.get("L3 cache").cloned().unwrap_or_else(|| "N/A".to_string());
    let flags = lscpu.get("Flags").cloned().unwrap_or_default();
    let has_avx    = flags.contains("avx");
    let has_avx2   = flags.contains("avx2");
    let has_avx512 = flags.contains("avx512");
    let has_aes    = flags.contains("aes");
    let has_vt     = !virtualization.is_empty() && virtualization != "N/A";

    let uptime_secs = System::uptime();

    CpuTelemetry {
        global_usage,
        per_core_usage,
        model_name,
        vendor,
        architecture,
        byte_order,
        physical_cores,
        logical_cores,
        threads_per_core,
        sockets,
        base_clock_mhz,
        l1d_cache,
        l1i_cache,
        l2_cache,
        l3_cache,
        has_avx,
        has_avx2,
        has_avx512,
        has_aes,
        has_vt,
        stepping,
        microcode,
        bogomips,
        virtualization,
        numa_nodes,
        temperature_c,
        thermal_available,
        power_draw_w,
        core_voltage_v,
        power_available,
        voltage_available,
        uptime_secs,
        process_count,
        thread_count,
    }
}

// Keep old commands for backward compatibility
#[derive(Serialize)]
pub struct SystemStats {
    cpu_usage: f32,
    memory_total: u64,
    memory_used: u64,
    battery: String,
    temperature: String,
}

#[tauri::command]
fn get_system_stats(state: tauri::State<SysState>) -> SystemStats {
    let mut sys = state.sys.lock().unwrap();
    sys.refresh_cpu_usage();
    sys.refresh_memory();
    let cpu_usage = sys.global_cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    SystemStats {
        cpu_usage,
        memory_total,
        memory_used,
        battery: "N/A".to_string(),
        temperature: "N/A".to_string(),
    }
}

#[tauri::command]
fn get_advanced_cpu_info(state: tauri::State<SysState>) -> Result<HashMap<String, String>, String> {
    let mut map = get_lscpu_map();
    if map.is_empty() {
        let mut sys = state.sys.lock().unwrap();
        sys.refresh_cpu_usage();
        let cpus = sys.cpus();
        if !cpus.is_empty() {
            let cpu = &cpus[0];
            map.insert("Vendor ID".to_string(), cpu.vendor_id().to_string());
            map.insert("Model name".to_string(), cpu.brand().to_string());
            map.insert("CPU(s)".to_string(), cpus.len().to_string());
        }
        if let Some(cores) = sys.physical_core_count() {
            map.insert("Thread(s) per core".to_string(), (cpus.len() / cores).to_string());
        }
        map.insert("Architecture".to_string(), std::env::consts::ARCH.to_string());
    }
    Ok(map)
}

#[tauri::command]
fn launch_external_app(app_id: &str) -> Result<String, String> {
    let binary = match app_id {
        "terminal" => "xterm",
        "browser" => "firefox",
        "files" => "pcmanfm",
        _ => return Err(format!("Unknown external app: {}", app_id)),
    };
    match Command::new(binary).spawn() {
        Ok(_) => Ok(format!("Launched {}", binary)),
        Err(e) => Err(format!("Failed to launch {}: {}", binary, e)),
    }
}

#[tauri::command]
fn execute_system_command(cmd: &str) -> Result<String, String> {
    match cmd {
        "reboot" => {
            Command::new("sudo").arg("reboot").spawn().map_err(|e| e.to_string())?;
            Ok("Rebooting...".to_string())
        },
        "shutdown" => {
            Command::new("sudo").arg("shutdown").arg("now").spawn().map_err(|e| e.to_string())?;
            Ok("Shutting down...".to_string())
        },
        _ => Err(format!("Unknown command: {}", cmd)),
    }
}

// ─── Memory Telemetry ───────────────────────────────────────────────────────

#[derive(Serialize, Clone)]
pub struct MemoryTelemetry {
    // Raw bytes from sysinfo
    total_bytes: u64,
    used_bytes: u64,
    available_bytes: u64,
    free_bytes: u64,
    // Swap / Page file
    swap_total_bytes: u64,
    swap_used_bytes: u64,
    // Percentage
    used_percent: f32,
    // Human-readable GB (pre-formatted for UI)
    total_gb: f32,
    used_gb: f32,
    available_gb: f32,
    free_gb: f32,
    swap_total_gb: f32,
    swap_used_gb: f32,
    // From dmidecode / /proc/meminfo extras
    mem_type: String,
    form_factor: String,
    speed_mts: u32,
    num_slots_used: u32,
    num_slots_total: u32,
    manufacturer: String,
    serial: String,
    cached_gb: f32,
    buffers_gb: f32,
    shmem_gb: f32,
    mapped_gb: f32,
    slab_gb: f32,
    committed_gb: f32,
    // Extra fields for deep scan page
    slot_details: Vec<SlotInfo>,  // Per-slot info from dmidecode
    channels: String,             // Single/Dual/Quad channel
    ecc_enabled: bool,
    dimm_has_info: bool,          // True if dmidecode returned data
}

#[derive(Serialize, Clone)]
pub struct SlotInfo {
    label: String,
    size_gb: f32,
    populated: bool,
    mem_type: String,
    speed_mts: u32,
    manufacturer: String,
    part_number: String,
}

// ─── Helper: read key from /proc/meminfo ─────────────────────────────────────
fn read_meminfo_kb(key: &str) -> u64 {
    if let Some(content) = read_sysfs("/proc/meminfo") {
        for line in content.lines() {
            if line.starts_with(key) {
                let val: u64 = line
                    .split_whitespace()
                    .nth(1)
                    .and_then(|v| v.parse().ok())
                    .unwrap_or(0);
                return val * 1024; // convert kB -> bytes
            }
        }
    }
    0
}

// ─── Helper: run dmidecode (tries sudo, then direct) ─────────────────────────
fn run_dmidecode() -> String {
    // 1. Direct call (works as root in ISO)
    if let Ok(out) = Command::new("dmidecode").args(["-t", "17"]).output() {
        if let Ok(text) = String::from_utf8(out.stdout) {
            if text.contains("Memory Device") {
                return text;
            }
        }
    }
    // 2. sudo -n (non-interactive, works if sudoers allows it)
    if let Ok(out) = Command::new("sudo").args(["-n", "dmidecode", "-t", "17"]).output() {
        if let Ok(text) = String::from_utf8(out.stdout) {
            if text.contains("Memory Device") {
                return text;
            }
        }
    }
    String::new()
}

// Convert lshw memory output to dmidecode-compatible info
fn get_lshw_memory() -> (String, String, u32, Vec<SlotInfo>) {
    let mut mem_type = String::new();
    let mut form_factor = String::new();
    let mut speed_mts: u32 = 0;
    let mut slots: Vec<SlotInfo> = Vec::new();

    // Try lshw -c memory
    let out = Command::new("lshw").args(["-c", "memory", "-short"]).output()
        .or_else(|_| Command::new("lshw").args(["-c", "memory"]).output());

    if let Ok(output) = out {
        if let Ok(text) = String::from_utf8(output.stdout) {
            for line in text.lines() {
                let l = line.trim();
                // lshw -short: columns are: H/W path | Device | Class | Description
                if l.contains("DIMM") || l.contains("DDR") || l.contains("SDRAM") {
                    for part in l.split_whitespace() {
                        if part.starts_with("DDR") || part.starts_with("LPDDR") || part.starts_with("SDRAM") {
                            if mem_type.is_empty() { mem_type = part.to_string(); }
                        }
                        if part.ends_with("MT/s") || part.ends_with("MHz") {
                            if let Ok(s) = part.trim_end_matches("MT/s").trim_end_matches("MHz").parse::<u32>() {
                                if speed_mts == 0 { speed_mts = s; }
                            }
                        }
                    }
                    let size_str = l.split_whitespace().find(|p| p.ends_with("GiB") || p.ends_with("MiB") || p.ends_with("GB") || p.ends_with("MB")).unwrap_or("0");
                    let size_gb: f32 = if size_str.ends_with("GiB") || size_str.ends_with("GB") {
                        size_str.trim_end_matches("GiB").trim_end_matches("GB").parse().unwrap_or(0.0)
                    } else if size_str.ends_with("MiB") || size_str.ends_with("MB") {
                        size_str.trim_end_matches("MiB").trim_end_matches("MB").parse::<f32>().unwrap_or(0.0) / 1024.0
                    } else { 0.0 };

                    if size_gb > 0.0 {
                        slots.push(SlotInfo {
                            label: format!("SLOT {}", slots.len() + 1),
                            size_gb,
                            populated: true,
                            mem_type: mem_type.clone(),
                            speed_mts,
                            manufacturer: "N/A".to_string(),
                            part_number: "N/A".to_string(),
                        });
                    }
                }
                if l.contains("DIMM") && form_factor.is_empty() {
                    if l.contains("SO-DIMM") { form_factor = "SO-DIMM".to_string(); }
                    else { form_factor = "DIMM".to_string(); }
                }
            }
        }
    }
    (mem_type, form_factor, speed_mts, slots)
}

fn get_dimm_info() -> (String, String, u32, u32, u32, String, String, Vec<SlotInfo>, String, bool, bool) {
    let mut mem_type = "N/A".to_string();
    let mut form_factor = "N/A".to_string();
    let mut speed_mts: u32 = 0;
    let mut slots_used: u32 = 0;
    let mut slots_total: u32 = 0;
    let mut manufacturer = "N/A".to_string();
    let mut serial = "N/A".to_string();
    let mut slot_details: Vec<SlotInfo> = Vec::new();
    let mut ecc_enabled = false;
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    let text = run_dmidecode();
    let has_info = !text.is_empty();

    if has_info {
        // Parse per-slot info
        let mut current: Option<SlotInfo> = None;
        let mut slot_idx: usize = 0;

        for line in text.lines() {
            let l = line.trim();

            if l == "Memory Device" {
                // Save previous slot
                if let Some(s) = current.take() {
                    slot_details.push(s);
                }
                let pair = slot_idx / 2;
                let chan = if pair < letters.len() { letters[pair] } else { "?" };
                let num = slot_idx % 2 + 1;
                current = Some(SlotInfo {
                    label: format!("SLOT {}{}", chan, num),
                    size_gb: 0.0,
                    populated: false,
                    mem_type: "N/A".to_string(),
                    speed_mts: 0,
                    manufacturer: "N/A".to_string(),
                    part_number: "N/A".to_string(),
                });
                slot_idx += 1;
                slots_total += 1;
                continue;
            }

            if let Some(ref mut s) = current {
                if l.starts_with("Size:") {
                    let sz_str = l.replace("Size:", "").trim().to_string();
                    if !sz_str.contains("No Module") && sz_str != "Unknown" && !sz_str.is_empty() {
                        // Parse GB from e.g. "8 GB" or "8192 MB"
                        let parts: Vec<&str> = sz_str.split_whitespace().collect();
                        if parts.len() >= 2 {
                            let val: f32 = parts[0].parse().unwrap_or(0.0);
                            s.size_gb = if parts[1].to_uppercase() == "MB" { val / 1024.0 } else { val };
                        }
                        s.populated = true;
                        slots_used += 1;
                    }
                } else if l.starts_with("Type:") && !l.contains("Error") && !l.contains("Detail") {
                    let t = l.replace("Type:", "").trim().to_string();
                    if t != "Unknown" { s.mem_type = t.clone(); if mem_type == "N/A" { mem_type = t; } }
                } else if l.starts_with("Form Factor:") {
                    let ff = l.replace("Form Factor:", "").trim().to_string();
                    if ff != "Unknown" { s.mem_type = s.mem_type.clone(); form_factor = ff; }
                } else if l.starts_with("Configured Memory Speed:") {
                    let spd = l.split(':').nth(1).unwrap_or("").trim().split_whitespace().next().and_then(|v| v.parse::<u32>().ok()).unwrap_or(0);
                    if spd > 0 { s.speed_mts = spd; if speed_mts == 0 { speed_mts = spd; } }
                } else if l.starts_with("Speed:") && s.speed_mts == 0 {
                    let spd = l.split(':').nth(1).unwrap_or("").trim().split_whitespace().next().and_then(|v| v.parse::<u32>().ok()).unwrap_or(0);
                    if spd > 0 { s.speed_mts = spd; if speed_mts == 0 { speed_mts = spd; } }
                } else if l.starts_with("Manufacturer:") {
                    let m = l.replace("Manufacturer:", "").trim().to_string();
                    if m != "Unknown" && !m.is_empty() {
                        s.manufacturer = m.clone();
                        if manufacturer == "N/A" { manufacturer = m; }
                    }
                } else if l.starts_with("Serial Number:") && serial == "N/A" {
                    let sr = l.replace("Serial Number:", "").trim().to_string();
                    if sr != "Unknown" && !sr.is_empty() { serial = sr; }
                } else if l.starts_with("Part Number:") {
                    let pn = l.replace("Part Number:", "").trim().to_string();
                    if pn != "Unknown" && !pn.is_empty() { s.part_number = pn; }
                } else if l.to_lowercase().contains("ecc") {
                    ecc_enabled = true;
                }
            }
        }
        if let Some(s) = current.take() {
            slot_details.push(s);
        }
    } else {
        // dmidecode not available — try lshw as fallback
        let (lt, lff, lspd, lslots) = get_lshw_memory();
        if !lslots.is_empty() || !lt.is_empty() {
            if mem_type == "N/A" && !lt.is_empty() { mem_type = lt; }
            if form_factor == "N/A" && !lff.is_empty() { form_factor = lff; }
            if speed_mts == 0 { speed_mts = lspd; }
            slots_used = lslots.len() as u32;
            slots_total = lslots.len() as u32;
            slot_details = lslots;
        }
    }

    // Detect channel mode from slot count
    let mut channels = match slots_used {
        1 => "Single Channel",
        2 => "Dual Channel",
        4 => "Quad Channel",
        6 => "Hex Channel",
        8 => "Octa Channel",
        _ => "N/A",
    }.to_string();

    let mut final_has_info = !slot_details.is_empty() || mem_type != "N/A" || speed_mts > 0;

    // Fallbacks for VMs
    if mem_type == "N/A" || mem_type == "Unknown" || mem_type.trim().is_empty() { mem_type = "NOVA Virtual DRAM".to_string(); final_has_info = true; }
    if form_factor == "N/A" || form_factor == "Unknown" || form_factor.trim().is_empty() { form_factor = "vDIMM".to_string(); }
    if speed_mts == 0 { speed_mts = 3200; final_has_info = true; }
    if manufacturer == "N/A" || manufacturer == "Unknown" || manufacturer.trim().is_empty() { manufacturer = "NOVA Core Systems".to_string(); }
    if serial == "N/A" || serial == "Unknown" || serial.trim().is_empty() { serial = "NV-MEM-0001".to_string(); }
    if slots_total == 0 { slots_total = 4; slots_used = 1; channels = "Single Channel".to_string(); }
    if channels == "N/A" { channels = "Virtualized".to_string(); }

    (mem_type, form_factor, speed_mts, slots_used, slots_total, manufacturer, serial, slot_details, channels, ecc_enabled, final_has_info)
}

#[tauri::command]
fn get_memory_telemetry(state: tauri::State<SysState>) -> MemoryTelemetry {
    let mut sys = state.sys.lock().unwrap();
    sys.refresh_memory();

    let total   = sys.total_memory();
    let used    = sys.used_memory();
    let free    = sys.free_memory();
    let avail   = sys.available_memory();
    let sw_tot  = sys.total_swap();
    let sw_used = sys.used_swap();
    drop(sys);

    let to_gb = |b: u64| b as f32 / (1024.0 * 1024.0 * 1024.0);
    let used_pct = if total > 0 { (used as f32 / total as f32) * 100.0 } else { 0.0 };

    // /proc/meminfo extras (Linux)
    let cached_bytes    = read_meminfo_kb("Cached:");
    let buffers_bytes   = read_meminfo_kb("Buffers:");
    let shmem_bytes     = read_meminfo_kb("Shmem:");
    let mapped_bytes    = read_meminfo_kb("Mapped:");
    let slab_bytes      = read_meminfo_kb("Slab:");
    let committed_bytes = read_meminfo_kb("Committed_AS:");

    // DIMM hardware info (cached)
    let mut cache = state.cached_dimm.lock().unwrap();
    if cache.is_none() {
        *cache = Some(get_dimm_info());
    }
    let (mem_type, form_factor, speed_mts, slots_used, slots_total, manufacturer, serial,
         slot_details, channels, ecc_enabled, dimm_has_info) = cache.clone().unwrap();

    MemoryTelemetry {
        total_bytes: total,
        used_bytes: used,
        available_bytes: avail,
        free_bytes: free,
        swap_total_bytes: sw_tot,
        swap_used_bytes: sw_used,
        used_percent: used_pct,
        total_gb: to_gb(total),
        used_gb: to_gb(used),
        available_gb: to_gb(avail),
        free_gb: to_gb(free),
        swap_total_gb: to_gb(sw_tot),
        swap_used_gb: to_gb(sw_used),
        mem_type,
        form_factor,
        speed_mts,
        num_slots_used: slots_used,
        num_slots_total: slots_total,
        manufacturer,
        serial,
        cached_gb: to_gb(cached_bytes),
        buffers_gb: to_gb(buffers_bytes),
        shmem_gb: to_gb(shmem_bytes),
        mapped_gb: to_gb(mapped_bytes),
        slab_gb: to_gb(slab_bytes),
        committed_gb: to_gb(committed_bytes),
        slot_details,
        channels,
        ecc_enabled,
        dimm_has_info,
    }
}

// ─── GPU Telemetry ────────────────────────────────────────────────────────────
#[derive(Serialize, Clone)]
pub struct GpuTelemetry {
    name: String,
    vendor: String,
    driver: String,
    vram_mb: u64,
    vram_total_mb: u64,
    usage_percent: f32,
    temp_c: f32,
    power_w: f32,
    pci_slot: String,
    opengl: String,
    vulkan: String,
    has_info: bool,
}

fn run_cmd(prog: &str, args: &[&str]) -> String {
    Command::new(prog).args(args).output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .unwrap_or_default()
}

#[tauri::command]
fn get_gpu_telemetry() -> GpuTelemetry {
    let mut name = "N/A".to_string();
    let mut vendor = "N/A".to_string();
    let mut driver = "N/A".to_string();
    let mut vram_mb: u64 = 0;
    let mut vram_total_mb: u64 = 0;
    let mut usage_percent: f32 = 0.0;
    let mut temp_c: f32 = 0.0;
    let mut power_w: f32 = 0.0;
    let mut pci_slot = "N/A".to_string();
    let mut opengl = "N/A".to_string();
    let mut vulkan = "N/A".to_string();
    let mut has_info = false;

    // lspci: get GPU name, PCI slot, driver, and VRAM
    let lspci = run_cmd("lspci", &["-v"]);
    let mut current_slot = "".to_string();
    let mut is_vga = false;
    for line in lspci.lines() {
        let l = line.to_lowercase();
        if !line.starts_with('\t') && !line.trim().is_empty() {
            // New device block
            is_vga = l.contains("vga") || l.contains("3d controller") || l.contains("display controller");
            if is_vga {
                has_info = true;
                if let Some((slot, rest)) = line.split_once(' ') {
                    current_slot = slot.trim().to_string();
                    if pci_slot == "N/A" {
                        pci_slot = current_slot.clone();
                    }
                    if pci_slot == current_slot {
                        if let Some(colon_pos) = rest.find(':') {
                            name = rest[colon_pos + 1..].trim().to_string();
                        } else {
                            name = rest.trim().to_string();
                        }
                        // Replace VM names
                        if name.contains("VirtualBox") || name.contains("InnoTek") {
                            name = "NOVA Virtual Graphics".to_string();
                        }
                        if name.contains("VMware") {
                            name = "NOVA Hypervisor Graphics".to_string();
                        }

                        if l.contains("nvidia") { vendor = "NVIDIA".to_string(); }
                        else if l.contains("amd") || l.contains("ati") { vendor = "AMD".to_string(); }
                        else if l.contains("intel") { vendor = "Intel".to_string(); }
                        else if l.contains("vmware") { vendor = "NOVA System".to_string(); }
                        else if l.contains("virtualbox") || l.contains("innotek") { vendor = "NOVA System".to_string(); }
                    }
                }
            }
        } else if is_vga && pci_slot == current_slot {
            // Parse details inside the VGA block
            if l.contains("kernel driver in use:") {
                driver = line.split(':').nth(1).unwrap_or("").trim().to_string();
                if driver.contains("vbox") { driver = "NOVA Display Driver".to_string(); }
            }
            if l.contains("memory at") && l.contains("size=") {
                // e.g. "Memory at f0000000 (32-bit, prefetchable) [size=128M]"
                if let Some(start) = l.find("size=") {
                    let end = l[start..].find(']').unwrap_or(l.len() - start);
                    let size_str = &l[start + 5..start + end];
                    let mut multiplier: u64 = 1;
                    if size_str.ends_with('g') { multiplier = 1024; }
                    else if size_str.ends_with('k') { multiplier = 0; } // ignore tiny VRAM buffers
                    let val_str = size_str.trim_end_matches(|c| !char::is_numeric(c));
                    if let Ok(v) = val_str.parse::<u64>() {
                        if multiplier > 0 {
                            let mb = v * multiplier;
                            if mb > vram_total_mb { vram_total_mb = mb; } // take the largest memory region
                        }
                    }
                }
            }
        }
    }

    // Try NVIDIA SMI
    let smi = run_cmd("nvidia-smi", &[
        "--query-gpu=name,driver_version,memory.used,memory.total,utilization.gpu,temperature.gpu,power.draw",
        "--format=csv,noheader,nounits"
    ]);
    if !smi.trim().is_empty() {
        let parts: Vec<&str> = smi.trim().split(',').collect();
        if parts.len() >= 7 {
            name = parts[0].trim().to_string();
            driver = parts[1].trim().to_string();
            vram_mb = parts[2].trim().parse().unwrap_or(0);
            vram_total_mb = parts[3].trim().parse().unwrap_or(0);
            usage_percent = parts[4].trim().parse().unwrap_or(0.0);
            temp_c = parts[5].trim().parse().unwrap_or(0.0);
            power_w = parts[6].trim().parse().unwrap_or(0.0);
            vendor = "NVIDIA".to_string();
            has_info = true;
        }
    }

    // Try /sys for Intel/AMD VRAM (DRM sysfs)
    if vram_total_mb == 0 {
        for entry in std::fs::read_dir("/sys/class/drm").unwrap_or_else(|_| std::fs::read_dir("/tmp").unwrap()) {
            if let Ok(e) = entry {
                let path = e.path();
                let mem_path = path.join("device/mem_info_vram_total");
                if let Some(val) = read_sysfs(mem_path.to_str().unwrap_or("")) {
                    if let Ok(v) = val.parse::<u64>() { vram_total_mb = v / (1024*1024); }
                }
                let used_path = path.join("device/mem_info_vram_used");
                if let Some(val) = read_sysfs(used_path.to_str().unwrap_or("")) {
                    if let Ok(v) = val.parse::<u64>() { vram_mb = v / (1024*1024); }
                }
            }
        }
    }

    // Driver version from /sys
    if driver == "N/A" {
        if let Some(d) = read_sysfs("/proc/driver/nvidia/version") {
            driver = d.lines().next().unwrap_or("").to_string();
        }
    }

    // Fallback: If VRAM used is 0 but we have a display, estimate base compositor usage (e.g., 45MB)
    if vram_mb == 0 && vram_total_mb > 0 {
        vram_mb = std::cmp::min(vram_total_mb, 45 + (vram_total_mb / 20));
        usage_percent = (vram_mb as f32 / vram_total_mb as f32) * 100.0;
    }


    // OpenGL via glxinfo
    let glx = run_cmd("sh", &["-c", "DISPLAY=:0 glxinfo -B 2>/dev/null"]);
    for line in glx.lines() {
        if line.trim_start().starts_with("OpenGL version string:") {
            opengl = line.split(':').nth(1).unwrap_or("").trim().to_string();
        }
    }

    // Vulkan via vulkaninfo
    let vk = run_cmd("sh", &["-c", "DISPLAY=:0 vulkaninfo --summary 2>/dev/null"]);
    for line in vk.lines() {
        if line.contains("apiVersion") {
            if let Some(v) = line.split('=').nth(1) {
                vulkan = v.trim().to_string();
            }
        }
    }

    // Fallbacks for Virtual Graphics to avoid empty N/A fields 
    if name.contains("NOVA Virtual") || vendor.contains("NOVA") {
        if opengl == "N/A" || opengl.is_empty() { opengl = "OpenGL 3.3 (Core)".to_string(); }
        if vulkan == "N/A" || vulkan.is_empty() { vulkan = "Lavapipe (Software)".to_string(); }
        if temp_c == 0.0 { temp_c = 42.0; }  // Simulated stable thermal profile
        if power_w == 0.0 { power_w = 15.0; } // Simulated idle power draw
        if pci_slot == "N/A" { pci_slot = "00:02.0".to_string(); }
    }

    GpuTelemetry { name, vendor, driver, vram_mb, vram_total_mb,
        usage_percent, temp_c, power_w, pci_slot, opengl, vulkan, has_info }
}

// ─── Network Telemetry ────────────────────────────────────────────────────────
#[derive(Serialize, Clone)]
pub struct NetworkTelemetry {
    interface: String,
    ipv4: String,
    ipv6: String,
    mac: String,
    gateway: String,
    dns: String,
    link_speed_mbps: u64,
    rx_bytes: u64,
    tx_bytes: u64,
    has_info: bool,
}

#[tauri::command]
fn get_network_telemetry() -> NetworkTelemetry {
    let mut interface = "N/A".to_string();
    let mut ipv4 = "N/A".to_string();
    let mut ipv6 = "N/A".to_string();
    let mut mac = "N/A".to_string();
    let mut gateway = "N/A".to_string();
    let mut dns = "N/A".to_string();
    let mut link_speed_mbps: u64 = 0;
    let mut rx_bytes: u64 = 0;
    let mut tx_bytes: u64 = 0;

    // Find primary interface via default route first
    let route = run_cmd("ip", &["route", "show", "default"]);
    for line in route.lines() {
        if line.starts_with("default via") {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if let Some(dev_idx) = parts.iter().position(|&p| p == "dev") {
                if dev_idx + 1 < parts.len() {
                    interface = parts[dev_idx + 1].to_string();
                    break;
                }
            }
        }
    }

    if interface == "N/A" {
        if let Ok(entries) = std::fs::read_dir("/sys/class/net") {
            for entry in entries.flatten() {
                let iface = entry.file_name().to_string_lossy().to_string();
                if iface == "lo" { continue; }
                let operstate = read_sysfs(&format!("/sys/class/net/{}/operstate", iface)).unwrap_or_default();
                if operstate.trim() == "up" || interface == "N/A" {
                    interface = iface.clone();
                }
            }
        }
    }

    if interface != "N/A" {
        // MAC address
        mac = read_sysfs(&format!("/sys/class/net/{}/address", interface))
            .unwrap_or("N/A".to_string());

        // Link speed
        link_speed_mbps = read_sysfs(&format!("/sys/class/net/{}/speed", interface))
            .and_then(|s| s.trim().parse().ok()).unwrap_or(1000);
        if link_speed_mbps == 0 { link_speed_mbps = 1000; }

        // RX/TX bytes
        rx_bytes = read_sysfs(&format!("/sys/class/net/{}/statistics/rx_bytes", interface))
            .and_then(|s| s.trim().parse().ok()).unwrap_or(0);
        tx_bytes = read_sysfs(&format!("/sys/class/net/{}/statistics/tx_bytes", interface))
            .and_then(|s| s.trim().parse().ok()).unwrap_or(0);

        // IPv4 and IPv6 via ip command
        let ip_out = run_cmd("ip", &["addr", "show", &interface]);
        for line in ip_out.lines() {
            let l = line.trim();
            if l.starts_with("inet ") && ipv4 == "N/A" {
                ipv4 = l.split_whitespace().nth(1).unwrap_or("N/A").split('/').next().unwrap_or("N/A").to_string();
            }
            if l.starts_with("inet6 ") && !l.contains("fe80") && ipv6 == "N/A" {
                ipv6 = l.split_whitespace().nth(1).unwrap_or("N/A").split('/').next().unwrap_or("N/A").to_string();
            }
            if l.starts_with("inet6 ") && ipv6 == "N/A" {
                ipv6 = l.split_whitespace().nth(1).unwrap_or("N/A").split('/').next().unwrap_or("N/A").to_string();
            }
        }
    }

    // Default gateway
    let route = run_cmd("ip", &["route", "show", "default"]);
    for line in route.lines() {
        if line.starts_with("default via") {
            gateway = line.split_whitespace().nth(2).unwrap_or("N/A").to_string();
        }
    }

    // DNS from /etc/resolv.conf
    if let Some(resolv) = read_sysfs("/etc/resolv.conf") {
        for line in resolv.lines() {
            if line.starts_with("nameserver") {
                dns = line.split_whitespace().nth(1).unwrap_or("N/A").to_string();
                break;
            }
        }
    }

    let has_info = interface != "N/A";
    NetworkTelemetry { interface, ipv4, ipv6, mac, gateway, dns,
        link_speed_mbps, rx_bytes, tx_bytes, has_info }
}

// ─── Storage Telemetry ────────────────────────────────────────────────────────
#[derive(Serialize, Clone)]
pub struct DiskInfo {
    device: String,
    mount: String,
    fs_type: String,
    total_gb: f32,
    used_gb: f32,
    free_gb: f32,
    use_percent: u32,
}

#[derive(Serialize, Clone)]
pub struct StorageTelemetry {
    disks: Vec<DiskInfo>,
    primary_type: String,   // SSD / HDD / NVMe / Virtual
    total_gb: f32,
    used_gb: f32,
    free_gb: f32,
    has_info: bool,
}

#[tauri::command]
fn get_storage_telemetry() -> StorageTelemetry {
    let mut disks: Vec<DiskInfo> = Vec::new();
    let df = run_cmd("df", &["-BGB", "--output=source,fstype,size,used,avail,pcent,target"]);
    let skip_fs = ["tmpfs", "devtmpfs", "squashfs", "overlay", "udev", "cgroupfs", "efivarfs", "proc", "sysfs"];

    for line in df.lines().skip(1) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() < 7 { continue; }
        let fs_type = parts[1];
        let mount = parts[6];
        if skip_fs.iter().any(|s| fs_type.starts_with(s)) && mount != "/" { continue; }
        if mount.starts_with("/sys") || mount.starts_with("/proc") || mount.starts_with("/dev") { continue; }

        let parse_gb = |s: &str| s.trim_end_matches('G').trim_end_matches('B').parse::<f32>().unwrap_or(0.0);
        let total_gb = parse_gb(parts[2]);
        let used_gb = parse_gb(parts[3]);
        let free_gb = parse_gb(parts[4]);
        let use_pct = parts[5].trim_end_matches('%').parse::<u32>().unwrap_or(0);

        disks.push(DiskInfo {
            device: parts[0].to_string(),
            mount: mount.to_string(),
            fs_type: fs_type.to_string(),
            total_gb, used_gb, free_gb,
            use_percent: use_pct,
        });
    }

    // Detect primary storage type
    let primary_type = if std::path::Path::new("/sys/block/nvme0").exists() {
        "NVMe SSD".to_string()
    } else if std::path::Path::new("/sys/block/sda").exists() {
        // Check rotational flag
        let rot = read_sysfs("/sys/block/sda/queue/rotational").unwrap_or_default();
        if rot.trim() == "1" { "HDD".to_string() } else { "SSD".to_string() }
    } else {
        "Virtual Disk".to_string()
    };

    let total_gb: f32 = disks.iter().map(|d| d.total_gb).sum();
    let used_gb: f32 = disks.iter().map(|d| d.used_gb).sum();
    let free_gb: f32 = disks.iter().map(|d| d.free_gb).sum();
    let has_info = !disks.is_empty();

    StorageTelemetry { disks, primary_type, total_gb, used_gb, free_gb, has_info }
}

// ─── System Info Telemetry ────────────────────────────────────────────────────
#[derive(Serialize, Clone)]
pub struct SystemInfo {
    hostname: String,
    os_name: String,
    os_version: String,
    kernel: String,
    architecture: String,
    uptime_secs: u64,
    process_count: u32,
    motherboard: String,
    bios_vendor: String,
    bios_version: String,
    chassis_type: String,
    product_name: String,
    secure_boot: String,
    has_info: bool,
}

#[tauri::command]
fn get_system_info(state: tauri::State<SysState>) -> SystemInfo {
    let hostname = read_sysfs("/proc/sys/kernel/hostname")
        .or_else(|| { run_cmd("hostname", &[]).trim().to_string().into() })
        .unwrap_or("N/A".to_string());

    let kernel = read_sysfs("/proc/version")
        .map(|s| s.split_whitespace().take(3).collect::<Vec<_>>().join(" "))
        .unwrap_or("N/A".to_string());

    // OS from /etc/os-release
    let mut os_name = "Linux".to_string();
    let mut os_version = "N/A".to_string();
    if let Some(osrel) = read_sysfs("/etc/os-release") {
        for line in osrel.lines() {
            if line.starts_with("PRETTY_NAME=") {
                os_name = line.replace("PRETTY_NAME=", "").replace('"', "").trim().to_string();
            }
            if line.starts_with("VERSION_ID=") {
                os_version = line.replace("VERSION_ID=", "").replace('"', "").trim().to_string();
            }
        }
    }

    let architecture = run_cmd("uname", &["-m"]).trim().to_string();

    let mut sys = state.sys.lock().unwrap();
    sys.refresh_all();
    let uptime_secs = System::uptime();
    let process_count = sys.processes().len() as u32;
    drop(sys);

    // Motherboard / BIOS from DMI sysfs (no root needed)
    let motherboard = {
        let board_vendor = read_sysfs("/sys/devices/virtual/dmi/id/board_vendor").unwrap_or_default();
        let board_name = read_sysfs("/sys/devices/virtual/dmi/id/board_name").unwrap_or_default();
        let combined = format!("{} {}", board_vendor.trim(), board_name.trim());
        if combined.trim().is_empty() { "N/A".to_string() } else { combined.trim().to_string() }
    };

    let bios_vendor = read_sysfs("/sys/devices/virtual/dmi/id/bios_vendor")
        .unwrap_or("N/A".to_string()).trim().to_string();

    let bios_version = read_sysfs("/sys/devices/virtual/dmi/id/bios_version")
        .unwrap_or("N/A".to_string()).trim().to_string();

    let chassis_type = read_sysfs("/sys/devices/virtual/dmi/id/chassis_type")
        .map(|s| match s.trim() {
            "3" => "Desktop",
            "8" | "9" | "10" => "Laptop",
            "17" | "23" => "Server",
            _ => "Other",
        }.to_string())
        .unwrap_or("N/A".to_string());

    let product_name = {
        let vendor = read_sysfs("/sys/devices/virtual/dmi/id/sys_vendor").unwrap_or_default();
        let product = read_sysfs("/sys/devices/virtual/dmi/id/product_name").unwrap_or_default();
        let combined = format!("{} {}", vendor.trim(), product.trim());
        if combined.trim().is_empty() { "N/A".to_string() } else { combined.trim().to_string() }
    };

    // Secure boot check via efivarfs
    let secure_boot = if std::path::Path::new("/sys/firmware/efi").exists() {
        let sb = read_sysfs("/sys/firmware/efi/efivars/SecureBoot-8be4df61-93ca-11d2-aa0d-00e098032b8c")
            .map(|_| "Enabled".to_string())
            .unwrap_or("Disabled".to_string());
        sb
    } else {
        "Legacy BIOS".to_string()
    };

    let has_info = hostname != "N/A" || motherboard != "N/A";

    SystemInfo {
        hostname, os_name, os_version, kernel, architecture,
        uptime_secs, process_count, motherboard, bios_vendor, bios_version,
        chassis_type, product_name, secure_boot, has_info,
    }
}

#[derive(Serialize, Clone)]
pub struct AudioTelemetry {
    chip: String,
    driver: String,
    state: String,
}

#[tauri::command]
fn get_audio_telemetry() -> AudioTelemetry {
    let mut chip = "N/A".to_string();
    let mut driver = "N/A".to_string();
    let state = "Active".to_string();

    let aplay = run_cmd("aplay", &["-l"]);
    for line in aplay.lines() {
        if line.starts_with("card ") {
            let parts: Vec<&str> = line.split(':').collect();
            if parts.len() > 1 {
                let name = parts[1].split('[').next().unwrap_or("").trim();
                if chip == "N/A" {
                    chip = name.to_string();
                }
            }
        }
    }
    
    if let Ok(modules) = std::fs::read_to_string("/proc/asound/modules") {
        if let Some(first) = modules.lines().next() {
            driver = first.split_whitespace().nth(1).unwrap_or("N/A").to_string();
        }
    }

    AudioTelemetry { chip, driver, state }
}

#[derive(Serialize, Clone)]
pub struct InputTelemetry {
    keyboard: String,
    mouse: String,
    usb_devices: u32,
}

#[tauri::command]
fn get_input_telemetry() -> InputTelemetry {
    let mut keyboard = "N/A".to_string();
    let mut mouse = "N/A".to_string();
    let mut usb_devices = 0;

    if let Ok(devices) = std::fs::read_to_string("/proc/bus/input/devices") {
        for block in devices.split("\n\n") {
            if block.contains("Name=") {
                let name_line = block.lines().find(|l| l.starts_with("N: Name=")).unwrap_or("");
                let name = name_line.replace("N: Name=", "").replace('\"', "");
                if block.to_lowercase().contains("keyboard") && keyboard == "N/A" {
                    keyboard = name.clone();
                }
                if (block.to_lowercase().contains("mouse") || block.to_lowercase().contains("point")) && mouse == "N/A" {
                    mouse = name;
                }
            }
        }
    }

    if let Ok(entries) = std::fs::read_dir("/sys/bus/usb/devices") {
        usb_devices = entries.count() as u32;
    }

    InputTelemetry { keyboard, mouse, usb_devices }
}

#[derive(Serialize, Clone)]
pub struct DisplayTelemetry {
    resolution: String,
}

#[tauri::command]
fn get_display_telemetry() -> DisplayTelemetry {
    let mut resolution = "N/A".to_string();
    
    // Check DRM sysfs for active resolution
    if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.join("status").exists() {
                if let Ok(status) = std::fs::read_to_string(path.join("status")) {
                    if status.trim() == "connected" {
                        if let Ok(modes) = std::fs::read_to_string(path.join("modes")) {
                            if let Some(first_mode) = modes.lines().next() {
                                resolution = first_mode.to_string();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    DisplayTelemetry { resolution }
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SysState {
            sys: Mutex::new(System::new_all()),
            last_energy_uj: Mutex::new(0u64),
            last_energy_time: Mutex::new(std::time::Instant::now()),
            cached_dimm: Mutex::new(None),
            cached_lscpu: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            get_advanced_cpu_info,
            get_cpu_telemetry,
            get_memory_telemetry,
            get_gpu_telemetry,
            get_network_telemetry,
            get_storage_telemetry,
            get_system_info,
            get_audio_telemetry,
            get_input_telemetry,
            get_display_telemetry,
            launch_external_app,
            execute_system_command,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
