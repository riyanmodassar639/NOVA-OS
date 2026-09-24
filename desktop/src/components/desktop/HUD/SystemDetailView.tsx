import React, { useState, useEffect } from "react";
import { Cpu, MemoryStick, HardDrive, Monitor, Server, Activity, Zap, Shield, Radio, Globe, Thermometer, AlertTriangle, CheckCircle, Clock, Plane, Phone, Network, Settings2, Wifi, RadioTower, ShieldCheck, Lock, User, ToggleLeft, ToggleRight, List, Shuffle, HelpCircle, ChevronRight, ChevronDown } from "lucide-react";

interface SystemDetailViewProps {
  type: string;
}

const ConfigRow = ({ icon: Icon, title, subtitle, rightElement, onClick, color = "0,255,255" }: any) => (
  <div className="hud-clickable" onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: `rgba(${color},0.05)`, border: `1px solid rgba(${color},0.2)`, borderRadius: "4px", cursor: onClick ? "pointer" : "default", marginBottom: "8px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <div style={{ color: `rgb(${color})`, opacity: 0.8 }}><Icon size={18} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "0.85rem", letterSpacing: "1px", color: "#fff" }}>{title}</span>
        {subtitle && <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>{subtitle}</span>}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {rightElement}
      {!rightElement?.props?.hideArrow && <ChevronRight size={16} style={{ opacity: 0.4 }} />}
    </div>
  </div>
);

const SystemDetailView: React.FC<SystemDetailViewProps> = ({ type }) => {
  const [tick, setTick] = useState(0);
  const [wifiOn, setWifiOn] = useState(true);
  const [randomMac, setRandomMac] = useState(false);
  const [expandAvailable, setExpandAvailable] = useState(false);
  const [expandKnown, setExpandKnown] = useState(false);
  const [expandHardware, setExpandHardware] = useState(false);
  const [expandProperties, setExpandProperties] = useState(false);

  const [graphs, setGraphs] = useState<{ [k: string]: number[] }>({
    a: Array(50).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
    b: Array(50).fill(0).map(() => Math.floor(Math.random() * 40) + 30),
    c: Array(50).fill(0).map(() => Math.floor(Math.random() * 60) + 5),
    d: Array(50).fill(0).map(() => Math.floor(Math.random() * 30) + 60),
  });
  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      setGraphs(prev => ({
        a: [...prev.a.slice(1), Math.floor(Math.random() * 80) + 10],
        b: [...prev.b.slice(1), Math.floor(Math.random() * 40) + 30],
        c: [...prev.c.slice(1), Math.floor(Math.random() * 60) + 5],
        d: [...prev.d.slice(1), Math.floor(Math.random() * 20) + 70],
      }));
    }, 800);
    return () => clearInterval(iv);
  }, []);

  const uptime = 25300 + tick;
  const fmtUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  // --- Reusable Sub-components ---

  const MiniGraph = ({ data, color, label, height = 70, suffix = "%" }: any) => {
    const max = Math.max(...data, 100);
    const pts = data.map((v: number, i: number) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    }).join(" ");
    const cur = data[data.length - 1];
    return (
      <div style={{ position: "relative", background: `rgba(${color},0.04)`, border: `1px solid rgba(${color},0.25)`, borderRadius: "3px", padding: "8px", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(${color},0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(${color},0.08) 1px, transparent 1px)`, backgroundSize: "8px 8px" }} />
        {/* Scan line */}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: `rgba(${color},0.4)`, boxShadow: `0 0 6px rgba(${color},0.8)`, animation: "scanMini 2s linear infinite" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.58rem", color: `rgb(${color})`, letterSpacing: "1px", marginBottom: "5px", position: "relative", zIndex: 1 }}>
          <span>▶ {label}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold" }}>{cur}{suffix}</span>
        </div>
        <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "relative", zIndex: 1 }}>
          <defs>
            <linearGradient id={`g${color.replace(/,/g,"")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${color})`} stopOpacity="0.4" />
              <stop offset="100%" stopColor={`rgb(${color})`} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${pts} 100,100`} fill={`url(#g${color.replace(/,/g,"")})`} />
          <polyline points={pts} fill="none" stroke={`rgb(${color})`} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 4px rgb(${color}))` }} />
          <circle cx="100" cy={100 - (cur / max) * 100} r="3" fill="white" style={{ filter: `drop-shadow(0 0 6px rgb(${color}))` }} />
        </svg>
      </div>
    );
  };

  const ProgressBar = ({ label, value, max = 100, color, unit = "%" }: any) => {
    const pct = Math.min((value / max) * 100, 100);
    const statusColor = pct > 90 ? "255,80,80" : pct > 70 ? "255,200,0" : color;
    return (
      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.58rem", color: `rgb(${color})`, letterSpacing: "1px", marginBottom: "3px" }}>
          <span>{label}</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>{value}{unit} / {max}{unit}</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, rgb(${statusColor}), rgba(${statusColor},0.5))`, borderRadius: "2px", boxShadow: `0 0 8px rgb(${statusColor})`, transition: "width 0.5s ease" }} />
        </div>
      </div>
    );
  };

  const InfoRow = ({ label, value, color, status }: any) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "var(--font-mono)" }}>
      <span style={{ fontSize: "0.6rem", color: `rgba(${color},0.6)`, letterSpacing: "1px", textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {status === "ok" && <CheckCircle size={10} style={{ color: "#00ff88" }} />}
        {status === "warn" && <AlertTriangle size={10} style={{ color: "#ffcc00" }} />}
        <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: `rgb(${color})`, textShadow: `0 0 6px rgba(${color},0.4)` }}>{value}</span>
      </div>
    </div>
  );

  const SectionTitle = ({ icon: Icon, label, color }: any) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: `1px solid rgba(${color},0.3)`, marginBottom: "8px" }}>
      <Icon size={14} style={{ color: `rgb(${color})` }} />
      <span style={{ fontSize: "0.6rem", letterSpacing: "3px", color: `rgb(${color})`, fontWeight: "bold" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, rgba(${color},0.3), transparent)` }} />
    </div>
  );

  const Panel = ({ children, color, flex = 1, style = {} }: any) => (
    <div style={{ flex, flexShrink: 0, background: `rgba(${color},0.02)`, border: `1px solid rgba(${color},0.15)`, borderRadius: "4px", padding: "12px", display: "flex", flexDirection: "column" as const, gap: "8px", ...style }}>
      {children}
    </div>
  );

  const StatusBadge = ({ label, active = true, color }: any) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 8px", background: active ? `rgba(${color},0.15)` : "rgba(255,255,255,0.03)", border: `1px solid rgba(${color},${active ? 0.5 : 0.1})`, borderRadius: "2px", fontSize: "0.55rem", letterSpacing: "1px", color: active ? `rgb(${color})` : "rgba(255,255,255,0.3)" }}>
      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: active ? `rgb(${color})` : "rgba(255,255,255,0.2)", boxShadow: active ? `0 0 6px rgb(${color})` : "none", animation: active ? "pulse 2s infinite" : "none" }} />
      {label}
    </div>
  );

  const styles = `
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
    @keyframes scanV { 0% { transform:translateY(-100%); } 100% { transform:translateY(100vh); } }
    @keyframes scanMini { 0% { top: 0%; } 100% { top: 100%; } }
    @keyframes glow { 0%,100% { text-shadow: 0 0 10px currentColor; } 50% { text-shadow: 0 0 25px currentColor, 0 0 40px currentColor; } }
    .mlbl { font-size:0.55rem; opacity:0.5; letter-spacing:1px; margin-bottom:2px; }
    .mval { font-size:0.95rem; font-family:var(--font-mono); font-weight:bold; }
  `;

  // ===================== CPU =====================
  if (type === "sys_cpu") {
    const c = "0,255,255";
    const curUtil = graphs.a[graphs.a.length - 1];
    const curTemp = graphs.b[graphs.b.length - 1];
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top left, rgba(0,40,60,0.3) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Cpu size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})`, animation: "glow 3s infinite" }}>PROCESSOR DIAGNOSTICS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>QUANTUM-X NEURAL ENGINE // FIELD ANALYSIS TERMINAL</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="ACTIVE" active={true} color={c} />
            <StatusBadge label="THERMAL OK" active={curTemp < 80} color={c} />
            <StatusBadge label="NO THROTTLE" active={true} color={c} />
          </div>
        </div>

        {/* ROW 1: GRAPHS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MiniGraph data={graphs.a} color={c} label="CORE UTILIZATION AGGREGATE" height={90} />
            <MiniGraph data={graphs.b} color="255,100,100" label="THERMAL OUTPUT (°C)" height={60} suffix="°C" />
            <MiniGraph data={graphs.c} color="0,200,100" label="POWER DRAW (Watts)" height={60} suffix="W" />
          </div>
          {/* Core map */}
          <div style={{ background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px", padding: "10px" }}>
            <SectionTitle icon={Cpu} label="CORE LOAD MAP" color={c} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "3px" }}>
              {Array.from({ length: 32 }).map((_, i) => {
                const load = Math.floor(Math.random() * 90) + 5;
                const hue = load > 80 ? "255,80,80" : load > 50 ? "255,200,0" : c;
                return (
                  <div key={i} title={`Core ${i}: ${load}%`} style={{ height: "18px", background: `rgba(${hue},${load / 130})`, border: `1px solid rgba(${hue},0.4)`, borderRadius: "1px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.4rem", color: `rgb(${hue})`, fontFamily: "var(--font-mono)" }}>{load}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "10px", fontSize: "0.55rem", opacity: 0.5, letterSpacing: "1px" }}>32 OF 128 CORES DISPLAYED</div>
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <ProgressBar label="P-CORES (64)" value={curUtil} color={c} />
              <ProgressBar label="E-CORES (64)" value={Math.floor(curUtil * 0.6)} color="0,200,150" />
              <ProgressBar label="L3 CACHE HIT" value={94} color="0,180,255" />
            </div>
          </div>
        </div>

        {/* ROW 2: DATA TABLES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Cpu} label="IDENTITY & ARCHITECTURE" color={c} />
            <InfoRow label="Designation" value="Quantum-X Neural" color={c} status="ok" />
            <InfoRow label="Architecture" value="RISC-V Quantum" color={c} />
            <InfoRow label="Lithography" value="1.5 nm TSMC N3E" color={c} />
            <InfoRow label="Die Size" value="840 mm²" color={c} />
            <InfoRow label="Transistors" value="150 Billion" color={c} />
            <InfoRow label="Microcode Rev" value="0x1F4A (Build 5)" color={c} />
            <InfoRow label="CPU Stepping" value="B0" color={c} />
            <InfoRow label="Package" value="LGA-9999" color={c} />
            <InfoRow label="Sockets" value="2 Physical" color={c} />
            <InfoRow label="Instruction Set" value="AVX-1024 / VNNI" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="PERFORMANCE TELEMETRY" color={c} />
            <InfoRow label="Base Clock" value="6.00 GHz" color={c} />
            <InfoRow label="Boost Clock" value="8.50 GHz" color={c} />
            <InfoRow label="Bus Speed" value="400 MHz" color={c} />
            <InfoRow label="BCLK" value="100.0 MHz" color={c} />
            <InfoRow label="Multiplier" value="x 85" color={c} />
            <InfoRow label="Core Voltage" value="1.450 V" color={c} status="ok" />
            <InfoRow label="TDP (Max)" value="350 Watts" color={c} />
            <InfoRow label="Package Power" value={`${Math.floor(curUtil * 3.2 + 50)} W`} color={c} />
            <InfoRow label="THROTTLING" value="INACTIVE" color={c} status="ok" />
            <InfoRow label="AVX Offset" value="-200 MHz" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="CACHE & SUBSYSTEM" color={c} />
            <InfoRow label="L1 Data Cache" value="256 KB (per core)" color={c} />
            <InfoRow label="L1 Instr Cache" value="128 KB (per core)" color={c} />
            <InfoRow label="L2 Cache" value="32.0 MB" color={c} />
            <InfoRow label="L3 Cache" value="256.0 MB" color={c} />
            <InfoRow label="L4 Cache" value="1.0 GB HBM" color={c} />
            <InfoRow label="Processes" value={`${276 + (tick % 5)}`} color={c} />
            <InfoRow label="Threads (Active)" value={`${3828 + (tick % 20)}`} color={c} />
            <InfoRow label="Handles" value={`${120754 + (tick * 3)}`} color={c} />
            <InfoRow label="NPU Status" value="ACTIVE — 45 TOPS" color={c} status="ok" />
            <InfoRow label="Virtualization" value="ENABLED (VT-x)" color={c} status="ok" />
            <InfoRow label="Branch Pred" value="Neural Assisted" color={c} />
            <InfoRow label="Uptime" value={fmtUptime(uptime)} color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== MEMORY =====================
  if (type === "sys_memory") {
    const c = "255,0,255";
    const inUsePct = Math.floor(graphs.a[graphs.a.length - 1] * 0.9 + 10);
    const inUseGB = (inUsePct * 5.12).toFixed(1);
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top right, rgba(40,0,60,0.3) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <MemoryStick size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>MEMORY SUBSYSTEM</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>Q-DIMM 512GB // HIGH-BANDWIDTH MATRIX ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="ECC ACTIVE" active={true} color={c} />
            <StatusBadge label="XMP/EXPO" active={true} color={c} />
            <StatusBadge label="0 ERRORS" active={true} color={c} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MiniGraph data={graphs.a} color={c} label="MEMORY ALLOCATION TIMELINE" height={90} suffix=" GB" />
            <MiniGraph data={graphs.b} color="200,100,255" label="COMMITTED MEMORY (GB)" height={60} suffix=" GB" />
            <MiniGraph data={graphs.c} color="255,150,255" label="PAGE FILE ACTIVITY (MB/s)" height={60} suffix=" MB/s" />
          </div>
          <div style={{ background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <SectionTitle icon={MemoryStick} label="SLOT MATRIX" color={c} />
            {["SLOT A1 — 128 GB", "SLOT A2 — 128 GB", "SLOT B1 — 128 GB", "SLOT B2 — 128 GB", "SLOT C1 — EMPTY", "SLOT C2 — EMPTY", "SLOT D1 — EMPTY", "SLOT D2 — EMPTY"].map((s, i) => (
              <div key={i} style={{ padding: "5px 8px", background: i < 4 ? `rgba(${c},0.12)` : "rgba(255,255,255,0.02)", border: `1px solid rgba(${c},${i < 4 ? 0.3 : 0.05})`, borderRadius: "2px", fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: i < 4 ? `rgb(${c})` : "rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between" }}>
                <span>{s}</span>
                {i < 4 && <CheckCircle size={10} style={{ color: "#00ff88" }} />}
              </div>
            ))}
            <div style={{ marginTop: "4px" }}>
              <ProgressBar label="TOTAL IN USE" value={parseFloat(inUseGB)} max={512} color={c} unit=" GB" />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={MemoryStick} label="CAPACITY & USAGE" color={c} />
            <InfoRow label="Total Installed" value="512.0 GB" color={c} status="ok" />
            <InfoRow label="In Use" value={`${inUseGB} GB`} color={c} />
            <InfoRow label="Available" value={`${(512 - parseFloat(inUseGB)).toFixed(1)} GB`} color={c} status="ok" />
            <InfoRow label="Standby" value="14.9 GB" color={c} />
            <InfoRow label="Modified" value="2.1 GB" color={c} />
            <InfoRow label="Free" value="0.3 GB" color={c} />
            <InfoRow label="Committed" value="59.5 / 512 GB" color={c} />
            <InfoRow label="Cached" value="14.9 GB" color={c} />
            <InfoRow label="Paged Pool" value="1,288 MB" color={c} />
            <InfoRow label="Non-Paged Pool" value="859 MB" color={c} />
            <InfoRow label="Hardware Reserved" value="157 MB" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="TIMINGS & ELECTRICAL" color={c} />
            <InfoRow label="Speed" value="8400 MT/s" color={c} />
            <InfoRow label="Form Factor" value="Q-DIMM (RDIMM)" color={c} />
            <InfoRow label="CAS Latency (CL)" value="CL 28" color={c} />
            <InfoRow label="tRCD" value="36 Clocks" color={c} />
            <InfoRow label="tRP" value="36 Clocks" color={c} />
            <InfoRow label="tRAS" value="38 Clocks" color={c} />
            <InfoRow label="tRC" value="Bank Cycle 66" color={c} />
            <InfoRow label="Gear Mode" value="Gear 1 (1:1)" color={c} />
            <InfoRow label="Command Rate" value="1T" color={c} />
            <InfoRow label="VDD Voltage" value="1.10 V" color={c} status="ok" />
            <InfoRow label="VDDQ Voltage" value="1.10 V" color={c} status="ok" />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="CONFIGURATION & HEALTH" color={c} />
            <InfoRow label="Channels Active" value="Quad Channel" color={c} status="ok" />
            <InfoRow label="ECC Status" value="ACTIVE — 0 ERRORS" color={c} status="ok" />
            <InfoRow label="Topology" value="Daisy Chain" color={c} />
            <InfoRow label="Bank Groups" value="16" color={c} />
            <InfoRow label="Banks" value="4 per group" color={c} />
            <InfoRow label="Controller Freq" value="4800 MHz" color={c} />
            <InfoRow label="SPD Extension" value="EXPO II Profile" color={c} />
            <InfoRow label="DRAM Vendor" value="SK Hynix-Q" color={c} />
            <InfoRow label="Burst Length" value="16 Bytes" color={c} />
            <InfoRow label="Prefetch" value="Hardware (16x)" color={c} />
            <InfoRow label="PMIC" value="UNLOCKED" color={c} status="ok" />
            <InfoRow label="Heatsink" value="Graphene Vapor" color={c} />
            <InfoRow label="Temp" value="32°C" color={c} status="ok" />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== GPU =====================
  if (type === "sys_graphics") {
    const c = "255,136,0";
    const gpuLoad = graphs.a[graphs.a.length - 1];
    const gpuTemp = graphs.b[graphs.b.length - 1];
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at bottom left, rgba(40,20,0,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Monitor size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>GRAPHICS ENGINE</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>HOLO-GPU 9000 // 8K RENDERING PIPELINE ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="RENDERING" active={true} color={c} />
            <StatusBadge label={`TEMP: ${gpuTemp}°C`} active={gpuTemp < 85} color={c} />
            <StatusBadge label="DX13.5 READY" active={true} color={c} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MiniGraph data={graphs.a} color={c} label="GPU COMPUTE UTILIZATION" height={90} />
            <MiniGraph data={graphs.b} color="255,80,80" label="GPU TEMPERATURE (°C)" height={60} suffix="°C" />
            <MiniGraph data={graphs.c} color="255,200,0" label="VRAM BANDWIDTH (GB/s)" height={60} suffix=" GB/s" />
          </div>
          <div style={{ background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <SectionTitle icon={Monitor} label="RENDER PIPELINE" color={c} />
            <ProgressBar label="3D ENGINE" value={gpuLoad} color={c} />
            <ProgressBar label="VIDEO ENCODE" value={Math.floor(gpuLoad * 0.4)} color={c} />
            <ProgressBar label="VRAM USAGE" value={18} max={32} color={c} unit=" GB" />
            <ProgressBar label="RT PIPELINE" value={Math.floor(gpuLoad * 0.7)} color={c} />
            <ProgressBar label="TENSOR (AI)" value={Math.floor(gpuLoad * 0.3)} color={c} />
            <ProgressBar label="COPY ENGINE" value={Math.floor(gpuLoad * 0.2)} color={c} />
            <div style={{ marginTop: "4px" }}>
              <SectionTitle icon={Thermometer} label="POWER & THERMAL" color={c} />
              <InfoRow label="Core Temp" value={`${gpuTemp}°C`} color={c} status={gpuTemp < 80 ? "ok" : "warn"} />
              <InfoRow label="Hotspot" value={`${gpuTemp + 8}°C`} color={c} />
              <InfoRow label="TGP" value={`${Math.floor(gpuLoad * 4 + 100)} W`} color={c} />
              <InfoRow label="Fan Speed" value={`${Math.floor(gpuLoad * 12 + 800)} RPM`} color={c} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Monitor} label="SILICON SPECS" color={c} />
            <InfoRow label="GPU Model" value="Holo-GPU 9000" color={c} status="ok" />
            <InfoRow label="Architecture" value="Holographic GFX8" color={c} />
            <InfoRow label="Lithography" value="3nm TSMC N3E" color={c} />
            <InfoRow label="Die Size" value="600 mm²" color={c} />
            <InfoRow label="Transistors" value="80 Billion" color={c} />
            <InfoRow label="Compute Units" value="128 CU" color={c} />
            <InfoRow label="Shader Cores" value="16,384" color={c} />
            <InfoRow label="RT Cores" value="512 (Gen 4)" color={c} />
            <InfoRow label="Tensor Cores" value="2,048 (Gen 5)" color={c} />
            <InfoRow label="TMUs" value="1,024" color={c} />
            <InfoRow label="ROPs" value="512" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="CLOCKS & MEMORY" color={c} />
            <InfoRow label="GPU Base Clock" value="2.5 GHz" color={c} />
            <InfoRow label="GPU Boost Clock" value="3.2 GHz" color={c} />
            <InfoRow label="Memory Type" value="HBM3e" color={c} />
            <InfoRow label="VRAM Total" value="32 GB" color={c} />
            <InfoRow label="Memory Clock" value="6,000 MHz" color={c} />
            <InfoRow label="Effective Speed" value="24.0 Gbps" color={c} />
            <InfoRow label="Bus Width" value="4096-Bit" color={c} />
            <InfoRow label="Bandwidth" value="3,072 GB/s" color={c} />
            <InfoRow label="L2 Cache" value="128 MB" color={c} />
            <InfoRow label="Infinity Cache" value="256 MB" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="INTERFACE & COMPUTE" color={c} />
            <InfoRow label="PCIe Interface" value="Gen 6 x16" color={c} status="ok" />
            <InfoRow label="DirectX" value="DX 13.5 Ultimate" color={c} />
            <InfoRow label="OpenGL" value="4.7" color={c} />
            <InfoRow label="Vulkan" value="1.4" color={c} />
            <InfoRow label="CUDA Cores" value="16,384" color={c} />
            <InfoRow label="Pixel Fillrate" value="1,024 GP/s" color={c} />
            <InfoRow label="Texture Fill" value="2,048 GT/s" color={c} />
            <InfoRow label="Encoder" value="NVENC v10 (AV1)" color={c} />
            <InfoRow label="Decoder" value="AV1 + HEVC 8K" color={c} />
            <InfoRow label="Driver Version" value="560.12 Q-SERIES" color={c} status="ok" />
            <InfoRow label="BIOS Version" value="95.00.1A.00.04" color={c} />
            <InfoRow label="NVLink" value="INACTIVE" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== NETWORK =====================
  if (type === "sys_network") {
    const c = "150,100,255";
    const txVal = graphs.a[graphs.a.length - 1];
    const rxVal = graphs.b[graphs.b.length - 1];
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top left, rgba(20,0,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Radio size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>NETWORK STACK</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>HYPER-BANDWIDTH UPLINK // SECURE TUNNEL ACTIVE</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="CONNECTED" active={true} color={c} />
            <StatusBadge label="TUNNEL ACTIVE" active={true} color={c} />
            <StatusBadge label="0% LOSS" active={true} color={c} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <MiniGraph data={graphs.a} color={c} label={`UPLINK (TX) — ${txVal} Mbps`} height={100} suffix=" Mbps" />
          <MiniGraph data={graphs.b} color="200,150,255" label={`DOWNLINK (RX) — ${rxVal} Mbps`} height={100} suffix=" Mbps" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Radio} label="LINK IDENTITY" color={c} />
            <InfoRow label="Adapter Name" value="Hyper-Uplink 100G" color={c} status="ok" />
            <InfoRow label="Connection Type" value="Quantum Entanglement" color={c} />
            <InfoRow label="Link Speed" value="100.0 Gbps" color={c} />
            <InfoRow label="Duplex Mode" value="Full Duplex" color={c} />
            <InfoRow label="Protocol" value="IEEE 802.11be (WiFi 7)" color={c} />
            <InfoRow label="Band" value="6 GHz (160 MHz)" color={c} />
            <InfoRow label="Signal Strength" value="-30 dBm (Excellent)" color={c} status="ok" />
            <InfoRow label="MAC Address" value="00:1A:2B:3C:4D:5E" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Globe} label="IP & ROUTING" color={c} />
            <InfoRow label="IPv4 Address" value="192.168.1.100" color={c} status="ok" />
            <InfoRow label="Subnet Mask" value="255.255.255.0 /24" color={c} />
            <InfoRow label="Default Gateway" value="192.168.1.1" color={c} />
            <InfoRow label="IPv6 Address" value="fe80::1ff:fe23:4567" color={c} />
            <InfoRow label="IPv6 Global" value="2001:db8::1" color={c} />
            <InfoRow label="DNS Primary" value="1.1.1.1 (Cloudflare)" color={c} />
            <InfoRow label="DNS Secondary" value="8.8.8.8 (Google)" color={c} />
            <InfoRow label="DHCP Server" value="192.168.1.1" color={c} />
            <InfoRow label="DHCP Lease" value="23h 59m 47s" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="PERFORMANCE STATS" color={c} />
            <InfoRow label="Latency (Ping)" value="0.1 ms" color={c} status="ok" />
            <InfoRow label="Jitter" value="0.02 ms" color={c} status="ok" />
            <InfoRow label="Packet Loss" value="0.00%" color={c} status="ok" />
            <InfoRow label="Bytes Sent" value={`${(4.8 + tick * 0.001).toFixed(2)} GB`} color={c} />
            <InfoRow label="Bytes Received" value={`${(12.4 + tick * 0.003).toFixed(2)} GB`} color={c} />
            <InfoRow label="Packets Sent" value={`${3200000 + tick * 12}`} color={c} />
            <InfoRow label="Packets Recv" value={`${8700000 + tick * 30}`} color={c} />
            <InfoRow label="Errors" value="0" color={c} status="ok" />
            <InfoRow label="Discards" value="0" color={c} status="ok" />
            <InfoRow label="Firewall Status" value="AEGIS-X ACTIVE" color={c} status="ok" />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== STORAGE =====================
  if (type === "sys_storage") {
    const c = "0,255,136";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at bottom right, rgba(0,30,15,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HardDrive size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>STORAGE ARRAYS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>CRYSTAL NVME 8TB // QUANTUM FLASH STORAGE ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="HEALTH: 100%" active={true} color={c} />
            <StatusBadge label="S.M.A.R.T OK" active={true} color={c} />
            <StatusBadge label="TEMP: 40°C" active={true} color={c} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <MiniGraph data={graphs.a} color={c} label="READ THROUGHPUT (GB/s)" height={90} suffix=" GB/s" />
          <MiniGraph data={graphs.b} color="0,200,100" label="WRITE THROUGHPUT (GB/s)" height={90} suffix=" GB/s" />
        </div>
        <div style={{ padding: "10px", background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px" }}>
          <SectionTitle icon={HardDrive} label="PARTITION MAP — 8.0 TB TOTAL" color={c} />
          {[
            { label: "C: \\ SYSTEM", used: 512, total: 1000, unit: "GB" },
            { label: "D: \\ DATA VAULT", used: 3200, total: 4000, unit: "GB" },
            { label: "E: \\ ARCHIVE", used: 1100, total: 3000, unit: "GB" },
          ].map((p, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <ProgressBar label={p.label} value={p.used} max={p.total} color={c} unit={` ${p.unit}`} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={HardDrive} label="DRIVE IDENTITY" color={c} />
            <InfoRow label="Drive Type" value="Crystal NVMe Gen5" color={c} status="ok" />
            <InfoRow label="Form Factor" value="M.2 2280" color={c} />
            <InfoRow label="Interface" value="PCIe 5.0 x4" color={c} />
            <InfoRow label="Capacity" value="8,000.0 GB" color={c} />
            <InfoRow label="File System" value="QFS v3 (Quantum)" color={c} />
            <InfoRow label="Allocation Unit" value="4,096 Bytes" color={c} />
            <InfoRow label="NAND Type" value="SLC 3D (112L)" color={c} />
            <InfoRow label="Controller" value="Phison E26-Q" color={c} />
            <InfoRow label="DRAM Cache" value="8 GB HBM" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="PERFORMANCE" color={c} />
            <InfoRow label="Seq. Read" value="12,500 MB/s" color={c} status="ok" />
            <InfoRow label="Seq. Write" value="11,200 MB/s" color={c} status="ok" />
            <InfoRow label="Rand Read (4K)" value="2,000,000 IOPS" color={c} />
            <InfoRow label="Rand Write (4K)" value="1,800,000 IOPS" color={c} />
            <InfoRow label="Read Latency" value="0.01 ms" color={c} />
            <InfoRow label="Write Latency" value="0.02 ms" color={c} />
            <InfoRow label="Queue Depth" value="QD 128" color={c} />
            <InfoRow label="Total Read" value={`${(4800 + tick * 2).toFixed(0)} GB`} color={c} />
            <InfoRow label="Total Written" value={`${(2100 + tick).toFixed(0)} GB`} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="S.M.A.R.T & HEALTH" color={c} />
            <InfoRow label="Overall Health" value="100% EXCELLENT" color={c} status="ok" />
            <InfoRow label="S.M.A.R.T Status" value="PASS — ALL OK" color={c} status="ok" />
            <InfoRow label="Drive Temp" value="40°C" color={c} status="ok" />
            <InfoRow label="Power-On Hours" value="1,248 hrs" color={c} />
            <InfoRow label="Power Cycles" value="128" color={c} />
            <InfoRow label="Unsafe Shutdowns" value="0" color={c} status="ok" />
            <InfoRow label="Reallocated Sectors" value="0" color={c} status="ok" />
            <InfoRow label="Write Amplification" value="1.0x (Optimal)" color={c} status="ok" />
            <InfoRow label="Wear Level Count" value="1 (0.1%)" color={c} status="ok" />
            <InfoRow label="TBW Remaining" value="39,000 TB" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== DISPLAY =====================
  if (type === "sys_display") {
    const c = "100,200,255";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(0,20,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Monitor size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>DISPLAY SUBSYSTEM</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>QUANTUM OLED ARRAY // PHOTON ACCURACY ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="HDR ACTIVE" active={true} color={c} />
            <StatusBadge label="G-SYNC ON" active={true} color={c} />
            <StatusBadge label="240Hz LOCK" active={true} color={c} />
          </div>
        </div>
        <MiniGraph data={graphs.d} color={c} label="REFRESH RATE STABILITY (%)" height={80} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Monitor} label="PANEL SPECS" color={c} />
            <InfoRow label="Display Name" value="Quantum OLED Array" color={c} status="ok" />
            <InfoRow label="Panel Type" value="Micro-LED / WOLED" color={c} />
            <InfoRow label="Screen Size" value="32.0 Inch (Curved)" color={c} />
            <InfoRow label="Resolution" value="7680 x 4320 (8K)" color={c} />
            <InfoRow label="Pixel Density" value="275 PPI" color={c} />
            <InfoRow label="Pixel Pitch" value="0.05 mm" color={c} />
            <InfoRow label="Aspect Ratio" value="21:9 UltraWide" color={c} />
            <InfoRow label="Surface" value="Anti-Glare 3H" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="SIGNAL & RESPONSE" color={c} />
            <InfoRow label="Refresh Rate" value="240.00 Hz" color={c} status="ok" />
            <InfoRow label="Response Time" value="0.01 ms GtG" color={c} status="ok" />
            <InfoRow label="Adaptive Sync" value="G-Sync Ultimate" color={c} />
            <InfoRow label="VRR Range" value="1 — 240 Hz" color={c} />
            <InfoRow label="Input Lag" value="0.5 ms (MPC)" color={c} />
            <InfoRow label="Interface" value="DisplayPort 2.1" color={c} />
            <InfoRow label="HDCP" value="Version 2.3" color={c} />
            <InfoRow label="Scaling" value="150% (System)" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="COLOR & HDR" color={c} />
            <InfoRow label="Color Depth" value="12-bit RGB" color={c} status="ok" />
            <InfoRow label="Color Space" value="DCI-P3 110%" color={c} status="ok" />
            <InfoRow label="sRGB Coverage" value="150%" color={c} />
            <InfoRow label="Adobe RGB" value="99.7%" color={c} />
            <InfoRow label="Delta E (ΔE)" value="< 1.0 (Calibrated)" color={c} status="ok" />
            <InfoRow label="HDR Standard" value="HDR10+ / Dolby Vision" color={c} />
            <InfoRow label="Peak Brightness" value="4000 nits" color={c} />
            <InfoRow label="Black Level" value="0.0001 nits" color={c} />
            <InfoRow label="Contrast Ratio" value="Infinite:1 (OLED)" color={c} status="ok" />
            <InfoRow label="Local Dimming" value="Per-Pixel (OLED)" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== AUDIO =====================
  if (type === "sys_sound") {
    const c = "255,200,100";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at bottom, rgba(30,20,0,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Activity size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>AUDIO INTERFACE</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>SPATIAL AUDIO CONTROLLER // STUDIO GRADE ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="OUTPUT ACTIVE" active={true} color={c} />
            <StatusBadge label="DSP ONLINE" active={true} color={c} />
            <StatusBadge label="7.1.4 ATMOS" active={true} color={c} />
          </div>
        </div>
        <MiniGraph data={graphs.c.map((v: number) => v / 2 + 20)} color={c} label="MASTER OUTPUT LEVEL (dB)" height={80} suffix=" dB" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="DAC / CHIP SPECS" color={c} />
            <InfoRow label="Audio Chip" value="Spatial DAC Pro" color={c} status="ok" />
            <InfoRow label="Architecture" value="32-bit Sigma-Delta" color={c} />
            <InfoRow label="Sample Rate" value="384,000 Hz" color={c} />
            <InfoRow label="Bit Depth" value="32-bit Float" color={c} />
            <InfoRow label="Dynamic Range" value="144 dB" color={c} />
            <InfoRow label="SNR" value="130 dB" color={c} status="ok" />
            <InfoRow label="THD+N" value="0.0001%" color={c} status="ok" />
            <InfoRow label="Crosstalk" value="-120 dB" color={c} status="ok" />
            <InfoRow label="Frequency Range" value="5 Hz — 100 kHz" color={c} />
            <InfoRow label="DSP Engine" value="Neural DSP v3" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Radio} label="OUTPUT CONFIGURATION" color={c} />
            <InfoRow label="Speaker Config" value="7.1.4 Dolby Atmos" color={c} />
            <InfoRow label="Active Channels" value="12 (7.1.4)" color={c} status="ok" />
            <InfoRow label="Current Device" value="Holo Headset Pro" color={c} status="ok" />
            <InfoRow label="Impedance" value="600 Ohms" color={c} />
            <InfoRow label="Max Output" value="4 Watts (RMS)" color={c} />
            <InfoRow label="Output Format" value="Dolby Atmos + DTS:X" color={c} />
            <InfoRow label="Enhancements" value="Active ANC + EQ" color={c} />
            <InfoRow label="Latency Mode" value="Ultra-Low (WASAPI)" color={c} />
            <InfoRow label="Buffer Size" value="128 Samples" color={c} />
            <InfoRow label="Virtual Surround" value="Head-tracking ON" color={c} status="ok" />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="INPUT & ENVIRONMENT" color={c} />
            <InfoRow label="Microphone" value="Array Mic (4-ch)" color={c} status="ok" />
            <InfoRow label="Mic Sample Rate" value="96,000 Hz" color={c} />
            <InfoRow label="Mic Sensitivity" value="-26 dBFS" color={c} />
            <InfoRow label="Noise Cancel" value="AI Beamforming" color={c} status="ok" />
            <InfoRow label="Echo Cancel" value="Hardware (AEC)" color={c} status="ok" />
            <InfoRow label="Spatial Audio" value="HRTF Personalized" color={c} />
            <InfoRow label="Room Correction" value="Auto-Cal Active" color={c} status="ok" />
            <InfoRow label="Input Gain" value="0 dB (Line)" color={c} />
            <InfoRow label="Headphone Amp" value="Class A — 600Ω" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== INPUT =====================
  if (type === "sys_input") {
    const c = "255,100,150";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at center, rgba(30,0,15,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Zap size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>INPUT DEVICES</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>NEURAL SYNC INTERFACE // BIOFEEDBACK ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="SYNCED" active={true} color={c} />
            <StatusBadge label="8000Hz POLL" active={true} color={c} />
            <StatusBadge label="OPTIMAL" active={true} color={c} />
          </div>
        </div>
        <MiniGraph data={graphs.c.map((v: number) => v * 0.8)} color={c} label="INPUT LATENCY TRACE (μs)" height={70} suffix=" μs" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Zap} label="PRIMARY — NEURAL SYNC" color={c} />
            <InfoRow label="Device Name" value="Neural Sync Interface v2" color={c} status="ok" />
            <InfoRow label="Connection" value="Lightspeed 2.4GHz" color={c} />
            <InfoRow label="Polling Rate" value="8,000 Hz" color={c} status="ok" />
            <InfoRow label="Latency" value="0.05 ms (50 μs)" color={c} status="ok" />
            <InfoRow label="Tracking Method" value="Sub-millimeter 6DOF" color={c} />
            <InfoRow label="Resolution" value="32,000 DPI (Optical)" color={c} />
            <InfoRow label="Actuation Type" value="Optical (0ms bounce)" color={c} />
            <InfoRow label="Debounce Time" value="0 ms" color={c} status="ok" />
            <InfoRow label="Haptic Engine" value="HD Linear Actuator" color={c} />
            <InfoRow label="Haptic Latency" value="0.3 ms" color={c} />
            <InfoRow label="Battery Level" value="100% (Wireless)" color={c} status="ok" />
            <InfoRow label="Charge Method" value="Wireless Dock" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="SECONDARY & BIOMETRICS" color={c} />
            <InfoRow label="Haptic Glove" value="CONNECTED" color={c} status="ok" />
            <InfoRow label="Glove Protocol" value="BLE 6.0 Secure" color={c} />
            <InfoRow label="Glove Latency" value="0.1 ms" color={c} status="ok" />
            <InfoRow label="Finger Tracking" value="22 Points (ml-based)" color={c} />
            <InfoRow label="Pressure Sensors" value="128 (per glove)" color={c} />
            <InfoRow label="Biometric Auth" value="Fingerprint + Vein" color={c} status="ok" />
            <InfoRow label="Bio Read Rate" value="60 Hz Continuous" color={c} />
            <InfoRow label="Gesture Recog" value="AI Neural (99.9%)" color={c} status="ok" />
            <InfoRow label="Eye Tracker" value="ACTIVE — 120Hz" color={c} status="ok" />
            <InfoRow label="Eye Accuracy" value="0.3° (sub-pixel)" color={c} />
            <InfoRow label="Voice Input" value="Neural NLP Active" color={c} status="ok" />
            <InfoRow label="Keyboard" value="Optical MX Ultra" color={c} status="ok" />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== ABOUT / SYSTEM =====================
  if (type === "sys_about") {
    const c = "0,255,255";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at center, rgba(0,20,40,0.4) 0%, transparent 70%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Server size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>SYSTEM IDENTITY</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>NOVA WORKSTATION // FULL SYSTEM FIELD REPORT</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="ALL SYSTEMS OK" active={true} color={c} />
            <StatusBadge label="INTEGRITY 100%" active={true} color={c} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Server} label="DEVICE IDENTITY" color={c} />
            <InfoRow label="Device Name" value="NOVA-COMMAND-X9" color={c} status="ok" />
            <InfoRow label="OS Edition" value="NOVA OS Quantum" color={c} />
            <InfoRow label="OS Build" value="26200.100 (QE)" color={c} />
            <InfoRow label="OS Version" value="128-bit Edition" color={c} />
            <InfoRow label="System Type" value="128-bit Quantum OS" color={c} />
            <InfoRow label="Device ID" value="97FEFB8A-D628-..." color={c} />
            <InfoRow label="Product ID" value="00330-80000-00000" color={c} />
            <InfoRow label="Serial Number" value="NOVA-2026-X9-001" color={c} />
            <InfoRow label="Install Date" value="2026-01-01" color={c} />
            <InfoRow label="Last Boot" value={fmtUptime(uptime) + " ago"} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Cpu} label="HARDWARE SUMMARY" color={c} />
            <InfoRow label="Processor" value="Quantum-X 8.5GHz" color={c} status="ok" />
            <InfoRow label="Cores / Threads" value="128 / 256" color={c} />
            <InfoRow label="RAM" value="512 GB Q-DIMM" color={c} status="ok" />
            <InfoRow label="GPU" value="Holo-GPU 9000" color={c} status="ok" />
            <InfoRow label="VRAM" value="32 GB HBM3e" color={c} />
            <InfoRow label="Primary Storage" value="8.0 TB Crystal NVMe" color={c} status="ok" />
            <InfoRow label="Display" value="Quantum OLED 8K" color={c} />
            <InfoRow label="Network" value="100 Gbps Uplink" color={c} status="ok" />
            <InfoRow label="Motherboard" value="NOVA Quantum Board" color={c} />
            <InfoRow label="BIOS Version" value="NOVA Q90 v1.32" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="SECURITY STATUS" color={c} />
            <InfoRow label="Secure Boot" value="ENFORCED" color={c} status="ok" />
            <InfoRow label="TPM Version" value="3.0 (Active)" color={c} status="ok" />
            <InfoRow label="Encryption" value="AES-4096-GCM" color={c} status="ok" />
            <InfoRow label="Firewall" value="AEGIS-X Active" color={c} status="ok" />
            <InfoRow label="Antivirus" value="Real-time ON" color={c} status="ok" />
            <InfoRow label="ASLR" value="High Entropy ON" color={c} status="ok" />
            <InfoRow label="DEP" value="Hardware Enforced" color={c} status="ok" />
            <InfoRow label="VPN Tunnel" value="Active Proxy" color={c} status="ok" />
            <InfoRow label="Biometric Auth" value="Enrolled (Finger+Vein)" color={c} status="ok" />
            <InfoRow label="Last Security Scan" value="Today 06:00 AM" color={c} status="ok" />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== NETWORK SUB-PAGES =====================
  if (type === "net_wifi") {
    const c = "0,255,255";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(0,30,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Wifi size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>WI-FI ARRAY DIAGNOSTICS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>802.11be BEAMFORMING ANALYSIS</div>
            </div>
          </div>
          <StatusBadge label="RADIO ACTIVE" active={true} color={c} />
        </div>
        <MiniGraph data={graphs.d} color={c} label="SIGNAL TO NOISE RATIO (SNR)" height={80} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Radio} label="HARDWARE SPECS" color={c} />
            <InfoRow label="Interface" value="wlan0 (Quantum Wi-Fi 7)" color={c} status="ok" />
            <InfoRow label="MAC Address" value="00:1A:2B:3C:4D:5E" color={c} />
            <InfoRow label="Driver" value="nova_qnet_v8" color={c} />
            <InfoRow label="Band Supported" value="2.4 / 5 / 6 GHz" color={c} />
            <InfoRow label="Max TX Power" value="30 dBm" color={c} />
            <InfoRow label="Antenna Array" value="8x8 MU-MIMO" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="ACTIVE CONNECTION" color={c} />
            <InfoRow label="SSID" value="QUANTUM_NET_5G" color={c} status="ok" />
            <InfoRow label="BSSID" value="A1:B2:C3:D4:E5:F6" color={c} />
            <InfoRow label="Channel" value="44 (6GHz)" color={c} />
            <InfoRow label="Link Speed" value="8,540 Mbps" color={c} status="ok" />
            <InfoRow label="Signal Strength" value="-42 dBm" color={c} status="ok" />
            <InfoRow label="Security" value="WPA3-SAE" color={c} status="ok" />
          </Panel>
        </div>

        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <SectionTitle icon={Settings2} label="WI-FI CONFIGURATION & PROTOCOLS" color={c} />
          
          <ConfigRow 
            icon={Wifi} 
            title="Wi-Fi Array Power" 
            color={c}
            rightElement={
              <div onClick={(e) => { e.stopPropagation(); setWifiOn(!wifiOn); }} style={{ color: wifiOn ? `rgb(${c})` : "rgba(255,255,255,0.2)" }}>
                {wifiOn ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </div>
            }
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={Radio} 
              title="QUANTUM_NET_5G properties" 
              subtitle="Connected, secured (WPA3-SAE)" 
              color={c}
              onClick={() => setExpandProperties(!expandProperties)}
              rightElement={<div style={{ transform: expandProperties ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandProperties && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <InfoRow label="Network Profile" value="Private (Trusted)" color={c} />
                <InfoRow label="Security Type" value="WPA3-Personal" color={c} />
                <InfoRow label="IPv4 Address" value="192.168.99.204" color={c} />
                <InfoRow label="IPv4 DNS" value="1.1.1.1, 8.8.8.8" color={c} />
                <InfoRow label="IPv6 Address" value="fe80::1a2b:3c4d" color={c} />
                <InfoRow label="Manufacturer" value="NOVA Quantum Systems" color={c} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={Activity} 
              title="Show available networks" 
              color={c}
              onClick={() => setExpandAvailable(!expandAvailable)}
              rightElement={<div style={{ transform: expandAvailable ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandAvailable && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: `rgba(${c}, 0.1)`, borderRadius: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Wifi size={14} color={`rgb(${c})`} /> QUANTUM_NET_5G</div>
                  <span style={{ fontSize: "0.6rem", color: `rgb(${c})` }}>Connected</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", opacity: 0.7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Lock size={14} /> GUEST_NODE_BETA</div>
                  <span style={{ fontSize: "0.6rem" }}>Saved</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", opacity: 0.7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Lock size={14} /> SECURE_ORBIT_LINK</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={List} 
              title="Manage known networks" 
              subtitle="Add, remove, and edit networks" 
              color={c}
              onClick={() => setExpandKnown(!expandKnown)}
              rightElement={<div style={{ transform: expandKnown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandKnown && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>3 Networks saved</span>
                  <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "2px 8px", fontSize: "0.65rem", cursor: "pointer" }}>Add network</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.75rem" }}>QUANTUM_NET_5G</span>
                  <button style={{ background: "transparent", border: "none", color: `rgb(${c})`, fontSize: "0.65rem", cursor: "pointer" }}>Forget</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>GUEST_NODE_BETA</span>
                  <button style={{ background: "transparent", border: "none", color: `rgb(${c})`, fontSize: "0.65rem", cursor: "pointer", opacity: 0.7 }}>Forget</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>Home_Net_Old</span>
                  <button style={{ background: "transparent", border: "none", color: `rgb(${c})`, fontSize: "0.65rem", cursor: "pointer", opacity: 0.7 }}>Forget</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={HardDrive} 
              title="Hardware properties" 
              subtitle="View and manage Wi-Fi adapter properties" 
              color={c}
              onClick={() => setExpandHardware(!expandHardware)}
              rightElement={<div style={{ transform: expandHardware ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandHardware && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                 <InfoRow label="Name" value="Wi-Fi 7 (wlan0)" color={c} />
                 <InfoRow label="Description" value="NOVA Quantum Wireless Network Adapter" color={c} />
                 <InfoRow label="Physical address (MAC)" value="00:1A:2B:3C:4D:5E" color={c} />
                 <InfoRow label="Status" value="Operational" color={c} status="ok" />
                 <InfoRow label="Maximum transmission unit" value="1500" color={c} />
              </div>
            )}
          </div>

          <ConfigRow 
            icon={Shuffle} 
            title="Random hardware addresses" 
            subtitle="Help protect your privacy by making it harder for people to track your device location." 
            color={c}
            rightElement={
              <div onClick={(e) => { e.stopPropagation(); setRandomMac(!randomMac); }} style={{ color: randomMac ? `rgb(${c})` : "rgba(255,255,255,0.2)" }}>
                {randomMac ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </div>
            }
          />

          <div style={{ marginTop: "15px" }}>
            <SectionTitle icon={HelpCircle} label="RELATED SUPPORT" color={c} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 16px" }}>
              <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer", opacity: 0.8 }}>Connecting to Wi-Fi using a QR code</span>
              <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer", opacity: 0.8 }}>Finding your IP address easily</span>
              <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer", opacity: 0.8 }}>Run an internet speed test</span>
              <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer", opacity: 0.8 }}>Setting up mobile hotspot</span>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (type === "net_vpn") {
    const c = "0,255,100";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(0,40,20,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ShieldCheck size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>VPN SECURE TUNNEL</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>ZERO-TRUST PROXY NETWORK</div>
            </div>
          </div>
          <StatusBadge label="ENCRYPTED" active={true} color={c} />
        </div>
        <MiniGraph data={graphs.b} color={c} label="PACKET ENCRYPTION LATENCY (ms)" height={80} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Lock} label="TUNNEL DETAILS" color={c} />
            <InfoRow label="Provider" value="AEGIS-X Military Proxy" color={c} status="ok" />
            <InfoRow label="Server IP" value="[REDACTED]" color={c} />
            <InfoRow label="Protocol" value="WireGuard / Nova-Crypt" color={c} />
            <InfoRow label="Cipher" value="ChaCha20-Poly1305" color={c} status="ok" />
            <InfoRow label="Handshake" value="Curve25519" color={c} />
            <InfoRow label="Kill Switch" value="ARMED" color={c} status="ok" />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Globe} label="ROUTING METRICS" color={c} />
            <InfoRow label="Virtual IP" value="10.8.0.44" color={c} />
            <InfoRow label="Gateway" value="10.8.0.1" color={c} />
            <InfoRow label="DNS Leak Guard" value="ACTIVE" color={c} status="ok" />
            <InfoRow label="Bytes TX" value="45.2 GB" color={c} />
            <InfoRow label="Bytes RX" value="128.9 GB" color={c} />
            <InfoRow label="Uptime" value="14h 22m 10s" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  if (type === "net_hotspot") {
    const c = "255,170,0";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(40,25,0,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RadioTower size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>AD-HOC RELAY DIAGNOSTICS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>MOBILE HOTSPOT BROADCAST</div>
            </div>
          </div>
          <StatusBadge label="BROADCASTING" active={true} color={c} />
        </div>
        <MiniGraph data={graphs.c} color={c} label="CLIENT BANDWIDTH USAGE (MB/s)" height={80} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={RadioTower} label="AP CONFIGURATION" color={c} />
            <InfoRow label="Network Name" value="NOVA_RELAY_44" color={c} />
            <InfoRow label="Password" value="********" color={c} />
            <InfoRow label="Band" value="5 GHz" color={c} />
            <InfoRow label="Security" value="WPA3-Personal" color={c} />
            <InfoRow label="Max Clients" value="16" color={c} />
            <InfoRow label="Power Output" value="High (20 dBm)" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={User} label="CONNECTED CLIENTS (2)" color={c} />
            <InfoRow label="Client 1" value="Commander_Tablet (192.168.137.2)" color={c} status="ok" />
            <InfoRow label="Client 2" value="Drone_Node_A1 (192.168.137.3)" color={c} status="ok" />
            <InfoRow label="Data Shared" value="1.4 GB" color={c} />
            <InfoRow label="DHCP Leases" value="2 / 16" color={c} />
            <InfoRow label="Bandwidth Limit" value="Unrestricted" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  if (type === "net_airplane") {
    const c = "255,50,50";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(40,0,0,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Plane size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>RADIO SILENCE PROTOCOL</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>AIRPLANE MODE OVERRIDE</div>
            </div>
          </div>
          <StatusBadge label="STANDBY" active={false} color={c} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
          <Panel color={c}>
            <SectionTitle icon={Radio} label="RF EMITTERS" color={c} />
            <InfoRow label="Wi-Fi Array" value="ACTIVE" color={c} />
            <InfoRow label="Bluetooth" value="ACTIVE" color={c} />
            <InfoRow label="NFC / RFID" value="ACTIVE" color={c} />
            <InfoRow label="Cellular Modem" value="OFFLINE" color={c} />
            <InfoRow label="UWB Tracker" value="ACTIVE" color={c} />
          </Panel>
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", textAlign: "center", padding: "20px", border: `1px solid rgba(${c}, 0.2)`, borderRadius: "4px", background: `rgba(${c}, 0.05)` }}>
            <div style={{ color: `rgb(${c})`, letterSpacing: "2px" }}>
              <AlertTriangle size={32} style={{ margin: "0 auto 10px" }} />
              ENGAGING RADIO SILENCE WILL TERMINATE ALL UPLINK CONNECTIONS IMMEDIATELY.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "net_proxy") {
    const c = "150,100,255";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(20,0,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Network size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>PROXY SERVER ROUTING</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>SYSTEM-WIDE TRAFFIC REDIRECTION</div>
            </div>
          </div>
          <StatusBadge label="AUTOMATIC" active={true} color={c} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
          <Panel color={c}>
            <SectionTitle icon={Network} label="PROXY CONFIG" color={c} />
            <InfoRow label="Auto Detect" value="ON" color={c} status="ok" />
            <InfoRow label="Setup Script" value="http://proxy.nova/wpad.dat" color={c} />
            <InfoRow label="Manual Proxy" value="OFF" color={c} />
            <InfoRow label="SOCKS5 Auth" value="Required" color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Globe} label="BYPASS RULES" color={c} />
            <InfoRow label="Local Intranet" value="Bypassed" color={c} status="ok" />
            <InfoRow label="Exceptions" value="*.nova.local, 10.0.0.*" color={c} />
            <InfoRow label="Fallback" value="DIRECT" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  if (type === "net_dialup") {
    const c = "100,100,100";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(20,20,20,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Phone size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>LEGACY UPLINK HANDSHAKE</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>DIAL-UP / ANALOG MODEM INTERFACE</div>
            </div>
          </div>
          <StatusBadge label="OFFLINE" active={false} color={c} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
          <Panel color={c}>
            <SectionTitle icon={Phone} label="MODEM STATUS" color={c} />
            <InfoRow label="Hardware" value="NOVA V.92 56K" color={c} />
            <InfoRow label="Port" value="COM3" color={c} />
            <InfoRow label="Baud Rate" value="115200" color={c} />
            <InfoRow label="Line Status" value="No Dialtone" color={c} />
            <InfoRow label="AT Commands" value="Ready" color={c} />
          </Panel>
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", textAlign: "center", padding: "20px", border: `1px solid rgba(${c}, 0.2)`, borderRadius: "4px", background: `rgba(${c}, 0.05)` }}>
            <div style={{ color: `rgb(${c})`, letterSpacing: "2px", opacity: 0.5 }}>
              NO ACTIVE ANALOG CONNECTION DETECTED.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "net_advanced") {
    const c = "255,255,255";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top, rgba(40,40,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Settings2 size={28} style={{ color: `rgb(${c})`, filter: `drop-shadow(0 0 8px rgb(${c}))` }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>ADVANCED ADAPTER METRICS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>SYSTEM INTERFACES & ROUTING TABLES</div>
            </div>
          </div>
          <StatusBadge label="ADMIN" active={true} color={c} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
          <Panel color={c}>
            <SectionTitle icon={Network} label="PHYSICAL ADAPTERS" color={c} />
            <InfoRow label="eth0" value="10 Gbps (Disconnected)" color={c} />
            <InfoRow label="eth1" value="100 Gbps (Fiber Uplink)" color={c} status="ok" />
            <InfoRow label="wlan0" value="8.5 Gbps (Wi-Fi 7)" color={c} status="ok" />
            <InfoRow label="lo" value="Loopback Active" color={c} status="ok" />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={ShieldCheck} label="ROUTING & NAT" color={c} />
            <InfoRow label="Default Route" value="192.168.99.1 (wlan0)" color={c} />
            <InfoRow label="IPv4 Forwarding" value="ENABLED" color={c} status="ok" />
            <InfoRow label="NAT Translation" value="Strict / Port Restricted" color={c} />
            <InfoRow label="ARP Cache" value="14 Entries (Flushed 2h ago)" color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
      <div style={{ textAlign: "center" }}>
        <AlertTriangle size={40} style={{ marginBottom: "10px" }} />
        <div style={{ letterSpacing: "4px" }}>MODULE NOT FOUND: {type}</div>
      </div>
    </div>
  );
};

export default SystemDetailView;
