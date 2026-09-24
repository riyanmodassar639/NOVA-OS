import React from "react";
import { Wifi, Bluetooth, Volume2, Moon, Settings, Zap, Shield, ChevronRight } from "lucide-react";

interface SystemTrayPanelProps {
  isOpen: boolean;
  activeTab: 'wifi' | 'bluetooth' | 'volume' | 'arrow' | null;
  onClose: () => void;
}

const SystemTrayPanel: React.FC<SystemTrayPanelProps> = ({ isOpen, activeTab, onClose }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'wifi':
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "8px" }}>Wi-Fi Networks</div>
            <div className="hud-clickable" style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "rgba(0,255,255,0.1)", borderRadius: "6px", border: "1px solid #00ffff" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <Wifi size={16} />
                <span>QUANTUM_NET_5G</span>
              </div>
              <span style={{ fontSize: "0.6rem", opacity: 0.8 }}>Connected</span>
            </div>
            <div className="hud-clickable" style={{ display: "flex", gap: "12px", padding: "12px", background: "rgba(0,255,255,0.02)", borderRadius: "6px" }}>
              <Wifi size={16} style={{ opacity: 0.5 }} />
              <span style={{ opacity: 0.6 }}>GUEST_NODE_BETA</span>
            </div>
          </div>
        );
      case 'bluetooth':
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "8px" }}>Bluetooth Devices</div>
            <div className="hud-clickable" style={{ display: "flex", gap: "12px", padding: "12px", background: "rgba(0,255,255,0.1)", borderRadius: "6px", border: "1px solid #00ffff" }}>
              <Bluetooth size={16} />
              <span>Cyber-Headset V2</span>
            </div>
            <div style={{ textAlign: "center", fontSize: "0.6rem", opacity: 0.5, marginTop: "10px" }}>Scanning for devices...</div>
          </div>
        );
      case 'volume':
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "8px" }}>Audio Output</div>
            <div className="tray-slider-container">
              <Volume2 size={16} style={{ opacity: 0.8 }} />
              <div className="tray-slider hud-clickable">
                <div className="tray-slider-fill" style={{ width: "65%" }} />
                <div className="tray-slider-thumb" style={{ left: "65%" }} />
              </div>
              <span style={{ fontSize: "0.7rem", width: "24px", textAlign: "right" }}>65%</span>
            </div>
          </div>
        );
      case 'arrow':
      default:
        // Render the grid (Quick Settings)
        return (
          <>
            <div className="tray-grid">
              <div className="tray-btn active hud-clickable">
                <Wifi size={18} />
                <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>Wi-Fi</span>
              </div>
              <div className="tray-btn hud-clickable">
                <Bluetooth size={18} />
                <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>Bluetooth</span>
              </div>
              <div className="tray-btn hud-clickable">
                <Moon size={18} />
                <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>Focus</span>
              </div>
              <div className="tray-btn active hud-clickable">
                <Zap size={18} />
                <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>Battery</span>
              </div>
              <div className="tray-btn hud-clickable">
                <Shield size={18} />
                <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>VPN</span>
              </div>
              <div className="tray-btn hud-clickable">
                <Settings size={18} />
                <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>Settings</span>
              </div>
            </div>

            {/* Network Detail shortcut inside Quick Settings */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", borderTop: "1px solid rgba(0,255,255,0.1)", marginTop: "8px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "bold" }}>QUANTUM_NET_5G</span>
                <span style={{ fontSize: "0.55rem", opacity: 0.6 }}>Connected, Secured</span>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 999 }}
      />
      
      <div 
        style={{
          position: "absolute",
          top: "40px", // Just below the Top Bar
          right: "16px",
          width: "300px",
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
          gap: "16px",
          color: "#00ffff",
          fontFamily: "var(--font-rajdhani)",
          animation: "slideDownRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <style>
          {`
            @keyframes slideDownRight {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .tray-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
            }
            .tray-btn {
              background: rgba(0,255,255,0.05);
              border: 1px solid rgba(0,255,255,0.2);
              border-radius: 8px;
              height: 60px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 6px;
              transition: all 0.2s;
            }
            .tray-btn.active {
              background: #00ffff;
              color: #000;
              border-color: #00ffff;
              box-shadow: 0 0 10px rgba(0,255,255,0.5);
            }
            .tray-btn:hover:not(.active) {
              background: rgba(0,255,255,0.15);
              border-color: #00ffff;
            }
            .tray-slider-container {
              display: flex;
              align-items: center;
              gap: 12px;
              background: rgba(0,255,255,0.02);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid rgba(0,255,255,0.1);
            }
            .tray-slider {
              flex: 1;
              height: 4px;
              background: rgba(0,255,255,0.2);
              border-radius: 2px;
              position: relative;
              cursor: pointer;
            }
            .tray-slider-fill {
              position: absolute;
              top: 0; left: 0; height: 100%;
              background: #00ffff;
              border-radius: 2px;
              box-shadow: 0 0 8px #00ffff;
            }
            .tray-slider-thumb {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 12px; height: 12px;
              background: #fff;
              border-radius: 50%;
              box-shadow: 0 0 5px #00ffff;
            }
          `}
        </style>

        {renderContent()}

      </div>
    </>
  );
};

export default SystemTrayPanel;
