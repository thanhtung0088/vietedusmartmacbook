"use client";

import React, { useState } from 'react';
import { 
  ClipboardPaste, GraduationCap, Sparkles, 
  Trash2, Loader2, Download, FileSpreadsheet,
  ChevronDown, PlayCircle
} from 'lucide-react';
// Import hàm khởi tạo từ file gemini.ts của bạn
import { getAiModel } from '@/lib/gemini'; 

interface StudentGrade {
  stt: string;
  maDinhDanh: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  dtbHk1: string;
  dtbHk2: string;
  dtbCn: string;
  commentAi: string;
}

export const SmartGradebookPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [students, setStudents] = useState<StudentGrade[]>([]);

  // --- CẤU HÌNH BỘ LỌC ---
  const KHOIS = Array.from({ length: 12 }, (_, i) => `Khối ${i + 1}`);
  const MONS = ['Toán', 'Ngữ văn', 'Tiếng Anh', 'KHTN', 'Lịch sử & Địa lý', 'GDCD', 'Tin học', 'Công nghệ', 'Âm nhạc', 'Mỹ thuật', 'GDTC', 'HĐTN', 'Vật lí', 'Hóa học', 'Sinh học'];
  
  const [selectedKhoi, setSelectedKhoi] = useState("Khối 6");
  const [selectedLop, setSelectedLop] = useState("6/1");
  const [selectedMon, setSelectedMon] = useState("GDCD");
  const [selectedHocKy, setSelectedHocKy] = useState("Cả năm");

  const getLopList = (khoiStr: string) => {
    const k = khoiStr.split(' ')[1];
    return Array.from({ length: 15 }, (_, i) => `${k}/${i + 1}`);
  };

  // --- XỬ LÝ DỮ LIỆU EXCEL ---
  const handleParseExcel = () => {
    const rows = pasteData.split('\n').filter(r => r.trim());
    const parsed = rows.map(row => {
      const cols = row.split('\t');
      return {
        stt: cols[0] || '', 
        maDinhDanh: cols[1] || '',
        hoTen: cols[2] || '',
        ngaySinh: cols[3] || '',
        gioiTinh: cols[4] || '',
        dtbHk1: cols[5] || '0', 
        dtbHk2: cols[6] || '0', 
        dtbCn: cols[7] || '0',
        commentAi: ''
      };
    });
    setStudents(parsed);
    setShowModal(false);
    setPasteData('');
  };

  // --- GỌI AI NHẬN XÉT (SỬ DỤNG GEMINI 3.1) ---
  const generateAiComments = async () => {
    if (students.length === 0) {
      alert("Vui lòng nhập dữ liệu học sinh trước!");
      return;
    }

    setIsAiProcessing(true);
    try {
      // Gọi model FLASH (gemini-2.5-flash) từ file gemini.ts của bạn
      const model = getAiModel('FLASH'); 
      
      if (!model) {
        alert("Hệ thống chưa có API Key. Vui lòng thiết lập ở trang Cài đặt chung!");
        setIsAiProcessing(false);
        return;
      }

      const prompt = `Bạn là giáo viên môn ${selectedMon}. Hãy viết nhận xét học bạ (theo thông tư 22) cho học sinh lớp ${selectedLop}.
      Yêu cầu: 
      1. Nội dung nhận xét chuẩn sư phạm, ngắn gọn, phù hợp với mức điểm trung bình cả năm.
      2. TRẢ VỀ DUY NHẤT một mảng JSON các chuỗi (string array). 
      3. Không giải thích gì thêm ngoài mã JSON.
      Dữ liệu: ${JSON.stringify(students.map(s => ({ tên: s.hoTen, giới: s.gioiTinh, điểm: s.dtbCn })))}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().replace(/```json|```/g, "").trim();
      const aiComments = JSON.parse(responseText);

      setStudents(students.map((st, idx) => ({ 
        ...st, 
        commentAi: aiComments[idx] || "Em có ý thức học tập tốt, cần phát huy hơn nữa." 
      })));

    } catch (e: any) { 
      console.error("Lỗi AI:", e);
      alert("Lỗi kết nối AI (Gemini 2.5). Thầy vui lòng kiểm tra lại API Key hoặc phiên bản model!"); 
    } finally { 
      setIsAiProcessing(false); 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] text-slate-900 font-sans overflow-hidden">
      
      {/* HEADER: Giao diện sạch sẽ, không còn ô nhập Key */}
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-600" size={24} />
          <h1 className="text-[#0070a8] font-bold text-[16px] flex items-center gap-2">
            5.3.1. Nhập điểm môn học <PlayCircle size={18} className="text-rose-600 fill-rose-600" />
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex rounded overflow-hidden shadow-sm">
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#428bca] text-white text-[12px] font-bold border-r border-blue-400 flex items-center gap-2 hover:bg-blue-600 transition-colors">
              <FileSpreadsheet size={16}/> Nhập từ Excel <ChevronDown size={14}/>
            </button>
            <button className="px-4 py-2 bg-[#428bca] text-white text-[12px] font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors">
              <Download size={16}/> Xuất Excel <ChevronDown size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* THANH BỘ LỌC */}
      <div className="p-4 flex flex-wrap gap-6 items-center bg-white border-b text-[13px] font-bold shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[11px]">Khối:</span>
          <select value={selectedKhoi} onChange={(e) => setSelectedKhoi(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-slate-50 min-w-[120px] font-normal">
            {KHOIS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[11px]">Lớp:</span>
          <select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-slate-50 min-w-[80px] font-normal">
            {getLopList(selectedKhoi).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[11px]">Môn:</span>
          <select value={selectedMon} onChange={(e) => setSelectedMon(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-slate-50 min-w-[150px] font-normal">
            {MONS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <button 
          onClick={generateAiComments} 
          disabled={isAiProcessing || students.length === 0} 
          className="ml-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
        >
          {isAiProcessing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-yellow-300" />}
          <span className="font-black tracking-tight uppercase">Nhận xét AI Toàn Lớp</span>
        </button>
      </div>

      {/* BẢNG HIỂN THỊ */}
      <div className="flex-1 overflow-auto p-4 bg-[#f8fafc]">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full border-collapse text-[13px] min-w-[1200px]">
            <thead>
                <tr className="bg-[#0070a8] text-white uppercase text-[11px]">
                <th className="p-3 w-12 text-center border-r border-white/20">STT</th>
                <th className="p-3 w-32 border-r border-white/20">Mã định danh</th>
                <th className="p-3 text-left border-r border-white/20">Họ tên học sinh</th>
                <th className="p-3 w-28 text-center border-r border-white/20">Ngày sinh</th>
                <th className="p-3 w-24 text-center border-r border-white/20">Giới tính</th>
                <th className="p-3 w-20 bg-[#428bca] text-center border-r border-white/20">HK1</th>
                <th className="p-3 w-20 bg-[#428bca] text-center border-r border-white/20">HK2</th>
                <th className="p-3 w-20 bg-rose-700 font-black text-center border-r border-white/20">Cả năm</th>
                <th className="p-3 text-left italic bg-[#005a87]">Nhận xét AI (Chuẩn TT22)</th>
                <th className="p-3 w-10"></th>
                </tr>
            </thead>
            <tbody>
                {students.map((st, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 border-b border-slate-100 transition-colors">
                    <td className="p-3 text-center text-slate-400 font-bold">{st.stt}</td>
                    <td className="p-3 text-center text-slate-600">{st.maDinhDanh}</td>
                    <td className="p-3 font-bold text-slate-800 uppercase">{st.hoTen}</td>
                    <td className="p-3 text-center text-slate-600">{st.ngaySinh}</td>
                    <td className="p-3 text-center text-slate-600">{st.gioiTinh}</td>
                    <td className="p-3 text-center font-bold text-slate-600">{st.dtbHk1}</td>
                    <td className="p-3 text-center font-bold text-slate-600">{st.dtbHk2}</td>
                    <td className="p-3 text-center font-black text-rose-600 bg-amber-50/50">{st.dtbCn}</td>
                    <td className="p-3 italic text-slate-700 leading-relaxed bg-blue-50/30 min-w-[300px]">{st.commentAi}</td>
                    <td className="p-3 text-center">
                    <button onClick={() => setStudents(students.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-600 transition-colors">
                      <Trash2 size={18}/>
                    </button>
                    </td>
                </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-20 text-center text-slate-400 italic">
                      Vui lòng "Nhập từ Excel" để bắt đầu xử lý dữ liệu học sinh...
                    </td>
                  </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* MODAL NHẬP LIỆU */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col border-t-8 border-blue-600">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-blue-700 font-black uppercase flex items-center gap-2 text-lg"><ClipboardPaste/> Nhập liệu từ Excel</h3>
                <p className="text-[11px] text-rose-600 font-bold uppercase mt-2">Thứ tự: STT | Mã định danh | Họ Tên | Ngày sinh | Giới tính | HK1 | HK2 | Cả năm</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-600"><Trash2 size={24}/></button>
            </div>
            <div className="p-6">
              <textarea 
                value={pasteData} 
                onChange={(e) => setPasteData(e.target.value)} 
                className="w-full h-80 p-5 bg-slate-50 border-2 border-dashed rounded-2xl outline-none font-mono text-xs focus:border-blue-400 transition-all" 
                placeholder="Dán dữ liệu (Ctrl+V) từ file Excel của bạn vào đây..." 
              />
            </div>
            <div className="p-6 bg-slate-50 rounded-b-3xl flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Hủy</button>
              <button onClick={handleParseExcel} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 transition-colors">NẠP HỌC SINH</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartGradebookPage;