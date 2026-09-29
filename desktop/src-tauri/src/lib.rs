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
    sys.refresh_memory();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);

    let cpus = sys.cpus();
    let global_usage = sys.global_cpu_usage();
    let per_core_usage: Vec<f32> = cpus.iter().map(|c| c.cpu_usage()).collect();
    let logical_cores = cpus.len() as u32;
    let physical_cores = sys.physical_core_count().unwrap_or(logical_cores as usize) as u32;
    let threads_per_core = if physical_cores > 0 { logical_cores / physical_cores } else { 1 };
    let base_clock_mhz = cpus.first().map(|c| c.frequency() as f32).unwrap_or(0.0);
    let model_name = cpus.first().map(|c| c.brand().to_string()).unwrap_or_default();
    let vendor = cpus.first().map(|c| c.vendor_id().to_string()).unwrap_or_default();

    let process_count = sys.processes().len() as u32;
    let thread_count = sys.processes().values()
        .map(|p| p.tasks().map(|t| t.len()).unwrap_or(1) as u32)
        .sum::<u32>().max(process_count);

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

    // lscpu enrichment (Linux only)
    let lscpu = get_lscpu_map();
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

// ─── Entry Point ─────────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SysState {
            sys: Mutex::new(System::new_all()),
            last_energy_uj: Mutex::new(0u64),
            last_energy_time: Mutex::new(std::time::Instant::now()),
        })
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            get_advanced_cpu_info,
            get_cpu_telemetry,
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
