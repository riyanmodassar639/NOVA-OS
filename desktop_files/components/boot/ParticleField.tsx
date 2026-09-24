import React, { useRef, useEffect, memo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
  toCore: boolean;
  coreX: number;
  coreY: number;
}

interface ParticleFieldProps {
  visible: boolean;
  bootProgress: number;
}

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
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnParticle = (): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      const coreX = w / 2;
      const coreY = h / 2;
      const toCore = Math.random() < 0.35;

      // Spawn on perimeter
      const edge = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if (edge === 0) { x = Math.random() * w; y = 0; }
      else if (edge === 1) { x = w; y = Math.random() * h; }
      else if (edge === 2) { x = Math.random() * w; y = h; }
      else { x = 0; y = Math.random() * h; }

      let vx: number, vy: number;
      if (toCore) {
        const angle = Math.atan2(coreY - y, coreX - x);
        const speed = 0.3 + Math.random() * 0.5;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        vx = (Math.random() - 0.5) * 0.4;
        vy = (Math.random() - 0.5) * 0.4;
      }

      const maxLife = 180 + Math.random() * 180;
      return {
        x, y, vx, vy,
        radius: 0.5 + Math.random() * 1.5,
        opacity: 0,
        life: 0,
        maxLife,
        toCore,
        coreX,
        coreY,
      };
    };

    // Seed initial particles
    for (let i = 0; i < 80; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    const draw = () => {
      // Fade in alpha
      alphaRef.current = Math.min(1, alphaRef.current + 0.01);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.2) p.opacity = lifeRatio / 0.2;
        else if (lifeRatio > 0.8) p.opacity = (1 - lifeRatio) / 0.2;
        else p.opacity = 1;

        const finalOpacity = p.opacity * 0.55 * alphaRef.current;

        // Core-directed particles get brighter near the center
        if (p.toCore) {
          const dx = p.coreX - p.x;
          const dy = p.coreY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            // Disappear near core
            p.life = p.maxLife;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${finalOpacity})`;
        ctx.fill();

        // Tiny glow
        if (p.radius > 1) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          grad.addColorStop(0, `rgba(0, 212, 255, ${finalOpacity * 0.4})`);
          grad.addColorStop(1, `rgba(0, 212, 255, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Respawn
        if (p.life >= p.maxLife) {
          particlesRef.current[i] = spawnParticle();
        }
      });

      // Add more particles as boot progresses
      const targetCount = 80 + Math.floor(bootProgress * 0.8);
      while (particlesRef.current.length < targetCount) {
        particlesRef.current.push(spawnParticle());
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
});

export default ParticleField;
