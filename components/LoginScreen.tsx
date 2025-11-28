import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && contact.trim()) {
      onLogin({ name, contact });
    }
  };

  return (
    <div className="min-h-screen bg-emo-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-900/20 rounded-full blur-[120px] animate-float"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 animate-float">
            <span className="font-display font-bold text-white text-4xl">M</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-2 tracking-tight">MINDMATE</h1>
          <p className="text-slate-400 font-sans text-center max-w-xs">Your personal AI companion for mental wellness.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="What should we call you?"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Phone or Email</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="How can we reach you?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !contact.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Journey
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-xs text-slate-500">
          By continuing, you agree to our Terms. MindMate is not a replacement for professional therapy.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;