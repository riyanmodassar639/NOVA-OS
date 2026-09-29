use crate::graphics::{draw_circle, draw_arc, clear_screen, draw_pixel};

pub fn play_animation() {
    clear_screen();
    
    // We don't have a timer/interrupt for async animation yet in the main loop before shell.
    // So we will just draw the final "Booted" state of the ring for now.
    
    // Screen dimensions (assuming 1024x768 for now, VESA default)
    let cx = 1024 / 2;
    let cy = 768 / 2;

    // Draw Central Core (The "NOVA" Ring)
    // 1. Outer faint glow ring
    draw_circle(cx, cy, 150, 0, 100, 150);
    
    // 2. Main bright cyan ring
    draw_circle(cx, cy, 140, 0, 229, 255);
    draw_circle(cx, cy, 141, 0, 229, 255);
    draw_circle(cx, cy, 139, 0, 229, 255);

    // 3. Inner animated arcs (we'll just draw them static for now)
    draw_arc(cx, cy, 120, 0.0, 3.14 / 2.0, 5, 0, 255, 255);
    draw_arc(cx, cy, 120, 3.14, 3.14 + (3.14 / 2.0), 5, 0, 255, 255);

    // 4. "Particles" - randomly scattered pixels in the center
    // We'll just draw a few fixed "particles"
    draw_pixel(cx + 20, cy + 30, 0, 255, 255);
    draw_pixel(cx - 40, cy + 10, 0, 255, 255);
    draw_pixel(cx + 10, cy - 50, 0, 255, 255);
    draw_pixel(cx - 60, cy - 20, 0, 255, 255);
    draw_pixel(cx + 50, cy - 10, 0, 255, 255);
    
    // 5. Draw "NOVA" Text (using pixels or simple shapes since we don't have font rendering in graphics.rs yet)
    // N
    for y in (cy - 20)..(cy + 20) { draw_pixel(cx - 60, y, 255, 255, 255); draw_pixel(cx - 40, y, 255, 255, 255); }
    for i in 0..20 { draw_pixel(cx - 60 + i, cy - 20 + (i * 2), 255, 255, 255); }
    
    // O
    draw_circle(cx - 10, cy, 20, 255, 255, 255);
    
    // V
    for i in 0..20 { 
        draw_pixel(cx + 20 + i, cy - 20 + (i * 2), 255, 255, 255); 
        draw_pixel(cx + 60 - i, cy - 20 + (i * 2), 255, 255, 255); 
    }
    
    // A
    for y in (cy - 10)..(cy + 20) { draw_pixel(cx + 80, y, 255, 255, 255); draw_pixel(cx + 100, y, 255, 255, 255); }
    for x in (cx + 80)..(cx + 100) { draw_pixel(x, cy - 20, 255, 255, 255); draw_pixel(x, cy, 255, 255, 255); }

    // Simulate a brief delay to show the boot screen before the shell starts
    for _ in 0..50_000_000 {
        unsafe { core::arch::asm!("nop"); }
    }
    
    // Clear screen before shell starts
    clear_screen();
}
