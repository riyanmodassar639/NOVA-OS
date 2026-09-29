import React from "react";
import * as Icons from "lucide-react";
import { APP_REGISTRY, AppType } from "../../data/AppRegistry";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunch: (id: string, label: string, type: AppType) => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, onAppLaunch }) => {
  return (
    <div className={`hud-drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div 
        className="hud-drawer-grid" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the grid
      >
        {APP_REGISTRY.map(app => {
          // Dynamically get the icon component from Lucide
          const IconComponent = (Icons as any)[app.iconName] || Icons.HelpCircle;
          return (
            <div 
              key={app.id} 
              className="hud-drawer-item"
              onClick={() => onAppLaunch(app.id, app.label, app.type)}
            >
              <IconComponent />
              <span>{app.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppDrawer;
