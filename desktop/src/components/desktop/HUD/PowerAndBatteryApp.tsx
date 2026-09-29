import React, { useState } from 'react';
import { Battery, Zap, Clock, ShieldCheck, Activity, ChevronRight, ChevronLeft, Power, BatteryCharging, Leaf, Settings2, Lock, MonitorOff, Moon, ArrowLeft, Globe, Code, Monitor, Terminal, Database } from 'lucide-react';

const GlassPanel = ({ children, style, onClick, hoverable = false }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className={hoverable || onClick ? "hud-clickable" : ""}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered && hoverable ? "rgba(0, 229, 255, 0.08)" : "rgba(0, 229, 255, 0.02)",
        border: "1px solid",
        borderColor: isHovered && hoverable ? "rgba(0, 229, 255, 0.4)" : "rgba(0, 229, 255, 0.15)",
        boxShadow: isHovered && hoverable ? "0 0 15px rgba(0, 229, 255, 0.1) inset" : "none",
        borderRadius: "4px",
        transition: "all 0.2s ease-in-out",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {children}
    </div>
  );
};

const Toggle = ({ label, description, active, onChange, icon: Icon }: any) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      {Icon && <div style={{ padding: "10px", background: "rgba(0, 229, 255, 0.1)", borderRadius: "4px", border: "1px solid rgba(0,229,255,0.2)" }}><Icon size={20} color="#00e5ff" /></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "350px" }}>
        <span style={{ color: "#fff", letterSpacing: "1px", fontWeight: "bold" }}>{label}</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: "1.4" }}>{description}</span>
      </div>
    </div>
    <button onClick={() => onChange(!active)} style={{ background: active ? "#00e5ff" : "transparent", border: "1px solid #00e5ff", width: "40px", height: "20px", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "2px", left: active ? "22px" : "2px", width: "14px", height: "14px", background: active ? "#000" : "#00e5ff", borderRadius: "50%", transition: "all 0.2s" }} />
    </button>
  </div>
);

