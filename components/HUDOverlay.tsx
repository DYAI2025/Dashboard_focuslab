
import React from 'react';

const HUDOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25 select-none">
      {/* Heavy Circular Schematics (Ref 1 style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] animate-orbit-slow opacity-10">
        <svg viewBox="0 0 1000 1000" className="w-full h-full text-slate-900">
          <circle cx="500" cy="500" r="480" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 10" />
          <circle cx="500" cy="500" r="460" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="200 400" />
          <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M 500,20 V 80 M 500,920 V 980 M 20,500 H 80 M 920,500 H 980" stroke="currentColor" strokeWidth="1" />
          
          {/* Micro numbering along circle */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
            <text 
              key={deg} 
              x="500" y="40" 
              transform={`rotate(${deg}, 500, 500)`} 
              className="text-[10px] font-mono fill-current"
            >
              {deg.toString().padStart(3, '0')}°
            </text>
          ))}
        </svg>
      </div>

      {/* Hexagonal Grid (Ref 3 style) */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hexagons" width="100" height="86.6" patternUnits="userSpaceOnUse" viewBox="0 0 100 86.6">
              <path d="M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Vertical Data Streams */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-200">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-4 h-12 glass-panel border border-slate-200 flex flex-col items-center justify-center gap-1 py-1">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* Corner Technical Labels */}
      <div className="absolute bottom-10 left-10 text-[8px] font-mono text-slate-400 space-y-1">
        <div className="flex gap-2"><span className="text-cyan-600 font-bold">STATUS::</span> TRANSMITTING</div>
        <div className="flex gap-2"><span className="text-cyan-600 font-bold">SOURCE::</span> HABITAT_04_G</div>
        <div className="flex gap-2"><span className="text-cyan-600 font-bold">COORD::</span> 14.281 / -0.0932</div>
      </div>
      
      {/* Top HUD Markers */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-12 text-[7px] font-mono text-slate-300 tracking-[0.5em] uppercase">
        <span>LAB_SEC_B</span>
        <div className="w-20 h-px bg-slate-100" />
        <span className="text-cyan-400">SYNC_ACTIVE</span>
        <div className="w-20 h-px bg-slate-100" />
        <span>V_0.9.4.1</span>
      </div>
    </div>
  );
};

export default HUDOverlay;
