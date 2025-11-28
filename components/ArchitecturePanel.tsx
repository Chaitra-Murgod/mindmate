
import React, { useState } from 'react';
import { EmotionArchitecture, SkyWeather } from '../types';

interface Props {
  data: EmotionArchitecture;
}

const EmotionalGarden: React.FC<Props> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < data.pages.length - 1) setCurrentPage(p => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1);
  };

  // --- Visual Tree Component ---
  const TreeVisualization = () => {
    const { leafColor, health, flowerCount } = data.tree;
    
    // Dynamic styles based on health
    const isDrooping = health === 'drooping';
    const isShedding = health === 'shedding';
    
    return (
      <div className="relative w-full h-40 bg-gradient-to-b from-indigo-900/0 to-indigo-900/20 rounded-t-3xl flex items-end justify-center overflow-hidden">
        {/* Background Aura */}
        <div 
          className="absolute bottom-0 w-32 h-32 rounded-full blur-[40px] opacity-40 transition-colors duration-1000"
          style={{ backgroundColor: leafColor }}
        ></div>

        <svg viewBox="0 0 200 150" className="w-full h-full max-w-[250px] relative z-10 transition-all duration-1000 ease-in-out">
          {/* Trunk */}
          <path d="M95,150 C95,150 90,120 95,100 C100,80 100,60 95,40" stroke="#8D6E63" strokeWidth="6" fill="none" />
          
          {/* Branches (Left) */}
          <g transform={isDrooping ? "rotate(-20, 95, 100)" : ""}>
             <path d="M95,100 Q70,90 60,70" stroke="#8D6E63" strokeWidth="3" fill="none" />
             {/* Leaves Left */}
             {!isShedding && (
               <>
                 <circle cx="60" cy="70" r="8" fill={leafColor} className="animate-pulse-slow" opacity="0.8" />
                 <circle cx="50" cy="80" r="6" fill={leafColor} opacity="0.6" />
               </>
             )}
          </g>

          {/* Branches (Right) */}
          <g transform={isDrooping ? "rotate(20, 95, 90)" : ""}>
            <path d="M95,90 Q120,80 130,60" stroke="#8D6E63" strokeWidth="3" fill="none" />
             {/* Leaves Right */}
             {!isShedding && (
               <>
                 <circle cx="130" cy="60" r="9" fill={leafColor} className="animate-pulse-slow" opacity="0.8" />
                 <circle cx="140" cy="70" r="5" fill={leafColor} opacity="0.6" />
               </>
             )}
          </g>

          {/* Top Branch */}
           <g transform={isDrooping ? "rotate(10, 95, 60)" : ""}>
             <path d="M95,60 Q90,40 95,20" stroke="#8D6E63" strokeWidth="2" fill="none" />
              {!isShedding && (
                <circle cx="95" cy="20" r="10" fill={leafColor} className="animate-pulse" opacity="0.9" />
              )}
           </g>

           {/* Flowers (Positive Moments) */}
           {Array.from({ length: Math.min(flowerCount, 5) }).map((_, i) => (
             <circle 
               key={i} 
               cx={80 + (i * 10)} 
               cy={140 - (i * 5)} 
               r="3" 
               fill="#F472B6" 
               className="animate-bounce" 
               style={{ animationDelay: `${i * 0.2}s` }}
             />
           ))}
        </svg>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
      </div>
    );
  };

  const getSkyStyles = (weather?: SkyWeather) => {
    switch (weather) {
      case 'sunny': return { bg: 'bg-gradient-to-b from-sky-400/30 to-blue-200/10', icon: '☀️', glow: 'shadow-yellow-500/20' };
      case 'cloudy': return { bg: 'bg-gradient-to-b from-slate-400/30 to-gray-200/10', icon: '☁️', glow: 'shadow-slate-500/20' };
      case 'partly-cloudy': return { bg: 'bg-gradient-to-b from-blue-300/30 to-gray-100/10', icon: '⛅', glow: 'shadow-blue-400/20' };
      case 'rainy': return { bg: 'bg-gradient-to-b from-slate-600/30 to-blue-900/10', icon: '🌧️', glow: 'shadow-blue-800/20' };
      case 'stormy': return { bg: 'bg-gradient-to-b from-purple-900/30 to-slate-900/10', icon: '🌩️', glow: 'shadow-purple-900/20' };
      case 'sunset': return { bg: 'bg-gradient-to-b from-orange-400/30 to-purple-600/10', icon: '🌅', glow: 'shadow-orange-500/20' };
      case 'night': return { bg: 'bg-gradient-to-b from-indigo-950/40 to-black/10', icon: '🌌', glow: 'shadow-indigo-500/20' };
      case 'rainbow': return { bg: 'bg-gradient-to-b from-pink-400/20 via-blue-400/10 to-green-400/10', icon: '🌈', glow: 'shadow-pink-500/20' };
      default: return { bg: 'bg-gradient-to-b from-sky-300/20 to-transparent', icon: '🌤️', glow: 'shadow-sky-400/10' };
    }
  };

  // --- Story Page Renderer ---
  const renderPageContent = (page: any) => {
    switch (page.type) {
      case 'energy':
        return (
          <div className="mt-4">
             <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-1000 ease-out"
                 style={{ width: `${page.energyLevel || 50}%` }}
               ></div>
             </div>
             <p className="mt-2 text-xs text-emerald-200/80 font-mono text-center">{page.energyLevel}% Growth</p>
          </div>
        );
      case 'uplift':
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            {page.tags?.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-pink-500/20 text-pink-200 rounded-full text-xs border border-pink-500/20">
                🌸 {tag}
              </span>
            ))}
          </div>
        );
      case 'sky':
        const style = getSkyStyles(page.skyWeather);
        return (
          <div className={`mt-2 p-4 rounded-2xl border border-white/10 ${style.bg} backdrop-blur-sm relative overflow-hidden group-hover:shadow-lg transition-all`}>
             <div className="absolute top-[-10px] right-[-10px] text-6xl opacity-20 transform group-hover:scale-110 transition-transform duration-1000">
               {style.icon}
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-1.5">
                 <span className="text-2xl filter drop-shadow-md animate-float">{style.icon}</span>
                 <span className="text-xs uppercase tracking-wide text-white/70 font-display">Sky Mood Scanner</span>
               </div>
               <p className="text-sm text-white/90 font-serif italic leading-relaxed">
                 "{page.content}"
               </p>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const page = data.pages[currentPage];

  return (
    <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 mb-5 shadow-2xl transition-all duration-500 group">
      
      {/* Tree Header */}
      <TreeVisualization />

      {/* Storybook Content */}
      <div className="p-5 min-h-[220px] flex flex-col justify-between relative bg-gradient-to-b from-transparent to-black/20">
        
        <div>
          <div className="flex justify-between items-center mb-2">
             <h3 className="font-display font-bold text-lg text-white tracking-tight">{page.title}</h3>
             <span className="text-[10px] uppercase tracking-widest text-white/30">Page {currentPage + 1}/{data.pages.length}</span>
          </div>
          
          <p className={`text-sm sm:text-base leading-relaxed text-slate-200 font-sans ${page.type === 'sky' ? 'hidden' : 'block'}`}>
            {page.content}
          </p>
          
          {renderPageContent(page)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <button 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-0 transition-all text-slate-400"
          >
            ←
          </button>
          
          <div className="flex gap-1.5">
            {data.pages.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentPage ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextPage}
            disabled={currentPage === data.pages.length - 1}
            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-0 transition-all text-slate-400"
          >
            →
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmotionalGarden;
