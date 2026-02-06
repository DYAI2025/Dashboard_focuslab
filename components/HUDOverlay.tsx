import React from 'react';

interface HUDOverlayProps {
  uptime?: string;
}

const HUDOverlay: React.FC<HUDOverlayProps> = ({ uptime }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25 select-none">
      {/* Circular Schematics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] animate-orbit-slow opacity-20">
        <svg viewBox="0 0 1000 1000" className="w-full h-full text-slate-600">
          <circle cx="500" cy="500" r="480" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 10" />
          <circle cx="500" cy="500" r="460" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="200 400" />
          <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M 500,20 V 80 M 500,920 V 980 M 20,500 H 80 M 920,500 H 980" stroke="currentColor" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
            <text
              key={deg}
              x="500" y="40"
              transform={`rotate(${deg}, 500, 500)`}
              className="text-[10px] font-mono fill-current"
            >
              {deg.toString().padStart(3, '0')}
            </text>
          ))}
        </svg>
      </div>

      {/* Hex Grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hexagons" width="100" height="86.6" patternUnits="userSpaceOnUse" viewBox="0 0 100 86.6">
              <path d="M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Vertical Data Stream */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-800">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-4 h-12 glass-panel border border-slate-700 flex flex-col items-center justify-center gap-1 py-1">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-slate-600 rounded-full" />
          <div className="w-1 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>

      {/* Corner Labels — real data */}
      <div className="absolute bottom-10 left-10 text-[8px] font-mono text-slate-500 space-y-1">
        <div className="flex gap-2"><span className="text-cyan-500 font-bold">HOST::</span> NEXUS_PRIMARY</div>
        <div className="flex gap-2"><span className="text-cyan-500 font-bold">UPTIME::</span> {uptime || '...'}</div>
        <div className="flex gap-2"><span className="text-cyan-500 font-bold">PORT::</span> 3003</div>
      </div>

      {/* Top HUD Markers */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-12 text-[7px] font-mono text-slate-500 tracking-[0.5em] uppercase">
        <span>CTRL_PLANE</span>
        <div className="w-20 h-px bg-slate-800" />
        <span className="text-cyan-500">LIVE_TELEMETRY</span>
        <div className="w-20 h-px bg-slate-800" />
        <span>V_1.0.0</span>
      </div>
    </div>
  );
};

export default HUDOverlay;
