import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Radio, Activity, ShieldCheck, Globe, ToggleRight, ToggleLeft, Wifi, Lock, X, Settings2, RadioTower, Plane, Network, Phone, ChevronLeft } from 'lucide-react';

const GlassPanel = ({ children, style, onClick, hoverable = false }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className={hoverable || onClick ? "hud-clickable" : ""}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered && hoverable ? "rgba(0, 229, 255, 0.08)" : "rgba(0, 229, 255, 0.03)",
        border: "1px solid",
        borderColor: isHovered && hoverable ? "rgba(0, 229, 255, 0.4)" : "rgba(0, 229, 255, 0.1)",
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

const NetDetail = ({ label, value, color = "255,255,255" }: any) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <span style={{ fontSize: "0.55rem", opacity: 0.6, letterSpacing: "1px" }}>{label}</span>
    <span style={{ fontSize: "0.85rem", color: `rgb(${color})`, fontFamily: "var(--font-mono)" }}>{value}</span>
  </div>
);

const SettingsRow = ({ icon: Icon, title, subtitle, onClick, rightElement }: any) => {
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
        transition: "all 0.2s"
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

const AdvancedNetworkView = ({ onBack, netData }: { onBack: () => void; netData?: any }) => {
  const isBridge = netData?.conn_type?.includes("Bridge") || netData?.conn_type?.includes("Virtual");
  const manufacturer = isBridge ? "VirtualBox / Hypervisor" : "OEM Network Interface";
  const description = netData?.interface ? `${netData.interface} (${netData.conn_type || 'Ethernet'})` : "Network Controller";
  const driver = "Linux Kernel In-Tree (Active)";
  const mac = netData?.mac || "N/A";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "20px" }}>
      <BackHeader onBack={onBack} title="Advanced Network Settings" subtitle="ADAPTER METRICS // FIREWALL ROUTING" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
         <GlassPanel style={{ padding: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#00e5ff", letterSpacing: "1px" }}>Hardware Properties</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <NetDetail label="Manufacturer" value={manufacturer} />
              <NetDetail label="Description" value={description} />
              <NetDetail label="Driver version" value={driver} />
              <NetDetail label="Physical Address (MAC)" value={mac} />
            </div>
            <button style={{ marginTop: "20px", padding: "8px 15px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", width: "100%" }}>View More Properties</button>
         </GlassPanel>
         <GlassPanel style={{ padding: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#00e5ff", letterSpacing: "1px" }}>Network Reset</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: "1.5" }}>
              This will remove then reinstall all your network adapters, and set other networking components back to their original settings. You might need to reinstall other networking software afterwards, such as VPN client software or virtual switches.
            </p>
            <button style={{ marginTop: "10px", padding: "8px 15px", background: "transparent", border: "1px solid #ffaa00", color: "#ffaa00", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Reset Now</button>
         </GlassPanel>
      </div>
    </div>
  );
};

const VpnTunnelView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "20px" }}>
      <BackHeader onBack={onBack} title="VPN Tunneling" subtitle="SECURE PROXY NETWORKS" />
      <GlassPanel style={{ padding: "20px" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, color: "#fff", letterSpacing: "1px" }}>VPN Connections</h3>
            <button style={{ padding: "8px 15px", background: "#00e5ff", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Add a VPN</button>
         </div>
         <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
           <div style={{ padding: "15px", border: "1px solid rgba(0,255,100,0.3)", borderRadius: "4px", background: "rgba(0,255,100,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
               <ShieldCheck size={24} color="#00ff66" />
               <div>
                 <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#fff" }}>Nova Secure Proxy</div>
                 <div style={{ fontSize: "0.8rem", color: "#00ff66" }}>Connected</div>
               </div>
             </div>
             <div style={{ display: "flex", gap: "10px" }}>
               <button style={{ padding: "6px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>Disconnect</button>
               <button style={{ padding: "6px 12px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer" }}>Advanced Options</button>
             </div>
           </div>
         </div>
      </GlassPanel>
    </div>
  );
};

const MobileHotspotView = ({ onBack }: { onBack: () => void }) => {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BackHeader onBack={onBack} title="Mobile Hotspot" subtitle="AD-HOC NETWORK RELAY" />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
        <GlassPanel style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
               <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#fff" }}>Share my internet connection</div>
               <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Allow other devices to connect to NOVA's active link.</div>
             </div>
             <div className="hud-clickable" onClick={() => setOn(!on)} style={{ color: on ? "#00ffff" : "rgba(255,255,255,0.2)", cursor: "pointer" }}>
               {on ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
             </div>
          </div>
        </GlassPanel>
        {on && (
          <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
             <h3 style={{ margin: "0 0 10px 0", color: "#00e5ff", fontSize: "0.9rem", letterSpacing: "1px" }}>Network Properties</h3>
             <div style={{ display: "flex", justifyContent: "space-between" }}>
               <span style={{ color: "rgba(255,255,255,0.5)" }}>Network name</span>
               <span style={{ color: "#fff", fontFamily: "var(--font-mono)" }}>NOVA-LINK-01</span>
             </div>
             <div style={{ display: "flex", justifyContent: "space-between" }}>
               <span style={{ color: "rgba(255,255,255,0.5)" }}>Network password</span>
               <span style={{ color: "#fff", fontFamily: "var(--font-mono)" }}>*********</span>
             </div>
             <div style={{ display: "flex", justifyContent: "space-between" }}>
               <span style={{ color: "rgba(255,255,255,0.5)" }}>Network band</span>
               <span style={{ color: "#fff", fontFamily: "var(--font-mono)" }}>5 GHz (Recommended)</span>
             </div>
             <button style={{ alignSelf: "flex-end", marginTop: "10px", padding: "8px 15px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
          </GlassPanel>
        )}
      </div>
    </div>
  );
};

const AirplaneModeView = ({ onBack }: { onBack: () => void }) => {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BackHeader onBack={onBack} title="Airplane Mode" subtitle="WIRELESS ISOLATION PROTOCOL" />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
        <GlassPanel style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
               <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#fff" }}>Airplane mode</div>
               <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Stop all wireless communication, such as Wi-Fi, cellular, and Bluetooth.</div>
             </div>
             <div className="hud-clickable" onClick={() => setOn(!on)} style={{ color: on ? "#00ffff" : "rgba(255,255,255,0.2)", cursor: "pointer" }}>
               {on ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
             </div>
          </div>
        </GlassPanel>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "10px" }}>
          You can also turn individual wireless devices on or off below.
        </div>
        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff" }}>Wi-Fi</span>
            <div style={{ color: on ? "rgba(255,255,255,0.2)" : "#00ffff" }}>
              {on ? <ToggleLeft size={28} /> : <ToggleRight size={28} />}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff" }}>Bluetooth</span>
            <div style={{ color: on ? "rgba(255,255,255,0.2)" : "#00ffff" }}>
              {on ? <ToggleLeft size={28} /> : <ToggleRight size={28} />}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

const ProxyView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BackHeader onBack={onBack} title="Proxy Configuration" subtitle="NETWORK ROUTING INTERFACE" />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ margin: 0, color: "#00e5ff", fontSize: "0.9rem" }}>Automatic proxy setup</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <span style={{ color: "rgba(255,255,255,0.8)" }}>Automatically detect settings</span>
             <ToggleRight size={28} color="#00ffff" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <span style={{ color: "rgba(255,255,255,0.8)" }}>Use setup script</span>
             <button style={{ padding: "6px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>Set up</button>
          </div>
        </GlassPanel>
        
        <GlassPanel style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ margin: 0, color: "#00e5ff", fontSize: "0.9rem" }}>Manual proxy setup</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
               <div style={{ color: "rgba(255,255,255,0.8)" }}>Use a proxy server</div>
               <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>For Wi-Fi and Ethernet connections.</div>
             </div>
             <button style={{ padding: "6px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>Set up</button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

const DialUpView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BackHeader onBack={onBack} title="Dial-up" subtitle="LEGACY UPLINK CONNECTION" />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
        <Phone size={64} style={{ color: "#00e5ff" }} />
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>No dial-up connections</div>
        <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Click below to configure a new legacy connection.</div>
        <button style={{ padding: "10px 20px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", color: "#00e5ff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>Set up a new connection</button>
      </div>
    </div>
  );
};

const NetworkSettingsApp = () => {
  const [wifiOn, setWifiOn] = useState(true);
  const [mobileHotspotOn, setMobileHotspotOn] = useState(false);
  const [airplaneModeOn, setAirplaneModeOn] = useState(false);
  const [addModal, setAddModal] = useState<string | null>(null);
  const [section, setSection] = useState('main');

  const [netData, setNetData] = useState<any>(null);
  const [wifiNetworks, setWifiNetworks] = useState<any[]>([]);
  const [netSpeed, setNetSpeed] = useState({ txSpeed: 0, rxSpeed: 0 });
  const prevBytes = useRef({ tx: 0, rx: 0, time: 0 });

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const n: any = await invoke('get_network_telemetry');
        if (!alive) return;
        setNetData(n);

        const now = Date.now();
        if (prevBytes.current.time > 0) {
          const timeDiff = (now - prevBytes.current.time) / 1000;
          if (timeDiff > 0) {
            const txDelta = Math.max(0, n.tx_bytes - prevBytes.current.tx);
            const rxDelta = Math.max(0, n.rx_bytes - prevBytes.current.rx);
            setNetSpeed({ txSpeed: txDelta / timeDiff, rxSpeed: rxDelta / timeDiff });
          }
        }
        prevBytes.current = { tx: n.tx_bytes, rx: n.rx_bytes, time: now };
      } catch (_) {}
    };

    const scanWifi = async () => {
      try {
        const w: any = await invoke('get_wifi_networks');
        if (alive && Array.isArray(w)) setWifiNetworks(w);
      } catch (_) {}
    };

    poll();
    scanWifi();
    const iv = setInterval(poll, 1000);
    const ivWifi = setInterval(scanWifi, 5000);
    return () => { alive = false; clearInterval(iv); clearInterval(ivWifi); };
  }, []);

  const formatSpeed = (bps: number) => {
    if (!bps || bps <= 0) return { val: "0.0", unit: "KB/s" };
    if (bps < 1024 * 1024) return { val: (bps / 1024).toFixed(1), unit: "KB/s" };
    return { val: (bps / (1024 * 1024)).toFixed(2), unit: "MB/s" };
  };

  const isConnected = netData?.has_info && netData?.interface !== "N/A";
  const connType = netData?.conn_type || (netData?.interface?.startsWith("wl") ? "Wi-Fi" : "Ethernet");
  const networkName = netData?.network_name || (isConnected ? (connType === "Wi-Fi" ? "Wi-Fi Network" : "Host Virtual Bridge") : "N/A");
  const signalPct = netData?.signal_strength != null ? netData.signal_strength : (isConnected ? 100 : 0);

  if (section === 'net_advanced') return <AdvancedNetworkView onBack={() => setSection('main')} netData={netData} />;
  if (section === 'net_vpn') return <VpnTunnelView onBack={() => setSection('main')} />;
  if (section === 'net_mobile_hotspot') return <MobileHotspotView onBack={() => setSection('main')} />;
  if (section === 'net_airplane_mode') return <AirplaneModeView onBack={() => setSection('main')} />;
  if (section === 'net_proxy') return <ProxyView onBack={() => setSection('main')} />;
  if (section === 'net_dialup') return <DialUpView onBack={() => setSection('main')} />;

  return (
    <div style={{ padding: "30px", overflowY: "auto", height: "100%", display: "flex", flexDirection: "column", gap: "20px", background: "radial-gradient(circle at center, rgba(0,20,40,0.8) 0%, rgba(0,5,10,0.95) 100%)", color: "#fff", fontFamily: "var(--font-rajdhani)" }}>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "15px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Radio size={32} style={{ color: "#00ffff", filter: "drop-shadow(0 0 8px #00ffff)" }} />
          <div>
            <div style={{ fontSize: "1.4rem", letterSpacing: "4px", fontWeight: "bold", color: "#00ffff" }}>GLOBAL UPLINK ARRAY</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6, letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>{netData?.interface?.toUpperCase() || "NET"} // {networkName.toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ padding: "5px 10px", background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.4)", borderRadius: "4px", fontSize: "0.6rem", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
            <Activity size={12} color="#00ffff" /> {connType.toUpperCase()}
          </div>
          <div style={{ padding: "5px 10px", background: isConnected ? "rgba(0,255,100,0.1)" : "rgba(255,100,100,0.1)", border: `1px solid ${isConnected ? "rgba(0,255,100,0.4)" : "rgba(255,100,100,0.4)"}`, borderRadius: "4px", fontSize: "0.6rem", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "5px", color: isConnected ? "#00ff66" : "#ff4444" }}>
            <ShieldCheck size={12} /> {isConnected ? "CONNECTED" : "OFFLINE"}
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", flexShrink: 0 }}>
        
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

          {wifiOn && isConnected ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <NetDetail label="SSID / NETWORK" value={networkName} />
                <NetDetail label="STATUS" value="CONNECTED" color="0,255,100" />
                <NetDetail label="IPv4 ADDRESS" value={netData?.ipv4 || "N/A"} />
                <NetDetail label="IPv6 ADDRESS" value={netData?.ipv6 || "N/A"} />
                <NetDetail label="GATEWAY" value={netData?.gateway || "N/A"} />
                <NetDetail label="SUBNET" value={netData?.ipv4 && netData.ipv4 !== "N/A" ? "255.255.255.0 (/24)" : "N/A"} />
                <NetDetail label="DNS 1" value={netData?.dns || "N/A"} />
                <NetDetail label="DNS 2" value="8.8.8.8 (Google Fallback)" />
                <NetDetail label="ENCRYPTION" value={connType === "Wi-Fi" ? "WPA2/WPA3-Personal" : "Bridged Direct Link"} />
                <NetDetail label="PROTOCOL" value={connType === "Wi-Fi" ? "Wi-Fi (802.11ax/ac/n)" : "Ethernet (802.3 Gigabit)"} />
                <NetDetail label="MAC ADDRESS" value={netData?.mac || "N/A"} />
                <NetDetail label="BAND / LINK" value={netData?.link_speed_mbps > 0 ? `${netData.link_speed_mbps} Mbps` : (connType === "Wi-Fi" ? "2.4 / 5 GHz" : "1.0 Gbps Virtual Link")} />
              </div>
              
              <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", letterSpacing: "1px", marginBottom: "5px", opacity: 0.7 }}>
                  <span>SIGNAL STRENGTH</span>
                  <span>{signalPct}%</span>
                </div>
                <div style={{ height: "4px", background: "rgba(0,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${signalPct}%`, background: "#00ffff", boxShadow: "0 0 10px #00ffff" }} />
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
                <div style={{ fontSize: "1.4rem", color: "#00ffff", fontWeight: "bold" }}>{formatSpeed(netSpeed.rxSpeed).val} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{formatSpeed(netSpeed.rxSpeed).unit}</span></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.55rem", opacity: 0.6, letterSpacing: "1px" }}>UPLINK (TX)</div>
                <div style={{ fontSize: "1.4rem", color: "#ff00ff", fontWeight: "bold" }}>{formatSpeed(netSpeed.txSpeed).val} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{formatSpeed(netSpeed.txSpeed).unit}</span></div>
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
      <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px", padding: "15px", flexShrink: 0 }}>
        <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Wifi size={16} /> DISCOVERED NODES & ACCESS POINTS</div>
          <button className="hud-clickable" onClick={() => setAddModal(addModal === 'wifi' ? null : 'wifi')} style={{ background: "rgba(0,255,255,0.1)", border: "1px solid #00ffff", color: "#00ffff", padding: "4px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "1px", boxShadow: addModal === 'wifi' ? "0 0 5px rgba(0,255,255,0.5) inset" : "none" }}>{addModal === 'wifi' ? 'CANCEL' : 'ADD NETWORK'}</button>
        </div>

        {addModal && addModal.startsWith('wifi') && (
          <div style={{ padding: "20px", background: `rgba(0,255,255, 0.03)`, border: `1px solid rgba(0,255,255, 0.3)`, borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "15px", boxShadow: `0 0 15px rgba(0,255,255, 0.1) inset` }}>
             <div style={{ position: "absolute", top: 0, left: "-100%", width: "50%", height: "2px", background: `linear-gradient(90deg, transparent, #00ffff, transparent)`, animation: "scanMini 3s linear infinite" }}></div>
             <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `#00ffff`, opacity: 0.2, boxShadow: `0 0 10px #00ffff` }}></div>
             
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "0.9rem", letterSpacing: "1px", color: `#00ffff`, textShadow: `0 0 8px rgba(0,255,255,0.5)` }}>
                  {addModal === 'wifi' ? 'SELECT UPLINK NODE' : `AUTHENTICATE: ${addModal.replace('wifi_', '')}`}
                </span>
                <X size={16} className="hud-clickable" onClick={() => setAddModal(null)} style={{ cursor: "pointer", opacity: 0.7, color: `#00ffff` }} />
             </div>
             
             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {addModal === 'wifi' ? (
                  <>
                    {wifiNetworks.length > 0 ? (
                      wifiNetworks.map((net: any, idx: number) => (
                        <div key={idx} className="hud-clickable" onClick={() => setAddModal(`wifi_${net.ssid}`)} style={{ padding: "10px", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", background: "rgba(0,0,0,0.3)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Lock size={14} color="#00ffff" /> <span>{net.ssid}</span></div>
                          <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{net.security}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "10px", opacity: 0.7, fontSize: "0.8rem" }}>No extra broadcast beacons found in range.</div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                       <span style={{ fontSize: "0.7rem", opacity: 0.8, color: `#00ffff` }}>SECURITY KEY</span>
                       <input type="password" autoFocus placeholder="Enter network security key" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(0,255,255,0.3)`, borderRadius: "2px", padding: "6px", color: "#fff", outline: "none", fontSize: "0.8rem", borderLeft: `3px solid #00ffff` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "5px" }}>
                       <button className="hud-clickable" onClick={() => setAddModal('wifi')} style={{ background: "transparent", border: `1px solid rgba(0,255,255,0.3)`, color: "#fff", borderRadius: "2px", padding: "4px 12px", cursor: "pointer", fontSize: "0.7rem" }}>BACK</button>
                       <button className="hud-clickable" onClick={() => setAddModal(null)} style={{ background: `rgba(0,255,255, 0.2)`, border: `1px solid #00ffff`, color: `#00ffff`, borderRadius: "2px", padding: "4px 12px", cursor: "pointer", fontWeight: "bold", fontSize: "0.7rem", boxShadow: `0 0 5px rgba(0,255,255, 0.4)` }}>CONNECT</button>
                    </div>
                  </>
                )}
             </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {wifiNetworks && wifiNetworks.length > 0 ? (
            wifiNetworks.map((net: any, idx: number) => {
              const isAct = net.ssid === networkName;
              return (
                <div key={idx} className="hud-clickable" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "center", padding: "12px", background: isAct ? "rgba(0,255,255,0.1)" : "rgba(0,0,0,0.4)", border: isAct ? "1px solid #00ffff" : "1px solid rgba(0,255,255,0.1)", borderRadius: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Lock size={14} color={isAct ? "#00ffff" : "rgba(255,255,255,0.6)"} />
                    <span style={{ fontWeight: isAct ? "bold" : "normal", letterSpacing: "1px", color: isAct ? "#00ffff" : "#fff" }}>{net.ssid}</span>
                  </div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{net.security || "WPA2/WPA3"}</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{net.freq_ghz} GHz</div>
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px" }}>
                    <div style={{ width: "4px", height: "4px", background: net.signal_pct >= 20 ? "#00ffff" : "rgba(255,255,255,0.2)" }}></div>
                    <div style={{ width: "4px", height: "8px", background: net.signal_pct >= 40 ? "#00ffff" : "rgba(255,255,255,0.2)" }}></div>
                    <div style={{ width: "4px", height: "11px", background: net.signal_pct >= 70 ? "#00ffff" : "rgba(255,255,255,0.2)" }}></div>
                    <div style={{ width: "4px", height: "14px", background: net.signal_pct >= 85 ? "#00ffff" : "rgba(255,255,255,0.2)", boxShadow: net.signal_pct >= 85 ? "0 0 5px #00ffff" : "none" }}></div>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: isAct ? "#00ffff" : "rgba(255,255,255,0.5)", fontWeight: isAct ? "bold" : "normal" }}>{isAct ? "CONNECTED" : `${net.signal_pct}%`}</div>
                </div>
              );
            })
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "center", padding: "12px", background: "rgba(0,255,255,0.1)", border: "1px solid #00ffff", borderRadius: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Wifi size={14} color="#00ffff" />
                <span style={{ fontWeight: "bold", letterSpacing: "1px", color: "#00ffff" }}>{networkName}</span>
              </div>
              <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{connType}</div>
              <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{netData?.interface || "enp0s3"}</div>
              <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px" }}>
                <div style={{ width: "4px", height: "4px", background: "#00ffff" }}></div>
                <div style={{ width: "4px", height: "8px", background: "#00ffff" }}></div>
                <div style={{ width: "4px", height: "11px", background: "#00ffff" }}></div>
                <div style={{ width: "4px", height: "14px", background: "#00ffff", boxShadow: "0 0 5px #00ffff" }}></div>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#00ffff", fontWeight: "bold" }}>CONNECTED</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "#00ffff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
          <Settings2 size={16} /> NETWORK CONFIGURATION
        </div>
        
        <SettingsRow 
          icon={Wifi} 
          title="Wi-Fi Array" 
          subtitle="Connect, manage known networks, metered network" 
          onClick={() => {}}
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
          onClick={() => setSection('net_vpn')}
        />

        <SettingsRow 
          icon={RadioTower} 
          title="Mobile Hotspot" 
          subtitle="Share your internet connection via ad-hoc relay" 
          onClick={() => setSection('net_mobile_hotspot')}
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
          onClick={() => setSection('net_airplane_mode')}
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
          onClick={() => setSection('net_proxy')}
        />

        <SettingsRow 
          icon={Phone} 
          title="Dial-up / Legacy Uplink" 
          subtitle="Set up a dial-up internet connection" 
          onClick={() => setSection('net_dialup')}
        />

        <SettingsRow 
          icon={Settings2} 
          title="Advanced Network Settings" 
          subtitle="View all network adapters, network reset, firewall routing" 
          onClick={() => setSection('net_advanced')}
        />
      </div>
      
    </div>
  );
};

export default NetworkSettingsApp;
