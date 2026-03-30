"use client";

import React, { useState, useRef } from 'react';
import { 
  BookOpen, FileCheck, Users, FileBarChart, 
  FileText, Plus, Maximize2, Minimize2, 
  Sparkles, LayoutGrid, Download, 
  Printer, Trash2, FolderOpen, FileSearch, 
  Send, CheckCircle2, Loader2, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const documentLibrary: Record<string, string[]> = {
  kehoach: [
    'Kế hoạch giáo dục tổ chuyên môn (Năm học)',
    'Kế hoạch hoạt động chuyên môn tháng/tuần',
    'Báo cáo sơ kết học kỳ I của tổ',
    'Báo cáo tổng kết năm học của tổ',
    'Báo cáo tháng của tổ chuyên môn',
    'Biên bản họp tổ chuyên môn định kỳ',
    'Biên bản họp xét thi đua đợt 1',
    'Biên bản họp xét thi đua đợt 2'
  ],
  dayhoc: [
    'Báo cáo thực hiện chương trình (Tiến độ chương trình)',
    'Báo cáo chất lượng bộ môn (Theo khối/lớp)',
    'Báo cáo phân công giảng dạy và dạy thay',
    'Báo cáo rà soát ma trận, đề kiểm tra định kỳ',
    'Báo cáo ứng dụng CNTT và thiết bị dạy học',
    'Kế hoạch dạy học các môn học (Phân phối chương trình)'
  ],
  thaogiang: [
    'Báo cáo sinh hoạt chuyên môn theo nghiên cứu bài học',
    'Kế hoạch thao giảng, dự giờ cấp tổ',
    'Báo cáo kết quả thực hiện chuyên đề dạy học',
    'Tổng hợp nhận xét, đánh giá tiết dạy của giáo viên',
    'Báo cáo hội giảng chào mừng các ngày lễ'
  ],
  kiemtra: [
    'Báo cáo kiểm tra hồ sơ sổ sách giáo viên',
    'Kế hoạch bồi dưỡng thường xuyên giáo viên trong tổ',
    'Báo cáo đánh giá chuẩn nghề nghiệp giáo viên (Cấp tổ)',
    'Nhận xét, đánh giá viên chức hằng tháng'
  ],
  hocsinh: [
    'Kế hoạch bồi dưỡng học sinh giỏi cấp tổ',
    'Báo cáo kết quả phụ đạo học sinh yếu kém',
    'Báo cáo học sinh tham gia các hội thi chuyên môn',
    'Kế hoạch tổ chức hoạt động ngoại khóa chuyên môn'
  ],
  digital: [
    'Báo cáo triển khai hồ sơ sổ sách điện tử của tổ',
    'Báo cáo sử dụng học bạ điện tử và chữ ký số',
    'Báo cáo xây dựng kho học liệu số của tổ'
  ]
};

const sections = [
  { id: 'kehoach', label: 'Kế hoạch & Báo cáo', icon: <FileText size={14} />, color: 'border-l-rose-500', bg: 'bg-rose-50/50' },
  { id: 'dayhoc', label: 'Quản lý dạy học', icon: <BookOpen size={14} />, color: 'border-l-blue-500', bg: 'bg-blue-50/50' },
  { id: 'thaogiang', label: 'Chuyên đề & Thao giảng', icon: <Users size={14} />, color: 'border-l-emerald-500', bg: 'bg-emerald-50/50' },
  { id: 'kiemtra', label: 'Bồi dưỡng & Kiểm tra', icon: <FileCheck size={14} />, color: 'border-l-amber-500', bg: 'bg-amber-50/50' },
  { id: 'hocsinh', label: 'Hoạt động học sinh', icon: <LayoutGrid size={14} />, color: 'border-l-indigo-500', bg: 'bg-indigo-50/50' },
  { id: 'digital', label: 'CĐS & Hồ sơ số', icon: <FileBarChart size={14} />, color: 'border-l-cyan-500', bg: 'bg-cyan-50/50' },
];

export const ToTruongCM: React.FC = () => {
  const [active, setActive] = useState(sections[0]);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleSendToAdmin = () => {
    if (!pdfFile) {
      alert("Vui lòng chọn file hồ sơ trước khi trình duyệt!");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setIsSent(false), 3000);
      alert(`Đã trình duyệt hồ sơ "${active.label}" lên trang Quản trị trường thành công!`);
    }, 1500);
  };

  const handlePdfSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === 'application/pdf') {
      if (pdfFile) URL.revokeObjectURL(pdfFile);
      setPdfFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden p-2 animate-in fade-in duration-500">
      
      {/* 1. Top Header Tabs */}
      <div className="flex gap-1 p-1 bg-white shadow-sm border border-slate-200 rounded-xl mb-2 overflow-x-auto shrink-0 custom-scrollbar">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => { setActive(sec); setIsSent(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${
              active.id === sec.id 
              ? `bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]` 
              : `text-slate-500 hover:bg-slate-50`
            }`}
          >
            {sec.icon} {sec.label}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-12 gap-3 overflow-hidden">
        
        {/* 2. Left Side: Document List */}
        <div className="col-span-12 lg:col-span-4 flex flex-col overflow-hidden">
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className={`p-4 border-b ${active.bg} flex justify-between items-center shrink-0`}>
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-slate-700" />
                 <h2 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Danh mục hồ sơ tổ</h2>
              </div>
              <Sparkles size={14} className="text-blue-500 animate-pulse" />
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-1.5 custom-scrollbar">
              {documentLibrary[active.id]?.map((doc, idx) => (
                <div key={idx} className="group flex flex-col gap-2 p-3 hover:bg-slate-50 rounded-lg transition-all border border-slate-50 hover:border-slate-200">
                  <span className="text-[10px] font-bold text-slate-700 leading-tight group-hover:text-blue-700 uppercase">
                    {doc}
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-black text-slate-400 italic">ID: TCM-{active.id.toUpperCase()}-0{idx+1}</span>
                    <button 
                      onClick={() => pdfInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[8px] font-black uppercase hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                    >
                      <FolderOpen size={10} /> Mở file máy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Right Side: PDF Viewer & Sync */}
        <div className="col-span-12 lg:col-span-8 flex flex-col overflow-hidden">
          <div className="flex-1 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-slate-200 relative">
            
            {/* Viewer Toolbar */}
            <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-100 shrink-0">
               <div className="flex items-center gap-3">
                 <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-700`}>
                    {active.icon}
                 </div>
                 <div>
                    <h2 className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Trình duyệt hồ sơ số: {active.label}</h2>
                    <p className="text-[7px] font-bold text-slate-400 uppercase italic">Số hóa chuyên môn v5.0.3</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200 mr-2">
                    <button onClick={() => setPreviewZoom(z => Math.max(50, z - 10))} className="text-slate-400 hover:text-blue-600"><Minimize2 size={12}/></button>
                    <span className="text-[9px] font-black w-10 text-center text-slate-600">{previewZoom}%</span>
                    <button onClick={() => setPreviewZoom(z => Math.min(200, z + 10))} className="text-slate-400 hover:text-blue-600"><Maximize2 size={12}/></button>
                  </div>

                  <button 
                    onClick={handleSendToAdmin}
                    disabled={isSending}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all flex items-center gap-2 italic shadow-lg ${
                      isSent 
                      ? 'bg-emerald-600 text-white' 
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
                  
                  {pdfFile && (
                    <button onClick={() => setPdfFile(null)} className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all">
                      <Trash2 size={14}/>
                    </button>
                  )}
               </div>
            </div>

            {/* PDF Content Area */}
            <div className="flex-1 bg-slate-100/50 relative">
              {pdfFile ? (
                <iframe src={`${pdfFile}#zoom=${previewZoom / 100}`} className="w-full h-full border-none" />
              ) : (
                <div 
                  onClick={() => pdfInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group hover:bg-white transition-all p-10 text-center"
                >
                  <div className="w-24 h-24 rounded-2xl bg-white border border-dashed border-slate-300 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-blue-500 transition-all">
                    <Plus size={32} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase text-slate-800 mb-1">Chưa có hồ sơ nào được chọn</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase italic max-w-[250px]">
                    Chọn tệp PDF từ danh mục bên trái hoặc nhấn vào đây để tải hồ sơ lên trình duyệt
                  </p>
                  <input type="file" ref={pdfInputRef} onChange={handlePdfSelected} accept=".pdf" className="hidden" />
                </div>
              )}
            </div>

            {/* Bottom Sync Info */}
            <div className="p-3 bg-slate-900 flex justify-between items-center px-6 shrink-0 shadow-2xl">
                <div className="flex gap-4">
                  <Printer size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                  <Download size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSent ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></div>
                      <span className="text-[8px] font-black text-slate-400 uppercase italic">
                        Luồng: {active.label} {'>'} Báo cáo tổng hợp
                      </span>
                   </div>
                   <span className="text-[8px] font-black text-emerald-500 uppercase italic tracking-widest">Gemini 3.0 Verified</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToTruongCM;