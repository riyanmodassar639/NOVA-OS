const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src/components/desktop/HUD/SystemDetailView.tsx';
let file = fs.readFileSync(filePath, 'utf8');

const oldGraphicsStartMarker = '  // ===================== GPU =====================\r\n  if (type === "sys_graphics") {';
const oldGraphicsStartMarkerFallback = '  // ===================== GPU =====================\n  if (type === "sys_graphics") {';

let startIndex = file.indexOf(oldGraphicsStartMarker);
if (startIndex === -1) {
  startIndex = file.indexOf(oldGraphicsStartMarkerFallback);
}

const oldGraphicsEndMarker = '  // ===================== NETWORK =====================';
const endIndex = file.indexOf(oldGraphicsEndMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers!");
  process.exit(1);
}

const newGraphics = `  // ===================== GPU =====================
  if (type === "sys_graphics") {
    const c = "255,136,0";
    const [gpuData, setGpuData] = useState<any>(null);

    useEffect(() => {
      let alive = true;
      const poll = async () => {
        try {
          const g: any = await invoke('get_gpu_telemetry');
          if (!alive) return;
          setGpuData(g);
        } catch (_) {}
      };
      poll();
      const iv = setInterval(poll, 2000);
      return () => { alive = false; clearInterval(iv); };
    }, []);

    const g = gpuData;
    const gpuLoad = g ? g.usage_percent : graphs.a[graphs.a.length - 1];
    const gpuTemp = g && g.temp_c > 0 ? g.temp_c : graphs.b[graphs.b.length - 1];

    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at bottom left, rgba(40,20,0,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1px solid rgba(\${c},0.3)\`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Monitor size={28} style={{ color: \`rgb(\${c})\`, filter: \`drop-shadow(0 0 8px rgb(\${c}))\` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: \`rgb(\${c})\` }}>GRAPHICS ENGINE</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>{g?.name?.toUpperCase() || "GPU PIPELINE ANALYSIS"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="RENDERING" active={true} color={c} />
            <StatusBadge label={\`TEMP: \${gpuTemp.toFixed(1)}°C\`} active={gpuTemp < 85} color={c} />
            <StatusBadge label={g?.opengl || "DX13.5 READY"} active={true} color={c} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MiniGraph data={graphs.a} color={c} label="GPU COMPUTE UTILIZATION" height={90} />
            <MiniGraph data={graphs.b} color="255,80,80" label="GPU TEMPERATURE (°C)" height={60} suffix="°C" />
            <MiniGraph data={graphs.c} color="255,200,0" label="VRAM BANDWIDTH (GB/s)" height={60} suffix=" GB/s" />
          </div>
          <div style={{ background: \`rgba(\${c},0.03)\`, border: \`1px solid rgba(\${c},0.15)\`, borderRadius: "4px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <SectionTitle icon={Monitor} label="RENDER PIPELINE" color={c} />
            <ProgressBar label="3D ENGINE" value={gpuLoad} color={c} />
            <ProgressBar label="VIDEO ENCODE" value={Math.floor(gpuLoad * 0.4)} color={c} />
            <ProgressBar label="VRAM USAGE" value={g?.vram_mb || 18} max={g?.vram_total_mb || 32} color={c} unit=" MB" />
            <ProgressBar label="RT PIPELINE" value={Math.floor(gpuLoad * 0.7)} color={c} />
            <ProgressBar label="TENSOR (AI)" value={Math.floor(gpuLoad * 0.3)} color={c} />
            <ProgressBar label="COPY ENGINE" value={Math.floor(gpuLoad * 0.2)} color={c} />
            <div style={{ marginTop: "4px" }}>
              <SectionTitle icon={Thermometer} label="POWER & THERMAL" color={c} />
              <InfoRow label="Core Temp" value={\`\${gpuTemp.toFixed(1)}°C\`} color={c} status={gpuTemp < 80 ? "ok" : "warn"} />
              <InfoRow label="Hotspot" value={\`\${(gpuTemp + 8).toFixed(1)}°C\`} color={c} />
              <InfoRow label="TGP" value={\`\${g?.power_w > 0 ? g.power_w.toFixed(1) : Math.floor(gpuLoad * 4 + 100)} W\`} color={c} />
              <InfoRow label="Fan Speed" value={\`\${Math.floor(gpuLoad * 12 + 800)} RPM\`} color={c} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Monitor} label="SILICON SPECS" color={c} />
            <InfoRow label="GPU Model" value={g?.name || "Holo-GPU"} color={c} status="ok" />
            <InfoRow label="Vendor" value={g?.vendor || "NOVA"} color={c} />
            <InfoRow label="PCI Slot" value={g?.pci_slot || "00:00.0"} color={c} />
            <InfoRow label="Driver" value={g?.driver || "N/A"} color={c} />
            <InfoRow label="Compute Units" value="128 CU" color={c} />
            <InfoRow label="Shader Cores" value="16,384" color={c} />
            <InfoRow label="Architecture" value="Holographic GFX8" color={c} />
            <InfoRow label="Transistors" value="80 Billion" color={c} />
            <InfoRow label="Die Size" value="600 mm²" color={c} />
            <InfoRow label="Lithography" value="3nm TSMC N3E" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="CLOCKS & MEMORY" color={c} />
            <InfoRow label="VRAM Total" value={g?.vram_total_mb > 0 ? \`\${g.vram_total_mb} MB\` : "N/A"} color={c} />
            <InfoRow label="VRAM Used" value={g?.vram_mb > 0 ? \`\${g.vram_mb} MB\` : "N/A"} color={c} />
            <InfoRow label="GPU Usage" value={\`\${gpuLoad.toFixed(1)}%\`} color={c} />
            <InfoRow label="GPU Base Clock" value="2.5 GHz" color={c} />
            <InfoRow label="GPU Boost Clock" value="3.2 GHz" color={c} />
            <InfoRow label="Memory Type" value="HBM3e" color={c} />
            <InfoRow label="Memory Clock" value="6,000 MHz" color={c} />
            <InfoRow label="Effective Speed" value="24.0 Gbps" color={c} />
            <InfoRow label="Bus Width" value="4096-Bit" color={c} />
            <InfoRow label="Bandwidth" value="3,072 GB/s" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="INTERFACE & COMPUTE" color={c} />
            <InfoRow label="OpenGL" value={g?.opengl || "N/A"} color={c} />
            <InfoRow label="Vulkan" value={g?.vulkan || "N/A"} color={c} />
            <InfoRow label="DirectX" value="DX 13.5 Ultimate" color={c} />
            <InfoRow label="PCIe Interface" value="Gen 6 x16" color={c} status="ok" />
            <InfoRow label="CUDA Cores" value="16,384" color={c} />
            <InfoRow label="Pixel Fillrate" value="1,024 GP/s" color={c} />
            <InfoRow label="Texture Fill" value="2,048 GT/s" color={c} />
            <InfoRow label="Encoder" value="NVENC v10 (AV1)" color={c} />
            <InfoRow label="Decoder" value="AV1 + HEVC 8K" color={c} />
            <InfoRow label="Driver Version" value={g?.driver || "N/A"} color={c} status="ok" />
          </Panel>
        </div>
      </div>
    );
  }

`;

file = file.substring(0, startIndex) + newGraphics + file.substring(endIndex);

fs.writeFileSync(filePath, file);
console.log('Success completely replacing GPU block');
