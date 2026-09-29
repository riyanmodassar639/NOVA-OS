import React, { memo } from "react";

interface CircuitBackgroundProps {
  visible: boolean;
  progress?: number;
}

const CircuitBackground: React.FC<CircuitBackgroundProps> = memo(({ visible }) => {
  if (!visible) return null;

  return (
    <svg
      width="100%" height="100%"
      style={{
        position: "absolute", inset: 0,
        zIndex: 5, pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease",
        /* Use CSS filter instead of SVG filter for MASSIVE performance boost */
        filter: "drop-shadow(0 0 4px rgba(0,212,255,0.6))",
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="trace-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 212, 255, 0.05)" />
          <stop offset="50%" stopColor="rgba(0, 212, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(0, 212, 255, 0.05)" />
        </linearGradient>
      </defs>

      <g>
        {/* Top Left Main */}
        <path d="M 0 100 L 150 100 L 200 150 L 300 150 L 350 100" fill="none" stroke="url(#trace-grad)" strokeWidth="1" />
        <circle cx="350" cy="100" r="2.5" fill="rgba(0,212,255,0.8)" />
        <path d="M 0 50 L 100 50 L 150 100" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />

        {/* Top Left Secondary Pattern */}
        <path d="M 50 0 L 50 60 L 80 90 L 80 150" fill="none" stroke="url(#trace-grad)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="80" cy="150" r="2" fill="rgba(0,212,255,0.6)" />
        
        {/* Top Right Main */}
        <path d="M 100% 120 L calc(100% - 150px) 120 L calc(100% - 200px) 170 L calc(100% - 300px) 170" fill="none" stroke="url(#trace-grad)" strokeWidth="1" />
        <circle cx="calc(100% - 300px)" cy="170" r="2.5" fill="rgba(0,212,255,0.8)" />

        {/* Top Right Secondary */}
        <path d="M calc(100% - 60px) 0 L calc(100% - 60px) 80 L calc(100% - 120px) 140" fill="none" stroke="url(#trace-grad)" strokeWidth="1" strokeDasharray="6 3" />
        <circle cx="calc(100% - 120px)" cy="140" r="2" fill="rgba(0,212,255,0.6)" />

        {/* Bottom Left Main */}
        <path d="M 0 calc(100% - 100px) L 120 calc(100% - 100px) L 170 calc(100% - 150px) L 250 calc(100% - 150px)" fill="none" stroke="url(#trace-grad)" strokeWidth="1" />
        <circle cx="250" cy="calc(100% - 150px)" r="2.5" fill="rgba(0,212,255,0.8)" />

        {/* Bottom Left Secondary */}
        <path d="M 80 100% L 80 calc(100% - 60px) L 130 calc(100% - 110px)" fill="none" stroke="url(#trace-grad)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="130" cy="calc(100% - 110px)" r="2" fill="rgba(0,212,255,0.6)" />

        {/* Bottom Right Main */}
        <path d="M 100% calc(100% - 80px) L calc(100% - 180px) calc(100% - 80px) L calc(100% - 230px) calc(100% - 130px) L calc(100% - 350px) calc(100% - 130px)" fill="none" stroke="url(#trace-grad)" strokeWidth="1" />
        <circle cx="calc(100% - 350px)" cy="calc(100% - 130px)" r="2.5" fill="rgba(0,212,255,0.8)" />

        {/* Bottom Right Secondary */}
        <path d="M calc(100% - 100px) 100% L calc(100% - 100px) calc(100% - 50px) L calc(100% - 150px) calc(100% - 100px) L calc(100% - 250px) calc(100% - 100px)" fill="none" stroke="url(#trace-grad)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="calc(100% - 250px)" cy="calc(100% - 100px)" r="2" fill="rgba(0,212,255,0.6)" />

        {/* Center Accent Lines (Subtle) */}
        <path d="M calc(50% - 200px) calc(50% - 200px) L calc(50% - 150px) calc(50% - 250px)" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
        <path d="M calc(50% + 200px) calc(50% + 200px) L calc(50% + 150px) calc(50% + 250px)" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      </g>
    </svg>
  );
});

export default CircuitBackground;
