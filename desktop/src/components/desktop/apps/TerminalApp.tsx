import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

interface LogEntry {
  type: "banner" | "input" | "output" | "error" | "info";
  text: string;
}

const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<LogEntry[]>([
    { type: "banner", text: "╔══════════════════════════════════════════════════════════════╗" },
    { type: "banner", text: "║      NOVA WORKSTATION // SYSTEM TERMINAL & KERNEL SHELL      ║" },
    { type: "banner", text: "║            KERNEL: Linux (x86_64) • USER: nova               ║" },
    { type: "banner", text: "╚══════════════════════════════════════════════════════════════╝" },
    { type: "info", text: "Type 'help' for common diagnostic tools, or execute any Linux command." },
    { type: "info", text: "Examples: 'ping -c 3 8.8.8.8', 'ip a', 'uname -a', 'free -h', 'ls -la'." },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isExecuting]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = inputVal.trim();
      if (!cmd) return;

      // Add to command history for arrow navigation
      setCmdHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      setInputVal("");

      // Append user command line to terminal view
      setHistory(prev => [...prev, { type: "input", text: `nova@quantum:~$ ${cmd}` }]);

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      if (cmd === "help") {
        setHistory(prev => [
          ...prev,
          {
            type: "info",
            text: [
              "AVAILABLE SYSTEM DIAGNOSTIC COMMANDS:",
              "  ping -c 3 8.8.8.8   - Test live network uplink to internet",
              "  ip a               - Show all physical & virtual network interfaces",
              "  ip route show      - Show active routing table & default gateway",
              "  iw dev             - List wireless Wi-Fi interfaces",
              "  uname -a           - Print kernel release and machine architecture",
              "  lscpu              - Display CPU architecture telemetry",
              "  free -h            - Display total, used and available RAM",
              "  df -h              - Display mounted storage partitions and usage",
              "  uptime             - Show system running time and load averages",
              "  whoami             - Show current active session user",
              "  clear              - Clear terminal window logs",
            ].join("\n"),
          },
        ]);
        return;
      }

      // Execute live command via Tauri Rust backend
      setIsExecuting(true);
      try {
        const res: string = await invoke("run_terminal_command", { cmd });
        if (res && res.trim().length > 0) {
          setHistory(prev => [...prev, { type: "output", text: res.trimEnd() }]);
        }
      } catch (err: any) {
        setHistory(prev => [
          ...prev,
          { type: "error", text: `Command error: ${err?.toString() || "Unknown error"}` },
        ]);
      } finally {
        setIsExecuting(false);
      }
    }
  };

  return (
    <div 
      onClick={focusInput}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "rgba(5, 10, 20, 0.95)",
        padding: "16px",
        borderRadius: "4px",
        border: "1px solid rgba(0, 229, 255, 0.2)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
        cursor: "text",
        overflow: "hidden",
      }}
    >
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: "1.5",
          paddingRight: "8px",
        }}
      >
        {history.map((entry, idx) => {
          let color = "#00e5ff";
          if (entry.type === "banner") color = "#00ffff";
          if (entry.type === "input") color = "#ffaa00";
          if (entry.type === "error") color = "#ff4444";
          if (entry.type === "info") color = "#a78bfa";
          if (entry.type === "output") color = "#e0f2fe";

          return (
            <div 
              key={idx} 
              style={{ 
                color, 
                marginBottom: "4px",
                textShadow: entry.type === "banner" || entry.type === "input" ? "0 0 5px rgba(0,229,255,0.4)" : "none",
              }}
            >
              {entry.text}
            </div>
          );
        })}

        {isExecuting && (
          <div style={{ color: "#00e5ff", opacity: 0.8, fontStyle: "italic" }}>
            [Executing in kernel space...]
          </div>
        )}

        {/* Live Input Prompt Line */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
          <span style={{ color: "#00ff88", fontWeight: "bold", whiteSpace: "nowrap" }}>nova@quantum:~$</span>
          <input 
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: "inherit",
              fontSize: "inherit",
              padding: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
