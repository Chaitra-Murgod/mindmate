
import React, { useState, useRef, useEffect } from 'react';
import { AudioPayload } from '../services/gemini';

interface Props {
  onSend: (message: string, audio?: AudioPayload) => void;
  disabled: boolean;
  isCallActive?: boolean;
}

const ChatInput: React.FC<Props> = ({ onSend, disabled, isCallActive }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefer webm, fallback to default if not supported
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          onSend("", { base64: base64String, mimeType: mediaRecorder.mimeType });
        };
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-emo-dark via-emo-dark to-transparent pt-12 pb-6 px-4 z-10">
      <div className="max-w-2xl mx-auto relative">
        <div className="relative group">
          <div className={`absolute -inset-1 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm ${isCallActive ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 animate-pulse' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'}`}></div>
          <div className="relative bg-slate-900 rounded-2xl border border-white/10 flex items-end p-2 shadow-2xl">
            
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || isRecording}
              placeholder={isRecording ? "Listening..." : isCallActive ? "Call Session Active - Speak or Type..." : "How are you feeling right now?"}
              className="w-full bg-transparent text-white placeholder-slate-500 px-3 py-3 max-h-[120px] resize-none focus:outline-none text-base disabled:opacity-50 font-sans"
              rows={1}
            />

            {/* Mic Button */}
            {!text.trim() && (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                className={`mb-1 mr-1 p-2 rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : isCallActive ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isRecording ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            )}

            {/* Send Button */}
            {(text.trim() || isRecording) && !isRecording && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!text.trim() || disabled}
                className="mb-1 mr-1 p-2 rounded-xl bg-indigo-600 text-white disabled:bg-slate-700 disabled:text-slate-500 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95"
              >
                {disabled ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            )}

          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display">
            MINDMATE • Private • Stigma-Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
