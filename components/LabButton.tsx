
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
      className={`group relative flex items-center gap-3 px-5 py-2.5 transition-all duration-300 btn-lab border-2 ${active ? 'border-cyan-500' : 'border-slate-300'}`}
    >
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Status Light */}
      <div className="relative flex items-center justify-center w-2 h-2">
        <div className={`absolute w-full h-full rounded-full ${accentColor} ${active ? 'animate-pulse scale-125 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'opacity-40'}`} />
        <div className={`w-1 h-1 bg-white rounded-full z-10`} />
      </div>

      <span className="relative z-10 uppercase tracking-[0.2em]">{label}</span>

      {/* Internal Glitch Hover Effect */}
      <div className="absolute inset-0 bg-cyan-400/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
      
      {/* Corner Hardware Details */}
      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-slate-400 opacity-40" />
      <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-slate-400 opacity-40" />
    </button>
  );
};

export default LabButton;
