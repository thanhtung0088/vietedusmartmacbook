"use client";

import React, { useState, useRef } from 'react';
import { 
  FileUp, Send, X, Loader2, FileText, GraduationCap, 
  Users, BookOpen, Gavel, Download, Maximize2, ShieldCheck,
  CheckCircle2, Edit3
} from 'lucide-react';
import mammoth from "mammoth";

// Định nghĩa dữ liệu Tabs
const tabs = [
  { id: 'Kế hoạch trường', icon: <GraduationCap size={16} />, color: 'from-blue-600 to-cyan-500' },
  { id: 'Kế hoạch tổ', icon: <Users size={16} />, color: 'from-indigo-600 to-purple-500' },
  { id: 'Kế hoạch cá nhân', icon: <FileText size={16} />, color: 'from-emerald-600 to-teal-500' },
  { id: 'PPCT', icon: <BookOpen size={16} />, color: 'from-amber-600 to-orange-500' },
  { id: 'Văn bản mới', icon: <Gavel size={16} />, color: 'from-rose-600 to-pink-500' }
];

export const SchoolPlan: React.FC = () => {
  const [active, setActive] = useState(tabs[2].id);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fileContent, setFileContent] = useState({ name: '', html: '' });
  
  const quickOpenRef = useRef<HTMLInputElement>(null);
  const uploadNewRef = useRef<HTMLInputElement>(null);

  // Hàm xử lý chuyển đổi Word sang HTML
  const processFile = async (file: File) => {
    if (file.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          // mammoth giữ lại cấu trúc bảng và định dạng cơ bản
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setFileContent({ name: file.name, html: result.value });
          setShowModal(true);
        } catch (err) {
          alert("Lỗi: Không thể đọc nội dung file Word!");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Hệ thống yêu cầu file định dạng .docx");
    }
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowModal(false);
      alert(`Đã lưu bản chỉnh sửa và gửi "${fileContent.name}" thành công!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. THANH TABS QUẢN TRỊ */}
      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all border ${
                active === t.id
                  ? `bg-gradient-to-br ${t.color} border-white/20 text-white shadow-lg scale-105`
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {t.icon}
              <span className="text-[10px] font-black uppercase tracking-tight">{t.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. KHÔNG GIAN LÀM VIỆC */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl min-h-[550px] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">{active}</h2>
              <p className="text-[9px] text-indigo-400 font-bold uppercase italic">Hệ thống biên tập hồ sơ trực tuyến</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input type="file" ref={uploadNewRef} className="hidden" accept=".docx" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            <button onClick={() => alert("Chức năng gửi duyệt hàng loạt...")} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all shadow-xl">
              <CheckCircle2 size={18} /> Gửi trình duyệt
            </button>
            <button onClick={() => uploadNewRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all shadow-xl">
              <FileUp size={18} /> Tải hồ sơ mới
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <input type="file" ref={quickOpenRef} className="hidden" accept=".docx" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 p-5 rounded-xl hover:bg-white/[0.08] transition-all group">
              <div className="p-3 bg-blue-500/10 text-blue-400 w-fit rounded-lg mb-4">
                <FileText size={20} />
              </div>
              <h4 className="text-[12px] font-black text-white uppercase mb-1 truncate">Kehoach_Chuyenmon_0{i}.docx</h4>
              <p className="text-[8px] text-slate-500 font-bold mb-5 uppercase tracking-tighter italic">Cập nhật: 13/03/2026</p>
              <div className="flex gap-2">
                 <button onClick={() => quickOpenRef.current?.click()} className="flex-1 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-[9px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">Mở nhanh</button>
                 <button className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"><Download size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MODAL BIÊN TẬP VĂN BẢN (TRÌNH CHIẾU & CHỈNH SỬA) */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white w-[98vw] h-[96vh] rounded-xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-white/20">
            
            {/* Header Modal */}
            <div className="p-4 border-b bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow-lg animate-pulse"><Edit3 size={20} /></div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest">{fileContent.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <p className="text-[8px] text-emerald-400 font-bold uppercase italic tracking-widest">Chế độ: Soạn thảo trực tiếp (Live Editor)</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={handleSend} disabled={isSending} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all shadow-lg active:scale-95">
                  {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Lưu & Gửi duyệt
                </button>
                <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* VÙNG SOẠN THẢO CHÍNH - GIẢ LẬP KHỔ GIẤY A4 */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-300/50 flex justify-center custom-scrollbar">
              <div 
                className="w-full max-w-[21cm] bg-white shadow-2xl min-h-[29.7cm] p-[2.5cm] rounded-sm border border-slate-300 doc-preview-area outline-none cursor-text"
                contentEditable={true}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{ __html: fileContent.html }}
                onBlur={(e) => setFileContent({ ...fileContent, html: e.currentTarget.innerHTML })}
              />
            </div>

            {/* Footer Modal */}
            <div className="p-3 bg-slate-900 border-t border-white/5 flex justify-between items-center px-10">
               <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" /> Hệ thống bảo mật chuyên môn liên thông VietEdu
               </div>
               <div className="text-[9px] font-black text-blue-400 uppercase italic">
                  Gợi ý: Bạn có thể gõ trực tiếp, xóa hoặc sửa bảng biểu ngay trên màn hình này
               </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS NHÚNG - TỐI ƯU HIỂN THỊ GIỐNG WORD */}
      <style dangerouslySetInnerHTML={{ __html: `
        .doc-preview-area {
          font-family: 'Times New Roman', P05, serif !important;
          font-size: 13pt;
          color: #000;
          line-height: 1.5;
          text-align: justify;
        }
        .doc-preview-area table {
          border-collapse: collapse;
          width: 100% !important;
          margin: 1rem 0;
        }
        .doc-preview-area td, .doc-preview-area th {
          border: 1px solid #000 !important;
          padding: 5px 8px !important;
          min-width: 40px;
        }
        .doc-preview-area p {
          margin-bottom: 0.3rem;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 5px;
        }
        /* Hiệu ứng khi đang gõ */
        .doc-preview-area:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}} />
    </div>
  );
};

export default SchoolPlan;