import React, { useState, useEffect, useRef } from "react";
import { Cpu, MemoryStick, HardDrive, Monitor, Server, Activity, Zap, Shield, Radio, Globe, Thermometer, AlertTriangle, CheckCircle, Clock, Plane, Phone, Network, Settings2, Wifi, RadioTower, ShieldCheck, Lock, User, ToggleLeft, ToggleRight, List, Shuffle, HelpCircle, ChevronRight, ChevronDown, Settings, Search, MessageSquare, Info, X } from "lucide-react";
import { invoke } from '@tauri-apps/api/core';

interface SystemDetailViewProps {
  type: string;
}

const ConfigRow = ({ icon: Icon, title, subtitle, rightElement, onClick, hideArrow, color = "0,255,255" }: any) => (
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
      {!hideArrow && !rightElement?.props?.hideArrow && <ChevronRight size={16} style={{ opacity: 0.4 }} />}
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
  const [vpnMetered, setVpnMetered] = useState(true);
  const [vpnRoaming, setVpnRoaming] = useState(true);
  const [expandVpn, setExpandVpn] = useState(false);
  const [hotspotOn, setHotspotOn] = useState(false);
  const [expandHotspotProps, setExpandHotspotProps] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [airplaneWifi, setAirplaneWifi] = useState(true);
  const [airplaneBluetooth, setAirplaneBluetooth] = useState(true);
  const [addModal, setAddModal] = useState<string | null>(null);

  const [graphs, setGraphs] = useState<{ [k: string]: number[] }>({
    a: Array(50).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
    b: Array(50).fill(0).map(() => Math.floor(Math.random() * 40) + 30),
    c: Array(50).fill(0).map(() => Math.floor(Math.random() * 60) + 5),
    d: Array(50).fill(0).map(() => Math.floor(Math.random() * 30) + 60),
  });
  const [cpuInfo, setCpuInfo] = useState<{ [key: string]: string }>({});
  const [cpuTelemetry, setCpuTelemetry] = useState<any>(null);
  const [netTelemetry, setNetTelemetry] = useState<any>(null);
  const [wifiNetworks, setWifiNetworks] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (type === "sys_cpu") {
      // Poll real CPU telemetry every 1 second
      const pollTelemetry = async () => {
        try {
          const data: any = await invoke('get_cpu_telemetry');
          if (!isMounted) return;
          setCpuTelemetry(data);
          setGraphs(prev => ({
            ...prev,
            a: [...prev.a.slice(1), Math.round(data.global_usage)],
            b: [...prev.b.slice(1), data.thermal_available ? Math.round(data.temperature_c) : prev.b[prev.b.length - 1]],
            c: [...prev.c.slice(1), data.power_available ? Math.round(data.power_draw_w) : prev.c[prev.c.length - 1]],
          }));
        } catch (err) {
          console.warn('get_cpu_telemetry failed', err);
        }
      };
      pollTelemetry();
      const iv = setInterval(() => {
        pollTelemetry();
        setTick(t => t + 1);
      }, 1000);
      return () => { isMounted = false; clearInterval(iv); };
    }

    if (type.startsWith("net_")) {
      const pollNet = async () => {
        try {
          const net: any = await invoke('get_network_telemetry');
          if (isMounted) setNetTelemetry(net);
          const w: any = await invoke('get_wifi_networks');
          if (isMounted && Array.isArray(w)) setWifiNetworks(w);
        } catch (_) {}
      };
      pollNet();
      const iv = setInterval(() => {
        pollNet();
        setTick(t => t + 1);
      }, 2000);
      return () => { isMounted = false; clearInterval(iv); };
    }

    const iv = setInterval(() => {
      setTick(t => t + 1);
      setGraphs(prev => ({
        a: [...prev.a.slice(1), Math.floor(Math.random() * 80) + 10],
        b: [...prev.b.slice(1), Math.floor(Math.random() * 40) + 30],
        c: [...prev.c.slice(1), Math.floor(Math.random() * 60) + 5],
        d: [...prev.d.slice(1), Math.floor(Math.random() * 20) + 70],
      }));
    }, 800);
    return () => { isMounted = false; clearInterval(iv); };
  }, [type]);

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
          <polyline points={pts} fill="none" stroke={`rgb(${color})`} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ opacity: 1 }} />
          <circle cx="100" cy={100 - (cur / max) * 100} r="3" fill="white" style={{ opacity: 1 }} />
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
    const t = cpuTelemetry;
    const curUtil = graphs.a[graphs.a.length - 1];
    const curTemp = graphs.b[graphs.b.length - 1];
    const curPower = graphs.c[graphs.c.length - 1];
    const cores: number[] = t?.per_core_usage ?? [];
    const cols = cores.length <= 4 ? 4 : cores.length <= 8 ? 4 : cores.length <= 16 ? 4 : 8;
    const fmtUptime2 = (s: number) => {
      const h = Math.floor(s / 3600).toString().padStart(2,'0');
      const m = Math.floor((s % 3600) / 60).toString().padStart(2,'0');
      const sc = (s % 60).toString().padStart(2,'0');
      return `${h}:${m}:${sc}`;
    };
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top left, rgba(0,40,60,0.3) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Cpu size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.1rem", letterSpacing: "3px", fontWeight: "bold", color: `rgb(${c})`, animation: "glow 3s infinite", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "500px" }}>
                {t?.model_name || "PROCESSOR DIAGNOSTICS"}
              </div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>CPU DIAGNOSTICS // REAL-TIME FIELD ANALYSIS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <StatusBadge label="ACTIVE" active={true} color={c} />
            <StatusBadge label={t?.thermal_available ? `${Math.round(t.temperature_c)}°C` : "TEMP N/A"} active={!t?.thermal_available || t.temperature_c < 85} color={c} />
            <StatusBadge label={t?.power_available ? `${curPower}W` : "PWR N/A"} active={true} color={c} />
          </div>
        </div>

        {/* ROW 1: GRAPHS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MiniGraph data={graphs.a} color={c} label={`CORE UTILIZATION — ${curUtil}%`} height={90} />
            <MiniGraph data={graphs.b} color="255,100,100" label={t?.thermal_available ? `THERMAL OUTPUT` : "THERMAL OUTPUT — SENSOR N/A"} height={60} suffix="°C" />
            <MiniGraph data={graphs.c} color="0,200,100" label={t?.power_available ? `PACKAGE POWER DRAW` : "POWER DRAW — SENSOR N/A"} height={60} suffix="W" />
          </div>
          {/* Real Core Load Map */}
          <div style={{ background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <SectionTitle icon={Cpu} label="CORE LOAD MAP" color={c} />
            {cores.length === 0 ? (
              <div style={{ fontSize: "0.6rem", opacity: 0.5, fontFamily: "var(--font-mono)" }}>LOADING...</div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "3px" }}>
                  {cores.map((load: number, i: number) => {
                    const l = Math.round(load);
                    const hue = l > 80 ? "255,80,80" : l > 50 ? "255,200,0" : c;
                    return (
                      <div key={i} title={`Core ${i}: ${l}%`} style={{ height: "22px", background: `rgba(${hue},${Math.max(l / 130, 0.08)})`, border: `1px solid rgba(${hue},0.4)`, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "0.45rem", color: `rgb(${hue})`, fontFamily: "var(--font-mono)", fontWeight: "bold" }}>{l}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: "0.55rem", opacity: 0.5, letterSpacing: "1px" }}>
                  {cores.length} LOGICAL CORES — {t?.physical_cores ?? "?"} PHYSICAL
                </div>
                <ProgressBar label={`TOTAL LOAD (${cores.length} CORES)`} value={curUtil} color={c} />
                <ProgressBar label="HIGHEST CORE" value={Math.round(Math.max(...cores, 0))} color="255,150,50" />
              </>
            )}
          </div>
        </div>

        {/* ROW 2: DATA TABLES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Cpu} label="IDENTITY & ARCHITECTURE" color={c} />
            <InfoRow label="Designation" value={t?.model_name?.split(" @")[0] || "N/A"} color={c} status="ok" />
            <InfoRow label="Vendor" value={t?.vendor || "N/A"} color={c} />
            <InfoRow label="Architecture" value={t?.architecture || "N/A"} color={c} />
            <InfoRow label="Stepping" value={t?.stepping || "N/A"} color={c} />
            <InfoRow label="Microcode Rev" value={t?.microcode || "N/A"} color={c} />
            <InfoRow label="Byte Order" value={t?.byte_order || "N/A"} color={c} />
            <InfoRow label="Sockets" value={t ? String(t.sockets) : "N/A"} color={c} />
            <InfoRow label="BogoMIPS" value={t?.bogomips || "N/A"} color={c} />
            <InfoRow label="Virtualization" value={t?.virtualization || "N/A"} color={c} status={t?.has_vt ? "ok" : undefined} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="PERFORMANCE TELEMETRY" color={c} />
            <InfoRow label="Base Clock" value={t ? `${t.base_clock_mhz.toFixed(0)} MHz` : "N/A"} color={c} />
            <InfoRow label="Logical CPUs" value={t ? String(t.logical_cores) : "N/A"} color={c} />
            <InfoRow label="Physical Cores" value={t ? String(t.physical_cores) : "N/A"} color={c} />
            <InfoRow label="Threads / Core" value={t ? String(t.threads_per_core) : "N/A"} color={c} />
            <InfoRow label="NUMA Nodes" value={t?.numa_nodes || "N/A"} color={c} />
            <InfoRow label="Core Voltage" value={t?.voltage_available ? `${t.core_voltage_v.toFixed(3)} V` : "SENSOR N/A"} color={c} status={t?.voltage_available ? "ok" : undefined} />
            <InfoRow label="Package Power" value={t?.power_available ? `${t.power_draw_w.toFixed(1)} W` : "SENSOR N/A"} color={c} />
            <InfoRow label="AVX / AVX2" value={t ? `${t.has_avx ? "AVX ✓" : "AVX ✗"}  ${t.has_avx2 ? "AVX2 ✓" : "AVX2 ✗"}` : "N/A"} color={c} />
            <InfoRow label="AES-NI" value={t?.has_aes ? "ACTIVE" : "N/A"} color={c} status={t?.has_aes ? "ok" : undefined} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="CACHE & SUBSYSTEM" color={c} />
            <InfoRow label="L1 Data Cache" value={t?.l1d_cache || "N/A"} color={c} />
            <InfoRow label="L1 Instr Cache" value={t?.l1i_cache || "N/A"} color={c} />
            <InfoRow label="L2 Cache" value={t?.l2_cache || "N/A"} color={c} />
            <InfoRow label="L3 Cache" value={t?.l3_cache || "N/A"} color={c} />
            <InfoRow label="Processes" value={t ? String(t.process_count) : "N/A"} color={c} />
            <InfoRow label="Threads (Active)" value={t ? String(t.thread_count) : "N/A"} color={c} />
            <InfoRow label="AVX-512" value={t?.has_avx512 ? "SUPPORTED" : "NOT SUPPORTED"} color={c} />
            <InfoRow label="Uptime" value={t ? fmtUptime2(t.uptime_secs) : fmtUptime(uptime)} color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== MEMORY =====================
  if (type === "sys_memory") {
    const c = "255,0,255";
    const [memData, setMemData] = useState<any>(null);
    const [memGraphs, setMemGraphs] = useState<{ used: number[], committed: number[], swap: number[] }>({
      used: Array(50).fill(0),
      committed: Array(50).fill(0),
      swap: Array(50).fill(0),
    });

    useEffect(() => {
      let alive = true;
      const poll = async () => {
        try {
          const m: any = await invoke('get_memory_telemetry');
          if (!alive) return;
          setMemData(m);
          const swapPct = m.swap_total_gb > 0 ? Math.round((m.swap_used_gb / m.swap_total_gb) * 100) : 0;
          const committedPct = m.total_gb > 0 ? Math.round((m.committed_gb / m.total_gb) * 100) : 0;
          setMemGraphs(prev => ({
            used: [...prev.used.slice(1), Math.round(m.used_percent)],
            committed: [...prev.committed.slice(1), committedPct],
            swap: [...prev.swap.slice(1), swapPct],
          }));
        } catch (_) {}
      };
      poll();
      const iv = setInterval(poll, 1000);
      return () => { alive = false; clearInterval(iv); };
    }, []);

    const m = memData;
    const slots: any[] = m?.slot_details ?? [];
    const totalSlots = m?.num_slots_total ?? 0;
    // Fill empty slots if we know total
    const slotRows = totalSlots > 0 ? slots : [];
    // Pad to totalSlots if needed
    while (slotRows.length < totalSlots) {
      slotRows.push({ label: `SLOT ?${slotRows.length + 1}`, populated: false, size_gb: 0, mem_type: "N/A", speed_mts: 0, manufacturer: "N/A", part_number: "N/A" });
    }

    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top right, rgba(40,0,60,0.3) 0%, transparent 60%)" }}>
        <style>{styles}</style>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <MemoryStick size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.1rem", letterSpacing: "3px", fontWeight: "bold", color: `rgb(${c})` }}>
                MEMORY SUBSYSTEM
              </div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
                {m ? `${m.total_gb.toFixed(1)} GB INSTALLED \u2014 ${m.mem_type !== "N/A" ? m.mem_type : "RAM"} ${m.speed_mts > 0 ? `@ ${m.speed_mts} MT/s` : ""}` : "MEMORY DIAGNOSTICS // REAL-TIME ANALYSIS"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <StatusBadge label={m?.ecc_enabled ? "ECC ACTIVE" : "ECC N/A"} active={m?.ecc_enabled ?? false} color={c} />
            <StatusBadge label={m?.dimm_has_info ? `${m.num_slots_used} SLOTS USED` : "DIMM N/A"} active={m?.dimm_has_info ?? false} color={c} />
            <StatusBadge label={`${m ? m.used_percent.toFixed(1) : "0"}% USED`} active={true} color={c} />
          </div>
        </div>

        {/* ROW 1: GRAPHS + SLOT MATRIX */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MiniGraph data={memGraphs.used} color={c} label={`MEMORY USAGE — ${m ? m.used_gb.toFixed(2) + " GB / " + m.total_gb.toFixed(1) + " GB" : "Loading..."}`} height={90} suffix="%" />
            <MiniGraph data={memGraphs.committed} color="200,100,255" label={`COMMITTED — ${m ? m.committed_gb.toFixed(1) + " GB" : "..."}`} height={60} suffix="%" />
            <MiniGraph data={memGraphs.swap} color="255,150,255" label={`SWAP — ${m ? m.swap_used_gb.toFixed(2) + " GB used of " + m.swap_total_gb.toFixed(1) + " GB" : "..."}`} height={60} suffix="%" />
          </div>

          {/* SLOT MATRIX */}
          <div style={{ background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <SectionTitle icon={MemoryStick} label="SLOT MATRIX" color={c} />
            {slotRows.length === 0 ? (
              <div style={{ fontSize: "0.6rem", opacity: 0.5, fontFamily: "var(--font-mono)" }}>
                {m ? "DIMM INFO: ROOT ACCESS NEEDED" : "LOADING..."}
              </div>
            ) : (
              slotRows.map((s: any, i: number) => (
                <div key={i} style={{ padding: "5px 8px", background: s.populated ? `rgba(${c},0.12)` : "rgba(255,255,255,0.02)", border: `1px solid rgba(${c},${s.populated ? 0.3 : 0.05})`, borderRadius: "2px", fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: s.populated ? `rgb(${c})` : "rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{s.label} {s.populated ? `\u2014 ${s.size_gb.toFixed(1)} GB` : "\u2014 EMPTY"}</span>
                  {s.populated && <CheckCircle size={10} style={{ color: "#00ff88" }} />}
                </div>
              ))
            )}
            <div style={{ marginTop: "4px" }}>
              <ProgressBar label={`IN USE: ${m ? m.used_gb.toFixed(1) : "0"} GB`} value={m ? m.used_gb : 0} max={m ? m.total_gb : 100} color={c} unit=" GB" />
            </div>
          </div>
        </div>

        {/* ROW 2: DATA TABLES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={MemoryStick} label="CAPACITY & USAGE" color={c} />
            <InfoRow label="Total Installed" value={m ? `${m.total_gb.toFixed(2)} GB` : "N/A"} color={c} status="ok" />
            <InfoRow label="In Use" value={m ? `${m.used_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Available" value={m ? `${m.available_gb.toFixed(2)} GB` : "N/A"} color={c} status="ok" />
            <InfoRow label="Free" value={m ? `${m.free_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Cached" value={m ? `${m.cached_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Buffers" value={m ? `${m.buffers_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Shared (shmem)" value={m ? `${m.shmem_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Mapped" value={m ? `${m.mapped_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Slab" value={m ? `${m.slab_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Committed" value={m ? `${m.committed_gb.toFixed(2)} GB` : "N/A"} color={c} />
            <InfoRow label="Swap Total" value={m ? `${m.swap_total_gb.toFixed(1)} GB` : "N/A"} color={c} />
            <InfoRow label="Swap Used" value={m ? `${m.swap_used_gb.toFixed(2)} GB` : "N/A"} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="HARDWARE INFO" color={c} />
            <InfoRow label="Memory Type" value={m?.mem_type || "N/A"} color={c} />
            <InfoRow label="Form Factor" value={m?.form_factor || "N/A"} color={c} />
            <InfoRow label="Speed" value={m?.speed_mts > 0 ? `${m.speed_mts} MT/s` : "N/A"} color={c} />
            <InfoRow label="Slots Used" value={m?.num_slots_total > 0 ? `${m.num_slots_used} of ${m.num_slots_total}` : "N/A"} color={c} />
            <InfoRow label="Manufacturer" value={m?.manufacturer || "N/A"} color={c} />
            <InfoRow label="Serial Number" value={m?.serial || "N/A"} color={c} />
            <InfoRow label="Channel Mode" value={m?.channels || "N/A"} color={c} status={m?.channels && m.channels !== "N/A" ? "ok" : undefined} />
            <InfoRow label="ECC Status" value={m?.ecc_enabled ? "ENABLED" : (m?.dimm_has_info ? "DISABLED" : "N/A")} color={c} status={m?.ecc_enabled ? "ok" : undefined} />
            {slotRows.filter((s: any) => s.populated).map((s: any, i: number) => (
              <InfoRow key={i} label={s.label} value={`${s.size_gb.toFixed(0)} GB \u2014 ${s.mem_type !== "N/A" ? s.mem_type : ""} ${s.part_number !== "N/A" ? s.part_number : ""}`.trim()} color={c} />
            ))}
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Shield} label="RUNTIME METRICS" color={c} />
            <InfoRow label="Usage %" value={m ? `${m.used_percent.toFixed(1)}%` : "N/A"} color={c} />
            <InfoRow label="Used (bytes)" value={m ? m.used_bytes.toLocaleString() : "N/A"} color={c} />
            <InfoRow label="Total (bytes)" value={m ? m.total_bytes.toLocaleString() : "N/A"} color={c} />
            <InfoRow label="Available (bytes)" value={m ? m.available_bytes.toLocaleString() : "N/A"} color={c} />
            <InfoRow label="Swap Total" value={m?.swap_total_bytes > 0 ? `${(m.swap_total_bytes / 1073741824).toFixed(1)} GB` : "0 GB"} color={c} />
            <InfoRow label="Swap Used" value={m?.swap_used_bytes > 0 ? `${(m.swap_used_bytes / 1073741824).toFixed(2)} GB` : "0 GB"} color={c} />
            <InfoRow label="Uptime" value={fmtUptime(uptime)} color={c} />
          </Panel>
        </div>
      </div>
    );
  }

  // ===================== GPU =====================
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Monitor size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>GRAPHICS ENGINE</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>{g?.name?.toUpperCase() || "GPU PIPELINE ANALYSIS"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label="RENDERING" active={true} color={c} />
            <StatusBadge label={`TEMP: ${gpuTemp.toFixed(1)}°C`} active={gpuTemp < 85} color={c} />
            <StatusBadge label={g?.opengl || "DX13.5 READY"} active={true} color={c} />
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
            <ProgressBar label="VRAM USAGE" value={g?.vram_mb || 18} max={g?.vram_total_mb || 32} color={c} unit=" MB" />
            <ProgressBar label="RT PIPELINE" value={Math.floor(gpuLoad * 0.7)} color={c} />
            <ProgressBar label="TENSOR (AI)" value={Math.floor(gpuLoad * 0.3)} color={c} />
            <ProgressBar label="COPY ENGINE" value={Math.floor(gpuLoad * 0.2)} color={c} />
            <div style={{ marginTop: "4px" }}>
              <SectionTitle icon={Thermometer} label="POWER & THERMAL" color={c} />
              <InfoRow label="Core Temp" value={`${gpuTemp.toFixed(1)}°C`} color={c} status={gpuTemp < 80 ? "ok" : "warn"} />
              <InfoRow label="Hotspot" value={`${(gpuTemp + 8).toFixed(1)}°C`} color={c} />
              <InfoRow label="TGP" value={`${g?.power_w > 0 ? g.power_w.toFixed(1) : Math.floor(gpuLoad * 4 + 100)} W`} color={c} />
              <InfoRow label="Fan Speed" value={`${Math.floor(gpuLoad * 12 + 800)} RPM`} color={c} />
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
            <InfoRow label="VRAM Total" value={g?.vram_total_mb > 0 ? `${g.vram_total_mb} MB` : "N/A"} color={c} />
            <InfoRow label="VRAM Used" value={g?.vram_mb > 0 ? `${g.vram_mb} MB` : "N/A"} color={c} />
            <InfoRow label="GPU Usage" value={`${gpuLoad.toFixed(1)}%`} color={c} />
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

  // ===================== NETWORK =====================
  if (type === "sys_network") {
    const c = "150,100,255";
    const [netData, setNetData] = useState<any>(null);
    const [wifiList, setWifiList] = useState<any[]>([]);
    const [netSpeed, setNetSpeed] = useState({ txSpeed: 0, rxSpeed: 0 });
    const [netGraphs, setNetGraphs] = useState<{ up: number[], down: number[] }>({
      up: Array(50).fill(0),
      down: Array(50).fill(0),
    });
    const prevBytes = useRef({ tx: 0, rx: 0, time: 0 });

    const formatSpeed = (bps: number) => {
      if (!bps || bps <= 0) return "0.00 MB/s";
      if (bps < 1024 * 1024) return `${(bps / 1024).toFixed(1)} KB/s`;
      return `${(bps / (1024 * 1024)).toFixed(2)} MB/s`;
    };

    const formatBytes = (bytes: number) => {
      if (!bytes || bytes <= 0) return "0.00 MB";
      if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
      return `${(bytes / 1e6).toFixed(2)} MB`;
    };

    useEffect(() => {
      let alive = true;
      const poll = async () => {
        try {
          const n: any = await invoke('get_network_telemetry');
          if (!alive) return;
          setNetData(n);

          const now = Date.now();
          let txSpd = 0;
          let rxSpd = 0;
          if (prevBytes.current.time > 0) {
            const timeDiff = (now - prevBytes.current.time) / 1000;
            if (timeDiff > 0) {
              const txDelta = Math.max(0, n.tx_bytes - prevBytes.current.tx);
              const rxDelta = Math.max(0, n.rx_bytes - prevBytes.current.rx);
              txSpd = txDelta / timeDiff;
              rxSpd = rxDelta / timeDiff;
              setNetSpeed({ txSpeed: txSpd, rxSpeed: rxSpd });
            }
          }
          prevBytes.current = { tx: n.tx_bytes, rx: n.rx_bytes, time: now };

          const calcPct = (bps: number) => {
            if (bps <= 0) {
              return Math.floor(Math.sin(Date.now() / 600) * 1.5 + 2.5);
            }
            const kb = bps / 1024;
            if (kb < 10) return Math.min(20, Math.max(5, kb * 2));
            if (kb < 100) return Math.min(45, 20 + ((kb - 10) / 90) * 25);
            if (kb < 1024) return Math.min(70, 45 + ((kb - 100) / 924) * 25);
            const mb = kb / 1024;
            return Math.min(100, 70 + (mb / 10) * 30);
          };

          setNetGraphs(prev => ({
            up: [...prev.up.slice(1), calcPct(txSpd)],
            down: [...prev.down.slice(1), calcPct(rxSpd)],
          }));
        } catch (_) {}
      };

      const scanWifi = async () => {
        try {
          const w: any = await invoke('get_wifi_networks');
          if (alive && Array.isArray(w)) setWifiList(w);
        } catch (_) {}
      };

      poll();
      scanWifi();
      const iv = setInterval(poll, 1000);
      const ivWifi = setInterval(scanWifi, 5000);
      return () => { alive = false; clearInterval(iv); clearInterval(ivWifi); };
    }, []);

    const n = netData;
    const isConnected = n?.has_info && n?.interface !== "N/A";
    const interfaceName = n?.interface || "N/A";
    const connType = n?.conn_type || (interfaceName.startsWith("wl") ? "Wi-Fi" : "Ethernet");
    const networkName = n?.network_name || (isConnected ? (connType === "Wi-Fi" ? "Wi-Fi Network" : "Host Network Bridge") : "N/A");
    const signalStrength = n?.signal_strength != null ? n.signal_strength : (isConnected ? 100 : 0);

    let iconLabel = "Hyper-Uplink";
    if (connType === "Wi-Fi") {
      iconLabel = "Wireless Adapter (802.11)";
    } else if (connType.includes("Virtual Link") || connType.includes("Bridge")) {
      iconLabel = "Host Virtual Network Bridge";
    } else {
      iconLabel = "Gigabit Ethernet Adapter";
    }

    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at top left, rgba(20,0,40,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Radio size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>NETWORK STACK</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>{interfaceName.toUpperCase()} // {networkName.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label={isConnected ? "CONNECTED" : "DISCONNECTED"} active={isConnected} color={c} />
            <StatusBadge label={connType.toUpperCase()} active={true} color={c} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <MiniGraph data={netGraphs.up} color={c} label={`UPLINK (TX) [${connType.toUpperCase()}] — ${formatSpeed(netSpeed.txSpeed)}`} height={100} suffix="%" />
          <MiniGraph data={netGraphs.down} color="200,150,255" label={`DOWNLINK (RX) [${connType.toUpperCase()}] — ${formatSpeed(netSpeed.rxSpeed)}`} height={100} suffix="%" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={Radio} label="LINK IDENTITY" color={c} />
            <InfoRow label="Network Name (SSID)" value={networkName} color={c} status={isConnected ? "ok" : "warn"} />
            <InfoRow label="Adapter Name" value={iconLabel} color={c} status="ok" />
            <InfoRow label="Interface" value={interfaceName} color={c} />
            <InfoRow label="Connection Type" value={connType} color={c} />
            <InfoRow label="Signal Strength" value={connType === "Wi-Fi" ? `${signalStrength}%` : (isConnected ? "100% (Direct/Bridge)" : "0%")} color={c} />
            <InfoRow label="Link Speed" value={n?.link_speed_mbps > 0 ? `${n.link_speed_mbps} Mbps` : (isConnected ? "1000 Mbps" : "N/A")} color={c} />
            <InfoRow label="MAC Address" value={n?.mac || "N/A"} color={c} />
            <InfoRow label="Duplex Mode" value={isConnected ? "Full Duplex" : "N/A"} color={c} />
            <InfoRow label="Protocol" value={connType === "Wi-Fi" ? "802.11ax/ac/n (Wireless)" : "802.3 Gigabit Ethernet"} color={c} />
            <InfoRow label="State" value={isConnected ? "UP (Connected)" : "DOWN"} color={c} status={isConnected ? "ok" : "warn"} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Globe} label="IP & ROUTING" color={c} />
            <InfoRow label="IPv4 Address" value={n?.ipv4 || "N/A"} color={c} status={n?.ipv4 && n.ipv4 !== "N/A" ? "ok" : "warn"} />
            <InfoRow label="IPv6 Address" value={n?.ipv6 || "N/A"} color={c} status={n?.ipv6 && n.ipv6 !== "N/A" ? "ok" : "warn"} />
            <InfoRow label="Default Gateway" value={n?.gateway || "N/A"} color={c} />
            <InfoRow label="DNS Server" value={n?.dns || "N/A"} color={c} />
            <InfoRow label="Subnet" value={n?.ipv4 && n.ipv4 !== "N/A" ? "255.255.255.0 (/24)" : "N/A"} color={c} />
            <InfoRow label="Routing" value={n?.gateway && n.gateway !== "N/A" ? "Active" : "None"} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={ShieldCheck} label="TRAFFIC STATISTICS" color={c} />
            <InfoRow label="Total TX" value={formatBytes(n?.tx_bytes)} color={c} />
            <InfoRow label="Total RX" value={formatBytes(n?.rx_bytes)} color={c} />
            <InfoRow label="Security" value={connType === "Wi-Fi" ? "WPA2/WPA3 / 802.11i" : "Bridged 802.3"} color={c} />
            <InfoRow label="Firewall" value="Active (ufw/iptables)" color={c} status="ok" />
          </Panel>
        </div>

        <Panel color={c}>
          <SectionTitle icon={Wifi} label="WIRELESS BEACON SCAN & SURROUNDING ACCESS POINTS" color={c} />
          {wifiList && wifiList.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px", marginTop: "10px" }}>
              {wifiList.map((net: any, idx: number) => {
                const isActive = net.ssid === networkName;
                return (
                  <div key={idx} style={{ padding: "10px", background: isActive ? `rgba(${c},0.15)` : "rgba(0,0,0,0.3)", border: `1px solid ${isActive ? `rgb(${c})` : `rgba(${c},0.2)`}`, borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Wifi size={16} color={isActive ? `rgb(${c})` : "#fff"} />
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: isActive ? `rgb(${c})` : "#fff" }}>{net.ssid}</div>
                        <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{net.security} • {net.freq_ghz} GHz</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: `rgb(${c})` }}>{net.signal_pct}%</div>
                      {isActive && <span style={{ fontSize: "0.55rem", background: `rgba(${c},0.2)`, padding: "2px 6px", borderRadius: "3px", color: `rgb(${c})`, fontWeight: "bold" }}>ACTIVE</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "14px", background: "rgba(0,0,0,0.3)", border: `1px dashed rgba(${c},0.3)`, borderRadius: "4px", marginTop: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
              <Globe size={22} color={`rgb(${c})`} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: "0.75rem", lineHeight: "1.4", opacity: 0.85 }}>
                {connType.includes("Bridge") || connType === "Ethernet" ? (
                  <span><strong>Virtual Hypervisor Link Active ({interfaceName}):</strong> Your host machine's Wi-Fi is actively bridged into this system. Network traffic and Internet access are fully routed. Over-the-air 802.11 beacon scanning is active on bare-metal boot or when a physical USB Wi-Fi dongle is attached.</span>
                ) : (
                  <span>No nearby Wi-Fi beacons discovered yet. Interface is actively listening on channel frequencies.</span>
                )}
              </div>
            </div>
          )}
        </Panel>
      </div>
    );
  }

  // ===================== STORAGE =====================
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HardDrive size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>STORAGE ARRAYS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
                {s ? `${s.primary_type.toUpperCase()} // ${s.total_gb.toFixed(1)} GB TOTAL` : "STORAGE ANALYSIS"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatusBadge label={s?.has_info ? "HEALTH: OK" : "N/A"} active={s?.has_info} color={c} />
            <StatusBadge label={s?.primary_type || "N/A"} active={true} color={c} />
          </div>
        </div>

        <div style={{ padding: "10px", background: `rgba(${c},0.03)`, border: `1px solid rgba(${c},0.15)`, borderRadius: "4px" }}>
          <SectionTitle icon={HardDrive} label={`PARTITION MAP — ${s ? s.total_gb.toFixed(1) : "0"} GB TOTAL`} color={c} />
          {disks.length === 0 ? (
             <div style={{ fontSize: "0.6rem", opacity: 0.5, fontFamily: "var(--font-mono)" }}>LOADING...</div>
          ) : (
            disks.map((p: any, i: number) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <ProgressBar label={`${p.mount} (${p.device})`} value={p.used_gb} max={p.total_gb} color={c} unit="GB" />
              </div>
            ))
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Panel color={c}>
            <SectionTitle icon={HardDrive} label="STORAGE IDENTITY" color={c} />
            <InfoRow label="Primary Type" value={s?.primary_type || "N/A"} color={c} status="ok" />
            <InfoRow label="Total Capacity" value={s ? `${s.total_gb.toFixed(1)} GB` : "N/A"} color={c} />
            <InfoRow label="Used Space" value={s ? `${s.used_gb.toFixed(1)} GB` : "N/A"} color={c} />
            <InfoRow label="Free Space" value={s ? `${s.free_gb.toFixed(1)} GB` : "N/A"} color={c} />
            <InfoRow label="Partitions" value={s ? String(disks.length) : "N/A"} color={c} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="PARTITION DETAILS" color={c} />
            {disks.slice(0, 5).map((p: any, i: number) => (
              <InfoRow key={i} label={p.mount} value={`${p.fs_type} - ${p.use_percent}%`} color={c} />
            ))}
            {disks.length > 5 && <InfoRow label="Others" value={`+${disks.length - 5} more`} color={c} />}
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

  // ===================== AUDIO =====================
  if (type === "sys_sound") {
    const c = "255,200,100";
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(ellipse at bottom, rgba(30,20,0,0.4) 0%, transparent 60%)" }}>
        <style>{styles}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(${c},0.3)`, paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Activity size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
            <Zap size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
            <Server size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
            <Wifi size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
            <InfoRow label="Interface" value={netTelemetry?.interface || "wlan0"} color={c} status="ok" />
            <InfoRow label="MAC Address" value={netTelemetry?.mac || "N/A"} color={c} />
            <InfoRow label="Connection Type" value={netTelemetry?.conn_type || "Wi-Fi"} color={c} />
            <InfoRow label="Band Supported" value={netTelemetry?.conn_type === "Wi-Fi" ? "2.4 / 5 / 6 GHz" : "Gigabit Virtual Link"} color={c} />
            <InfoRow label="Protocol" value={netTelemetry?.conn_type === "Wi-Fi" ? "802.11ax/ac/n (Wireless)" : "802.3 Gigabit Ethernet"} color={c} />
            <InfoRow label="State" value={netTelemetry?.has_info ? "Operational (UP)" : "Offline (DOWN)"} color={c} status={netTelemetry?.has_info ? "ok" : "warn"} />
          </Panel>
          <Panel color={c}>
            <SectionTitle icon={Activity} label="ACTIVE CONNECTION" color={c} />
            <InfoRow label="SSID / Bridge" value={netTelemetry?.network_name || "N/A"} color={c} status={netTelemetry?.network_name && netTelemetry.network_name !== "N/A" ? "ok" : "warn"} />
            <InfoRow label="IPv4" value={netTelemetry?.ipv4 || "N/A"} color={c} />
            <InfoRow label="IPv6" value={netTelemetry?.ipv6 || "N/A"} color={c} />
            <InfoRow label="Link Speed" value={netTelemetry?.link_speed_mbps > 0 ? `${netTelemetry.link_speed_mbps} Mbps` : "1000 Mbps"} color={c} status="ok" />
            <InfoRow label="Signal Strength" value={netTelemetry?.signal_strength != null ? `${netTelemetry.signal_strength}%` : "100%"} color={c} status="ok" />
            <InfoRow label="Security" value={netTelemetry?.conn_type === "Wi-Fi" ? "WPA2/WPA3-Personal" : "Bridged Direct Link"} color={c} status="ok" />
          </Panel>
        </div>

        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <SectionTitle icon={Settings2} label="WI-FI CONFIGURATION & PROTOCOLS" color={c} />
          
          <ConfigRow 
            icon={Wifi} 
            title="Wi-Fi Array Power" 
            color={c}
            hideArrow={true}
            rightElement={
              <div onClick={(e) => { e.stopPropagation(); setWifiOn(!wifiOn); }} style={{ color: wifiOn ? `rgb(${c})` : "rgba(255,255,255,0.2)" }}>
                {wifiOn ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </div>
            }
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={Radio} 
              title={`${netTelemetry?.network_name || "Network"} properties`} 
              subtitle={netTelemetry?.has_info ? `Connected, ${netTelemetry?.conn_type || 'Wi-Fi'}` : "Disconnected"} 
              color={c}
              hideArrow={true}
              onClick={() => setExpandProperties(!expandProperties)}
              rightElement={<div style={{ transform: expandProperties ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandProperties && (
              <div style={{ padding: "16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px", display: "flex", flexDirection: "column", gap: "20px", fontSize: "0.8rem", color: "#fff" }}>
                
                {/* Password & Autoconnect */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "16px", borderBottom: `1px solid rgba(${c}, 0.1)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Wi-Fi network password</span>
                    <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Show</button>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "fit-content" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: `rgb(${c})`, cursor: "pointer" }} />
                    <span>Connect automatically when in range</span>
                  </label>
                </div>

                {/* Network Profile */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "16px", borderBottom: `1px solid rgba(${c}, 0.1)` }}>
                  <span style={{ fontWeight: "bold", color: `rgb(${c})` }}>Network profile type</span>
                  
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", width: "fit-content" }}>
                    <input type="radio" name="profile" style={{ accentColor: `rgb(${c})`, marginTop: "3px", cursor: "pointer" }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>Public network (Recommended)</span>
                      <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>Your device is not discoverable on the network. Use this in most cases.</span>
                    </div>
                  </label>
                  
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", width: "fit-content" }}>
                    <input type="radio" name="profile" defaultChecked style={{ accentColor: `rgb(${c})`, marginTop: "3px", cursor: "pointer" }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>Private network</span>
                      <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>Your device is discoverable on the network. Select this if you need file sharing.</span>
                    </div>
                  </label>

                  <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer", marginTop: "4px", width: "fit-content" }}>Configure firewall and security settings</span>
                </div>

                {/* Metered connection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "16px", borderBottom: `1px solid rgba(${c}, 0.1)` }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div style={{ display: "flex", flexDirection: "column" }}>
                       <span>Metered connection</span>
                       <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>Some apps might work differently to reduce data usage.</span>
                     </div>
                     <ToggleLeft size={24} style={{ color: "rgba(255,255,255,0.2)", cursor: "pointer" }} />
                   </div>
                   <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer", width: "fit-content" }}>Set a data limit to help control data usage</span>
                </div>

                {/* Random hardware addresses */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: `1px solid rgba(${c}, 0.1)` }}>
                   <div style={{ display: "flex", flexDirection: "column", paddingRight: "20px" }}>
                     <span>Random hardware addresses</span>
                     <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>Help protect your privacy by making it harder for people to track your device location.</span>
                   </div>
                   <select style={{ background: "rgba(0,0,0,0.5)", color: "#fff", border: `1px solid rgba(${c}, 0.3)`, padding: "4px 8px", borderRadius: "4px", outline: "none", cursor: "pointer" }}>
                     <option>Off</option>
                     <option>On</option>
                     <option>Change daily</option>
                   </select>
                </div>

                {/* IP & DNS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "16px", borderBottom: `1px solid rgba(${c}, 0.1)` }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <span style={{ opacity: 0.8 }}>IP assignment:</span>
                     <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                       <span style={{ opacity: 0.8 }}>Automatic (DHCP)</span>
                       <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Edit</button>
                     </div>
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <span style={{ opacity: 0.8 }}>DNS server assignment:</span>
                     <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                       <span style={{ opacity: 0.8 }}>Automatic (DHCP)</span>
                       <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Edit</button>
                     </div>
                   </div>
                </div>

                {/* Data Transmission Graph */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "16px", borderBottom: `1px solid rgba(${c}, 0.1)` }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <span style={{ opacity: 0.8 }}>DATA TRANSMISSION (KB/s)</span>
                     <span style={{ color: `rgb(${c})`, fontSize: "0.8rem", letterSpacing: "1px" }}>{graphs.d[graphs.d.length - 1]} KB/s</span>
                   </div>
                   <MiniGraph data={graphs.d} color={c} height={40} />
                </div>

                {/* Readonly Properties */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                   <div style={{ position: "absolute", top: 0, right: 0 }}>
                     <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Copy</button>
                   </div>
                   
                   {[
                     ["Connected On:", new Date().toLocaleDateString()],
                     ["Connected At:", new Date(Date.now() - (tick + 8450) * 1000).toLocaleTimeString()],
                     ["Duration:", fmtUptime(tick + 8450)],
                     ["SSID / Network:", netTelemetry?.network_name || "N/A"],
                     ["Protocol:", netTelemetry?.conn_type === "Wi-Fi" ? "Wi-Fi (802.11ax/ac/n)" : "Ethernet (802.3)"],
                     ["Security type:", netTelemetry?.conn_type === "Wi-Fi" ? "WPA2/WPA3-Personal" : "Bridged Direct Link"],
                     ["Manufacturer:", netTelemetry?.conn_type?.includes("Bridge") ? "VirtualBox / Hypervisor" : "OEM Network Interface"],
                     ["Interface:", netTelemetry?.interface || "N/A"],
                     ["Aggregated link speed:", netTelemetry?.link_speed_mbps > 0 ? `${netTelemetry.link_speed_mbps} Mbps` : "1000 Mbps"],
                     ["IPv6 address:", netTelemetry?.ipv6 || "N/A"],
                     ["IPv4 address:", netTelemetry?.ipv4 || "N/A"],
                     ["IPv4 default gateway:", netTelemetry?.gateway || "N/A"],
                     ["IPv4 DNS servers:", netTelemetry?.dns || "N/A"],
                     ["Physical address (MAC):", netTelemetry?.mac || "N/A"],
                   ].map(([label, value]) => (
                     <div key={label} style={{ display: "grid", gridTemplateColumns: "220px 1fr", padding: "2px 0" }}>
                       <span style={{ opacity: 0.8 }}>{label}</span>
                       <span style={{ color: `rgb(${c})`, fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{value}</span>
                     </div>
                   ))}
                </div>

                {/* Advanced Properties */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: `1px solid rgba(${c}, 0.1)` }}>
                   <span style={{ opacity: 0.8 }}>Advanced Wi-Fi network properties</span>
                   <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Edit</button>
                </div>

              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={Activity} 
              title="Show available networks" 
              color={c}
              hideArrow={true}
              onClick={() => setExpandAvailable(!expandAvailable)}
              rightElement={<div style={{ transform: expandAvailable ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandAvailable && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {wifiNetworks && wifiNetworks.length > 0 ? (
                  wifiNetworks.map((net: any, idx: number) => {
                    const isAct = net.ssid === netTelemetry?.network_name;
                    return (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: isAct ? `rgba(${c}, 0.15)` : "rgba(0,0,0,0.3)", borderRadius: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Wifi size={14} color={`rgb(${c})`} /> <span>{net.ssid}</span> <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>({net.freq_ghz} GHz)</span></div>
                        <span style={{ fontSize: "0.6rem", color: `rgb(${c})` }}>{isAct ? "Connected" : `${net.signal_pct}%`}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: `rgba(${c}, 0.1)`, borderRadius: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Wifi size={14} color={`rgb(${c})`} /> {netTelemetry?.network_name || "Host Wi-Fi Bridge"}</div>
                    <span style={{ fontSize: "0.6rem", color: `rgb(${c})` }}>{netTelemetry?.has_info ? "Connected (Bridged)" : "No signal"}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={List} 
              title="Manage known networks" 
              subtitle="Add, remove, and edit networks" 
              color={c}
              hideArrow={true}
              onClick={() => setExpandKnown(!expandKnown)}
              rightElement={<div style={{ transform: expandKnown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandKnown && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{wifiNetworks.length > 0 ? `${wifiNetworks.length} Networks detected` : "1 Network connected"}</span>
                  <button className="hud-clickable" onClick={() => setAddModal(addModal === 'wifi' ? null : 'wifi')} style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "2px 8px", fontSize: "0.65rem", cursor: "pointer", boxShadow: `0 0 5px rgba(${c},0.2) inset` }}>{addModal === 'wifi' ? 'Cancel' : 'Add network'}</button>
                </div>
                
                {addModal && addModal.startsWith('wifi') && (
                  <div style={{ padding: "20px", background: `rgba(${c}, 0.03)`, border: `1px solid rgba(${c}, 0.3)`, borderRadius: "4px", position: "relative", overflow: "hidden", marginTop: "10px", marginBottom: "15px", boxShadow: `0 0 15px rgba(${c}, 0.1) inset` }}>
                     <div style={{ position: "absolute", top: 0, left: "-100%", width: "50%", height: "2px", background: `linear-gradient(90deg, transparent, rgb(${c}), transparent)`, animation: "scanMini 3s linear infinite" }}></div>
                     <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `rgb(${c})`, opacity: 0.2, boxShadow: `0 0 10px rgb(${c})` }}></div>
                     
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <span style={{ fontSize: "0.9rem", letterSpacing: "1px", color: `rgb(${c})`, textShadow: `0 0 8px rgba(${c},0.5)` }}>
                          {addModal === 'wifi' ? 'SELECT UPLINK NODE' : `AUTHENTICATE: ${addModal.replace('wifi_', '')}`}
                        </span>
                        <X size={16} className="hud-clickable" onClick={() => setAddModal(null)} style={{ cursor: "pointer", opacity: 0.7, color: `rgb(${c})` }} />
                     </div>
                     
                     <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {addModal === 'wifi' ? (
                          <>
                            {wifiNetworks.length > 0 ? (
                              wifiNetworks.map((net: any, idx: number) => (
                                <div key={idx} className="hud-clickable" onClick={() => setAddModal(`wifi_${net.ssid}`)} style={{ padding: "10px", border: `1px solid rgba(${c},0.2)`, borderRadius: "4px", background: "rgba(0,0,0,0.3)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Lock size={14} color={`rgb(${c})`} /> <span>{net.ssid}</span></div>
                                  <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{net.security}</span>
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: "10px", opacity: 0.7, fontSize: "0.8rem" }}>No additional networks discovered in range.</div>
                            )}
                          </>
                        ) : (
                          <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                               <span style={{ fontSize: "0.7rem", opacity: 0.8, color: `rgb(${c})` }}>SECURITY KEY</span>
                               <input type="password" autoFocus placeholder="Enter network security key" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(${c},0.3)`, borderRadius: "2px", padding: "6px", color: "#fff", outline: "none", fontSize: "0.8rem", borderLeft: `3px solid rgb(${c})` }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "5px" }}>
                               <button className="hud-clickable" onClick={() => setAddModal('wifi')} style={{ background: "transparent", border: `1px solid rgba(${c},0.3)`, color: "#fff", borderRadius: "2px", padding: "4px 12px", cursor: "pointer", fontSize: "0.7rem" }}>BACK</button>
                               <button className="hud-clickable" onClick={() => setAddModal(null)} style={{ background: `rgba(${c}, 0.2)`, border: `1px solid rgb(${c})`, color: `rgb(${c})`, borderRadius: "2px", padding: "4px 12px", cursor: "pointer", fontWeight: "bold", fontSize: "0.7rem", boxShadow: `0 0 5px rgba(${c}, 0.4)` }}>CONNECT</button>
                            </div>
                          </>
                        )}
                     </div>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.75rem" }}>{netTelemetry?.network_name || "Host Wi-Fi Bridge"}</span>
                  <button style={{ background: "transparent", border: "none", color: `rgb(${c})`, fontSize: "0.65rem", cursor: "pointer" }}>Active</button>
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
              hideArrow={true}
              onClick={() => setExpandHardware(!expandHardware)}
              rightElement={<div style={{ transform: expandHardware ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandHardware && (
              <div style={{ padding: "12px 16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                 <InfoRow label="Name" value={`${netTelemetry?.conn_type || 'Ethernet'} (${netTelemetry?.interface || 'eth0'})`} color={c} />
                 <InfoRow label="Description" value={netTelemetry?.conn_type?.includes("Bridge") ? "VirtualBox Bridged Network Adapter" : "Physical Network Controller"} color={c} />
                 <InfoRow label="Physical address (MAC)" value={netTelemetry?.mac || "N/A"} color={c} />
                 <InfoRow label="Status" value={netTelemetry?.has_info ? "Operational (UP)" : "DOWN"} color={c} status="ok" />
                 <InfoRow label="Maximum transmission unit" value="1500" color={c} />
              </div>
            )}
          </div>

          <ConfigRow 
            icon={Shuffle} 
            title="Random hardware addresses" 
            subtitle="Help protect your privacy by making it harder for people to track your device location." 
            color={c}
            hideArrow={true}
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
            <ShieldCheck size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>VPN SECURE TUNNEL</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>ZERO-TRUST PROXY NETWORK</div>
            </div>
          </div>
          <StatusBadge label="ENCRYPTED" active={true} color={c} />
        </div>
        <MiniGraph data={graphs.b} color={c} label="PACKET ENCRYPTION LATENCY (ms)" height={80} />
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConfigRow 
              icon={ShieldCheck} 
              title="VPN connections" 
              color={c}
              hideArrow={true}
              rightElement={<button className="hud-clickable" onClick={() => setAddModal(addModal === 'vpn' ? null : 'vpn')} style={{ background: addModal === 'vpn' ? `rgba(${c}, 0.2)` : `rgb(${c})`, border: `1px solid rgb(${c})`, color: addModal === 'vpn' ? `rgb(${c})` : "#000", borderRadius: "4px", padding: "6px 14px", cursor: "pointer", fontWeight: "bold", boxShadow: addModal === 'vpn' ? `0 0 5px rgba(${c}, 0.5) inset` : "none" }}>{addModal === 'vpn' ? 'Cancel' : 'Add VPN'}</button>}
            />
            {addModal === 'vpn' && (
              <div style={{ padding: "20px", background: `rgba(${c}, 0.03)`, border: `1px solid rgba(${c}, 0.3)`, borderRadius: "4px", position: "relative", overflow: "hidden", marginTop: "4px", marginBottom: "15px", boxShadow: `0 0 15px rgba(${c}, 0.1) inset` }}>
                 <div style={{ position: "absolute", top: 0, left: "-100%", width: "50%", height: "2px", background: `linear-gradient(90deg, transparent, rgb(${c}), transparent)`, animation: "scanMini 3s linear infinite" }}></div>
                 <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `rgb(${c})`, opacity: 0.2, boxShadow: `0 0 10px rgb(${c})` }}></div>
                 
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <span style={{ fontSize: "0.9rem", letterSpacing: "1px", color: `rgb(${c})`, textShadow: `0 0 8px rgba(${c},0.5)` }}>CONFIGURE SECURE TUNNEL</span>
                    <X size={16} className="hud-clickable" onClick={() => setAddModal(null)} style={{ cursor: "pointer", opacity: 0.7, color: `rgb(${c})` }} />
                 </div>
                 
                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                       <span style={{ fontSize: "0.7rem", opacity: 0.8, color: `rgb(${c})` }}>VPN PROVIDER</span>
                       <select style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(${c},0.3)`, borderRadius: "2px", padding: "6px", color: "#fff", outline: "none", fontSize: "0.8rem", borderLeft: `3px solid rgb(${c})` }}>
                          <option>NOVA Quantum Proxy</option>
                          <option>Windows (built-in)</option>
                       </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                       <span style={{ fontSize: "0.7rem", opacity: 0.8, color: `rgb(${c})` }}>CONNECTION IDENTIFIER</span>
                       <input type="text" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(${c},0.3)`, borderRadius: "2px", padding: "6px", color: "#fff", outline: "none", fontSize: "0.8rem", borderLeft: `3px solid rgb(${c})` }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                       <span style={{ fontSize: "0.7rem", opacity: 0.8, color: `rgb(${c})` }}>SERVER NODE ADDRESS</span>
                       <input type="text" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(${c},0.3)`, borderRadius: "2px", padding: "6px", color: "#fff", outline: "none", fontSize: "0.8rem", borderLeft: `3px solid rgb(${c})` }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                       <span style={{ fontSize: "0.7rem", opacity: 0.8, color: `rgb(${c})` }}>TUNNEL PROTOCOL</span>
                       <select style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(${c},0.3)`, borderRadius: "2px", padding: "6px", color: "#fff", outline: "none", fontSize: "0.8rem", borderLeft: `3px solid rgb(${c})` }}>
                          <option>IKEv2 / IPsec</option>
                          <option>Automatic Routing</option>
                          <option>L2TP/IPsec with PKI</option>
                       </select>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "5px" }}>
                       <button className="hud-clickable" onClick={() => setAddModal(null)} style={{ background: "transparent", border: `1px solid rgba(${c},0.3)`, color: "#fff", borderRadius: "2px", padding: "4px 12px", cursor: "pointer", fontSize: "0.7rem" }}>DISCARD</button>
                       <button className="hud-clickable" onClick={() => setAddModal(null)} style={{ background: `rgba(${c}, 0.2)`, border: `1px solid rgb(${c})`, color: `rgb(${c})`, borderRadius: "2px", padding: "4px 12px", cursor: "pointer", fontWeight: "bold", fontSize: "0.7rem", boxShadow: `0 0 5px rgba(${c}, 0.4)` }}>ESTABLISH TUNNEL</button>
                    </div>
                 </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "4px" }}>
            <ConfigRow 
              icon={Lock} 
              title="AEGIS-X Military Proxy" 
              subtitle="Connected"
              color={c}
              hideArrow={true}
              onClick={() => setExpandVpn(!expandVpn)}
              rightElement={<div style={{ transform: expandVpn ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandVpn && (
              <div style={{ padding: "16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px", display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.8rem", color: "#fff" }}>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Disconnect</button>
                  <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Advanced options</button>
                  <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>Remove</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: `1px solid rgba(${c}, 0.1)`, paddingTop: "16px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                     <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>CONNECTION PROPERTIES</span>
                     <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "4px" }}>
                       <span style={{ opacity: 0.8 }}>Server IP:</span>
                       <span style={{ color: `rgb(${c})` }}>185.100.12.94</span>
                       <span style={{ opacity: 0.8 }}>Protocol:</span>
                       <span style={{ color: `rgb(${c})` }}>WireGuard</span>
                       <span style={{ opacity: 0.8 }}>Cipher:</span>
                       <span style={{ color: `rgb(${c})` }}>ChaCha20</span>
                     </div>
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                     <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>ROUTING METRICS</span>
                     <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "4px" }}>
                       <span style={{ opacity: 0.8 }}>Virtual IP:</span>
                       <span style={{ color: `rgb(${c})` }}>10.8.0.44</span>
                       <span style={{ opacity: 0.8 }}>Bytes Sent:</span>
                       <span style={{ color: `rgb(${c})` }}>45.2 GB</span>
                       <span style={{ opacity: 0.8 }}>Bytes Recv:</span>
                       <span style={{ color: `rgb(${c})` }}>128.9 GB</span>
                     </div>
                   </div>
                </div>

              </div>
            )}
          </div>
          
          <div style={{ marginTop: "15px" }}>
             <SectionTitle icon={Settings2} label="Advanced settings for all VPN connections" color={c} />
             <ConfigRow 
               icon={Activity} 
               title="Allow VPN over metered networks" 
               color={c}
               hideArrow={true}
               rightElement={
                 <div onClick={(e) => { e.stopPropagation(); setVpnMetered(!vpnMetered); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: vpnMetered ? `rgb(${c})` : "rgba(255,255,255,0.2)" }}>
                   <span style={{ fontSize: "0.8rem", color: "#fff" }}>{vpnMetered ? "On" : "Off"}</span>
                   {vpnMetered ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                 </div>
               }
             />
             <ConfigRow 
               icon={Globe} 
               title="Allow VPN while roaming" 
               color={c}
               hideArrow={true}
               rightElement={
                 <div onClick={(e) => { e.stopPropagation(); setVpnRoaming(!vpnRoaming); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: vpnRoaming ? `rgb(${c})` : "rgba(255,255,255,0.2)" }}>
                   <span style={{ fontSize: "0.8rem", color: "#fff" }}>{vpnRoaming ? "On" : "Off"}</span>
                   {vpnRoaming ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                 </div>
               }
             />
          </div>

          <div style={{ marginTop: "15px" }}>
            <SectionTitle icon={HelpCircle} label="Related support" color={c} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 16px", background: `rgba(${c}, 0.05)`, border: `1px solid rgba(${c}, 0.2)`, borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Globe size={16} style={{ opacity: 0.8 }} /> <span>Help with VPN</span></div>
                 <ChevronDown size={16} style={{ opacity: 0.4 }} />
              </div>
              <div style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer" }}>Setting up a secure VPN connection</span>
                <span className="hud-clickable" style={{ color: `rgb(${c})`, fontSize: "0.75rem", cursor: "pointer" }}>Setting up a VPN</span>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px 16px" }}>
              <span className="hud-clickable" style={{ color: "#fff", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><Search size={14} /> Get help</span>
              <span className="hud-clickable" style={{ color: "#fff", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><MessageSquare size={14} /> Give feedback</span>
            </div>
          </div>
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
            <RadioTower size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>AD-HOC RELAY DIAGNOSTICS</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>MOBILE HOTSPOT BROADCAST</div>
            </div>
          </div>
          <StatusBadge label="BROADCASTING" active={true} color={c} />
        </div>
        <MiniGraph data={graphs.c} color={c} label="CLIENT BANDWIDTH USAGE (MB/s)" height={80} />
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <ConfigRow 
            icon={RadioTower} 
            title="Mobile hotspot" 
            color={c}
            hideArrow={true}
            rightElement={
              <div onClick={(e) => { e.stopPropagation(); setHotspotOn(!hotspotOn); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: hotspotOn ? `rgb(${c})` : "rgba(255,255,255,0.2)" }}>
                <span style={{ fontSize: "0.8rem", color: "#fff" }}>{hotspotOn ? "On" : "Off"}</span>
                {hotspotOn ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </div>
            }
          />
          
          <ConfigRow 
            icon={Globe} 
            title="Share my internet connection from" 
            color={c}
            hideArrow={true}
            rightElement={
              <select style={{ background: "rgba(0,0,0,0.5)", color: "#fff", border: `1px solid rgba(${c}, 0.3)`, padding: "6px 10px", borderRadius: "4px", outline: "none", cursor: "pointer", width: "120px" }}>
                <option>Wi-Fi 3</option>
                <option>Ethernet</option>
              </select>
            }
          />

          <ConfigRow 
            icon={Activity} 
            title="Share over" 
            color={c}
            hideArrow={true}
            rightElement={
              <select style={{ background: "rgba(0,0,0,0.5)", color: "#fff", border: `1px solid rgba(${c}, 0.3)`, padding: "6px 10px", borderRadius: "4px", outline: "none", cursor: "pointer", width: "120px" }}>
                <option>Wi-Fi</option>
                <option>Bluetooth</option>
              </select>
            }
          />

          <div style={{ marginTop: "15px" }}>
            <ConfigRow 
              icon={Settings2} 
              title="Properties" 
              color={c}
              hideArrow={true}
              onClick={() => setExpandHotspotProps(!expandHotspotProps)}
              rightElement={<div style={{ transform: expandHotspotProps ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={16} style={{ opacity: 0.4 }} /></div>}
            />
            {expandHotspotProps && (
              <div style={{ padding: "16px", background: `rgba(${c}, 0.02)`, border: `1px solid rgba(${c}, 0.1)`, borderRadius: "4px", marginBottom: "8px", marginTop: "-4px", display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.8rem", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <span style={{ opacity: 0.8 }}>Network properties</span>
                   <button className="hud-clickable" style={{ background: `rgba(${c}, 0.1)`, border: `1px solid rgba(${c}, 0.4)`, color: `rgb(${c})`, borderRadius: "4px", padding: "4px 16px", cursor: "pointer" }}>Edit</button>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px", paddingLeft: "16px" }}>
                   <span style={{ opacity: 0.8 }}>Name:</span>
                   <span>DESKTOP-SCPJCON 7340</span>
                   <span style={{ opacity: 0.8 }}>Password:</span>
                   <span>j6N-6134</span>
                   <span style={{ opacity: 0.8 }}>Band:</span>
                   <span>Any available</span>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <div style={{ opacity: 0.8, marginBottom: "8px" }}>Scan to connect:</div>
                  <div style={{ width: "100px", height: "100px", background: "#fff", padding: "4px", borderRadius: "4px" }}>
                    <svg viewBox="0 0 10 10" style={{ width: "100%", height: "100%" }}>
                      <rect width="10" height="10" fill="#fff" />
                      <path d="M1 1h3v3H1z M6 1h3v3H6z M1 6h3v3H1z M2 2h1v1H2z M7 2h1v1H7z M2 7h1v1H2z M4.5 1h1v1h-1z M4.5 2.5h1v1h-1z M1 4.5h1v1H1z M2.5 4.5h1v1h-1z M4.5 4.5h1v1h-1z M6 4.5h1v1H6z M7.5 4.5h1.5v1H7.5z M4.5 6h1v1h-1z M6 6h1v1H6z M7.5 6h1v1H7.5z M6 7.5h3v1H6z M4.5 7.5h1v1.5h-1z" fill="#000" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "15px" }}>
            <SectionTitle icon={HelpCircle} label="Related support" color={c} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 16px", background: `rgba(${c}, 0.05)`, border: `1px solid rgba(${c}, 0.2)`, borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Globe size={16} style={{ opacity: 0.8 }} /> <span>Help with Mobile hotspot</span></div>
                 <ChevronDown size={16} style={{ opacity: 0.4 }} />
              </div>
            </div>
          </div>
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
            <Plane size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
            <div>
              <div style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: "bold", color: `rgb(${c})` }}>RADIO SILENCE PROTOCOL</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>AIRPLANE MODE OVERRIDE</div>
            </div>
          </div>
          <StatusBadge label="STANDBY" active={false} color={c} />
        </div>
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(0,120,215,0.1)", border: "1px solid rgba(0,120,215,0.3)", padding: "12px", borderRadius: "4px", marginBottom: "8px" }}>
             <Info size={16} style={{ color: "rgb(0,120,215)", marginTop: "2px", flexShrink: 0 }} />
             <span style={{ fontSize: "0.8rem", color: "#fff", opacity: 0.9 }}>
               We'll remember if you turn on Bluetooth or Wi-Fi after turning on airplane mode. Next time you use airplane mode, Bluetooth or Wi-Fi won't change.
             </span>
          </div>

          <ConfigRow 
            icon={Plane} 
            title="Airplane mode" 
            color={c}
            hideArrow={true}
            rightElement={
              <div onClick={(e) => { e.stopPropagation(); setAirplaneMode(!airplaneMode); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: airplaneMode ? `rgb(${c})` : "rgba(255,255,255,0.2)", cursor: "pointer" }}>
                <span style={{ fontSize: "0.8rem", color: "#fff" }}>{airplaneMode ? "On" : "Off"}</span>
                {airplaneMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </div>
            }
          />

          <div style={{ marginTop: "15px" }}>
            <SectionTitle icon={Radio} label="Wireless devices" color={c} />
            <ConfigRow 
               icon={Wifi} 
               title="Wi-Fi 3" 
               subtitle="Stays on in airplane mode"
               color={c}
               hideArrow={true}
               rightElement={
                 <div onClick={(e) => { e.stopPropagation(); setAirplaneWifi(!airplaneWifi); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: airplaneWifi ? `rgb(0,255,255)` : "rgba(255,255,255,0.2)", cursor: "pointer" }}>
                   <span style={{ fontSize: "0.8rem", color: "#fff" }}>{airplaneWifi ? "On" : "Off"}</span>
                   {airplaneWifi ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                 </div>
               }
             />
             <ConfigRow 
               icon={RadioTower} 
               title="Bluetooth" 
               color={c}
               hideArrow={true}
               rightElement={
                 <div onClick={(e) => { e.stopPropagation(); setAirplaneBluetooth(!airplaneBluetooth); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: airplaneBluetooth ? `rgb(0,255,255)` : "rgba(255,255,255,0.2)", cursor: "pointer" }}>
                   <span style={{ fontSize: "0.8rem", color: "#fff" }}>{airplaneBluetooth ? "On" : "Off"}</span>
                   {airplaneBluetooth ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                 </div>
               }
             />
          </div>

          <div style={{ marginTop: "15px" }}>
            <SectionTitle icon={HelpCircle} label="Related support" color={c} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 16px", background: `rgba(${c}, 0.05)`, border: `1px solid rgba(${c}, 0.2)`, borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Globe size={16} style={{ opacity: 0.8 }} /> <span>Help with Airplane mode</span></div>
                 <ChevronDown size={16} style={{ opacity: 0.4 }} />
              </div>
              <div style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span className="hud-clickable" style={{ color: `rgb(0,255,255)`, fontSize: "0.75rem", cursor: "pointer" }}>Activating airplane mode easily</span>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px 16px" }}>
              <span className="hud-clickable" style={{ color: "#fff", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><Search size={14} /> Get help</span>
              <span className="hud-clickable" style={{ color: "#fff", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><MessageSquare size={14} /> Give feedback</span>
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
            <Network size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
            <Phone size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
            <Settings2 size={28} style={{ color: `rgb(${c})`, opacity: 1 }} />
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
