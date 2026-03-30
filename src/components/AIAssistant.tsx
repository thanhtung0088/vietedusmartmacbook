"use client";
import React, { useState } from 'react';
import { X, Send, Loader2, Sparkles, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Chào Thầy/Cô! Em là Gemini 3.0. Em đã sẵn sàng hỗ trợ Thầy/Cô trên Dashboard rồi đây! 🤖✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(input);
      setMessages(prev => [...prev, { role: 'ai', content: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Kết nối của em hơi chậm, Thầy/Cô thử lại nhé! 😅' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-[9999]">
        <button onClick={() => setIsOpen(true)} className="relative w-20 h-20 group focus:outline-none">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(37,99,235,0.6)] border-4 border-white transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 animate-float">
            <Bot size={42} className="text-white group-hover:animate-wink" />
            <div className="absolute -top-1 -right-1">
              <Sparkles size={16} className="text-yellow-300 animate-bounce" />
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-100 z-[9999] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <Bot size={28} className="text-white" />
          </div>
          <h3 className="text-white font-black text-lg uppercase tracking-tighter">Gemini 3.0</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-2"><X size={20} /></button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-[12px] font-bold ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-200/50'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Thầy/Cô cần em hỗ trợ gì ạ? 💬" className="flex-1 bg-transparent outline-none text-slate-700 text-xs font-bold px-3" />
          <button onClick={handleSend} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};