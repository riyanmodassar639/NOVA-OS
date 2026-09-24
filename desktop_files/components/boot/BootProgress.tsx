import React, { memo } from "react";

interface BootProgressProps {
  progress: number;   // 0–100
  visible: boolean;
}

const BootProgress: React.FC<BootProgressProps> = memo(({ progress, visible }) => {
  if (!visible) return null;

  return (
    <div className="boot-status-wrap" style={{ position: "relative", bottom: "auto" }}>
      {/* Linear progress bar */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-pct">
          BOOT SEQUENCE {String(progress).padStart(3, "0")}%
        </div>
      </div>
    </div>
  );
});

export default BootProgress;
