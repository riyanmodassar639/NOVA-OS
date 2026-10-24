import React, { useEffect } from "react";
import * as Icons from "lucide-react";
import { X, Layers, Maximize2, Terminal, Shield, Wifi, Cpu, Settings, Activity } from "lucide-react";

export interface ManagedApp {
  id: string;
  label: string;
  iconName?: string;
  position?: "center" | "left" | "random";
  customPos?: { x: string; y: string };
  isMinimized: boolean;
  isMaximized?: boolean;
  zIndex: number;
  lastActive: number;
  type?: string;
}

interface TaskSwitcherModalProps {
  isOpen: boolean;
  apps: ManagedApp[];
  activeAppId: string | null;
  onClose: () => void;
  onSelectApp: (appId: string) => void;
  onTerminateApp: (appId: string) => void;
  onMinimizeAll: () => void;
}

const getAppIcon = (id: string, iconName?: string) => {
  if (iconName && (Icons as any)[iconName]) {
    const IconCmp = (Icons as any)[iconName];
    return <IconCmp size={20} />;
  }
  if (id === "terminal") return <Terminal size={20} />;
  if (id === "settings") return <Settings size={20} />;
  if (id === "security") return <Shield size={20} />;
  if (id.includes("network") || id.includes("wifi")) return <Wifi size={20} />;
  if (id.includes("cpu")) return <Cpu size={20} />;
  return <Activity size={20} />;
};

const getAppSubtitle = (id: string) => {
  if (id === "terminal") return "Interactive Linux Kernel Shell (Bash)";
  if (id === "settings") return "System Configuration & Deep Scan";
  if (id === "security") return "Quantum Security Protocols & Firewall";
  if (id.startsWith("sys_") || id.startsWith("net_")) return "Hardware & Network Real-time Telemetry";
  return "Quantum Subsystem Process";
};

