
import React, { useState } from 'react';
import { DayBalancer } from '../types';

interface Props {
  data: DayBalancer;
}

const DayBalancerCard: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<'current' | 'healthy'>('current');

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden mb-5 shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">⚖️</span>
          <h3 className="font-display font-bold text-white tracking-wide">My Day Balancer</h3>
        </div>
        <p className="text-xs text-indigo-200/70 font-sans">
          {view === 'current' ? "Your estimated flow today" : "A softer, balanced alternative"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setView('current')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
            view === 'current' ? 'bg-white/5 text-indigo-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Current
        </button>
        <button 
          onClick={() => setView('healthy')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
            view === 'healthy' ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Healthy Suggestion
        </button>
      </div>

      <div className="p-5">
        
        {/* Corrections (Only visible on Current view) */}
        {view === 'current' && (
          <div className="mb-6 space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Gentle Adjustments</h4>
            {data.corrections.map((item, idx) => (
              <div key={idx} className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3">
                 <div className="mt-0.5 text-rose-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                 </div>
                 <div>
                   <p className="text-xs text-rose-200 font-medium mb-0.5">{item.issue}</p>
                   <p className="text-xs text-indigo-200/70 italic">"{item.fix}"</p>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="relative border-l border-white/10 ml-3 space-y-6 pb-2">
          {(view === 'current' ? data.current : data.healthy).map((event, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Dot */}
              <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                 view === 'current' ? 'bg-indigo-400' : 'bg-emerald-400'
              }`}></div>
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-slate-400">{event.time}</span>
                    <span className="text-sm">{event.icon}</span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200">{event.activity}</h4>
                </div>
                {view === 'current' && event.mood && (
                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                     {event.mood}
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
           <p className="text-xs sm:text-sm text-indigo-100/80 italic font-serif">
             ✨ {data.summary}
           </p>
        </div>

      </div>
    </div>
  );
};

export default DayBalancerCard;
