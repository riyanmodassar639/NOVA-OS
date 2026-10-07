const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src/components/desktop/HUD/SystemDetailView.tsx';
let file = fs.readFileSync(filePath, 'utf8');

// 1. Add state variable at top
if (!file.includes('const [netData, setNetData]')) {
  file = file.replace(
    'const [gpuData, setGpuData] = useState<any>(null);',
    'const [gpuData, setGpuData] = useState<any>(null);\n  const [netData, setNetData] = useState<any>(null);'
  );
}

// 2. Replace the sys_network block entirely
const startMarker = '  // ===================== NETWORK =====================\n  if (type === "sys_network") {';
const fallbackMarker = '  // ===================== NETWORK =====================\r\n  if (type === "sys_network") {';

let startIndex = file.indexOf(startMarker);
if (startIndex === -1) {
  startIndex = file.indexOf(fallbackMarker);
}

const endMarker = '  // ===================== STORAGE =====================';
let endIndex = file.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find NETWORK block boundaries!");
  process.exit(1);
}

const newNetwork = `  // ===================== NETWORK =====================
  if (type === "sys_network") {
    const c = "150,100,255";
    const n = netData;
    const txVal = n ? (n.tx_bytes / 1e6).toFixed(2) : graphs.a[graphs.a.length - 1];
    const rxVal = n ? (n.rx_bytes / 1e6).toFixed(2) : graphs.b[graphs.b.length - 1];

    useEffect(() => {
      let alive = true;
      const poll = async () => {
        try {
          const n: any = await invoke('get_network_telemetry');
          if (!alive) return;
          setNetData(n);
        } catch (_) {}
      };
      poll();
      const iv = setInterval(poll, 2000);
      return () => { alive = false; clearInterval(iv); };
    }, []);

    const isConnected = n?.has_info && n?.ipv4 !== "N/A";
    const interfaceName = n?.interface || "N/A";

    // Deduce connection type from interface
    let connType = "Unknown";
    let iconLabel = "Hyper-Uplink";
    if (interfaceName.startsWith("wlan") || interfaceName.startsWith("wlp")) {
      connType = "Wi-Fi";
      iconLabel = "Wireless Adapter";
    } else if (interfaceName.startsWith("eth") || interfaceName.startsWith("en")) {
      connType = "Ethernet";
      iconLabel = "Wired Adapter";
    }

    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top left, rgba(20,0,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1px solid rgba(\${c},0.3)\`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Radio size={28} style={{ color: \`rgb(\${c})\`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: \`rgb(\${c})\` }}>NETWORK STACK</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>{interfaceName.toUpperCase()} // UPLINK DIAGNOSTICS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label={isConnected ? "CONNECTED" : "DISCONNECTED"} active={isConnected} color={c} />
            <StatusBadge label={connType.toUpperCase()} active={true} color={c} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <MiniGraph data={graphs.a} color={c} label={\`UPLINK (TX) — \${txVal} MB\`} height={100} suffix=" MB" />
          <MiniGraph data={graphs.b} color="200,150,255" label={\`DOWNLINK (RX) — \${rxVal} MB\`} height={100} suffix=" MB" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Radio} label="LINK IDENTITY" color={c} />
            <InfoRow label="Adapter Name" value={iconLabel} color={c} status="ok" />
            <InfoRow label="Interface" value={interfaceName} color={c} />
            <InfoRow label="Connection Type" value={connType} color={c} />
            <InfoRow label="Link Speed" value={n?.link_speed_mbps > 0 ? \`\${n.link_speed_mbps} Mbps\` : "N/A"} color={c} />
            <InfoRow label="MAC Address" value={n?.mac || "N/A"} color={c} />
            <InfoRow label="Duplex Mode" value={n?.link_speed_mbps > 0 ? "Full Duplex" : "N/A"} color={c} />
            <InfoRow label="Protocol" value={connType === "Wi-Fi" ? "802.11" : "802.3 Ethernet"} color={c} />
            <InfoRow label="State" value={isConnected ? "UP" : "DOWN"} color={c} status={isConnected ? "ok" : "warn"} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Globe} label="IP & ROUTING" color={c} />
            <InfoRow label="IPv4 Address" value={n?.ipv4 || "N/A"} color={c} status={n?.ipv4 && n.ipv4 !== "N/A" ? "ok" : "warn"} />
            <InfoRow label="IPv6 Address" value={n?.ipv6 || "N/A"} color={c} />
            <InfoRow label="Default Gateway" value={n?.gateway || "N/A"} color={c} />
            <InfoRow label="DNS Server" value={n?.dns || "N/A"} color={c} />
            <InfoRow label="Subnet" value={n?.ipv4 && n.ipv4 !== "N/A" ? "Detected" : "N/A"} color={c} />
            <InfoRow label="Routing" value={n?.gateway && n.gateway !== "N/A" ? "Active" : "None"} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={ShieldCheck} label="TRAFFIC STATISTICS" color={c} />
            <InfoRow label="Total TX" value={n ? \`\${(n.tx_bytes / 1e6).toFixed(2)} MB\` : "N/A"} color={c} />
            <InfoRow label="Total RX" value={n ? \`\${(n.rx_bytes / 1e6).toFixed(2)} MB\` : "N/A"} color={c} />
            <InfoRow label="Security" value="WPA2/WPA3 / 802.1x" color={c} />
            <InfoRow label="Firewall" value="Active (ufw/iptables)" color={c} status="ok" />
          </Panel>
        </div>
      </div>
    );
  }
\n`;

file = file.substring(0, startIndex) + newNetwork + file.substring(endIndex);
fs.writeFileSync(filePath, file);
console.log("Successfully updated Network Deep Scan block.");
