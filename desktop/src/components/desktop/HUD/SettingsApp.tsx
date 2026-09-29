import React, { useState } from "react";
import { 
  Monitor, Wifi, User, ShieldCheck, DownloadCloud,
  Globe, Bluetooth, Grid, Zap
} from "lucide-react";
import GlobalCommandDashboard from "./GlobalCommandDashboard";
import SecurityProtocolApp from "./SecurityProtocolApp";
import CoreUpdatesApp from "./CoreUpdatesApp";
import InstalledAppsApp from "./InstalledAppsApp";
import DisplaySettingsApp from "./DisplaySettingsApp";
import TimeAndLanguageApp from "./TimeAndLanguageApp";
import PowerAndBatteryApp from "./PowerAndBatteryApp";
import NetworkSettingsApp from "./NetworkSettingsApp";
import BluetoothSettingsApp from "./BluetoothSettingsApp";
import CommanderProfilesApp from "./CommanderProfilesApp";

type SettingsTab = 'system' | 'power' | 'display' | 'bluetooth' | 'network' | 'accounts' | 'security' | 'updates' | 'apps' | 'time';

interface SettingsAppProps {
  onOpenSubApp?: (id: string, label: string) => void;
}

const SettingsApp: React.FC<SettingsAppProps> = ({ onOpenSubApp }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('system');

  const tabs = [
    { id: 'system', label: 'System Overview', icon: <Monitor size={16} /> },
    { id: 'power', label: 'Power & Battery', icon: <Zap size={16} /> },
    { id: 'display', label: 'Display Settings', icon: <Monitor size={16} /> },
    { id: 'bluetooth', label: 'Bluetooth & devices', icon: <Bluetooth size={16} /> },
    { id: 'network', label: 'Network & Uplink', icon: <Wifi size={16} /> },
    { id: 'accounts', label: 'Commander Profiles', icon: <User size={16} /> },
    { id: 'time', label: 'Time & language', icon: <Globe size={16} /> },
    { id: 'security', label: 'Security Protocols', icon: <ShieldCheck size={16} /> },
    { id: 'updates', label: 'Core Updates', icon: <DownloadCloud size={16} /> },
    { id: 'apps', label: 'Installed Modules', icon: <Grid size={16} /> },
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
        <div 
          style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto", overflowX: "hidden" }}
          className="custom-scrollbar"
        >
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 255, 0.5); }
          `}</style>
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

        {/* === POWER & BATTERY TAB === */}
        {activeTab === 'power' && (
          <PowerAndBatteryApp />
        )}

        {/* === DISPLAY TAB === */}
        {activeTab === 'display' && (
          <DisplaySettingsApp />
        )}

        {/* === SECURITY PROTOCOLS TAB === */}
        {activeTab === 'security' && (
          <SecurityProtocolApp />
        )}

        {/* === TIME & LANGUAGE TAB === */}
        {activeTab === 'time' && (
          <TimeAndLanguageApp />
        )}

        {/* === CORE UPDATES TAB === */}
        {activeTab === 'updates' && (
          <CoreUpdatesApp />
        )}

        {/* === APPS TAB === */}
        {activeTab === 'apps' && (
          <InstalledAppsApp />
        )}

        {/* === BLUETOOTH TAB === */}
        {activeTab === 'bluetooth' && (
          <BluetoothSettingsApp />
        )}

        {/* === NETWORK TAB === */}
        {activeTab === 'network' && (
          <NetworkSettingsApp />
        )}

        {/* === COMMANDER PROFILES (Identity) === */}
        {activeTab === 'accounts' && (
          <CommanderProfilesApp />
        )}

      </div>
    </div>
  );
};

export default SettingsApp;
