import React, { useRef, useEffect, memo } from "react";

interface ParticleFieldProps {
  visible: boolean;
  bootProgress: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; opacity: number;
  life: number; maxLife: number;
  type: "dust" | "streak" | "core" | "spark";
  color: string;
}

const COLORS = [
  "0,212,255",   // cyan
  "0,180,255",   // blue-cyan
  "80,240,255",  // light cyan
  "0,100,255",   // deep blue
  "120,80,255",  // purple tint
];

const ParticleField: React.FC<ParticleFieldProps> = memo(({ visible, bootProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const alphaRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnParticle = (): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      const coreX = w / 2;
      const coreY = h / 2;
      const r = Math.random();
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      if (r < 0.3) {
        // Core-directed particles
        const edge = Math.floor(Math.random() * 4);
        let x: number, y: number;
        if (edge === 0) { x = Math.random() * w; y = 0; }
        else if (edge === 1) { x = w; y = Math.random() * h; }
        else if (edge === 2) { x = Math.random() * w; y = h; }
        else { x = 0; y = Math.random() * h; }
        const angle = Math.atan2(coreY - y, coreX - x);
        const speed = 0.4 + Math.random() * 0.8;
        return {
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          radius: 0.8 + Math.random() * 1.8, opacity: 0,
          life: 0, maxLife: 200 + Math.random() * 200,
          type: "core", color,
        };
      } else if (r < 0.55) {
        // Streak particles (fast horizontal)
        const side = Math.random() < 0.5 ? -1 : 1;
        return {
          x: side > 0 ? -20 : w + 20,
          y: Math.random() * h,
          vx: side * (0.8 + Math.random() * 1.5),
          vy: (Math.random() - 0.5) * 0.3,
          radius: 0.5 + Math.random(),
          opacity: 0, life: 0,
          maxLife: 120 + Math.random() * 100,
          type: "streak", color,
        };
      } else if (r < 0.75) {
        // Sparks near core
        const angle2 = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 180;
        return {
          x: coreX + Math.cos(angle2) * dist,
          y: coreY + Math.sin(angle2) * dist,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 0.4 + Math.random() * 0.8,
          opacity: 0, life: 0,
          maxLife: 80 + Math.random() * 80,
          type: "spark", color,
        };
      } else {
        // Ambient dust
        return {
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 0.5 + Math.random() * 1.2,
          opacity: 0, life: 0,
          maxLife: 250 + Math.random() * 250,
          type: "dust", color,
        };
      }
    };

    // Seed
    const initial = 100;
    for (let i = 0; i < initial; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    const draw = () => {
      alphaRef.current = Math.min(1, alphaRef.current + 0.008);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const coreX = canvas.width / 2;
      const coreY = canvas.height / 2;

      particlesRef.current.forEach((p, i) => {
        p.life += 1;
        p.x += p.vx; p.y += p.vy;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) p.opacity = lifeRatio / 0.15;
        else if (lifeRatio > 0.75) p.opacity = (1 - lifeRatio) / 0.25;
        else p.opacity = 1;

        // Core particles disappear when close
        if (p.type === "core") {
          const dx = coreX - p.x; const dy = coreY - p.y;
          if (dx * dx + dy * dy < 70 * 70) p.life = p.maxLife;
        }

        const alpha = p.opacity * 0.6 * alphaRef.current;
        const rgb = p.color;

        if (p.type === "streak") {
          // Draw as horizontal streak line
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx * 12, p.y);
          ctx.lineTo(p.x + p.vx * 4, p.y);
          const grad = ctx.createLinearGradient(p.x - p.vx * 12, 0, p.x + p.vx * 4, 0);
          grad.addColorStop(0, `rgba(${rgb},0)`);
          grad.addColorStop(0.5, `rgba(${rgb},${alpha * 0.9})`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.radius;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${alpha})`;
          ctx.fill();
          // Soft glow
          if (p.radius > 1 && p.type !== "dust") {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
            g.addColorStop(0, `rgba(${rgb},${alpha * 0.35})`);
            g.addColorStop(1, `rgba(${rgb},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }
        }

        if (p.life >= p.maxLife) particlesRef.current[i] = spawnParticle();
      });

      // Grow count with progress
      const target = 120 + Math.floor(bootProgress * 1.2);
      while (particlesRef.current.length < target) particlesRef.current.push(spawnParticle());

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [visible]);

  if (!visible) return null;
  return (
    <canvas ref={canvasRef} style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none" }} />
  );
});
export default ParticleField;
