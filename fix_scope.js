const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src/components/desktop/HUD/SystemDetailView.tsx';
let file = fs.readFileSync(filePath, 'utf8');

// remove from sys_graphics block
file = file.replace('const [gpuData, setGpuData] = useState<any>(null);\n  const [netData, setNetData] = useState<any>(null);', 'const [gpuData, setGpuData] = useState<any>(null);');

// add to sys_network block
file = file.replace(
  '  if (type === "sys_network") {\n    const c = "150,100,255";\n    const n = netData;',
  '  if (type === "sys_network") {\n    const c = "150,100,255";\n    const [netData, setNetData] = useState<any>(null);\n    const n = netData;'
);

fs.writeFileSync(filePath, file);
console.log("Fixed netData scope");
