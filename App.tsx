
import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToEmotionOS, initializeChat, AudioPayload, generateProfileArchive } from './services/gemini';
import { Message, EmotionResponse, User, Language, ProfileArchive, DailyGraphItem } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoginScreen from './components/LoginScreen';
import LanguageScreen from './components/LanguageScreen';
import ProfileScreen from './components/ProfileScreen';
import DailyGraph from './components/DailyGraph';

// Helper to get initial greeting based on language
const getInitialGreeting = (lang: Language, name: string): EmotionResponse => {
  const greetings: Record<Language, string> = {
    english: `Hi ${name}! I’m MINDMATE. I’m here to listen, support, and help you find your calm. How are you feeling right now?`,
    hindi: `नमस्ते ${name}! मैं MINDMATE हूँ। मैं यहाँ हूँ आपकी बात सुनने, साथ देने और शांति पाने में आपकी मदद करने के लिए। आप अभी कैसा महसूस कर रहे हैं?`,
    kannada: `ನಮಸ್ಕಾರ ${name}! ನಾನು MINDMATE. ನಿಮ್ಮ ಮಾತನ್ನು ಕೇಳಲು, ಬೆಂಬಲ ನೀಡಲು ಮತ್ತು ನಿಮ್ಮ ಮನಃಶಾಂತಿಯನ್ನು ಕಂಡುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಲು ನಾನಿದ್ದೇನೆ. ನೀವು ಈಗ ಹೇಗೆ ಭಾವಿಸುತ್ತಿದ್ದೀರಿ?`
  };

  const ritualTitles: Record<Language, string> = {
    english: "Arrival Breath",
    hindi: "आगमन साँस",
    kannada: "ಆಗಮನದ ಉಸಿರು"
  };

  const steps: Record<Language, string[]> = {
    english: ["Close your eyes", "Drop your shoulders", "Take a deep breath in", "Let it go"],
    hindi: ["अपनी आँखें बंद करें", "कंधों को ढीला छोड़ें", "गहरी साँस लें", "जाने दें"],
    kannada: ["ಕಣ್ಣು ಮುಚ್ಚಿ", "ಭುಜಗಳನ್ನು ಸಡಿಲಿಸಿ", "ದೀರ್ಘ ಉಸಿರನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ", "ಬಿಟ್ಟುಬಿಡಿ"]
  };

  const forecasts: Record<Language, string> = {
    english: "The soil is ready for new seeds.",
    hindi: "मिट्टी नए बीजों के लिए तैयार है।",
    kannada: "ಮಣ್ಣು ಹೊಸ ಬೀಜಗಳಿಗೆ ಸಿದ್ಧವಾಗಿದೆ."
  };

  return {
    architecture: {
      tree: {
        leafColor: "#10b981",
        health: "blooming",
        flowerCount: 1,
        summary: "A fresh sapling ready to grow."
      },
      pages: [
        { 
          title: "Morning Mood", 
          content: "The garden is quiet and open, waiting for the first light of your thoughts.", 
          type: "morning" 
        },
        { 
          title: "Sky Mood Scanner", 
          content: "A soft blue sky, clear and waiting for your story.", 
          type: "sky",
          skyWeather: "sunny"
        },
        { 
          title: "Energy Growth", 
          content: "Steady and rising.", 
          type: "energy", 
          energyLevel: 65 
        },
        { 
          title: "Uplift Moments", 
          content: "Connection established.", 
          type: "uplift", 
          tags: ["New Beginning", "Openness"] 
        },
        { 
          title: "Guidance", 
          content: "Let's start by simply being here. No pressure to bloom immediately.", 
          type: "guidance" 
        }
      ]
    },
    reply: greetings[lang],
    neuroloop: {
      title: ritualTitles[lang],
      steps: steps[lang],
      duration: "20s"
    },
    vibeForecast: forecasts[lang],
    dailyGraph: [
      { label: "Happy", value: 30 },
      { label: "Sad", value: 0 },
      { label: "Stressed", value: 10 },
      { label: "Calm", value: 60 },
      { label: "Angry", value: 0 }
    ]
  };
};

