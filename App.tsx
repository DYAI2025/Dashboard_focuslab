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

  const handleAddModule = () => {
    // Constraint: Max 50 cards
    if (projects.length >= 50) return;

    // Generate a robust ID
    const maxId = projects.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
    const newId = (maxId + 1).toString().padStart(2, '0');

    const newModule: ProjectModule = {
      id: newId,
      title: '', // Empty title acts as the "empty card" signal
      description: '',
      status: 'ACTIVE',
      tags: [],
      imageUrl: '',
      repoUrl: '#',
      detailsUrl: '#',
      stability: 100,
      logChannel: 'WAITING_FOR_INPUT'
    };

    setProjects(prev => [...prev, newModule]);
  };

  // Logic: "always when there is no empty card left"
  // We define an empty card as one with no title.
  const hasEmptyCard = projects.some(p => !p.title || p.title.trim() === '');
  const showAddButton = projects.length < 50 && !hasEmptyCard;

  return (
    <div className="relative min-h-screen selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden bg-slate-950 text-slate-300">
      <HUDOverlay />
      
      {/* Global Lens Flares */}
      <div className="lens-flare top-[-100px] left-[-100px]" />
      <div className="lens-flare bottom-[-100px] right-[-100px] opacity-20" style={{ animationDelay: '-5s' }} />

      {/* Header with detailed controls & "Shelter Doors" Animation */}
      <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-cyan-500/20 shadow-sm group">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-slate-950 border-r border-cyan-500/20 transform group-hover:-translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-none z-10 flex items-center justify-end pr-10">
          <div className="flex flex-col items-end opacity-40">
             <span className="text-[8px] font-mono font-bold tracking-[0.4em] uppercase text-cyan-500">HATCH_01_L</span>
             <div className="w-12 h-px bg-cyan-900 mt-1" />
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-slate-950 border-l border-cyan-500/20 transform group-hover:translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-none z-10 flex items-center justify-start pl-10">
          <div className="flex flex-col items-start opacity-40">
             <span className="text-[8px] font-mono font-bold tracking-[0.4em] uppercase text-cyan-500">HATCH_01_R</span>
             <div className="w-12 h-px bg-cyan-900 mt-1" />
          </div>
        </div>

        <nav className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between relative z-0">
          <div className="flex items-center gap-12">
            <div className="relative group/logo cursor-pointer">
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-[0.25em] text-slate-100 group-hover/logo:text-amber-400 transition-colors group-hover/logo:animate-[glitch-text_0.4s_infinite]">DYAI</span>
                <span className="text-[8px] font-mono text-cyan-600 font-bold -mt-1 tracking-[0.4em] uppercase">SYSTEMS_DIVISION</span>
              </div>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-full group-hover/logo:h-8 transition-all shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>
            
            <div className="hidden lg:flex gap-10">
              {['Philosophie', 'Projekte', 'Operations'].map(item => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="group/link relative text-[10px] font-mono font-bold text-slate-400 hover:text-amber-400 focus-visible:text-amber-400 hover:brightness-125 focus-visible:brightness-125 transition-all uppercase tracking-[0.3em] py-2 px-1 focus-visible:outline-none focus-visible:bg-slate-800 rounded-sm"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover/link:w-full group-focus-visible/link:w-full transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[8px] font-mono text-slate-500">UPTIME::99.99%</span>
              <div className="flex gap-1 mt-0.5">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-0.5 bg-emerald-500/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
            <LabButton label="INIT_UPLINK" variant="cyan" active />
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-20">
        <section className="min-h-screen flex flex-col items-center justify-center px-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
          
          <CoreMotif projects={projects} />
          
          <div className="mt-16 text-center max-w-5xl relative z-10">
            <div className="inline-block glass-panel px-4 py-1 mb-8 border border-cyan-500/30">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-[0.5em] uppercase animate-pulse">
                STATUS: SYNC_ESTABLISHED
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-slate-200 leading-[0.9] mb-10">
              Augmented <br />
              {/* Golden Orange Effect */}
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-500 to-amber-200 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">Intelligence</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-4">
              <LabButton label="START_SIMULATION" active />
              <LabButton label="VIEW_ARCHIVES" variant="default" />
            </div>
          </div>
        </section>

        <section id="projekte" className="py-40 px-8 bg-[#020617] relative border-t border-slate-800">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="relative">
                <span className="text-[11px] font-mono text-amber-500 font-black tracking-[0.4em] uppercase block mb-4">COLLECTION_NODES</span>
                <h2 className="text-6xl font-bold text-slate-100 tracking-tighter">Lab Modules</h2>
              </div>
              <div className="flex items-center gap-8 glass-panel px-6 py-4 border border-cyan-500/20">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Archive_Size</span>
                  <span className="text-xl font-bold text-slate-300">1.4 TB</span>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Encryption</span>
                  <span className="text-xl font-bold text-cyan-500">AES-256</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <ModuleCard key={project.id} project={project} onUpdate={handleUpdateProject} />
              ))}
              
              {showAddButton && (
                <button 
                  onClick={handleAddModule}
                  aria-label="Initialize New Module Node"
                  className="group relative h-[36rem] overflow-hidden panel-lab transition-all duration-500 hover:bg-slate-900 border-2 border-dashed border-slate-700 hover:border-amber-400 flex flex-col items-center justify-center gap-6 opacity-60 hover:opacity-100 hover:scale-[1.01] focus:opacity-100 outline-none focus:ring-2 focus:ring-amber-400"
                >
                   {/* Background Schematic for Empty Slot */}
                   <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                     <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-amber-500/50" />
                     </svg>
                   </div>
                   
                   <div className="relative z-10 w-20 h-20 rounded-full border border-slate-700 group-hover:border-amber-400 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-90">
                      <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 rounded-full transition-colors duration-500" />
                      <svg className="w-8 h-8 text-slate-600 group-hover:text-amber-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                   </div>
                   
                   <div className="flex flex-col items-center gap-2">
                     <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-amber-500 tracking-[0.3em] uppercase transition-colors">
                       Initialize_Node
                     </span>
                     <span className="text-[8px] font-mono text-slate-600 group-hover:text-amber-400/70 tracking-widest uppercase">
                       Slot_Available
                     </span>
                   </div>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;