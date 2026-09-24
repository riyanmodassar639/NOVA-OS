import React, { useState, useEffect } from "react";
import { 
  Wifi, Bluetooth, Battery, Clock, Calendar, 
  Activity, Zap, Cloud, Volume2, Search, ChevronDown, Hexagon, LayoutGrid 
} from "lucide-react";
import "../../../styles/nova-hud.css";

interface HUDTopBarProps {
  onLaunchApps: () => void;
  onStartClick: () => void;
  onTrayClick: (type: 'wifi' | 'bluetooth' | 'volume' | 'arrow') => void;
}

const HUDTopBar: React.FC<HUDTopBarProps> = ({ onLaunchApps, onStartClick, onTrayClick }) => {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString("en-US", { hour12: false });
  const dateString = time.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "40px",
      background: "linear-gradient(90deg, rgba(0,10,20,0.95) 0%, rgba(0,30,50,0.4) 50%, rgba(0,10,20,0.95) 100%)",
      borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
      boxShadow: "0 2px 10px rgba(0, 255, 255, 0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 16px",
      zIndex: 100,
      fontFamily: "var(--font-rajdhani)",
      color: "#00ffff",
      fontSize: "0.75rem",
      letterSpacing: "0.15em"
    }}>
      {/* ── LEFT SIDE: System & Env ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Start Logo */}
        <div 
          onClick={onStartClick}
          className="hud-clickable"
          style={{ display: "flex", alignItems: "center", color: "#00ffff" }}
        >
          <Hexagon size={18} style={{ fill: "rgba(0,255,255,0.2)" }} />
          <span style={{ fontWeight: "bold", marginLeft: "6px" }}>NOVA_OS</span>
        </div>
        
        {/* Weather / Env */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.8 }}>
          <Cloud size={14} />
          <span>EXT: 83°F | CLEAR</span>
        </div>
        
        {/* Sys Temp */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.6 }}>
          <Activity size={14} />
          <span>SYS_TEMP: 42°C</span>
        </div>
      </div>

      {/* ── RIGHT SIDE: Search, Apps, Tray & Clock ── */}
      <div style={{ display: "flex", alignItems: "center", height: "100%", gap: "16px" }}>
        
        {/* Search Bar */}
        <div className="hud-clickable" style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(0, 255, 255, 0.05)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "4px 12px",
          height: "26px",
          width: "200px"
        }}>
          <Search size={12} style={{ opacity: 0.6, marginRight: "8px" }} />
          <input 
            type="text" 
            placeholder="Search core systems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hud-clickable"
            style={{
              background: "transparent",
              border: "none",
              color: "#00ffff",
              fontFamily: "var(--font-rajdhani)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              width: "100%",
              outline: "none"
            }}
          />
        </div>

        {/* App Launcher Icon (No Glow) */}
        <div 
          className="hud-clickable"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8px",
            height: "100%",
            color: "#00ffff"
          }}
          onClick={onLaunchApps}
        >
          <LayoutGrid size={18} />
        </div>

        <div style={{ width: "1px", height: "16px", background: "rgba(0,255,255,0.2)", margin: "0 4px" }} />

        {/* Status Tray Icons (Separate Clicks) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="hud-clickable" style={{ display: "flex", alignItems: "center", opacity: 0.6 }} onClick={() => onTrayClick('arrow')}>
            <ChevronDown size={14} style={{ transform: "rotate(90deg)" }} />
          </div>

          <div className="hud-clickable" style={{ opacity: 0.8 }} onClick={() => onTrayClick('volume')}>
            <Volume2 size={14} />
          </div>
          <div className="hud-clickable" style={{ opacity: 0.8 }} onClick={() => onTrayClick('wifi')}>
            <Wifi size={14} />
          </div>
          <div className="hud-clickable" style={{ opacity: 0.8 }} onClick={() => onTrayClick('bluetooth')}>
            <Bluetooth size={14} />
          </div>
          <div style={{ opacity: 0.8 }}>
            <Battery size={14} />
          </div>
        </div>

        {/* Date / Time Block */}
        <div className="hud-clickable" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", marginLeft: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", textShadow: "0 0 5px rgba(0,255,255,0.5)" }}>
            <span>{timeString}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.6rem", opacity: 0.6 }}>
            <span>{dateString}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDTopBar;
