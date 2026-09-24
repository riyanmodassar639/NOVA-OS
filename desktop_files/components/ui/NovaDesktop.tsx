import React, { useState, useEffect } from "react";
import "../../styles/nova-boot.css";

const DESKTOP_TIME_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-orbitron)",
  fontSize: "clamp(2rem, 6vmin, 4.5rem)",
  fontWeight: 700,
  color: "rgba(200, 240, 255, 0.9)",
  letterSpacing: "0.1em",
  textShadow: "0 0 20px rgba(0,212,255,0.4)",
};

const NovaDesktop: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [visible, setVisible] = useState(false);

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
      }}>
        <span>NOVA OS ◈ DESKTOP ENVIRONMENT v0.1.0</span>
        <span style={{ color: "rgba(0,212,255,0.7)", fontWeight: 600 }}>SYSTEM ACTIVE</span>
      </div>

      {/* Center clock */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        flex: 1,
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

        {/* Placeholder message */}
        <div style={{
          marginTop: "40px",
          padding: "16px 32px",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: "4px",
          background: "rgba(0,20,50,0.4)",
          backdropFilter: "blur(4px)",
          textAlign: "center",
          fontFamily: "var(--font-rajdhani)",
          color: "rgba(0,180,220,0.6)",
          fontSize: "clamp(0.65rem, 1.8vmin, 0.85rem)",
          letterSpacing: "0.2em",
          lineHeight: 1.9,
          maxWidth: "420px",
        }}>
          <div style={{ color: "rgba(0,212,255,0.8)", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.3em" }}>
            NOVA OS DESKTOP
          </div>
          <div>FULL INTERFACE IN DEVELOPMENT</div>
          <div style={{ opacity: 0.5, marginTop: "4px", fontSize: "0.9em" }}>
            BOOT SEQUENCE COMPLETE ✓
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "36px",
        borderTop: "1px solid rgba(0,212,255,0.1)",
        background: "rgba(0,8,20,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        zIndex: 20,
        fontFamily: "var(--font-rajdhani)",
        fontSize: "0.65rem",
        color: "rgba(0,150,190,0.4)",
        letterSpacing: "0.15em",
      }}>
        <span>CPU: NOMINAL</span>
        <span>◈</span>
        <span>MEM: 4096 MB</span>
        <span>◈</span>
        <span>AI CORE: ONLINE</span>
        <span>◈</span>
        <span>SECURE CHANNEL: ACTIVE</span>
      </div>
    </div>
  );
};

export default NovaDesktop;
