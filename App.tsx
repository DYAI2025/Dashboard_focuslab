
import React from 'react';
import HUDOverlay from './components/HUDOverlay';
import CoreMotif from './components/CoreMotif';
import ModuleCard from './components/ModuleCard';
import LabButton from './components/LabButton';
import { PROJECTS, PRINCIPLES, PHILOSOPHIE_TEXT } from './constants';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen selection:bg-cyan-100 selection:text-cyan-900 overflow-hidden">
      <HUDOverlay />
      
      {/* Global Lens Flares */}
      <div className="lens-flare top-[-100px] left-[-100px]" />
      <div className="lens-flare bottom-[-100px] right-[-100px] opacity-20" style={{ animationDelay: '-5s' }} />

      {/* Header with detailed controls & "Shelter Doors" Animation */}
      <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-slate-200/60 shadow-sm group">
        {/* SHUTTER L */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-white/95 border-r border-slate-200 transform group-hover:-translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-none z-10 flex items-center justify-end pr-10">
          <div className="flex flex-col items-end opacity-20">
             <span className="text-[8px] font-mono font-bold tracking-[0.4em] uppercase">HATCH_01_L</span>
             <div className="w-12 h-px bg-slate-300 mt-1" />
          </div>
        </div>
        {/* SHUTTER R */}
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
                <span className="text-2xl font-bold tracking-[0.25em] text-slate-900 group-hover/logo:text-cyan-600 transition-colors">DYAI</span>
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
                  <span className="absolute -top-1 -right-2 text-[6px] opacity-0 group-hover/link:opacity-40 group-focus-visible/link:opacity-40 transition-opacity">0{item.length}</span>
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
        {/* Hero Section: Chamber Interaction */}
        <section className="min-h-screen flex flex-col items-center justify-center px-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
          
          <CoreMotif />
          
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
          
          {/* Detailed Side Scroll Indicator */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
            <span className="text-[8px] font-mono text-slate-300 vertical-text rotate-90 tracking-widest uppercase">Navigation_Vertical</span>
            <div className="w-px h-32 bg-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-cyan-400 animate-[scanline_4s_linear_infinite]" />
            </div>
          </div>
        </section>

        {/* Section Splitter with Joint Lines */}
        <div className="relative h-24 overflow-hidden border-y border-slate-200/60 bg-slate-50">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]" />
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8 text-[9px] font-mono text-slate-400 tracking-[1em] uppercase">
            <span>DYAI_LAB_001</span>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full border border-slate-300" />
              <div className="w-2 h-2 rounded-full border border-slate-300" />
              <div className="w-2 h-2 rounded-full border border-slate-300" />
            </div>
            <span>SECTOR_BRAVO</span>
          </div>
        </div>

        {/* Philosophie: Lab Manifesto */}
        <section id="philosophie" className="py-40 px-8 relative bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-5 relative">
              <div className="absolute -left-12 top-0 text-[120px] font-bold text-slate-50 select-none pointer-events-none -z-10">01</div>
              <span className="text-[11px] font-mono text-cyan-600 font-black tracking-[0.4em] uppercase block mb-6">CORE_IDEOLOGY</span>
              <h2 className="text-5xl font-bold text-slate-900 mb-10 tracking-tighter leading-tight">
                Engineering <br /> Conscious <br /> Clarity.
              </h2>
              <div className="prose prose-slate prose-lg">
                <p className="text-slate-500 font-light leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-cyan-500 first-letter:mr-3 first-letter:float-left">
                  {PHILOSOPHIE_TEXT}
                </p>
              </div>
              <div className="mt-12">
                <LabButton label="DOWNLOAD_WHITEPAPER" variant="cyan" />
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRINCIPLES.map((principle, idx) => (
                <div 
                  key={principle.id} 
                  className={`panel-lab p-10 group hover:border-cyan-400 transition-all duration-500 ${idx === 2 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 rounded-sm glass-panel border border-slate-200 flex items-center justify-center text-cyan-600 font-mono text-xs font-bold shadow-lg">
                      0{principle.id}
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-cyan-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-cyan-400 delay-75" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight uppercase">{principle.label}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projekte: Active Modules Grid */}
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
              {PROJECTS.map(project => (
                <ModuleCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Lab Footer */}
        <footer id="kontakt" className="pt-32 pb-12 px-8 bg-white border-t border-slate-200 relative">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="col-span-1">
              <div className="text-3xl font-black tracking-tighter text-slate-900 mb-8">DYAI_LAB</div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed uppercase tracking-widest max-w-xs">
                Orbital Habitat Station Gamma-4 <br />
                Coordinates: 14.28.31.09 <br />
                Public Frequency: 1.2 THz <br />
                Status: TRANSMITTING
              </p>
              <div className="flex gap-4 mt-10">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-sm glass-panel border border-slate-200 hover:border-cyan-400 transition-colors flex items-center justify-center cursor-pointer" />)}
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <span className="text-[10px] font-mono font-bold text-slate-900 tracking-widest uppercase block mb-4">Operations</span>
                <ul className="space-y-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-cyan-600 transition-colors">Neural Sync</a></li>
                  <li><a href="#" className="hover:text-cyan-600 transition-colors">Core Logic</a></li>
                  <li><a href="#" className="hover:text-cyan-600 transition-colors">Bio Bridge</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <span className="text-[10px] font-mono font-bold text-slate-900 tracking-widest uppercase block mb-4">Security</span>
                <ul className="space-y-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-cyan-600 transition-colors">Ethical AI</a></li>
                  <li><a href="#" className="hover:text-cyan-600 transition-colors">Data Privacy</a></li>
                  <li><a href="#" className="hover:text-cyan-600 transition-colors">Audit Logs</a></li>
                </ul>
              </div>
              <div className="space-y-6 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono font-bold text-slate-900 tracking-widest uppercase block mb-4">Signal Hub</span>
                <div className="panel-lab p-4 bg-slate-50">
                  <span className="text-[8px] font-mono text-slate-400 uppercase mb-2 block">Connect Protocol</span>
                  <a href="mailto:sysop@dyai.lab" className="text-xs font-bold text-cyan-600 hover:underline">SYSOP@DYAI.LAB</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-[1400px] mx-auto mt-32 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-[8px] font-mono text-slate-300 uppercase tracking-[0.5em]">
              <span>© 2025_DYAI_INDUSTRIES</span>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <span>ALL_RIGHTS_PROTECTED</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-px bg-slate-100" />
              <span className="text-[8px] font-mono text-slate-400 animate-pulse">ENCRYPTION: ACTIVE</span>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,1)]" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
