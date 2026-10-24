import React, { useState, useEffect, useRef } from "react";
import "../../../styles/nova-hud.css";
import HUDBackground from "./HUDBackground";
import HUDCenter from "./HUDCenter";
import DataStream from "./DataStream";
import AppDrawer from "./AppDrawer";
import HUDTopBar from "./HUDTopBar";
import StartMenu from "./StartMenu";
import FloatingAppWindow from "./FloatingAppWindow";
import SystemTrayPanel from "./SystemTrayPanel";
import TaskSwitcherModal, { ManagedApp } from "./TaskSwitcherModal";

const HUDDesktop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  // Tray State
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [trayType, setTrayType] = useState<'wifi' | 'bluetooth' | 'volume' | 'arrow' | null>(null);
  
  // Multitasking & Managed Apps State
  const [managedApps, setManagedApps] = useState<ManagedApp[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isTaskSwitcherOpen, setIsTaskSwitcherOpen] = useState(false);

  // Double Right-Click Detection
  const lastRightClickTime = useRef<number>(0);

  useEffect(() => {
    // Cinematic fade in
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Global ContextMenu Listener for Double Right-Click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow context menu inside input fields or textareas (for copy/paste)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault(); // Suppress generic browser right-click menu
      
      const now = Date.now();
      if (now - lastRightClickTime.current < 450) {
        // Double right-click detected!
        setIsTaskSwitcherOpen(prev => !prev);
        lastRightClickTime.current = 0;
      } else {
        lastRightClickTime.current = now;
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Sync running apps to Rust backend
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const tasksPayload = managedApps.map(a => ({
          id: a.id,
          label: a.label,
          status: a.isMinimized ? "background" : "active",
          opened_at: a.lastActive,
          last_active: a.lastActive,
          details: a.id === "terminal" ? "Kernel Bash Shell" : "Hardware Telemetry & Subsystems",
        }));
        await invoke('sync_app_tasks', { tasks: tasksPayload });
      } catch (err) {
        // Fallback or dev mode
      }
    };
    syncBackend();
  }, [managedApps]);

  const handleReboot = () => {
    window.location.reload();
  };

  const handleAppLaunch = async (id: string, label: string, type: "internal" | "external") => {
    setIsDrawerOpen(false); // Close drawer
    
    if (type === "external") {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('launch_external_app', { appId: id });
        console.log(`Successfully launched external app: ${id}`);
      } catch (err) {
        console.error(`Failed to launch external app ${id}:`, err);
      }
    } else {
      // Internal App - Multitasking Window Management
      setManagedApps(prev => {
        const existing = prev.find(app => app.id === id);
        if (existing) {
          // Bring to front, unminimize, and update timestamp
          return prev.map(app => 
            app.id === id 
              ? { ...app, isMinimized: false, lastActive: Date.now() }
              : app
          );
        }

        // Calculate position: first app is center, subsequent apps cascade or random
        const position = prev.length === 0 ? "center" : "left";
        const newApp: ManagedApp = {
          id,
          label,
          position,
          isMinimized: false,
          isMaximized: false,
          zIndex: 2000 + prev.length + 1,
          lastActive: Date.now(),
        };
        return [...prev, newApp];
      });
      setActiveWindowId(id);
    }
  };

  const handleOpenSubApp = (id: string, label: string) => {
    setManagedApps(prev => {
      const existing = prev.find(app => app.id === id);
      if (existing) {
        return prev.map(app => 
          app.id === id 
            ? { ...app, isMinimized: false, lastActive: Date.now() }
            : app
        );
      }
      const randX = Math.floor(Math.random() * 40) + 30;
      const randY = Math.floor(Math.random() * 40) + 30;
      const newSubApp: ManagedApp = {
        id,
        label,
        position: "random",
        customPos: { x: `${randX}%`, y: `${randY}%` },
        isMinimized: false,
        isMaximized: false,
        zIndex: 2000 + prev.length + 1,
        lastActive: Date.now(),
      };
      return [...prev, newSubApp];
    });
    setActiveWindowId(id);
  };

  // Minimize app: keeps it alive in the background
  const handleMinimizeApp = (id: string) => {
    setManagedApps(prev =>
      prev.map(app => (app.id === id ? { ...app, isMinimized: true } : app))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  // Close/Terminate app completely
  const handleTerminateApp = async (id: string) => {
    setManagedApps(prev => prev.filter(app => app.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('terminate_app_task', { taskId: id });
    } catch (err) {
      // ignore
    }
  };

  // Switch to or restore an app from Task Switcher
  const handleSelectFromSwitcher = (id: string) => {
    setManagedApps(prev =>
      prev.map(app =>
        app.id === id 
          ? { ...app, isMinimized: false, lastActive: Date.now() } 
          : app
      )
    );
    setActiveWindowId(id);
    setIsTaskSwitcherOpen(false);
  };

  const handleMinimizeAll = () => {
    setManagedApps(prev => prev.map(app => ({ ...app, isMinimized: true })));
    setActiveWindowId(null);
    setIsTaskSwitcherOpen(false);
  };

  const handleFocusWindow = (id: string) => {
    setActiveWindowId(id);
    setManagedApps(prev =>
      prev.map(app => (app.id === id ? { ...app, lastActive: Date.now() } : app))
    );
  };

  const handleTrayClick = (type: 'wifi' | 'bluetooth' | 'volume' | 'arrow') => {
    if (isTrayOpen && trayType === type) {
      setIsTrayOpen(false);
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
      {/* Top Status Bar with Task Switcher icon */}
      <HUDTopBar 
        onLaunchApps={() => setIsDrawerOpen(true)} 
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        onTrayClick={handleTrayClick}
        onToggleTaskSwitcher={() => setIsTaskSwitcherOpen(prev => !prev)}
        runningTasksCount={managedApps.length}
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

      {/* Managed Multitasking Windows */}
      {managedApps.map((app, index) => (
        <FloatingAppWindow 
          key={app.id}
          appId={app.id}
          appLabel={app.label}
          position={app.position}
          customPos={app.customPos}
          index={index}
          totalSubApps={managedApps.length}
          isActive={activeWindowId === app.id}
          isMinimized={app.isMinimized}
          onMinimize={() => handleMinimizeApp(app.id)}
          onClose={() => handleTerminateApp(app.id)}
          onOpenSubApp={handleOpenSubApp}
          onFocus={() => handleFocusWindow(app.id)}
        />
      ))}

      {/* Double Right-Click Task Switcher / Exposé Matrix */}
      <TaskSwitcherModal 
        isOpen={isTaskSwitcherOpen}
        apps={managedApps}
        activeAppId={activeWindowId}
        onClose={() => setIsTaskSwitcherOpen(false)}
        onSelectApp={handleSelectFromSwitcher}
        onTerminateApp={handleTerminateApp}
        onMinimizeAll={handleMinimizeAll}
      />
    </div>
  );
};

export default HUDDesktop;
