import React, { useState } from "react";
import NovaBootScreen from "./components/boot/NovaBootScreen";
import HUDDesktop from "./components/desktop/HUD/HUDDesktop";

type AppScreen = "boot" | "desktop";

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>("boot");

  const handleBootComplete = () => {
    // Short delay for cinematic feel before switching
    setTimeout(() => setScreen("desktop"), 800);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000205" }}>
      {screen === "boot" && (
        <NovaBootScreen onBootComplete={handleBootComplete} />
      )}
      {screen === "desktop" && (
        <HUDDesktop />
      )}
    </div>
  );
};

export default App;
