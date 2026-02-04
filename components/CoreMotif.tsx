import React from 'react';
import { ProjectModule } from '../types';

interface CoreMotifProps {
  projects: ProjectModule[];
}

const CoreMotif: React.FC<CoreMotifProps> = ({ projects }) => {
  const activeModules = projects.filter(p => p.status === 'ACTIVE').length;
  const totalModules = projects.length;
  const activationRatio = totalModules > 0 ? activeModules / totalModules : 0;
  
  // Dynamic status based on activity - Now correctly initialized
  const statusLabel = activationRatio > 0.6 ? 'OPTIMAL' : activationRatio > 0.3 ? 'NOMINAL' : 'LOW_POWER';
  const coreGlowColor = activationRatio > 0.3 ? 'rgba(34, 211, 238, 0.4)' : 'rgba(245, 158, 11, 0.4)';

  return (
    <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem] flex items-center justify-center select-none">
      {/* Internal Lens Flare - Reacts to activation ratio */}
      <div 
        className={`absolute w-40 h-40 rounded-full blur-[80px] animate-pulse transition-colors duration-1000 ${activationRatio > 0.3 ? 'bg-cyan-400/20' : 'bg-amber-400/10'}`} 
      />
      
      {/* Outer Rotating Scaffolding */}
      <svg className="absolute inset-0 animate-orbit w-full h-full opacity-60" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(203, 213, 225, 0.4)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="2 10" />
        {/* Mechanical Ticks */}
        {[0, 90, 180, 270].map(deg => (
          <rect key={deg} x="99.5" y="0" width="1" height="6" fill="#94a3b8" transform={`rotate(${deg}, 100, 100)`} />
        ))}
      </svg>

      {/* Middle Dynamic Logic Layer */}
      <svg className="absolute inset-8 animate-orbit-slow w-[84%] h-[84%]" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="8" strokeDasharray="50 30" />
        <circle cx="100" cy="100" r="75" fill="none" stroke={coreGlowColor} strokeWidth="0.5" strokeDasharray="1 5" />
      </svg>

      {/* The Physical Core Unit */}
      <div className="w-40 h-40 md:w-60 md:h-60 rounded-full panel-lab border-4 border-slate-200/80 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.9)] overflow-hidden">
        {/* Internal Glow Lights */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className={`w-1 h-1 rounded-full transition-colors duration-1000 ${activationRatio > 0.3 ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,1)]' : 'bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,1)]'}`} />
          <div className="w-1 h-1 rounded-full bg-slate-200 opacity-40" />
        </div>
        
        <div className="scanlines absolute inset-0 pointer-events-none opacity-20" />
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-slate-500 font-mono text-[8px] tracking-[0.4em] mb-1 font-bold">DYAI</span>
          <div className={`w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-3 transition-opacity duration-1000 ${activationRatio > 0.3 ? 'opacity-100' : 'opacity-30'}`} />
          
          {/* Animated Bars - Synchronized with current projects state */}
          <div className="flex items-end gap-1.5 h-10 mb-2">
            {projects.map((project) => {
              const isActive = project.status === 'ACTIVE';
              // Base height on stability if available, else random for visual flair
              const stabilityFactor = project.stability ? project.stability / 100 : 0.5;
              return (
                <div 
                  key={project.id} 
                  className={`w-1.5 rounded-t-sm transition-all duration-1000 ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-300'}`} 
                  style={{ 
                    height: isActive ? `${40 + (stabilityFactor * 60)}%` : `${10 + (stabilityFactor * 20)}%`,
                    animation: isActive ? `pulse ${1 + (1 - stabilityFactor)}s infinite alternate` : 'none',
                    opacity: isActive ? 1 : 0.4
                  }} 
                />
              );
            })}
          </div>
          <div className="flex flex-col items-center">
            <span className={`font-mono text-[7px] animate-pulse transition-colors duration-500 ${activationRatio > 0.6 ? 'text-cyan-600' : activationRatio > 0.3 ? 'text-slate-500' : 'text-amber-600'}`}>
              STATUS: {statusLabel}
            </span>
            <span className="text-[6px] font-mono text-slate-300 tracking-tighter mt-1">LOAD: {(activationRatio * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Laser Engraving Details */}
        <div className="absolute bottom-4 text-[6px] font-mono text-slate-300 opacity-50 tracking-widest uppercase">
          DYAI_ENG_CORE_V.09_METRICS_SYNC
        </div>
      </div>

      {/* Optical Elements */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </div>
  );
};

export default CoreMotif;