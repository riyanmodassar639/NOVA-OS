const fs = require('fs');
const f = fs.readFileSync('/mnt/d/NOVA/desktop/src/components/desktop/HUD/SystemDetailView.tsx', 'utf8');
const start = f.indexOf('if (type === "sys_storage")');
console.log(f.substring(start, start + 3500));
