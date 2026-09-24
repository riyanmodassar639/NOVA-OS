use std::path::Path;
use bootloader::BiosBoot;

fn main() {
    let kernel_path = std::env::args().nth(1).expect("No kernel path given");
    let kernel_path = Path::new(&kernel_path);
    let out_dir = std::env::current_dir().unwrap().join("target");
    std::fs::create_dir_all(&out_dir).unwrap();
    let out_path = out_dir.join("nova_os.img");

    let mut boot = BiosBoot::new(kernel_path);
    boot.create_disk_image(&out_path).unwrap();

    println!("Created disk image at {}", out_path.display());
}
