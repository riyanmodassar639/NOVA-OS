import React, { useState, useEffect } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* The main glowing dot that follows exactly */}
      <div 
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "4px",
          height: "4px",
          background: "#00ffff",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999999,
          boxShadow: "0 0 10px #00ffff, 0 0 20px #00ffff"
        }}
      />

      {/* The trailing ring that shrinks on click */}
      <div 
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: isClicking ? "20px" : "30px",
          height: isClicking ? "20px" : "30px",
          border: `1px solid ${isClicking ? "#fff" : "rgba(0, 255, 255, 0.5)"}`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999998,
          transition: "width 0.1s, height 0.1s, border-color 0.1s",
          boxShadow: isClicking ? "0 0 15px #00ffff" : "none"
        }}
      >
        {/* Crosshair ticks on the ring */}
        <div style={{ position: "absolute", top: "-4px", left: "50%", width: "1px", height: "4px", background: "#00ffff", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", bottom: "-4px", left: "50%", width: "1px", height: "4px", background: "#00ffff", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: "-4px", top: "50%", height: "1px", width: "4px", background: "#00ffff", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", right: "-4px", top: "50%", height: "1px", width: "4px", background: "#00ffff", transform: "translateY(-50%)" }} />
      </div>
    </>
  );
};

export default CustomCursor;
