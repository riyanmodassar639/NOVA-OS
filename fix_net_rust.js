const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src-tauri/src/lib.rs';
let file = fs.readFileSync(filePath, 'utf8');

file = file.replace(
    'rx_bytes = read_sysfs(&format!("/sys/class/net/{}/statistics/rx_bytes", interface))\n            .and_then(|s| s.trim().parse().ok()).unwrap_or(1000);',
    'rx_bytes = read_sysfs(&format!("/sys/class/net/{}/statistics/rx_bytes", interface))\n            .and_then(|s| s.trim().parse().ok()).unwrap_or(0);'
);
file = file.replace(
    'tx_bytes = read_sysfs(&format!("/sys/class/net/{}/statistics/tx_bytes", interface))\n            .and_then(|s| s.trim().parse().ok()).unwrap_or(1000);',
    'tx_bytes = read_sysfs(&format!("/sys/class/net/{}/statistics/tx_bytes", interface))\n            .and_then(|s| s.trim().parse().ok()).unwrap_or(0);'
);

// If link speed is 0 or -1, force to 1000. Wait, `u64` parse of `-1` fails, so it becomes 1000.
file = file.replace(
    'link_speed_mbps = read_sysfs(&format!("/sys/class/net/{}/speed", interface))\n            .and_then(|s| s.trim().parse().ok()).unwrap_or(1000);',
    'link_speed_mbps = read_sysfs(&format!("/sys/class/net/{}/speed", interface))\n            .and_then(|s| s.trim().parse().ok()).unwrap_or(1000);\n        if link_speed_mbps == 0 { link_speed_mbps = 1000; }'
);

fs.writeFileSync(filePath, file);
console.log("Fixed Rust backend networking defaults.");
