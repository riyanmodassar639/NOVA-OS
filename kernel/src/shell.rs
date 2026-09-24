use alloc::string::String;
use futures_util::stream::StreamExt;
use pc_keyboard::{layouts, DecodedKey, HandleControl, Keyboard, ScancodeSet1};
use crate::{print, println, task::keyboard::ScancodeStream};

pub async fn run() {
    let mut scancodes = ScancodeStream::new();
    let mut keyboard = Keyboard::new(ScancodeSet1::new(), layouts::Us104Key, HandleControl::Ignore);
    let mut command_buffer = String::new();

    while let Some(scancode) = scancodes.next().await {
        if let Ok(Some(key_event)) = keyboard.add_byte(scancode) {
            if let Some(key) = keyboard.process_keyevent(key_event) {
                match key {
                    DecodedKey::Unicode(character) => {
                        if character == '\n' {
                            println!();
                            execute_command(&command_buffer);
                            command_buffer.clear();
                            print!("nova> ");
                        } else if character == '\x08' {
                            // Backspace
                            if command_buffer.pop().is_some() {
                                print!("\x08");
                            }
                        } else if character >= ' ' && character <= '~' {
                            command_buffer.push(character);
                            print!("{}", character);
                        }
                    }
                    DecodedKey::RawKey(_) => {}
                }
            }
        }
    }
}

fn execute_command(cmd: &str) {
    let cmd = cmd.trim();
    if cmd.is_empty() {
        return;
    }

    let mut parts = cmd.splitn(2, ' ');
    let command = parts.next().unwrap_or("");
    let args = parts.next().unwrap_or("");

    match command {
        "help" => println!("Available commands: help, echo, version, clear, ls, touch, write, cat, run"),
        "version" => println!("NOVA OS Version 0.06 (Graphics Ready)"),
        "clear" => {
            if let Some(writer) = crate::vga_buffer::WRITER.lock().as_mut() {
                writer.clear();
            }
        },
        "echo" => println!("{}", args),

        "run" => {
            if args == "hello" {
                crate::userspace::run_hello_app();
            } else {
                println!("App '{}' not found. Try: 'run hello'", args);
            }
        },
        "ls" => {
            let files = crate::fs::list_files();
            if files.is_empty() {
                println!("No files.");
            } else {
                for file in files {
                    print!("{}  ", file);
                }
                println!();
            }
        }
        "touch" => {
            if args.is_empty() {
                println!("Usage: touch <filename>");
            } else {
                crate::fs::create_file(args);
                println!("File '{}' created.", args);
            }
        }
        "write" => {
            let mut args_parts = args.splitn(2, ' ');
            let filename = args_parts.next().unwrap_or("");
            let content = args_parts.next().unwrap_or("");
            if filename.is_empty() {
                println!("Usage: write <filename> <content>");
            } else if crate::fs::write_file(filename, content) {
                println!("Written to '{}'.", filename);
            } else {
                println!("File '{}' not found. Use 'touch' first.", filename);
            }
        }
        "cat" => {
            if args.is_empty() {
                println!("Usage: cat <filename>");
            } else if let Some(content) = crate::fs::read_file(args) {
                println!("{}", content);
            } else {
                println!("File '{}' not found.", args);
            }
        }
        _ => println!("Unknown command: '{}'. Type 'help' for a list of commands.", command),
    }
}
