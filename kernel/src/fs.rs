use alloc::collections::BTreeMap;
use alloc::string::String;
use alloc::vec::Vec;
use spin::Mutex;
use lazy_static::lazy_static;

lazy_static! {
    pub static ref VFS: Mutex<BTreeMap<String, String>> = Mutex::new(BTreeMap::new());
}

pub fn list_files() -> Vec<String> {
    let fs = VFS.lock();
    fs.keys().cloned().collect()
}

pub fn create_file(name: &str) {
    let mut fs = VFS.lock();
    if !fs.contains_key(name) {
        fs.insert(String::from(name), String::new());
    }
}

pub fn write_file(name: &str, content: &str) -> bool {
    let mut fs = VFS.lock();
    if let Some(file) = fs.get_mut(name) {
        *file = String::from(content);
        true
    } else {
        false
    }
}

pub fn read_file(name: &str) -> Option<String> {
    let fs = VFS.lock();
    fs.get(name).cloned()
}
