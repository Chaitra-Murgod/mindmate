import React, { useState, useEffect } from 'react';
import { Neuroloop } from '../types';

interface Props {
  data: Neuroloop;
}

const NeuroloopCard: React.FC<Props> = ({ data }) => {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset state when data changes
  useEffect(() => {
    setActive(false);
    setProgress(0);
  }, [data]);

  useEffect(() => {
    let interval: any;
    if (active) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActive(false);
            return 100;
          }
          return prev + 1;
        });
      }, 50); // Just a visual simulation for the "loop" feeling
    }
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse-slow">
              <svg className="w-3 h-3 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h4 className="font-display font-bold text-indigo-100 text-sm tracking-wide">Tiny Reset Ritual</h4>
          </div>
          <span className="text-xs font-mono text-indigo-300/70">{data.duration}</span>
        </div>

        <h3 className="text-lg font-medium text-white mb-3">{data.title}</h3>

        <div className="space-y-2 mb-4">
          {data.steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-indigo-100/80">
              <span className="w-5 h-5 rounded-full border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setActive(!active)}
          className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            active 
              ? 'bg-indigo-500/20 text-indigo-300' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
          }`}
        >
          {active ? 'Breathing...' : 'Start Loop'}
        </button>
      </div>
    </div>
  );
};

export default NeuroloopCard;