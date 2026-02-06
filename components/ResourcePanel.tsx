import React from 'react';
import { SystemResources } from '../types';

interface ResourcePanelProps {
  resources: SystemResources;
}

function barColor(percent: number): string {
  if (percent >= 90) return 'from-red-500 to-red-400';
  if (percent >= 70) return 'from-amber-500 to-amber-400';
  return 'from-emerald-500 to-emerald-400';
}

function barGlow(percent: number): string {
  if (percent >= 90) return 'shadow-[0_0_12px_rgba(239,68,68,0.3)]';
  if (percent >= 70) return 'shadow-[0_0_12px_rgba(245,158,11,0.3)]';
  return 'shadow-[0_0_12px_rgba(52,211,153,0.3)]';
}

function statusLabel(percent: number): string {
  if (percent >= 90) return 'CRITICAL';
  if (percent >= 70) return 'WARNING';
  return 'NOMINAL';
}

function statusColor(percent: number): string {
  if (percent >= 90) return 'text-red-400';
  if (percent >= 70) return 'text-amber-400';
  return 'text-emerald-400';
}

const ResourcePanel: React.FC<ResourcePanelProps> = ({ resources }) => {
  const { ram, disk, load, uptime } = resources;
  const cpuCount = 4; // fallback
  const loadPercent = Math.min(Math.round((load.avg1 / cpuCount) * 100), 100);

  const cards = [
    {
      label: 'MEMORY',
      value: `${ram.used} / ${ram.total} MB`,
      percent: ram.percent,
      sub: `${ram.available} MB available`,
    },
    {
      label: 'DISK',
      value: `${disk.used} / ${disk.total}`,
      percent: disk.percent,
      sub: `${disk.available} available`,
    },
    {
      label: 'CPU_LOAD',
      value: `${load.avg1.toFixed(2)} / ${load.avg5.toFixed(2)} / ${load.avg15.toFixed(2)}`,
      percent: loadPercent,
      sub: '1m / 5m / 15m averages',
    },
    {
      label: 'UPTIME',
      value: uptime || '—',
      percent: null,
      sub: 'System running time',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="group panel-lab relative overflow-hidden transition-all duration-300 hover:border-cyan-400/40">
          {/* Scanline */}
          <div className="scanlines absolute inset-0 pointer-events-none opacity-[0.03]" />

          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-mono text-cyan-500/70 font-bold tracking-[0.3em] uppercase">
                {card.label}
              </span>
              {card.percent !== null && (
                <span className={`text-[9px] font-mono font-bold tracking-wider ${statusColor(card.percent)}`}>
                  {statusLabel(card.percent)}
                </span>
              )}
            </div>

            {/* Value */}
            <div className="text-xl font-bold text-slate-100 font-mono mb-2 tracking-tight">
              {card.value}
            </div>

            {/* Sub info */}
            <div className="text-[9px] font-mono text-slate-600 mb-4 uppercase tracking-wider">
              {card.sub}
            </div>

            {/* Progress Bar */}
            {card.percent !== null && (
              <div className="relative">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${barColor(card.percent)} ${barGlow(card.percent)} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${card.percent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[8px] font-mono text-slate-700">0%</span>
                  <span className={`text-[10px] font-mono font-bold ${statusColor(card.percent)}`}>
                    {card.percent}%
                  </span>
                  <span className="text-[8px] font-mono text-slate-700">100%</span>
                </div>
              </div>
            )}

            {/* Uptime: no bar, just a large display */}
            {card.percent === null && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-mono text-cyan-500/70 uppercase tracking-wider">Active</span>
              </div>
            )}
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-600/30 group-hover:border-amber-400/40 transition-colors" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-600/30 group-hover:border-amber-400/40 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export default ResourcePanel;
