use crate::fs;
use crate::{print, println};

// System Call Numbers
pub const SYS_PRINT: usize = 1;
pub const SYS_WRITE_FILE: usize = 2;
pub const SYS_CLEAR_SCREEN: usize = 3;

/// This function acts as the Kernel Boundary. 
/// In a fully hardware-isolated Ring 3 setup, apps trigger an `int 0x80` or `syscall` instruction
/// which CPU routes here. For now, apps call this to request OS services securely.
pub fn execute_syscall(id: usize, arg1: &str, arg2: &str) -> isize {
    match id {
        SYS_PRINT => {
            print!("{}", arg1);
            0
        }
        SYS_WRITE_FILE => {
            if fs::write_file(arg1, arg2) {
                0
            } else {
                -1 // Error: File not found
            }
        }
        SYS_CLEAR_SCREEN => {
            for _ in 0..25 {
                println!();
            }
            0
        }
        _ => -1, // Unknown Syscall
    }
}
