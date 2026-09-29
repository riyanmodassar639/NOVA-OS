import React, { useState, useEffect } from "react";
import { DownloadCloud, RefreshCw, Server, ShieldCheck, Terminal, Cpu, Database, AlertCircle } from "lucide-react";

const CoreUpdatesApp = () => {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [installed, setInstalled] = useState(false);

  const currentVersion = "NOVA OS v0.1.0-alpha";
  const newVersion = "NOVA OS v0.2.0-beta (Neural Mesh)";

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `[${new Date().toISOString().split('T')[1].substring(0, 8)}] ${msg}`]);
  };

  const checkUpdates = () => {
    setChecking(true);
    addLog("Initiating ping to central command servers...");
    setTimeout(() => {
      addLog("Handshake successful. Verifying local manifest...");
    }, 1000);
    setTimeout(() => {
      addLog("Comparing signatures. Update package identified.");
      setChecking(false);
      setUpdateAvailable(true);
    }, 2500);
  };

  const startUpdate = () => {
    setDownloading(true);
    setProgress(0);
    addLog("Requesting payload from encrypted orbit-node...");
  };

  useEffect(() => {
    if (downloading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(p => {
          const np = p + Math.floor(Math.random() * 8) + 1;
          if (np >= 20 && p < 20) addLog("Decrypting core matrix headers...");
          if (np >= 45 && p < 45) addLog("Compiling quantum binaries...");
          if (np >= 70 && p < 70) addLog("Hot-swapping kernel modules...");
          if (np >= 90 && p < 90) addLog("Finalizing neural pathways...");
          return np > 100 ? 100 : np;
        });
      }, 300);
      return () => clearTimeout(timer);
    } else if (downloading && progress === 100) {
      setDownloading(false);
      setInstalled(true);
      addLog("UPDATE SUCCESSFUL. System restart recommended.");
    }
  }, [downloading, progress]);

  return (
    <div style={{ height: "100%", width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", background: "radial-gradient(circle at center, rgba(10,20,30,0.9) 0%, rgba(0,5,10,0.95) 100%)", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0, 200, 255, 0.3)", paddingBottom: "15px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <DownloadCloud size={40} color="#00c8ff" style={{ filter: "drop-shadow(0 0 10px #00c8ff)", animation: checking ? "pulse 1s infinite" : "none" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: "5px", color: "#00c8ff", textShadow: "0 0 15px #00c8ff", textTransform: "uppercase" }}>
              Core Updates
            </h1>
            <div style={{ fontSize: "0.75rem", color: "#00c8ff", opacity: 0.7, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
              SYSTEM ARCHITECTURE UPGRADES // FIRMWARE MAINTENANCE
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flex: 1, overflow: "hidden" }}>
        
        {/* LEFT COLUMN: STATUS & CONTROLS */}
        <div style={{ width: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Current Status Box */}
          <div style={{ background: "rgba(0, 200, 255, 0.05)", border: "1px solid rgba(0, 200, 255, 0.2)", borderRadius: "8px", padding: "20px", position: "relative" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0, 200, 255, 0.2)", paddingBottom: "10px", marginBottom: "15px" }}>
               <span style={{ color: "#00c8ff", letterSpacing: "2px", fontWeight: "bold" }}>SYSTEM STATUS</span>
               {installed ? <ShieldCheck size={18} color="#00ff66" /> : <AlertCircle size={18} color="#ffcc00" />}
             </div>
             
             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
               <div>
                 <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>CURRENT KERNEL</div>
                 <div style={{ fontSize: "1.2rem", color: installed ? "#00ff66" : "#fff", fontWeight: "bold" }}>{installed ? newVersion : currentVersion}</div>
               </div>
               <div>
                 <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>LAST CHECKED</div>
                 <div style={{ fontSize: "1rem", color: "#fff" }}>{new Date().toLocaleTimeString()}</div>
               </div>
             </div>

             {!updateAvailable && !installed && (
               <button 
                 onClick={checkUpdates}
                 disabled={checking}
                 style={{ width: "100%", marginTop: "20px", padding: "12px", background: "rgba(0, 200, 255, 0.1)", border: "1px solid #00c8ff", color: "#00c8ff", fontWeight: "bold", letterSpacing: "2px", cursor: checking ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s" }}
               >
                 <RefreshCw size={16} style={{ animation: checking ? "spin 2s linear infinite" : "none" }} />
                 {checking ? "SCANNING ORBITAL SERVERS..." : "CHECK FOR UPDATES"}
               </button>
             )}

             {updateAvailable && !installed && (
               <div style={{ marginTop: "20px", padding: "15px", background: "rgba(255, 204, 0, 0.1)", border: "1px dashed #ffcc00", borderRadius: "4px" }}>
                 <div style={{ color: "#ffcc00", fontWeight: "bold", letterSpacing: "1px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                   <DownloadCloud size={16} /> NEW UPDATE AVAILABLE
                 </div>
                 <div style={{ fontSize: "0.85rem", marginBottom: "5px" }}>{newVersion}</div>
                 <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: "15px" }}>Size: 2.4 TB | Reboot required</div>
                 
                 {!downloading ? (
                   <button 
                     onClick={startUpdate}
                     style={{ width: "100%", padding: "12px", background: "rgba(255, 204, 0, 0.2)", border: "1px solid #ffcc00", color: "#ffcc00", fontWeight: "bold", letterSpacing: "2px", cursor: "pointer", transition: "all 0.3s", textShadow: "0 0 10px #ffcc00" }}
                   >
                     INITIATE OVERRIDE PROTOCOL
                   </button>
                 ) : (
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", color: "#ffcc00", fontSize: "0.8rem", letterSpacing: "1px" }}>
                       <span>DOWNLOADING & PATCHING</span>
                       <span>{progress}%</span>
                     </div>
                     <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                       <div style={{ height: "100%", width: `${progress}%`, background: "#ffcc00", boxShadow: "0 0 10px #ffcc00", transition: "width 0.3s linear" }}></div>
                     </div>
                   </div>
                 )}
               </div>
             )}

             {installed && (
               <div style={{ marginTop: "20px", padding: "15px", background: "rgba(0, 255, 102, 0.1)", border: "1px solid #00ff66", borderRadius: "4px", color: "#00ff66", textAlign: "center", letterSpacing: "1px" }}>
                 SYSTEM IS UP TO DATE
               </div>
             )}
          </div>

          {/* Terminal / Logs */}
          <div style={{ flex: 1, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0, 200, 255, 0.2)", borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ background: "rgba(0, 200, 255, 0.1)", padding: "10px", fontSize: "0.7rem", color: "#00c8ff", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(0, 200, 255, 0.2)" }}>
              <Terminal size={14} /> UPDATE FEED
            </div>
            <div style={{ padding: "15px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(0, 200, 255, 0.8)", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
              {logs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
              <div style={{ display: "flex", gap: "8px" }}>
                <span>{'>'}</span>
                <span style={{ width: "8px", height: "14px", background: "#00c8ff", animation: "blink 1s infinite" }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHANGELOG / SPECS */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ border: "1px solid rgba(0, 200, 255, 0.2)", background: "linear-gradient(135deg, rgba(0, 200, 255, 0.05) 0%, transparent 100%)", padding: "25px", borderRadius: "8px" }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#00c8ff", letterSpacing: "3px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Server size={24} /> {newVersion} PATCH NOTES
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderLeft: "3px solid #00c8ff" }}>
                <div style={{ color: "#00c8ff", fontWeight: "bold", letterSpacing: "1px", marginBottom: "5px" }}>[ENHANCEMENT] QUANTUM KERNEL SCHEDULER</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                  Upgraded context-switching algorithms to leverage entangled multi-core processing. Anticipate a 34% increase in synthetic benchmarks and zero-latency thread migrations.
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderLeft: "3px solid #ff00ff" }}>
                <div style={{ color: "#ff00ff", fontWeight: "bold", letterSpacing: "1px", marginBottom: "5px" }}>[NEW] HOLOGRAPHIC RENDERING PIPELINE</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                  Introduces direct-to-retina memory buffers. Removes the need for physical displays. Connect your bio-port to enable full 3D spacial computing mode.
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderLeft: "3px solid #ffcc00" }}>
                <div style={{ color: "#ffcc00", fontWeight: "bold", letterSpacing: "1px", marginBottom: "5px" }}>[SECURITY] AEGIS FIREWALL V2</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                  Added real-time zero-day mitigation using local neural heuristics. Outbound telemetry is now fully cloaked.
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderLeft: "3px solid #00ff66" }}>
                <div style={{ color: "#00ff66", fontWeight: "bold", letterSpacing: "1px", marginBottom: "5px" }}>[BUG FIX] NEURAL DRIFT</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                  Resolved an issue where users experienced time dilation during deep-sleep modes while connected to the grid.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div style={{ border: "1px dashed rgba(0, 200, 255, 0.3)", padding: "20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "15px" }}>
               <Database size={30} color="#00c8ff" />
               <div>
                 <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>DISK SPACE REQUIRED</div>
                 <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#00c8ff" }}>2.4 TB</div>
               </div>
             </div>
             
             <div style={{ border: "1px dashed rgba(0, 200, 255, 0.3)", padding: "20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "15px" }}>
               <Cpu size={30} color="#00c8ff" />
               <div>
                 <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>CPU OPTIMIZATION</div>
                 <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#00c8ff" }}>ARM + RISC-V</div>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CoreUpdatesApp;
