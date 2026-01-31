
import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const icons = ['👁️', '👂', '👃', '👅', '✋'];

  useEffect(() => {
    // Sequence of animations
    const timers = [
      setTimeout(() => setStage(1), 500),  // Show icons
      setTimeout(() => setStage(2), 2500), // Show text
      setTimeout(() => setStage(3), 4500), // Fade out everything
      setTimeout(() => onComplete(), 5500) // Call completion
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-animated-gradient animate-bg-shift text-white transition-opacity duration-1000 ${stage === 3 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex gap-4 md:gap-8 mb-12">
        {icons.map((icon, index) => (
          <div 
            key={index}
            className={`text-5xl md:text-7xl transition-all duration-500 ${stage >= 1 ? 'animate-icon-pop' : 'opacity-0 scale-0'}`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {icon}
          </div>
        ))}
      </div>
      
      <div className={`text-center px-6 transition-all duration-1000 ${stage >= 2 ? 'animate-text-reveal' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl">מסע בחמשת החושים</h1>
        <p className="text-xl md:text-2xl font-light opacity-80 tracking-wide">בואו נגלה את העולם שסביבנו...</p>
      </div>

      <button 
        onClick={onComplete}
        className="mt-16 text-sm font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest border-b border-white/20 pb-1"
      >
        דלג על הפתיחה
      </button>
    </div>
  );
};

export default IntroSplash;
