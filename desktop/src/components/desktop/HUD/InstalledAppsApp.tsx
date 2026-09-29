import React, { useState } from 'react';
import { Grid, Box, Trash2, StopCircle, RefreshCcw, ShieldAlert, Zap, Settings, Command, Cpu, HardDrive, Wifi, Activity, ChevronRight, ChevronLeft, ArrowLeft, Sliders, MonitorPlay, Link, Link2, Download, Search, FileText, Image as ImageIcon, Video, Globe, Plus, Play } from 'lucide-react';

const mockApps = [
  { id: 'app1', name: 'Neural Network Analyzer', version: 'v3.2.1', publisher: 'NovaCorp', mem: '1.2 GB', disk: '4.5 GB', icon: Activity, status: 'Running', color: '#00e5ff' },
  { id: 'app2', name: 'Security Protocol Center', version: 'v9.4.0', publisher: 'System Core', mem: '450 MB', disk: '1.1 GB', icon: ShieldAlert, status: 'Running', color: '#00e5ff' },
  { id: 'app3', name: 'Quantum Terminal', version: 'v1.0.5', publisher: 'OpenMatrix', mem: '85 MB', disk: '200 MB', icon: Command, status: 'Stopped', color: '#00e5ff' },
  { id: 'app4', name: 'Orbital Mapping System', version: 'v2.1.0', publisher: 'NovaCorp', mem: '2.4 GB', disk: '12.8 GB', icon: Wifi, status: 'Running', color: '#00e5ff' },
  { id: 'app5', name: 'Biometric Uplink Hub', version: 'v1.8.8', publisher: 'BioTech Industries', mem: '320 MB', disk: '800 MB', icon: Zap, status: 'Stopped', color: '#00e5ff' },
  { id: 'app6', name: 'Deep Space Comm Relay', version: 'v4.0.0', publisher: 'AeroSpace', mem: '1.8 GB', disk: '5.2 GB', icon: Cpu, status: 'Running', color: '#00e5ff' },
];

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
        backdropFilter: "blur(10px)",
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

const MainAppsView = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const sections = [
    { id: 'installed', title: 'Installed Apps', desc: 'Manage system modules and storage allocation', icon: Grid },
    { id: 'advanced', title: 'Advanced App Settings', desc: 'Execution aliases, archive protocols, telemetry', icon: Sliders },
    { id: 'default', title: 'Default Routing', desc: 'Protocol associations for file types and links', icon: Command },
    { id: 'actions', title: 'Execution Macros', desc: 'Trigger shortcuts and automated bindings', icon: Zap },
    { id: 'websites', title: 'Web to App Linking', desc: 'Domain interception and native routing', icon: Globe },
  ];

  return (
    <div style={{ display: "flex", gap: "25px", height: "100%", overflow: "hidden" }}>
      {/* Left Column: Categories */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto", paddingRight: "10px" }}>
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <Search size={18} color="#00e5ff" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", opacity: 0.7 }} />
          <input 
            type="text" 
            placeholder="Search application matrix..." 
            style={{ width: "100%", background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)", color: "#00e5ff", padding: "15px 15px 15px 45px", borderRadius: "4px", outline: "none", fontSize: "1rem", letterSpacing: "1px", fontFamily: "var(--font-rajdhani)" }}
          />
        </div>

        {sections.map(sec => (
          <GlassPanel key={sec.id} onClick={() => onNavigate(sec.id)} hoverable style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ padding: "12px", background: "rgba(0, 229, 255, 0.1)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: "4px" }}>
                <sec.icon size={24} color="#00e5ff" style={{ filter: "drop-shadow(0 0 5px #00e5ff)" }} />
              </div>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "2px", color: "#fff", textTransform: "uppercase" }}>{sec.title}</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(0,229,255,0.6)", marginTop: "4px", letterSpacing: "1px" }}>{sec.desc}</div>
              </div>
            </div>
            <ChevronRight size={20} color="rgba(0,229,255,0.5)" />
          </GlassPanel>
        ))}
      </div>

      {/* Right Column: Metrics */}
      <GlassPanel style={{ width: "380px", padding: "25px", display: "flex", flexDirection: "column", gap: "25px" }}>
         <h3 style={{ margin: 0, color: "#00e5ff", letterSpacing: "3px", display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase" }}>
           <HardDrive size={20} /> V-NAND ARRAY STATUS
         </h3>
         
         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
           {[
             { label: 'SYSTEM CORE', val: '45.2 GB', pct: 40, color: '#00e5ff' },
             { label: 'INSTALLED MODULES', val: '24.8 GB', pct: 25, color: '#00ff66' },
             { label: 'TEMPORARY CACHE', val: '4.1 GB', pct: 5, color: '#ffcc00' }
           ].map(stat => (
             <div key={stat.label}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "rgba(255,255,255,0.9)", fontSize: "0.8rem", letterSpacing: "1px", fontFamily: "var(--font-mono)" }}>
                 <span>{stat.label}</span>
                 <span style={{ color: stat.color }}>{stat.val}</span>
               </div>
               <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ height: "100%", width: `${stat.pct}%`, background: stat.color, boxShadow: `0 0 10px ${stat.color}` }}></div>
               </div>
             </div>
           ))}
         </div>

         <div style={{ marginTop: "auto", borderTop: "1px solid rgba(0,229,255,0.2)", paddingTop: "20px", position: "relative" }}>
           {/* Fake spinning tech circle */}
           <Activity size={80} color="#00e5ff" style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.1, animation: "spin 10s linear infinite" }} />
           
           <div style={{ fontSize: "2.5rem", color: "#fff", fontWeight: "bold", fontFamily: "var(--font-mono)", textShadow: "0 0 10px rgba(0,229,255,0.5)" }}>74.1 GB</div>
           <div style={{ fontSize: "0.85rem", color: "rgba(0,229,255,0.6)", letterSpacing: "2px", marginTop: "5px" }}>TOTAL ALLOCATED SPACE (14%)</div>
           <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px", marginTop: "15px", fontFamily: "var(--font-mono)" }}>
             DRIVE_ID: NVME-0x89F2<br/>
             ENCRYPTION: AES-256-XTS<br/>
             HEALTH: OPTIMAL
           </div>
         </div>
      </GlassPanel>
    </div>
  );
};

