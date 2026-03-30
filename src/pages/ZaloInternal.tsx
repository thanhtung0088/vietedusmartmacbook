"use client";
import React, { useState } from 'react';
import { Send, Paperclip, Search, CheckCheck } from 'lucide-react';

export const ZaloInternal: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào Thầy/Cô, tổ Toán đã gửi dự thảo kế hoạch tuần 24.", sender: "Cô Lan (VP)", time: "08:15" },
    { id: 2, text: "Tôi đã nhận được, cảm ơn cô.", sender: "me", time: "08:20" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputText, sender: "me", time: "Vừa xong" }]);
    setInputText("");
  };

  return (
    <div className="flex h-full bg-white rounded-md border border-slate-300 overflow-hidden shadow-sm">
      <div className="w-40 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
        <div className="p-0.5 bg-white border-b border-slate-100">
          <input className="w-full px-1 py-0.5 bg-slate-100 rounded-md text-[6px] outline-none" placeholder="Tìm..." />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-1 flex items-center gap-1 bg-blue-50 border-l-2 border-blue-600">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[5px] font-black">T</div>
            <div className="overflow-hidden">
              <div className="text-[6px] font-black truncate uppercase">TỔ TOÁN</div>
              <div className="text-[5px] text-blue-600 truncate">Cô Lan: Đã gửi...</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#E2E9F1]">
        <div className="p-0.5 bg-white border-b border-slate-200 flex items-center gap-1">
          <div className="text-[6px] font-black uppercase px-1 py-0.5 text-slate-700 tracking-tighter">HỘI HỘI NỘI BỘ</div>
        </div>
        <div className="flex-1 p-1 overflow-y-auto space-y-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-1 rounded-md text-[6px] ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white text-slate-800 border'}`}>
                <p className="leading-tight font-medium">{msg.text}</p>
                <div className="text-[5px] mt-0.5 flex justify-end opacity-70 italic">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-1 bg-white border-t flex items-center gap-1">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 py-0.5 text-[6px] outline-none font-bold" 
            placeholder="Tin nhắn..." 
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-0.5 rounded-full"><Send size={8}/></button>
        </div>
      </div>
    </div>
  );
};
export default ZaloInternal;