import React, { useState } from "react";
import { 
  Monitor, Wifi, User, ShieldCheck, DownloadCloud, Lock, ToggleLeft, ToggleRight, CheckCircle2,
  Globe, Activity, Radio, ChevronRight, RadioTower, Plane, Phone, Settings2, Network
} from "lucide-react";
import GlobalCommandDashboard from "./GlobalCommandDashboard";

type SettingsTab = 'system' | 'network' | 'accounts' | 'security' | 'updates';

interface SettingsAppProps {
  onOpenSubApp?: (id: string, label: string) => void;
}

const NetDetail = ({ label, value, color = "0,255,255" }: { label: string, value: string, color?: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid rgba(${color}, 0.1)` }}>
    <span style={{ fontSize: "0.65rem", opacity: 0.6, letterSpacing: "1px" }}>{label}</span>
    <span style={{ fontSize: "0.7rem", letterSpacing: "1px", color: `rgb(${color})` }}>{value}</span>
  </div>
);

const SettingsRow = ({ icon: Icon, title, subtitle, rightElement, onClick }: any) => (
  <div className="hud-clickable" onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "6px", cursor: "pointer", marginBottom: "8px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <div style={{ color: "#00ffff", opacity: 0.7 }}><Icon size={22} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "1rem", letterSpacing: "1px", color: "#e0e0e0" }}>{title}</span>
        <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{subtitle}</span>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {rightElement}
      {!rightElement?.props?.hideArrow && <ChevronRight size={18} style={{ opacity: 0.4 }} />}
    </div>
  </div>
);

const SettingsApp: React.FC<SettingsAppProps> = ({ onOpenSubApp }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('system');
  
  // Fake states for interactivity
  const [wifiOn, setWifiOn] = useState(true);
  const [mobileHotspotOn, setMobileHotspotOn] = useState(false);
  const [airplaneModeOn, setAirplaneModeOn] = useState(false);

  const tabs = [
    { id: 'system', label: 'System Overview', icon: <Monitor size={16} /> },
    { id: 'network', label: 'Network & Uplink', icon: <Wifi size={16} /> },
    { id: 'accounts', label: 'Commander Profiles', icon: <User size={16} /> },
    { id: 'security', label: 'Security Protocols', icon: <ShieldCheck size={16} /> },
    { id: 'updates', label: 'Core Updates', icon: <DownloadCloud size={16} /> },
  ];

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", fontFamily: "var(--font-rajdhani)" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ 
        width: "240px", 
        borderRight: "1px solid rgba(0,255,255,0.2)", 
        background: "rgba(0,10,20,0.5)",
        display: "flex",
        flexDirection: "column",
        zIndex: 10
      }}>
        <div style={{ padding: "20px 16px", fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "2px", borderBottom: "1px solid rgba(0,255,255,0.1)" }}>
          SYS_CONFIG
        </div>
        <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className="hud-clickable"
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px", borderRadius: "8px",
                background: activeTab === tab.id ? "rgba(0,255,255,0.15)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(0,255,255,0.4)" : "1px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: activeTab === tab.id ? "0 0 10px rgba(0,255,255,0.1)" : "none"
              }}
            >
              {tab.icon}
              <span style={{ fontSize: "0.85rem", letterSpacing: "1px", fontWeight: activeTab === tab.id ? "bold" : "normal" }}>
                {tab.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* === SYSTEM TAB === */}
        {activeTab === 'system' && (
          <GlobalCommandDashboard onOpenSubApp={onOpenSubApp} />
        )}

        {/* === NETWORK TAB === */}
        {activeTab === 'network' && (
          <div style={{ padding: "30px", overflowY: "auto", height: "100%", display: "flex", flexDirection: "column", gap: "20px", background: "radial-gradient(circle at center, rgba(0,20,40,0.8) 0%, rgba(0,5,10,0.95) 100%)" }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Radio size={32} style={{ color: "#00ffff", filter: "drop-shadow(0 0 8px #00ffff)" }} />
                <div>
                  <div style={{ fontSize: "1.4rem", letterSpacing: "4px", fontWeight: "bold", color: "#00ffff" }}>GLOBAL UPLINK ARRAY</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>QUANTUM NETWORK INTERFACE // SECURE COMMS</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ padding: "5px 10px", background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.4)", borderRadius: "4px", fontSize: "0.6rem", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Activity size={12} color="#00ffff" /> PING: 4ms
                </div>
                <div style={{ padding: "5px 10px", background: "rgba(0,255,100,0.1)", border: "1px solid rgba(0,255,100,0.4)", borderRadius: "4px", fontSize: "0.6rem", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "5px", color: "#00ff66" }}>
                  <ShieldCheck size={12} /> SECURE
                </div>
              </div>
            </div>

            {/* MAIN DASHBOARD */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              
              {/* LEFT: ACTIVE CONNECTION */}
              <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", padding: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Globe size={16} /> ACTIVE NODE
                  </div>
                  <div className="hud-clickable" onClick={() => setWifiOn(!wifiOn)} style={{ color: wifiOn ? "#00ffff" : "rgba(255,255,255,0.2)", cursor: "pointer", filter: wifiOn ? "drop-shadow(0 0 5px #00ffff)" : "none" }}>
                    {wifiOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </div>
                </div>

                {wifiOn ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <NetDetail label="SSID" value="QUANTUM_NET_5G" />
                      <NetDetail label="STATUS" value="CONNECTED" color="0,255,100" />
                      <NetDetail label="IPv4 ADDRESS" value="192.168.99.204" />
                      <NetDetail label="IPv6 ADDRESS" value="fe80::1a2b:3c4d" />
                      <NetDetail label="GATEWAY" value="192.168.99.1" />
                      <NetDetail label="SUBNET" value="255.255.255.0" />
                      <NetDetail label="DNS 1" value="1.1.1.1 (Cloudflare)" />
                      <NetDetail label="DNS 2" value="8.8.8.8 (Google)" />
                      <NetDetail label="ENCRYPTION" value="WPA3-Personal" />
                      <NetDetail label="PROTOCOL" value="Wi-Fi 7 (802.11be)" />
                      <NetDetail label="MAC ADDRESS" value="00:1A:2B:3C:4D:5E" />
                      <NetDetail label="BAND" value="6 GHz" />
                    </div>
                    
                    <div style={{ marginTop: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", letterSpacing: "1px", marginBottom: "5px", opacity: 0.7 }}>
                        <span>BANDWIDTH ALLOCATION</span>
                        <span>8.5 Gbps</span>
                      </div>
                      <div style={{ height: "4px", background: "rgba(0,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: "85%", background: "#00ffff", boxShadow: "0 0 10px #00ffff" }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, letterSpacing: "4px" }}>
                    UPLINK DISCONNECTED
                  </div>
                )}
              </div>

              {/* RIGHT: REAL-TIME TRAFFIC & FIREWALL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", padding: "15px" }}>
                   <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                    <Activity size={16} /> TRAFFIC TELEMETRY
                  </div>
                  <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.55rem", opacity: 0.6, letterSpacing: "1px" }}>DOWNLINK (RX)</div>
                      <div style={{ fontSize: "1.4rem", color: "#00ffff", fontWeight: "bold" }}>1,204 <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>MB/s</span></div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.55rem", opacity: 0.6, letterSpacing: "1px" }}>UPLINK (TX)</div>
                      <div style={{ fontSize: "1.4rem", color: "#ff00ff", fontWeight: "bold" }}>432 <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>MB/s</span></div>
                    </div>
                  </div>
                  <div style={{ position: "relative", height: "80px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                    {/* Fake animated waveform/grid */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "10px 10px", opacity: 0.3 }} />
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0 }}>
                      <polyline points="0,80 10,60 20,75 30,40 40,55 50,20 60,45 70,10 80,30 90,5 100,25" fill="none" stroke="#00ffff" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 0 4px #00ffff)" }} />
                      <polyline points="0,90 15,85 25,95 35,70 45,80 55,60 65,75 75,50 85,65 100,45" fill="none" stroke="#ff00ff" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 0 4px #ff00ff)" }} />
                    </svg>
                  </div>
                </div>

                <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", padding: "15px", flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                    <ShieldCheck size={16} /> SECURITY & ROUTING
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <NetDetail label="FIREWALL" value="AEGIS-X ACTIVE" color="0,255,100" />
                    <NetDetail label="VPN TUNNEL" value="PROXY ROUTED" color="0,255,100" />
                    <NetDetail label="PORT SCAN" value="BLOCKED" color="0,255,100" />
                    <NetDetail label="DDoS MITIGATION" value="ENABLED" color="0,255,100" />
                    <NetDetail label="MAC SPOOFING" value="INACTIVE" color="255,255,255" />
                    <NetDetail label="ANONYMITY" value="HIGH ENTROPY" color="0,255,100" />
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM: AVAILABLE NETWORKS */}
            <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", padding: "15px" }}>
              <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <Wifi size={16} /> DISCOVERED NODES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                
                <div className="hud-clickable" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "center", padding: "12px", background: "rgba(0,255,255,0.1)", border: "1px solid #00ffff", borderRadius: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Lock size={14} color="#00ffff" />
                    <span style={{ fontWeight: "bold", letterSpacing: "1px", color: "#00ffff" }}>QUANTUM_NET_5G</span>
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>WPA3-Personal</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>Ch 44 (6GHz)</div>
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px" }}>
                    <div style={{ width: "4px", height: "4px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "8px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "11px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "14px", background: "#00ffff", boxShadow: "0 0 5px #00ffff" }}></div>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#00ffff", fontWeight: "bold" }}>CONNECTED</div>
                </div>

                <div className="hud-clickable" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "center", padding: "12px", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", background: "rgba(0,0,0,0.4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Lock size={14} style={{ opacity: 0.5 }} />
                    <span style={{ letterSpacing: "1px" }}>GUEST_NODE_BETA</span>
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>WPA2/WPA3</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>Ch 11 (2.4GHz)</div>
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px", opacity: 0.7 }}>
                    <div style={{ width: "4px", height: "4px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "8px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "11px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "14px", background: "rgba(255,255,255,0.1)" }}></div>
                  </div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>SAVED</div>
                </div>

                <div className="hud-clickable" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "center", padding: "12px", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", background: "rgba(0,0,0,0.4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Lock size={14} style={{ opacity: 0.5 }} />
                    <span style={{ letterSpacing: "1px" }}>SECURE_ORBIT_LINK</span>
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>WPA3-Enterprise</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>Ch 149 (5GHz)</div>
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px", opacity: 0.5 }}>
                    <div style={{ width: "4px", height: "4px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "8px", background: "#00ffff" }}></div>
                    <div style={{ width: "4px", height: "11px", background: "rgba(255,255,255,0.1)" }}></div>
                    <div style={{ width: "4px", height: "14px", background: "rgba(255,255,255,0.1)" }}></div>
                  </div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>CONNECT</div>
                </div>

                <div className="hud-clickable" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "center", padding: "12px", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", background: "rgba(0,0,0,0.4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ffaa00" }}>
                    <ShieldCheck size={14} />
                    <span style={{ letterSpacing: "1px" }}>OPEN_COMM_NET</span>
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>Unsecured</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>Ch 6 (2.4GHz)</div>
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px", opacity: 0.4 }}>
                    <div style={{ width: "4px", height: "4px", background: "#ffaa00" }}></div>
                    <div style={{ width: "4px", height: "8px", background: "rgba(255,255,255,0.1)" }}></div>
                    <div style={{ width: "4px", height: "11px", background: "rgba(255,255,255,0.1)" }}></div>
                    <div style={{ width: "4px", height: "14px", background: "rgba(255,255,255,0.1)" }}></div>
                  </div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>CONNECT</div>
                </div>

              </div>
            </div>

            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <Settings2 size={16} /> NETWORK CONFIGURATION
              </div>
              
              <SettingsRow 
                icon={Wifi} 
                title="Wi-Fi Array" 
                subtitle="Connect, manage known networks, metered network" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_wifi', 'WI-FI ARRAY DIAGNOSTICS')}
                rightElement={
                  <div onClick={(e) => { e.stopPropagation(); setWifiOn(!wifiOn); }} style={{ color: wifiOn ? "#00ffff" : "rgba(255,255,255,0.2)" }}>
                    {wifiOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </div>
                }
              />

              <SettingsRow 
                icon={ShieldCheck} 
                title="VPN Tunneling" 
                subtitle="Add, connect, manage secure proxy networks" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_vpn', 'VPN SECURE TUNNEL')}
              />

              <SettingsRow 
                icon={RadioTower} 
                title="Mobile Hotspot" 
                subtitle="Share your internet connection via ad-hoc relay" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_hotspot', 'AD-HOC RELAY DIAGNOSTICS')}
                rightElement={
                  <div onClick={(e) => { e.stopPropagation(); setMobileHotspotOn(!mobileHotspotOn); }} style={{ color: mobileHotspotOn ? "#00ffff" : "rgba(255,255,255,0.2)" }}>
                    {mobileHotspotOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </div>
                }
              />

              <SettingsRow 
                icon={Plane} 
                title="Airplane Mode" 
                subtitle="Stop wireless communication (Radio silence)" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_airplane', 'RADIO SILENCE PROTOCOL')}
                rightElement={
                  <div onClick={(e) => { e.stopPropagation(); setAirplaneModeOn(!airplaneModeOn); }} style={{ color: airplaneModeOn ? "#00ffff" : "rgba(255,255,255,0.2)" }}>
                    {airplaneModeOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </div>
                }
              />

              <SettingsRow 
                icon={Network} 
                title="Proxy Configuration" 
                subtitle="Proxy server for Wi-Fi and Ethernet connections" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_proxy', 'PROXY SERVER ROUTING')}
              />

              <SettingsRow 
                icon={Phone} 
                title="Dial-up / Legacy Uplink" 
                subtitle="Set up a dial-up internet connection" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_dialup', 'LEGACY UPLINK HANDSHAKE')}
              />

              <SettingsRow 
                icon={Settings2} 
                title="Advanced Network Settings" 
                subtitle="View all network adapters, network reset, firewall routing" 
                onClick={() => onOpenSubApp && onOpenSubApp('net_advanced', 'ADVANCED ADAPTER METRICS')}
              />
            </div>

          </div>
        )}

        {/* === OTHER TABS (Placeholder) === */}
        {['accounts', 'security', 'updates'].includes(activeTab) && (
          <div style={{ padding: "30px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
            <ShieldCheck size={48} style={{ marginBottom: "20px" }} />
            <h2 style={{ letterSpacing: "4px" }}>MODULE ENCRYPTED</h2>
            <p style={{ fontSize: "0.8rem" }}>Commander clearance required to access this subsystem.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsApp;
