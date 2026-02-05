import React from 'react';

interface LabButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'cyan' | 'alert';
  active?: boolean;
}

const LabButton: React.FC<LabButtonProps> = ({ label, onClick, variant = 'default', active = false }) => {
  const accentColor = variant === 'cyan' ? 'bg-cyan-400' : variant === 'alert' ? 'bg-amber-500' : 'bg-slate-400';
  
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-6 py-3 transition-all duration-300 bg-slate-900/50 hover:bg-slate-800 border-2 select-none active:scale-[0.98] ${
        active 
          ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
          : 'border-slate-700 hover:border-cyan-400 shadow-sm'
      }`}
    >
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Status Light */}
      <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
        {/* Base Light Body */}
        <div className={`absolute w-full h-full rounded-full ${accentColor} transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          active 
            ? 'animate-pulse scale-125 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
            : 'opacity-40 scale-100 group-hover:opacity-100 group-hover:shadow-[0_0_6px_rgba(34,211,238,0.4)]'
        }`} />
        
        {/* Hover Ping/Shimmer Effect (Independent Layer) */}
        {!active && (
          <div className={`absolute inset-0 rounded-full ${accentColor} opacity-0 group-hover:animate-ping`} />
        )}
        
        {/* Core Dot */}
        <div className={`w-1 h-1 bg-white rounded-full z-10 transition-transform duration-300 group-hover:scale-75`} />
      </div>

      {/* Enhanced Label Interaction */}
      <span className="relative z-10 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5 group-hover:text-amber-400">
        {label}
      </span>

      {/* Internal Glitch Hover Effect */}
      <div className="absolute inset-0 bg-amber-400/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
      
      {/* Hardware Accents */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-600 group-hover:border-amber-400 transition-colors duration-500 opacity-60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-600 group-hover:border-amber-400 transition-colors duration-500 opacity-60" />
      
      {/* Micro-labeling on hover */}
      <div className="absolute -bottom-1 -right-1 px-1 bg-slate-800 text-[5px] font-mono text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        EXEC_CMD
      </div>
    </button>
  );
};

export default LabButton;