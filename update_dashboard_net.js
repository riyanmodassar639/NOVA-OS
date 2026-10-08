const fs = require('fs');
const filePath = '/mnt/d/NOVA/desktop/src/components/desktop/HUD/GlobalCommandDashboard.tsx';
let file = fs.readFileSync(filePath, 'utf8');

// 1. Move network fetch to fast interval and calculate delta
// First, remove network from slow interval
file = file.replace(
  "try { const n: any = await invoke('get_network_telemetry'); if (isMounted) { setNetTelemetry(n); netRef.current = n; } } catch (_) {}",
  ""
);

// Second, add previous bytes refs
if (!file.includes('const prevNet = useRef')) {
  file = file.replace(
    'const netRef = useRef<any>(null);',
    'const netRef = useRef<any>(null);\n  const prevNet = useRef({ tx: 0, rx: 0, time: Date.now() });\n  const currentBandwidth = useRef({ txSpeed: 0, rxSpeed: 0 });'
  );
}

// Third, inject fast network polling and delta calculation inside the fast interval
const fastIntervalMarker = "try { const mem: any = await invoke('get_memory_telemetry'); if (isMounted) setMemTelemetry(mem); } catch (_) {}";
const fastNetworkPoller = `
        try { const mem: any = await invoke('get_memory_telemetry'); if (isMounted) setMemTelemetry(mem); } catch (_) {}
        try { 
          const net: any = await invoke('get_network_telemetry'); 
          if (isMounted) {
            setNetTelemetry(net);
            netRef.current = net;
            const now = Date.now();
            const timeDiff = (now - prevNet.current.time) / 1000;
            if (timeDiff > 0 && prevNet.current.tx > 0) {
              const txDelta = net.tx_bytes - prevNet.current.tx;
              const rxDelta = net.rx_bytes - prevNet.current.rx;
              currentBandwidth.current = { 
                txSpeed: Math.max(0, txDelta / timeDiff), // Bytes per sec
                rxSpeed: Math.max(0, rxDelta / timeDiff)
              };
            }
            prevNet.current = { tx: net.tx_bytes, rx: net.rx_bytes, time: now };
          }
        } catch (_) {}
`;
file = file.replace(fastIntervalMarker, fastNetworkPoller);

// Fourth, update dataPoints for netUp and netDown to use bandwidth speed mapped to a 0-100 scale (assuming max 100MB/s for visual scale)
file = file.replace(
  /netUp: \[\.\.\.prev\.netUp\.slice\(1\), netRef\.current \? Math\.min\(100, \(netRef\.current\.tx_bytes \/ 1e9\) % 100\) : 0\],/g,
  'netUp: [...prev.netUp.slice(1), Math.min(100, (currentBandwidth.current.txSpeed / 1e6) * 10)], // Scale 10MB/s to 100%'
);
file = file.replace(
  /netDown: \[\.\.\.prev\.netDown\.slice\(1\), netRef\.current \? Math\.min\(100, \(netRef\.current\.rx_bytes \/ 1e9\) % 100\) : 0\],/g,
  'netDown: [...prev.netDown.slice(1), Math.min(100, (currentBandwidth.current.rxSpeed / 1e6) * 10)], // Scale 10MB/s to 100%'
);

// Fix the labels to show MB/s instead of GB total
file = file.replace(
  /label=\{\`TX — \$\{netTelemetry \? \(netTelemetry\.tx_bytes \/ 1e9\)\.toFixed\(2\) \+ " GB total" : "N\/A"\}\`\}/g,
  'label={`TX — ${currentBandwidth.current ? (currentBandwidth.current.txSpeed / 1e6).toFixed(2) : "0.00"} MB/s`}'
);
file = file.replace(
  /label=\{\`RX — \$\{netTelemetry \? \(netTelemetry\.rx_bytes \/ 1e9\)\.toFixed\(2\) \+ " GB total" : "N\/A"\}\`\}/g,
  'label={`RX — ${currentBandwidth.current ? (currentBandwidth.current.rxSpeed / 1e6).toFixed(2) : "0.00"} MB/s`}'
);

fs.writeFileSync(filePath, file);
console.log("Updated GlobalCommandDashboard network graph");
