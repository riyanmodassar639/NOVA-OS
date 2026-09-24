import React, { useState, useEffect } from "react";
import { useBootSequence, BootPhase } from "../../hooks/useBootSequence";
import NovaCore          from "./NovaCore";
import CircuitBackground from "./CircuitBackground";
import ParticleField     from "./ParticleField";
import BootProgress      from "./BootProgress";
import BootStatus        from "./BootStatus";
import SystemIndicators  from "./SystemIndicators";
import Scanline          from "./Scanline";
import "../../styles/nova-boot.css";

interface NovaBootScreenProps {
  onBootComplete?: () => void;
}

const phaseActive = (current: BootPhase, target: BootPhase): boolean => {
  const order: BootPhase[] = [
    "black", "particles", "circuits", "core",
    "outerring", "innerring", "radials", "logo",
    "ostext", "booting", "ready", "complete",
  ];
  return order.indexOf(current) >= order.indexOf(target);
};

const NovaBootScreen: React.FC<NovaBootScreenProps> = ({ onBootComplete }) => {
  const {
    phase,
    progress,
    currentStep,
    isReady,
    startBootSequence,
  } = useBootSequence({ onBootComplete, autoStart: true });

  const [overlayOpacity, setOverlayOpacity] = useState(1);

  // Fade out on completion
  useEffect(() => {
    if (phase === "complete") {
      const t = setTimeout(() => setOverlayOpacity(0), 300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const isParticles   = phaseActive(phase, "particles");
  const isCircuits    = phaseActive(phase, "circuits");
  const isCoreVisible = phaseActive(phase, "core");
  const isOuterRing   = phaseActive(phase, "outerring");
  const isInnerRing   = phaseActive(phase, "innerring");
  const isRadials     = phaseActive(phase, "radials");
  const isLogo        = phaseActive(phase, "logo");
  const isOsText      = phaseActive(phase, "ostext");
  const isBooting     = phaseActive(phase, "booting");

  return (
    <div
      className="nova-boot"
      style={{
        opacity: overlayOpacity,
        transition: "opacity 1.2s ease-in-out",
      }}
    >
      {/* ── Layer 0: Background ──────────────────────────────── */}
      <div className="nova-bg-gradient" />
      <div
        className="nova-grid"
        style={{
          opacity: isCircuits ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      />

      {/* ── Layer 1: Particles ───────────────────────────────── */}
      <ParticleField visible={isParticles} bootProgress={progress} />

      {/* ── Layer 2: Circuit SVG Traces ──────────────────────── */}
      <CircuitBackground visible={isCircuits} progress={progress} />

      {/* ── Layer 3: System HUD ──────────────────────────────── */}
      <SystemIndicators visible={isBooting} progress={progress} />

      {/* ── Layer 4: Central NOVA Core ───────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(20px, 4vh, 40px)",
        }}
      >
        <NovaCore
          visible={isCoreVisible}
          outerRingVisible={isOuterRing}
          innerRingVisible={isInnerRing}
          radialVisible={isRadials}
          logoVisible={isLogo}
          osTextVisible={isOsText}
          progress={progress}
          isReady={isReady}
        />

        {/* ── Boot Status & Progress ──────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(8px, 2vh, 16px)",
            opacity: isBooting ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <BootStatus
            visible={isBooting}
            currentStep={currentStep}
            isReady={isReady}
          />
          <BootProgress
            visible={isBooting}
            progress={progress}
          />
        </div>
      </div>

      {/* ── Layer 5: Vignette & Scanlines ────────────────────── */}
      <div className="nova-vignette" />
      <Scanline visible={isCircuits} />
    </div>
  );
};

export default NovaBootScreen;
