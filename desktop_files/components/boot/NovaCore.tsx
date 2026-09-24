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
  const [coreSize, setCoreSize] = useState(380);

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.42;
      setCoreSize(Math.max(220, Math.min(size, 420)));
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
      style={{ width: coreSize, height: coreSize }}
    >
      {/* Ambient glow behind core */}
      <div className="core-glow" />

      {/* All animated rings via SVG */}
      <EnergyRing
        progress={progress}
        size={coreSize}
        visible={outerRingVisible}
        completionPulse={completionPulse}
      />

      {/* NOVA text centered */}
      <div
        className="nova-text-container"
        style={{
          opacity: logoVisible ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      >
        <span
          className={`nova-title ${logoVisible ? "nova-title-glitch" : ""}`}
          style={{
            textShadow: isReady
              ? "0 0 20px #00d4ff, 0 0 60px rgba(0,212,255,0.8), 0 0 100px rgba(0,212,255,0.5)"
              : undefined,
          }}
        >
          NOVA
        </span>
        <span
          className="nova-subtitle"
          style={{
            opacity: osTextVisible ? 1 : 0,
            transform: osTextVisible ? "translateY(0) scaleX(1)" : "translateY(4px) scaleX(0.85)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          OS
        </span>
      </div>
    </div>
  );
});

export default NovaCore;
