import React, { useState, useEffect } from 'react';
import { Bluetooth, X, Monitor, Settings2, Headphones, ChevronDown, Printer, Smartphone, Camera, Mouse, Keyboard, ToggleRight } from 'lucide-react';

const MiniGraph = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: "40px", gap: "2px", borderBottom: `1px solid rgba(${color}, 0.2)` }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, height: `${(val / max) * 100}%`, background: `rgba(${color}, 0.8)`, borderRadius: "2px 2px 0 0", minHeight: "2px" }} />
      ))}
    </div>
  );
};

const SettingsRow = ({ icon: Icon, title, subtitle, hideArrow, onClick, rightElement }: any) => {
  const [hover, setHover] = useState(false);
  return (
    <div 
      className={onClick ? "hud-clickable" : ""}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "15px", 
        background: hover && onClick ? "rgba(0, 229, 255, 0.1)" : "rgba(0,0,0,0.3)", 
        border: "1px solid",
        borderColor: hover && onClick ? "rgba(0, 229, 255, 0.3)" : "rgba(255,255,255,0.05)",
        borderRadius: "4px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        marginBottom: "8px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {Icon && <Icon size={24} style={{ color: hover && onClick ? "#00e5ff" : "rgba(255,255,255,0.7)", transition: "all 0.2s" }} />}
        <div>
          <div style={{ fontSize: "1rem", fontWeight: "bold", color: hover && onClick ? "#fff" : "rgba(255,255,255,0.9)", transition: "all 0.2s" }}>{title}</div>
          {subtitle && <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{subtitle}</div>}
        </div>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

const BluetoothSettingsApp = () => {
  const [addModal, setAddModal] = useState<string | null>(null);
  const [expandDevice, setExpandDevice] = useState(false);
  const [expandOther, setExpandOther] = useState(false);
  const [expandPrinters, setExpandPrinters] = useState(false);
  const [expandPhone, setExpandPhone] = useState(false);
  const [expandCameras, setExpandCameras] = useState(false);
  const [expandMouse, setExpandMouse] = useState(false);
  const [expandKeyboard, setExpandKeyboard] = useState(false);
  const [expandAudio, setExpandAudio] = useState(false);
  
  const [tick, setTick] = useState(0);
  const [graphs, setGraphs] = useState({ bt: Array(20).fill(10) });

  useEffect(() => {
    const int = setInterval(() => {
      setTick(t => t + 1);
      setGraphs(prev => ({
        bt: [...prev.bt.slice(1), 10 + Math.random() * 40]
      }));
    }, 1000);
    return () => clearInterval(int);
  }, []);

  const fmtUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: "30px", overflowY: "auto", height: "100%", display: "flex", flexDirection: "column", gap: "20px", background: "radial-gradient(circle at center, rgba(0,40,60,0.8) 0%, rgba(0,10,20,0.95) 100%)", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "15px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Bluetooth size={32} style={{ color: "#00ffff", filter: "drop-shadow(0 0 8px #00ffff)" }} />
          <div>
            <div style={{ fontSize: "1.4rem", letterSpacing: "4px", fontWeight: "bold", color: "#00ffff" }}>BLUETOOTH & DEVICES</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>PERIPHERAL INTERFACE // HARDWARE COMMS</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px", background: "rgba(0,0,0,0.4)", border: "1px dashed rgba(0,255,255,0.3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
           <div style={{ position: "absolute", top: 0, left: "-100%", width: "50%", height: "2px", background: "linear-gradient(90deg, transparent, #00ffff, transparent)", animation: "scanMini 3s linear infinite" }} />
           <div>
              <div style={{ fontSize: "1.1rem", color: "#e0e0e0", letterSpacing: "1px", fontWeight: "bold" }}>Add a device</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "4px" }}>Connect a Bluetooth mouse, keyboard, or other devices</div>
           </div>
           <button className="hud-clickable" onClick={() => setAddModal(addModal === 'bluetooth' ? null : 'bluetooth')} style={{ background: "rgba(0,255,255,0.1)", border: "1px solid #00ffff", color: "#00ffff", padding: "8px 24px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", letterSpacing: "1px", boxShadow: "0 0 10px rgba(0,255,255,0.2) inset" }}>
             {addModal === 'bluetooth' ? 'CANCEL' : 'ADD DEVICE'}
           </button>
        </div>

        {addModal === 'bluetooth' && (
          <div style={{ padding: "20px", background: "rgba(0,255,255, 0.03)", border: "1px solid rgba(0,255,255, 0.3)", borderRadius: "4px", position: "relative", overflow: "hidden", marginTop: "8px", marginBottom: "10px", boxShadow: "0 0 15px rgba(0,255,255, 0.1) inset" }}>
             <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #00ffff, transparent)", opacity: 0.5 }}></div>
             <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "#00ffff", opacity: 0.2, boxShadow: "0 0 10px #00ffff" }}></div>
             
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "1rem", letterSpacing: "2px", color: "#00ffff", textShadow: "0 0 8px rgba(0,255,255,0.5)" }}>INITIALIZE PAIRING SEQUENCE</span>
                <X size={18} className="hud-clickable" onClick={() => setAddModal(null)} style={{ cursor: "pointer", opacity: 0.7, color: "#00ffff" }} />
             </div>
             
             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="hud-clickable" style={{ padding: "16px", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", background: "linear-gradient(90deg, rgba(0,255,255,0.05), transparent)", cursor: "pointer", display: "flex", gap: "15px", alignItems: "center", position: "relative", overflow: "hidden" }}>
                   <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "#00ffff", boxShadow: "0 0 8px #00ffff" }}></div>
                   <Bluetooth size={24} style={{ color: "#00ffff", filter: "drop-shadow(0 0 4px #00ffff)" }} />
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.95rem", color: "#fff", letterSpacing: "1px" }}>Bluetooth Protocol</span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>Mice, keyboards, pens, audio devices</span>
                   </div>
                </div>
                
                <div className="hud-clickable" style={{ padding: "16px", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", background: "linear-gradient(90deg, rgba(0,255,255,0.05), transparent)", cursor: "pointer", display: "flex", gap: "15px", alignItems: "center", position: "relative", overflow: "hidden" }}>
                   <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "rgba(0,255,255,0.5)" }}></div>
                   <Monitor size={24} style={{ color: "#00ffff", opacity: 0.8 }} />
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.95rem", color: "#fff", letterSpacing: "1px" }}>Wireless Display / Dock</span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>Miracast monitors, TVs, wireless docks</span>
                   </div>
                </div>

                <div className="hud-clickable" style={{ padding: "16px", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", background: "linear-gradient(90deg, rgba(0,255,255,0.05), transparent)", cursor: "pointer", display: "flex", gap: "15px", alignItems: "center", position: "relative", overflow: "hidden" }}>
                   <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "rgba(0,255,255,0.5)" }}></div>
                   <Settings2 size={24} style={{ color: "#00ffff", opacity: 0.8 }} />
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.95rem", color: "#fff", letterSpacing: "1px" }}>Auxiliary Systems</span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>Xbox controllers, DLNA nodes, legacy hardware</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <SettingsRow 
          icon={Bluetooth} 
          title="Bluetooth" 
          subtitle="Discoverable as 'NOVA-COMMAND-CENTRE'" 
          hideArrow={true}
          rightElement={
            <div onClick={(e) => { e.stopPropagation(); }} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#00ffff", cursor: "pointer" }}>
              <span style={{ fontSize: "0.8rem", color: "#fff" }}>On</span>
              <ToggleRight size={24} />
            </div>
          }
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Headphones} 
            title="NOVA Quantum Headset" 
            subtitle="Connected audio device" 
            hideArrow={true}
            onClick={() => setExpandDevice(!expandDevice)}
            rightElement={<div style={{ transform: expandDevice ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandDevice && (
            <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                 <span style={{ fontSize: "0.9rem", color: "#00ffff" }}>Device Properties</span>
                 <button className="hud-clickable" style={{ background: "rgba(0,255,255, 0.1)", border: "1px solid rgba(0,255,255, 0.4)", color: "#00ffff", borderRadius: "4px", padding: "2px 10px", fontSize: "0.7rem", cursor: "pointer" }}>Disconnect</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", fontSize: "0.8rem", color: "#fff" }}>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                   <span style={{ opacity: 0.6, fontSize: "0.7rem", letterSpacing: "1px" }}>CONNECTION TIMETABLE</span>
                   <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.8 }}>Connected On:</span> <span>{new Date().toLocaleDateString()}</span></div>
                   <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.8 }}>Connected At:</span> <span>{new Date(Date.now() - (tick + 1450) * 1000).toLocaleTimeString()}</span></div>
                   <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.8 }}>Duration:</span> <span style={{ color: "#00ffff" }}>{fmtUptime(tick + 1450)}</span></div>
                   <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ opacity: 0.8 }}>Battery Level:</span> <span style={{ color: "#00ffff" }}>78%</span></div>
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                   <span style={{ opacity: 0.6, fontSize: "0.7rem", letterSpacing: "1px" }}>DATA TRANSMISSION (KB/s)</span>
                   <MiniGraph data={graphs.bt} color="0,255,255" />
                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginTop: "4px" }}>
                      <span style={{ opacity: 0.8 }}>Protocol: aptX HD</span>
                      <span style={{ opacity: 0.8 }}>Latency: 12ms</span>
                   </div>
                 </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Monitor} 
            title="Other devices" 
            subtitle="1 connected peripheral" 
            hideArrow={true}
            onClick={() => setExpandOther(!expandOther)}
            rightElement={<div style={{ transform: expandOther ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandOther && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>No other devices currently connected.</span>
             </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Printer} 
            title="Printers & scanners" 
            subtitle="No devices found" 
            hideArrow={true}
            onClick={() => setExpandPrinters(!expandPrinters)}
            rightElement={<div style={{ transform: expandPrinters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandPrinters && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>No printers or scanners detected. Add a printer to begin.</span>
             </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Smartphone} 
            title="Phone Link" 
            subtitle="Instantly access your mobile device" 
            hideArrow={true}
            onClick={() => setExpandPhone(!expandPhone)}
            rightElement={<div style={{ transform: expandPhone ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandPhone && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Link your Android or iPhone to sync messages, calls, and photos.</span>
             </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Camera} 
            title="Cameras" 
            subtitle="Connected: Quantum Cam X1" 
            hideArrow={true}
            onClick={() => setExpandCameras(!expandCameras)}
            rightElement={<div style={{ transform: expandCameras ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandCameras && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                   <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Quantum Cam X1</span>
                   <span style={{ fontSize: "0.8rem", color: "#00ffff" }}>Connected</span>
                </div>
             </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Mouse} 
            title="Mouse" 
            subtitle="Precision pointing devices" 
            hideArrow={true}
            onClick={() => setExpandMouse(!expandMouse)}
            rightElement={<div style={{ transform: expandMouse ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandMouse && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Mouse pointer speed, scrolling behavior, and primary button configuration.</span>
             </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Keyboard} 
            title="Typing" 
            subtitle="Touch keyboard, text suggestions" 
            hideArrow={true}
            onClick={() => setExpandKeyboard(!expandKeyboard)}
            rightElement={<div style={{ transform: expandKeyboard ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandKeyboard && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Typing insights, autocorrect, and multilingual text suggestions.</span>
             </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SettingsRow 
            icon={Headphones} 
            title="Audio" 
            subtitle="Headphones and speakers" 
            hideArrow={true}
            onClick={() => setExpandAudio(!expandAudio)}
            rightElement={<div style={{ transform: expandAudio ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown size={18} style={{ opacity: 0.4 }} /></div>}
          />
          {expandAudio && (
             <div style={{ padding: "16px", background: "rgba(0,255,255, 0.05)", border: "1px solid rgba(0,255,255, 0.2)", borderRadius: "4px", marginBottom: "8px", marginTop: "-4px" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Manage default playback and recording devices, spatial sound.</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BluetoothSettingsApp;
