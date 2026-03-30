"use client";

import React, { useState } from 'react';
import { 
  Users, Star, ShieldAlert, Heart, Flag, 
  Upload, Send, Search, Sparkles, X, 
  FileSpreadsheet, Award, Landmark, ScrollText,
  ChevronRight, Printer, CheckCircle2, Loader2
} from 'lucide-react';

const organizationSections = [
  { id: 'congdoan', label: 'Công đoàn', icon: <Landmark size={14} />, color: 'border-l-rose-500', bg: 'bg-rose-50/50', textColor: 'text-rose-700', tools: ['Kế hoạch năm học', 'Danh sách công đoàn viên', 'Quỹ tương trợ', 'Thi đua - Khen thưởng'] },
  { id: 'chidoan', label: 'Chi đoàn', icon: <Star size={14} />, color: 'border-l-blue-500', bg: 'bg-blue-50/50', textColor: 'text-blue-700', tools: ['Đại hội Chi đoàn', 'Phát triển Đoàn viên', 'Công trình thanh niên', 'Hồ sơ đoàn viên'] },
  { id: 'liendoi', label: 'Liên đội', icon: <Flag size={14} />, color: 'border-l-emerald-500', bg: 'bg-emerald-50/50', textColor: 'text-emerald-700', tools: ['Chương trình rèn luyện đội viên', 'Sổ chi đội', 'Phong trào kế hoạch nhỏ', 'Đại hội Liên đội'] },
  { id: 'chuthapdo', label: 'Hội Chữ thập đỏ', icon: <Heart size={14} />, color: 'border-l-red-600', bg: 'bg-red-50/50', textColor: 'text-red-700', tools: ['Hoạt động nhân đạo', 'Hiến máu tình nguyện', 'Hỗ trợ học sinh nghèo', 'Quỹ từ thiện'] },
  { id: 'xungkich', label: 'Đội GV Xung kích', icon: <ShieldAlert size={14} />, color: 'border-l-indigo-600', bg: 'bg-indigo-50/50', textColor: 'text-indigo-700', tools: ['Lịch trực bảo vệ', 'An ninh trường học', 'Phòng chống tệ nạn', 'Đội phản ứng nhanh'] },
  { id: 'thidua', label: 'Thi đua - Khen thưởng', icon: <Award size={14} />, color: 'border-l-amber-500', bg: 'bg-amber-50/50', textColor: 'text-amber-700', tools: ['Tổng hợp thi đua tuần', 'Hồ sơ khen thưởng', 'Bình xét cuối kỳ', 'Lịch sử thành tích'] },
];

