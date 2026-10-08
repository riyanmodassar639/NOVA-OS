const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src-tauri/src/lib.rs';
let file = fs.readFileSync(filePath, 'utf8');

file = file.replace(
    'let df = run_cmd("df", &["-T", "-BGB", "--output=source,fstype,size,used,avail,pcent,target"]);',
    'let df = run_cmd("df", &["-BGB", "--output=source,fstype,size,used,avail,pcent,target"]);'
);

fs.writeFileSync(filePath, file);
console.log("Fixed df command crash in get_storage_telemetry.");
