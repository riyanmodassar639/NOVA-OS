#![no_std]
#![no_main]

extern crate alloc;

use core::panic::PanicInfo;
use bootloader_api::{entry_point, info::BootInfo};
use nova_kernel::{println, print, memory, allocator};
use alloc::{boxed::Box, vec, vec::Vec, rc::Rc};
use x86_64::VirtAddr;

pub static BOOTLOADER_CONFIG: bootloader_api::BootloaderConfig = {
    let mut config = bootloader_api::BootloaderConfig::new_default();
    config.mappings.physical_memory = Some(bootloader_api::config::Mapping::Dynamic);
    config
};

entry_point!(kernel_main, config = &BOOTLOADER_CONFIG);

fn kernel_main(boot_info: &'static mut BootInfo) -> ! {
    // Initialize High-Res Pixel Renderer
    if let Some(framebuffer) = boot_info.framebuffer.as_mut() {
        let info = framebuffer.info();
        let fb_slice = framebuffer.buffer_mut();
        
        let writer = nova_kernel::vga_buffer::Writer::new(fb_slice, info);
        *nova_kernel::vga_buffer::WRITER.lock() = Some(writer);
    }
    
    // Core hardware init (IDT, GDT, PIC)
    nova_kernel::init();

    let phys_offset = boot_info.physical_memory_offset.into_option().unwrap();
    let phys_mem_offset = VirtAddr::new(phys_offset);
    let mut mapper = unsafe { memory::init(phys_mem_offset) };
    let mut frame_allocator = unsafe {
        memory::BootInfoFrameAllocator::init(&boot_info.memory_regions)
    };

    allocator::init_heap(&mut mapper, &mut frame_allocator)
        .expect("Heap initialization failed");

    // Test Heap Allocation (we won't print this directly to screen while loading)
    let _heap_value = Box::new(42);
    let mut _vec = Vec::new();
    for i in 0..5 {
        _vec.push(i);
    }

    println!("NOVA OS Kernel");
    println!("Version 0.07 (High-Res Framebuffer Ready)\n");
    println!("Starting NOVA OS Task Scheduler...");
    let mut executor = nova_kernel::task::executor::Executor::new();
    executor.spawn(nova_kernel::task::Task::new(nova_kernel::shell::run()));

    print!("nova> ");
    executor.run();
}

#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    println!("{}", info);
    nova_kernel::hlt_loop();
}
