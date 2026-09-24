import React, { useState, useEffect } from "react";

const NetworkUplinkApp: React.FC = () => {
  const [nodes, setNodes] = useState<{ x: number; y: number; active: boolean }[]>([]);

  useEffect(() => {
    // Generate some fake network nodes
    const initialNodes = Array.from({ length: 15 }).map(() => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      active: Math.random() > 0.5
    }));
    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        active: Math.random() > 0.6
      })));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "radial-gradient(circle at center, rgba(0,30,60,0.5) 0%, rgba(0,5,15,0.8) 100%)",
      border: "1px solid rgba(0, 212, 255, 0.1)",
      borderRadius: "4px",
      overflow: "hidden"
    }}>
      {/* Fake radar sweep */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "150%",
        height: "150%",
        background: "conic-gradient(from 0deg, transparent 70%, rgba(0, 212, 255, 0.3) 100%)",
        transformOrigin: "center center",
        transform: "translate(-50%, -50%)",
        animation: "spin-cw 4s linear infinite"
      }} />

      {/* Grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }} />

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${node.x}%`,
          top: `${node.y}%`,
          width: "6px",
          height: "6px",
          backgroundColor: node.active ? "#00ffff" : "rgba(0,212,255,0.2)",
          boxShadow: node.active ? "0 0 10px #00ffff" : "none",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          transition: "background-color 0.3s, box-shadow 0.3s"
        }} />
      ))}

      {/* Overlay Status */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "rgba(0, 212, 255, 0.7)",
        letterSpacing: "0.1em"
      }}>
        STATUS: {nodes.filter(n => n.active).length} NODES CONNECTED
      </div>
    </div>
  );
};

export default NetworkUplinkApp;
