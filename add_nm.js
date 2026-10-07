const fs = require('fs');
const filePath = '/mnt/d/NOVA/create_iso.sh';
let content = fs.readFileSync(filePath, 'utf8');
if (!content.includes('network-manager')) {
    content = content.replace('xserver-xorg\n', 'xserver-xorg\nnetwork-manager\n');
    fs.writeFileSync(filePath, content);
    console.log("Added network-manager to create_iso.sh");
} else {
    console.log("network-manager already in create_iso.sh");
}
