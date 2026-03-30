"use client";

import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Users, Settings, Plus, Upload, X, Send, UserPlus, Trash2, MessageCircle
} from 'lucide-react';

interface Member {
  id: number;
  name: string;
  phone?: string;
  role?: string;
}

interface Group {
  id: number;
  name: string;
  members: Member[];
  createdAt: string;
}

export const ZaloInternal = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; time: string }[]>([]);

  useEffect(() => {
    const savedGroups = localStorage.getItem('zaloNoiBoGroups');
    if (savedGroups) setGroups(JSON.parse(savedGroups));
  }, []);

  useEffect(() => {
    localStorage.setItem('zaloNoiBoGroups', JSON.stringify(groups));
  }, [groups]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: Group = {
      id: Date.now(),
      name: newGroupName.trim(),
      members: [],
      createdAt: new Date().toLocaleString('vi-VN'),
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || selectedGroupId === null) return;
    const newMsg = {
      sender: 'Thầy/Cô',
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory([...chatHistory, newMsg]);
    setChatMessage('');
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b bg-white flex justify-between items-center">
            <h2 className="text-[11px] font-black uppercase text-blue-800 tracking-tighter">Nhóm Nội Bộ</h2>
            <button onClick={() => setShowSettingsModal(true)} className="p-1.5 hover:bg-slate-100 rounded-full"><Settings size={14}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all ${selectedGroupId === g.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-white'}`}
              >
                <div className="text-[12px] font-bold truncate">{g.name}</div>
                <div className={`text-[10px] ${selectedGroupId === g.id ? 'text-blue-100' : 'text-slate-400'}`}>{g.members.length} thành viên</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedGroup ? (
            <>
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-sm font-black text-slate-800">{selectedGroup.name}</h3>
                  <p className="text-[10px] text-slate-400">Hoạt động trong mạng lưới nội bộ trường</p>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full"><UserPlus size={12}/> THÊM</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'Thầy/Cô' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-[12px] shadow-sm ${msg.sender === 'Thầy/Cô' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                      {msg.text}
                      <div className="text-[9px] mt-1 opacity-60 text-right">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập nội dung trao đổi chuyên môn..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-[12px] focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button onClick={handleSendMessage} className="bg-blue-600 text-white p-2 px-4 rounded-xl hover:bg-blue-700 transition-all"><Send size={18}/></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <MessageCircle size={48} className="mb-2 opacity-20" />
              <p className="text-[11px] font-bold uppercase tracking-widest">Chọn phòng ban để thảo luận</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Settings */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-black text-slate-800 text-sm">QUẢN LÝ NHÓM</h3>
              <button onClick={() => setShowSettingsModal(false)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Tên nhóm mới</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    value={newGroupName} 
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm" 
                    placeholder="VD: Tổ Toán - Tin"
                  />
                  <button onClick={handleCreateGroup} className="bg-emerald-600 text-white px-4 rounded-xl text-[10px] font-black">TẠO</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};