"use client";
import React, { useState } from 'react';
import { 
  UsersRound, Sparkles, Loader2, ClipboardList, 
  UserPlus, MessageCircle, AlertTriangle, LayoutGrid,
  ChevronRight, Download, Printer, Save, Search
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const TroLyChuNhiemAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nhan-xet' | 'cho-ngoi' | 'ke-hoach' | 'canh-bao'>('nhan-xet');
  const [inputData, setInputData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!inputData.trim()) return alert("Vui lòng nhập dữ liệu học sinh!");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let prompt = "";

      if (activeTab === 'nhan-xet') {
        prompt = `Bạn là GVCN bậc phổ thông giàu kinh nghiệm. Dựa vào bảng dữ liệu (Tên, Điểm TB, HK, Chuyên cần, Tiến bộ, Ghi chú), hãy viết nhận xét học bạ/sổ điểm.
        QUY TẮC: 
        - ĐTB >= 8 & HK Tốt: Khen ngợi sự nỗ lực, tích cực.
        - ĐTB 6.5-7.9: Công nhận ý thức, nhắc nhở mạnh dạn hơn.
        - ĐTB 5-6.4: Khuyến khích cố gắng, chủ động hơn.
        - ĐTB < 5: Nhắc nhở chú ý nghe giảng, hoàn thành bài tập.
        - Nếu có Tiến bộ: Thêm câu "Em có nhiều tiến bộ so với học kỳ trước".
        PHONG CÁCH: Ngắn gọn (1-2 câu), sư phạm, khích lệ, không tiêu cực. Xuất dạng bảng Markdown.
        DỮ LIỆU: \n${inputData}`;
      } 
      
      else if (activeTab === 'cho-ngoi') {
        prompt = `Bạn là chuyên gia tâm lý giáo dục. Hãy xếp chỗ ngồi lớp học (Sơ đồ 4 dãy x 5 bàn).
        DỮ LIỆU ĐẦU VÀO: ${inputData} (Gồm: Tên, Chiều cao, Thị lực, Học lực, Tính cách).
        NGUYÊN TẮC XẾP CHỖ:
        1. Cận thị -> Bàn đầu. 2. Cao -> Ngồi sau. 3. Học lực yếu -> Gần bàn GV. 
        4. Hiếu động -> Tách nhau ra. 5. Giỏi ngồi cạnh Yếu để hỗ trợ.
        TRÌNH BÀY: Vẽ sơ đồ lớp học bằng bảng Markdown rõ ràng từng vị trí bàn 1, 2, 3, 4.`;
      }

      else if (activeTab === 'canh-bao') {
        prompt = `Phân tích dữ liệu sau và đưa ra "CẢNH BÁO NGUY CƠ" cho GVCN. 
        Phát hiện HS có: Điểm giảm mạnh, Nghỉ học > 3 buổi, HK giảm hoặc ghi chú tiêu cực.
        Đề xuất biện pháp giáo dục cụ thể cho từng trường hợp.
        DỮ LIỆU: \n${inputData}`;
      }

      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (error) {
      setResult("Lỗi kết nối AI. Thầy/Cô vui lòng kiểm tra lại API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header chuẩn VietEdu Smart */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
              <UsersRound className="text-white" size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Trợ lý Chủ nhiệm AI</h1>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Hệ thống quản lý lớp học thông minh 5.0</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"><Printer size={20} /></button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"><Download size={20} /></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'nhan-xet', label: 'Nhận xét HS', icon: ClipboardList },
            { id: 'cho-ngoi', label: 'Xếp chỗ ngồi', icon: LayoutGrid },
            { id: 'canh-bao', label: 'Cảnh báo nguy cơ', icon: AlertTriangle },
            { id: 'ke-hoach', label: 'Kế hoạch & Phụ huynh', icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setResult(""); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                activeTab === tab.id ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Area */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800 uppercase text-sm flex items-center gap-2">
                  <Search size={18} className="text-rose-500" /> Dữ liệu đầu vào
                </h3>
                <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-1 rounded-lg font-bold">EXCEL / TEXT</span>
              </div>
              
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={
                  activeTab === 'nhan-xet' ? "Dán dữ liệu: Tên | Điểm | Hạnh kiểm..." :
                  activeTab === 'cho-ngoi' ? "Dán dữ liệu: Tên | Chiều cao | Thị lực | Học lực..." :
                  "Nhập tình hình lớp hoặc danh sách điểm để AI phân tích..."
                }
                className="w-full h-80 p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 focus:border-rose-400 outline-none text-sm font-medium transition-all resize-none"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-4 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-rose-200 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {loading ? "AI đang xử lý..." : "Bắt đầu thuật toán AI"}
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2.5rem] text-white">
              <h4 className="font-bold text-xs uppercase mb-3 opacity-60">Hướng dẫn nhanh</h4>
              <ul className="space-y-2 text-[11px] font-medium opacity-90">
                <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 text-rose-400" /> Thầy/Cô có thể copy trực tiếp từ Excel.</li>
                <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 text-rose-400" /> AI sẽ tự tách cột và phân tích theo logic sư phạm.</li>
              </ul>
            </div>
          </div>

          {/* Result Area */}
          <div className="lg:col-span-7">
            <div className="bg-white h-full min-h-[500px] rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Kết quả phân tích</span>
                {result && <button className="text-rose-600 font-bold text-[10px] uppercase flex items-center gap-1 hover:underline"><Save size={14}/> Lưu hồ sơ</button>}
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto prose prose-slate max-w-none">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase animate-pulse">Thuật toán đang chạy...</p>
                  </div>
                ) : result ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-serif text-slate-700 leading-relaxed">
                    {/* Render kết quả ở đây - Trong thực tế nên dùng ReactMarkdown */}
                    <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                    <Sparkles size={80} className="text-slate-300 mb-4" />
                    <p className="font-black uppercase text-xs tracking-[0.3em]">Chưa có dữ liệu kết quả</p>
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

export default TroLyChuNhiemAI;