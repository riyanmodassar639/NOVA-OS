import React, { useEffect, useRef } from "react";

const DataStream: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // The characters to stream (hex codes, symbols)
    const charset = "0123456789ABCDEF!@#$%^&*()<>{}[]/\\|~".split("");
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    
    // Array to store the y-coordinate of each drop
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    let lastTime = 0;
    let animationFrameId: number;

    const draw = (time: number) => {
      animationFrameId = requestAnimationFrame(draw);
      if (time - lastTime < 50) return;
      lastTime = time;

      // Black background with extreme opacity to create trails
      ctx.fillStyle = "rgba(0, 5, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 255, 255, 0.5)"; // Dim cyan color
      ctx.font = `${fontSize}px var(--font-mono)`;
      ctx.textAlign = "center";

      for (let i = 0; i < drops.length; i++) {
        const text = charset[Math.floor(Math.random() * charset.length)];
        
        // Draw the character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Occasionally make a character brighter
        if (Math.random() > 0.95) {
          ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
          ctx.fillText(text, x, y);
          ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
        } else {
          ctx.fillText(text, x, y);
        }

        // Randomly reset the drop to the top
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0, // Behind the hex grid and everything else
        pointerEvents: "none",
        opacity: 0.4
      }} 
    />
  );
};

export default DataStream;
