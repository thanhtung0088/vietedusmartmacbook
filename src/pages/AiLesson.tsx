"use client";

import React, { useState } from "react";
import { Upload, X, Wand2, FileDown, Sparkles, ChevronDown, FileText, Presentation, FileCode } from "lucide-react";

const subjects = ["Toán", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "GDCD", "Tin học", "Công nghệ", "Âm nhạc", "Mỹ thuật", "Thể dục", "Hoạt động trải nghiệm"];
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const promptTemplates: Record<string, string> = {
  khbd: `Xây dựng Kế hoạch bài dạy theo Công văn 5512/BGDĐT-GDTrH, Phụ lục 4.`,
  ppt: `Thiết kế bài giảng trình chiếu PowerPoint 10 slide chuyên nghiệp.`,
};

// Đảm bảo tên là AILesson và có từ khóa export
export const AILesson: React.FC = () => {
  const [lessonName, setLessonName] = useState("");
  const [studentType, setStudentType] = useState("HS đại trà");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 10) return;
    setFiles([...files, ...newFiles]);
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/10 backdrop-blur-md min-h-screen rounded-lg border border-white/20">
      {/* THẺ TRÁI: NHẬP LIỆU */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/20 p-6 space-y-4">
        <h2 className="text-lg font-black flex items-center gap-2 text-indigo-800">
          <Sparkles className="text-yellow-500" size={16} /> SOẠN BÀI CHUYÊN NGHIỆP
        </h2>
        
        <div className="space-y-3">
          <input type="text" placeholder="Tên bài dạy..." className="w-full border-2 border-slate-50 bg-slate-50/10 backdrop-blur-sm rounded-lg px-4 py-3 font-bold outline-none focus:border-blue-500 text-[8px]" value={lessonName} onChange={(e) => setLessonName(e.target.value)} />
          
          <div className="grid grid-cols-2 gap-3">
            <select className="border-2 border-slate-50 bg-slate-50/10 backdrop-blur-sm rounded-lg px-4 py-3 font-bold outline-none focus:border-blue-500 text-[8px]">
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={studentType} onChange={(e) => setStudentType(e.target.value)} className="border-2 border-slate-50 bg-slate-50/10 backdrop-blur-sm rounded-lg px-4 py-3 font-bold outline-none focus:border-blue-500 text-[8px]">
              <option value="HS đại trà">HS đại trà</option>
              <option value="HSHN (Hòa nhập)">HSHN (Hòa nhập)</option>
              <option value="Hỗn hợp">Hỗn hợp</option>
            </select>
          </div>

          <textarea rows={5} className="w-full border-2 border-slate-50 bg-slate-50/10 backdrop-blur-sm rounded-lg p-4 font-medium shadow-inner text-[8px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Nội dung AI..." />
          
          <div className="p-3 bg-slate-50/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-slate-200">
            <label className="flex items-center gap-1 text-indigo-600 font-black text-[8px] cursor-pointer">
              <Upload size={14} /> ĐÍNH KÈM TÀI LIỆU (MAX 10)
              <input type="file" hidden multiple onChange={handleFileUpload} />
            </label>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {files.map((f, i) => (
                <div key={i} className="bg-white/10 p-1 rounded-md text-[6px] font-bold border flex justify-between">
                  {f.name} <X size={10} className="text-red-500 cursor-pointer" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-4 rounded-lg font-black shadow-lg hover:-translate-y-1 transition-all text-[8px]">
          BẮT ĐẦU SOẠN THẢO
        </button>
      </div>

      {/* THẺ PHẢI: KẾT QUẢ */}
      <div className="bg-slate-900/10 backdrop-blur-md rounded-lg p-1 shadow-md overflow-hidden flex flex-col border border-white/20">
        <div className="p-4 text-white font-black border-b border-slate-800 flex justify-between bg-slate-800/50 backdrop-blur-md text-[8px]">
          KẾT QUẢ AI <FileDown size={14}/>
        </div>
        <div className="flex-1 p-6 text-indigo-300 font-mono text-[8px] overflow-y-auto">
           {">"} Đang đợi lệnh từ thầy...
        </div>
      </div>
    </div>
  );
};
export default AILesson;