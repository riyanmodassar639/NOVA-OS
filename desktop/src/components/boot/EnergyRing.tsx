import React, { memo } from "react";

interface EnergyRingProps {
  progress: number;
  size: number;
  visible: boolean;
  outerRingVisible: boolean;
  innerRingVisible: boolean;
  radialVisible: boolean;
  completionPulse: boolean;
}

const EnergyRing: React.FC<EnergyRingProps> = memo(({
  progress, size, visible, outerRingVisible, innerRingVisible, radialVisible, completionPulse
}) => {
  if (!visible) return null;

  const cx = size / 2;
  const cy = size / 2;

  // Ring radii
  const R_OUTER    = size * 0.490;
  const R_HALO     = size * 0.470;
  const R_MAIN     = size * 0.445;
  const R_PROGRESS = size * 0.420;
  const R_SEG      = size * 0.395;
  const R_INNER    = size * 0.360;
  const R_TICK     = size * 0.330;
  const R_GLASS    = size * 0.285;
  const R_CORE_OUT = size * 0.210;
  const R_CORE_IN  = size * 0.160;

  const progressCirc = 2 * Math.PI * R_PROGRESS;
  const progressLen  = (progress / 100) * progressCirc;

  // Segmented ring arcs (32 segments)
  const SEG_COUNT = 32;
  const GAP = 0.05;
  const segArcs = Array.from({ length: SEG_COUNT }, (_, i) => {
    const start = (i / SEG_COUNT) * 2 * Math.PI - Math.PI / 2;
    const end   = ((i + 1) / SEG_COUNT) * 2 * Math.PI - Math.PI / 2 - GAP;
    const isMaj = i % 8 === 0;
    const r = R_SEG;
    return {
      d: `M ${cx + r*Math.cos(start)} ${cy + r*Math.sin(start)} A ${r} ${r} 0 0 1 ${cx + r*Math.cos(end)} ${cy + r*Math.sin(end)}`,
      major: isMaj, idx: i,
    };
  });

  // Tick marks (90 ticks)
  const TICKS = 90;
  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const a = (i / TICKS) * 2 * Math.PI - Math.PI / 2;
    const isMaj = i % 15 === 0;
    const isMed = i % 5 === 0;
    const inR  = R_TICK - (isMaj ? size*0.065 : isMed ? size*0.038 : size*0.020);
    return {
      x1: cx + inR        * Math.cos(a), y1: cy + inR        * Math.sin(a),
      x2: cx + R_TICK     * Math.cos(a), y2: cy + R_TICK     * Math.sin(a),
      major: isMaj, med: isMed, idx: i,
    };
  });

  // Radial lines (16)
  const radials = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: cx + R_GLASS    * Math.cos(a), y1: cy + R_GLASS    * Math.sin(a),
      x2: cx + R_MAIN     * Math.cos(a), y2: cy + R_MAIN     * Math.sin(a),
      delay: i * 0.08,
    };
  });

  // Progress leading dot angle
  const progAngle = ((progress / 100) * 2 * Math.PI) - Math.PI / 2;

  // Outer nodes (8)
  const outerNodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
    return {
      cx: cx + (R_MAIN + 14) * Math.cos(a),
      cy: cy + (R_MAIN + 14) * Math.sin(a),
      delay: i * 0.3,
    };
  });

  // Inner hexagonal-ish nodes (6)
  const innerNodes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * 2 * Math.PI - Math.PI / 2;
    return {
      cx: cx + R_CORE_OUT * Math.cos(a),
      cy: cy + R_CORE_OUT * Math.sin(a),
      delay: i * 0.25,
    };
  });

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position:"absolute", top:0, left:0, overflow:"visible" }}
    >
      <defs>
        <radialGradient id="glass-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.10)"/>
          <stop offset="60%" stopColor="rgba(0,30,70,0.50)"/>
          <stop offset="100%" stopColor="rgba(0,10,30,0.80)"/>
        </radialGradient>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)"/>
          <stop offset="40%" stopColor="rgba(100,230,255,0.8)"/>
          <stop offset="100%" stopColor="rgba(0,150,255,0.3)"/>
        </radialGradient>
        <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,100,200,0.8)"/>
          <stop offset="50%" stopColor="rgba(0,212,255,1)"/>
          <stop offset="100%" stopColor="rgba(180,255,255,1)"/>
        </linearGradient>
        <clipPath id="core-clip">
          <circle cx={cx} cy={cy} r={R_GLASS - 2}/>
        </clipPath>
        <style>{`
          .r-cw-slow  { animation: spin-cw  40s linear infinite; transform-origin:${cx}px ${cy}px; }
          .r-cw-med   { animation: spin-cw  12s linear infinite; transform-origin:${cx}px ${cy}px; }
          .r-cw-fast  { animation: spin-cw   8s linear infinite; transform-origin:${cx}px ${cy}px; }
          .r-ccw-slow { animation: spin-ccw 25s linear infinite; transform-origin:${cx}px ${cy}px; }
          .r-ccw-med  { animation: spin-ccw 15s linear infinite; transform-origin:${cx}px ${cy}px; }
          .r-ccw-fast { animation: spin-ccw  6s linear infinite; transform-origin:${cx}px ${cy}px; }
          @keyframes spin-cw  { to { transform: rotate(360deg);  } }
          @keyframes spin-ccw { to { transform: rotate(-360deg); } }
          @keyframes seg-p  { 0%,100%{opacity:0.15} 50%{opacity:0.85} }
          @keyframes node-b { 0%,100%{opacity:1}    50%{opacity:0.08} }
          @keyframes radial-in { from{opacity:0;stroke-dashoffset:50} to{opacity:1;stroke-dashoffset:0} }
          @keyframes core-bg-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
          @keyframes scan-c {
            0%   { transform:translateY(-${R_GLASS}px); opacity:0; }
            8%   { opacity:0.8; }
            92%  { opacity:0.8; }
            100% { transform:translateY(${R_GLASS}px);  opacity:0; }
          }
          @keyframes ep { 0%{transform:scale(1);opacity:0.85} 100%{transform:scale(3);opacity:0} }
          .seg-arc { animation: seg-p var(--sd,2.5s) ease-in-out infinite; animation-delay:var(--sdd,0s); }
          .rnode   { animation: node-b var(--nd,2s) ease-in-out infinite; animation-delay:var(--ndd,0s); }
          .rad-line{ stroke-dasharray:50; animation: radial-in 0.6s ease-out forwards; animation-delay:var(--rd,0s); opacity:0; }
        `}</style>
      </defs>

      {/* ── Outer ambient glow ─────────────────────────────── */}
      {outerRingVisible && (
        <circle cx={cx} cy={cy} r={R_OUTER + 25}
          fill="none" stroke="rgba(0,212,255,0.04)" strokeWidth={50}
          
          style={{ animation:"core-bg-pulse 4s ease-in-out infinite", transformOrigin:`${cx}px ${cy}px` }}
        />
      )}

      {/* ── Halo ring (CW slow) ────────────────────────────── */}
      {outerRingVisible && (
        <circle cx={cx} cy={cy} r={R_HALO}
          fill="none"
          stroke="rgba(0,212,255,0.10)"
          strokeWidth={1}
          className="r-cw-slow"
          strokeDasharray="3 12"
          
        />
      )}

      {/* ── Outer ring (CW slow) ───────────────────────────── */}
      {outerRingVisible && (
        <circle cx={cx} cy={cy} r={R_OUTER}
          fill="none"
          stroke="rgba(0,212,255,0.25)"
          strokeWidth={1.5}
          className="r-cw-slow"
          
        />
      )}

      {/* ── Main bright ring (CW med) ──────────────────────── */}
      {outerRingVisible && (
        <circle cx={cx} cy={cy} r={R_MAIN}
          fill="none"
          stroke="rgba(0,212,255,0.2)"
          strokeWidth={3}
        />
      )}

      {/* ── Segmented ring (CCW med) ───────────────────────── */}
      {innerRingVisible && (
        <g className="r-ccw-med">
          {segArcs.map((s, i) => (
            <path key={i} d={s.d} fill="none"
              stroke={s.major ? "rgba(0,220,255,0.75)" : "rgba(0,180,220,0.22)"}
              strokeWidth={s.major ? 2.5 : 1}
              className="seg-arc"
              style={{ "--sd":`${1.8 + (i%5)*0.4}s`, "--sdd":`${(i*0.12)%2}s` } as React.CSSProperties}
            />
          ))}
        </g>
      )}

      {/* ── Tick marks (CW fast) ──────────────────────────── */}
      {innerRingVisible && (
        <g className="r-cw-fast">
          {ticks.map((t) => (
            <line key={t.idx}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.major ? "rgba(0,220,255,0.7)" : t.med ? "rgba(0,200,240,0.35)" : "rgba(0,180,220,0.15)"}
              strokeWidth={t.major ? 1.5 : t.med ? 1 : 0.5}
            />
          ))}
        </g>
      )}

      {/* ── Inner dash ring (CCW slow) ────────────────────── */}
      {innerRingVisible && (
        <circle cx={cx} cy={cy} r={R_INNER}
          fill="none"
          stroke="rgba(0,212,255,0.35)"
          strokeWidth={1.5}
          strokeDasharray="6 10"
          className="r-ccw-slow"
          
        />
      )}

      {/* ── Outer nodes ───────────────────────────────────── */}
      {innerRingVisible && outerNodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r={3.5}
          fill="rgba(0,212,255,0.9)"
          className="rnode"
          style={{ "--nd":`${1.4 + i*0.25}s`, "--ndd":`${n.delay}s` } as React.CSSProperties}
          
        />
      ))}

      {/* ── Glass inner layer ──────────────────────────────── */}
      {innerRingVisible && (
        <circle cx={cx} cy={cy} r={R_GLASS}
          fill="url(#glass-grad)"
          stroke="rgba(0,212,255,0.18)"
          strokeWidth={1}
        />
      )}

      {/* ── Scanline sweep inside core ─────────────────────── */}
      {innerRingVisible && (
        <rect x={cx - R_GLASS} y={cy - 1.5}
          width={R_GLASS * 2} height={3}
          fill="rgba(0,212,255,0.2)"
          clipPath="url(#core-clip)"
          style={{ animation:`scan-c 5s ease-in-out infinite`, transformOrigin:`${cx}px ${cy}px` }}
        />
      )}

      {/* ── Radial burst lines ────────────────────────────── */}
      {radialVisible && radials.map((r, i) => (
        <line key={i}
          x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="rgba(0,212,255,0.3)"
          strokeWidth={0.75}
          className="rad-line"
          style={{ "--rd":`${2.5 + r.delay}s` } as React.CSSProperties}
        />
      ))}

      {/* ── Inner hex nodes ────────────────────────────────── */}
      {innerRingVisible && innerNodes.map((n, i) => (
        <g key={i}>
          <line
            x1={cx} y1={cy} x2={n.cx} y2={n.cy}
            stroke="rgba(0,212,255,0.12)"
            strokeWidth={0.75}
          />
          <circle cx={n.cx} cy={n.cy} r={2.5}
            fill="rgba(0,212,255,0.8)"
            className="rnode"
            style={{ "--nd":`${1.6+i*0.3}s`, "--ndd":`${n.delay}s` } as React.CSSProperties}
            
          />
        </g>
      ))}

      {/* ── Core inner glow sphere ─────────────────────────── */}
      {innerRingVisible && (
        <>
          <circle cx={cx} cy={cy} r={R_CORE_IN}
            fill="url(#core-grad)"
            
            style={{ animation:"core-bg-pulse 2s ease-in-out infinite", transformOrigin:`${cx}px ${cy}px` }}
          />
          <circle cx={cx} cy={cy} r={R_CORE_IN * 0.55}
            fill="rgba(255,255,255,0.95)"
            
          />
        </>
      )}

      {/* ── Completion energy pulses ──────────────────────── */}
      {completionPulse && [0,1,2].map(i => (
        <circle key={i} cx={cx} cy={cy} r={R_MAIN}
          fill="none"
          stroke="rgba(0,220,255,0.8)"
          strokeWidth={2}
          style={{ animation:`ep 1.4s ease-out ${i*0.35}s forwards`, transformOrigin:`${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  );
});

export default EnergyRing;
