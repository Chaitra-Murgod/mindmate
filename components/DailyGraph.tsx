
import React from 'react';
import { DailyGraphItem } from '../types';

interface Props {
  data: DailyGraphItem[];
}

const DailyGraph: React.FC<Props> = ({ data }) => {
  // Normalize data for max height
  const maxValue = Math.max(...data.map(d => d.value), 100);
  
  const getColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'happy': return '#34d399'; // Emerald
      case 'sad': return '#60a5fa';   // Blue
      case 'stressed': return '#f87171'; // Red
      case 'calm': return '#a78bfa';  // Purple
      case 'angry': return '#fb923c'; // Orange
      default: return '#94a3b8';      // Slate
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-3 w-[140px] shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Today</h4>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
      
      <div className="h-16 flex items-end justify-between gap-1">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 group w-full">
            <div 
              className="w-full rounded-t-sm transition-all duration-500 relative"
              style={{ 
                height: `${(item.value / maxValue) * 100}%`, 
                backgroundColor: getColor(item.label),
                minHeight: '4px'
              }}
            >
                {/* Tooltip */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {item.label}: {item.value}%
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[8px] text-slate-500 font-mono">
        <span>H</span>
        <span>S</span>
        <span>St</span>
        <span>C</span>
        <span>A</span>
      </div>
    </div>
  );
};

export default DailyGraph;
