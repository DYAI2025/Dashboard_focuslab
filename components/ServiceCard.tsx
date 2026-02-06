import React, { useState } from 'react';
import { ServiceCheck } from '../types';
import { SERVICE_TAGS } from '../constants';

interface ServiceCardProps {
  service: ServiceCheck;
}

const STATUS_CONFIG = {
  up: {
    badge: 'ONLINE',
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-[0_0_20px_rgba(52,211,153,0.1)]',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    bgHover: 'hover:border-emerald-400/60',
  },
  down: {
    badge: 'OFFLINE',
    borderColor: 'border-red-500/40',
    glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    dotColor: 'bg-red-400',
    textColor: 'text-red-400',
    bgHover: 'hover:border-red-400/60',
  },
  degraded: {
    badge: 'DEGRADED',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-400',
    bgHover: 'hover:border-amber-400/60',
  },
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = STATUS_CONFIG[service.status];
  const tags = SERVICE_TAGS[service.name] || [];

  return (
    <div
      className={`group relative overflow-hidden panel-lab transition-all duration-500 ${config.borderColor} ${config.bgHover} ${config.glowColor}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scanline overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none opacity-[0.03]" />

      {/* Top edge accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${
        service.status === 'up' ? 'bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent' :
        service.status === 'down' ? 'bg-gradient-to-r from-transparent via-red-400/60 to-transparent' :
        'bg-gradient-to-r from-transparent via-amber-400/60 to-transparent'
      }`} />

      <div className="relative z-10 p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Status Dot with Pulse */}
            <div className="relative flex items-center justify-center w-3 h-3">
              <div className={`absolute inset-0 rounded-full ${config.dotColor} ${
                service.status === 'up' ? 'animate-ping opacity-30' : ''
              }`} />
              <div className={`relative w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
            </div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">{service.name}</h3>
          </div>
          {service.port && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 px-2 py-0.5 border border-slate-700/50">
              :{service.port}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-mono font-bold tracking-[0.3em] uppercase ${config.textColor}`}>
            {config.badge}
          </span>
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[9px] font-mono text-slate-600">{service.detail}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-[8px] font-mono text-cyan-500/70 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Diagnostic Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-4">
            {/* Signal Strength Bars */}
            <div className="flex items-end gap-0.5 h-3">
              {[1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-1 transition-all duration-300 ${
                    service.status === 'up' && level <= 4 ? 'bg-emerald-500/70' :
                    service.status === 'degraded' && level <= 2 ? 'bg-amber-500/70' :
                    service.status === 'down' ? 'bg-red-500/20' :
                    'bg-slate-700/40'
                  }`}
                  style={{ height: `${level * 25}%` }}
                />
              ))}
            </div>
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">
              {service.status === 'up' ? 'SIG_STRONG' : service.status === 'degraded' ? 'SIG_WEAK' : 'NO_SIGNAL'}
            </span>
          </div>

          {/* Module ID */}
          <span className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.4em]">
            NODE_{service.name.replace(/\s+/g, '_').substring(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Hover reveal: extra diagnostic info */}
      <div className={`absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700/40 px-6 py-3 transform transition-all duration-300 ${
        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
          <span>ENDPOINT: {service.port ? `localhost:${service.port}` : 'N/A'}</span>
          <span>CHECK: HTTP_PROBE</span>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-600/30 group-hover:border-amber-400/40 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-600/30 group-hover:border-amber-400/40 transition-colors duration-500" />
    </div>
  );
};

export default ServiceCard;
