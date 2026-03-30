"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Bot, Send, FileText, BarChart3, Users, 
  Lightbulb, ShieldCheck, RefreshCw, ClipboardList 
} from 'lucide-react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

const SchoolAdminAI = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<{role: string, text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async (command?: string) => {
    const promptText = command || input;
    if (!promptText.trim()) return;

    setIsLoading(true);
    // Lưu tin nhắn người dùng
    setChatLog(prev => [...prev, { role: 'user', text: promptText }]);
    if (!command) setInput('');

    try {
      // SỬ DỤNG MODEL PRO ĐỂ TƯ DUY SÂU HƠN
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      
      const systemInstruction = `
        Bạn là một Trợ lý Hiệu trưởng cao cấp tại Việt Nam. 
        Phong cách: Chuyên nghiệp, am hiểu luật giáo dục, ngôn từ chuẩn mực, tư duy chiến lược.
        Nhiệm vụ: Hỗ trợ viết kế hoạch, dự thảo báo cáo, phân tích tình huống sư phạm, và đưa ra giải pháp quản lý trường học.
      `;

      const result = await model.generateContent(systemInstruction + promptText);
      const response = await result.response.text();
      
      setChatLog(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'ai', text: "Lỗi kết nối bộ não AI, Thầy vui lòng thử lại!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickCommands = [
    { label: "Dự thảo Kế hoạch năm học", icon: <FileText size={16}/> },
    { label: "Phân tích bảng điểm lớp 6.1", icon: <BarChart3 size={16}/> },
    { label: "Kịch bản họp Phụ huynh", icon: <Users size={16}/> },
    { label: "Xử lý học sinh vi phạm", icon: <ShieldCheck size={16}/> }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#f1f5f9] min-h-[80vh] font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR: PHÍM TẮT NHANH */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200">
            <h3 className="font-black text-indigo-800 mb-4 flex items-center gap-2 uppercase text-xs">
              <Lightbulb size={18} className="text-yellow-500"/> Gợi ý cho Hiệu trưởng
            </h3>
            <div className="space-y-2">
              {quickCommands.map((cmd, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleAskAI(cmd.label)}
                  className="w-full text-left p-3 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-sm transition-all flex items-center gap-2 border border-transparent hover:border-indigo-100"
                >
                  {cmd.icon} {cmd.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900 p-5 rounded-sm text-white shadow-lg">
            <h4 className="font-black text-sm mb-2 flex items-center gap-2">
              <Bot size={20} className="text-cyan-400"/> AI PRO v1.5
            </h4>
            <p className="text-[10px] opacity-70 leading-relaxed">
              Hệ thống đang sử dụng trí tuệ nhân tạo chuyên sâu để hỗ trợ công tác quản lý Ban Giám Hiệu.
            </p>
          </div>
        </div>

        {/* KHUNG CHAT CHÍNH */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-sm shadow-sm border border-slate-200 h-[700px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-sm flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
                <ClipboardList size={24} />
              </div>
              <div>
                <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">Trợ lý Chiến lược BGH</h2>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Đang trực tuyến
                </p>
              </div>
            </div>
            <button onClick={() => setChatLog([])} className="text-slate-400 hover:text-red-500 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>

          {/* NỘI DUNG CHAT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {chatLog.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <Bot size={80} strokeWidth={1} className="mb-4 opacity-20"/>
                <p className="font-bold uppercase tracking-widest text-xs">Chào Thầy Hiệu trưởng! Con có thể giúp gì cho công việc quản lý hôm nay?</p>
              </div>
            )}
            {chatLog.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-sm shadow-sm ${
                  chat.role === 'user' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'bg-white text-slate-700 border border-slate-200 leading-relaxed'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-sm border border-slate-200 flex items-center gap-3">
                  <RefreshCw className="animate-spin text-indigo-600" size={18} />
                  <span className="text-xs font-bold text-slate-400">AI đang suy nghĩ và dự thảo văn bản...</span>
                </div>
              </div>
            )}
          </div>

          {/* Ô NHẬP LIỆU */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Thầy nhập yêu cầu (VD: Viết giúp tôi kế hoạch trực tuần...)"
                className="flex-1 p-4 bg-slate-100 rounded-sm border-transparent focus:bg-white focus:border-indigo-500 outline-none font-medium text-sm transition-all"
              />
              <button 
                onClick={() => handleAskAI()}
                disabled={isLoading}
                className="bg-indigo-700 text-white px-6 rounded-sm font-black hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-lg"
              >
                <Send size={18} /> GỬI
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchoolAdminAI;