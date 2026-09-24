#![no_std]
#![feature(abi_x86_interrupt)]

extern crate alloc;

pub mod vga_buffer;
pub mod interrupts;
pub mod memory;
pub mod allocator;
pub mod task;
pub mod shell;
pub mod fs;
pub mod syscall;
pub mod userspace;

pub fn init() {
    interrupts::init_idt();
    unsafe { interrupts::PICS.lock().initialize() };
    x86_64::instructions::interrupts::enable();
}

pub fn hlt_loop() -> ! {
    loop {
        x86_64::instructions::hlt();
    }
}
