import React, { useState, useEffect, useCallback } from 'react';
import HUDOverlay from './components/HUDOverlay';
import CoreMotif from './components/CoreMotif';
import ServiceCard from './components/ServiceCard';
import ResourcePanel from './components/ResourcePanel';
import LabButton from './components/LabButton';
import { SYSTEM_LABEL, DIVISION_LABEL, HERO_TITLE_1, HERO_TITLE_2, NAV_ITEMS } from './constants';
import { NexusStatus } from './types';

const REFRESH_INTERVAL = 30_000;

const App: React.FC = () => {
  const [status, setStatus] = useState<NexusStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: NexusStatus = await res.json();
      setStatus(data);
      setError(null);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  const upCount = status?.services.filter(s => s.status === 'up').length ?? 0;
  const downCount = status?.services.filter(s => s.status === 'down').length ?? 0;
  const degradedCount = status?.services.filter(s => s.status === 'degraded').length ?? 0;
  const totalCount = status?.services.length ?? 0;
  const healthRatio = totalCount > 0 ? upCount / totalCount : 0;

  return (
    <div className="relative min-h-screen selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden bg-slate-950 text-slate-300">
      <HUDOverlay uptime={status?.resources.uptime} />

      {/* Global Lens Flares */}
      <div className="lens-flare top-[-100px] left-[-100px]" />
      <div className="lens-flare bottom-[-100px] right-[-100px] opacity-20" style={{ animationDelay: '-5s' }} />

      {/* Header with Shelter Doors */}
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
                <span className="text-2xl font-bold tracking-[0.25em] text-slate-100 group-hover/logo:text-amber-400 transition-colors group-hover/logo:animate-[glitch-text_0.4s_infinite]">{SYSTEM_LABEL}</span>
                <span className="text-[8px] font-mono text-cyan-600 font-bold -mt-1 tracking-[0.4em] uppercase">{DIVISION_LABEL}</span>
              </div>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-full group-hover/logo:h-8 transition-all shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>

            <div className="hidden lg:flex gap-10">
              {NAV_ITEMS.map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="group/link relative text-[10px] font-mono font-bold text-slate-400 hover:text-amber-400 transition-all uppercase tracking-[0.3em] py-2 px-1"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover/link:w-full transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Status Summary */}
            <div className="hidden xl:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-slate-500">
                  SERVICES::{upCount}/{totalCount}
                </span>
                <div className="flex gap-1 mt-0.5">
                  {status?.services.map((s, i) => (
                    <div
                      key={i}
                      className={`w-2 h-0.5 ${
                        s.status === 'up' ? 'bg-emerald-500/80' :
                        s.status === 'degraded' ? 'bg-amber-500/80' : 'bg-red-500/80'
                      } ${s.status === 'up' ? 'animate-pulse' : ''}`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <LabButton
              label={loading ? 'SCANNING' : error ? 'OFFLINE' : 'LIVE'}
              variant={error ? 'alert' : 'cyan'}
              active={!error && !loading}
              onClick={fetchStatus}
            />
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-20">
        {/* Hero Section with CoreMotif */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

          <CoreMotif services={status?.services ?? []} healthRatio={healthRatio} />

          <div className="mt-16 text-center max-w-5xl relative z-10">
            <div className="inline-block glass-panel px-4 py-1 mb-8 border border-cyan-500/30">
              <span className={`text-[10px] font-mono font-bold tracking-[0.5em] uppercase ${
                error ? 'text-red-400' : healthRatio >= 0.7 ? 'text-cyan-400 animate-pulse' : 'text-amber-400'
              }`}>
                {error ? 'STATUS: CONNECTION_LOST' :
                 healthRatio >= 0.7 ? 'STATUS: SYSTEMS_NOMINAL' :
                 healthRatio >= 0.4 ? 'STATUS: PARTIAL_DEGRADATION' : 'STATUS: CRITICAL_ALERT'}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-slate-200 leading-[0.9] mb-10">
              {HERO_TITLE_1} <br />
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-500 to-amber-200 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">{HERO_TITLE_2}</span>
            </h1>

            {/* Summary Counters */}
            <div className="flex items-center justify-center gap-12 mt-8">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-emerald-400 font-mono">{upCount}</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-1">Online</span>
              </div>
              <div className="w-px h-12 bg-slate-800" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-red-400 font-mono">{downCount}</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-1">Offline</span>
              </div>
              <div className="w-px h-12 bg-slate-800" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-amber-400 font-mono">{degradedCount}</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-1">Degraded</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 px-8 bg-[#020617] relative border-t border-slate-800">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="relative">
                <span className="text-[11px] font-mono text-amber-500 font-black tracking-[0.4em] uppercase block mb-4">SERVICE_NODES</span>
                <h2 className="text-5xl font-bold text-slate-100 tracking-tighter">Live Modules</h2>
              </div>
              <div className="flex items-center gap-8 glass-panel px-6 py-4 border border-cyan-500/20">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Monitored</span>
                  <span className="text-xl font-bold text-slate-300">{totalCount} Services</span>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Refresh</span>
                  <span className="text-xl font-bold text-cyan-500">30s</span>
                </div>
                {lastRefresh && (
                  <>
                    <div className="w-px h-10 bg-slate-800" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Last_Check</span>
                      <span className="text-xl font-bold text-slate-300">
                        {lastRefresh.toLocaleTimeString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-8 glass-panel border border-red-500/30 px-6 py-4 text-red-400 font-mono text-sm">
                FETCH_ERROR: {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {status?.services.map(service => (
                <ServiceCard key={service.name} service={service} />
              ))}
              {loading && !status && Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 panel-lab animate-pulse opacity-30" />
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-32 px-8 bg-slate-950 relative border-t border-slate-800">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-16">
              <span className="text-[11px] font-mono text-amber-500 font-black tracking-[0.4em] uppercase block mb-4">SYSTEM_TELEMETRY</span>
              <h2 className="text-5xl font-bold text-slate-100 tracking-tighter">Resources</h2>
            </div>
            {status && <ResourcePanel resources={status.resources} />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
