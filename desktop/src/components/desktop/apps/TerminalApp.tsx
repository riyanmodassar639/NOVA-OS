import React, { useState, useEffect, useRef } from "react";

const TerminalApp: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fake booting sequence
    const sequences = [
      "NOVA_OS CORE VER 0.1.0_ALPHA",
      "INITIALIZING NEURAL NET...",
      "[OK] NEURAL NET ACTIVE",
      "ESTABLISHING SECURE UPLINK...",
      "BYPASSING QUANTUM FIREWALL...",
      "[WARN] PACKET LOSS DETECTED: 0.04%",
      "SYSTEM FULLY OPERATIONAL. AWAITING INPUT."
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < sequences.length) {
        setLogs(prev => [...prev, sequences[step]]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "rgba(0, 5, 10, 0.8)",
      padding: "16px",
      borderRadius: "4px",
      border: "1px solid rgba(0, 212, 255, 0.1)"
    }}>
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          fontFamily: "var(--font-mono)",
          color: "rgba(0, 212, 255, 0.8)",
          fontSize: "0.85rem",
          lineHeight: 1.6,
          textShadow: "0 0 5px rgba(0, 212, 255, 0.5)"
        }}
      >
        {logs.map((log, i) => (
          <div key={i}>{">"} {log}</div>
        ))}
        {logs.length === 7 && (
          <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
            <span>{">"} </span>
            <span style={{ 
              width: "8px", 
              height: "14px", 
              background: "rgba(0, 212, 255, 0.8)",
              marginLeft: "6px",
              animation: "dot-blink 1s infinite"
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalApp;
