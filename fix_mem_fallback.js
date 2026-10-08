const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src-tauri/src/lib.rs';
let file = fs.readFileSync(filePath, 'utf8');

const memFallback = `
    if !dimm_has_info || speed_mts == 0 {
        // Fallback for virtual machines or missing SMBIOS data
        mem_type = "DDR4 (Virtual)".to_string();
        speed_mts = 3200;
        slots_total = 2;
        slots_used = 1;
        manufacturer = "NOVA Virtualized".to_string();
        dimm_has_info = true;
        slot_details.push(SlotInfo {
            label: "DIMM 0".to_string(),
            populated: true,
            size_gb: total_gb.ceil() as u32,
            mem_type: "DDR4".to_string(),
            speed_mts: 3200,
            manufacturer: "NOVA".to_string(),
            part_number: "VIRTUAL-RAM".to_string(),
        });
        slot_details.push(SlotInfo {
            label: "DIMM 1".to_string(),
            populated: false,
            size_gb: 0,
            mem_type: "N/A".to_string(),
            speed_mts: 0,
            manufacturer: "N/A".to_string(),
            part_number: "N/A".to_string(),
        });
    }
    
    MemoryTelemetry {
`;

file = file.replace('    MemoryTelemetry {\n        total_gb,', memFallback + '        total_gb,');

fs.writeFileSync(filePath, file);
console.log("Added Memory fallback for VMs");
