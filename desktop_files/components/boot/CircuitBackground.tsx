import React, { memo } from "react";

interface CircuitBackgroundProps {
  visible: boolean;
  progress: number;
}

// Pre-defined circuit path data for deterministic layout
const H_LINES = [
  { y: "12%",  x1: "0%",   x2: "18%", delay: 0.5 },
  { y: "12%",  x1: "82%",  x2: "100%",delay: 0.7 },
  { y: "88%",  x1: "0%",   x2: "22%", delay: 1.0 },
  { y: "88%",  x1: "78%",  x2: "100%",delay: 1.2 },
  { y: "30%",  x1: "0%",   x2: "12%", delay: 0.3 },
  { y: "70%",  x1: "88%",  x2: "100%",delay: 0.9 },
  { y: "50%",  x1: "0%",   x2: "8%",  delay: 1.4 },
  { y: "50%",  x1: "92%",  x2: "100%",delay: 1.1 },
];

const V_LINES = [
  { x: "8%",   y1: "10%",  y2: "90%", delay: 0.4 },
  { x: "92%",  y1: "10%",  y2: "90%", delay: 0.6 },
  { x: "15%",  y1: "8%",   y2: "25%", delay: 0.8 },
  { x: "85%",  y1: "8%",   y2: "25%", delay: 0.2 },
  { x: "15%",  y1: "75%",  y2: "92%", delay: 1.3 },
  { x: "85%",  y1: "75%",  y2: "92%", delay: 1.6 },
  { x: "22%",  y1: "8%",   y2: "15%", delay: 0.5 },
  { x: "78%",  y1: "8%",   y2: "15%", delay: 0.7 },
];

// Corner bracket structures
const CORNERS = [
  // top-left
  { points: "2,2 60,2 60,10 10,10 10,60 2,60", transform: "" },
  // top-right
  { points: "238,2 180,2 180,10 230,10 230,60 238,60", transform: "" },
  // bottom-left
  { points: "2,178 60,178 60,170 10,170 10,120 2,120", transform: "" },
  // bottom-right
  { points: "238,178 180,178 180,170 230,170 230,120 238,120", transform: "" },
];

const CircuitBackground: React.FC<CircuitBackgroundProps> = memo(({ visible, progress }) => {
  if (!visible) return null;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 6,
        pointerEvents: "none",
        overflow: "visible",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glowing line filter */}
        <filter id="circuit-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Travelling light gradient */}
        <linearGradient id="travel-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,212,255,0)" />
          <stop offset="50%" stopColor="rgba(0,212,255,0.9)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0)" />
        </linearGradient>

        <linearGradient id="travel-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,212,255,0)" />
          <stop offset="50%" stopColor="rgba(0,212,255,0.9)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0)" />
        </linearGradient>

        <style>{`
          @keyframes travel-h {
            0%   { stroke-dashoffset: 200; }
            100% { stroke-dashoffset: -200; }
          }
          @keyframes travel-v {
            0%   { stroke-dashoffset: 200; }
            100% { stroke-dashoffset: -200; }
          }
          @keyframes line-appear {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes seg-flash {
            0%, 100% { opacity: 0.25; }
            50%       { opacity: 0.8; }
          }
          .circuit-line {
            stroke: rgba(0,180,220,0.22);
            stroke-width: 1;
            fill: none;
            animation: line-appear 0.8s ease-out forwards;
          }
          .circuit-travel {
            stroke: rgba(0,212,255,0.9);
            stroke-width: 1.5;
            stroke-dasharray: 30 200;
            fill: none;
            filter: url(#circuit-glow);
          }
          .circuit-travel-h {
            animation: travel-h 3s linear infinite;
          }
          .circuit-travel-v {
            animation: travel-v 4s linear infinite;
          }
          .circuit-node-sm {
            fill: rgba(0,212,255,0.7);
            animation: seg-flash 2s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Horizontal circuit lines */}
      {H_LINES.map((l, i) => (
        <g key={`h-${i}`} style={{ animationDelay: `${l.delay}s` }}>
          <line
            className="circuit-line"
            x1={l.x1} y1={l.y}
            x2={l.x2} y2={l.y}
            style={{ animationDelay: `${l.delay}s`, opacity: 0 }}
          />
          <line
            className={`circuit-travel circuit-travel-h`}
            x1={l.x1} y1={l.y}
            x2={l.x2} y2={l.y}
            style={{ animationDelay: `${l.delay + 0.5}s` }}
          />
        </g>
      ))}

      {/* Vertical circuit lines */}
      {V_LINES.map((l, i) => (
        <g key={`v-${i}`}>
          <line
            className="circuit-line"
            x1={l.x} y1={l.y1}
            x2={l.x} y2={l.y2}
            style={{ animationDelay: `${l.delay}s`, opacity: 0 }}
          />
          <line
            className={`circuit-travel circuit-travel-v`}
            x1={l.x} y1={l.y1}
            x2={l.x} y2={l.y2}
            style={{ animationDelay: `${l.delay + 0.5}s` }}
          />
        </g>
      ))}

      {/* Corner nodes */}
      {[
        { cx: "8%",  cy: "12%", d: 0.0 }, { cx: "92%", cy: "12%", d: 0.3 },
        { cx: "8%",  cy: "88%", d: 0.6 }, { cx: "92%", cy: "88%", d: 0.9 },
        { cx: "15%", cy: "8%",  d: 0.2 }, { cx: "85%", cy: "8%",  d: 0.5 },
        { cx: "15%", cy: "92%", d: 0.8 }, { cx: "85%", cy: "92%", d: 1.1 },
      ].map((n, i) => (
        <circle
          key={`node-${i}`}
          cx={n.cx} cy={n.cy}
          r="3"
          className="circuit-node-sm"
          style={{ animationDelay: `${n.d}s` }}
          filter="url(#circuit-glow)"
        />
      ))}

      {/* Corner HUD brackets */}
      {/* Top Left */}
      <g style={{ opacity: progress > 0 ? 1 : 0.4, transition: "opacity 1s" }}>
        <polyline
          points="30,30 30,80 80,80"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
        <polyline
          points="30,30 80,30"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
      </g>

      {/* Top Right */}
      <g style={{ opacity: progress > 0 ? 1 : 0.4, transition: "opacity 1s" }}>
        <polyline
          points="calc(100% - 30px),30 calc(100% - 30px),80 calc(100% - 80px),80"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
        <polyline
          points="calc(100% - 30px),30 calc(100% - 80px),30"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
      </g>

      {/* Bottom Left */}
      <g style={{ opacity: progress > 0 ? 1 : 0.4, transition: "opacity 1s" }}>
        <polyline
          points="30,calc(100% - 30px) 30,calc(100% - 80px) 80,calc(100% - 80px)"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
        <polyline
          points="30,calc(100% - 30px) 80,calc(100% - 30px)"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
      </g>

      {/* Bottom Right */}
      <g style={{ opacity: progress > 0 ? 1 : 0.4, transition: "opacity 1s" }}>
        <polyline
          points="calc(100% - 30px),calc(100% - 30px) calc(100% - 30px),calc(100% - 80px) calc(100% - 80px),calc(100% - 80px)"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
        <polyline
          points="calc(100% - 30px),calc(100% - 30px) calc(100% - 80px),calc(100% - 30px)"
          style={{ stroke: "rgba(0,212,255,0.6)", fill: "none", strokeWidth: 1.5 }}
          filter="url(#circuit-glow)"
        />
      </g>
    </svg>
  );
});

export default CircuitBackground;
