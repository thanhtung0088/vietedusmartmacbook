"use client";
import React, { useState } from 'react';
import { 
  Briefcase, Sparkles, Loader2, FileText, 
  BarChart3, Activity, Users, Award, 
  AlertCircle, ChevronRight, Send, Download
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

type ModuleType = 'ke-hoach' | 'tien-do' | 'chat-luong' | 'sinh-hoat' | 'bao-cao' | 'danh-gia';

export const ToTruongChuyenMonAI: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('ke-hoach');
  const [inputData, setInputData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleAIProcess = async () => {
    if (!inputData.trim()) return alert("Vui lòng nhập thông tin cần xử lý!");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let prompt = "";

      switch (activeModule) {
        case 'ke-hoach':
          prompt = `Bạn là Tổ trưởng chuyên môn. Hãy soạn KẾ HOẠCH dựa trên: ${inputData}. Yêu cầu: Mục tiêu, Nội dung, Thời gian, Người phụ trách.`;
          break;
        case 'tien-do':
          prompt = `Phân tích TIẾN ĐỘ CHƯƠNG TRÌNH: ${inputData}. Chỉ ra GV chậm/vượt và hướng xử lý.`;
          break;
        case 'chat-luong':
          prompt = `Phân tích CHẤT LƯỢNG: ${inputData}. Đánh giá tỉ lệ và giải pháp cải thiện.`;
          break;
        case 'sinh-hoat':
          prompt = `Soạn NỘI DUNG HỌP TỔ: ${inputData}. Tập trung thảo luận chuyên môn và ma trận đề.`;
          break;
        case 'bao-cao':
          prompt = `Tạo BÁO CÁO TỔ: ${inputData}. Ngắn gọn, đủ số liệu và phương hướng.`;
          break;
        case 'danh-gia':
          prompt = `Viết NHẬN XÉT ĐÁNH GIÁ GV: ${inputData}. Văn phong chuẩn mực, khích lệ.`;
          break;
      }

      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (error) {
      setResult("Lỗi hệ thống AI. Vui lòng kiểm tra lại API Key.");
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { id: 'ke-hoach', label: 'Kế hoạch Tổ', icon: FileText },
    { id: 'tien-do', label: 'Tiến độ CT', icon: Activity },
    { id: 'chat-luong', label: 'Chất lượng', icon: BarChart3 },
    { id: 'sinh-hoat', label: 'Họp Chuyên môn', icon: Users },
    { id: 'bao-cao', label: 'Báo cáo Tổ', icon: Send },
    { id: 'danh-gia', label: 'Đánh giá GV', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Thiết kế gọn gàng hơn */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Briefcase className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Tổ trưởng Chuyên môn AI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                VietEdu Smart Pro 2026
              </p>
            </div>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[8px] font-bold text-slate-400 uppercase">Tiến độ chung</p>
              <p className="text-xs font-black text-green-600">95% OK</p>
            </div>
            <div className="text-center border-l border-slate-100 pl-6">
              <p className="text-[8px] font-bold text-slate-400 uppercase">Cảnh báo</p>
              <p className="text-xs font-black text-rose-500">02 Chậm</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module Selector - Bo góc xl */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase px-2 mb-2">Chức năng quản lý</p>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => { setActiveModule(m.id as any); setResult(""); }}
                className={`w-full p-3.5 rounded-xl flex items-center gap-3 transition-all border ${
                  activeModule === m.id 
                  ? 'bg-white border-indigo-600 shadow-md translate-x-1' 
                  : 'bg-white/50 border-transparent hover:bg-white text-slate-500'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeModule === m.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  <m.icon size={18} />
                </div>
                <span className={`text-[11px] font-black uppercase ${activeModule === m.id ? 'text-slate-800' : ''}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {/* Workspace - Bo góc 2xl */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200 border border-white h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-indigo-600" size={18} />
                <h2 className="text-[11px] font-black text-slate-800 uppercase italic underline decoration-indigo-200 underline-offset-4">Dữ liệu đầu vào</h2>
              </div>

              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={`Nhập thông tin cho ${modules.find(m => m.id === activeModule)?.label}...`}
                className="flex-1 w-full p-5 bg-slate-50 rounded-xl border border-slate-100 focus:border-indigo-400 focus:bg-white outline-none text-sm font-medium transition-all mb-4 resize-none"
              />

              <button
                onClick={handleAIProcess}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? "Đang xử lý..." : "Thực thi AI"}
              </button>
            </div>
          </div>

          {/* Result - Bo góc 2xl */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200 border border-white h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Văn bản đề xuất</h2>
                <button className="text-indigo-600 hover:scale-110 transition-transform"><Download size={18} /></button>
              </div>

              <div className="flex-1 bg-indigo-50/30 rounded-xl p-5 overflow-y-auto border border-indigo-100/50">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold uppercase animate-pulse">
                    <Loader2 className="animate-spin mb-3 text-indigo-600" size={24} /> 
                    AI đang soạn thảo...
                  </div>
                ) : result ? (
                  <div className="prose prose-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed animate-in fade-in zoom-in-95 duration-300">
                    {result}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale space-y-3">
                    <AlertCircle size={40} className="text-indigo-400" />
                    <p className="text-[10px] font-black uppercase tracking-tight">Chưa có dữ liệu kết quả</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToTruongChuyenMonAI;