import React, { memo } from "react";

interface ScanlineProps {
  visible: boolean;
}

const Scanline: React.FC<ScanlineProps> = memo(({ visible }) => {
  if (!visible) return null;

  return (
    <>
      {/* CRT scanlines overlay */}
      <div className="nova-scanlines" />
      {/* Periodic scan sweep */}
      <div className="nova-scan-sweep" />
    </>
  );
});

export default Scanline;