const Dropdown = ({ label, value, options, onChange, icon: Icon, direction = "down" }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", letterSpacing: "1px" }}>
        {Icon && <Icon size={16} color="#00e5ff" />}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{label}</span>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <button 
          onClick={() => setOpen(!open)}
          style={{ padding: "8px 15px", background: "rgba(0, 229, 255, 0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "10px", minWidth: "220px", justifyContent: "space-between" }}
        >
          {value} <span style={{ fontSize: "0.7rem", transform: open ? (direction === 'up' ? 'rotate(180deg)' : 'rotate(180deg)') : 'none', transition: "transform 0.2s" }}>▼</span>
        </button>
        {open && (
          <div style={{ 
            position: "absolute", 
            [direction === 'up' ? 'bottom' : 'top']: "100%", 
            [direction === 'up' ? 'marginBottom' : 'marginTop']: "5px",
            right: 0,
            background: "rgba(0, 10, 20, 0.95)", 
            border: "1px solid rgba(0, 229, 255, 0.3)", 
            borderRadius: "4px", 
            zIndex: 9999, 
            minWidth: "100%",
            whiteSpace: "nowrap",
            boxShadow: "0 0 20px rgba(0,0,0,0.8)"
          }}>
            {options.map((opt: string) => (
              <div 
                key={opt} 
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{ padding: "12px 15px", color: opt === value ? "#00e5ff" : "#fff", cursor: "pointer", fontFamily: "var(--font-mono)", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.9rem" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 229, 255, 0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BatteryGraph = () => {
  return (
    <div style={{ height: "150px", width: "100%", position: "relative", marginTop: "20px" }}>
       {/* Background Grid */}
       <div style={{ position: "absolute", width: "100%", height: "100%", backgroundImage: "linear-gradient(to right, rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.05) 1px, transparent 1px)", backgroundSize: "10% 25%" }}></div>
       
       {/* Graph Line */}
       <svg style={{ position: "absolute", width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none" viewBox="0 0 100 100">
         <defs>
           <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="rgba(0,229,255,0.3)" />
             <stop offset="100%" stopColor="rgba(0,229,255,0)" />
           </linearGradient>
         </defs>
         <polygon points="0,100 0,20 10,25 20,40 30,35 40,50 50,45 60,70 70,75 80,85 90,80 100,22 100,100" fill="url(#batteryGrad)" />
         <polyline points="0,20 10,25 20,40 30,35 40,50 50,45 60,70 70,75 80,85 90,80 100,22" fill="none" stroke="#00e5ff" strokeWidth="2" style={{ filter: "drop-shadow(0 0 5px #00e5ff)" }} />
         
         {/* Current Point */}
         <circle cx="100" cy="22" r="3" fill="#fff" stroke="#00e5ff" strokeWidth="1" style={{ filter: "drop-shadow(0 0 8px #fff)" }} />
       </svg>
       
       {/* Labels */}
       <div style={{ position: "absolute", bottom: -20, left: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>24 Hours Ago</div>
       <div style={{ position: "absolute", bottom: -20, right: 0, fontSize: "0.7rem", color: "#00e5ff", fontWeight: "bold" }}>Now</div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, color = "#00e5ff" }: any) => {
  const [hover, setHover] = useState(false);
  return (
    <div 
      className="hud-clickable"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
        padding: "15px",
        background: hover ? `rgba(${color === "#00ff66" ? "0,255,102" : "0,229,255"}, 0.1)` : "rgba(0,0,0,0.4)",
        border: `1px solid ${hover ? color : "rgba(255,255,255,0.1)"}`,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
        flex: 1
      }}
    >
      <Icon size={24} color={color} style={{ filter: hover ? `drop-shadow(0 0 8px ${color})` : "none" }} />
      <span style={{ fontSize: "0.85rem", color: hover ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: "bold", letterSpacing: "1px" }}>{label}</span>
    </div>
  );
};

const BackHeader = ({ onBack, title, subtitle }: any) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid rgba(0, 229, 255, 0.3)", paddingBottom: "20px", position: "relative" }}>
      <div style={{ position: "absolute", bottom: -1, left: 0, width: "150px", height: "2px", background: "#00e5ff", boxShadow: "0 0 10px #00e5ff" }}></div>
      <div 
        onClick={onBack}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ 
          display: "flex", alignItems: "center", gap: "8px", 
          color: hover ? "#fff" : "#00e5ff", 
          textShadow: hover ? "0 0 10px #00e5ff" : "none",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontWeight: "bold",
          letterSpacing: "2px",
          transition: "all 0.2s"
        }}
      >
         <ChevronLeft size={20} style={{ transform: hover ? "translateX(-3px)" : "translateX(0)", transition: "transform 0.2s" }} />
         <span>RETURN</span>
      </div>
      <div style={{ width: "2px", height: "24px", background: "rgba(0,229,255,0.3)" }} />
      <div>
        <h2 style={{ margin: 0, color: "#00e5ff", letterSpacing: "3px", textShadow: "0 0 10px rgba(0,229,255,0.5)", textTransform: "uppercase" }}>{title}</h2>
        {subtitle && <div style={{ fontSize: "0.8rem", color: "#00e5ff", opacity: 0.8, letterSpacing: "3px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>{subtitle}</div>}
      </div>
    </div>
  );
};

const BatteryUsageSubApp = ({ onBack }: { onBack: () => void }) => {
  const [filter, setFilter] = useState("Last 24 hours");
  
  const apps = [
    { name: "Quantum Browser", icon: Globe, usage: 45, bg: 5, fg: 40, color: "#00e5ff" },
    { name: "Nova IDE Core", icon: Code, usage: 22, bg: 2, fg: 20, color: "#00ff66" },
    { name: "System HUD", icon: Monitor, usage: 15, bg: 15, fg: 0, color: "#ff00e5" },
    { name: "Telemetry Server", icon: Database, usage: 12, bg: 12, fg: 0, color: "#ffaa00" },
    { name: "Terminal Node", icon: Terminal, usage: 6, bg: 1, fg: 5, color: "#aaa" }
  ];

  return (
    <div style={{ height: "100%", width: "100%", padding: "25px", display: "flex", flexDirection: "column", gap: "25px", overflowY: "auto", backgroundColor: "#020813", backgroundImage: "linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <BackHeader onBack={onBack} title="App Usage Metrics" subtitle="PER-PROCESS POWER CONSUMPTION" />
        <div style={{ width: "200px" }}>
           <Dropdown value={filter} options={["Last 24 hours", "Last 7 days", "Since last charge"]} onChange={setFilter} direction="down" />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", paddingBottom: "50px" }}>
         {apps.map((app, idx) => (
           <GlassPanel key={idx} style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1 }}>
               <div style={{ padding: "12px", background: "rgba(0,0,0,0.4)", border: `1px solid ${app.color}55`, borderRadius: "8px" }}>
                 <app.icon size={28} color={app.color} style={{ filter: `drop-shadow(0 0 10px ${app.color})` }} />
               </div>
               <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                 <div style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "1px" }}>{app.name}</div>
                 <div style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                    <span>In use: {app.fg}%</span>
                    <span>Background: {app.bg}%</span>
                 </div>
                 
                 {/* Progress Bar */}
                 <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden", marginTop: "5px", position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${app.usage}%`, background: `linear-gradient(90deg, ${app.color}55, ${app.color})`, boxShadow: `0 0 10px ${app.color}` }}></div>
                 </div>
               </div>
             </div>
             <div style={{ marginLeft: "40px", fontFamily: "var(--font-mono)", fontSize: "2rem", color: app.color, fontWeight: "bold", textShadow: `0 0 15px ${app.color}88` }}>
               {app.usage}%
             </div>
           </GlassPanel>
         ))}
      </div>
    </div>
  );
};

const PowerAndBatteryApp = () => {
  const [showAppUsage, setShowAppUsage] = useState(false);
  const [powerMode, setPowerMode] = useState("Balanced");
  const [batterySaver, setBatterySaver] = useState(false);
  const [turnOffScreen, setTurnOffScreen] = useState("10 Minutes");
  const [sleepPC, setSleepPC] = useState("30 Minutes");
  const [fastBoot, setFastBoot] = useState(true);
  
  const [powerBtnAction, setPowerBtnAction] = useState("Sleep");
  const [lidCloseAction, setLidCloseAction] = useState("Sleep");

  if (showAppUsage) {
    return <BatteryUsageSubApp onBack={() => setShowAppUsage(false)} />;
  }

  return (
    <div style={{ height: "100%", width: "100%", padding: "25px", display: "flex", flexDirection: "column", gap: "25px", overflowY: "auto", backgroundColor: "#020813", backgroundImage: "linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0, 229, 255, 0.3)", paddingBottom: "20px", flexShrink: 0, position: "relative" }}>
        <div style={{ position: "absolute", bottom: -1, left: 0, width: "150px", height: "2px", background: "#00e5ff", boxShadow: "0 0 10px #00e5ff" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "10px", background: "rgba(0,229,255,0.1)", borderRadius: "8px", border: "1px solid rgba(0,229,255,0.3)" }}>
             <BatteryCharging size={36} color="#00e5ff" style={{ filter: "drop-shadow(0 0 8px #00e5ff)" }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.2rem", letterSpacing: "5px", color: "#fff", textShadow: "0 0 15px rgba(0,229,255,0.5)", textTransform: "uppercase" }}>
              Power & Battery
            </h1>
            <div style={{ fontSize: "0.8rem", color: "#00e5ff", opacity: 0.8, letterSpacing: "3px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              ENERGY GRID // CONSUMPTION METRICS
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", borderRadius: "4px", color: "#00e5ff", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
          <Zap size={16} fill="#00e5ff" /> CHARGING
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", flex: 1, paddingBottom: "50px" }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <GlassPanel style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "10px", position: "relative", overflow: "hidden" }}>
             
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
               <div>
                 <h2 style={{ fontSize: "4rem", margin: 0, color: "#fff", fontFamily: "var(--font-mono)", lineHeight: 1, textShadow: "0 0 20px rgba(0,229,255,0.5)" }}>78<span style={{ fontSize: "2rem", color: "#00e5ff" }}>%</span></h2>
                 <div style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "1px", marginTop: "5px" }}>Estimated time until full: 42 mins</div>
               </div>
               
               {/* Holographic Battery Icon */}
               <div style={{ position: "relative", width: "80px", height: "140px", border: "2px solid rgba(0,229,255,0.5)", borderRadius: "8px", padding: "4px" }}>
                 <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: "30px", height: "6px", background: "rgba(0,229,255,0.5)", borderRadius: "2px 2px 0 0" }}></div>
                 <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", borderRadius: "4px", position: "relative", overflow: "hidden" }}>
                   <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "78%", background: "linear-gradient(to top, #00e5ff, rgba(0,255,102,0.8))", boxShadow: "0 0 15px #00e5ff inset" }}></div>
                   
                   {/* Charging Pulse */}
                   <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, transparent, rgba(255,255,255,0.4), transparent)", animation: "chargePulse 2s infinite" }}></div>
                 </div>
                 <style>{`@keyframes chargePulse { 0% { transform: translateY(100%); } 100% { transform: translateY(-100%); } }`}</style>
               </div>
             </div>

             <BatteryGraph />

          </GlassPanel>

          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Clock size={18} color="#00e5ff" /> Screen & Sleep
            </h3>
            
            <Dropdown label="Turn off screen after" value={turnOffScreen} options={["Never", "5 Minutes", "10 Minutes", "30 Minutes", "1 Hour"]} onChange={setTurnOffScreen} direction="down" />
            <Dropdown label="Put system to sleep after" value={sleepPC} options={["Never", "15 Minutes", "30 Minutes", "1 Hour", "2 Hours"]} onChange={setSleepPC} direction="down" />
            
            <Toggle label="Fast Startup" description="Use hybrid hibernation to dramatically reduce boot times." active={fastBoot} onChange={setFastBoot} icon={Zap} />
          </GlassPanel>

        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Activity size={18} color="#00e5ff" /> Energy Modes
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
               <div style={{ color: "#fff", letterSpacing: "1px" }}>Power Mode</div>
               <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>Optimize your system based on power usage and performance.</div>
               <Dropdown value={powerMode} options={["Best Power Efficiency", "Balanced", "Best Performance", "Quantum Overdrive"]} onChange={setPowerMode} direction="down" />
            </div>

            <Toggle label="Battery Saver Protocol" description="Limit background activity, push notifications, and dim holographic projections." active={batterySaver} onChange={setBatterySaver} icon={Leaf} />
            
            {batterySaver && (
               <div style={{ padding: "15px", background: "rgba(0,255,102,0.05)", border: "1px solid rgba(0,255,102,0.3)", borderRadius: "4px", color: "#00ff66", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "10px" }}>
                 <ShieldCheck size={18} /> Battery saver is extending your estimated time by ~45 minutes.
               </div>
            )}
          </GlassPanel>

          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Power size={18} color="#00e5ff" /> Power Controls & Actions
            </h3>
            
            <div style={{ display: "flex", gap: "15px", width: "100%" }}>
              <ActionButton icon={Lock} label="LOCK" color="#00e5ff" />
              <ActionButton icon={Moon} label="SLEEP" color="#00e5ff" />
              <ActionButton icon={MonitorOff} label="HIBERNATE" color="#00e5ff" />
              <ActionButton icon={Power} label="SHUT DOWN" color="#00ff66" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
               <Dropdown label="Power Button Action" value={powerBtnAction} options={["Do Nothing", "Sleep", "Hibernate", "Shut Down"]} onChange={setPowerBtnAction} direction="up" />
               <Dropdown label="Lid Close Action" value={lidCloseAction} options={["Do Nothing", "Sleep", "Hibernate", "Shut Down"]} onChange={setLidCloseAction} direction="up" />
            </div>

          </GlassPanel>

          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Settings2 size={18} color="#00e5ff" /> Battery Usage Data
            </h3>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: "4px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#fff", fontWeight: "bold" }}>Total Charge Cycles</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Lifetime battery wear indicator</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "#00e5ff", fontSize: "1.2rem" }}>142</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: "4px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#fff", fontWeight: "bold" }}>Battery Health Status</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Current capacity vs design capacity</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "#00ff66", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "5px" }}>
                94% <span style={{ fontSize: "0.7rem", padding: "2px 5px", background: "rgba(0,255,102,0.2)", borderRadius: "2px" }}>GOOD</span>
              </div>
            </div>
            
            <button onClick={() => setShowAppUsage(true)} style={{ marginTop: "10px", padding: "10px", width: "100%", background: "transparent", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              View per-app battery usage <ChevronRight size={16} />
            </button>
          </GlassPanel>

        </div>
      </div>
    </div>
  );
};

export default PowerAndBatteryApp;