const TaskSwitcherModal: React.FC<TaskSwitcherModalProps> = ({
  isOpen,
  apps,
  activeAppId,
  onClose,
  onSelectApp,
  onTerminateApp,
  onMinimizeAll,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCount = apps.filter(a => !a.isMinimized).length;
  const bgCount = apps.filter(a => a.isMinimized).length;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(2, 8, 16, 0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        userSelect: "none",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      {/* Header Matrix Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "1100px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          padding: "14px 20px",
          background: "rgba(0, 229, 255, 0.05)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Layers size={22} style={{ color: "#00e5ff" }} />
          <div>
            <div style={{ color: "#00ffff", fontSize: "1rem", fontWeight: "bold", letterSpacing: "2px", fontFamily: "var(--font-mono)" }}>
              NOVA MATRIX // MULTITASKING & RUNNING THREADS
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              Double Right-Click Gesture Active • Running: <span style={{ color: "#00ff88", fontWeight: "bold" }}>{activeCount} active</span> • <span style={{ color: "#00e5ff", fontWeight: "bold" }}>{bgCount} in background</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {apps.length > 0 && (
            <button
              onClick={onMinimizeAll}
              style={{
                background: "rgba(255, 170, 0, 0.1)",
                border: "1px solid rgba(255, 170, 0, 0.4)",
                color: "#ffaa00",
                padding: "6px 14px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                borderRadius: "3px",
                letterSpacing: "1px",
              }}
            >
              SEND ALL TO BACKGROUND
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 68, 68, 0.15)",
              border: "1px solid rgba(255, 68, 68, 0.4)",
              color: "#ff4444",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <X size={16} />
            <span>CLOSE OVERVIEW</span>
          </button>
        </div>
      </div>

      {/* Grid of Running Windows / Threads */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "1100px",
          maxHeight: "75vh",
          overflowY: "auto",
          padding: "10px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {apps.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "60px 20px",
              textAlign: "center",
              background: "rgba(0, 229, 255, 0.03)",
              border: "1px dashed rgba(0, 229, 255, 0.2)",
              borderRadius: "4px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ fontSize: "2.5rem", color: "#00e5ff", opacity: 0.5, marginBottom: "12px" }}>⬡</div>
            <div style={{ color: "#00ffff", fontSize: "1.1rem", letterSpacing: "2px" }}>NO ACTIVE THREADS IN MEMORY</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "8px" }}>
              Launch apps like SYS_TERM or SYS_CONFIG from the top bar App Drawer.
            </div>
          </div>
        ) : (
          apps.map((app) => {
            const isForeground = !app.isMinimized && activeAppId === app.id;
            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                style={{
                  background: isForeground
                    ? "rgba(0, 229, 255, 0.12)"
                    : "rgba(5, 15, 30, 0.85)",
                  border: isForeground
                    ? "2px solid #00e5ff"
                    : app.isMinimized
                    ? "1px solid rgba(0, 229, 255, 0.25)"
                    : "1px solid rgba(0, 255, 136, 0.4)",
                  borderRadius: "6px",
                  padding: "16px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "all 0.2s ease",
                  boxShadow: isForeground
                    ? "0 0 25px rgba(0, 229, 255, 0.25)"
                    : "0 4px 15px rgba(0, 0, 0, 0.4)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "#00ffff";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 229, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = isForeground
                    ? "#00e5ff"
                    : app.isMinimized
                    ? "rgba(0, 229, 255, 0.25)"
                    : "rgba(0, 255, 136, 0.4)";
                  e.currentTarget.style.boxShadow = isForeground
                    ? "0 0 25px rgba(0, 229, 255, 0.25)"
                    : "0 4px 15px rgba(0, 0, 0, 0.4)";
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        padding: "8px",
                        background: "rgba(0, 229, 255, 0.15)",
                        borderRadius: "4px",
                        color: "#00e5ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getAppIcon(app.id, app.iconName)}
                    </div>
                    <div>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          letterSpacing: "1px",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {app.label}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {getAppSubtitle(app.id)}
                      </div>
                    </div>
                  </div>

                  {/* Terminate Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTerminateApp(app.id);
                    }}
                    title="Terminate process"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255, 68, 68, 0.6)",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "3px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ff4444";
                      e.currentTarget.style.background = "rgba(255,68,68,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 68, 68, 0.6)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* State Preview Box */}
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.75)",
                    minHeight: "75px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  {app.id === "terminal" ? (
                    <>
                      <div style={{ color: "#00ff88" }}>nova@quantum:~$ (Session Preserved)</div>
                      <div style={{ color: "#00e5ff", opacity: 0.8 }}>Kernel: Linux 64-bit • Bash Thread Alive</div>
                      <div style={{ color: "rgba(255,255,255,0.4)" }}>Click card to resume terminal history...</div>
                    </>
                  ) : app.id.includes("network") ? (
                    <>
                      <div style={{ color: "#00e5ff" }}>[ NETWORK UPLINK DEEP SCAN ]</div>
                      <div style={{ color: "#00ff88" }}>Telemetry Pollers Running in Background</div>
                      <div style={{ color: "rgba(255,255,255,0.4)" }}>Graphs & Packets Syncing...</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: "#00ffff" }}>MODULE: {app.label}</div>
                      <div style={{ color: "#00ff88" }}>Process Memory Intact</div>
                      <div style={{ color: "rgba(255,255,255,0.4)" }}>State saved at {new Date(app.lastActive).toLocaleTimeString()}</div>
                    </>
                  )}
                </div>

                {/* Footer Status Badge & Action */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-mono)",
                      color: app.isMinimized ? "#00e5ff" : "#00ff88",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: app.isMinimized ? "#00e5ff" : "#00ff88",
                        boxShadow: app.isMinimized
                          ? "0 0 8px #00e5ff"
                          : "0 0 8px #00ff88",
                      }}
                    />
                    <span>{app.isMinimized ? "BACKGROUND THREAD" : "ACTIVE ON SCREEN"}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#00ffff",
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-mono)",
                      fontWeight: "bold",
                    }}
                  >
                    <Maximize2 size={13} />
                    <span>RESTORE</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Hint */}
      <div
        style={{
          marginTop: "20px",
          color: "rgba(255, 255, 255, 0.4)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "1px",
        }}
      >
        TIP: DOUBLE RIGHT-CLICK ANYWHERE ON DESKTOP OR PRESS ESC TO TOGGLE
      </div>
    </div>
  );
};

export default TaskSwitcherModal;
