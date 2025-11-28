import React from 'react';
import { Language } from '../types';

interface Props {
  onSelect: (lang: Language) => void;
  userName: string;
  onBack: () => void;
}

const LanguageScreen: React.FC<Props> = ({ onSelect, userName, onBack }) => {
  const languages: { id: Language; label: string; native: string; sub: string }[] = [
    { id: 'english', label: 'English', native: 'Hello', sub: 'Let’s chat' },
    { id: 'hindi', label: 'Hindi', native: 'नमस्ते', sub: 'बातचीत करें' },
    { id: 'kannada', label: 'Kannada', native: 'ನಮಸ್ಕಾರ', sub: 'ಮಾತನಾಡೋಣ' },
  ];

  return (
    <div className="min-h-screen bg-emo-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background Ambience */}
       <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px]"></div>
       <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px]"></div>

       {/* Back Button */}
       <button 
         onClick={onBack}
         className="absolute top-6 left-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all group"
       >
         <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
         </svg>
       </button>

      <div className="relative z-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Welcome, {userName}
        </h2>
        <p className="text-slate-400 mb-10">Which language do you prefer?</p>

        <div className="grid grid-cols-1 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 text-left flex items-center justify-between overflow-hidden"
            >
              <div className="relative z-10">
                <span className="block text-2xl font-bold text-white mb-1 font-display">{lang.native}</span>
                <span className="text-sm text-slate-400 group-hover:text-indigo-200 transition-colors">{lang.label}</span>
              </div>
              
              <div className="relative z-10 w-10 h-10 rounded-full bg-slate-800 group-hover:bg-indigo-500 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageScreen;