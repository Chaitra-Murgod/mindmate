
import React from 'react';
import { WeeklyGraphItem } from '../types';

interface Props {
  data: WeeklyGraphItem[];
  insights: string[];
}

const WeeklyGraph: React.FC<Props> = ({ data, insights }) => {
  const maxScore = 100;

  return (
    <div className="mt-4">
      {/* Chart Container */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 h-48 flex items-end justify-between gap-2 relative">
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between opacity-10">
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
        </div>

        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group flex-1 h-full justify-end z-10">
            <div 
              className="w-full max-w-[20px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-400 relative transition-all duration-500 hover:to-purple-300"
              style={{ height: `${(item.score / maxScore) * 100}%`, minHeight: '10%' }}
            >
               {/* Hover Detail */}
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                 {item.score}% {item.mood}
               </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium uppercase">{item.day}</span>
          </div>
        ))}
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="mt-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 flex items-start gap-3">
          <div className="mt-0.5 text-indigo-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            {insights.map((text, i) => (
              <p key={i} className="text-sm text-slate-300 font-sans">{text}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyGraph;
