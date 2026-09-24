import React from "react";
import { User, Settings, Power, ShieldAlert, Cpu } from "lucide-react";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReboot: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onReboot }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to close when clicking outside */}
      <div 
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 999 }}
      />
      
      {/* Start Menu Panel */}
      <div 
        style={{
          position: "absolute",
          top: "40px", // Just below the Top Bar
          left: "16px",
          width: "320px",
          background: "rgba(0, 10, 20, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 255, 255, 0.4)",
          borderTop: "none",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 255, 255, 0.15), inset 0 0 20px rgba(0,255,255,0.05)",
          zIndex: 1000,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          color: "#00ffff",
          fontFamily: "var(--font-rajdhani)",
          animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <style>
          {`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .start-menu-btn {
              background: rgba(0,255,255,0.05);
              border: 1px solid rgba(0,255,255,0.2);
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 12px;
              cursor: pointer;
              transition: all 0.2s;
              border-radius: 6px;
              color: #00ffff;
            }
            .start-menu-btn:hover {
              background: rgba(0,255,255,0.15);
              border-color: #00ffff;
              box-shadow: 0 0 15px rgba(0,255,255,0.3);
              transform: translateX(5px);
            }
            .power-btn:hover {
              background: rgba(255,0,50,0.2) !important;
              border-color: #ff0032 !important;
              color: #ff0032 !important;
              box-shadow: 0 0 15px rgba(255,0,50,0.4) !important;
            }
          `}
        </style>

        {/* User Profile Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "16px" }}>
          <div style={{
            width: "48px", height: "48px", 
            borderRadius: "50%", 
            background: "rgba(0,255,255,0.1)", 
            border: "1px solid #00ffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 10px rgba(0,255,255,0.5)"
          }}>
            <User size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "2px", textShadow: "0 0 5px #00ffff" }}>COMMANDER</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6, letterSpacing: "1px" }}>ACCESS LEVEL: OMNI</div>
          </div>
        </div>

        {/* Quick Settings Sliders (Visual only) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "0.6rem", marginBottom: "4px", opacity: 0.8 }}>CORE ALLOCATION</div>
            <div className="hud-data-bar" style={{ background: "rgba(0,255,255,0.1)", height: "6px" }}>
              <div className="hud-data-bar-fill" style={{ width: "88%" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", marginBottom: "4px", opacity: 0.8 }}>NETWORK UPLINK</div>
            <div className="hud-data-bar" style={{ background: "rgba(0,255,255,0.1)", height: "6px" }}>
              <div className="hud-data-bar-fill" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="start-menu-btn">
            <Settings size={18} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>SYSTEM PREFERENCES</span>
          </div>
          <div className="start-menu-btn">
            <ShieldAlert size={18} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>SECURITY PROTOCOLS</span>
          </div>
          <div className="start-menu-btn">
            <Cpu size={18} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>HARDWARE DIAGNOSTICS</span>
          </div>
        </div>

        {/* Power Options */}
        <div style={{ marginTop: "10px", borderTop: "1px solid rgba(0,255,255,0.2)", paddingTop: "16px" }}>
          <div className="start-menu-btn power-btn" onClick={onReboot}>
            <Power size={18} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>REBOOT SYSTEM</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartMenu;
