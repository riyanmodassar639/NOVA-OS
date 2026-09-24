import React, { memo } from "react";

interface EnergyRingProps {
  progress: number;   // 0–100
  size: number;       // px
  visible: boolean;
  completionPulse: boolean;
}

const EnergyRing: React.FC<EnergyRingProps> = memo(({ progress, size, visible, completionPulse }) => {
  const cx = size / 2;
  const cy = size / 2;

  // Progress ring geometry
  const outerR   = size * 0.48;
  const mainR    = size * 0.44;
  const secondR  = size * 0.40;
  const innerR   = size * 0.36;
  const tickR    = size * 0.33;
  const glassR   = size * 0.28;

  // Circumferences for stroke-dasharray
  const mainCirc    = 2 * Math.PI * mainR;
  const progressLen = (progress / 100) * mainCirc;
  const innerCirc   = 2 * Math.PI * innerR;

  // Generate radial tick marks (72 ticks, every 5°)
  const TICK_COUNT = 72;
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 9 === 0;
    const inR  = tickR - (isMajor ? size * 0.06 : size * 0.03);
    const outR = tickR;
    return {
      x1: cx + inR  * Math.cos(angle),
      y1: cy + inR  * Math.sin(angle),
      x2: cx + outR * Math.cos(angle),
      y2: cy + outR * Math.sin(angle),
      major: isMajor,
      idx: i,
    };
  });

  // Generate radial burst lines (12 lines, every 30°)
  const RADIAL_COUNT = 12;
  const radials = Array.from({ length: RADIAL_COUNT }, (_, i) => {
    const angle = (i / RADIAL_COUNT) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: cx + (size * 0.30) * Math.cos(angle),
      y1: cy + (size * 0.30) * Math.sin(angle),
      x2: cx + (size * 0.50) * Math.cos(angle),
      y2: cy + (size * 0.50) * Math.sin(angle),
      delay: i * 0.1,
    };
  });

  // Segment arcs for technical ring
  const SEG_COUNT = 24;
  const segGap = 0.04; // radians gap between segments
  const segArcs = Array.from({ length: SEG_COUNT }, (_, i) => {
    const startAngle = (i / SEG_COUNT) * 2 * Math.PI - Math.PI / 2;
    const endAngle   = ((i + 1) / SEG_COUNT) * 2 * Math.PI - Math.PI / 2 - segGap;
    const isMajorSeg = i % 6 === 0;
    const r = secondR;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return { x1, y1, x2, y2, large, r, major: isMajorSeg, idx: i };
  });

  if (!visible) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="glass-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,15,40,0.75)" />
        </radialGradient>
        <style>{`
          @keyframes ring-cw  { from { transform: rotate(0deg);   transform-origin: ${cx}px ${cy}px; }
                                to   { transform: rotate(360deg); transform-origin: ${cx}px ${cy}px; } }
          @keyframes ring-ccw { from { transform: rotate(0deg);    transform-origin: ${cx}px ${cy}px; }
                                to   { transform: rotate(-360deg); transform-origin: ${cx}px ${cy}px; } }
          @keyframes ring-cw-fast { from { transform: rotate(0deg);   transform-origin: ${cx}px ${cy}px; }
                                    to   { transform: rotate(360deg); transform-origin: ${cx}px ${cy}px; } }
          @keyframes seg-pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }
          @keyframes radial-appear { from{opacity:0; stroke-dashoffset:40} to{opacity:1; stroke-dashoffset:0} }
          @keyframes node-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }
          @keyframes core-pulse { 0%,100%{opacity:0.6;filter:blur(40px)} 50%{opacity:1;filter:blur(50px)} }
          @keyframes scan-sweep-core {
            0%   { transform: translateY(-${glassR}px); opacity: 0; }
            10%  { opacity: 0.6; }
            90%  { opacity: 0.6; }
            100% { transform: translateY(${glassR}px); opacity: 0; }
          }
          .seg-arc { animation: seg-pulse var(--seg-dur,3s) ease-in-out infinite; animation-delay: var(--seg-d,0s); }
          .radial-line { stroke-dasharray: 40; animation: radial-appear 0.5s ease-out forwards; animation-delay: var(--r-d,0s); }
          .node-dot { animation: node-blink var(--n-d,2s) ease-in-out infinite; animation-delay: var(--n-off,0s); }
        `}</style>
      </defs>

      {/* ── Outer ambient glow ─────────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={outerR + 20}
        fill="none"
        stroke="rgba(0,212,255,0.06)"
        strokeWidth={40}
        filter="url(#strong-glow)"
        style={{
          animation: "core-pulse 3s ease-in-out infinite",
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />

      {/* ── Outer ring (slow CW) ───────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={outerR}
        fill="none"
        stroke="rgba(0,212,255,0.18)"
        strokeWidth={1.5}
        filter="url(#ring-glow)"
        style={{ animation: "ring-cw 40s linear infinite" }}
      />

      {/* ── Main energy ring (progress fill) ──────────────── */}
      <circle
        cx={cx} cy={cy} r={mainR}
        fill="none"
        stroke="rgba(0,212,255,0.12)"
        strokeWidth={3}
      />
      {/* Progress arc */}
      <circle
        cx={cx} cy={cy} r={mainR}
        fill="none"
        stroke="rgba(0,212,255,1)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${progressLen} ${mainCirc}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter="url(#ring-glow)"
        style={{ transition: "stroke-dasharray 0.15s linear" }}
      />
      {/* Leading glow dot */}
      {progress > 0 && progress < 100 && (() => {
        const angle = ((progress / 100) * 2 * Math.PI) - Math.PI / 2;
        return (
          <circle
            cx={cx + mainR * Math.cos(angle)}
            cy={cy + mainR * Math.sin(angle)}
            r={5}
            fill="white"
            filter="url(#strong-glow)"
          />
        );
      })()}

      {/* ── Segmented second ring (slow CCW) ──────────────── */}
      {segArcs.map((seg, i) => (
        <path
          key={i}
          d={`M ${seg.x1} ${seg.y1} A ${seg.r} ${seg.r} 0 ${seg.large} 1 ${seg.x2} ${seg.y2}`}
          fill="none"
          stroke={seg.major ? "rgba(0,212,255,0.6)" : "rgba(0,180,220,0.25)"}
          strokeWidth={seg.major ? 2 : 1}
          className="seg-arc"
          style={{
            "--seg-dur": `${2 + (i % 4)}s`,
            "--seg-d": `${(i * 0.15) % 2}s`,
            animation: "ring-ccw 18s linear infinite, seg-pulse 2.5s ease-in-out infinite",
            animationDelay: `0s, ${(i * 0.15) % 2}s`,
            transformOrigin: `${cx}px ${cy}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Tick marks ring ───────────────────────────────── */}
      {ticks.map((t) => (
        <line
          key={t.idx}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={t.major ? "rgba(0,212,255,0.6)" : "rgba(0,180,220,0.2)"}
          strokeWidth={t.major ? 1.5 : 0.75}
          style={{
            animation: "ring-cw 25s linear infinite",
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
      ))}

      {/* ── Inner ring (slow CW) ──────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={innerR}
        fill="none"
        stroke="rgba(0,212,255,0.3)"
        strokeWidth={1.5}
        strokeDasharray="4 8"
        style={{ animation: "ring-cw 20s linear infinite" }}
      />

      {/* ── Radial burst lines ────────────────────────────── */}
      {radials.map((r, i) => (
        <line
          key={i}
          x1={r.x1} y1={r.y1}
          x2={r.x2} y2={r.y2}
          stroke="rgba(0,212,255,0.25)"
          strokeWidth={0.75}
          className="radial-line"
          style={{
            "--r-d": `${2.5 + r.delay}s`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Small circuit nodes around the ring ──────────── */}
      {[0,1,2,3,4,5,6,7].map((i) => {
        const angle = (i / 8) * 2 * Math.PI;
        const r = mainR + 10;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={3}
            fill="rgba(0,212,255,0.8)"
            className="node-dot"
            style={{
              "--n-d": `${1.5 + i * 0.3}s`,
              "--n-off": `${i * 0.25}s`,
            } as React.CSSProperties}
            filter="url(#ring-glow)"
          />
        );
      })}

      {/* ── Inner glass layer ─────────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={glassR}
        fill="url(#glass-grad)"
        stroke="rgba(0,212,255,0.15)"
        strokeWidth={1}
      />

      {/* ── Scanline sweep inside core ────────────────────── */}
      <clipPath id="core-clip">
        <circle cx={cx} cy={cy} r={glassR - 2} />
      </clipPath>
      <rect
        x={cx - glassR}
        y={cy - 2}
        width={glassR * 2}
        height={3}
        fill="rgba(0,212,255,0.15)"
        clipPath="url(#core-clip)"
        style={{
          animation: "scan-sweep-core 4s ease-in-out infinite",
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />

      {/* ── Completion energy pulse rings ─────────────────── */}
      {completionPulse && [0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={outerR}
          fill="none"
          stroke="rgba(0,212,255,0.7)"
          strokeWidth={2}
          style={{
            animation: `energy-pulse 1.2s ease-out ${i * 0.3}s forwards`,
          }}
        />
      ))}
    </svg>
  );
});

export default EnergyRing;
