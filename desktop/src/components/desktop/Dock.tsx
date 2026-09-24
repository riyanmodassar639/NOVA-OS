import React from "react";
import { useWindowManager, APPS } from "./WindowManager";
import "../../styles/nova-desktop.css";

const Dock: React.FC = () => {
  const { windows, openApp, toggleMinimize } = useWindowManager();

  const handleAppClick = (appId: string) => {
    // If we click an app icon on the dock
    // we open it or bring it to front/toggle minimize
    openApp(appId);
  };

  return (
    <div className="nova-dock-container">
      {Object.values(APPS).map(app => {
        const isOpen = windows.some(w => w.appId === app.id);
        
        return (
          <div
            key={app.id}
            className={`nova-dock-item ${isOpen ? "active" : ""}`}
            onClick={() => handleAppClick(app.id)}
            title={app.title}
          >
            {app.icon}
          </div>
        );
      })}
    </div>
  );
};

export default Dock;
