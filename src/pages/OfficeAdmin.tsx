"use client";
import React, { useState } from 'react';
import { 
  Calculator, FileText, Monitor, HeartPulse, 
  HardDrive, Library, ShieldCheck, 
  X, Search, MessageCircle, Briefcase, 
  GraduationCap, UserCheck, Sparkles,
  ChevronRight, FileSpreadsheet, Printer, Send, CheckCircle
} from 'lucide-react';

const officeSections = [
  { id: 'ketoan', label: 'Kế toán - Tài vụ', icon: <Calculator size={14} />, color: 'border-l-rose-500', bg: 'bg-rose-50', textColor: 'text-rose-700' },
  { id: 'vanthu', label: 'Văn thư - Học vụ', icon: <FileText size={14} />, color: 'border-l-blue-500', bg: 'bg-blue-50', textColor: 'text-blue-700' },
  { id: 'cntt', label: 'Công nghệ thông tin', icon: <Monitor size={14} />, color: 'border-l-cyan-500', bg: 'bg-cyan-50', textColor: 'text-cyan-700' },
  { id: 'yte', label: 'Y tế học đường', icon: <HeartPulse size={14} />, color: 'border-l-emerald-500', bg: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { id: 'thietbi', label: 'Thiết thiết bị dạy học', icon: <HardDrive size={14} />, color: 'border-l-orange-500', bg: 'bg-orange-50', textColor: 'text-orange-700' },
  { id: 'thuvien', label: 'Thư viện số', icon: <Library size={14} />, color: 'border-l-purple-500', bg: 'bg-purple-50', textColor: 'text-purple-700' },
  { id: 'tuvan', label: 'Tư vấn học đường', icon: <MessageCircle size={14} />, color: 'border-l-indigo-500', bg: 'bg-indigo-50', textColor: 'text-indigo-700' },
  { id: 'doantthe', label: 'Đoàn - Đội - Hội', icon: <GraduationCap size={14} />, color: 'border-l-red-500', bg: 'bg-red-50', textColor: 'text-red-700' },
  { id: 'baove', label: 'An ninh - Bảo vệ', icon: <ShieldCheck size={14} />, color: 'border-l-slate-500', bg: 'bg-slate-50', textColor: 'text-slate-700' },
  { id: 'phucvu', label: 'Phục vụ - Tạp vụ', icon: <UserCheck size={14} />, color: 'border-l-amber-500', bg: 'bg-amber-50', textColor: 'text-amber-700' },
{ id: 'giamthi', label: 'Giám thị', icon: <UserCheck size={14} />, color: 'border-l-amber-500', bg: 'bg-amber-50', textColor: 'text-amber-700' }
];

export const OfficeAdmin: React.FC = () => {
  const [active, setActive] = useState(officeSections[0]);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendToAdmin = () => {
    setIsSending(true);
    // Mô phỏng quá trình đóng gói và gửi dữ liệu lên Quản trị trường (Báo cáo tổng hợp)
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
      alert(`Đã gửi trình duyệt báo cáo bộ phận ${active.label} về mục Báo cáo tổng hợp thành công!`);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden p-2 animate-in fade-in duration-500">
      <div className="flex gap-3 h-full items-stretch">
        
        {/* Sidebar Nghiệp vụ */}
        <div className="w-56 flex flex-col gap-1.5 bg-white rounded-2xl border border-slate-200 p-2 shadow-sm shrink-0 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-4 border-b border-slate-50 mb-2">
            <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-blue-600" />
              Nghiệp vụ Hành chính
            </h2>
          </div>
          
          {officeSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => { setActive(sec); setIsSent(false); }}
              className={`group flex items-center justify-between p-2.5 rounded-xl transition-all border-l-4 shadow-sm ${
                active.id === sec.id 
                ? `${sec.color} ${sec.bg} translate-x-1` 
                : 'border-l-transparent hover:bg-slate-50 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={active.id === sec.id ? sec.textColor : 'text-slate-400 group-hover:text-slate-600 transition-colors'}>
                  {sec.icon}
                </span>
                <span className={`text-[8px] font-black uppercase tracking-tight ${
                  active.id === sec.id ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {sec.label}
                </span>
              </div>
              {active.id === sec.id && <ChevronRight size={10} className={sec.textColor} />}
            </button>
          ))}
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative">
          
          {/* Toolbar */}
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${active.bg} ${active.textColor} shadow-sm border border-white`}>
                {active.icon}
              </div>
              <div>
                <h1 className="text-[11px] font-black uppercase text-slate-800 tracking-tighter">
                  Hồ sơ chuyên môn: <span className="text-blue-700 underline decoration-blue-200">{active.label}</span>
                </h1>
                <p className="text-[7px] font-bold text-slate-400 uppercase italic">Cập nhật theo thông tư 5512 & quy định hiện hành</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSendToAdmin}
                disabled={isSending}
                className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all flex items-center gap-2 italic shadow-lg shadow-blue-100 ${
                  isSent 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSending ? (
                  <span className="flex items-center gap-2 italic"><div className="w-2 h-2 border-2 border-white border-t-transparent animate-spin rounded-full" /> Đang gửi...</span>
                ) : isSent ? (
                  <><CheckCircle size={12} /> Đã trình duyệt</>
                ) : (
                  <><Send size={12} /> Gửi trình duyệt</>
                )}
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 text-[8px] font-black uppercase rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 italic shadow-sm">
                <Printer size={12} /> In biểu mẫu
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-5">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                   <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                     <Search size={12} className="text-blue-500" />
                     Văn bản thực hiện tại bộ phận
                   </h3>
                </div>
                
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="group flex justify-between items-center p-2.5 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          0{i}
                        </div>
                        <span className="text-[9px] text-slate-600 font-bold group-hover:text-slate-900 uppercase">File hồ sơ minh chứng {i}</span>
                      </div>
                      <FileText size={12} className="text-slate-300 group-hover:text-blue-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className={`p-4 rounded-2xl border border-dashed ${active.color} ${active.bg} flex flex-col items-center justify-center text-center py-10`}>
                   <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${active.textColor} shadow-xl mb-3`}>
                     {active.icon}
                   </div>
                   <h4 className={`text-[10px] font-black uppercase ${active.textColor}`}>Cổng nạp báo cáo {active.label}</h4>
                   <p className="text-[8px] text-slate-500 font-medium max-w-[180px] mt-2 italic">
                     Nhấn nút trình duyệt phía trên để đồng bộ dữ liệu về mục "Báo cáo tổng hợp" trên trang chủ quản trị.
                   </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl shadow-xl">
                   <h3 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">Trạng thái đồng bộ</h3>
                   <div className="space-y-2 text-[7px] text-slate-400 font-bold uppercase">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSent ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                        Kết nối Quản trị trường: {isSent ? 'Đã gửi trình duyệt' : 'Sẵn sàng'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        VietEdu ID: #HC-2026-X
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-6 text-[7px] font-black text-slate-400 uppercase italic tracking-widest">
              <span>Hệ thống đồng bộ văn phòng v5.0.3</span>
              <div className="flex gap-4 text-blue-600">
                <span className="text-emerald-600 underline">Bộ phận: {active.label}</span>
                <span className="text-rose-600">Luồng gửi: Báo cáo tổng hợp</span>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default OfficeAdmin;