const InstalledAppsList = ({ onBack }: { onBack: () => void }) => {
  const [apps, setApps] = useState(mockApps);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAction = (id: string, action: string) => {
    setProcessing(`${action}-${id}`);
    setTimeout(() => {
      if (action === 'stop') {
        setApps(apps.map(a => a.id === id ? { ...a, status: 'Stopped', mem: '0 MB' } : a));
      }
      if (action === 'uninstall') {
        setApps(apps.filter(a => a.id !== id));
        if (selectedApp === id) setSelectedApp(null);
      }
      setProcessing(null);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Installed Modules" onBack={onBack} />
      
      <div style={{ display: "flex", gap: "15px", overflowY: "auto", paddingRight: "10px", flexDirection: "column" }}>
        {apps.map((app) => (
          <GlassPanel 
            key={app.id} 
            onClick={() => setSelectedApp(app.id === selectedApp ? null : app.id)}
            hoverable
            style={{ 
              borderLeft: selectedApp === app.id ? `4px solid ${app.color}` : `1px solid rgba(0, 229, 255, 0.15)`,
              padding: "20px", 
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              background: selectedApp === app.id ? "rgba(0,229,255,0.08)" : "rgba(0,229,255,0.02)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ padding: "10px", background: "rgba(0,0,0,0.5)", border: `1px solid ${app.color}`, borderRadius: "4px", boxShadow: `0 0 10px ${app.color}40` }}>
                  <app.icon size={28} color={app.color} />
                </div>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "1px", color: "#fff", textTransform: "uppercase" }}>{app.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>{app.publisher} // {app.version}</div>
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.4)", padding: "10px 15px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "0.95rem", color: app.status === 'Running' ? '#00ff66' : 'rgba(255,255,255,0.4)', fontWeight: "bold", letterSpacing: "1px" }}>{app.status}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(0,229,255,0.7)", marginTop: "4px" }}>MEM: {app.mem} | DSK: {app.disk}</div>
              </div>
            </div>

            {selectedApp === app.id && (
              <div style={{ marginTop: "10px", paddingTop: "20px", borderTop: "1px solid rgba(0, 229, 255, 0.2)", display: "flex", gap: "15px" }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAction(app.id, 'stop'); }}
                  disabled={app.status !== 'Running' || processing !== null}
                  style={{ flex: 1, padding: "12px", background: "rgba(255, 204, 0, 0.1)", border: "1px solid #ffcc00", color: "#ffcc00", cursor: app.status === 'Running' ? "pointer" : "not-allowed", opacity: app.status === 'Running' ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "0.85rem", letterSpacing: "2px", fontWeight: "bold" }}
                >
                  {processing === `stop-${app.id}` ? <RefreshCcw size={16} style={{ animation: "spin 1s linear infinite" }} /> : <StopCircle size={16} />} 
                  TERMINATE
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAction(app.id, 'uninstall'); }}
                  disabled={processing !== null}
                  style={{ flex: 1, padding: "12px", background: "rgba(255, 0, 60, 0.1)", border: "1px solid #ff003c", color: "#ff003c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "0.85rem", letterSpacing: "2px", fontWeight: "bold" }}
                >
                  {processing === `uninstall-${app.id}` ? <RefreshCcw size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={16} />} 
                  PURGE
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  style={{ flex: 1, padding: "12px", background: "rgba(0, 229, 255, 0.1)", border: "1px solid #00e5ff", color: "#00e5ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "0.85rem", letterSpacing: "2px", fontWeight: "bold" }}
                >
                  <Settings size={16} /> CONFIG
                </button>
              </div>
            )}
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};

const AdvancedSettingsView = ({ onBack }: { onBack: () => void }) => {
  const [toggles, setToggles] = useState({ archive: true, aliases: true, telemetry: false });
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Advanced App Settings" onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <GlassPanel style={{ padding: "20px" }}>
           <h3 style={{ margin: "0 0 15px 0", color: "#00e5ff", textTransform: "uppercase", letterSpacing: "1px" }}>Execution Aliases</h3>
           <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>Allow applications to declare systemic CLI aliases. If multiple apps declare the same alias, prioritize based on installation hierarchy.</p>
           
           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,229,255,0.1)", borderRadius: "4px" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Command size={24} color="#00e5ff" />
                <div>
                  <div style={{ color: "#fff", fontWeight: "bold", letterSpacing: "1px" }}>Quantum Terminal</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>alias: qt.exe</div>
                </div>
             </div>
             <button onClick={() => setToggles({...toggles, aliases: !toggles.aliases})} style={{ background: toggles.aliases ? "#00e5ff" : "transparent", border: "1px solid #00e5ff", width: "40px", height: "20px", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ position: "absolute", top: "2px", left: toggles.aliases ? "22px" : "2px", width: "14px", height: "14px", background: toggles.aliases ? "#000" : "#00e5ff", borderRadius: "50%", transition: "all 0.2s" }} />
             </button>
           </div>
        </GlassPanel>

        <GlassPanel style={{ padding: "20px" }}>
           <h3 style={{ margin: "0 0 15px 0", color: "#00e5ff", textTransform: "uppercase", letterSpacing: "1px" }}>Archive Apps Protocol</h3>
           <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>Automatically compress unused modules to save storage. User data is preserved in the neural vault.</p>
           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <span style={{ color: "#fff", letterSpacing: "1px" }}>Enable Auto-Archiving</span>
             <button onClick={() => setToggles({...toggles, archive: !toggles.archive})} style={{ background: toggles.archive ? "#00e5ff" : "transparent", border: "1px solid #00e5ff", width: "40px", height: "20px", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ position: "absolute", top: "2px", left: toggles.archive ? "22px" : "2px", width: "14px", height: "14px", background: toggles.archive ? "#000" : "#00e5ff", borderRadius: "50%", transition: "all 0.2s" }} />
             </button>
           </div>
        </GlassPanel>

      </div>
    </div>
  );
};

const DefaultAppsView = ({ onBack }: { onBack: () => void }) => {
  const associations = [
    { ext: '.txt', name: 'Text Document', app: 'Nova Editor', icon: FileText },
    { ext: '.png', name: 'Image File', app: 'HoloView', icon: ImageIcon },
    { ext: '.mp4', name: 'Video Stream', app: 'Media Core', icon: Video },
    { ext: 'http', name: 'Web Protocol', app: 'Quantum Browser', icon: Globe },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Default Routing" onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {associations.map(assoc => (
          <GlassPanel key={assoc.ext} style={{ padding: "15px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
               <div style={{ padding: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: "4px" }}>
                 <assoc.icon size={20} color="#00e5ff" />
               </div>
               <div>
                 <div style={{ fontSize: "1.1rem", color: "#fff", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>{assoc.ext}</div>
                 <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{assoc.name}</div>
               </div>
            </div>
            <div className="hud-clickable" style={{ padding: "10px 20px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", borderRadius: "4px", color: "#00e5ff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
              {assoc.app} <ChevronRight size={16} />
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};

const ExecutionActionsView = ({ onBack }: { onBack: () => void }) => {
  const actions = [
    { trigger: 'CTRL + ALT + T', action: 'Launch Quantum Terminal' },
    { trigger: 'META + SHIFT + S', action: 'Initialize Security Lockdown' },
    { trigger: 'F12', action: 'Toggle Developer HUD Overlay' },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Execution Macros" onBack={onBack} />
      
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <button className="hud-clickable" style={{ padding: "10px 20px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} /> ADD MACRO
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {actions.map((act, i) => (
          <GlassPanel key={i} style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
               <div style={{ padding: "10px 15px", background: "rgba(0,0,0,0.6)", border: "1px dashed #00e5ff", borderRadius: "4px", color: "#00e5ff", fontFamily: "var(--font-mono)", fontWeight: "bold", letterSpacing: "2px" }}>
                 {act.trigger}
               </div>
               <div style={{ color: "#fff", fontSize: "1.1rem", letterSpacing: "1px" }}>{act.action}</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ padding: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}><Play size={16} /></button>
              <button style={{ padding: "8px", background: "transparent", border: "1px solid rgba(255,0,60,0.5)", color: "#ff003c", borderRadius: "4px", cursor: "pointer" }}><Trash2 size={16} /></button>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};

const WebsitesAppsView = ({ onBack }: { onBack: () => void }) => {
  const domains = [
    { url: 'https://novacorp.local', app: 'NovaCorp Internal Portal', active: true },
    { url: 'https://matrix.net', app: 'Quantum Terminal', active: false },
    { url: 'nova://auth', app: 'Security Protocol Center', active: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SectionHeader title="Web to App Linking" onBack={onBack} />
      <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "20px", letterSpacing: "1px" }}>Configure which installed modules should intercept and handle specific domain requests.</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {domains.map((dom, i) => (
          <GlassPanel key={i} style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
               <div style={{ color: "#00e5ff", fontFamily: "var(--font-mono)", fontSize: "1.1rem" }}>{dom.url}</div>
               <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", letterSpacing: "1px" }}>Handled by: <span style={{ color: "#fff" }}>{dom.app}</span></div>
            </div>
            <button style={{ background: dom.active ? "#00e5ff" : "transparent", border: "1px solid #00e5ff", width: "40px", height: "20px", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "all 0.2s" }}>
               <div style={{ position: "absolute", top: "2px", left: dom.active ? "22px" : "2px", width: "14px", height: "14px", background: dom.active ? "#000" : "#00e5ff", borderRadius: "50%", transition: "all 0.2s" }} />
            </button>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};

const InstalledAppsApp = () => {
  const [section, setSection] = useState('main');

  return (
    <div style={{ height: "100%", width: "100%", padding: "25px", display: "flex", flexDirection: "column", gap: "25px", overflowY: "auto", backgroundColor: "#020813", backgroundImage: "linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0, 229, 255, 0.3)", paddingBottom: "20px", flexShrink: 0, position: "relative" }}>
        <div style={{ position: "absolute", bottom: -1, left: 0, width: "150px", height: "2px", background: "#00e5ff", boxShadow: "0 0 10px #00e5ff" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "10px", background: "rgba(0,229,255,0.1)", borderRadius: "8px", border: "1px solid rgba(0,229,255,0.3)" }}>
             <Box size={36} color="#00e5ff" style={{ filter: "drop-shadow(0 0 8px #00e5ff)" }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.2rem", letterSpacing: "5px", color: "#fff", textShadow: "0 0 15px rgba(0,229,255,0.5)", textTransform: "uppercase" }}>
              Application Matrix
            </h1>
            <div style={{ fontSize: "0.8rem", color: "#00e5ff", opacity: 0.8, letterSpacing: "3px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              SYS_CORE // SOFTWARE ALLOCATION
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {section === 'main' && <MainAppsView onNavigate={setSection} />}
        {section === 'installed' && <InstalledAppsList onBack={() => setSection('main')} />}
        {section === 'advanced' && <AdvancedSettingsView onBack={() => setSection('main')} />}
        {section === 'default' && <DefaultAppsView onBack={() => setSection('main')} />}
        {section === 'actions' && <ExecutionActionsView onBack={() => setSection('main')} />}
        {section === 'websites' && <WebsitesAppsView onBack={() => setSection('main')} />}
      </div>

    </div>
  );
};

export default InstalledAppsApp;
