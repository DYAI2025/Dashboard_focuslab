import React, { useState, useEffect } from 'react';
import { ProjectModule } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ModuleCardProps {
  project: ProjectModule;
  onUpdate: (updated: ProjectModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ project, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ProjectModule>(project);

  // Sync state with props when not editing to prevent stale data
  useEffect(() => {
    if (!isEditing) {
      setFormData(project);
    }
  }, [project, isEditing]);

  const isInteractionActive = isHovered || isFocused || isEditing;
  const techEasing = 'cubic-bezier(0.23, 1, 0.32, 1)';

  // Laser Engraved Effect Style - DARK MODE
  // "Burnt" or "Etched Light" look on dark metal
  const etchedTitleStyle = isInteractionActive ? {
    // Active: Sharp recessed look (Etched Light)
    // Dark shadow Top-Left, Light highlight Bottom-Right
    textShadow: '-1px -1px 0 rgba(0, 0, 0, 0.8), 1px 1px 0 rgba(255, 255, 255, 0.1)',
    color: '#e2e8f0', // slate-200 (Bright Silver)
    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
  } : {
    // Inactive: Muted silver
    textShadow: '-1px -1px 0 rgba(0,0,0,0.5)',
    color: '#94a3b8', // slate-400
    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
  };

  const etchedIdStyle = {
    textShadow: isInteractionActive 
      ? '0 0 10px rgba(251, 191, 36, 0.5)' // Golden Glow on active
      : 'none',
    color: isInteractionActive ? '#fbbf24' : '#0ea5e9', // Amber (Active) vs Cyan (Inactive)
    transition: 'all 0.5s ease'
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel edit
      setFormData({ ...project });
      setIsEditing(false);
    } else {
      // Start edit
      setFormData({ ...project });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleAiEnhance = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Rewrite the following description to be highly technical, sci-fi, and cryptic. Style it like a raw system log or a HUD readout from a futuristic spacecraft. Use hex codes, technical abbreviations, and obscure jargon. Keep the meaning intact but make it sound advanced. Max 200 chars.
      
      Input Title: ${formData.title}
      Input Description: ${formData.description}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.8,
        }
      });

      const text = response.text;
      if (text) {
        setFormData(prev => ({ ...prev, description: text.trim() }));
      }
    } catch (e) {
      console.error("AI Enhance failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return;
    if (e.key === 'Enter' || e.key === ' ') {
      // If focusing the main card, allow toggling visual state if desired, 
      // but primary interaction is via focus expansion.
      // Prevent default scrolling for Space
      if ((e.target as HTMLElement) === e.currentTarget) {
         e.preventDefault();
      }
    }
  };

  // Determine if content is empty for placeholder display
  const isTitleEmpty = !formData.title || formData.title.trim() === '';

  return (
    <div 
      tabIndex={0}
      role="region"
      aria-label={`Project Module: ${formData.title}`}
      className={`group relative h-[36rem] overflow-hidden panel-lab transition-all duration-700 border-r border-b border-cyan-500/20 outline-none focus:ring-1 focus:ring-amber-400/60 focus:border-amber-400/50 focus:bg-slate-900 focus:shadow-[0_0_25px_rgba(245,158,11,0.15)] focus-within:ring-2 focus-within:ring-amber-400/30`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isEditing && setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Prevent state flicker when moving focus between children or container
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
      onKeyDown={handleKeyDown}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* 1. SCHEMATIC LAYER (HUD Overlay inside card) */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${isInteractionActive ? 'opacity-40 scale-105 rotate-1' : 'opacity-10 scale-100'}`}>
        <svg className="w-full h-full" viewBox="0 0 400 600">
          <defs>
            <pattern id={`hex-grid-${project.id}`} width="50" height="43.3" patternUnits="userSpaceOnUse">
              <path d="M 12.5 0 L 37.5 0 L 50 21.65 L 37.5 43.3 L 12.5 43.3 L 0 21.65 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-grid-${project.id})`} />
          <g fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-600/50">
            <circle cx="200" cy="220" r="160" strokeDasharray="1 10" className="animate-orbit-slow origin-center" />
            <circle cx="200" cy="220" r="180" strokeDasharray="4 20" className="animate-orbit origin-center" />
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none" />

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
              <span 
                className="text-[10px] font-mono font-bold bg-slate-900/80 px-2 py-0.5 border border-cyan-500/30 shadow-sm backdrop-blur-sm uppercase transition-all duration-500"
                style={etchedIdStyle}
              >
                MOD_{formData.id}
              </span>
              <div className={`h-[1px] transition-all duration-700 bg-slate-700 ${isInteractionActive ? 'w-24 bg-amber-500' : 'w-10'}`} />
            </div>
            
            <button 
              onClick={handleToggleEdit}
              className={`flex items-center gap-2 px-3 py-1 glass-panel border text-[8px] font-mono font-bold transition-all z-50 cursor-pointer ${
                isEditing 
                  ? 'border-amber-500 text-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-400 opacity-70 hover:opacity-100'
              }`}
            >
              {isEditing ? (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  EXIT_MODE
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  EDIT_MODE
                </>
              )}
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute -top-2 left-2 px-1 bg-slate-900 border border-slate-700 text-[7px] font-mono text-amber-500 font-bold tracking-[0.2em] z-10">MOD_TITLE_ENTRY</span>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-2xl font-bold tracking-tighter bg-slate-950/50 border border-slate-700 px-3 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] placeholder:text-slate-600 rounded-sm text-slate-100"
                  style={etchedTitleStyle}
                  placeholder="Module Title"
                />
                {/* Decorative corner mark for input */}
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/50 pointer-events-none" />
              </div>
              
              <div className="relative">
                <span className="absolute -top-2 left-2 px-1 bg-slate-900 border border-slate-700 text-[7px] font-mono text-amber-500 font-bold tracking-[0.2em] z-10">DESCRIPTION_STREAM</span>
                
                {/* AI ENHANCE BUTTON */}
                <button 
                  onClick={handleAiEnhance}
                  disabled={isGenerating}
                  className="absolute -top-2 right-2 px-2 h-4 flex items-center gap-1 bg-slate-900 border border-slate-700 text-[6px] font-mono text-cyan-500 font-bold tracking-[0.2em] hover:bg-cyan-900/30 hover:border-cyan-400 transition-all z-20 disabled:opacity-50 cursor-pointer group/ai-btn"
                >
                  <svg className={`w-2 h-2 ${isGenerating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                  {isGenerating ? 'PROCESSING' : 'AI::REWRITE'}
                </button>

                <div className="group/textarea relative flex bg-slate-950/30 border border-slate-700 hover:border-slate-600 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all shadow-inner overflow-hidden backdrop-blur-sm rounded-sm">
                  {/* Pseudo Line Numbers with interactive state */}
                  <div className="w-8 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-end pr-2 pt-3 gap-1 select-none pointer-events-none group-focus-within/textarea:bg-amber-500/10 transition-colors duration-300">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="text-[9px] font-mono text-slate-600 group-focus-within/textarea:text-amber-500/70 transition-colors">0{n}</span>
                    ))}
                  </div>
                  
                  <div className="relative flex-1">
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      disabled={isGenerating}
                      className="peer w-full text-[11px] font-mono text-slate-300 bg-transparent px-3 py-3 outline-none resize-none h-32 leading-relaxed block placeholder:text-slate-600 disabled:opacity-50 caret-amber-500 selection:bg-amber-900/30 selection:text-amber-200"
                      placeholder="Enter technical specifications..."
                      spellCheck={false}
                    />
                    
                    {/* Background Grid for Textarea - Enhanced */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] peer-focus:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    
                    {/* Focus Corner Accents */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500 opacity-0 peer-focus:opacity-100 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500 opacity-0 peer-focus:opacity-100 transition-all duration-300" />
                  </div>
                </div>
                
                {/* Advanced Diagnostic Indicator */}
                <div className="mt-3 grid grid-cols-2 gap-2 px-1 opacity-80">
                  {/* Buffer Usage Bar */}
                  <div className="col-span-2 flex flex-col gap-1">
                     <div className="flex justify-between text-[6px] font-mono text-slate-500 uppercase tracking-widest">
                        <span>Buffer_Saturation</span>
                        <span>{Math.round((formData.description.length / 512) * 100)}%</span>
                     </div>
                     <div className="h-1 w-full bg-slate-800 flex gap-0.5 overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => {
                           const threshold = (i + 1) * 5; // 5%, 10%, ... 100%
                           const current = (formData.description.length / 512) * 100;
                           const active = current >= threshold;
                           const color = active 
                              ? (current > 90 ? 'bg-red-500' : 'bg-amber-500') 
                              : 'bg-slate-700';
                           return (
                              <div key={i} className={`flex-1 transition-colors duration-300 ${color}`} />
                           );
                        })}
                     </div>
                  </div>

                  {/* Parity & Count */}
                  <div className="flex items-center gap-2 border-r border-slate-700 pr-2">
                     <div className={`w-1.5 h-1.5 rounded-sm ${formData.description.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                     <div className="flex flex-col">
                        <span className="text-[5px] font-mono text-slate-500 uppercase tracking-widest leading-none">PARITY_BIT</span>
                        <span className="text-[7px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">{formData.description.length > 0 ? 'VALID' : 'NULL'}</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pl-2">
                     <div className="flex flex-col items-end">
                        <span className="text-[5px] font-mono text-slate-500 uppercase tracking-widest leading-none">OCTET_COUNT</span>
                        <span className={`text-[7px] font-mono font-bold uppercase tracking-widest leading-none mt-0.5 ${formData.description.length > 500 ? 'text-red-500' : 'text-cyan-600'}`}>
                           {formData.description.length.toString().padStart(3, '0')} / 512
                        </span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isTitleEmpty ? (
                <div className="mb-6 opacity-30">
                  <h3 className="text-4xl font-mono font-bold tracking-tighter text-slate-600 mb-2">[ NULL_REFERENCE ]</h3>
                  <div className="h-1 w-20 bg-slate-700/50" />
                </div>
              ) : (
                <h3 
                  className="text-4xl font-light tracking-tighter text-slate-100 leading-[0.85] mb-6 transition-all duration-500"
                  style={etchedTitleStyle}
                >
                  {formData.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? 'font-bold block' : 'block'}>{word}</span>
                  ))}
                </h3>
              )}
              
              <p className={`text-xs text-slate-400 leading-relaxed max-w-[240px] font-light transition-all duration-500 ${isInteractionActive ? 'opacity-0 scale-95 translate-y-4' : 'opacity-80 scale-100 translate-y-0'}`}>
                {formData.description}
              </p>
            </>
          )}
        </div>

        {/* 3. REFINED SLIDING SPEC TRAY */}
        <div 
          className="absolute bottom-0 left-0 w-full glass-panel border-t border-slate-700 p-8 transform transition-all overflow-hidden bg-slate-900/80"
          style={{ 
            height: '74%',
            transitionDuration: '850ms',
            transitionTimingFunction: techEasing,
            transform: isInteractionActive ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent ${isInteractionActive ? 'animate-pulse' : ''}`} />
          
          <div className="flex flex-col h-full">
            <div className={`grid grid-cols-2 gap-4 mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">Deployment_Analysis</span>
                {isEditing ? (
                  <div className="relative mt-1">
                    <span className="absolute -top-1.5 left-1 px-1 bg-slate-900 text-[5px] font-mono text-slate-500 font-bold z-10 uppercase">CHANNEL_ID</span>
                    <input 
                      value={formData.logChannel}
                      onChange={e => setFormData({ ...formData, logChannel: e.target.value })}
                      className="w-full text-[10px] font-mono text-amber-500 bg-slate-950 border border-slate-700 px-2 py-1 outline-none focus:border-amber-500 placeholder:text-slate-700"
                      placeholder="LOG_CHANNEL_01"
                    />
                  </div>
                ) : (
                  <span className="text-[7px] font-mono text-cyan-500 font-black uppercase tracking-widest">Active_Node_Sync: {formData.logChannel || 'Established'}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">Lifecycle_Protocol</span>
                {isEditing ? (
                  <div className="relative mt-1">
                    <span className="absolute -top-1.5 left-1 px-1 bg-slate-900 text-[5px] font-mono text-slate-500 font-bold z-10 uppercase">STATUS_SELECT</span>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full text-[10px] font-mono font-bold text-slate-300 bg-slate-950 border border-slate-700 px-2 py-1 outline-none focus:border-amber-500 appearance-none cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="STABLE">STABLE</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                ) : (
                  <span className={`text-[7px] font-mono font-black uppercase tracking-widest ${formData.status === 'ACTIVE' ? 'text-emerald-500' : formData.status === 'STABLE' ? 'text-cyan-500' : 'text-slate-500'}`}>
                    Current_State: {formData.status}
                  </span>
                )}
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-8 mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '150ms' }}>
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Tags::Core</span>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute -top-1.5 left-1 px-1 bg-slate-900 text-[5px] font-mono text-slate-500 font-bold z-10 uppercase">METADATA_ARRAY</span>
                    <input 
                      value={formData.tags.join(', ')}
                      onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                      className="w-full text-[9px] font-mono text-slate-300 bg-slate-950 border border-slate-700 px-2 py-2 outline-none focus:border-amber-500 placeholder:text-slate-700"
                      placeholder="Tag1, Tag2..."
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[8px] font-mono text-slate-400 bg-slate-900/90 border border-slate-700 uppercase shadow-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">Metric::Stability</span>
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
                        className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="absolute -top-4 right-0 text-[7px] font-mono text-amber-500">{formData.stability}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-[1200ms]" style={{ width: `${formData.stability || 0}%` }} />
                      </div>
                      <span className="absolute right-0 -top-4 text-[8px] font-mono text-cyan-600 font-bold">{formData.stability}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Log Preview */}
            <div className={`flex-1 border border-slate-700 p-4 bg-slate-950/50 relative overflow-hidden mb-6 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
              <div className="h-full flex flex-col gap-1 font-mono text-[7px] text-slate-500">
                <div className="flex justify-between border-b border-slate-700 pb-1 mb-1">
                  <span className="text-cyan-500 font-bold">{formData.logChannel || 'SYS_LOG'}</span>
                  <span className="text-[6px]">T_STAMP: {new Date().toISOString().split('T')[0].replace(/-/g, '.')}</span>
                </div>
                <div className="animate-pulse">>> INITIATING HANDSHAKE... [OK]</div>
                <div>>> BUFFER_SIZE: 1024KB / SYNC: {formData.status === 'ACTIVE' ? 'ACTIVE' : 'IDLE'}</div>
                <div className="text-amber-500">>> ENCRYPTION_LAYER: 0xF42A-SECURE</div>
                {isEditing && (
                  <div className="text-red-400 animate-pulse mt-1">>> SYSTEM_CONFIGURATION_OVERRIDE_ACTIVE</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 transition-all duration-700 ${isInteractionActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '450ms' }}>
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="flex-1 py-3 bg-amber-600 text-white text-[10px] font-mono font-bold tracking-[0.4em] hover:bg-amber-700 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">COMMIT_CHANGES</button>
                  <button onClick={handleToggleEdit} className="flex-1 py-3 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold tracking-[0.4em] hover:bg-slate-700 transition-all">ABORT_SYNC</button>
                </>
              ) : (
                <>
                  <a href={formData.repoUrl} className="group/btn relative flex-1 py-3 bg-slate-950 text-white text-[10px] font-mono font-bold text-center tracking-[0.4em] hover:bg-amber-600 transition-all overflow-hidden flex items-center justify-center gap-2 shadow-lg border border-slate-700 hover:border-amber-500">
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
            ? 'border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.3),inset_0_0_35px_rgba(245,158,11,0.15)]' 
            : 'border-transparent shadow-none'
        } ${isFocused ? 'ring-inset ring-4 ring-amber-400/20' : ''}`} 
      />
    </div>
  );
};

export default ModuleCard;