import React from "react";
import { Folder, Globe, Search, PlayCircle, Music, Mail, Image, Map, Settings } from "lucide-react";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunch: (id: string, label: string) => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, onAppLaunch }) => {
  // A set of fake desktop applications
  const drawerApps = [
    { id: "files", icon: <Folder />, label: "SYS_FILES" },
    { id: "browser", icon: <Globe />, label: "NET_NAV" },
    { id: "search", icon: <Search />, label: "OMNI_FIND" },
    { id: "media", icon: <PlayCircle />, label: "MEDIA_CORE" },
    { id: "audio", icon: <Music />, label: "AUDIO_SYS" },
    { id: "comms", icon: <Mail />, label: "COMMS_LINK" },
    { id: "gallery", icon: <Image />, label: "VISUALS" },
    { id: "map", icon: <Map />, label: "GEO_LOC" },
    { id: "settings", icon: <Settings />, label: "SYS_CONFIG" },
  ];

  return (
    <div className={`hud-drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div 
        className="hud-drawer-grid" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the grid
      >
        {drawerApps.map(app => (
          <div 
            key={app.id} 
            className="hud-drawer-item"
            onClick={() => onAppLaunch(app.id, app.label)}
          >
            {app.icon}
            <span>{app.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppDrawer;
