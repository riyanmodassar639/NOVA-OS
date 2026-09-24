use crate::syscall::{execute_syscall, SYS_PRINT, SYS_WRITE_FILE, SYS_CLEAR_SCREEN};

/// This module simulates an external application (e.g. loaded from disk).
/// Notice that it DOES NOT import `vga_buffer` or `fs` directly. 
/// It can only communicate with the hardware via System Calls.

pub fn run_hello_app() {
    execute_syscall(SYS_CLEAR_SCREEN, "", "");
    execute_syscall(SYS_PRINT, "=================================\n", "");
    execute_syscall(SYS_PRINT, "   WELCOME TO USERSPACE APP!     \n", "");
    execute_syscall(SYS_PRINT, "=================================\n\n", "");
    
    execute_syscall(SYS_PRINT, "[App] Requesting OS to save data...\n", "");
    
    // The app requests the OS to save data
    let status = execute_syscall(SYS_WRITE_FILE, "kaalu.txt", "Data saved securely by Userspace App!");
    
    if status == 0 {
        execute_syscall(SYS_PRINT, "[App] OS successfully saved the file.\n", "");
    } else {
        execute_syscall(SYS_PRINT, "[App] OS refused to save file (Touch it first!).\n", "");
    }
    
    execute_syscall(SYS_PRINT, "\n[App] Exiting returning control to Shell...\n\n", "");
}
