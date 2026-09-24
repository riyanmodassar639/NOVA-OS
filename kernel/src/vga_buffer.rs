use bootloader_api::info::{FrameBufferInfo, PixelFormat};
use spin::Mutex;
use font8x8::UnicodeFonts;
use core::fmt;

pub struct Writer {
    framebuffer: &'static mut [u8],
    pub info: FrameBufferInfo,
    x_pos: usize,
    y_pos: usize,
}

pub static WRITER: Mutex<Option<Writer>> = Mutex::new(None);

impl Writer {
    pub fn new(framebuffer: &'static mut [u8], info: FrameBufferInfo) -> Self {
        Writer {
            framebuffer,
            info,
            x_pos: 0,
            y_pos: 0,
        }
    }

    pub fn draw_pixel(&mut self, x: usize, y: usize, r: u8, g: u8, b: u8) {
        if x >= self.info.width || y >= self.info.height {
            return;
        }

        let pixel_offset = y * self.info.stride + x;
        let color = match self.info.pixel_format {
            PixelFormat::Rgb => [r, g, b, 0],
            PixelFormat::Bgr => [b, g, r, 0],
            PixelFormat::U8 => [if r > 128 { 255 } else { 0 }, 0, 0, 0],
            _ => [r, g, b, 0],
        };

        let bytes_per_pixel = self.info.bytes_per_pixel;
        let byte_offset = pixel_offset * bytes_per_pixel;
        
        if byte_offset + bytes_per_pixel <= self.framebuffer.len() {
            self.framebuffer[byte_offset..(byte_offset + bytes_per_pixel)]
                .copy_from_slice(&color[..bytes_per_pixel]);
        }
    }

    // Read the blue channel of a pixel (used for halo threshold checks)
    pub fn get_pixel_r(&self, x: usize, y: usize) -> u8 {
        if x >= self.info.width || y >= self.info.height { return 0; }
        let pixel_offset = y * self.info.stride + x;
        let byte_offset = pixel_offset * self.info.bytes_per_pixel;
        if byte_offset + 2 < self.framebuffer.len() {
            self.framebuffer[byte_offset + 2] // Blue channel
        } else {
            0
        }
    }

    pub fn clear(&mut self) {
        for byte in self.framebuffer.iter_mut() {
            *byte = 0;
        }
        self.x_pos = 0;
        self.y_pos = 0;
    }

    pub fn write_char_at(&mut self, x: usize, y: usize, byte: u8, r: u8, g: u8, b: u8) {
        let bitmap = match font8x8::BASIC_FONTS.get(byte as char) {
            Some(glyph) => glyph,
            None => [0; 8],
        };

        // Scale font x2 for readability on high-res screen
        let scale = 2;

        for (row, row_byte) in bitmap.iter().enumerate() {
            for col in 0..8 {
                if (row_byte >> col) & 1 == 1 {
                    for dy in 0..scale {
                        for dx in 0..scale {
                            self.draw_pixel(x + col * scale + dx, y + row * scale + dy, r, g, b);
                        }
                    }
                }
            }
        }
    }

    pub fn write_char_small(&mut self, x: usize, y: usize, byte: u8, r: u8, g: u8, b: u8) {
        let bitmap = match font8x8::BASIC_FONTS.get(byte as char) {
            Some(glyph) => glyph,
            None => [0; 8],
        };

        for (row, row_byte) in bitmap.iter().enumerate() {
            for col in 0..8 {
                if (row_byte >> col) & 1 == 1 {
                    self.draw_pixel(x + col, y + row, r, g, b);
                }
            }
        }
    }

    pub fn write_byte(&mut self, byte: u8) {
        let char_w = 8 * 2; // scaled x2
        let char_h = 8 * 2;

        match byte {
            b'\n' => {
                self.y_pos += char_h;
                self.x_pos = 0;
            }
            b'\x08' => { // Backspace
                if self.x_pos >= char_w {
                    self.x_pos -= char_w;
                } else if self.y_pos >= char_h {
                    self.y_pos -= char_h;
                    self.x_pos = self.info.width - char_w;
                }
                self.write_char_at(self.x_pos, self.y_pos, b' ', 0, 0, 0);
            }
            b => {
                if self.x_pos >= self.info.width {
                    self.y_pos += char_h;
                    self.x_pos = 0;
                }
                self.write_char_at(self.x_pos, self.y_pos, b, 255, 255, 255);
                self.x_pos += char_w;
            }
        }
    }

    pub fn write_string(&mut self, s: &str) {
        for byte in s.bytes() {
            self.write_byte(byte);
        }
    }
}

impl fmt::Write for Writer {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.write_string(s);
        Ok(())
    }
}

#[macro_export]
macro_rules! print {
    ($($arg:tt)*) => ($crate::vga_buffer::_print(format_args!($($arg)*)));
}

#[macro_export]
macro_rules! println {
    () => ($crate::print!("\n"));
    ($($arg:tt)*) => ($crate::print!("{}\n", format_args!($($arg)*)));
}

#[doc(hidden)]
pub fn _print(args: fmt::Arguments) {
    use core::fmt::Write;
    use x86_64::instructions::interrupts;
    interrupts::without_interrupts(|| {
        if let Some(writer) = WRITER.lock().as_mut() {
            writer.write_fmt(args).unwrap();
        }
    });
}
