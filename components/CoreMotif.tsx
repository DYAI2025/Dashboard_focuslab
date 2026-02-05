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
        className={`absolute w-40 h-40 rounded-full blur-[80px] animate-pulse transition-colors duration-1000 ${activationRatio > 0.3 ? 'bg-cyan-400/10' : 'bg-amber-400/10'}`} 
      />
      
      {/* Outer Rotating Scaffolding */}
      <svg className="absolute inset-0 animate-orbit w-full h-full opacity-60" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(71, 85, 105, 0.4)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="2 10" />
        {/* Mechanical Ticks */}
        {[0, 90, 180, 270].map(deg => (
          <rect key={deg} x="99.5" y="0" width="1" height="6" fill="#475569" transform={`rotate(${deg}, 100, 100)`} />
        ))}
      </svg>

      {/* Middle Dynamic Logic Layer */}
      <svg className="absolute inset-8 animate-orbit-slow w-[84%] h-[84%]" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="8" strokeDasharray="50 30" />
        <circle cx="100" cy="100" r="75" fill="none" stroke={coreGlowColor} strokeWidth="0.5" strokeDasharray="1 5" />
      </svg>

      {/* The Physical Core Unit - Polished Dark Glass Sphere */}
      <div 
        className="w-40 h-40 md:w-60 md:h-60 rounded-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #334155 0%, #1e293b 45%, #020617 100%)',
          boxShadow: `
            inset -10px -10px 25px rgba(0, 0, 0, 0.5), 
            inset 5px 5px 15px rgba(148, 163, 184, 0.2), 
            0 25px 50px -12px rgba(0, 0, 0, 0.5), 
            0 0 0 1px rgba(71, 85, 105, 0.5)
          `
        }}
      >
        {/* Specular Highlight (The Glare) */}
        <div className="absolute top-[12%] left-[12%] w-[45%] h-[25%] bg-gradient-to-br from-white to-transparent rounded-[100%] opacity-20 blur-[3px] pointer-events-none transform -rotate-45" />

        {/* Internal Glow Lights (Diffused inside glass) */}
        <div className="absolute top-10 right-10 opacity-30 blur-md">
           <div className={`w-8 h-8 rounded-full transition-colors duration-1000 ${activationRatio > 0.3 ? 'bg-cyan-400' : 'bg-amber-400'}`} />
        </div>
        
        <div className="scanlines absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay" />
        
        <div className="relative z-10 flex flex-col items-center translate-y-2">
          {/* Deeply Engraved DYAI Text */}
          <span 
            className="font-mono text-3xl md:text-5xl font-black tracking-[0.2em] mb-3 select-none transition-all duration-500"
            style={{
              color: 'rgba(203, 213, 225, 0.8)', // Slate-300 transparent
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 0 rgba(255, 255, 255, 0.05)',
              transform: 'scale(1, 0.95)' // Slight squash for spherical perspective
            }}
          >
            DYAI
          </span>
          
          <div className={`w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent mb-5 transition-opacity duration-1000 ${activationRatio > 0.3 ? 'opacity-100' : 'opacity-30'}`} />
          
          {/* Animated Bars - Synchronized with current projects state */}
          <div className="flex items-end gap-1.5 h-8 mb-3 opacity-80 mix-blend-screen">
            {projects.map((project) => {
              const isActive = project.status === 'ACTIVE';
              // Base height on stability if available, else random for visual flair
              const stabilityFactor = project.stability ? project.stability / 100 : 0.5;
              return (
                <div 
                  key={project.id} 
                  className={`w-1.5 rounded-t-[1px] transition-all duration-1000 ${isActive ? 'bg-cyan-500' : 'bg-slate-600'}`} 
                  style={{ 
                    height: isActive ? `${40 + (stabilityFactor * 60)}%` : `${10 + (stabilityFactor * 20)}%`,
                    animation: isActive ? `pulse ${1 + (1 - stabilityFactor)}s infinite alternate` : 'none',
                  }} 
                />
              );
            })}
          </div>
          <div className="flex flex-col items-center">
            <span className={`font-mono text-[8px] font-bold tracking-widest transition-colors duration-500 ${activationRatio > 0.6 ? 'text-cyan-400' : activationRatio > 0.3 ? 'text-slate-400' : 'text-amber-500'}`} style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
              STATUS: {statusLabel}
            </span>
          </div>
        </div>

        {/* Refractive Edge Detail */}
        <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
        
        {/* Laser Engraving Details - Curvature Corrected */}
        <div className="absolute bottom-6 text-[5px] font-mono text-slate-500 font-bold tracking-[0.3em] uppercase opacity-70" style={{ transform: 'perspective(500px) rotateX(20deg)' }}>
          ENG_CORE_V.09_SYNC
        </div>
      </div>

      {/* Optical Elements */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent" />
      <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
    </div>
  );
};

export default CoreMotif;