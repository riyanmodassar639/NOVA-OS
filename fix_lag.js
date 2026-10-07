const fs = require('fs');

function removeGlow(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace vector dropshadows with simple stroke/fill tweaks to save GPU cycles
        content = content.replace(/style={{ filter: `drop-shadow\(0 0 5px rgb\(\${color}\)\)` }}/g, '');
        content = content.replace(/style={{ filter: `drop-shadow\(0 0 8px rgb\(\${color}\)\)` }}/g, '');
        content = content.replace(/filter: `drop-shadow\(0 0 [0-9]+px rgb\(\${[a-zA-Z]+}\)\)`/g, 'opacity: 1');
        fs.writeFileSync(filePath, content);
    }
}

removeGlow('/mnt/d/NOVA/desktop/src/components/desktop/HUD/GlobalCommandDashboard.tsx');
removeGlow('/mnt/d/NOVA/desktop/src/components/desktop/HUD/SystemDetailView.tsx');
console.log("Removed heavy SVG drop-shadows");
