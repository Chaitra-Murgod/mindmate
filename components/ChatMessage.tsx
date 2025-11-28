
import React from 'react';
import { Message, EmotionResponse } from '../types';
import ArchitecturePanel from './ArchitecturePanel';
import NeuroloopCard from './NeuroloopCard';

interface Props {
  message: Message;
  isLast: boolean;
  showRitual?: boolean; // New prop to control ritual visibility
}

const ChatMessage: React.FC<Props> = ({ message, isLast, showRitual = true }) => {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex justify-end mb-6 animate-float">
        <div className="max-w-[85%] sm:max-w-[70%] bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-2xl rounded-tr-sm border border-white/5 shadow-xl">
          <p className="text-sm sm:text-base leading-relaxed font-sans">{message.content as string}</p>
        </div>
      </div>
    );
  }

  // Model response
  const response = message.content as EmotionResponse;

  return (
    <div className="flex justify-start mb-8 w-full group">
      <div className="max-w-full sm:max-w-[90%] w-full">
        <div className="flex items-end gap-2 mb-2">
           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
             <span className="text-[10px] font-bold text-white">M</span>
           </div>
           <span className="text-xs text-slate-400 font-display">MINDMATE</span>
        </div>

        <div className="pl-8">
           {/* Emotional Garden Panel (Always Show) */}
           {response.architecture && <ArchitecturePanel data={response.architecture} />}

           {/* Text Reply */}
           <div className="bg-slate-800/40 backdrop-blur-md text-slate-200 p-5 rounded-2xl rounded-tl-sm border border-slate-700/50 shadow-xl mb-5">
             <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
               {response.reply}
             </p>
           </div>
           
           {/* Vibe Forecast */}
           <div className="flex items-center gap-2 mb-3 px-1">
              <svg className="w-4 h-4 text-yellow-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs text-slate-400 italic">
                Forecast: <span className="text-slate-300 not-italic">{response.vibeForecast}</span>
              </span>
           </div>

           {/* Neuroloop Card (Conditional) */}
           {showRitual && response.neuroloop && (
             <div className="max-w-md">
               <NeuroloopCard data={response.neuroloop} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
