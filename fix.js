const fs = require('fs');
const file = 'd:/NOVA/desktop/src/components/desktop/HUD/GlobalCommandDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{SectionHeader\(\{ icon: (Cpu|MemoryStick), title: "([^"]+)", color: "([^"]+)", appId: "([^"]+)", appLabel: "([^"]+)" \}\)\}/g, 
  '<SectionHeader icon={$1} title="$2" color="$3" appId="$4" appLabel="$5" onOpenSubApp={onOpenSubApp} />');

content = content.replace(/<SectionHeader icon=\{([^}]+)\} title="([^"]+)" color="([^"]+)" appId="([^"]+)" appLabel="([^"]+)" \/>/g, 
  '<SectionHeader icon={$1} title="$2" color="$3" appId="$4" appLabel="$5" onOpenSubApp={onOpenSubApp} />');

fs.writeFileSync(file, content);
