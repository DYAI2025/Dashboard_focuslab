import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProjectModule } from '../types';

interface CoreMotifProps {
  projects: ProjectModule[];
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const CoreMotif: React.FC<CoreMotifProps> = ({ projects }) => {
  const activeModules = projects.filter(p => p.status === 'ACTIVE').length;
  const totalModules = projects.length;
  const activationRatio = totalModules > 0 ? activeModules / totalModules : 0;
  
  // Dynamic glow based on activity (Environmental lighting only)
  const coreGlowColor = activationRatio > 0.3 ? 'rgba(34, 211, 238, 0.4)' : 'rgba(245, 158, 11, 0.4)';

  // Interaction State
  const [hueRotation, setHueRotation] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleIdCounter = useRef(0);

  // Particle System Refs
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const lastMousePos = useRef<{x: number, y: number} | null>(null);

  // Clean up ripples to avoid memory leaks if clicked extremely rapidly
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(prev => prev.slice(1));
      }, 1500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Particle Animation Loop
  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.current.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02; // Fade out speed

      if (p.life <= 0) {
        particles.current[index] = null as any; // Mark for removal
      } else {
        ctx.fillStyle = p.color.replace(')', `, ${p.life})`).replace('rgb', 'rgba');
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });

    // Clean up dead particles
    particles.current = particles.current.filter(Boolean);

    if (particles.current.length > 0) {
      animationFrameId.current = requestAnimationFrame(renderParticles);
    }
  }, []);

  const spawnDust = (x: number, y: number, count: number = 5, color: string = 'rgb(148, 163, 184)') => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1.0,
        color: color,
        size: Math.random() * 2 + 1
      });
    }
    // Start loop if not running
    if (particles.current.length <= count) { // Rough check to restart loop
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(renderParticles);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Center coordinates
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    // Calculate radius from center (normalized 0-1 based on half-width)
    const maxR = rect.width / 2;
    const r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) / maxR;

    if (lastMousePos.current) {
      const lastR = lastMousePos.current.r;
      
      // Define Ring Boundaries (approximate normalized radii)
      // Ring 1 (Outer): ~0.98
      // Ring 2 (Mid): ~0.88 
      // Ring 3 (Inner): ~0.70
      const thresholds = [0.98, 0.88, 0.70];
      const buffer = 0.02; // Sensitivity width

      thresholds.forEach(t => {
        // Check if we crossed the threshold from either direction
        if ((lastR < t - buffer && r >= t - buffer) || (lastR > t + buffer && r <= t + buffer)) {
             // Only trigger if close to the line
             if (Math.abs(r - t) < 0.05) {
                spawnDust(x, y, 8, 'rgb(34, 211, 238)'); // Cyan dust
             }
        }
      });
    }

    lastMousePos.current = { x, y, r };
  };

  const handleCoreClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent container mouse move interference if needed
    if (!coreRef.current) return;

    // Get click position relative to the core element
    const rect = coreRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new ripple
    const newRipple = {
      id: rippleIdCounter.current++,
      x,
      y
    };
    setRipples(prev => [...prev, newRipple]);

    // Shift Color smoothly (approx 45 degrees per click)
    setHueRotation(prev => prev + 45);
  };

  // Resize canvas on mount/resize
  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current && canvasRef.current) {
            canvasRef.current.width = containerRef.current.offsetWidth;
            canvasRef.current.height = containerRef.current.offsetHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Letters config for curvature
  const letters = [
    { char: 'D', angle: -24 },
    { char: 'Y', angle: -8 },
    { char: 'A', angle: 8 },
    { char: 'I', angle: 24 }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-72 h-72 md:w-[32rem] md:h-[32rem] flex items-center justify-center select-none perspective-1000 group/container"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Dust Canvas Layer */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
      />

      {/* Internal Lens Flare - Pushed back in Z-space */}
      <div 
        className={`absolute w-40 h-40 rounded-full blur-[80px] animate-pulse transition-colors duration-1000 ${activationRatio > 0.3 ? 'bg-cyan-400/20' : 'bg-amber-400/20'}`}
        style={{ transform: 'translateZ(-100px)' }}
      />
      
      {/* --- GYROSCOPE RING SYSTEM --- */}
      
      {/* Ring 1: Outer Major Scaffolding (Slow, X-Axis Tilt) */}
      <div className="absolute inset-0 animate-gyro-outer preserve-3d pointer-events-none opacity-60" style={{ transformStyle: 'preserve-3d' }}>
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(71, 85, 105, 0.4)" strokeWidth="0.5" />
          <path d="M100 2 V10 M100 190 V198 M2 100 H10 M190 100 H198" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="2" />
          {/* Mechanical Ticks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
            <rect key={deg} x="99" y="0" width="2" height="4" fill="#475569" transform={`rotate(${deg}, 100, 100)`} />
          ))}
        </svg>
      </div>

      {/* Ring 2: Middle Gimbal (Medium, Y-Axis Tilt) */}
      <div className="absolute inset-4 animate-gyro-mid preserve-3d pointer-events-none opacity-50" style={{ transformStyle: 'preserve-3d' }}>
        <svg className="w-full h-full" viewBox="0 0 200 200">
           <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
           <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="4" strokeDasharray="20 40" />
        </svg>
      </div>

      {/* Ring 3: Inner Fast Gimbal (Fast, Z/X Axis Mix) */}
      <div className="absolute inset-8 animate-gyro-inner preserve-3d pointer-events-none opacity-40" style={{ transformStyle: 'preserve-3d' }}>
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="70" fill="none" stroke={coreGlowColor} strokeWidth="0.5" strokeDasharray="1 5" />
          <path d="M100 20 A80 80 0 0 1 180 100" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" fill="none" />
          <path d="M100 180 A80 80 0 0 1 20 100" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* --- PHYSICAL CORE UNIT --- */}
      <div className="animate-core-instability relative sphere-radius z-30" style={{ transformStyle: 'preserve-3d' }}>
        <div 
          ref={coreRef}
          onClick={handleCoreClick}
          className="w-40 h-40 md:w-60 md:h-60 rounded-full flex flex-col items-center justify-center relative overflow-visible transition-all duration-[2000ms] ease-in-out cursor-pointer group"
          style={{
            transform: 'translateZ(0)', // Force 3D position
            background: 'radial-gradient(circle at 35% 35%, #334155 0%, #1e293b 45%, #020617 100%)',
            boxShadow: `
              inset -10px -10px 25px rgba(0, 0, 0, 0.5), 
              inset 5px 5px 15px rgba(148, 163, 184, 0.2), 
              0 25px 50px -12px rgba(0, 0, 0, 0.5), 
              0 0 0 1px rgba(71, 85, 105, 0.5)
            `,
            // Apply Hue Rotation filter for subtle color shifts
            filter: `hue-rotate(${hueRotation}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Ripples Layer - confined to sphere */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" style={{ transformStyle: 'flat' }}>
            {ripples.map(ripple => (
              <div 
                key={ripple.id}
                className="ripple-wave"
                style={{ 
                  left: ripple.x, 
                  top: ripple.y,
                  width: '100px', // Base size, scales up
                  height: '100px'
                }}
              />
            ))}
          </div>

          {/* Specular Highlight (The Glare) */}
          <div className="absolute top-[12%] left-[12%] w-[45%] h-[25%] bg-gradient-to-br from-white to-transparent rounded-[100%] opacity-20 blur-[3px] pointer-events-none transform -rotate-45" />

          {/* Internal Glow Lights (Diffused inside glass) */}
          <div className="absolute top-10 right-10 opacity-30 blur-md pointer-events-none">
             <div className={`w-8 h-8 rounded-full transition-colors duration-1000 ${activationRatio > 0.3 ? 'bg-cyan-400' : 'bg-amber-400'}`} />
          </div>
          
          <div className="scanlines absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay rounded-full" />
          
          {/* UI Content - Wrapped in a div that counter-rotates hue to keep text neutral */}
          {/* Note: We use absolute positioning for the curved text to center it in 3D space */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ease-in-out pointer-events-none"
            style={{ 
              filter: `hue-rotate(-${hueRotation}deg)`,
              transformStyle: 'preserve-3d'
            }} 
          >
            {/* 3D Curved Text "DYAI" - Etched Laser Look */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
               {letters.map((l, i) => (
                 <span
                    key={i}
                    className="absolute font-mono text-3xl md:text-5xl font-black tracking-widest select-none"
                    style={{
                      // Etched Laser Effect: Dark with bottom-right highlight to simulate cut depth
                      color: 'rgba(0, 0, 0, 0.5)',
                      textShadow: '1px 1px 0 rgba(255, 255, 255, 0.15)',
                      transform: `rotateY(${l.angle}deg) translateZ(calc(var(--sphere-r) - 0.5px))`,
                      backfaceVisibility: 'hidden',
                      mixBlendMode: 'overlay'
                    }}
                 >
                   {l.char}
                 </span>
               ))}
            </div>
            
            {/* REMOVED: Status text, diagrams, and separators to keep the ball pure surface */}
          </div>

          {/* Refractive Edge Detail */}
          <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Optical Elements - Behind everything */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent opacity-50" style={{ transform: 'translateZ(-20px)' }} />
      <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent opacity-50" style={{ transform: 'translateZ(-20px)' }} />
    </div>
  );
};

export default CoreMotif;