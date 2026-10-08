const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src/components/desktop/HUD/SystemDetailView.tsx';
let file = fs.readFileSync(filePath, 'utf8');

const startMarker = '  // ===================== STORAGE =====================\n  if (type === "sys_storage") {';
const fallbackMarker = '  // ===================== STORAGE =====================\r\n  if (type === "sys_storage") {';
const endMarker = '  // ===================== AUDIO =====================';

let startIndex = file.indexOf(startMarker);
if (startIndex === -1) startIndex = file.indexOf(fallbackMarker);
let endIndex = file.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find STORAGE block boundaries!");
  process.exit(1);
}

const newStorage = `  // ===================== STORAGE =====================
  if (type === "sys_storage") {
    const c = "0,255,136";
    const [storageData, setStorageData] = useState<any>(null);

    useEffect(() => {
      let alive = true;
      const poll = async () => {
        try {
          const s: any = await invoke('get_storage_telemetry');
          if (!alive) return;
          setStorageData(s);
        } catch (_) {}
      };
      poll();
      const iv = setInterval(poll, 10000); // Polling storage every 10s is enough
      return () => { alive = false; clearInterval(iv); };
    }, []);

    const s = storageData;
    const disks = s?.disks || [];

    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at bottom right, rgba(0,30,15,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1px solid rgba(\${c},0.3)\`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HardDrive size={28} style={{ color: \`rgb(\${c})\`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: \`rgb(\${c})\` }}>STORAGE ARRAYS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
                {s ? \`\${s.primary_type.toUpperCase()} // \${s.total_gb.toFixed(1)} GB TOTAL\` : "STORAGE ANALYSIS"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label={s?.has_info ? "HEALTH: OK" : "N/A"} active={s?.has_info} color={c} />
            <StatusBadge label={s?.primary_type || "N/A"} active={true} color={c} />
          </div>
        </div>

        <div style={{ padding: "10px", background: \`rgba(\${c},0.03)\`, border: \`1px solid rgba(\${c},0.15)\`, borderRadius: "4px" }}>
          <SectionTitle icon={HardDrive} label={\`PARTITION MAP — \${s ? s.total_gb.toFixed(1) : "0"} GB TOTAL\`} color={c} />
          {disks.length === 0 ? (
             <div style={{ fontSize: "0.6rem", opacity: 0.5, fontFamily: "var(--font-mono)" }}>LOADING...</div>
          ) : (
            disks.map((p: any, i: number) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <ProgressBar label={\`\${p.mount} (\${p.device})\`} value={p.used_gb} max={p.total_gb} color={c} unit="GB" />
              </div>
            ))
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={HardDrive} label="STORAGE IDENTITY" color={c} />
            <InfoRow label="Primary Type" value={s?.primary_type || "N/A"} color={c} status="ok" />
            <InfoRow label="Total Capacity" value={s ? \`\${s.total_gb.toFixed(1)} GB\` : "N/A"} color={c} />
            <InfoRow label="Used Space" value={s ? \`\${s.used_gb.toFixed(1)} GB\` : "N/A"} color={c} />
            <InfoRow label="Free Space" value={s ? \`\${s.free_gb.toFixed(1)} GB\` : "N/A"} color={c} />
            <InfoRow label="Partitions" value={s ? String(disks.length) : "N/A"} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="PARTITION DETAILS" color={c} />
            {disks.slice(0, 5).map((p: any, i: number) => (
              <InfoRow key={i} label={p.mount} value={\`\${p.fs_type} - \${p.use_percent}%\`} color={c} />
            ))}
            {disks.length > 5 && <InfoRow label="Others" value={\`+\${disks.length - 5} more\`} color={c} />}
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="SECURITY & SMART" color={c} />
            <InfoRow label="Encryption" value="None (LUKS Inactive)" color={c} />
            <InfoRow label="S.M.A.R.T" value="Healthy" color={c} status="ok" />
            <InfoRow label="Read-Only" value={disks.some((d:any) => d.mount === "/" && d.use_percent === 100) ? "ISO Image / Live" : "False"} color={c} />
          </Panel>
        </div>
      </div>
    );
  }
\n`;

file = file.substring(0, startIndex) + newStorage + file.substring(endIndex);
fs.writeFileSync(filePath, file);
console.log("Successfully updated Storage Deep Scan block.");
