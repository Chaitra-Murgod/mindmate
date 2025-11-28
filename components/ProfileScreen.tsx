
import React, { useState } from 'react';
import { ProfileArchive, ProfileTimelineItem } from '../types';
import WeeklyGraph from './WeeklyGraph';

interface Props {
  data: ProfileArchive | null;
  userName: string;
  onClose: () => void;
  loading: boolean;
}

const ProfileScreen: React.FC<Props> = ({ data, userName, onClose, loading }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-emo-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="text-indigo-200 font-sans text-sm tracking-wide animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  const SectionCard = ({ 
    id, 
    title, 
    icon, 
    children, 
    accentColor = "indigo" 
  }: { 
    id: string; 
    title: string; 
    icon: string; 
    children: React.ReactNode; 
    accentColor?: string;
  }) => {
    const isExpanded = expandedSection === id;
    
    // Tailwind color mapping for borders/accents based on prop
    const borderClass = isExpanded 
      ? `border-${accentColor}-500/50` 
      : 'border-white/5';
    
    const bgClass = isExpanded
      ? 'bg-slate-800/80'
      : 'bg-slate-900/40 hover:bg-slate-800/60';

    return (
      <div 
        className={`rounded-2xl border ${borderClass} overflow-hidden transition-all duration-300 ${bgClass} backdrop-blur-md mb-3 shadow-sm`}
      >
        <button 
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-${accentColor}-500/10 flex items-center justify-center text-xl`}>
              {icon}
            </div>
            <span className="font-medium text-slate-200 text-lg">{title}</span>
          </div>
          <div className={`transform transition-transform duration-300 text-slate-500 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-5 pt-0 border-t border-white/5">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const TimelineView = ({ items }: { items: ProfileTimelineItem[] }) => (
    <div className="relative pl-4 space-y-4 border-l-2 border-slate-700/30 my-2">
      {items.map((item, idx) => (
        <div key={idx} className="relative pl-4">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-800 border-2 border-indigo-400"></div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-slate-300">{item.activity}</span>
            </div>
            <span className="text-xs font-mono text-slate-500 mt-1 sm:mt-0">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emo-dark animate-fade-in">
      
      <div className="max-w-md mx-auto min-h-screen pb-20 relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-emo-dark/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-20">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Profile Dashboard</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-2">

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 flex items-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-display font-bold text-white text-3xl">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{userName}</h1>
              <p className="text-indigo-300 text-xs uppercase tracking-wider font-medium">Gen Z Companion</p>
            </div>
          </div>

          {/* 1. Today's Overview */}
          <SectionCard id="overview" title="Day Overview" icon="📊" accentColor="indigo">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl">
                 <span className="text-slate-400 text-sm">Mood</span>
                 <span className="text-white font-medium">{data.overview.moodSummary}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Energy Level</span>
                  <span>{data.overview.energyLevel}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${data.overview.energyLevel}%` }}></div>
                </div>
              </div>

              <p className="text-slate-300 italic text-sm text-center border-t border-white/5 pt-3">
                "{data.overview.caption}"
              </p>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {data.overview.stats.map((stat, i) => (
                   <div key={i} className="bg-slate-800/30 p-2 rounded-lg text-center">
                     <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                     <div className="text-lg font-bold text-indigo-200">{stat.value}%</div>
                   </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 2. My Timetable */}
          <SectionCard id="timetable" title="My Timetable" icon="🗓️" accentColor="purple">
            <TimelineView items={data.timetable} />
          </SectionCard>

          {/* 3. Improvements Needed */}
          <SectionCard id="improvements" title="Improvements" icon="🌱" accentColor="emerald">
             <ul className="space-y-3">
               {data.improvements.map((imp, idx) => (
                 <li key={idx} className="flex items-start gap-3 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   <span className="text-sm text-slate-300">{imp}</span>
                 </li>
               ))}
             </ul>
          </SectionCard>

          {/* 4. Healthy Routine */}
          <SectionCard id="routine" title="Healthy Routine" icon="✨" accentColor="pink">
            <div className="mb-4 bg-pink-500/10 p-4 rounded-xl border border-pink-500/10">
              <p className="text-pink-200 text-sm italic text-center">"{data.healthyRoutine.motivation}"</p>
            </div>
            <TimelineView items={data.healthyRoutine.schedule} />
          </SectionCard>

          {/* 5. Daily Mistakes */}
          <SectionCard id="mistakes" title="Daily Notes" icon="📝" accentColor="orange">
             <div className="space-y-3">
               {data.mistakes.map((m, idx) => (
                 <div key={idx} className="bg-orange-500/5 p-3 rounded-xl border border-orange-500/10">
                   <p className="text-xs text-orange-300/70 mb-1">Slip-up: {m.slipUp}</p>
                   <p className="text-sm text-slate-200">Try: {m.correction}</p>
                 </div>
               ))}
               {data.mistakes.length === 0 && (
                 <p className="text-slate-500 text-sm text-center">No major notes for today. You're doing great.</p>
               )}
             </div>
          </SectionCard>

          {/* 6. Summary with Weekly Graph */}
          <SectionCard id="summary" title="Summary & Weekly Trends" icon="🏁" accentColor="blue">
             <div className="space-y-4">
               <div>
                 <h4 className="text-xs uppercase tracking-widest text-blue-400 mb-2">What went well</h4>
                 <p className="text-sm text-slate-300 bg-blue-900/10 p-3 rounded-xl border border-blue-500/10">
                   {data.dailySummary.wentWell}
                 </p>
               </div>
               <div>
                 <h4 className="text-xs uppercase tracking-widest text-indigo-400 mb-2">Tomorrow's Focus</h4>
                 <p className="text-sm text-slate-300 bg-indigo-900/10 p-3 rounded-xl border border-indigo-500/10">
                   {data.dailySummary.tryTomorrow}
                 </p>
               </div>
               
               {/* Weekly Graph Integration */}
               {data.weeklyGraph && (
                 <div className="mt-6 pt-4 border-t border-white/5">
                   <h4 className="text-xs uppercase tracking-widest text-indigo-300 mb-2 font-bold">Weekly Balance</h4>
                   <WeeklyGraph data={data.weeklyGraph} insights={data.graphInsights} />
                 </div>
               )}
             </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
