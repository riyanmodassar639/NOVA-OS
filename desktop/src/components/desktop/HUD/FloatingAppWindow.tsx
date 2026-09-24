import React, { useState, useEffect, useRef } from "react";
import { X, Maximize2, Minus, Minimize2 } from "lucide-react";
import SettingsApp from "./SettingsApp";
import SystemDetailView from "./SystemDetailView";
import GlobalCommandDashboard from "./GlobalCommandDashboard";

interface FloatingAppWindowProps {
  appId: string | null;
  appLabel: string;
  position?: "center" | "left" | "right" | "cascade" | "random";
  customPos?: { x: string, y: string };
  index?: number;
  totalSubApps?: number;
  isActive?: boolean;
  onClose: () => void;
  onOpenSubApp?: (id: string, label: string) => void;
  onFocus?: () => void;
}

const FloatingAppWindow: React.FC<FloatingAppWindowProps> = ({ appId, appLabel, position = "center", customPos, index = 0, totalSubApps = 1, isActive = false, onClose, onOpenSubApp, onFocus }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Drag State
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (appId) {
      setTimeout(() => setIsRendered(true), 50); // small delay for animation
      if (appId === "sys_command") {
        setIsMaximized(true);
      }
    } else {
      setIsRendered(false);
      setDragOffset({ x: 0, y: 0 });
      setIsMaximized(false);
      setIsMinimized(false);
    }
  }, [appId]);

  if (!appId) return null;

  // Pointer Handlers for Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    if (onFocus) onFocus();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isMaximized) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    setDragOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Depth Stack Math
  const d = totalSubApps - 1 - index; // distance from the active (front) window

  const handleWindowClick = () => {
    if (onFocus) onFocus();
  };

  // Determine translation and stacking based on position
  let transformStr = `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`;
  let leftPos = "50%";
  let topPos = "50%";
  let zIndex = 1001;
  let scale = isRendered ? 1 : 0.8;
  let windowOpacity = isRendered ? 1 : 0;
  let brightness = 1;

  let winWidth = "900px";
  let winHeight = isMinimized ? "40px" : "550px";

  if (isMaximized) {
    winWidth = "100vw";
    winHeight = isMinimized ? "40px" : "100vh";
    leftPos = "50%";
    topPos = "50%";
    transformStr = `translate(-50%, -50%)`;
    zIndex = position === "left" || position === "center" ? 1050 : 3000;
  } else {
    if (position === "left") {
      leftPos = "20%"; // Shift main window to left
      transformStr = `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`;
      // If there are sub apps, dim the main window slightly
      if (totalSubApps > 0) brightness = 0.5;
    } else if (position === "random" && customPos) {
      // Random position assigned by desktop, but we still apply zIndex and dimming based on active state
      leftPos = customPos.x;
      topPos = customPos.y;
      transformStr = `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`;
      zIndex = 2000 + index;
      
      // Scale and brightness adjustments for background windows
      if (d > 0) {
        scale = 0.95;
        brightness = 0.6;
      }
    } else if (position === "cascade") {
      // 3D Depth Stack Effect
      const baseLeft = 75;
      const shiftStep = 5;
      leftPos = `${baseLeft - (d * shiftStep)}%`;
      topPos = `50%`;
      scale = isRendered ? (1 - (d * 0.05)) : 0.8;
      windowOpacity = isRendered ? (1 - (d * 0.15)) : 0;
      zIndex = 2000 + index;
      brightness = 1 - (d * 0.2); // Dim older windows
    }
  }

  // Boost active window to the front and make it fully bright
  if (isActive) {
    zIndex += 5000;
    brightness = 1;
    if (position === "left") {
      scale = 1.0;
    } else if (position === "random" || position === "cascade") {
      scale = 1.0;
    }
  }

  // Adjust blur background: only show if centered (main window)
  const showBackdrop = position === "center";

  return (
    <>
      {showBackdrop && (
        <div 
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 1000, 
            background: "rgba(0,5,10,0.6)", backdropFilter: "blur(4px)"
          }}
        />
      )}
      <div 
        onClick={handleWindowClick}
        style={{
          position: "fixed",
          top: topPos,
          left: leftPos,
          transform: `${transformStr} scale(${scale})`,
          opacity: windowOpacity,
          filter: `brightness(${brightness})`,
          width: winWidth,
          height: winHeight,
          background: "rgba(0, 10, 20, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 255, 255, 0.4)",
          boxShadow: "0 0 40px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(0,255,255,0.05)",
          zIndex: zIndex,
          display: "flex",
          flexDirection: "column",
          transition: isDragging.current ? "none" : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          color: "#00ffff",
          fontFamily: "var(--font-mono)",
          overflow: "hidden"
        }}
      >
        {/* Window Header */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 16px", background: "rgba(0, 255, 255, 0.1)",
            borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
            userSelect: "none",
            cursor: "move",
            height: "40px"
          }}
        >
          <div style={{ fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "bold", pointerEvents: "none" }}>
            [ {appLabel} ] // ACTIVE THREAD
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Minus 
              size={16} 
              className="hud-clickable" 
              style={{ opacity: 0.7, cursor: "pointer" }} 
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
            />
            {isMaximized ? (
              <Minimize2 
                size={14} 
                className="hud-clickable" 
                style={{ opacity: 0.7, cursor: "pointer" }} 
                onClick={(e) => { e.stopPropagation(); setIsMaximized(false); setDragOffset({x:0, y:0}); }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
              />
            ) : (
              <Maximize2 
                size={14} 
                className="hud-clickable" 
                style={{ opacity: 0.7, cursor: "pointer" }} 
                onClick={(e) => { e.stopPropagation(); setIsMaximized(true); }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
              />
            )}
            <X 
              size={18} 
              className="hud-clickable" 
              style={{ opacity: 0.7, cursor: "pointer" }} 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
            />
          </div>
        </div>

        {/* Window Body */}
        {!isMinimized && (
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            
            {appId === "settings" && <SettingsApp onOpenSubApp={onOpenSubApp} />}

            {(appId?.startsWith("sys_") || appId?.startsWith("net_")) && appId !== "sys_command" && <SystemDetailView type={appId} />}

            {appId === "sys_command" && <GlobalCommandDashboard onOpenSubApp={onOpenSubApp} />}

            {appId === "files" && (
              <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", overflowY: "auto", height: "100%" }}>
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="hud-clickable" style={{ padding: "20px", background: "rgba(0,255,255,0.05)", border: "1px solid rgba(0,255,255,0.1)", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📁</div>
                    <div style={{ fontSize: "0.6rem" }}>SYS_ARCHIVE_{i+1}.dat</div>
                  </div>
                ))}
              </div>
            )}
            
            {appId === "browser" && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                 <div style={{ padding: "8px", borderBottom: "1px solid rgba(0,255,255,0.2)", background: "rgba(0,0,0,0.5)" }}>
                   <input type="text" value="https://nova.quantum-net.local" readOnly style={{ width: "100%", background: "transparent", border: "none", color: "#00ffff", outline: "none", fontFamily: "var(--font-mono)" }} />
                 </div>
                 <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                   <p>ESTABLISHING SECURE CONNECTION...</p>
                 </div>
              </div>
            )}

            {appId !== "files" && appId !== "browser" && appId !== "settings" && !appId?.startsWith("sys_") && (
              <div style={{ padding: "20px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <div className="hud-radar-wrap" style={{ width: "80px", height: "80px", opacity: 0.5 }}>
                  <div className="hud-radar-sweep" />
                </div>
                <p style={{ letterSpacing: "4px", fontSize: "0.8rem", opacity: 0.7 }}>MODULE [ {appLabel} ] INITIALIZING...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingAppWindow;
