import React, { useState, useEffect } from "react";
import TerminalApp from "../apps/TerminalApp";
import SystemMonitorApp from "../apps/SystemMonitorApp";
import NetworkUplinkApp from "../apps/NetworkUplinkApp";

interface HUDRightPanelProps {
  activeAppId: string;
}

const HUDRightPanel: React.FC<HUDRightPanelProps> = ({ activeAppId }) => {
  const [sineOffset, setSineOffset] = useState(0);

  // Animate the sine wave
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setSineOffset(prev => prev + 0.5);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const renderActiveApp = () => {
    switch (activeAppId) {
      case "terminal": return <TerminalApp />;
      case "monitor": return <SystemMonitorApp />;
      case "uplink": return <NetworkUplinkApp />;
      default: return (
        <div style={{ padding: "20px", textAlign: "center", color: "rgba(0,255,255,0.5)", fontSize: "0.8rem", letterSpacing: "2px" }}>
          MODULE [{activeAppId.toUpperCase()}] OFFLINE
        </div>
      );
    }
  };

  return (
    <div className="hud-right">
      {/* Top Right Stats (Like the 18%, 55%, 20% in the image) */}
      <div className="hud-panel" style={{ padding: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "PRI", val: "18%", bar: "18%" },
            { label: "SEC", val: "55%", bar: "55%" },
            { label: "AUX", val: "20%", bar: "20%" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="hud-text-dim" style={{ fontSize: "0.5rem", width: "20px" }}>{stat.label}</span>
              <div style={{ flex: 1, height: "2px", background: "rgba(0,255,255,0.1)" }}>
                <div style={{ width: stat.bar, height: "100%", background: "#00ffff", boxShadow: "0 0 5px #00ffff" }} />
              </div>
              <span className="hud-text-glow" style={{ fontSize: "0.7rem", width: "30px", textAlign: "right" }}>{stat.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Radar */}
      <div className="hud-panel" style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
        <div className="hud-radar-wrap">
          <div className="hud-radar-sweep" />
          <div className="hud-radar-target" style={{ top: "30%", left: "60%" }} />
          <div className="hud-radar-target" style={{ top: "70%", left: "40%" }} />
          <div className="hud-radar-target" style={{ top: "50%", left: "80%" }} />
        </div>
      </div>

      {/* Audio Visualizer / Sine Wave Graph */}
      <div className="hud-panel" style={{ padding: "12px", height: "80px", overflow: "hidden" }}>
        <div className="hud-text-dim" style={{ fontSize: "0.4rem", marginBottom: "4px" }}>FREQ // 48.2KHz</div>
        <svg width="100%" height="40px" preserveAspectRatio="none">
          <path 
            d={`M 0 20 Q 25 ${20 + Math.sin(sineOffset) * 15}, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20`} 
            fill="none" 
            stroke="#00ffff" 
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 4px #00ffff)" }}
          />
        </svg>
      </div>

      {/* Dynamic Main Application Data Panel */}
      <div className="hud-panel" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ 
          padding: "8px 12px", 
          borderBottom: "1px solid rgba(0,255,255,0.2)",
          fontSize: "0.6rem",
          letterSpacing: "2px",
          background: "rgba(0,255,255,0.05)"
        }}>
          ACTIVE SUB-ROUTINE
        </div>
        <div style={{ flex: 1, padding: "12px", overflow: "hidden" }}>
          {renderActiveApp()}
        </div>
      </div>
    </div>
  );
};

export default HUDRightPanel;