type AppStep = 'login' | 'language' | 'chat';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('login');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('english');

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Feature Logic State
  const [hasShownRitual, setHasShownRitual] = useState(false);
  const [isCallSession, setIsCallSession] = useState(false);
  const [dailyGraphData, setDailyGraphData] = useState<DailyGraphItem[]>([]);

  // Profile State
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileArchive | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Initialize Chat when entering the chat step
  useEffect(() => {
    if (step === 'chat' && user) {
      const startChat = async () => {
        try {
          await initializeChat(language, user.name);
          const greeting = getInitialGreeting(language, user.name);
          
          setMessages([
            {
              id: 'init-1',
              role: 'model',
              content: greeting,
              timestamp: Date.now(),
            },
          ]);
          setHasShownRitual(true);
          setDailyGraphData(greeting.dailyGraph);
          setIsInitialized(true);
        } catch (e) {
          console.error("Failed to init chat", e);
        }
      };
      startChat();
    }
  }, [step, user, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setStep('language');
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStep('chat');
  };

  const handleBack = () => {
    if (step === 'language') {
      setStep('login');
    } else if (step === 'chat') {
      setStep('language');
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    if (language === 'hindi') utterance.lang = 'hi-IN';
    if (language === 'kannada') utterance.lang = 'kn-IN';

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string, audio?: AudioPayload) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: audio ? "🎤 Voice Message" : text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const response = await sendMessageToEmotionOS(text, audio);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: response,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, modelMsg]);
    setLoading(false);

    if (response.dailyGraph) {
      setDailyGraphData(response.dailyGraph);
    }

    if (!hasShownRitual && response.neuroloop) {
      setHasShownRitual(true);
    }

    if (isCallSession) {
      speakText(response.reply);
    }
  };

  const triggerTherapySession = () => {
    handleSend("Therapy Session");
  };

  const toggleCallSession = () => {
    const newState = !isCallSession;
    setIsCallSession(newState);
    if (!newState) {
      window.speechSynthesis.cancel();
    }
  };

  const handleOpenProfile = async () => {
    if (!user) return;
    setShowProfile(true);
    setProfileLoading(true);
    
    const historyText = messages.map(m => {
      const content = typeof m.content === 'string' ? m.content : (m.content as EmotionResponse).reply;
      return `${m.role}: ${content}`;
    }).join('\n');

    const data = await generateProfileArchive(user.name, historyText);
    setProfileData(data);
    setProfileLoading(false);
  };

  if (step === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (step === 'language') {
    return <LanguageScreen onSelect={handleLanguageSelect} userName={user?.name || ''} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-emo-dark text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[80px] animate-pulse-slow"></div>
      </div>

      <header className="fixed top-0 w-full bg-emo-dark/80 backdrop-blur-xl border-b border-white/5 z-20 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <button onClick={handleOpenProfile} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all">
              <span className="font-display font-bold text-white text-lg">{user?.name ? user.name.charAt(0).toUpperCase() : 'M'}</span>
            </div>
            <div className="flex flex-col items-start">
               <span className="font-display font-bold text-lg text-white tracking-tight leading-none group-hover:text-indigo-300 transition-colors">
                  {user?.name || "MINDMATE"}
               </span>
               <span className="text-[10px] text-slate-400 leading-none mt-0.5 group-hover:text-indigo-200 transition-colors">Tap for Profile</span>
            </div>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
              onClick={toggleCallSession}
              className={`p-2 rounded-full transition-all duration-300 ${isCallSession ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              title="Call Session"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>

            <button 
              onClick={triggerTherapySession}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 transition-colors"
            >
              🛋️ Therapy
            </button>
        </div>
      </header>

      {/* Daily Graph Widget - Floating Top Right */}
      {isInitialized && dailyGraphData.length > 0 && (
         <div className="fixed top-20 right-4 z-10 animate-fade-in-down">
           <DailyGraph data={dailyGraphData} />
         </div>
      )}

      {showProfile && (
        <ProfileScreen 
          data={profileData} 
          userName={user?.name || 'Friend'} 
          onClose={() => setShowProfile(false)} 
          loading={profileLoading} 
        />
      )}

      <main className="relative z-0 max-w-2xl mx-auto pt-24 pb-32 px-4 min-h-screen flex flex-col justify-end">
        {!isInitialized ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
             <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
             <p className="text-slate-500 font-display text-sm tracking-widest uppercase animate-pulse">
               {language === 'kannada' ? 'ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...' : language === 'hindi' ? 'कनेक्ट हो रहा है...' : 'Connecting...'}
             </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isLast={idx === messages.length - 1} 
                showRitual={msg.role === 'model' && (msg.id === 'init-1' || msg.content.toString().toLowerCase().includes("ritual"))}
              />
            ))}
            
            {loading && (
              <div className="flex items-center gap-3 mb-8 pl-4 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono">MINDMATE...</span>
              </div>
            )}
            
            <div ref={scrollRef} />
          </>
        )}
      </main>

      <ChatInput onSend={handleSend} disabled={loading || !isInitialized} isCallActive={isCallSession} />
    </div>
  );
};

export default App;
