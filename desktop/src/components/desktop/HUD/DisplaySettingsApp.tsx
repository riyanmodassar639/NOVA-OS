import React, { useState, useEffect } from 'react';
import { Monitor, Sun, Moon, Maximize, RefreshCcw, Layers, Cast, Check, MonitorSmartphone, Cpu, Activity, Settings2, Palette, Clock, ChevronLeft, Sliders, Image as ImageIcon, Zap, Maximize2 } from 'lucide-react';

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

const SectionHeader = ({ title, onBack }: { title: string, onBack: () => void }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px", borderBottom: "1px solid rgba(0,229,255,0.2)", paddingBottom: "15px", flexShrink: 0 }}>
      <div 
        className="hud-clickable" 
        onClick={onBack} 
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ 
          display: "flex", alignItems: "center", gap: "5px",
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
      <h2 style={{ margin: 0, color: "#00e5ff", letterSpacing: "3px", textShadow: "0 0 10px rgba(0,229,255,0.5)", textTransform: "uppercase" }}>{title}</h2>
    </div>
  );
};

const RangeSlider = ({ label, value, onChange, min = 0, max = 100, icon: Icon, unit = "%" }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "10px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", letterSpacing: "1px" }}>
        {Icon && <Icon size={16} color="#00e5ff" />} {label}
      </div>
      <div style={{ color: "#00e5ff", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>{value}{unit}</div>
    </div>
    <div style={{ position: "relative", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginTop: "10px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${((value - min) / (max - min)) * 100}%`, background: "#00e5ff", boxShadow: "0 0 10px #00e5ff", borderRadius: "2px" }}></div>
      <input 
        type="range" 
        min={min} max={max} value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ position: "absolute", top: -8, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: "20px" }}
      />
    </div>
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
          style={{ padding: "8px 15px", background: "rgba(0, 229, 255, 0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "10px", minWidth: "150px", justifyContent: "space-between" }}
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

const Toggle = ({ label, description, active, onChange, icon: Icon }: any) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      {Icon && <div style={{ padding: "10px", background: "rgba(0, 229, 255, 0.1)", borderRadius: "4px", border: "1px solid rgba(0,229,255,0.2)" }}><Icon size={20} color="#00e5ff" /></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "300px" }}>
        <span style={{ color: "#fff", letterSpacing: "1px", fontWeight: "bold" }}>{label}</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: "1.4" }}>{description}</span>
      </div>
    </div>
    <button onClick={() => onChange(!active)} style={{ background: active ? "#00e5ff" : "transparent", border: "1px solid #00e5ff", width: "40px", height: "20px", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "2px", left: active ? "22px" : "2px", width: "14px", height: "14px", background: active ? "#000" : "#00e5ff", borderRadius: "50%", transition: "all 0.2s" }} />
    </button>
  </div>
);


