import React, { memo } from "react";
import "../../../styles/nova-hud.css";

const HUDBackground: React.FC = memo(() => {
  return (
    <>
      <div className="hud-hex-grid" />
      <div className="hud-circuit-bg">
        <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trace-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,255,255,0.4)" />
            <stop offset="50%" stopColor="rgba(0,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,255,255,0.4)" />
          </linearGradient>
          
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Vertical Trunk (Runs down from core) */}
        <path d="M calc(50% - 40px) 100 L calc(50% - 40px) 600 L calc(50% - 100px) 700 L calc(50% - 100px) 1000" className="hud-circuit-path" />
        <path d="M calc(50% - 20px) 100 L calc(50% - 20px) 620 L calc(50% - 80px) 720 L calc(50% - 80px) 1000" className="hud-circuit-path" />
        <path d="M calc(50% + 20px) 100 L calc(50% + 20px) 620 L calc(50% + 80px) 720 L calc(50% + 80px) 1000" className="hud-circuit-path" />
        <path d="M calc(50% + 40px) 100 L calc(50% + 40px) 600 L calc(50% + 100px) 700 L calc(50% + 100px) 1000" className="hud-circuit-path" />

        {/* Nodes for Central Trunk */}
        <circle cx="calc(50% - 100px)" cy="700" r="3" className="hud-circuit-node" />
        <circle cx="calc(50% + 100px)" cy="700" r="3" className="hud-circuit-node" />

        {/* Horizontal Traces to side panels */}
        <path d="M 0 150 L 300 150 L 320 170" className="hud-circuit-path" />
        <path d="M 0 450 L 320 450 L 340 430" className="hud-circuit-path" />
        
        <path d="M 100% 200 L calc(100% - 300px) 200 L calc(100% - 320px) 180" className="hud-circuit-path" />
        <path d="M 100% 600 L calc(100% - 320px) 600 L calc(100% - 340px) 620" className="hud-circuit-path" />

        {/* Random structural rectangles */}
        <rect x="50" y="50" width="10" height="40" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="1" />
        <rect x="65" y="50" width="4" height="20" fill="rgba(0,255,255,0.3)" />
        <rect x="calc(100% - 80px)" y="100" width="30" height="30" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="1" />
        <circle cx="calc(100% - 65px)" cy="115" r="4" fill="rgba(0,255,255,0.5)" />
      </svg>
    </div>
    </>
  );
});

export default HUDBackground;
