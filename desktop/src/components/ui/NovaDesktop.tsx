import React, { useState, useEffect } from "react";
import "../../styles/nova-boot.css";
import "../../styles/nova-desktop.css";
import { WindowManagerProvider, useWindowManager } from "../desktop/WindowManager";
import Window from "../desktop/Window";
import Dock from "../desktop/Dock";
import TerminalApp from "../desktop/apps/TerminalApp";
import SystemMonitorApp from "../desktop/apps/SystemMonitorApp";
import NetworkUplinkApp from "../desktop/apps/NetworkUplinkApp";

const DESKTOP_TIME_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-orbitron)",
  fontSize: "clamp(2rem, 6vmin, 4.5rem)",
  fontWeight: 700,
  color: "rgba(200, 240, 255, 0.9)",
  letterSpacing: "0.1em",
  textShadow: "0 0 20px rgba(0,212,255,0.4)",
};

const DesktopContent: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const { windows } = useWindowManager();

  useEffect(() => {
    // Fade in
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  const dateStr = time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "terminal": return <TerminalApp />;
      case "monitor": return <SystemMonitorApp />;
      case "uplink": return <NetworkUplinkApp />;
      default: return <div>Unknown App: {appId}</div>;
    }
  };

  const getAppTitle = (appId: string) => {
    switch (appId) {
      case "terminal": return "AI TERMINAL";
      case "monitor": return "SYS MONITOR";
      case "uplink": return "NET UPLINK";
      default: return "APP";
    }
  };

  return (
    <div
      className="nova-boot"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease-in-out",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div className="nova-bg-gradient" />
      <div className="nova-grid" />
      <div className="nova-vignette" />

      {/* Simple top bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "40px",
        borderBottom: "1px solid rgba(0,212,255,0.12)",
        background: "rgba(0,10,25,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 20,
        fontFamily: "var(--font-rajdhani)",
        fontSize: "0.7rem",
        color: "rgba(0,180,220,0.6)",
        letterSpacing: "0.15em",
        pointerEvents: "none",
      }}>
        <span>NOVA OS ◈ DESKTOP ENVIRONMENT v0.1.0</span>
        <span style={{ color: "rgba(0,212,255,0.7)", fontWeight: 600 }}>SYSTEM ACTIVE</span>
      </div>

      {/* Center clock Widget (Background) */}
      <div style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}>
        <div style={DESKTOP_TIME_STYLE}>
          {hh}<span style={{ opacity: 0.5, animation: "dot-blink 1s ease-in-out infinite" }}>:</span>{mm}
          <span style={{ fontSize: "0.45em", opacity: 0.6, marginLeft: "8px" }}>{ss}</span>
        </div>
        <div style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "clamp(0.7rem, 2vmin, 0.9rem)",
          color: "rgba(0,180,220,0.5)",
          letterSpacing: "0.25em",
          fontWeight: 500,
        }}>
          {dateStr.toUpperCase()}
        </div>
      </div>

      {/* Render Active Windows */}
      {windows.map(win => (
        <Window key={win.id} window={win} title={getAppTitle(win.appId)}>
          {renderAppContent(win.appId)}
        </Window>
      ))}

      {/* Floating Dock */}
      <Dock />
    </div>
  );
};

const NovaDesktop: React.FC = () => {
  return (
    <WindowManagerProvider>
      <DesktopContent />
    </WindowManagerProvider>
  );
};

export default NovaDesktop;
