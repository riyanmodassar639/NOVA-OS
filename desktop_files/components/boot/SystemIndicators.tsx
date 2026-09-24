import React, { useEffect, useState, memo } from "react";

interface SystemIndicatorsProps {
  visible: boolean;
  progress: number;
}

const LEFT_INDICATORS = [
  { label: "CPU",    value: "HYPERTHREAD",  icon: "⬡" },
  { label: "MEM",    value: "4096 MB",      icon: "◈" },
  { label: "NET",    value: "QUANTUM SEC",  icon: "⬡" },
  { label: "AI",     value: "ONLINE",       icon: "◎" },
  { label: "SEC",    value: "AES-512",      icon: "◈" },
  { label: "GPU",    value: "ACTIVE",       icon: "⬡" },
];

const RIGHT_INDICATORS = [
  { label: "KERNEL", value: "v0.1.0",       icon: "◎" },
  { label: "BUILD",  value: "2026-SEP",     icon: "⬡" },
  { label: "ARCH",   value: "x86-64",       icon: "◈" },
  { label: "LANG",   value: "RUST",         icon: "◎" },
  { label: "MODE",   value: "UEFI",         icon: "⬡" },
  { label: "SCHED",  value: "PREEMPTIVE",   icon: "◈" },
];

const SystemIndicators: React.FC<SystemIndicatorsProps> = memo(({ visible, progress }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= LEFT_INDICATORS.length) clearInterval(interval);
    }, 250);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    zIndex: 15,
  };

  return (
    <>
      {/* Left side indicators */}
      <div style={{ ...baseStyle, left: "clamp(14px, 2vw, 28px)" }}>
        {LEFT_INDICATORS.map((item, i) => (
          <div
            key={i}
            className="sys-indicator"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateX(0)" : "translateX(-8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {/* Vertical accent bar */}
            <div style={{
              width: "2px",
              height: "28px",
              background: "linear-gradient(180deg, transparent, rgba(0,212,255,0.7), transparent)",
              marginRight: "4px",
            }} />
            <div>
              <div style={{
                fontSize: "clamp(0.5rem, 1.2vmin, 0.65rem)",
                color: "rgba(0,180,220,0.45)",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-rajdhani)",
                marginBottom: "1px",
              }}>{item.label}</div>
              <div style={{
                fontSize: "clamp(0.6rem, 1.5vmin, 0.72rem)",
                color: "rgba(0,212,255,0.8)",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <span className="sys-indicator-dot" />
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right side indicators */}
      <div style={{ ...baseStyle, right: "clamp(14px, 2vw, 28px)", alignItems: "flex-end" }}>
        {RIGHT_INDICATORS.map((item, i) => (
          <div
            key={i}
            className="sys-indicator"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateX(0)" : "translateX(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexDirection: "row-reverse",
            }}
          >
            <div style={{
              width: "2px",
              height: "28px",
              background: "linear-gradient(180deg, transparent, rgba(0,212,255,0.7), transparent)",
              marginLeft: "4px",
            }} />
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "clamp(0.5rem, 1.2vmin, 0.65rem)",
                color: "rgba(0,180,220,0.45)",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-rajdhani)",
                marginBottom: "1px",
              }}>{item.label}</div>
              <div style={{
                fontSize: "clamp(0.6rem, 1.5vmin, 0.72rem)",
                color: "rgba(0,212,255,0.8)",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
              }}>
                {item.value}
                <span className="sys-indicator-dot" style={{ animationDelay: `${i * 0.3}s` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top center header */}
      <div style={{
        position: "absolute",
        top: "clamp(14px, 2vh, 28px)",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        zIndex: 15,
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease",
      }}>
        <div style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "clamp(0.5rem, 1.5vmin, 0.75rem)",
          color: "rgba(0,180,220,0.45)",
          letterSpacing: "0.4em",
          fontWeight: 500,
        }}>
          NOVA OS ◈ NEURAL OPERATING & VIRTUAL ASSISTANT ENVIRONMENT
        </div>
      </div>

      {/* Bottom center telemetry */}
      <div style={{
        position: "absolute",
        bottom: "clamp(10px, 2vh, 22px)",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        zIndex: 15,
        opacity: progress > 10 ? 1 : 0,
        transition: "opacity 1s ease",
        fontFamily: "var(--font-rajdhani)",
        fontSize: "clamp(0.45rem, 1.2vmin, 0.62rem)",
        color: "rgba(0,150,190,0.4)",
        letterSpacing: "0.2em",
        whiteSpace: "nowrap",
      }}>
        SYS: {new Date().toISOString().split("T")[0]} ◈ PWR: NOMINAL ◈ TEMP: 24°C ◈ MODE: BOOT
      </div>
    </>
  );
});

export default SystemIndicators;
