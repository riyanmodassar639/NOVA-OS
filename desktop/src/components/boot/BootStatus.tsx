import React, { useEffect, useState, useRef, memo } from "react";
import { BootStep } from "../../data/bootSequence";

interface BootStatusProps {
  visible: boolean;
  currentStep: BootStep | null;
  isReady: boolean;
}

const BootStatus: React.FC<BootStatusProps> = memo(({ visible, currentStep, isReady }) => {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isFlickering, setIsFlickering] = useState(false);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetText = isReady
    ? "SYSTEM ONLINE"
    : currentStep?.message ?? "INITIALIZING...";

  // Typewriter effect
  useEffect(() => {
    if (!visible) return;
    setCharIndex(0);
    setDisplayText("");

    const typeNext = (idx: number) => {
      if (idx <= targetText.length) {
        setDisplayText(targetText.slice(0, idx));
        setCharIndex(idx);
        rafRef.current = setTimeout(() => typeNext(idx + 1), 22);
      }
    };

    typeNext(0);
    return () => { if (rafRef.current) clearTimeout(rafRef.current); };
  }, [targetText, visible]);

  // Occasional flicker on ready state
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 80);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isReady]);

  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        marginTop: "8px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s",
      }}
    >
      <div
        className={`boot-status-msg ${isReady ? "ready" : ""}`}
        style={{ opacity: isFlickering ? 0.3 : 1, transition: isFlickering ? "none" : "opacity 0.1s" }}
      >
        {displayText}
        {/* Blinking cursor */}
        {charIndex < targetText.length && (
          <span style={{ animation: "dot-blink 0.6s ease-in-out infinite", marginLeft: 2 }}>▮</span>
        )}
      </div>
    </div>
  );
});

export default BootStatus;
