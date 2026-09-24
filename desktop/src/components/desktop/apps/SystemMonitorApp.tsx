import React, { useState, useEffect } from "react";

const SystemMonitorApp: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState<number[]>(Array(20).fill(10));
  const [memUsage, setMemUsage] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const next = [...prev.slice(1), 20 + Math.random() * 60];
        return next;
      });
      setMemUsage(40 + Math.random() * 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      height: "100%",
    }}>
      {/* CPU Monitor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "1rem",
          letterSpacing: "0.15em",
          color: "rgba(0, 212, 255, 0.9)"
        }}>
          QUANTUM CPU MATRIX
        </div>
        
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          padding: "16px",
          background: "rgba(0, 15, 35, 0.4)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          borderRadius: "4px"
        }}>
          {cpuUsage.map((val, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${val}%`,
              background: `linear-gradient(0deg, rgba(0,100,200,0.8) 0%, rgba(0,212,255,1) 100%)`,
              boxShadow: "0 0 8px rgba(0,212,255,0.4)",
              transition: "height 0.3s ease",
              borderRadius: "2px 2px 0 0"
            }} />
          ))}
        </div>
      </div>

      {/* Memory Monitor */}
      <div>
        <div style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "1rem",
          letterSpacing: "0.15em",
          color: "rgba(0, 212, 255, 0.9)",
          marginBottom: "12px"
        }}>
          NEURAL MEMORY ( {memUsage.toFixed(1)}% )
        </div>
        <div style={{
          width: "100%",
          height: "12px",
          background: "rgba(0, 212, 255, 0.1)",
          borderRadius: "6px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${memUsage}%`,
            height: "100%",
            background: "linear-gradient(90deg, rgba(0,100,200,0.8), rgba(180,255,255,1))",
            boxShadow: "0 0 10px rgba(0,212,255,0.8)",
            transition: "width 0.5s ease"
          }} />
        </div>
      </div>
    </div>
  );
};

export default SystemMonitorApp;
