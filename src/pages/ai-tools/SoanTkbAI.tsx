"use client";

import React, { useState, useRef } from 'react';
import { 
  CalendarDays, Clock, Users, BookOpen, 
  Sparkles, Loader2, Plus, X, Download, 
  FileText, Printer, LayoutGrid, AlertCircle 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini AI - Sử dụng gemini-2.5fash
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

const khoiLopOptions = [
  { value: 1, label: "Khối 1" }, { value: 2, label: "Khối 2" }, { value: 3, label: "Khối 3" },
  { value: 4, label: "Khối 4" }, { value: 5, label: "Khối 5" },
  { value: 6, label: "Khối 6" }, { value: 7, label: "Khối 7" }, { value: 8, label: "Khối 8" },
  { value: 9, label: "Khối 9" },
  { value: 10, label: "Khối 10" }, { value: 11, label: "Khối 11" }, { value: 12, label: "Khối 12" },
];

const soTietTuanOptions = [
  { value: "18", label: "18 tiết/tuần (chuẩn cơ bản)" },
  { value: "19", label: "19 tiết/tuần" },
  { value: "20", label: "20 tiết/tuần" },
  { value: "21", label: "21 tiết/tuần" },
  { value: "22", label: "22 tiết/tuần" },
  { value: "23", label: "23 tiết/tuần" },
  { value: "24", label: "24 tiết/tuần (tăng cường)" },
  { value: "custom", label: "Tùy chỉnh khác" },
];

export const SoanTkbAI: React.FC = () => {
  const [khoiLop, setKhoiLop] = useState<number | null>(null);
  const [soTietTuan, setSoTietTuan] = useState("18");
  const [soTietCustom, setSoTietCustom] = useState("");
  const [soLop, setSoLop] = useState("1");
  const [soGiaoVien, setSoGiaoVien] = useState("");
  const [monHocChon, setMonHocChon] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [tkbResult, setTkbResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMonHocByKhoi = (khoi: number): string[] => {
    if (khoi <= 5) return ["Tiếng Việt", "Toán", "Đạo đức", "Tự nhiên và Xã hội", "Giáo dục thể chất", "Nghệ thuật", "Hoạt động trải nghiệm", "Ngoại ngữ 1", "Tin học và Công nghệ"];
    if (khoi <= 9) return ["Ngữ văn", "Toán", "Ngoại ngữ 1", "Giáo dục công dân", "Khoa học tự nhiên", "Lịch sử và Địa lý", "Giáo dục thể chất", "Công nghệ", "Nghệ thuật", "Tin học", "Hoạt động trải nghiệm"];
    return ["Ngữ văn", "Toán", "Ngoại ngữ 1", "Giáo dục thể chất", "Giáo dục quốc phòng - An ninh", "Giáo dục kinh tế và pháp luật", "Lịch sử", "Địa lý", "Vật lý", "Hóa học", "Sinh học", "Tin học", "Công nghệ", "Nghệ thuật", "Hoạt động trải nghiệm"];
  };

  const monHocOptions = khoiLop ? getMonHocByKhoi(khoiLop) : [];

  const handleToggleMonHoc = (mon: string) => {
    setMonHocChon(prev => prev.includes(mon) ? prev.filter(m => m !== mon) : [...prev, mon]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 8 - files.length);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getSoTietFinal = () => soTietTuan === "custom" ? (soTietCustom || "18") : soTietTuan;

  const generateTKB = async () => {
    setErrorMsg("");
    if (!khoiLop) { setErrorMsg("Vui lòng chọn khối lớp."); return; }
    if (monHocChon.length === 0) { setErrorMsg("Vui lòng chọn ít nhất một môn học."); return; }
    setLoading(true); setTkbResult("");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Tạo TKB cho Khối: ${khoiLop}, Lớp: ${soLop}, Tiết/tuần: ${getSoTietFinal()}. Môn: ${monHocChon.join(", ")}.`;
      const result = await model.generateContent(prompt);
      setTkbResult(result.response.text());
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi kết nối");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-teal-800 flex items-center gap-3">
              <CalendarDays className="text-teal-600" size={32} /> Soạn Thời Khóa Biểu AI
            </h1>
            <p className="text-teal-700 mt-1">Hệ thống lập lịch thông minh theo chuẩn Bộ GD&ĐT</p>
          </div>
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-white border border-teal-300 text-teal-700 rounded-lg flex items-center gap-2 shadow-sm">
            <Printer size={18} /> In TKB
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột Thiết lập - Con tăng lên h-[600px] để đủ chỗ hiện môn học */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl shadow-xl border border-teal-100 h-[500px] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <LayoutGrid size={20} /> Thiết lập thông số
              </h2>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-teal-800 mb-1 uppercase tracking-wider">1. Khối lớp</label>
                <select value={khoiLop || ""} onChange={e => { setKhoiLop(Number(e.target.value)); setMonHocChon([]); }} className="w-full p-2.5 border border-teal-200 rounded-lg bg-teal-50/30 outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Chọn khối...</option>
                  {khoiLopOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-teal-800 mb-1 uppercase tracking-wider">2. Số lớp</label>
                  <input type="number" value={soLop} onChange={e => setSoLop(e.target.value)} className="w-full p-2.5 border border-teal-200 rounded-lg bg-teal-50/30 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-teal-800 mb-1 uppercase tracking-wider">3. Số GV</label>
                  <input type="number" value={soGiaoVien} onChange={e => setSoGiaoVien(e.target.value)} className="w-full p-2.5 border border-teal-200 rounded-lg bg-teal-50/30 outline-none" placeholder="Dự kiến" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal-800 mb-1 uppercase tracking-wider">4. Môn học áp dụng</label>
                {/* Khu vực hiện danh sách môn học - Đã sửa lỗi không hiện */}
                <div className="min-h-[120px] max-h-[180px] overflow-y-auto border-2 border-dashed border-teal-200 rounded-xl p-3 bg-slate-50">
                  {khoiLop ? (
                    <div className="flex flex-wrap gap-2">
                      {monHocOptions.map(mon => (
                        <button 
                          key={mon} 
                          onClick={() => handleToggleMonHoc(mon)} 
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                            monHocChon.includes(mon) 
                            ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-95' 
                            : 'bg-white text-teal-700 border-teal-200 hover:border-teal-400 hover:bg-teal-50'
                          }`}
                        >
                          {mon}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic text-center mt-8">Vui lòng chọn khối lớp để hiện danh sách môn</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal-800 mb-1 uppercase tracking-wider">5. Tài liệu (Tùy chọn)</label>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-white border border-teal-300 rounded-lg text-teal-700 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 text-sm">
                  <Plus size={16} /> Thêm file
                </button>
                <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange} />
                <div className="mt-2 space-y-1">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-teal-100 text-[10px]">
                      <span className="truncate w-40">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cột Kết quả - Đồng bộ chiều cao h-[600px] */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl shadow-xl border border-teal-100 h-[500px] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-4 shrink-0 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-3">
                <Clock size={20} /> Kết quả sắp xếp TKB
              </h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 shadow-inner custom-scrollbar">
              {errorMsg && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertCircle size={16}/> {errorMsg}</div>}
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-teal-600">
                  <Loader2 size={40} className="animate-spin mb-3" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">AI đang soạn thảo...</p>
                </div>
              ) : tkbResult ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-[13px] whitespace-pre-wrap shadow-sm">
                  {tkbResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <CalendarDays size={48} className="mb-3 opacity-20" />
                  <p className="text-sm italic font-medium">Kết quả sẽ hiển thị tại đây</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-teal-100 shrink-0">
              <button 
                onClick={generateTKB} 
                disabled={loading || !khoiLop} 
                className={`w-full py-3.5 rounded-xl font-black uppercase text-[12px] flex items-center justify-center gap-3 shadow-lg transition-all ${loading || !khoiLop ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'}`}
              >
                <Sparkles size={18} /> {loading ? "Đang xử lý..." : "Bắt đầu sắp xếp TKB"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoanTkbAI;