import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
}

export interface WindowState {
  id: string;         // Unique instance id
  appId: string;      // Which app this is
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openApp: (appId: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowState>) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

// Built-in Apps Configuration
export const APPS: Record<string, AppDefinition> = {
  terminal: { id: "terminal", title: "AI TERMINAL", icon: "⌨️" },
  monitor:  { id: "monitor",  title: "SYS MONITOR", icon: "📊" },
  uplink:   { id: "uplink",   title: "NET UPLINK",  icon: "🌐" },
};

export const WindowManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  const focusWindow = (id: string) => {
    setNextZIndex((prev) => prev + 1);
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, zIndex: nextZIndex + 1 } : win))
    );
    setActiveWindowId(id);
  };

  const openApp = (appId: string) => {
    // If an instance of this app is already open, just focus it
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        updateWindow(existing.id, { isMinimized: false });
      }
      focusWindow(existing.id);
      return;
    }

    // Default window size & random cascade position
    const offset = (windows.length * 30) % 200;
    const newWin: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      x: 100 + offset,
      y: 100 + offset,
      width: 600,
      height: 400,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex + 1,
    };
    
    setNextZIndex((prev) => prev + 1);
    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId(newWin.id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, ...updates } : win))
    );
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;
      return prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w);
    });
  };

  const toggleMaximize = (id: string) => {
    setWindows((prev) => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;
      return prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w);
    });
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        openApp,
        closeWindow,
        focusWindow,
        updateWindow,
        toggleMinimize,
        toggleMaximize,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return context;
};
