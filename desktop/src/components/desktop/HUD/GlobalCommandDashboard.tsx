import React, { useState, useEffect } from "react";
import { Cpu, MemoryStick, HardDrive, Monitor, Activity, Radio, Globe, Shield, Zap, ExternalLink } from "lucide-react";
import { invoke } from '@tauri-apps/api/core';

interface GlobalCommandDashboardProps {
  onOpenSubApp?: (id: string, label: string) => void;
}

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

const SectionHeader = ({ icon: Icon, title, color, appId, appLabel, onOpenSubApp }: any) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", color: `rgb(${color})` }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Icon size={24} /> <span style={{ letterSpacing: "2px", fontWeight: "bold" }}>{title}</span>
    </div>
    <button 
      className="hud-clickable"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onOpenSubApp) {
          onOpenSubApp(appId, appLabel);
        }
      }}
      style={{ 
        background: `rgba(${color}, 0.1)`, border: `1px solid rgba(${color}, 0.3)`, 
        color: `rgb(${color})`, padding: "4px 8px", fontSize: "0.55rem", 
        cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
        letterSpacing: "1px", position: "relative", zIndex: 10, pointerEvents: "auto"
      }}
    >
      DEEP SCAN <ExternalLink size={10} />
    </button>
  </div>
);

const GlobalCommandDashboard: React.FC<GlobalCommandDashboardProps> = ({ onOpenSubApp }) => {
  const [dataPoints, setDataPoints] = useState<{ [key: string]: number[] }>({
    cpu: Array(40).fill(0),
    ram: Array(40).fill(0),
    netUp: Array(40).fill(0),
    netDown: Array(40).fill(0),
    gpu: Array(40).fill(0),
    disk: Array(40).fill(0),
  });

  const [liveStats, setLiveStats] = useState({
    memUsedGB: 0,
    memTotalGB: 0,
    temp: "N/A"
  });
  const [memTelemetry, setMemTelemetry] = useState<any>(null);

  const [cpuInfo, setCpuInfo] = useState<{ [key: string]: string }>({});
  const [uptime, setUptime] = useState(25300);

  useEffect(() => {
    let isMounted = true;

    const fetchAdvancedStats = async () => {
      try {
        const advancedInfo: any = await invoke('get_advanced_cpu_info');
        if (isMounted) setCpuInfo(advancedInfo);
      } catch (err) {
        console.warn("Failed to fetch advanced CPU info", err);
        if (isMounted) setCpuInfo({
          "Model name": "Simulated Processor (Dev Mode) @ 3.4GHz",
          "Vendor ID": "SimulatedVendor",
          "Architecture": "x86_64",
          "CPU(s)": "16",
          "Thread(s) per core": "2",
          "Socket(s)": "1"
        });
      }
    };
    fetchAdvancedStats();

    const interval = setInterval(async () => {
      try {
        const stats: any = await invoke('get_system_stats');
        if (!isMounted) return;

        const memUsedGB = stats.memory_used / (1024 * 1024 * 1024);
        const memTotalGB = stats.memory_total / (1024 * 1024 * 1024);
        const memPercent = memTotalGB > 0 ? (memUsedGB / memTotalGB) * 100 : 0;

        setLiveStats({
          memUsedGB,
          memTotalGB,
          temp: stats.temperature
        });

        setDataPoints(prev => ({
          cpu: [...prev.cpu.slice(1), stats.cpu_usage || 0],
          ram: [...prev.ram.slice(1), memPercent || 0],
          netUp: [...prev.netUp.slice(1), Math.floor(Math.random() * 90) + 5],
          netDown: [...prev.netDown.slice(1), Math.floor(Math.random() * 90) + 5],
          gpu: [...prev.gpu.slice(1), Math.floor(Math.random() * 70) + 20],
          disk: [...prev.disk.slice(1), Math.floor(Math.random() * 40)],
        }));

        // Fetch detailed memory telemetry every cycle
        try {
          const mem: any = await invoke('get_memory_telemetry');
          if (isMounted) setMemTelemetry(mem);
        } catch (_) {}

      } catch (err) {
        if (!isMounted) return;
        setDataPoints(prev => ({
          cpu: [...prev.cpu.slice(1), Math.floor(Math.random() * 80) + 10],
          ram: [...prev.ram.slice(1), Math.floor(Math.random() * 20) + 40],
          netUp: [...prev.netUp.slice(1), Math.floor(Math.random() * 90) + 5],
          netDown: [...prev.netDown.slice(1), Math.floor(Math.random() * 90) + 5],
          gpu: [...prev.gpu.slice(1), Math.floor(Math.random() * 70) + 20],
          disk: [...prev.disk.slice(1), Math.floor(Math.random() * 40)],
        }));
      }
      if (isMounted) setUptime(prev => prev + 1);
    }, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", background: "radial-gradient(circle at center, rgba(0,20,40,0.8) 0%, rgba(0,5,10,0.95) 100%)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.3)", paddingBottom: "15px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Shield size={40} color="#00ffff" style={{ filter: "drop-shadow(0 0 10px #00ffff)" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: "5px", color: "#00ffff", textShadow: "0 0 15px #00ffff", textTransform: "uppercase" }}>Global Command Center</h1>
            <div style={{ fontSize: "0.75rem", color: "#00ffff", opacity: 0.7, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>HEADQUARTERS OMNI-VIEW // SYSTEM INTEGRITY 100%</div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#00ffff" }}>
          <div style={{ fontSize: "0.7rem", opacity: 0.7, letterSpacing: "2px" }}>MISSION TIME</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", textShadow: "0 0 10px #00ffff" }}>{formatUptime(uptime)}</div>
        </div>
      </div>

      {/* 4-COLUMN GRID FOR MAJOR SYSTEMS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", flex: 1 }}>
        
        {/* CPU COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,255,255,0.02)", padding: "15px", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px" }}>
          <SectionHeader icon={Cpu} title="PROCESSOR ARRAY" color="0,255,255" appId="sys_cpu" appLabel="CPU DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
          <SvgLineGraph data={dataPoints.cpu} color="0, 255, 255" label="GLOBAL UTILIZATION" height={100} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="MODEL" value={cpuInfo["Model name"]?.split(" @")[0] || "N/A"} color="0,255,255" />
            <MiniDetail label="VENDOR" value={cpuInfo["Vendor ID"] || "N/A"} color="0,255,255" />
            <MiniDetail label="ARCHITECTURE" value={cpuInfo["Architecture"] || "N/A"} color="0,255,255" />
            
            <MiniDetail label="CORES" value={cpuInfo["CPU(s)"] || "N/A"} color="0,255,255" />
            <MiniDetail label="THREADS / CORE" value={cpuInfo["Thread(s) per core"] || "N/A"} color="0,255,255" />
            <MiniDetail label="SOCKETS" value={cpuInfo["Socket(s)"] || "N/A"} color="0,255,255" />
            
            <MiniDetail label="CLOCK" value={cpuInfo["Model name"]?.split("@ ")[1] || "N/A"} color="0,255,255" />
            <MiniDetail label="BOGOMIPS" value={cpuInfo["BogoMIPS"] || "N/A"} color="0,255,255" />
            <MiniDetail label="TEMP" value={liveStats.temp} color="0,255,255" />
            
            <MiniDetail label="VIRTUALIZATION" value={cpuInfo["Virtualization"] || "N/A"} color="0,255,255" />
            <MiniDetail label="STEPPING" value={cpuInfo["Stepping"] || "N/A"} color="0,255,255" />
            <MiniDetail label="BYTE ORDER" value={cpuInfo["Byte Order"] || "N/A"} color="0,255,255" />
            
            <MiniDetail label="L1d CACHE" value={cpuInfo["L1d cache"] || "N/A"} color="0,255,255" />
            <MiniDetail label="L1i CACHE" value={cpuInfo["L1i cache"] || "N/A"} color="0,255,255" />
            <MiniDetail label="L2 CACHE" value={cpuInfo["L2 cache"] || "N/A"} color="0,255,255" />
            <MiniDetail label="L3 CACHE" value={cpuInfo["L3 cache"] || "N/A"} color="0,255,255" />
          </div>
        </div>

        {/* RAM COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,0,255,0.02)", padding: "15px", border: "1px solid rgba(255,0,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={MemoryStick} title="MEMORY SUBSYSTEM" color="255,0,255" appId="sys_memory" appLabel="MEMORY DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.ram} color="255, 0, 255" label={memTelemetry ? `RAM USAGE — ${memTelemetry.used_percent.toFixed(1)}%` : "RAM ALLOCATION"} height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="TOTAL" value={memTelemetry ? `${memTelemetry.total_gb.toFixed(1)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="IN USE" value={memTelemetry ? `${memTelemetry.used_gb.toFixed(1)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="AVAILABLE" value={memTelemetry ? `${memTelemetry.available_gb.toFixed(1)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="FREE" value={memTelemetry ? `${memTelemetry.free_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="CACHED" value={memTelemetry ? `${memTelemetry.cached_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="BUFFERS" value={memTelemetry ? `${memTelemetry.buffers_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="SHARED" value={memTelemetry ? `${memTelemetry.shmem_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="MAPPED" value={memTelemetry ? `${memTelemetry.mapped_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="SLAB" value={memTelemetry ? `${memTelemetry.slab_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="COMMITTED" value={memTelemetry ? `${memTelemetry.committed_gb.toFixed(1)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="SWAP TOTAL" value={memTelemetry ? `${memTelemetry.swap_total_gb.toFixed(1)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="SWAP USED" value={memTelemetry ? `${memTelemetry.swap_used_gb.toFixed(2)} GB` : "N/A"} color="255,0,255" />
            <MiniDetail label="MEM TYPE" value={memTelemetry?.mem_type || "N/A"} color="255,0,255" />
            <MiniDetail label="FORM FACTOR" value={memTelemetry?.form_factor || "N/A"} color="255,0,255" />
            <MiniDetail label="SPEED" value={memTelemetry?.speed_mts > 0 ? `${memTelemetry.speed_mts} MT/s` : "N/A"} color="255,0,255" />
            <MiniDetail label="SLOTS USED" value={memTelemetry?.num_slots_total > 0 ? `${memTelemetry.num_slots_used} of ${memTelemetry.num_slots_total}` : "N/A"} color="255,0,255" />
            <MiniDetail label="MANUFACTURER" value={memTelemetry?.manufacturer || "N/A"} color="255,0,255" />
            <MiniDetail label="SERIAL" value={memTelemetry?.serial || "N/A"} color="255,0,255" />
          </div>
        </div>

        {/* GPU COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,136,0,0.02)", padding: "15px", border: "1px solid rgba(255,136,0,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <SectionHeader icon={Monitor} title="GRAPHICS ENGINE" color="255,136,0" appId="sys_graphics" appLabel="GPU DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
          <div style={{ flexShrink: 0 }}>
            <SvgLineGraph data={dataPoints.gpu} color="255, 136, 0" label="GPU COMPUTE" height={100} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="MODEL" value="Holo-GPU 9k" color="255,136,0" />
            <MiniDetail label="VRAM" value="32 GB" color="255,136,0" />
            <MiniDetail label="MEMORY TYPE" value="HBM3e" color="255,136,0" />
            <MiniDetail label="CLOCK (CORE)" value="3.2 GHz" color="255,136,0" />
            <MiniDetail label="CLOCK (MEM)" value="24.0 Gbps" color="255,136,0" />
            <MiniDetail label="TEMP" value={`${Math.floor(dataPoints.gpu[39]*0.4 + 25)}°C`} color="255,136,0" />
            <MiniDetail label="SHADERS" value="16,384" color="255,136,0" />
            <MiniDetail label="COMPUTE UNITS" value="128 CU" color="255,136,0" />
            <MiniDetail label="RT CORES" value="512" color="255,136,0" />
            <MiniDetail label="TENSOR CORES" value="2048" color="255,136,0" />
            <MiniDetail label="DIRECTX" value="DX 13.5" color="255,136,0" />
            <MiniDetail label="SHARED MEM" value="16 GB" color="255,136,0" />
            <MiniDetail label="BUS WIDTH" value="4096-Bit" color="255,136,0" />
            <MiniDetail label="BANDWIDTH" value="3,072 GB/s" color="255,136,0" />
            <MiniDetail label="PIXEL FILL" value="1,024 GP/s" color="255,136,0" />
            <MiniDetail label="TEXTURE FILL" value="2,048 GT/s" color="255,136,0" />
            <MiniDetail label="PCIE BUS" value="Gen6 x16" color="255,136,0" />
            <MiniDetail label="DRIVER VER" value="560.12 Q" color="255,136,0" />
            <MiniDetail label="BIOS VER" value="95.00.1A" color="255,136,0" />
            <MiniDetail label="ROPs" value="512" color="255,136,0" />
            <MiniDetail label="TMUs" value="1024" color="255,136,0" />
            <MiniDetail label="L2 CACHE" value="128 MB" color="255,136,0" />
            <MiniDetail label="INF. CACHE" value="256 MB" color="255,136,0" />
            <MiniDetail label="V-CORE" value="1.05 V" color="255,136,0" />
            <MiniDetail label="FAN SPEED" value="1500 RPM" color="255,136,0" />
            <MiniDetail label="HOTSPOT" value="42°C" color="255,136,0" />
            <MiniDetail label="TGP" value="450 W" color="255,136,0" />
            <MiniDetail label="DIE SIZE" value="600 mm²" color="255,136,0" />
            <MiniDetail label="TRANSISTORS" value="80 Billion" color="255,136,0" />
            <MiniDetail label="ENCODER" value="NVENC v10" color="255,136,0" />
            <MiniDetail label="DECODER" value="AV1 / HEVC" color="255,136,0" />
            <MiniDetail label="NVLINK" value="Inactive" color="255,136,0" />
          </div>
        </div>

        {/* NETWORK & STORAGE COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", overflow: "hidden" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(150,100,255,0.02)", padding: "15px", border: "1px solid rgba(150,100,255,0.1)", borderRadius: "4px", flex: 1, overflow: "hidden" }}>
            <SectionHeader icon={Radio} title="NETWORK UPLINK" color="150,100,255" appId="sys_network" appLabel="NETWORK DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <SvgLineGraph data={dataPoints.netUp} color="150, 100, 255" label="TX (Gbps)" height={40} suffix=" G" />
              <SvgLineGraph data={dataPoints.netDown} color="150, 100, 255" label="RX (Gbps)" height={40} suffix=" G" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", overflowY: "auto", paddingRight: "5px" }}>
               <MiniDetail label="IPv4" value="192.168.1.100" color="150,100,255" />
               <MiniDetail label="IPv6" value="fe80::1a2b" color="150,100,255" />
               <MiniDetail label="PING" value="0.1 ms" color="150,100,255" />
               <MiniDetail label="MAC" value="00:1A:2B:3C:4D" color="150,100,255" />
               <MiniDetail label="DNS" value="1.1.1.1" color="150,100,255" />
               <MiniDetail label="LOSS" value="0%" color="150,100,255" />
               <MiniDetail label="LINK" value="100 Gbps" color="150,100,255" />
               <MiniDetail label="PROTOCOL" value="802.11be" color="150,100,255" />
               <MiniDetail label="GATEWAY" value="192.168.1.1" color="150,100,255" />
               <MiniDetail label="DHCP LEASE" value="23h 59m" color="150,100,255" />
               <MiniDetail label="SIGNAL" value="-30 dBm" color="150,100,255" />
               <MiniDetail label="CHANNEL" value="160 MHz" color="150,100,255" />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(0,255,136,0.02)", padding: "15px", border: "1px solid rgba(0,255,136,0.1)", borderRadius: "4px", flex: 1, overflow: "hidden" }}>
            <SectionHeader icon={HardDrive} title="STORAGE ARRAYS" color="0,255,136" appId="sys_storage" appLabel="STORAGE DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
            <div style={{ flexShrink: 0 }}>
              <SvgLineGraph data={dataPoints.disk} color="0, 255, 136" label="I/O ACTIVITY" height={50} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", overflowY: "auto", paddingRight: "5px" }}>
               <MiniDetail label="CAPACITY" value="8.0 TB" color="0,255,136" />
               <MiniDetail label="SPEED" value="12.5 GB/s" color="0,255,136" />
               <MiniDetail label="TYPE" value="Crystal NVMe" color="0,255,136" />
               <MiniDetail label="FS" value="QFS v3" color="0,255,136" />
               <MiniDetail label="SECTORS" value="15,625K" color="0,255,136" />
               <MiniDetail label="HEALTH" value="100%" color="0,255,136" />
               <MiniDetail label="CONTROLLER" value="Phison-Q" color="0,255,136" />
               <MiniDetail label="NAND TYPE" value="SLC 3D" color="0,255,136" />
               <MiniDetail label="SMART STAT" value="PASS" color="0,255,136" />
               <MiniDetail label="TEMP" value="40°C" color="0,255,136" />
               <MiniDetail label="PWR CYCLES" value="128" color="0,255,136" />
               <MiniDetail label="WR AMPLIFY" value="1.0x" color="0,255,136" />
            </div>
          </div>

        </div>

        {/* DISPLAY COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(100,200,255,0.02)", padding: "15px", border: "1px solid rgba(100,200,255,0.1)", borderRadius: "4px" }}>
          <SectionHeader icon={Monitor} title="DISPLAY SUBSYSTEM" color="100,200,255" appId="sys_display" appLabel="DISPLAY DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
          <SvgLineGraph data={dataPoints.cpu.map(x => 100 - (x/5))} color="100, 200, 255" label="REFRESH STABILITY" height={100} suffix="%" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="PRIMARY" value="Quantum OLED" color="100,200,255" />
            <MiniDetail label="RESOLUTION" value="7680 x 4320" color="100,200,255" />
            <MiniDetail label="REFRESH" value="240.00 Hz" color="100,200,255" />
            <MiniDetail label="DEPTH" value="12-bit RGB" color="100,200,255" />
            <MiniDetail label="COLOR SPACE" value="DCI-P3 110%" color="100,200,255" />
            <MiniDetail label="HDR" value="HDR10+" color="100,200,255" />
            <MiniDetail label="BRIGHTNESS" value="4000 nits" color="100,200,255" />
            <MiniDetail label="SYNC" value="G-Sync Ult." color="100,200,255" />
            <MiniDetail label="RESPONSE" value="0.01 ms" color="100,200,255" />
            <MiniDetail label="PIXEL PITCH" value="0.05 mm" color="100,200,255" />
            <MiniDetail label="DELTA E" value="< 1.0" color="100,200,255" />
            <MiniDetail label="DIMMING" value="Per-Pixel" color="100,200,255" />
            <MiniDetail label="CONTRAST" value="Infinite:1" color="100,200,255" />
            <MiniDetail label="PANEL TYPE" value="Micro-LED" color="100,200,255" />
            <MiniDetail label="INTERFACE" value="DP 2.1" color="100,200,255" />
            <MiniDetail label="HDCP" value="Version 2.3" color="100,200,255" />
          </div>
        </div>

        {/* AUDIO & INPUT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(255,200,100,0.02)", padding: "15px", border: "1px solid rgba(255,200,100,0.1)", borderRadius: "4px", flex: 1 }}>
            <SectionHeader icon={Activity} title="AUDIO INTERFACE" color="255,200,100" appId="sys_sound" appLabel="AUDIO DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
            <SvgLineGraph data={dataPoints.ram.map(x => x/2 + 20)} color="255, 200, 100" label="OUTPUT DB" height={40} suffix=" dB" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", overflowY: "auto", paddingRight: "5px" }}>
               <MiniDetail label="CHIP" value="Spatial DAC" color="255,200,100" />
               <MiniDetail label="FORMAT" value="32-bit 384kHz" color="255,200,100" />
               <MiniDetail label="CHANNELS" value="7.1.4 Atmos" color="255,200,100" />
               <MiniDetail label="IMPEDANCE" value="600 Ohms" color="255,200,100" />
               <MiniDetail label="SNR" value="130 dB" color="255,200,100" />
               <MiniDetail label="THD+N" value="0.0001%" color="255,200,100" />
               <MiniDetail label="DSP" value="Active" color="255,200,100" />
               <MiniDetail label="CROSSTALK" value="-120 dB" color="255,200,100" />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(255,100,150,0.02)", padding: "15px", border: "1px solid rgba(255,100,150,0.1)", borderRadius: "4px", flex: 1 }}>
            <SectionHeader icon={Zap} title="INPUT DEVICES" color="255,100,150" appId="sys_input" appLabel="INPUT DIAGNOSTICS" onOpenSubApp={onOpenSubApp} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", overflowY: "auto", paddingRight: "5px" }}>
               <MiniDetail label="PRIMARY" value="Neural Sync" color="255,100,150" />
               <MiniDetail label="POLLING" value="8000 Hz" color="255,100,150" />
               <MiniDetail label="LATENCY" value="0.05 ms" color="255,100,150" />
               <MiniDetail label="TRACKING" value="6DOF Sub-mm" color="255,100,150" />
               <MiniDetail label="HAPTICS" value="HD Linear" color="255,100,150" />
               <MiniDetail label="ACTUATION" value="Optical" color="255,100,150" />
               <MiniDetail label="PROTOCOL" value="Lightspeed" color="255,100,150" />
               <MiniDetail label="DEBOUNCE" value="0 ms" color="255,100,150" />
            </div>
          </div>

        </div>

        {/* SECURITY & KERNEL COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,50,50,0.02)", padding: "15px", border: "1px solid rgba(255,50,50,0.1)", borderRadius: "4px" }}>
          <SectionHeader icon={Shield} title="SECURITY & KERNEL" color="255,50,50" appId="sys_about" appLabel="SYSTEM ABOUT" onOpenSubApp={onOpenSubApp} />
          <SvgLineGraph data={dataPoints.netDown.map(x => 100 - x/10)} color="255, 50, 50" label="THREAT MITIGATION" height={100} suffix="%" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="KERNEL" value="Quantum v0.1.0" color="255,50,50" />
            <MiniDetail label="FIREWALL" value="Aegis-X Active" color="255,50,50" />
            <MiniDetail label="ENCRYPTION" value="AES-4096-GCM" color="255,50,50" />
            <MiniDetail label="BIOS" value="NOVA Q90" color="255,50,50" />
            <MiniDetail label="DEFENDER" value="Real-time ON" color="255,50,50" />
            <MiniDetail label="TPM" value="Module 3.0" color="255,50,50" />
            <MiniDetail label="INTEGRITY" value="100% Verified" color="255,50,50" />
            <MiniDetail label="SANDBOX" value="Isolated" color="255,50,50" />
            <MiniDetail label="SECURE BOOT" value="Enforced" color="255,50,50" />
            <MiniDetail label="DEP" value="Hardware" color="255,50,50" />
            <MiniDetail label="ASLR" value="High Entropy" color="255,50,50" />
            <MiniDetail label="ANTI-CHEAT" value="Ring-0" color="255,50,50" />
            <MiniDetail label="0-DAY PROT" value="AI Heuristics" color="255,50,50" />
            <MiniDetail label="AUTH" value="Biometric" color="255,50,50" />
            <MiniDetail label="DATA VAULT" value="Encrypted" color="255,50,50" />
            <MiniDetail label="VPN TUNNEL" value="Active Proxy" color="255,50,50" />
          </div>
        </div>

        {/* DEVICE INFO COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", background: "rgba(255,255,255,0.02)", padding: "15px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px" }}>
          <SectionHeader icon={Globe} title="DEVICE INFO & POWER" color="255,255,255" appId="sys_about" appLabel="SYSTEM ABOUT" onOpenSubApp={onOpenSubApp} />
          <SvgLineGraph data={dataPoints.cpu.map(x => (x * 3) + 200)} color="255, 255, 255" label="POWER DRAW (W)" height={100} suffix=" W" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", paddingRight: "5px" }}>
            <MiniDetail label="DEVICE NAME" value="NOVA-X9" color="255,255,255" />
            <MiniDetail label="SYSTEM TYPE" value="128-bit OS" color="255,255,255" />
            <MiniDetail label="DEVICE ID" value="97FEFB8A..." color="255,255,255" />
            <MiniDetail label="PRODUCT ID" value="00330-80000" color="255,255,255" />
            <MiniDetail label="POWER MODE" value="Performance" color="255,255,255" />
            <MiniDetail label="BATTERY" value="AC Connected" color="255,255,255" />
            <MiniDetail label="MOTHERBOARD" value="Quantum Board" color="255,255,255" />
            <MiniDetail label="COOLING" value="Liquid Cryo" color="255,255,255" />
            <MiniDetail label="PUMP SPEED" value="3200 RPM" color="255,255,255" />
            <MiniDetail label="FAN CURVE" value="Aggressive" color="255,255,255" />
            <MiniDetail label="PSU" value="1600W Titanium" color="255,255,255" />
            <MiniDetail label="V-CORE" value="1.45V" color="255,255,255" />
            <MiniDetail label="AMBIENT" value="22°C" color="255,255,255" />
            <MiniDetail label="CHASSIS" value="Monolith" color="255,255,255" />
            <MiniDetail label="FORM FACTOR" value="E-ATX" color="255,255,255" />
            <MiniDetail label="RGB SYNC" value="Aura Match" color="255,255,255" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalCommandDashboard;
