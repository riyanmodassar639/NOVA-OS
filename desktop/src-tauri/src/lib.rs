use serde::{Serialize, Deserialize};
use std::process::Command;
use sysinfo::{System, Networks};
use std::sync::Mutex;

#[derive(Serialize)]
pub struct SystemStats {
    cpu_usage: f32,
    memory_total: u64,
    memory_used: u64,
    battery: String,
    temperature: String,
}

struct SysState {
    sys: Mutex<System>,
}

#[tauri::command]
fn get_system_stats(state: tauri::State<SysState>) -> SystemStats {
    let mut sys = state.sys.lock().unwrap();
    sys.refresh_cpu_usage();
    sys.refresh_memory();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();

    SystemStats {
        cpu_usage,
        memory_total,
        memory_used,
        battery: "100%".to_string(), // Can be improved with battery crate later
        temperature: "42°C".to_string(),
    }
}

#[tauri::command]
fn launch_external_app(app_id: &str) -> Result<String, String> {
    // Basic mapping of app_id to a linux binary
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(SysState { sys: Mutex::new(System::new_all()) })
    .invoke_handler(tauri::generate_handler![
        get_system_stats,
        launch_external_app,
        execute_system_command
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
