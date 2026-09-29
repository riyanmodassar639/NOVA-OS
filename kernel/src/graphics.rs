use crate::vga_buffer::WRITER;
use libm::{sin, cos};

pub fn draw_circle(x0: isize, y0: isize, radius: isize, r: u8, g: u8, b: u8) {
    let mut x = radius - 1;
    let mut y = 0;
    let mut dx = 1;
    let mut dy = 1;
    let mut err = dx - (radius << 1);

    while x >= y {
        draw_pixel(x0 + x, y0 + y, r, g, b);
        draw_pixel(x0 + y, y0 + x, r, g, b);
        draw_pixel(x0 - y, y0 + x, r, g, b);
        draw_pixel(x0 - x, y0 + y, r, g, b);
        draw_pixel(x0 - x, y0 - y, r, g, b);
        draw_pixel(x0 - y, y0 - x, r, g, b);
        draw_pixel(x0 + y, y0 - x, r, g, b);
        draw_pixel(x0 + x, y0 - y, r, g, b);

        if err <= 0 {
            y += 1;
            err += dy;
            dy += 2;
        }
        if err > 0 {
            x -= 1;
            dx += 2;
            err += dx - (radius << 1);
        }
    }
}

pub fn draw_arc(x0: isize, y0: isize, radius: isize, start_angle: f64, end_angle: f64, thickness: isize, r: u8, g: u8, b: u8) {
    for t in 0..thickness {
        let current_radius = radius - t;
        if current_radius < 0 { break; }
        let mut angle = start_angle;
        let step = 1.0 / (current_radius as f64); // Smoothness

        while angle <= end_angle {
            let px = x0 as f64 + (current_radius as f64) * cos(angle);
            let py = y0 as f64 + (current_radius as f64) * sin(angle);
            draw_pixel(px as isize, py as isize, r, g, b);
            angle += step;
        }
    }
}

pub fn draw_pixel(x: isize, y: isize, r: u8, g: u8, b: u8) {
    if x < 0 || y < 0 { return; }
    if let Some(mut writer) = WRITER.lock().as_mut() {
        writer.draw_pixel(x as usize, y as usize, r, g, b);
    }
}

pub fn clear_screen() {
    if let Some(mut writer) = WRITER.lock().as_mut() {
        writer.clear();
    }
}
