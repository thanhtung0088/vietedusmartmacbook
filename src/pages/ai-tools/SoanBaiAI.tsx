"use client";

import React, { useState, useRef } from 'react';
import { 
  NotebookPen, Sparkles, Loader2, Plus, X, 
  FileText, ChevronDown, Eye, ClipboardList, FileDown, Paperclip
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

const lopOptions = Array.from({ length: 12 }, (_, i) => i + 1).map((lop) => ({ value: lop, label: `Lớp ${lop}` }));

const getMonHocOptions = (lop: number) => {
  return [
    'Tiếng Việt', 'Toán', 'Ngoại ngữ 1', 'Đạo đức', 'Giáo dục công dân', 'Tự nhiên và Xã hội',
    'Lịch sử và Địa lý', 'Khoa học', 'Tin học và Công nghệ', 'Giáo dục thể chất',
    'Nghệ thuật (Âm nhạc + Mỹ thuật)', 'Hoạt động trải nghiệm', 'Giáo dục quốc phòng và an ninh',
    'Giáo dục kinh tế và pháp luật', 'Vật lý', 'Hóa học', 'Sinh học'
  ];
};

const promptTemplates = [
  { 
    id: 1, 
    title: '1. Soạn KHBD 5512', 
    content: `Bạn là chuyên gia xây dựng Kế hoạch bài dạy theo Chương trình GDPT 2018. Hãy soạn KẾ HOẠCH BÀI DẠY (KHBD) theo Công văn 5512/BGDĐT-GDTrH, Phụ lục 4, đảm bảo đầy đủ và đúng chuẩn. Yêu cầu bắt buộc: Đúng cấu trúc KHBD theo CV 5512 – Phụ lục 4. Dạy học theo định hướng phát triển phẩm chất và năng lực. TÍCH HỢP: Năng lực số, Quyền con người, Lồng ghép Giáo dục Quốc phòng – An ninh, Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh. Cấu trúc KHBD gồm: Mục tiêu bài học (Phẩm chất, Năng lực chung, Năng lực đặc thù). Thiết bị dạy học và học liệu. Tiến trình dạy học: (Hoạt động 1: Mở đầu, Hoạt động 2: Hình thành kiến thức, Hoạt động 3: Luyện tập, Hoạt động 4: Vận dụng). Điều chỉnh – bổ sung (nếu có). Trình bày ngôn ngữ hành chính – sư phạm, đúng để in nộp hồ sơ chuyên môn.`
  },
  { 
    id: 2, 
    title: '2. Soạn slide trình chiếu', 
    content: `Bạn là chuyên gia thiết kế bài giảng số và mỹ thuật sư phạm. Hãy soạn BÀI GIẢNG TRÌNH CHIẾU (PowerPoint) phục vụ bài học trên, đảm bảo: Yêu cầu: Ít nhất 10 slide, Nội dung bám sát KHBD, Dạy học theo định hướng phát triển năng lực, AI tự chọn màu sắc – bố cục đẹp – dễ nhìn, Phù hợp học sinh theo chương trình GDPT 2018. Mỗi slide gồm: Tiêu đề, Nội dung ngắn gọn (gạch đầu dòng), Gợi ý hình ảnh / sơ đồ / biểu tượng minh họa. Cấu trúc gợi ý: Slide 1: Tiêu đề; Slide 2: Mục tiêu; Slide 3–8: Nội dung trọng tâm; Slide 9: Hoạt động – câu hỏi tương tác; Slide 10: Tổng kết – liên hệ thực tiễn.`
  },
  { 
    id: 3, 
    title: '3. Soạn đề kiểm tra 7991', 
    content: `Bạn là chuyên gia ra đề và đánh giá học sinh theo định hướng phát triển năng lực. Hãy soạn ĐỀ KIỂM TRA theo Công văn 7991/BGDĐT-GDTrH, đảm bảo: Yêu cầu: Đúng ma trận và đặc tả theo CV 7991. Đánh giá mức độ nhận thức: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao. Câu hỏi gắn với thực tiễn, năng lực, phẩm chất. Sản phẩm gồm: Ma trận đề, Bảng đặc tả, Đề kiểm tra, Đáp án – thang điểm chi tiết. Ngôn ngữ chuẩn, dùng được cho kiểm tra định kỳ / giữa kỳ / cuối kỳ.`
  },
  { 
    id: 4, 
    title: '4. Soạn đề cương ôn tập', 
    content: `Bạn là giáo viên giàu kinh nghiệm, am hiểu chương trình GDPT 2018. Hãy soạn ĐỀ CƯƠNG ÔN TẬP cho học sinh, đảm bảo: Yêu cầu: Hệ thống kiến thức ngắn gọn – dễ nhớ. Phân chia rõ: Kiến thức trọng tâm, Kỹ năng cần đạt, Dạng bài thường gặp. Có câu hỏi gợi ý ôn luyện. Phù hợp đánh giá theo định hướng năng lực. Trình bày mạch lạc, dễ in phát cho học sinh.`
  },
  { 
    id: 5, 
    title: '5. Trò chơi tương tác', 
    content: `Bạn là chuyên gia thiết kế trò chơi giáo dục và giáo viên cốt cán, am hiểu Chương trình GDPT 2018 và Công văn 5512/BGDĐT-GDTrH. Thiết kế trò chơi học tập tương tác nhằm: Củng cố kiến thức, Kiểm tra mức độ hiểu bài, Tăng hứng thú. Yêu cầu: Tối thiểu 20 câu (Nhận biết -> Thông hiểu -> Vận dụng). Hình thức đa dạng: Trắc nghiệm A,B,C,D; Đúng–Sai; Nối cột; Điền khuyết; Tình huống thực tiễn. Trình bày mỗi câu: Nội dung, Phương án, Đáp án, Giải thích ngắn gọn.`
  },
  { 
    id: 6, 
    title: '6. Soạn SKKN chuyên sâu', 
    content: `Bạn là chuyên gia nghiên cứu Education, kinh nghiệm viết SKKN giải cấp Tỉnh/Thành phố. Hãy viết một SÁNG KIẾN KINH NGHIỆM HOÀN CHỈNH văn phong khoa học. Cấu trúc: 1. MỞ ĐẦU (Lý do, Mục đích, Đối tượng, Phương pháp). 2. NỘI DUNG (Cơ sở lý luận, Thực trạng có bảng số liệu, 3-6 giải pháp chi tiết có ví dụ, Hiệu quả có bảng so sánh Trước/Sau). 3. KẾT LUẬN & KIẾN NGHỊ. 4. TÀI LIỆU THAM KHẢO. Yêu cầu: Độ dài 5000-8000 từ, có tóm tắt Abstract, tính mới và khả năng nhân rộng cao.`
  }
];

export const SoanBaiAI: React.FC = () => {
  const [lop, setLop] = useState<number>(6);
  const [monHoc, setMonHoc] = useState<string>('Toán');
  const [chuDe, setChuDe] = useState('');
  const [yeuCauThem, setYeuCauThem] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleExport = (type: string) => {
    if (!output) return alert("Vui lòng soạn bài trước khi xuất file!");
    alert(`Hệ thống đang khởi tạo file ${type.toUpperCase()}...`);
    setShowExport(false);
  };

  const generateContent = async () => {
    if (!chuDe.trim()) return alert("Vui lòng nhập tên bài học!");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const promptText = `Môn: ${monHoc}, Khối: ${lop}, Bài: ${chuDe}. Yêu cầu: ${yeuCauThem}. Tài liệu kèm theo: ${files.length} file.`;
      const result = await model.generateContent(promptText);
      setOutput(result.response.text());
    } catch (error) { setOutput("Lỗi kết nối AI."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-60px)]">
        
        {/* CỘT TRÁI */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="bg-slate-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center border border-slate-500 shadow-inner">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-[12px] font-black uppercase tracking-tighter text-white leading-none">Cấu hình soạn thảo</h1>
              <p className="text-[8px] text-blue-400 font-bold uppercase tracking-widest italic mt-1">VietEdu Smart AI System</p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Khối lớp</label>
                <select value={lop} onChange={(e) => setLop(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold outline-none">
                  {lopOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Môn học</label>
                <select value={monHoc} onChange={(e) => setMonHoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold outline-none">
                  {getMonHocOptions(lop).map(mon => <option key={mon} value={mon}>{mon}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Tên bài học</label>
              <input value={chuDe} onChange={(e) => setChuDe(e.target.value)} placeholder="Nhập chủ đề..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[11px] font-bold outline-none focus:ring-1 focus:ring-slate-400" />
            </div>

            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400">Yêu cầu & Prompt mẫu</label>
                <button onClick={() => setShowPrompts(!showPrompts)} className="text-[9px] font-black uppercase text-slate-600 flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <ClipboardList size={12} /> Chọn Prompt mẫu <ChevronDown size={12} />
                </button>
              </div>
              {showPrompts && (
                <div className="absolute right-0 top-6 w-full bg-white border border-slate-200 rounded-lg shadow-2xl z-50 py-1 border-t-4 border-t-slate-700">
                  {promptTemplates.map((p) => (
                    <button key={p.id} onClick={() => { setYeuCauThem(p.content); setShowPrompts(false); }} className="w-full text-left px-4 py-2.5 text-[10px] font-black text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0 uppercase transition-colors">
                      {p.title}
                    </button>
                  ))}
                </div>
              )}
              <textarea value={yeuCauThem} onChange={(e) => setYeuCauThem(e.target.value)} className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[11px] font-medium outline-none resize-none focus:ring-1 focus:ring-slate-400" placeholder="Nội dung yêu cầu..." />
            </div>

            {/* PHẦN ĐÍNH KÈM TÀI LIỆU */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Tài liệu đính kèm</label>
                <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm transition-all active:scale-90">
                  <Plus size={18} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
              </div>
              
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200 max-h-24 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
                      <Paperclip size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-600 truncate max-w-[80px]">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="text-rose-500 hover:bg-rose-50 rounded-full">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={generateContent} disabled={loading} className="w-full bg-slate-700 hover:bg-slate-800 text-white py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {loading ? "Đang xử lý dữ liệu..." : "Bắt đầu soạn thảo"}
            </button>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="bg-slate-700 p-4 flex justify-between items-center shadow-md">
            <h2 className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Eye size={16} className="text-slate-300" /> Nội dung bài giảng AI
            </h2>
            <div className="relative">
              <button onClick={() => setShowExport(!showExport)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 border border-white/20 transition-all shadow-inner">
                <FileDown size={14}/> Xuất file <ChevronDown size={12}/>
              </button>
              {showExport && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 py-1 overflow-hidden border-t-4 border-t-emerald-600">
                  <button onClick={() => handleExport('docx')} className="w-full text-left px-4 py-3 text-[11px] font-black text-slate-800 hover:bg-slate-50 border-b border-slate-50 uppercase tracking-tight">Xuất Microsoft Word (.docx)</button>
                  <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-3 text-[11px] font-black text-slate-800 hover:bg-slate-50 border-b border-slate-50 uppercase tracking-tight">Xuất bản vẽ PDF (.pdf)</button>
                  <button onClick={() => handleExport('pptx')} className="w-full text-left px-4 py-3 text-[11px] font-black text-slate-800 hover:bg-slate-50 uppercase tracking-tight">Xuất PowerPoint (.pptx)</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 bg-slate-50/30 m-4 rounded-xl p-10 overflow-y-auto border border-slate-100 shadow-inner">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                <Loader2 size={32} className="animate-spin text-slate-400" />
                <p className="text-[10px] font-black uppercase tracking-widest">AI đang thiết kế nội dung cho Thầy/Cô...</p>
              </div>
            ) : (
              <div className="text-slate-700 font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
                {output || (
                  <div className="text-center py-20 opacity-20 select-none">
                    <NotebookPen size={60} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-[11px]">Hệ thống đã sẵn sàng soạn thảo</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SoanBaiAI;