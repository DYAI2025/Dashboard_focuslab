
import React, { useState } from 'react';
import HUDOverlay from './components/HUDOverlay';
import CoreMotif from './components/CoreMotif';
import ModuleCard from './components/ModuleCard';
import LabButton from './components/LabButton';
import { PROJECTS_DATA, PRINCIPLES, PHILOSOPHIE_TEXT } from './constants';
import { ProjectModule } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectModule[]>(PROJECTS_DATA);

  const handleUpdateProject = (updated: ProjectModule) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div className="relative min-h-screen selection:bg-cyan-100 selection:text-cyan-900 overflow-hidden">
      <HUDOverlay />
      
      {/* Global Lens Flares */}
      <div className="lens-flare top-[-100px] left-[-100px]" />
      <div className="lens-flare bottom-[-100px] right-[-100px] opacity-20" style={{ animationDelay: '-5s' }} />

      {/* Header with detailed controls & "Shelter Doors" Animation */}
      <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-slate-200/60 shadow-sm group">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-white/95 border-r border-slate-200 transform group-hover:-translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-none z-10 flex items-center justify-end pr-10">
          <div className="flex flex-col items-end opacity-20">
             <span className="text-[8px] font-mono font-bold tracking-[0.4em] uppercase">HATCH_01_L</span>
             <div className="w-12 h-px bg-slate-300 mt-1" />
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-white/95 border-l border-slate-200 transform group-hover:translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-none z-10 flex items-center justify-start pl-10">
          <div className="flex flex-col items-start opacity-20">
             <span className="text-[8px] font-mono font-bold tracking-[0.4em] uppercase">HATCH_01_R</span>
             <div className="w-12 h-px bg-slate-300 mt-1" />
          </div>
        </div>

        <nav className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between relative z-0">
          <div className="flex items-center gap-12">
            <div className="relative group/logo cursor-pointer">
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-[0.25em] text-slate-900 group-hover/logo:text-cyan-600 transition-colors group-hover/logo:animate-[glitch-text_0.4s_infinite]">DYAI</span>
                <span className="text-[8px] font-mono text-cyan-600/60 font-bold -mt-1 tracking-[0.4em] uppercase">SYSTEMS_DIVISION</span>
              </div>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-full group-hover/logo:h-8 transition-all" />
            </div>
            
            <div className="hidden lg:flex gap-10">
              {['Philosophie', 'Projekte', 'Operations'].map(item => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="group/link relative text-[10px] font-mono font-bold text-slate-500 hover:text-cyan-500 focus-visible:text-cyan-500 hover:brightness-125 focus-visible:brightness-125 transition-all uppercase tracking-[0.3em] py-2 px-1 focus-visible:outline-none focus-visible:bg-cyan-50/50 rounded-sm"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover/link:w-full group-focus-visible/link:w-full transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[8px] font-mono text-slate-400">UPTIME::99.99%</span>
              <div className="flex gap-1 mt-0.5">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-0.5 bg-green-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
            <LabButton label="INIT_UPLINK" variant="cyan" active />
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-20">
        <section className="min-h-screen flex flex-col items-center justify-center px-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
          
          <CoreMotif projects={projects} />
          
          <div className="mt-16 text-center max-w-5xl relative z-10">
            <div className="inline-block glass-panel px-4 py-1 mb-8 border border-slate-200">
              <span className="text-[10px] font-mono text-cyan-600 font-bold tracking-[0.5em] uppercase animate-pulse">
                STATUS: SYNC_ESTABLISHED
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-slate-900 leading-[0.9] mb-10">
              Augmented <br />
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-cyan-600 to-slate-900">Intelligence</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-4">
              <LabButton label="START_SIMULATION" active />
              <LabButton label="VIEW_ARCHIVES" variant="default" />
            </div>
          </div>
        </section>

        <section id="projekte" className="py-40 px-8 bg-slate-50 relative border-t border-slate-200">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="relative">
                <span className="text-[11px] font-mono text-cyan-600 font-black tracking-[0.4em] uppercase block mb-4">COLLECTION_NODES</span>
                <h2 className="text-6xl font-bold text-slate-900 tracking-tighter">Lab Modules</h2>
              </div>
              <div className="flex items-center gap-8 glass-panel px-6 py-4 border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Archive_Size</span>
                  <span className="text-xl font-bold text-slate-800">1.4 TB</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Encryption</span>
                  <span className="text-xl font-bold text-cyan-600">AES-256</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <ModuleCard key={project.id} project={project} onUpdate={handleUpdateProject} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
