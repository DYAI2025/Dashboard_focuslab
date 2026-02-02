
import React, { useState } from 'react';
import { ProjectModule } from '../types';

interface ModuleCardProps {
  project: ProjectModule;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Combined state for both mouse and keyboard interaction
  const isInteractionActive = isHovered || isFocused;

  // High-fidelity mechanical easing: Quintic ease-out
  const techEasing = 'cubic-bezier(0.23, 1, 0.32, 1)';

  // Handle keyboard activation (Enter/Space)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Implementation-specific: e.g., window.location.href = project.detailsUrl;
      console.log(`Navigating to project: ${project.id}`);
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      aria-label={`Project Module: ${project.title}`}
      className={`group relative h-[36rem] overflow-hidden panel-lab transition-all duration-700 cursor-pointer border-r border-b border-slate-200/60 focus:outline-none`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* 1. SCHEMATIC LAYER (Circular & Hexagonal Patterns) */}
      <div 
        className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${
          isInteractionActive ? 'opacity-40 scale-105 rotate-1' : 'opacity-10 scale-100'
        }`}
      >
        <svg className="w-full h-full" viewBox="0 0 400 600">
          <defs>
            <pattern id={`hex-grid-${project.id}`} width="50" height="43.3" patternUnits="userSpaceOnUse">
              <path d="M 12.5 0 L 37.5 0 L 50 21.65 L 37.5 43.3 L 12.5 43.3 L 0 21.65 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-300" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-grid-${project.id})`} />
          
          <g fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400">
            <circle cx="200" cy="220" r="160" strokeDasharray="1 10" className="animate-orbit-slow origin-center" />
            <circle cx="200" cy="220" r="140" strokeDasharray="50 100" className="animate-orbit origin-center opacity-50" />
            <circle cx="200" cy="220" r="130" strokeWidth="0.1" className="text-slate-400" />
            <path d="M 0,220 H 100 L 120,240 V 350" strokeDasharray="4 2" />
            <path d="M 400,180 H 300 L 280,160 V 50" strokeWidth="0.8" />
            <path d="M 30,580 V 450 L 60,420 H 180" />
            <rect x="115" y="235" width="8" height="8" fill="currentColor" opacity="0.3" />
            <rect x="276" y="156" width="8" height="8" fill="currentColor" opacity="0.3" />
          </g>
        </svg>
      </div>

      {/* 2. TEXTURE LAYER */}
      <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="scanlines absolute inset-0 opacity-5 pointer-events-none" />

      {/* 3. HARDWARE GREEBLES */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-400" />
            <div className="w-1 h-1 rounded-full bg-slate-400" />
          </div>
          <span className="text-[6px] font-mono text-slate-400 tracking-[0.3em] uppercase">PLATE_SEC_0{project.id}</span>
        </div>
        
        <div className="absolute top-8 right-5 flex flex-col gap-1.5 items-center">
          <div className={`w-1 h-1 rounded-full ${project.status === 'ACTIVE' ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-slate-300'}`} />
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="w-1 h-1 rounded-full bg-slate-200" />
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <div className="relative z-20 p-10 h-full flex flex-col justify-end">
        
        {/* Title & Description Section - Shifts up to provide space for the tray */}
        <div 
          className="mb-6 transform transition-all" 
          style={{ 
            transitionDuration: '800ms',
            transitionTimingFunction: techEasing,
            transform: isInteractionActive ? 'translateY(-240px)' : 'translateY(0)',
            willChange: 'transform'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono font-bold text-cyan-600 bg-cyan-50/80 px-2 py-0.5 border border-cyan-100/50 shadow-sm backdrop-blur-sm">
              MOD_{project.id}
            </span>
            <div className={`h-[1px] transition-all duration-700 bg-slate-200 ${isInteractionActive ? 'w-24 bg-cyan-400' : 'w-10'}`} />
          </div>
          
          <h3 className="text-4xl font-light tracking-tighter text-slate-900 leading-[0.85] mb-6">
            {project.title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'font-bold block' : 'block'}>{word}</span>
            ))}
          </h3>
          
          <p className={`text-xs text-slate-500 leading-relaxed max-w-[240px] font-light transition-all duration-500 ${isInteractionActive ? 'opacity-0 scale-95 translate-y-4' : 'opacity-80 scale-100 translate-y-0'}`}>
            {project.description}
          </p>
        </div>

        {/* 5. REFINED SLIDING SPEC TRAY */}
        <div 
          className="absolute bottom-0 left-0 w-full glass-panel border-t border-slate-200 p-8 transform transition-all overflow-hidden"
          style={{ 
            height: '66%',
            transitionDuration: '850ms',
            transitionTimingFunction: techEasing,
            transform: isInteractionActive ? 'translateY(0)' : 'translateY(100%)',
            willChange: 'transform'
          }}
        >
          {/* Subtle Accent Line with scanning pulse */}
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent ${isInteractionActive ? 'animate-pulse' : ''}`} />
          
          <div className="flex flex-col h-full">
            {/* Staggered Content 1: Header */}
            <div 
              className={`flex justify-between items-start mb-8 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: isInteractionActive ? '100ms' : '0ms' }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">Deployment_Analysis</span>
                <span className="text-[7px] font-mono text-cyan-500 font-black uppercase tracking-widest">Active_Node_Sync: Established</span>
              </div>
              <div className="flex gap-0.5 mt-1">
                <div className="w-1 h-3 bg-cyan-400" />
                <div className="w-1 h-2 bg-slate-200" />
                <div className="w-1 h-4 bg-cyan-400" />
              </div>
            </div>

            {/* Staggered Content 2: Metrics */}
            <div 
              className={`grid grid-cols-2 gap-8 mb-8 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: isInteractionActive ? '200ms' : '0ms' }}
            >
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-widest">Tags::Core</span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[8px] font-mono text-slate-600 bg-white/90 border border-slate-200 uppercase shadow-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-widest">Metric::Stability</span>
                <div className="relative h-6 w-full flex items-center">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-cyan-500 transition-all duration-[1200ms] ease-out" 
                      style={{ 
                        width: isInteractionActive ? '86%' : '0%',
                        transitionDelay: isInteractionActive ? '1000ms' : '0ms'
                      }} 
                    />
                  </div>
                  <span className="absolute right-0 -top-4 text-[8px] font-mono text-cyan-600 font-bold">86.4%</span>
                </div>
              </div>
            </div>

            {/* Staggered Content 3: Terminal */}
            <div 
              className={`flex-1 border border-slate-200 p-4 bg-slate-50/80 relative overflow-hidden mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: isInteractionActive ? '300ms' : '0ms' }}
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
              <div className="h-full flex flex-col gap-1 font-mono text-[7px] text-slate-400">
                <div className="flex justify-between border-b border-slate-200 pb-1 mb-1">
                  <span className="text-cyan-600 font-bold">LOG_CHANNEL_01</span>
                  <span className="text-[6px]">T_STAMP: 2025.04.12.A</span>
                </div>
                <div className="animate-pulse">>> INITIATING HANDSHAKE... [OK]</div>
                <div>>> BUFFER_SIZE: 1024KB / SYNC: ACTIVE</div>
                <div className="text-cyan-600">>> ENCRYPTION_LAYER: 0xF42A-SECURE</div>
              </div>
            </div>

            {/* Staggered Content 4: Actions */}
            <div 
              className={`flex gap-3 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: isInteractionActive ? '400ms' : '0ms' }}
            >
              <a 
                href={project.repoUrl} 
                tabIndex={isInteractionActive ? 0 : -1}
                className="group/btn relative flex-1 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold text-center tracking-[0.4em] hover:bg-cyan-600 transition-all overflow-hidden flex items-center justify-center gap-2 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                <span className="relative z-10">OPEN_INTERFACE</span>
                <svg className="w-3 h-3 relative z-10 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </a>
              <button 
                tabIndex={isInteractionActive ? 0 : -1}
                className="w-12 h-11 flex items-center justify-center border border-slate-200 hover:bg-white hover:border-cyan-400 transition-all group/sub shadow-sm focus:ring-2 focus:ring-cyan-500"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover/sub:text-cyan-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
          
          {/* Schematic Detail in corner */}
          <div className="absolute bottom-4 right-4 w-16 h-16 pointer-events-none opacity-20">
            <svg viewBox="0 0 100 100">
              <path d="M 0,100 H 100 V 0" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="85" cy="15" r="3" fill="currentColor" />
              <path d="M 85,15 V 40" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative Hardware Serial Plate */}
      <div className="absolute -rotate-90 origin-bottom-right bottom-24 -right-4 text-[7px] font-mono text-slate-300 opacity-30 uppercase tracking-[1.4em] z-10 pointer-events-none">
        LAB_ASSET_{project.id}_UNIT_G-492
      </div>
      
      {/* 6. INTERACTION LIGHTING EFFECT (INTENSIFYING CYAN GLOW & FOCUS RING) */}
      <div 
        className={`absolute inset-0 pointer-events-none border-2 transition-all duration-700 ${
          isInteractionActive 
            ? 'border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.3),inset_0_0_35px_rgba(34,211,238,0.15)]' 
            : 'border-transparent shadow-none'
        } ${isFocused ? 'ring-inset ring-4 ring-cyan-400/20' : ''}`} 
      />
    </div>
  );
};

export default ModuleCard;
