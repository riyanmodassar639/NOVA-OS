import React, { useEffect, useState, memo } from "react";

interface SystemIndicatorsProps {
  visible: boolean;
  progress: number;
}

const LEFT_INDICATORS = [
  { label: "NEURAL NET",   icon: "⬡" },
  { label: "QUANTUM MEM",  icon: "◈" },
  { label: "UPLINK SEC",   icon: "⬡" },
  { label: "AI CORE",      icon: "◎" },
  { label: "SEC HASH",     icon: "◈" },
  { label: "GPU MATRIX",   icon: "⬡" },
];

const RIGHT_INDICATORS = [
  { label: "KERNEL",       icon: "◎" },
  { label: "BUILD SYS",    icon: "⬡" },
  { label: "ARCH TRACE",   icon: "◈" },
  { label: "LANG COMP",    icon: "◎" },
  { label: "V-MODE",       icon: "⬡" },
  { label: "SCHEDULER",    icon: "◈" },
];

const SystemIndicators: React.FC<SystemIndicatorsProps> = memo(({ visible, progress }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [randomData, setRandomData] = useState<string[]>(Array(12).fill("0000"));

  // Staggered appearance
  useEffect(() => {
    if (!visible) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= 6) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [visible]);

  // Fast changing hexadecimal data streams for HUD
  useEffect(() => {
    if (!visible) return;
    const dataInterval = setInterval(() => {
      setRandomData(prev => prev.map(() => 
        Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')
      ));
    }, 450); // Increased interval to fix lag (from 80ms to 450ms)
    return () => clearInterval(dataInterval);
  }, [visible]);

  if (!visible) return null;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%) translateZ(50px)", 
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    zIndex: 15,
  };

  return (
    <>
      {/* ── Left side indicators ── */}
      <div style={{ ...baseStyle, left: "clamp(20px, 3vw, 40px)" }}>
        {LEFT_INDICATORS.map((item, i) => (
          <div
            key={i}
            className="sys-indicator"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Holographic accent bar */}
            <div style={{
              width: "3px",
              height: "32px",
              background: "linear-gradient(180deg, transparent, rgba(0,255,255,1), transparent)",
              boxShadow: "0 0 10px rgba(0,255,255,0.8)",
              marginRight: "6px",
            }} />
            <div>
              <div style={{
                fontSize: "clamp(0.5rem, 1.2vmin, 0.65rem)",
                color: "rgba(0,240,255,0.6)",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-rajdhani)",
                marginBottom: "2px",
              }}>{item.label}</div>
              <div style={{
                fontSize: "clamp(0.6rem, 1.5vmin, 0.72rem)",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textShadow: "0 0 8px rgba(0,255,255,0.6)"
              }}>
                <span className="sys-indicator-dot" />
                0x{randomData[i]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Right side indicators ── */}
      <div style={{ ...baseStyle, right: "clamp(20px, 3vw, 40px)", alignItems: "flex-end" }}>
        {RIGHT_INDICATORS.map((item, i) => (
          <div
            key={i}
            className="sys-indicator"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateX(0)" : "translateX(20px)",
              transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexDirection: "row-reverse",
            }}
          >
            <div style={{
              width: "3px",
              height: "32px",
              background: "linear-gradient(180deg, transparent, rgba(0,255,255,1), transparent)",
              boxShadow: "0 0 10px rgba(0,255,255,0.8)",
              marginLeft: "6px",
            }} />
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "clamp(0.5rem, 1.2vmin, 0.65rem)",
                color: "rgba(0,240,255,0.6)",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-rajdhani)",
                marginBottom: "2px",
              }}>{item.label}</div>
              <div style={{
                fontSize: "clamp(0.6rem, 1.5vmin, 0.72rem)",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "6px",
                textShadow: "0 0 8px rgba(0,255,255,0.6)"
              }}>
                0x{randomData[i + 6]}
                <span className="sys-indicator-dot" style={{ animationDelay: `${i * 0.2}s` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Top center header ── */}
      <div style={{
        position: "absolute",
        top: "clamp(20px, 3vh, 40px)",
        left: "50%",
        transform: "translateX(-50%) translateZ(100px)",
        textAlign: "center",
        zIndex: 15,
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease",
      }}>
        <div style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "clamp(0.55rem, 1.6vmin, 0.8rem)",
          color: "rgba(0,255,255,0.7)",
          letterSpacing: "0.5em",
          fontWeight: 600,
          textShadow: "0 0 15px rgba(0,255,255,0.5)",
          borderBottom: "1px solid rgba(0,255,255,0.2)",
          paddingBottom: "8px",
        }}>
          NOVA OS ◈ NEURAL OPERATING & VIRTUAL ASSISTANT ENVIRONMENT
        </div>
      </div>

      {/* ── Bottom center telemetry ── */}
      <div style={{
        position: "absolute",
        bottom: "clamp(15px, 3vh, 30px)",
        left: "50%",
        transform: "translateX(-50%) translateZ(50px)",
        textAlign: "center",
        zIndex: 15,
        opacity: progress > 5 ? 1 : 0,
        transition: "opacity 1s ease",
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(0.5rem, 1.2vmin, 0.65rem)",
        color: "rgba(0,240,255,0.5)",
        letterSpacing: "0.25em",
        whiteSpace: "nowrap",
      }}>
        SYS: {new Date().toISOString().split("T")[0]} ◈ KERNEL: ACTIVE ◈ SYNC: {progress.toFixed(1)}% ◈ MODE: NEURAL-BOOT
      </div>
    </>
  );
});

export default SystemIndicators;
