import React, { useState, useEffect } from "react";
import "../../../styles/nova-hud.css";
import HUDBackground from "./HUDBackground";
import HUDCenter from "./HUDCenter";
import HUDLeftPanel from "./HUDLeftPanel";
import HUDRightPanel from "./HUDRightPanel";
import DataStream from "./DataStream";
import AppDrawer from "./AppDrawer";

import HUDTopBar from "./HUDTopBar";
import StartMenu from "./StartMenu";
import FloatingAppWindow from "./FloatingAppWindow";
import SystemTrayPanel from "./SystemTrayPanel";

const HUDDesktop: React.FC = () => {
  const [activeAppId, setActiveAppId] = useState<string>("terminal");
  const [visible, setVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  // Tray State
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [trayType, setTrayType] = useState<'wifi' | 'bluetooth' | 'volume' | 'arrow' | null>(null);
  
  // Floating App State
  const [floatingApp, setFloatingApp] = useState<{ id: string, label: string } | null>(null);
  const [subApps, setSubApps] = useState<{ id: string, label: string, pos: { x: string, y: string } }[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  useEffect(() => {
    // Cinematic fade in
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleReboot = () => {
    // A simple page reload simulates a reboot back to the boot sequence
    window.location.reload();
  };

  const handleAppLaunch = (id: string, label: string) => {
    setIsDrawerOpen(false); // Close drawer
    setSubApps([]);
    setFloatingApp({ id, label }); // Open floating window
    setActiveWindowId(id);
  };

  const handleOpenSubApp = (id: string, label: string) => {
    setSubApps(prev => {
      const existing = prev.find(app => app.id === id);
      if (existing) {
         const filtered = prev.filter(app => app.id !== id);
         return [...filtered, existing];
      }
      const randX = Math.floor(Math.random() * 40) + 30;
      const randY = Math.floor(Math.random() * 40) + 30;
      return [...prev, { id, label, pos: { x: `${randX}%`, y: `${randY}%` } }];
    });
    setActiveWindowId(id);
  };

  const handleCloseSubApp = (id: string) => {
    setSubApps(prev => {
      const nextApps = prev.filter(app => app.id !== id);
      // If we are closing the currently active window, shift focus to the next available sub-app
      if (activeWindowId === id) {
        if (nextApps.length > 0) {
          setActiveWindowId(nextApps[nextApps.length - 1].id);
        } else {
          setActiveWindowId(floatingApp?.id || null);
        }
      }
      return nextApps;
    });
  };

  const handleFocusWindow = (id: string) => {
    if (id !== floatingApp?.id) {
      setSubApps(prev => {
        const existing = prev.find(app => app.id === id);
        if (!existing) return prev;
        const filtered = prev.filter(app => app.id !== id);
        return [...filtered, existing];
      });
    }
    setActiveWindowId(id);
  };

  const handleTrayClick = (type: 'wifi' | 'bluetooth' | 'volume' | 'arrow') => {
    if (isTrayOpen && trayType === type) {
      setIsTrayOpen(false); // Toggle close if clicking the same icon
      setTrayType(null);
    } else {
      setTrayType(type);
      setIsTrayOpen(true);
    }
  };

  return (
    <div 
      className="hud-container"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 2s ease-in-out"
      }}
    >
      {/* Top Status Bar */}
      <HUDTopBar 
        onLaunchApps={() => setIsDrawerOpen(true)} 
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        onTrayClick={handleTrayClick}
      />

      {/* Start Menu Control Center */}
      <StartMenu 
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onReboot={handleReboot}
      />

      {/* Right System Tray Quick Settings */}
      <SystemTrayPanel 
        isOpen={isTrayOpen}
        activeTab={trayType}
        onClose={() => setIsTrayOpen(false)}
      />

      {/* Background Enhancements */}
      <DataStream />
      <HUDBackground />

      {/* Main Screen Layout - Center Logo Only */}
      <div 
        className="hud-main" 
        style={{ 
          width: "100%", 
          height: "100%", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center" 
        }}
      >
        <HUDCenter />
      </div>

      {/* Fullscreen Modal App Drawer */}
      <AppDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onAppLaunch={handleAppLaunch}
      />

      {/* Main App Window (Moves left if ANY subApp is open) */}
      <FloatingAppWindow 
        appId={floatingApp?.id || null}
        appLabel={floatingApp?.label || ""}
        position={subApps.length > 0 ? "left" : "center"}
        totalSubApps={subApps.length}
        isActive={activeWindowId === floatingApp?.id}
        onClose={() => {
          setFloatingApp(null);
          setSubApps([]);
          setActiveWindowId(null);
        }}
        onOpenSubApp={handleOpenSubApp}
        onFocus={() => floatingApp?.id && handleFocusWindow(floatingApp.id)}
      />

      {/* Sub App Windows */}
      {subApps.map((sub, index) => (
        <FloatingAppWindow 
          key={sub.id}
          appId={sub.id}
          appLabel={sub.label}
          position="random"
          customPos={sub.pos}
          index={index}
          totalSubApps={subApps.length}
          isActive={activeWindowId === sub.id}
          onClose={() => handleCloseSubApp(sub.id)}
          onOpenSubApp={handleOpenSubApp}
          onFocus={() => handleFocusWindow(sub.id)}
        />
      ))}
    </div>
  );
};

export default HUDDesktop;
