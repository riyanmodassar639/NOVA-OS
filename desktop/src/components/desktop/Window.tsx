import React, { useState, useRef, useEffect } from "react";
import { WindowState, useWindowManager } from "./WindowManager";
import "../../styles/nova-desktop.css"; // We will create this

interface WindowProps {
  window: WindowState;
  title: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ window: win, title, children }) => {
  const { focusWindow, closeWindow, toggleMinimize, toggleMaximize, updateWindow } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    focusWindow(win.id);
    if (win.isMaximized) return; // Don't drag if maximized
    
    // Check if clicking on the title bar
    const target = e.target as HTMLElement;
    if (target.closest(".window-controls")) return; // Don't drag if clicking buttons

    setIsDragging(true);
    const rect = windowRef.current!.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Capture pointer to track outside window bounds
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    // Update position
    updateWindow(win.id, {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`nova-window ${win.isMaximized ? "maximized" : ""}`}
      style={{
        position: "absolute",
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 0 : win.y,
        width: win.isMaximized ? "100%" : win.width,
        height: win.isMaximized ? "100%" : win.height,
        zIndex: win.zIndex,
      }}
      onPointerDown={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div 
        className="nova-window-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button onClick={() => toggleMinimize(win.id)} className="btn-min">−</button>
          <button onClick={() => toggleMaximize(win.id)} className="btn-max">□</button>
          <button onClick={() => closeWindow(win.id)} className="btn-close">×</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="nova-window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
