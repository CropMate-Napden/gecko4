
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../types';
import { chatWithGemini } from '../services/geminiService';
import { t } from '../i18n';

interface ChatProps {
  user: User | null;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lang = user?.language || 'en';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithGemini(newMessages, lang);
      setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Error. Try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 h-[80vh] flex flex-col animate-in">
      <div className="bg-white border-2 border-emerald-600/10 rounded-[2.5rem] flex-1 flex flex-col overflow-hidden shadow-xl">
        <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
          <h2 className="font-black uppercase tracking-widest">{t('chat', lang)}</h2>
          <span className="text-[10px] font-black uppercase opacity-60">Session Active</span>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <span className="text-4xl mb-4 text-emerald-600">🌱</span>
              <p className="font-black text-black uppercase tracking-widest">Awaiting Command</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-6 py-4 rounded-3xl font-bold text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-emerald-50 text-black rounded-tl-none'
              }`}>
                {m.parts[0].text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-emerald-600 font-black text-[10px] uppercase animate-pulse">Calculating Response...</div>}
        </div>

        <div className="p-6 bg-emerald-50/50 border-t-2 border-emerald-600/5">
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-white border-2 border-emerald-600/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-600 transition-all font-bold text-black"
            />
            <button 
              onClick={handleSend}
              className="bg-emerald-600 text-white px-8 rounded-2xl font-black shadow-lg active:scale-95 transition-all uppercase"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
