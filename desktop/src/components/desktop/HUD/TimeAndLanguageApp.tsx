import React, { useState, useEffect } from 'react';
import { Clock, Globe, Mic, RefreshCcw, Calendar, MapPin, Check, Volume2, Activity } from 'lucide-react';

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
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "400px" }}>
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
          style={{ padding: "8px 15px", background: "rgba(0, 229, 255, 0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "10px", minWidth: "200px", justifyContent: "space-between" }}
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

const TimeAndLanguageApp = () => {
  const [autoTime, setAutoTime] = useState(true);
  const [autoTimeZone, setAutoTimeZone] = useState(false);
  const [timeZone, setTimeZone] = useState("(UTC-08:00) Pacific Time (US & Canada)");
  const [language, setLanguage] = useState("Nova Standard English (US)");
  const [region, setRegion] = useState("Earth (United States)");
  const [voiceSynthesis, setVoiceSynthesis] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "25px", display: "flex", flexDirection: "column", gap: "25px", overflowY: "auto", backgroundColor: "#020813", backgroundImage: "linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0, 229, 255, 0.3)", paddingBottom: "20px", flexShrink: 0, position: "relative" }}>
        <div style={{ position: "absolute", bottom: -1, left: 0, width: "150px", height: "2px", background: "#00e5ff", boxShadow: "0 0 10px #00e5ff" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "10px", background: "rgba(0,229,255,0.1)", borderRadius: "8px", border: "1px solid rgba(0,229,255,0.3)" }}>
             <Clock size={36} color="#00e5ff" style={{ filter: "drop-shadow(0 0 8px #00e5ff)" }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.2rem", letterSpacing: "5px", color: "#fff", textShadow: "0 0 15px rgba(0,229,255,0.5)", textTransform: "uppercase" }}>
              Time & Language
            </h1>
            <div style={{ fontSize: "0.8rem", color: "#00e5ff", opacity: 0.8, letterSpacing: "3px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              TEMPORAL SYNCHRONIZATION // LINGUISTICS
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", flex: 1, paddingBottom: "50px" }}>
        
        {/* Left Column: Date & Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <GlassPanel style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)" }}></div>
             <div style={{ fontSize: "4.5rem", fontWeight: "bold", color: "#fff", textShadow: "0 0 20px rgba(0,229,255,0.5)", fontFamily: "var(--font-mono)", lineHeight: 1 }}>
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </div>
             <div style={{ fontSize: "1.2rem", color: "#00e5ff", letterSpacing: "3px", textTransform: "uppercase" }}>
               {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
          </GlassPanel>

          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Clock size={18} color="#00e5ff" /> Date & Time Synchronization
            </h3>
            
            <Toggle label="Set time automatically" description="Synchronize system clock with Nova Orbital Time Servers." active={autoTime} onChange={setAutoTime} icon={Activity} />
            <Toggle label="Set time zone automatically" description="Use geolocation telemetry to determine current time zone." active={autoTimeZone} onChange={setAutoTimeZone} icon={MapPin} />
            
            <div style={{ opacity: autoTimeZone ? 0.5 : 1, pointerEvents: autoTimeZone ? "none" : "auto", transition: "all 0.3s" }}>
              <Dropdown 
                label="Time Zone Selection" 
                value={timeZone} 
                options={[
                  "(UTC-08:00) Pacific Time (US & Canada)", 
                  "(UTC+00:00) Greenwich Mean Time",
                  "(UTC+05:00) Islamabad, Karachi",
                  "(UTC+09:00) Orbital Station Alpha",
                  "Mars Central Time (MCT)"
                ]} 
                onChange={setTimeZone} 
                icon={Globe} 
              />
            </div>
          </GlassPanel>

          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              Additional Settings
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#fff", fontWeight: "bold", letterSpacing: "1px" }}>Sync Now</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Last successful sync: 12 minutes ago</div>
              </div>
              <button 
                onClick={handleSync}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 20px", background: "transparent", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-rajdhani)", fontWeight: "bold" }}
              >
                <RefreshCcw size={16} style={{ animation: isSyncing ? "spin 1s linear infinite" : "none" }} /> 
                {isSyncing ? "SYNCHRONIZING..." : "SYNC TIME"}
              </button>
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </GlassPanel>

        </div>

        {/* Right Column: Language & Region */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Globe size={18} color="#00e5ff" /> Language & Region
            </h3>
            
            <Dropdown 
              label="System Language" 
              value={language} 
              options={["Nova Standard English (US)", "English (United Kingdom)", "Urdu (Pakistan)", "Galactic Basic"]} 
              onChange={setLanguage} 
            />

            <Dropdown 
              label="Region Format" 
              value={region} 
              options={["Earth (United States)", "Earth (Pakistan)", "Earth (United Kingdom)", "Lunar Colony Base"]} 
              onChange={setRegion} 
            />
            
            <div style={{ marginTop: "10px" }}>
              <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginBottom: "10px" }}>Preferred Languages</div>
              <div style={{ padding: "15px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                   <span style={{ fontWeight: "bold", color: "#fff" }}>Nova Standard English (US)</span>
                   <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Base Language Pack Installed</span>
                </div>
                <div style={{ background: "rgba(0,255,102,0.1)", color: "#00ff66", padding: "4px 8px", fontSize: "0.7rem", borderRadius: "2px", border: "1px solid #00ff66" }}>DEFAULT</div>
              </div>
              <button style={{ marginTop: "10px", padding: "8px 15px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
                + Add a language
              </button>
            </div>
          </GlassPanel>

          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Mic size={18} color="#00e5ff" /> Speech Protocol
            </h3>
            
            <Toggle label="Nova Voice Synthesis" description="Allow the OS AI to communicate via generated audio protocols." active={voiceSynthesis} onChange={setVoiceSynthesis} icon={Volume2} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ color: "#fff", letterSpacing: "1px" }}>Microphone Input</div>
              <div style={{ height: "30px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "0 10px" }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", zIndex: 2 }}>Quantum Array Mic (Active)</div>
                <div style={{ position: "absolute", left: 0, height: "100%", width: "45%", background: "linear-gradient(90deg, rgba(0,229,255,0.2), rgba(0,255,102,0.4))" }}></div>
              </div>
            </div>
            
            <button style={{ alignSelf: "flex-start", padding: "8px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>
              Get Started with Voice Typing
            </button>
          </GlassPanel>

        </div>
      </div>
    </div>
  );
};

export default TimeAndLanguageApp;
