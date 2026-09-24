import React, { useState, useEffect } from "react";
import { 
  Cpu, HardDrive, Monitor, MemoryStick, Activity, Zap, Globe, Shield
} from "lucide-react";

interface SettingsSystemPageProps {
  onOpenSubApp?: (id: string, label: string) => void;
}

const SettingsSystemPage: React.FC<SettingsSystemPageProps> = ({ onOpenSubApp }) => {
  const [hexCode, setHexCode] = useState("0x0000");
  const [throughput, setThroughput] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHexCode("0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(4, '0'));
      setThroughput(Math.floor(Math.random() * 900) + 100);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const TechCard = ({ title, icon: Icon, mainText, subText, onClick, color = "0, 255, 255" }: any) => (
    <div 
      className="tech-card hud-clickable"
      onClick={onClick}
      style={{
        position: "relative",
        padding: "16px",
        background: `linear-gradient(135deg, rgba(0,5,10,0.9) 0%, rgba(${color}, 0.05) 100%)`,
        border: `1px solid rgba(${color}, 0.3)`,
        cursor: "pointer",
        overflow: "hidden",
        clipPath: "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "130px"
      }}
    >
      {/* Animated Scanline Background */}
      <div className="card-scanline" style={{ background: `linear-gradient(to bottom, transparent, rgba(${color}, 0.2), transparent)` }} />
      
      {/* Corner Accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "2px", background: `rgb(${color})` }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "20px", background: `rgb(${color})` }} />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: `rgb(${color})` }}>
          <div style={{ padding: "8px", background: `rgba(${color}, 0.1)`, borderRadius: "6px", border: `1px solid rgba(${color}, 0.3)` }}>
            <Icon size={18} />
          </div>
          <span style={{ fontWeight: "bold", fontSize: "1rem", letterSpacing: "1px", textTransform: "uppercase" }}>
            {title}
          </span>
        </div>
        <div style={{ fontSize: "0.55rem", opacity: 0.5, textAlign: "right", fontFamily: "var(--font-mono)" }}>
          <div>SYS_NODE_{hexCode}</div>
          <div style={{ color: `rgb(${color})` }}>UPLINK OK</div>
        </div>
      </div>

      <div style={{ marginTop: "4px" }}>
        <div style={{ fontSize: "0.9rem", opacity: 0.9, letterSpacing: "1px", marginBottom: "2px" }}>{mainText}</div>
        <div style={{ fontSize: "0.65rem", opacity: 0.6 }}>{subText}</div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid rgba(${color}, 0.2)`, paddingTop: "8px" }}>
        <div style={{ fontSize: "0.55rem", letterSpacing: "1px", color: `rgb(${color})` }}>
          <Zap size={10} style={{ display: "inline", marginRight: "4px" }} />
          INITIALIZE DEEP SCAN
        </div>
        <div className="card-arrow" style={{ color: `rgb(${color})`, fontSize: "1rem" }}>➔</div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", padding: "0 10px", display: "flex", flexDirection: "column" }}>
      <style>{`
        .tech-card:hover {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.15) inset, 0 0 15px rgba(0,255,255,0.2);
          border-color: rgba(0, 255, 255, 0.8) !important;
          transform: translateY(-2px);
        }
        .tech-card:hover .card-arrow {
          transform: translateX(4px);
          transition: transform 0.2s;
        }
        .card-scanline {
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          animation: scan 4s linear infinite;
          pointer-events: none;
          opacity: 0.5;
        }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .core-pulse {
          animation: corePulse 2s infinite alternate;
        }
        @keyframes corePulse {
          0% { box-shadow: 0 0 10px rgba(0,255,255,0.2), inset 0 0 10px rgba(0,255,255,0.1); }
          100% { box-shadow: 0 0 20px rgba(0,255,255,0.6), inset 0 0 20px rgba(0,255,255,0.4); }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "10px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", letterSpacing: "3px", margin: 0, textShadow: "0 0 10px rgba(0,255,255,0.6)", textTransform: "uppercase" }}>
            Core Diagnostics
          </h2>
          <div style={{ fontSize: "0.65rem", color: "#00ffff", opacity: 0.7, letterSpacing: "1px", marginTop: "2px" }}>
            GLOBAL SYSTEM OVERVIEW // TERMINAL ACCESS
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <button
            className="hud-clickable"
            onClick={() => onOpenSubApp?.('sys_command', 'GLOBAL COMMAND CENTER')}
            style={{
              background: "rgba(0,255,255,0.1)",
              border: "1px solid #00ffff",
              color: "#00ffff",
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "2px",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(0,255,255,0.2)",
              transition: "all 0.3s ease"
            }}
          >
            [ LAUNCH OMNI-VIEW ]
          </button>
          <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.6rem", opacity: 0.7 }}>
            <div>THROUGHPUT: {throughput} TB/s</div>
            <div>UPTIME: 94,039 CYCLES</div>
          </div>
        </div>
      </div>

      {/* CENTRAL CORE BANNER */}
      <div 
        className="hud-clickable"
        onClick={() => onOpenSubApp?.('sys_about', 'DEVICE INFORMATION')}
        style={{ 
        display: "flex", gap: "20px", padding: "16px 20px", 
        background: "linear-gradient(90deg, rgba(0,20,40,0.8) 0%, rgba(0,255,255,0.05) 100%)", 
        border: "1px solid #00ffff", 
        borderRadius: "4px", 
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
        cursor: "pointer"
      }}>
        {/* Background Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)", backgroundSize: "15px 15px", opacity: 0.2, pointerEvents: "none" }} />
        
        <div className="core-pulse" style={{ 
          width: "70px", height: "70px", borderRadius: "50%", flexShrink: 0,
          border: "2px solid #00ffff", display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,255,255,0.1)", zIndex: 1
        }}>
          <Shield size={36} color="#00ffff" />
        </div>
        
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "bold", letterSpacing: "3px", color: "#ffffff", textShadow: "0 0 10px #00ffff", lineHeight: 1.2 }}>
            NOVA OS CORE
          </div>
          <div style={{ fontSize: "0.8rem", color: "#00ffff", letterSpacing: "1px", opacity: 0.8, marginBottom: "8px" }}>
            QUANTUM KERNEL v0.1.0-ALPHA
          </div>
          <div style={{ display: "flex", gap: "15px", fontSize: "0.65rem", fontFamily: "var(--font-mono)", opacity: 0.6 }}>
            <span><Globe size={10} style={{display:'inline', marginRight:'4px'}}/> NETWORK: SECURE</span>
            <span><Activity size={10} style={{display:'inline', marginRight:'4px'}}/> INTEGRITY: 100%</span>
          </div>
        </div>
      </div>

      {/* HARDWARE GRID */}
      <div style={{ fontSize: "0.8rem", color: "#00ffff", opacity: 0.8, marginTop: "20px", marginBottom: "10px", letterSpacing: "2px" }}>CORE HARDWARE</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <TechCard 
          title="Processor" 
          icon={Cpu} 
          mainText="Quantum-X Neural Engine"
          subText="128 Cores / 8.5 GHz / Optimal"
          onClick={() => onOpenSubApp?.('sys_cpu', 'CPU DIAGNOSTICS')}
        />
        <TechCard 
          title="Memory" 
          icon={MemoryStick} 
          color="255, 0, 255"
          mainText="512 GB Q-DIMM Array"
          subText="48 GB Active / 8400 MT/s"
          onClick={() => onOpenSubApp?.('sys_memory', 'MEMORY DIAGNOSTICS')}
        />
        <TechCard 
          title="Storage" 
          icon={HardDrive} 
          color="0, 255, 136"
          mainText="Crystal NVMe Arrays"
          subText="8.0 TB Total / 12.5 GB/s"
          onClick={() => onOpenSubApp?.('sys_storage', 'STORAGE DIAGNOSTICS')}
        />
        <TechCard 
          title="Graphics" 
          icon={Monitor} 
          color="255, 136, 0"
          mainText="Holo-GPU 9000 Series"
          subText="32 GB VRAM / 8K Output"
          onClick={() => onOpenSubApp?.('sys_graphics', 'GRAPHICS DIAGNOSTICS')}
        />
      </div>

      {/* PERIPHERALS GRID */}
      <div style={{ fontSize: "0.8rem", color: "#00ffff", opacity: 0.8, marginTop: "20px", marginBottom: "10px", letterSpacing: "2px" }}>MEDIA & PERIPHERALS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", paddingBottom: "30px" }}>
        <TechCard 
          title="Display" 
          icon={Monitor} 
          color="100, 200, 255"
          mainText="Quantum OLED Display"
          subText="7680x4320 / 240Hz / HDR10+"
          onClick={() => onOpenSubApp?.('sys_display', 'DISPLAY METRICS')}
        />
        <TechCard 
          title="Sound" 
          icon={Activity} 
          color="255, 200, 100"
          mainText="Spatial Audio Controller"
          subText="7.1.4 Surround / 32-bit 384kHz"
          onClick={() => onOpenSubApp?.('sys_sound', 'AUDIO INTERFACE')}
        />
        <TechCard 
          title="Network" 
          icon={Globe} 
          color="150, 100, 255"
          mainText="Hyper-Bandwidth Uplink"
          subText="100 Gbps Link / 0.1ms Latency"
          onClick={() => onOpenSubApp?.('sys_network', 'NETWORK STACK')}
        />
        <TechCard 
          title="Input" 
          icon={Zap} 
          color="255, 100, 150"
          mainText="Neural Sync Interface"
          subText="Zero-Latency Biofeedback"
          onClick={() => onOpenSubApp?.('sys_input', 'INPUT DEVICES')}
        />
      </div>

    </div>
  );
};

export default SettingsSystemPage;