export const DoanThe: React.FC = () => {
  const [activeOrg, setActiveOrg] = useState(organizationSections[0]);
  const [isExcelModal, setIsExcelModal] = useState(false);
  const [pastedData, setPastedData] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Xử lý gửi báo cáo trình duyệt về Quản trị trường
  const handleSendToAdmin = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
      alert(`Đã gửi báo cáo trình duyệt của ${activeOrg.label} về mục Báo cáo tổng hợp.`);
    }, 1500);
  };

  const handleImportExcel = () => {
    if(!pastedData.trim()) return;
    alert(`Dữ liệu Excel đã được nạp vào hồ sơ ${activeOrg.label}!`);
    setIsExcelModal(false);
    setPastedData('');
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden p-2 animate-in fade-in duration-500">
      <div className="flex gap-3 h-full items-stretch">
        
        {/* Sidebar Đoàn thể */}
        <div className="w-56 flex flex-col gap-1.5 bg-white rounded-xl border border-slate-200 p-2 shadow-sm shrink-0 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-4 border-b border-slate-50 mb-2">
            <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-blue-600" />
              Công tác Đoàn thể
            </h2>
          </div>
          
          {organizationSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => { setActiveOrg(sec); setIsSent(false); }}
              className={`group flex items-center justify-between p-2.5 rounded-xl transition-all border-l-4 shadow-sm ${
                activeOrg.id === sec.id 
                ? `${sec.color} ${sec.bg} translate-x-1` 
                : 'border-l-transparent hover:bg-slate-50 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeOrg.id === sec.id ? sec.textColor : 'text-slate-400 group-hover:text-slate-600'}>
                  {sec.icon}
                </span>
                <span className={`text-[8px] font-black uppercase tracking-tight ${
                  activeOrg.id === sec.id ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {sec.label}
                </span>
              </div>
              {activeOrg.id === sec.id && <ChevronRight size={10} className={sec.textColor} />}
            </button>
          ))}
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden relative">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white ${activeOrg.textColor} shadow-md border border-slate-100`}>
                {activeOrg.icon}
              </div>
              <div>
                <h1 className="text-[11px] font-black uppercase text-slate-800 tracking-tighter">
                  Nghiệp vụ: <span className="text-blue-700 underline decoration-blue-200">{activeOrg.label}</span>
                </h1>
                <p className="text-[7px] font-bold text-slate-400 uppercase italic">Số hóa công tác phong trào & thi đua</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSendToAdmin}
                disabled={isSending}
                className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all flex items-center gap-2 italic shadow-lg ${
                  isSent 
                  ? 'bg-emerald-600 text-white shadow-emerald-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                }`}
              >
                {isSending ? (
                  <><Loader2 size={12} className="animate-spin" /> Đang đồng bộ...</>
                ) : isSent ? (
                  <><CheckCircle2 size={12} /> Đã trình duyệt</>
                ) : (
                  <><Send size={12} /> Gửi trình duyệt</>
                )}
              </button>
              <button onClick={() => setIsExcelModal(true)} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 text-[8px] font-black uppercase rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 italic shadow-sm">
                <FileSpreadsheet size={12} /> Nhập Excel
              </button>
            </div>
          </div>
          
          {/* Main Area */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                    <Sparkles size={12} className="text-blue-500" />
                    Hồ sơ đề xuất trình duyệt
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {activeOrg.tools.map((tool, index) => (
                      <div key={index} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200">
                        <span className="text-[9px] font-bold text-slate-600 transition-colors">{tool}</span>
                        <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 p-5 rounded-xl shadow-xl relative overflow-hidden">
                   <div className="relative z-10">
                     <h3 className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Trạng thái báo cáo</h3>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-[8px]">
                          <span className="text-slate-400 font-bold uppercase">Luồng chuyển dữ liệu</span>
                          <span className="text-white font-black italic">Trang Quản trị {'>'} Báo cáo tổng hợp</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${isSent ? 'w-full bg-emerald-500' : 'w-1/3 bg-blue-500 animate-pulse'}`}></div>
                        </div>
                        <p className="text-[7px] text-slate-500 italic mt-2 uppercase">
                          {isSent ? "Hồ sơ đã được gửi thành công" : "Sẵn sàng gửi dữ liệu trình duyệt"}
                        </p>
                     </div>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                   <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-3 border-b pb-2">Văn bản hoạt động tuần này</h3>
                   <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between p-2 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <ScrollText size={12} className="text-slate-400" />
                            <span className="text-[8px] font-bold text-slate-600 italic uppercase">Minh chứng hoạt động mẫu {i}</span>
                          </div>
                          <button className="text-[8px] font-black text-blue-600 uppercase hover:underline">Chi tiết</button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-6">
             <span className="text-[7px] font-black text-slate-400 uppercase italic tracking-widest">VietEdu Social Platform v5.0.3</span>
             <div className="flex items-center gap-4">
                <span className="text-[7px] font-black text-slate-400 uppercase italic">Người duyệt: Hiệu trưởng</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[7px] font-black text-emerald-600 uppercase italic tracking-widest">Hệ thống bảo mật AES-256</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Excel Modal */}
      {isExcelModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                 <FileSpreadsheet size={18} className="text-emerald-600" />
                 <h3 className="font-black text-slate-800 uppercase text-xs">Nhập hồ sơ {activeOrg.label} từ Excel</h3>
              </div>
              <button onClick={() => setIsExcelModal(false)} className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all"><X size={20} /></button>
            </div>
            <div className="p-6">
              <textarea
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
                className="w-full h-48 p-4 border border-slate-200 rounded-lg bg-slate-50 font-mono text-[10px] focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                placeholder="Dán dữ liệu cột Excel tại đây..."
              />
              <button onClick={handleImportExcel} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                Xác nhận nạp dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoanThe;