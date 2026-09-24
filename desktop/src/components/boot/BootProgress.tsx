import React, { memo } from "react";

interface BootProgressProps {
  progress: number;   // 0–100
  visible: boolean;
}

const BootProgress: React.FC<BootProgressProps> = memo(({ progress, visible }) => {
  if (!visible) return null;

  return (
    <div className="boot-status-wrap" style={{ position: "relative", bottom: "auto", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "15px", width: "100%", gap: "15px" }}>
      {/* Horizontal Loading Bar (Lag-free with transform: scaleX) */}
      <div style={{
        flex: 1,
        height: "3px",
        background: "rgba(0,212,255,0.1)",
        borderRadius: "2px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 0 10px rgba(0,212,255,0.2)",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          background: "linear-gradient(90deg, rgba(0,212,255,0.8), rgba(180,255,255,1))",
          boxShadow: "0 0 10px rgba(0,212,255,0.8)",
          transformOrigin: "left",
          transform: `scaleX(${progress / 100})`,
          transition: "transform 0.1s linear",
        }} />
      </div>

      {/* Loading Percentage (On the right) */}
      <div className="progress-pct" style={{
        fontSize: "0.85rem",
        letterSpacing: "0.1em",
        color: "rgba(0,212,255,0.8)",
        textShadow: "0 0 8px rgba(0,212,255,0.5)",
        fontFamily: "var(--font-mono)",
        minWidth: "45px",
        textAlign: "right",
      }}>
        {String(progress).padStart(3, "0")}%
      </div>
    </div>
  );
});

export default BootProgress;