const MainDisplayView = ({ onNavigate }: { onNavigate: (sec: string) => void }) => {
  const [brightness, setBrightness] = useState(85);
  const [scale, setScale] = useState(100);
  const [resolution, setResolution] = useState("3840 x 2160 (4K)");
  const [refresh, setRefresh] = useState("144 Hz (Quantum)");
  const [nightLight, setNightLight] = useState(false);
  const [nightIntensity, setNightIntensity] = useState(40);
  const [hdr, setHdr] = useState(true);
  const [adaptiveSync, setAdaptiveSync] = useState(true);
  const [multiDisplay, setMultiDisplay] = useState("Extend desktop to this display");
  const [colorProfile, setColorProfile] = useState("DCI-P3 (Cinema)");
  const [screenTimeout, setScreenTimeout] = useState("30 Minutes");

  // Display Selection state
  const [activeScreen, setActiveScreen] = useState(1);
  const [identifying, setIdentifying] = useState(false);

  const handleIdentify = () => {
    setIdentifying(true);
    setTimeout(() => {
      setIdentifying(false);
    }, 3000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px", flex: 1, paddingBottom: "50px" }}>
      
      {/* IDENTIFY OVERLAY */}
      {identifying && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 99999, pointerEvents: "none" }}>
          <div style={{ position: "absolute", bottom: "10%", left: "5%", fontSize: "20rem", fontWeight: "bold", color: "#00ff66", fontFamily: "var(--font-rajdhani)", textShadow: "0 0 50px rgba(0,255,102,0.8)", opacity: 0.9, lineHeight: 1 }}>
            1
          </div>
          <div style={{ position: "absolute", bottom: "10%", left: "5%", transform: "translateX(25vw)", fontSize: "10rem", fontWeight: "bold", color: "#00e5ff", fontFamily: "var(--font-rajdhani)", textShadow: "0 0 50px rgba(0,229,255,0.8)", opacity: 0.5, lineHeight: 1 }}>
            2
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "25px", overflowY: "visible" }}>
        
        {/* Holographic Display Arrangement */}
        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", height: "220px", padding: "20px", width: "100%", backgroundColor: "#01050a", backgroundImage: "radial-gradient(circle at center, rgba(0, 229, 255, 0.1) 0%, transparent 60%), linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)", backgroundSize: "100% 100%, 20px 20px, 20px 20px", borderRadius: "8px", position: "relative", overflow: "hidden", border: "1px solid rgba(0,229,255,0.1)" }}>
              
              {/* Fake scanning beam */}
              <div style={{ position: "absolute", top: 0, left: "-50%", width: "200%", height: "100%", background: "linear-gradient(to right, transparent, rgba(0,229,255,0.05), transparent)", transform: "skewX(-20deg)", animation: "slide 5s infinite linear" }} />

              <style>{`@keyframes slide { 0% { left: -100%; } 100% { left: 100%; } }`}</style>

              {/* Screen 2 */}
              <div 
                onClick={() => setActiveScreen(2)}
                style={{ 
                  display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "all 0.3s",
                  transform: activeScreen === 2 ? "scale(1.05) translateY(-5px)" : "scale(0.95)",
                  opacity: activeScreen === 2 ? 1 : 0.6
                }}
              >
                <div style={{ width: "120px", height: "70px", border: activeScreen === 2 ? "2px solid #00e5ff" : "1px solid rgba(0,229,255,0.5)", background: activeScreen === 2 ? "rgba(0,229,255,0.15)" : "rgba(0,0,0,0.8)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#00e5ff", fontWeight: "bold", fontSize: "1.8rem", position: "relative", boxShadow: activeScreen === 2 ? "0 0 20px rgba(0,229,255,0.3), 0 0 10px rgba(0,229,255,0.2) inset" : "none" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.05) 2px, rgba(0,229,255,0.05) 4px)" }}></div>
                  <span style={{ zIndex: 2 }}>2</span>
                </div>
                {/* Stand */}
                <div style={{ width: "20px", height: "15px", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }}></div>
                <div style={{ width: "60px", height: "4px", background: activeScreen === 2 ? "#00e5ff" : "rgba(255,255,255,0.3)", borderRadius: "2px", boxShadow: activeScreen === 2 ? "0 0 10px #00e5ff" : "none" }}></div>
                <div style={{ marginTop: "10px", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)", textAlign: "center" }}>1920x1080<br/>60Hz Aux</div>
              </div>

              {/* Screen 1 (Primary) */}
              <div 
                onClick={() => setActiveScreen(1)}
                style={{ 
                  display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "all 0.3s",
                  transform: activeScreen === 1 ? "scale(1.05) translateY(-5px)" : "scale(0.95)",
                  opacity: activeScreen === 1 ? 1 : 0.6
                }}
              >
                <div style={{ width: "180px", height: "105px", border: activeScreen === 1 ? "2px solid #00ff66" : "1px solid rgba(0,255,102,0.5)", background: activeScreen === 1 ? "rgba(0,255,102,0.15)" : "rgba(0,0,0,0.8)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff66", fontWeight: "bold", fontSize: "2.5rem", position: "relative", boxShadow: activeScreen === 1 ? "0 0 20px rgba(0,255,102,0.3), 0 0 10px rgba(0,255,102,0.2) inset" : "none" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.05) 2px, rgba(0,255,102,0.05) 4px)" }}></div>
                  <span style={{ zIndex: 2 }}>1</span>
                  {activeScreen === 1 && <div style={{ position: "absolute", top: "-15px", right: "-15px", background: "#00ff66", color: "#000", padding: "2px 6px", fontSize: "0.6rem", borderRadius: "2px", fontWeight: "bold", letterSpacing: "1px", boxShadow: "0 0 10px #00ff66" }}>PRIMARY</div>}
                </div>
                {/* Stand */}
                <div style={{ width: "30px", height: "20px", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }}></div>
                <div style={{ width: "90px", height: "5px", background: activeScreen === 1 ? "#00ff66" : "rgba(255,255,255,0.3)", borderRadius: "2px", boxShadow: activeScreen === 1 ? "0 0 10px #00ff66" : "none" }}></div>
                <div style={{ marginTop: "10px", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)", textAlign: "center" }}>3840x2160<br/>144Hz Quantum</div>
              </div>

          </div>

          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "20px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={handleIdentify}
                className="hud-clickable" 
                style={{ padding: "8px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer", letterSpacing: "1px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Maximize2 size={14} /> Identify
              </button>
              <button className="hud-clickable" style={{ padding: "8px 20px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", letterSpacing: "1px", fontSize: "0.85rem" }}>Detect Displays</button>
            </div>
            <div style={{ flex: 1 }}>
              <Dropdown 
                value={multiDisplay} 
                options={["Duplicate these displays", "Extend desktop to this display", "Show only on 1", "Show only on 2"]} 
                onChange={setMultiDisplay} 
                direction="down"
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
          <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Sun size={18} color="#00e5ff" /> Brightness & Color (Screen {activeScreen})
          </h3>
          <RangeSlider label="System Brightness" value={brightness} onChange={setBrightness} icon={Sun} />
          <Toggle label="Night Light Protocol" description="Warmer tones to reduce neural strain during low-light operations." active={nightLight} onChange={setNightLight} icon={Moon} />
          {nightLight && (
            <div style={{ paddingLeft: "55px" }}>
              <RangeSlider label="Filter Intensity" value={nightIntensity} onChange={setNightIntensity} min={0} max={100} />
            </div>
          )}
          <Toggle label="HDR Auto-Calibration" description="Enable High Dynamic Range for compatible holographic surfaces." active={hdr} onChange={setHdr} icon={MonitorSmartphone} />
          <Dropdown label="Color Profile" value={colorProfile} options={["sRGB (Standard)", "DCI-P3 (Cinema)", "AdobeRGB (Print)", "Rec. 2020 (Holographic)", "HDR1000 (Maximum)"]} onChange={setColorProfile} icon={Palette} direction="down" />
        </GlassPanel>

        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
          <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Maximize size={18} color="#00e5ff" /> Scale & Resolution
          </h3>
          <RangeSlider label="UI Scaling Factor" value={scale} onChange={setScale} min={50} max={300} icon={Settings2} />
          <Dropdown label="Display Resolution" value={resolution} options={["1920 x 1080 (FHD)", "2560 x 1440 (2K)", "3840 x 2160 (4K)", "7680 x 4320 (8K HOLOGRAPHIC)"]} onChange={setResolution} icon={Layers} direction="down" />
        </GlassPanel>

        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
          <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={18} color="#00e5ff" /> Power & Sleep
          </h3>
          <Dropdown label="Screen Timeout" value={screenTimeout} options={["Never", "5 Minutes", "10 Minutes", "30 Minutes", "1 Hour", "4 Hours"]} onChange={setScreenTimeout} icon={Activity} direction="up" />
        </GlassPanel>

        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
          <h3 style={{ margin: 0, color: "#fff", letterSpacing: "2px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <RefreshCcw size={18} color="#00e5ff" /> Advanced Frame Delivery
          </h3>
          <Dropdown label="Refresh Rate" value={refresh} options={["60 Hz (Power Save)", "120 Hz (Standard)", "144 Hz (Quantum)", "240 Hz (Overdrive)"]} onChange={setRefresh} icon={RefreshCcw} direction="up" />
          <Toggle label="Adaptive Sync Matrix" description="Dynamically adjust refresh rate to match GPU frame output to prevent tearing." active={adaptiveSync} onChange={setAdaptiveSync} icon={Cast} />
        </GlassPanel>

      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <GlassPanel style={{ padding: "25px", border: "1px solid #00ff66", background: "rgba(0, 255, 102, 0.05)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#00ff66", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Cpu size={20} /> GRAPHICS ENGINE
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>PRIMARY GPU</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#fff" }}>NovaCore RTX-9090x</div>
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>VRAM USAGE</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5px" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#00ff66", fontFamily: "var(--font-mono)" }}>8.4 GB</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>/ 32.0 GB</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                <div style={{ width: "26%", height: "100%", background: "#00ff66", boxShadow: "0 0 10px #00ff66" }}></div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
               <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px", borderRadius: "4px", borderLeft: "2px solid #00ff66" }}>
                 <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>TEMP</div>
                 <div style={{ fontSize: "1.2rem", fontWeight: "bold", fontFamily: "var(--font-mono)", color: "#fff" }}>42°C</div>
               </div>
               <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px", borderRadius: "4px", borderLeft: "2px solid #00ff66" }}>
                 <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>LOAD</div>
                 <div style={{ fontSize: "1.2rem", fontWeight: "bold", fontFamily: "var(--font-mono)", color: "#fff" }}>18%</div>
               </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
           <h3 style={{ margin: "0 0 10px 0", color: "#00e5ff", letterSpacing: "2px", fontSize: "1rem" }}>Related Settings</h3>
           <div className="hud-clickable" onClick={() => onNavigate('advanced_display')} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", padding: "10px", borderRadius: "4px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.1)"; e.currentTarget.style.color = "#00e5ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
             Advanced display
           </div>
           <div className="hud-clickable" onClick={() => onNavigate('graphics_options')} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", padding: "10px", borderRadius: "4px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.1)"; e.currentTarget.style.color = "#00e5ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
             Graphics options
           </div>
           <div className="hud-clickable" onClick={() => onNavigate('night_light')} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", padding: "10px", borderRadius: "4px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.1)"; e.currentTarget.style.color = "#00e5ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
             Night light schedules
           </div>
           <div className="hud-clickable" onClick={() => onNavigate('hdr_calibration')} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", padding: "10px", borderRadius: "4px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.1)"; e.currentTarget.style.color = "#00e5ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
             HDR calibration
           </div>
        </GlassPanel>
      </div>

    </div>
  );
};

const AdvancedDisplayView = ({ onBack }: { onBack: () => void }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <SectionHeader title="Advanced Display" onBack={onBack} />
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <GlassPanel style={{ padding: "20px" }}>
         <h3 style={{ margin: "0 0 15px 0", color: "#00e5ff", textTransform: "uppercase", letterSpacing: "1px" }}>Display Information</h3>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Display 1: Connected to</div>
             <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}>NovaCore RTX-9090x</div>
           </div>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Desktop resolution</div>
             <div style={{ color: "#fff" }}>3840 x 2160</div>
           </div>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Active signal resolution</div>
             <div style={{ color: "#fff" }}>3840 x 2160</div>
           </div>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Refresh rate (Hz)</div>
             <div style={{ color: "#00ff66" }}>143.98 Hz</div>
           </div>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Bit depth</div>
             <div style={{ color: "#fff" }}>10-bit</div>
           </div>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Color format</div>
             <div style={{ color: "#fff" }}>RGB / 4:4:4</div>
           </div>
           <div>
             <div style={{ color: "rgba(255,255,255,0.5)" }}>Color space</div>
             <div style={{ color: "#fff" }}>High Dynamic Range (HDR)</div>
           </div>
         </div>
         <button style={{ marginTop: "25px", padding: "10px 20px", background: "transparent", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-rajdhani)", letterSpacing: "1px" }}>Display adapter properties for Display 1</button>
      </GlassPanel>
    </div>
  </div>
);

const GraphicsOptionsView = ({ onBack }: { onBack: () => void }) => {
  const [pref, setPref] = useState('let_os_decide');
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Graphics Options" onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Custom graphics performance preferences for specific applications.</p>
        
        <GlassPanel style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <MonitorSmartphone size={32} color="#00e5ff" />
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#fff" }}>Holographic Modeler v4</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>High Performance</div>
              </div>
           </div>
           <button style={{ padding: "8px 15px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer" }}>Options</button>
        </GlassPanel>

        <GlassPanel style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <Activity size={32} color="#00ff66" />
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#fff" }}>System Core Analytics</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Power Saving</div>
              </div>
           </div>
           <button style={{ padding: "8px 15px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>Options</button>
        </GlassPanel>
        
        <button style={{ alignSelf: "flex-start", padding: "10px 20px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", letterSpacing: "1px" }}>Browse Apps</button>
      </div>
    </div>
  );
};

const NightLightView = ({ onBack }: { onBack: () => void }) => {
  const [schedule, setSchedule] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Night Light Schedules" onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <Toggle label="Schedule Night Light" description="Automatically activate warmer screen colors based on location or custom times." active={schedule} onChange={setSchedule} icon={Moon} />
        
        {schedule && (
          <GlassPanel style={{ padding: "20px", marginTop: "10px" }}>
            <h4 style={{ margin: "0 0 15px 0", color: "#fff" }}>Schedule Type</h4>
            <div style={{ display: "flex", gap: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#00e5ff", cursor: "pointer" }}>
                 <input type="radio" name="schedule_type" defaultChecked /> Sunset to Sunrise
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
                 <input type="radio" name="schedule_type" /> Custom Hours
              </label>
            </div>
            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", opacity: 0.5, pointerEvents: "none" }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>Turn on</div>
                <div style={{ padding: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", color: "#fff" }}>9:00 PM</div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>Turn off</div>
                <div style={{ padding: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", color: "#fff" }}>7:00 AM</div>
              </div>
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
};

const HdrCalibrationView = ({ onBack }: { onBack: () => void }) => {
  const [maxLum, setMaxLum] = useState(80);
  const [sat, setSat] = useState(60);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="HDR Calibration" onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        
        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
           <div style={{ width: "100%", height: "200px", background: `linear-gradient(90deg, #000, #f00 ${sat}%, #fff ${maxLum + 20}%)`, borderRadius: "8px", boxShadow: "0 0 20px rgba(255,255,255,0.1) inset" }}></div>
           <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", letterSpacing: "1px" }}>Adjust sliders until the pattern is just barely visible.</div>
        </GlassPanel>
        
        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <RangeSlider label="Maximum Luminance" value={maxLum} onChange={setMaxLum} min={0} max={100} icon={Sun} unit=" Nits" />
          <RangeSlider label="Color Saturation Target" value={sat} onChange={setSat} min={0} max={100} icon={Palette} />
        </GlassPanel>
        
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
          <button style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>Reset to Default</button>
          <button style={{ padding: "10px 20px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Apply Profile</button>
        </div>
      </div>
    </div>
  );
};

const DisplaySettingsApp = () => {
  const [section, setSection] = useState('main');

  return (
    <div style={{ height: "100%", width: "100%", padding: "25px", display: "flex", flexDirection: "column", gap: "25px", overflowY: "auto", backgroundColor: "#020813", backgroundImage: "linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0, 229, 255, 0.3)", paddingBottom: "20px", flexShrink: 0, position: "relative" }}>
        <div style={{ position: "absolute", bottom: -1, left: 0, width: "150px", height: "2px", background: "#00e5ff", boxShadow: "0 0 10px #00e5ff" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "10px", background: "rgba(0,229,255,0.1)", borderRadius: "8px", border: "1px solid rgba(0,229,255,0.3)" }}>
             <Monitor size={36} color="#00e5ff" style={{ filter: "drop-shadow(0 0 8px #00e5ff)" }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.2rem", letterSpacing: "5px", color: "#fff", textShadow: "0 0 15px rgba(0,229,255,0.5)", textTransform: "uppercase" }}>
              Display Configuration
            </h1>
            <div style={{ fontSize: "0.8rem", color: "#00e5ff", opacity: 0.8, letterSpacing: "3px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              HOLOGRAPHIC OUTPUT // VISUAL METRICS
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", background: "rgba(0,255,102,0.1)", border: "1px solid #00ff66", borderRadius: "4px", color: "#00ff66", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
          <Check size={16} /> GPU NOMINAL
        </div>
      </div>

      <div style={{ flex: 1, overflow: "visible" }}>
        {section === 'main' && <MainDisplayView onNavigate={setSection} />}
        {section === 'advanced_display' && <AdvancedDisplayView onBack={() => setSection('main')} />}
        {section === 'graphics_options' && <GraphicsOptionsView onBack={() => setSection('main')} />}
        {section === 'night_light' && <NightLightView onBack={() => setSection('main')} />}
        {section === 'hdr_calibration' && <HdrCalibrationView onBack={() => setSection('main')} />}
      </div>
    </div>
  );
};

export default DisplaySettingsApp;
