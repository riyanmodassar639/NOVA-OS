import React from "react";
import { APPS } from "../WindowManager";
import { 
  Terminal, Activity, Globe, Database, 
  Shield, Cpu, Settings, Zap 
} from "lucide-react";

interface HUDLeftPanelProps {
  activeAppId: string;
  onAppSelect: (id: string) => void;
}

const HUDLeftPanel: React.FC<HUDLeftPanelProps> = ({ activeAppId, onAppSelect }) => {
  // Define 8 icons for the grid to match the image's 2x4 layout
  const gridApps = [
    { id: "terminal", icon: <Terminal />, label: "TERM" },
    { id: "monitor", icon: <Activity />, label: "SYS" },
    { id: "uplink", icon: <Globe />, label: "NET" },
    { id: "data", icon: <Database />, label: "DAT" },
    { id: "sec", icon: <Shield />, label: "SEC" },
    { id: "core", icon: <Cpu />, label: "CPU" },
    { id: "config", icon: <Settings />, label: "CFG" },
    { id: "power", icon: <Zap />, label: "PWR" },
  ];

  return (
    <div className="hud-left">
      {/* Top Left Stat Block */}
      <div className="hud-panel" style={{ padding: "16px" }}>
        <div className="hud-text-dim" style={{ fontSize: "0.6rem", marginBottom: "8px" }}>
          MAIN SYSTEM // DIAGNOSTICS
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="hud-text-glow" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>A4T</div>
            <div className="hud-text-dim" style={{ fontSize: "0.5rem" }}>SYS NODE ACTIVE</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="hud-text-glow" style={{ fontSize: "1.2rem" }}>79%</div>
            <div className="hud-text-dim" style={{ fontSize: "0.5rem" }}>STABILITY</div>
          </div>
        </div>
      </div>

      {/* Another random tech block like in the image */}
      <div className="hud-panel" style={{ padding: "12px", height: "120px", display: "flex", flexDirection: "column" }}>
        <div style={{ borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "4px", marginBottom: "8px" }}>
          <span className="hud-text-dim" style={{ fontSize: "0.5rem" }}>ENCRYPTION HASH</span>
        </div>
        <div className="hud-text-glow" style={{ fontSize: "0.8rem", letterSpacing: "2px", wordBreak: "break-all" }}>
          0x4F9C 0x88A2 0xB11C 0x99DF<br/>
          0xAA45 0x22F0 0x00E4 0x77BA
        </div>
        
        {/* Fake barcode/chart */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "2px", marginTop: "8px" }}>
          {Array.from({length: 30}).map((_, i) => (
            <div key={i} style={{ 
              flex: 1, 
              background: "#00ffff", 
              height: `${10 + Math.random() * 90}%`,
              opacity: 0.5 + Math.random() * 0.5
            }} />
          ))}
        </div>
      </div>

      {/* The 2x4 App Grid */}
      <div className="hud-panel" style={{ padding: "16px", marginTop: "auto" }}>
        <div className="hud-text-dim" style={{ fontSize: "0.5rem", marginBottom: "12px", textAlign: "center" }}>
          INTERFACE CONTROLS
        </div>
        <div className="hud-app-grid">
          {gridApps.map(app => (
            <div 
              key={app.id} 
              className={`hud-app-btn ${activeAppId === app.id ? "active" : ""}`}
              onClick={() => onAppSelect(app.id)}
            >
              {app.icon}
              <span>{app.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUDLeftPanel;
