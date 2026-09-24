import React from "react";
import "../../boot/NovaCore"; // Let's just import NovaCore directly to save rewriting the rings!
import NovaCore from "../../boot/NovaCore";

const HUDCenter: React.FC = () => {
  return (
    <div className="hud-center">
      {/* 
        We can reuse the NovaCore component, but force it to be "ready" 
        and fully visible. It already has the beautiful spinning rings and text!
      */}
      <div style={{ transform: "scale(1.5)" }}>
        <NovaCore 
          visible={true}
          outerRingVisible={true}
          innerRingVisible={true}
          radialVisible={true}
          logoVisible={true}
          osTextVisible={true}
          progress={100}
          isReady={false} // Keeping it false so it says "NOVA OS" instead of "WELCOME"
        />
      </div>
    </div>
  );
};

export default HUDCenter;
