import React, { useState, useEffect } from 'react';
import { ProjectModule } from '../types';

interface ModuleCardProps {
  project: ProjectModule;
  onUpdate: (updated: ProjectModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ project, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProjectModule>(project);

  // Sync state with props when not editing to prevent stale data
  useEffect(() => {
    if (!isEditing) {
      setFormData(project);
    }
  }, [project, isEditing]);

  const isInteractionActive = isHovered || isFocused || isEditing;
  const techEasing = 'cubic-bezier(0.23, 1, 0.32, 1)';

  const handleEditToggle = () => {
    setFormData({ ...project });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...project });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsHovered(!isHovered);
    }
  };

  return (
    <div 
      role="region"
      aria-label={`Project Module: ${formData.title}`}
      className={`group relative h-[36rem] overflow-hidden panel-lab transition-all duration-700 border-r border-b border-slate-200/60 focus-within:ring-2 focus-within:ring-cyan-400/30`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isEditing && setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* 1. SCHEMATIC LAYER (HUD Overlay inside card) */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${isInteractionActive ? 'opacity-40 scale-105 rotate-1' : 'opacity-10 scale-100'}`}>
        <svg className="w-full h-full" viewBox="0 0 400 600">
          <defs>
            <pattern id={`hex-grid-${project.id}`} width="50" height="43.3" patternUnits="userSpaceOnUse">
              <path d="M 12.5 0 L 37.5 0 L 50 21.65 L 37.5 43.3 L 12.5 43.3 L 0 21.65 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-300" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-grid-${project.id})`} />
          <g fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400">
            <circle cx="200" cy="220" r="160" strokeDasharray="1 10" className="animate-orbit-slow origin-center" />
            <circle cx="200" cy="220" r="180" strokeDasharray="4 20" className="animate-orbit origin-center" />
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="scanlines absolute inset-0 opacity-5 pointer-events-none" />

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-20 p-10 h-full flex flex-col justify-end">
        <div 
          className="mb-6 transform transition-all" 
          style={{ 
            transitionDuration: '800ms',
            transitionTimingFunction: techEasing,
            transform: isInteractionActive ? 'translateY(-240px)' : 'translateY(0)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-cyan-600 bg-cyan-50/80 px-2 py-0.5 border border-cyan-100/50 shadow-sm backdrop-blur-sm uppercase">MOD_{formData.id}</span>
              <div className={`h-[1px] transition-all duration-700 bg-slate-200 ${isInteractionActive ? 'w-24 bg-cyan-400' : 'w-10'}`} />
            </div>
            
            {!isEditing && (
              <button 
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-3 py-1 glass-panel border border-slate-200 text-[8px] font-mono font-bold text-slate-500 hover:text-cyan-600 hover:border-cyan-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                EDIT_MODE
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute -top-2 left-2 px-1 bg-white text-[7px] font-mono text-cyan-600 font-bold tracking-[0.2em] z-10">MOD_TITLE_ENTRY</span>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-2xl font-bold tracking-tighter text-slate-900 bg-white/80 border border-slate-200 px-3 py-3 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="Module Title"
                />
              </div>
              
              <div className="relative">
                <span className="absolute -top-2 left-2 px-1 bg-white text-[7px] font-mono text-cyan-600 font-bold tracking-[0.2em] z-10">DESCRIPTION_STREAM</span>
                <div className="flex bg-white/90 border border-slate-200 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-400/10 transition-all shadow-sm overflow-hidden group/textarea">
                  {/* Pseudo Line Numbers with interactive state */}
                  <div className="w-10 bg-slate-50 border-r border-slate-100 flex flex-col items-center pt-3 gap-1 select-none pointer-events-none group-focus-within/textarea:bg-cyan-50/30 transition-colors duration-300">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="text-[7px] font-mono text-slate-300 group-focus-within/textarea:text-cyan-400/70 transition-colors">0{n}</span>
                    ))}
                  </div>
                  
                  <div className="relative flex-1">
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full text-[11px] font-mono text-slate-600 bg-transparent px-3 py-3 outline-none resize-none h-32 leading-relaxed block placeholder:text-slate-300"
                      placeholder="Enter technical specifications..."
                    />
                    {/* Background Grid for Textarea */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#94a3b8_0.5px,transparent_0.5px)] [background-size:10px_10px]" />
                  </div>
                </div>
                
                {/* Character Parity Monitor */}
                <div className="mt-1 flex justify-between px-2">
                  <span className="text-[6px] font-mono text-slate-400 uppercase tracking-widest">Parity_Check: OK</span>
                  <span className="text-[6px] font-mono text-cyan-600 font-bold uppercase tracking-widest">Length: {formData.description.length} / 512_OCTETS</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-4xl font-light tracking-tighter text-slate-900 leading-[0.85] mb-6">
                {formData.title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'font-bold block' : 'block'}>{word}</span>
                ))}
              </h3>
              <p className={`text-xs text-slate-500 leading-relaxed max-w-[240px] font-light transition-all duration-500 ${isInteractionActive ? 'opacity-0 scale-95 translate-y-4' : 'opacity-80 scale-100 translate-y-0'}`}>
                {formData.description}
              </p>
            </>
          )}
        </div>

        {/* 3. REFINED SLIDING SPEC TRAY */}
        <div 
          className="absolute bottom-0 left-0 w-full glass-panel border-t border-slate-200 p-8 transform transition-all overflow-hidden"
          style={{ 
            height: '74%',
            transitionDuration: '850ms',
            transitionTimingFunction: techEasing,
            transform: isInteractionActive ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent ${isInteractionActive ? 'animate-pulse' : ''}`} />
          
          <div className="flex flex-col h-full">
            <div className={`grid grid-cols-2 gap-4 mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">Deployment_Analysis</span>
                {isEditing ? (
                  <div className="relative mt-1">
                    <span className="absolute -top-1.5 left-1 px-1 bg-white text-[5px] font-mono text-slate-400 font-bold z-10 uppercase">CHANNEL_ID</span>
                    <input 
                      value={formData.logChannel}
                      onChange={e => setFormData({ ...formData, logChannel: e.target.value })}
                      className="w-full text-[10px] font-mono text-cyan-600 bg-white border border-slate-200 px-2 py-1 outline-none focus:border-cyan-400 placeholder:text-slate-300"
                      placeholder="LOG_CHANNEL_01"
                    />
                  </div>
                ) : (
                  <span className="text-[7px] font-mono text-cyan-500 font-black uppercase tracking-widest">Active_Node_Sync: {formData.logChannel || 'Established'}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">Lifecycle_Protocol</span>
                {isEditing ? (
                  <div className="relative mt-1">
                    <span className="absolute -top-1.5 left-1 px-1 bg-white text-[5px] font-mono text-slate-400 font-bold z-10 uppercase">STATUS_SELECT</span>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 outline-none focus:border-cyan-400 appearance-none cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="STABLE">STABLE</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                ) : (
                  <span className={`text-[7px] font-mono font-black uppercase tracking-widest ${formData.status === 'ACTIVE' ? 'text-green-500' : formData.status === 'STABLE' ? 'text-cyan-500' : 'text-slate-400'}`}>
                    Current_State: {formData.status}
                  </span>
                )}
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-8 mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '150ms' }}>
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-widest">Tags::Core</span>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute -top-1.5 left-1 px-1 bg-white text-[5px] font-mono text-slate-400 font-bold z-10 uppercase">METADATA_ARRAY</span>
                    <input 
                      value={formData.tags.join(', ')}
                      onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                      className="w-full text-[9px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-2 outline-none focus:border-cyan-400 placeholder:text-slate-300"
                      placeholder="Tag1, Tag2..."
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[8px] font-mono text-slate-600 bg-white/90 border border-slate-200 uppercase shadow-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-widest">Metric::Stability</span>
                <div className="relative h-6 w-full flex items-center">
                  {isEditing ? (
                    <div className="relative w-full">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.stability}
                        onChange={e => setFormData({ ...formData, stability: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="absolute -top-4 right-0 text-[7px] font-mono text-cyan-600">{formData.stability}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-[1200ms]" style={{ width: `${formData.stability || 0}%` }} />
                      </div>
                      <span className="absolute right-0 -top-4 text-[8px] font-mono text-cyan-600 font-bold">{formData.stability}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Log Preview */}
            <div className={`flex-1 border border-slate-200 p-4 bg-slate-50/80 relative overflow-hidden mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
              <div className="h-full flex flex-col gap-1 font-mono text-[7px] text-slate-400">
                <div className="flex justify-between border-b border-slate-200 pb-1 mb-1">
                  <span className="text-cyan-600 font-bold">{formData.logChannel || 'SYS_LOG'}</span>
                  <span className="text-[6px]">T_STAMP: {new Date().toISOString().split('T')[0].replace(/-/g, '.')}</span>
                </div>
                <div className="animate-pulse">>> INITIATING HANDSHAKE... [OK]</div>
                <div>>> BUFFER_SIZE: 1024KB / SYNC: {formData.status === 'ACTIVE' ? 'ACTIVE' : 'IDLE'}</div>
                <div className="text-cyan-600">>> ENCRYPTION_LAYER: 0xF42A-SECURE</div>
                {isEditing && (
                  <div className="text-amber-500 animate-pulse mt-1">>> SYSTEM_CONFIGURATION_OVERRIDE_ACTIVE</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '450ms' }}>
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="flex-1 py-3 bg-cyan-600 text-white text-[10px] font-mono font-bold tracking-[0.4em] hover:bg-cyan-700 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">COMMIT_CHANGES</button>
                  <button onClick={handleCancel} className="flex-1 py-3 bg-slate-200 text-slate-600 text-[10px] font-mono font-bold tracking-[0.4em] hover:bg-slate-300 transition-all">ABORT_SYNC</button>
                </>
              ) : (
                <>
                  <a href={formData.repoUrl} className="group/btn relative flex-1 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold text-center tracking-[0.4em] hover:bg-cyan-600 transition-all overflow-hidden flex items-center justify-center gap-2 shadow-lg">
                    <span className="relative z-10">OPEN_INTERFACE</span>
                    <svg className="w-3 h-3 relative z-10 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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