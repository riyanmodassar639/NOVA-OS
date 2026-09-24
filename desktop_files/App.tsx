import React, { useState } from "react";
import NovaBootScreen from "./components/boot/NovaBootScreen";
import NovaDesktop    from "./components/ui/NovaDesktop";

type AppScreen = "boot" | "desktop";

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>("boot");

  const handleBootComplete = () => {
    // Short delay for cinematic feel before switching
    setTimeout(() => setScreen("desktop"), 800);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#00000f" }}>
      {screen === "boot" && (
        <NovaBootScreen onBootComplete={handleBootComplete} />
      )}
      {screen === "desktop" && (
        <NovaDesktop />
      )}
    </div>
  );
};

export default App;
