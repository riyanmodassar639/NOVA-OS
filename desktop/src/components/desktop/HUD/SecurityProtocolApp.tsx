import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, Network, Key, Scan, Crosshair, AlertTriangle, Lock, Unlock, Database, Activity, ExternalLink, ShieldCheck, Fingerprint, Cpu, Server, Eye, Zap, Radio, LockKeyhole } from "lucide-react";

const SvgLineGraph = ({ data, color, height = 60, label, suffix = "%" }: any) => {
  const max = 100;
  const points = data.map((val: number, i: number) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(" ");
  const currentVal = data[data.length - 1];

  return (
    <div style={{ position: "relative", padding: "10px", background: `linear-gradient(to bottom, rgba(${color}, 0.05), rgba(0,0,0,0.5))`, border: `1px solid rgba(${color}, 0.3)`, borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(${color}, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(${color}, 0.1) 1px, transparent 1px)`, backgroundSize: "10px 10px", opacity: 0.3 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: `rgb(${color})`, fontSize: "0.6rem", fontFamily: "var(--font-mono)", letterSpacing: "1px", zIndex: 1 }}>
        <span>{label}</span>
        <span>{currentVal}{suffix}</span>
      </div>
      <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: "visible", zIndex: 1, marginTop: "auto" }}>
        <polygon points={`0,100 ${points} 100,100`} fill={`rgba(${color}, 0.15)`} />
        <polyline points={points} fill="none" stroke={`rgb(${color})`} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 5px rgb(${color}))` }} />
        <circle cx="100" cy={100 - (currentVal / max) * 100} r="3" fill="#fff" style={{ filter: `drop-shadow(0 0 8px rgb(${color}))` }} />
      </svg>
    </div>
  );
};

const MiniDetail = ({ label, value, color }: any) => (
  <div style={{ padding: "8px", background: "rgba(0,0,0,0.4)", borderLeft: `2px solid rgb(${color})`, position: "relative" }}>
     <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(${color},0.1), transparent)`, opacity: 0.5 }} />
     <div style={{ fontSize: "0.55rem", opacity: 0.5, letterSpacing: "1px", marginBottom: "2px", color: `rgb(${color})` }}>{label}</div>
     <div style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)", fontWeight: "bold", textShadow: "0 0 5px rgba(255,255,255,0.3)" }}>{value}</div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, color, buttonText = "DEEP SCAN", onClick }: any) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", color: `rgb(${color})` }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Icon size={24} /> <span style={{ letterSpacing: "2px", fontWeight: "bold" }}>{title}</span>
    </div>
    <button 
      className="hud-clickable"
      onClick={onClick}
      style={{ 
        background: `rgba(${color}, 0.1)`, border: `1px solid rgba(${color}, 0.3)`, 
        color: `rgb(${color})`, padding: "4px 8px", fontSize: "0.55rem", 
        cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
        letterSpacing: "1px", position: "relative", zIndex: 10, pointerEvents: "auto"
      }}
    >
      {buttonText} <ExternalLink size={10} />
    </button>
  </div>
);

const DeepScanView = ({ type, onClose }: { type: string, onClose: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      iteration++;
      setProgress(p => (p < 100 ? p + 1 : 100));
      
      const hash = Math.random().toString(16).substring(2, 10).toUpperCase();
      const addr = `0x${(Math.random() * 0xFFFFF).toString(16).padStart(8, '0').toUpperCase()}`;
      
      const newLogs = [
        `[${new Date().toISOString()}] SCANNING CLUSTER ${addr} ...`,
        `  -> Validating checksums: MATCH`,
        `  -> Analyzing payload: CLEAR`,
        `  -> Hash: ${hash}`
      ];
      
      setLogs(prev => [...prev.slice(-30), ...newLogs]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const config: Record<string, any> = {
    firewall: { title: "NETWORK FIREWALL", color: "0,255,255", hex: "#00ffff" },
    encryption: { title: "ENCRYPTION ENGINE", color: "255,0,255", hex: "#ff00ff" },
    threats: { title: "THREAT MITIGATION", color: "255,136,0", hex: "#ff8800" },
    biometrics: { title: "BIOMETRIC UPLINK", color: "150,100,255", hex: "#9664ff" },
    zerotrust: { title: "ZERO-TRUST ARCH", color: "0,200,255", hex: "#00c8ff" },
    quantum: { title: "QUANTUM CRYPTO", color: "0,255,100", hex: "#00ff64" },
    ids: { title: "INTRUSION SYSTEM", color: "255,50,100", hex: "#ff3264" },
    dlp: { title: "DATA LOSS PREVENT", color: "255,200,0", hex: "#ffc800" },
  }[type] || { title: "UNKNOWN", color: "255,255,255", hex: "#fff" };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${config.color}, 0.3)`, paddingBottom: "15px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Activity size={32} color={config.hex} style={{ animation: progress < 100 ? "pulse 1s infinite" : "none" }} />
          <div>
            <h2 style={{ color: config.hex, margin: 0, letterSpacing: "3px", textShadow: `0 0 10px ${config.hex}` }}>{config.title} : DEEP SCAN</h2>
            <div style={{ color: `rgba(${config.color}, 0.8)`, fontSize: "0.85rem", letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
              {progress < 100 ? "ANALYSIS IN PROGRESS..." : "SCAN COMPLETE - NO ANOMALIES FOUND"}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: `rgba(${config.color}, 0.2)`, border: `1px solid ${config.hex}`, color: config.hex, padding: "8px 20px", cursor: "pointer", fontFamily: "var(--font-mono)", fontWeight: "bold", letterSpacing: "2px", boxShadow: `0 0 10px rgba(${config.color}, 0.2)` }}>
          RETURN TO OVERVIEW
        </button>
      </div>
      
      {/* Content */}
      <div style={{ display: "flex", gap: "20px", flex: 1, overflow: "hidden" }}>
        {/* Left: Progress/Stats */}
        <div style={{ width: "350px", border: `1px solid rgba(${config.color}, 0.3)`, background: `linear-gradient(135deg, rgba(${config.color}, 0.1), rgba(0,0,0,0.8))`, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", borderRadius: "4px" }}>
           <div style={{ fontSize: "5rem", color: config.hex, fontWeight: "900", textAlign: "center", textShadow: `0 0 30px ${config.hex}`, fontFamily: "var(--font-mono)", lineHeight: "1" }}>
             {progress}%
           </div>
           <div style={{ borderTop: `1px solid rgba(${config.color}, 0.3)`, paddingTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <MiniDetail label="SECTORS SCANNED" value={(progress * 1420).toLocaleString()} color={config.color} />
              <MiniDetail label="ANOMALIES" value="0" color={config.color} />
              <MiniDetail label="TIME ELAPSED" value={`${(progress * 0.15).toFixed(1)}s`} color={config.color} />
              <MiniDetail label="EST REMAINING" value={`${((100 - progress) * 0.15).toFixed(1)}s`} color={config.color} />
           </div>
           {/* Hex grid fake animation */}
           <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "4px", alignContent: "start", marginTop: "10px" }}>
             {Array(100).fill(0).map((_, i) => (
                <div key={i} style={{ 
                  height: "15px", 
                  background: i < progress ? config.hex : `rgba(${config.color}, 0.1)`, 
                  opacity: i < progress ? (Math.random() > 0.5 ? 1 : 0.7) : 0.3,
                  boxShadow: i < progress ? `0 0 5px ${config.hex}` : "none",
                  transition: "background 0.2s"
                }}></div>
             ))}
           </div>
        </div>
        {/* Right: Terminal Logs */}
        <div style={{ flex: 1, border: `1px solid rgba(${config.color}, 0.3)`, background: "rgba(0,5,10,0.9)", padding: "20px", overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: config.hex, borderRadius: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
           {logs.map((log, i) => (
             <div key={i} style={{ opacity: 1 - (logs.length - 1 - i) * 0.03, textShadow: `0 0 2px ${config.hex}` }}>
               {log}
             </div>
           ))}
           {progress < 100 && (
             <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
               <span>{'>'}</span>
               <span style={{ width: "10px", height: "15px", background: config.hex, animation: "pulse 1s infinite" }}></span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const SecurityProtocolApp = () => {
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [dataPoints, setDataPoints] = useState<{ [key: string]: number[] }>({
    firewall: Array(40).fill(100),
    encryption: Array(40).fill(100),
    threats: Array(40).fill(0),
    biometrics: Array(40).fill(100),
    zerotrust: Array(40).fill(100),
    quantum: Array(40).fill(100),
    ids: Array(40).fill(0),
    dlp: Array(40).fill(100),
  });

  const [lockdown, setLockdown] = useState(false);
  const [uptime, setUptime] = useState(14500);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => ({
        firewall: [...prev.firewall.slice(1), lockdown ? 100 : Math.floor(Math.random() * 5) + 95],
        encryption: [...prev.encryption.slice(1), 100],
        threats: [...prev.threats.slice(1), lockdown ? 0 : Math.floor(Math.random() * 20)],
        biometrics: [...prev.biometrics.slice(1), Math.floor(Math.random() * 10) + 90],
        zerotrust: [...prev.zerotrust.slice(1), lockdown ? 100 : Math.floor(Math.random() * 2) + 98],
        quantum: [...prev.quantum.slice(1), Math.floor(Math.random() * 8) + 92],
        ids: [...prev.ids.slice(1), lockdown ? 0 : Math.floor(Math.random() * 30)],
        dlp: [...prev.dlp.slice(1), lockdown ? 100 : Math.floor(Math.random() * 4) + 96],
      }));
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockdown]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleLockdown = () => setLockdown(!lockdown);

  // Main UI Color Scheme
  const mainColor = lockdown ? "255, 0, 60" : "0, 255, 255";
  const mainHex = lockdown ? "#ff003c" : "#00ffff";

  if (activeScan) {
    return (
      <div style={{ height: "100%", width: "100%", padding: "20px", background: "radial-gradient(circle at center, rgba(0,20,40,0.8) 0%, rgba(0,5,10,0.95) 100%)", color: "#fff", overflow: "hidden" }}>
        <DeepScanView type={activeScan} onClose={() => setActiveScan(null)} />
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", background: "radial-gradient(circle at center, rgba(0,20,40,0.8) 0%, rgba(0,5,10,0.95) 100%)", color: "#fff" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid rgba(${mainColor},0.3)`, paddingBottom: "15px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <ShieldAlert size={40} color={mainHex} style={{ filter: `drop-shadow(0 0 10px ${mainHex})`, animation: lockdown ? "pulse 1s infinite" : "none" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: "5px", color: mainHex, textShadow: `0 0 15px ${mainHex}`, textTransform: "uppercase" }}>
              Security Protocol Center
            </h1>
            <div style={{ fontSize: "0.75rem", color: mainHex, opacity: 0.7, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
              OMNI-DEFENSE MATRIX // SYSTEM INTEGRITY {lockdown ? "ISOLATED" : "NOMINAL"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={toggleLockdown} style={{ background: `rgba(${mainColor}, 0.2)`, border: `1px solid ${mainHex}`, color: mainHex, padding: "10px 20px", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "bold", textShadow: `0 0 10px ${mainHex}`, display: "flex", alignItems: "center", gap: "8px" }}>
            {lockdown ? <Unlock size={14} /> : <Lock size={14} />}
            {lockdown ? "LIFT LOCKDOWN" : "INITIATE LOCKDOWN"}
          </button>
          <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: mainHex }}>
            <div style={{ fontSize: "0.7rem", opacity: 0.7, letterSpacing: "2px" }}>UPTIME</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", textShadow: `0 0 10px ${mainHex}` }}>{formatUptime(uptime)}</div>
          </div>
        </div>
      </div>

      {/* 8-COLUMN GRID FOR SECURITY SYSTEMS (2 rows of 4) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", flexShrink: 0 }}>
        
        {/* ROW 1 */}
        {/* FIREWALL COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,255,255,0.02)", padding: "15px", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px" }}>
          <SectionHeader icon={Network} title="NETWORK FIREWALL" color="0,255,255" onClick={() => setActiveScan('firewall')} />
          <SvgLineGraph data={dataPoints.firewall} color="0, 255, 255" label="BARRIER INTEGRITY" height={100} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="STATUS" value="Active" color="0,255,255" />
            <MiniDetail label="MODE" value={lockdown ? "Isolate" : "Standard"} color="0,255,255" />
            <MiniDetail label="ALGORITHM" value="Quantum-Resist" color="0,255,255" />
            <MiniDetail label="RULES" value="4,096 Active" color="0,255,255" />
            <MiniDetail label="INBOUND BLOCKED" value="12,450" color="0,255,255" />
            <MiniDetail label="OUTBOUND BLOCKED" value="43" color="0,255,255" />
            <MiniDetail label="DEEP INSP" value="Enabled" color="0,255,255" />
            <MiniDetail label="PROXY" value="Tor-Relay" color="0,255,255" />
            <MiniDetail label="VPN TUNNEL" value="WireGuard" color="0,255,255" />
            <MiniDetail label="DNS FILTER" value="Pi-Hole Core" color="0,255,255" />
            <MiniDetail label="IP SEC" value="Enforced" color="0,255,255" />
            <MiniDetail label="DDOS PROT" value="Active" color="0,255,255" />
            <MiniDetail label="PORTS OPEN" value="2" color="0,255,255" />
            <MiniDetail label="BGP ROUTES" value="Hidden" color="0,255,255" />
          </div>
        </div>

        {/* ENCRYPTION COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,0,255,0.02)", padding: "15px", border: "1px solid rgba(255,0,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Key} title="ENCRYPTION ENGINE" color="255,0,255" onClick={() => setActiveScan('encryption')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.encryption} color="255, 0, 255" label="KEY SYNTHESIS" height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="CIPHER" value="AES-4096-GCM" color="255,0,255" />
            <MiniDetail label="HASHING" value="SHA-512" color="255,0,255" />
            <MiniDetail label="SALT" value="256-bit" color="255,0,255" />
            <MiniDetail label="KEY ROTATION" value="2.4 mins" color="255,0,255" />
            <MiniDetail label="PUB KEY" value="RSA-8192" color="255,0,255" />
            <MiniDetail label="PRV KEY" value="Vaulted" color="255,0,255" />
            <MiniDetail label="ENTROPY" value="99.9%" color="255,0,255" />
            <MiniDetail label="HANDSHAKE" value="TLS 1.3" color="255,0,255" />
            <MiniDetail label="PFS" value="Enabled" color="255,0,255" />
            <MiniDetail label="MAC" value="HMAC-SHA256" color="255,0,255" />
            <MiniDetail label="STORE" value="Hardware TPM" color="255,0,255" />
            <MiniDetail label="ZERO KNOW" value="True" color="255,0,255" />
          </div>
        </div>

        {/* THREAT RADAR COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,136,0,0.02)", padding: "15px", border: "1px solid rgba(255,136,0,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Crosshair} title="THREAT MITIGATION" color="255,136,0" onClick={() => setActiveScan('threats')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.threats} color="255, 136, 0" label="ACTIVE ANOMALIES" height={100} suffix="" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="HEURISTICS" value="Aggressive" color="255,136,0" />
            <MiniDetail label="AI ENGINE" value="Aegis-X" color="255,136,0" />
            <MiniDetail label="ZERO-DAY" value="0 Detected" color="255,136,0" />
            <MiniDetail label="MALWARE" value="0 Detected" color="255,136,0" />
            <MiniDetail label="ROOTKITS" value="0 Detected" color="255,136,0" />
            <MiniDetail label="RANSOMWARE" value="0 Detected" color="255,136,0" />
            <MiniDetail label="SANDBOX" value="Isolated" color="255,136,0" />
            <MiniDetail label="KERNEL PROT" value="Ring-0 Sec" color="255,136,0" />
            <MiniDetail label="MEMORY PROT" value="ASLR+DEP" color="255,136,0" />
            <MiniDetail label="FILE INTEG" value="Verified" color="255,136,0" />
            <MiniDetail label="BEHAVIORAL" value="Monitoring" color="255,136,0" />
            <MiniDetail label="HONEYPOT" value="Deployed" color="255,136,0" />
          </div>
        </div>

        {/* BIOMETRIC COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(150,100,255,0.02)", padding: "15px", border: "1px solid rgba(150,100,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Scan} title="BIOMETRIC UPLINK" color="150,100,255" onClick={() => setActiveScan('biometrics')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.biometrics} color="150, 100, 255" label="NEURAL SYNC" height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="IDENTITY" value="Commander" color="150,100,255" />
            <MiniDetail label="CLEARANCE" value="Level Omni" color="150,100,255" />
            <MiniDetail label="NEURAL" value="Synced" color="150,100,255" />
            <MiniDetail label="HEART RATE" value="72 BPM" color="150,100,255" />
            <MiniDetail label="RETINA" value="Matched" color="150,100,255" />
            <MiniDetail label="FINGERPRINT" value="Matched" color="150,100,255" />
            <MiniDetail label="VOICE MAP" value="Verified" color="150,100,255" />
            <MiniDetail label="DNA SEQ" value="Nominal" color="150,100,255" />
            <MiniDetail label="STRESS LVL" value="Low" color="150,100,255" />
            <MiniDetail label="COGNITIVE" value="100% Beta" color="150,100,255" />
            <MiniDetail label="CORTEX" value="Stable" color="150,100,255" />
            <MiniDetail label="O2 SAT" value="99%" color="150,100,255" />
          </div>
        </div>

        {/* ROW 2 */}

        {/* ZERO TRUST ARCHITECTURE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,200,255,0.02)", padding: "15px", border: "1px solid rgba(0,200,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Eye} title="ZERO-TRUST ARCH" color="0,200,255" onClick={() => setActiveScan('zerotrust')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.zerotrust} color="0, 200, 255" label="AUTHORIZATION" height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="MFA" value="Enforced" color="0,200,255" />
            <MiniDetail label="ACCESS" value="Least Priv" color="0,200,255" />
            <MiniDetail label="ENDPOINTS" value="Verified" color="0,200,255" />
            <MiniDetail label="PERIMETER" value="Micro-Seg" color="0,200,255" />
            <MiniDetail label="SESSIONS" value="Expiring" color="0,200,255" />
            <MiniDetail label="IAM" value="Active" color="0,200,255" />
            <MiniDetail label="POLICIES" value="Strict" color="0,200,255" />
            <MiniDetail label="DEVICE TRUST" value="High" color="0,200,255" />
            <MiniDetail label="SSO" value="Token Valid" color="0,200,255" />
            <MiniDetail label="AUDIT LOGS" value="Immutable" color="0,200,255" />
            <MiniDetail label="SAML" value="Encrypted" color="0,200,255" />
            <MiniDetail label="TOKENS" value="JWT Sec" color="0,200,255" />
          </div>
        </div>

        {/* QUANTUM CRYPTANALYSIS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,255,100,0.02)", padding: "15px", border: "1px solid rgba(0,255,100,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Zap} title="QUANTUM CRYPTO" color="0,255,100" onClick={() => setActiveScan('quantum')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.quantum} color="0, 255, 100" label="LATTICE STABILITY" height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="ALGORITHM" value="CRYSTALS" color="0,255,100" />
            <MiniDetail label="QKD LINK" value="Secure" color="0,255,100" />
            <MiniDetail label="ENTANGLEMENT" value="Stable" color="0,255,100" />
            <MiniDetail label="DECOHERENCE" value="0.01ms" color="0,255,100" />
            <MiniDetail label="QUBITS" value="1024 Active" color="0,255,100" />
            <MiniDetail label="ERROR CORR" value="Surface" color="0,255,100" />
            <MiniDetail label="POST-QUANTUM" value="Ready" color="0,255,100" />
            <MiniDetail label="SUPERPOS" value="Maintained" color="0,255,100" />
            <MiniDetail label="SHOR'S ALG" value="Immune" color="0,255,100" />
            <MiniDetail label="NOISE LVL" value="Ext Low" color="0,255,100" />
            <MiniDetail label="CHANNELS" value="Fib/Optic" color="0,255,100" />
            <MiniDetail label="PHOTONS" value="Polarized" color="0,255,100" />
          </div>
        </div>

        {/* INTRUSION DETECTION SYSTEM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,50,100,0.02)", padding: "15px", border: "1px solid rgba(255,50,100,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Radio} title="INTRUSION SYSTEM" color="255,50,100" onClick={() => setActiveScan('ids')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.ids} color="255, 50, 100" label="PACKET DROPS /s" height={100} suffix="" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="MODE" value="IPS Active" color="255,50,100" />
            <MiniDetail label="SIGNATURES" value="Updated" color="255,50,100" />
            <MiniDetail label="FALSE POS" value="< 0.1%" color="255,50,100" />
            <MiniDetail label="ANOMALY DET" value="Heuristic" color="255,50,100" />
            <MiniDetail label="LOGGING" value="Verbose" color="255,50,100" />
            <MiniDetail label="ALERTS" value="0 Critical" color="255,50,100" />
            <MiniDetail label="AUTO-BLOCK" value="Enabled" color="255,50,100" />
            <MiniDetail label="THREAT FEED" value="Synced" color="255,50,100" />
            <MiniDetail label="PCAP" value="Rolling" color="255,50,100" />
            <MiniDetail label="DECODE" value="Real-time" color="255,50,100" />
            <MiniDetail label="LATENCY" value="0.2ms" color="255,50,100" />
            <MiniDetail label="THROUGHPUT" value="100G" color="255,50,100" />
          </div>
        </div>

        {/* DATA LOSS PREVENTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,200,0,0.02)", padding: "15px", border: "1px solid rgba(255,200,0,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={LockKeyhole} title="DATA LOSS PREVENT" color="255,200,0" onClick={() => setActiveScan('dlp')} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.dlp} color="255, 200, 0" label="VAULT INTEGRITY" height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="EXFILTRATION" value="Blocked" color="255,200,0" />
            <MiniDetail label="WATERMARK" value="Active" color="255,200,0" />
            <MiniDetail label="USB STORAGE" value="Disabled" color="255,200,0" />
            <MiniDetail label="CLIPBOARD" value="Monitored" color="255,200,0" />
            <MiniDetail label="CLOUD SYNC" value="Restricted" color="255,200,0" />
            <MiniDetail label="EMAIL OUT" value="Scanned" color="255,200,0" />
            <MiniDetail label="PRINTS" value="Logged" color="255,200,0" />
            <MiniDetail label="DATA CLASSIFY" value="Strict" color="255,200,0" />
            <MiniDetail label="OCR SCAN" value="Enabled" color="255,200,0" />
            <MiniDetail label="REGEX MATCH" value="Running" color="255,200,0" />
            <MiniDetail label="VAULT LOCK" value="Engaged" color="255,200,0" />
            <MiniDetail label="AUDIT" value="Passed" color="255,200,0" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecurityProtocolApp;
