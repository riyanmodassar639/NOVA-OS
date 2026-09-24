import React, { useState, useEffect, memo } from "react";
import EnergyRing from "./EnergyRing";
import "../../styles/nova-boot.css";

interface NovaCoreProps {
  visible: boolean;
  outerRingVisible: boolean;
  innerRingVisible: boolean;
  radialVisible: boolean;
  logoVisible: boolean;
  osTextVisible: boolean;
  progress: number;
  isReady: boolean;
}

const NovaCore: React.FC<NovaCoreProps> = memo(({
  visible,
  outerRingVisible,
  innerRingVisible,
  logoVisible,
  osTextVisible,
  radialVisible,
  progress,
  isReady,
}) => {
  const [completionPulse, setCompletionPulse] = useState(false);
  const [coreSize, setCoreSize] = useState(420);

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.44;
      setCoreSize(Math.max(260, Math.min(size, 460)));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => setCompletionPulse(true), 400);
      return () => clearTimeout(t);
    }
  }, [isReady]);

  if (!visible) return null;

  return (
    <div
      className="nova-core-wrap"
      style={{ width: coreSize, height: coreSize, '--core-size': `${coreSize}px` } as React.CSSProperties}
    >
      {/* SVG Ring System */}
      <EnergyRing
        progress={progress}
        size={coreSize}
        visible={visible}
        outerRingVisible={outerRingVisible}
        innerRingVisible={innerRingVisible}
        radialVisible={radialVisible}
        completionPulse={completionPulse}
      />

      {/* Center Logo */}
      <div
        className="nova-text-container"
        style={{
          opacity: logoVisible ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {isReady ? (
          <span
            className="nova-title"
            style={{
              textShadow: "0 0 10px #fff, 0 0 30px #00d4ff, 0 0 60px rgba(0,212,255,0.8), 0 0 120px rgba(0,212,255,0.5)",
              animation: "glow-pulse 2s ease-in-out infinite"
            }}
          >
            WELCOME
          </span>
        ) : (
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <span className="nova-title">NOVA</span>
            <span
              className="nova-title"
              style={{
                opacity: osTextVisible ? 1 : 0,
                transform: osTextVisible ? "translateX(0) scale(1)" : "translateX(8px) scale(0.9)",
                transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                marginLeft: "15px", // space between NOVA and OS
              }}
            >
              OS
            </span>
          </div>
        )}
        
        {/* Tiny version tag that appears when ready */}
        <span 
          className="nova-ver-tag"
          style={{
            opacity: isReady ? 1 : 0,
            transform: isReady ? "translateY(0)" : "translateY(-4px)",
            transition: "opacity 0.6s ease-in 0.2s, transform 0.6s ease-out 0.2s",
          }}
        >
          v0.1.0_ALPHA_CORE
        </span>
      </div>
    </div>
  );
});

export default NovaCore;
