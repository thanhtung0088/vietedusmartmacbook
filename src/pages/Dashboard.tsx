"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { 
  Brain, Table2, FileText, Briefcase, UserCheck, 
  Calendar, Cpu, FileType, 
  Disc, ArrowRight, Loader2, Scan, 
  Maximize2, CheckCircle2, Clock
} from 'lucide-react';
import { CountdownTimer } from '../components/CountdownTimer';

// --- ĐỊNH NGHĨA INTERFACE ---
interface TkbEntry { mon: string; lop: string; }
interface TkbData { [key: string]: { sang: TkbEntry[]; chieu: TkbEntry[]; }; }

const DAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const TIETS = [1, 2, 3, 4, 5];

const createEmptyTkb = (): TkbData => {
  const data: TkbData = {};
  DAYS.forEach(day => {
    data[day] = {
      sang: Array(5).fill(null).map(() => ({ mon: "", lop: "" })),
      chieu: Array(5).fill(null).map(() => ({ mon: "", lop: "" }))
    };
  });
  return data;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [showTkbModal, setShowTkbModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [tkbData, setTkbData] = useState<TkbData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vietedu_tkb');
      return saved ? JSON.parse(saved) : createEmptyTkb();
    }
    return createEmptyTkb();
  });
  
  const [todayFullSchedule, setTodayFullSchedule] = useState<{sang: TkbEntry[], chieu: TkbEntry[]}>({ 
    sang: Array(5).fill({ mon: "", lop: "" }), 
    chieu: Array(5).fill({ mon: "", lop: "" }) 
  });
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(27);
  const [weekRange, setWeekRange] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const presentationRef = useRef<HTMLDivElement>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  // --- HÀM CẬP NHẬT HIỂN THỊ HÔM NAY ---
  const updateTodayDisplay = (data: TkbData) => {
    const now = new Date();
    const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const todayName = dayNames[now.getDay()];
    
    if (todayName !== "Chủ Nhật" && data[todayName]) {
      setTodayFullSchedule({
        sang: data[todayName].sang,
        chieu: data[todayName].chieu
      });
    } else {
      setTodayFullSchedule({
        sang: Array(5).fill({ mon: "", lop: "" }),
        chieu: Array(5).fill({ mon: "", lop: "" })
      });
    }
  };

  // --- HÀM LƯU TÀI KHOẢN ---
  const saveAndApply = () => {
    localStorage.setItem('vietedu_tkb', JSON.stringify(tkbData));
    updateTodayDisplay(tkbData);
    setShowTkbModal(false);
  };

  // --- HÀM QUÉT TKB BẰNG AI (ĐÃ CẢI TIẾN) ---
  const handleRealAiScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    setScanProgress(0);

    try {
      const { data: { lines } } = await Tesseract.recognize(file, 'vie', {
        logger: m => { if (m.status === 'recognizing text') setScanProgress(Math.round(m.progress * 100)); }
      });
      
      const newData = createEmptyTkb(); 
      let currentDay = "";

      lines.forEach((lineObj) => {
        const lineText = lineObj.text.trim();
        const lowerLine = lineText.toLowerCase();
        
        // 1. Nhận diện thứ
        DAYS.forEach(day => {
          if (lowerLine.includes(day.toLowerCase()) || lowerLine.includes(day.replace("Thứ ", "T").toLowerCase())) {
            currentDay = day;
          }
        });

        if (currentDay) {
          // 2. Nhận diện Tiết (ví dụ: "Tiết 1", "T1", hoặc chỉ số "1")
          const tietMatch = lowerLine.match(/(?:tiết|t|tiét)\s*([1-5])/i) || lowerLine.match(/^([1-5])\s+/);
          const tietIndex = tietMatch ? parseInt(tietMatch[1]) - 1 : -1;

          if (tietIndex !== -1) {
            // 3. Tách Môn (Chữ in hoa) và Lớp (Số + Chữ)
            const monMatch = lineText.match(/[A-ZÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶEÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴ]{2,}/g);
            const lopMatch = lineText.match(/\d{1,2}[A-Z]{1,2}\d?/g);

            if (monMatch) {
              const session = lowerLine.includes("chiều") ? "chieu" : "sang";
              newData[currentDay][session][tietIndex] = {
                mon: monMatch[0],
                lop: lopMatch ? lopMatch[0] : ""
              };
            }
          }
        }
      });
      
      setTkbData(newData);
    } catch (error) {
      console.error("Lỗi quét AI:", error);
      alert("Không thể nhận diện hình ảnh. Vui lòng chụp ảnh rõ nét hơn.");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    const startDate = new Date('2026-03-09'); 
    const offsetDays = (selectedWeek - 27) * 7;
    const currentWeekStart = new Date(startDate);
    currentWeekStart.setDate(startDate.getDate() + offsetDays);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 5);
    const f = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    setWeekRange(`(${f(currentWeekStart)} - ${f(currentWeekEnd)})`);
  }, [selectedWeek]);

  useEffect(() => { updateTodayDisplay(tkbData); }, [tkbData]);

  return (
    <div className="max-w-full mx-auto flex flex-col min-h-[calc(100vh-140px)] space-y-4 pb-6 px-2 text-slate-800 font-sans">
      
      {/* 1. HÀNG THẺ AI */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { name: "Soạn bài giảng AI", path: "/soan-bai", icon: Brain, color: "bg-blue-600" },
          { name: "Soạn TKB AI", path: "/soan-tkb", icon: Table2, color: "bg-emerald-600" },
          { name: "Soạn văn bản AI", path: "/van-ban", icon: FileText, color: "bg-orange-600" },
          { name: "Trợ lý Kế toán AI", path: "/ke-toan", icon: Briefcase, color: "bg-purple-600" },
          { name: "Trợ lý chủ nhiệm AI", path: "/chu-nhiem-ai", icon: UserCheck, color: "bg-rose-600" },
          { name: "Trợ lý Tổ trưởng CM AI", path: "/to-truong-ai", icon: Briefcase, color: "bg-indigo-600" },
        ].map((card, i) => (
          <button key={i} onClick={() => navigate(card.path)} className={`${card.color} p-4 rounded-xl text-white flex items-center gap-3 shadow-md hover:-translate-y-1 transition-all`}>
            <card.icon size={20}/>
            <span className="text-[10px] font-black uppercase tracking-tighter text-left leading-tight">{card.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 items-stretch">
        {/* 2. LỊCH DẠY HÔM NAY */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[450px] overflow-hidden">
          <div className="bg-blue-600 p-3 flex justify-between items-center shrink-0">
            <h3 className="text-[10px] font-black uppercase text-white flex items-center gap-2"><Calendar size={14}/> Lịch dạy hôm nay</h3>
            <button onClick={() => setShowTkbModal(true)} className="text-[8px] font-black bg-white/20 text-white px-2 py-1 rounded-md border border-white/30 uppercase italic hover:bg-white/40">Cập nhật TKB</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20 custom-scrollbar">
            {/* Buổi Sáng */}
            <div className="space-y-2">
              <p className="text-[9px] font-black text-blue-600 uppercase border-b border-blue-100 pb-1 italic">--- Buổi Sáng ---</p>
              {todayFullSchedule.sang.map((item, index) => (
                <div key={`s-${index}`} className={`flex justify-between items-center p-3 rounded-xl border shadow-sm transition-all ${item.mon ? 'border-blue-100 bg-white' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                  <span className={`text-[9px] font-black ${item.mon ? 'text-blue-500' : 'text-slate-400'}`}>TIẾT {index + 1}</span>
                  <div className="text-right uppercase">
                    {item.mon ? (
                      <>
                        <p className="text-[11px] font-black text-slate-800">{item.mon}</p>
                        <p className="text-[9px] font-bold text-blue-400">Lớp {item.lop}</p>
                      </>
                    ) : (
                      <p className="text-[10px] font-black text-slate-400 italic">Trống</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Buổi Chiều */}
            <div className="space-y-2">
              <p className="text-[9px] font-black text-orange-600 uppercase border-b border-orange-100 pb-1 italic">--- Buổi Chiều ---</p>
              {todayFullSchedule.chieu.map((item, index) => (
                <div key={`c-${index}`} className={`flex justify-between items-center p-3 rounded-xl border shadow-sm transition-all ${item.mon ? 'border-orange-100 bg-white' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                  <span className={`text-[9px] font-black ${item.mon ? 'text-orange-500' : 'text-slate-400'}`}>TIẾT {index + 1}</span>
                  <div className="text-right uppercase">
                    {item.mon ? (
                      <>
                        <p className="text-[11px] font-black text-slate-800">{item.mon}</p>
                        <p className="text-[9px] font-bold text-orange-400">Lớp {item.lop}</p>
                      </>
                    ) : (
                      <p className="text-[10px] font-black text-slate-400 italic">Trống</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. TRÌNH CHIẾU AI */}
        <div className="col-span-12 lg:col-span-6 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col h-[450px] bg-slate-900" 
             style={{ backgroundImage: `url('/Classroom.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest drop-shadow-md">
              <Cpu size={16} className="text-blue-400 animate-pulse"/> Trung tâm trình chiếu
            </h3>
            <div className="flex gap-2">
              <button onClick={() => pdfInputRef.current?.click()} className="bg-white/20 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 backdrop-blur-md border border-white/30">
                <FileType size={14}/> Nạp PDF <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && setPdfUrl(URL.createObjectURL(e.target.files[0]))} />
              </button>
              {pdfUrl && (
                <button onClick={() => presentationRef.current?.requestFullscreen()} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors shadow-lg">
                  <Maximize2 size={14}/>
                </button>
              )}
            </div>
          </div>

          <div ref={presentationRef} className="flex-1 rounded-lg overflow-hidden relative z-10 bg-slate-800/30 flex items-center justify-center border border-white/20 backdrop-blur-[2px]">
            {pdfUrl ? (
              <iframe src={pdfUrl} className="w-full h-full border-none bg-white shadow-2xl" title="Viewer" />
            ) : (
              <p className="text-white font-black uppercase italic text-sm drop-shadow-lg">Chưa có tài liệu trình chiếu</p>
            )}
          </div>
        </div>

        {/* 4. CÔNG VIỆC TUẦN CM */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[450px] overflow-hidden">
          <div className="bg-rose-600 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase"><FileText size={14}/> Công việc trong Tuần CM</div>
            <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))} className="bg-white/20 text-white text-[10px] font-black rounded border border-white/30 px-1 outline-none">
              {Array.from({length: 37}, (_, i) => i + 1).map(n => <option key={n} value={n} className="text-slate-800">Tuần {n}</option>)}
            </select>
          </div>
          <div className="px-4 py-2 bg-rose-50 border-b border-rose-100 text-center">
            <p className="text-[10px] font-bold text-rose-600 italic">{weekRange}</p>
          </div>
          <div className="flex-1 p-0 relative">
            <textarea 
              className="w-full h-full p-6 bg-transparent border-none outline-none text-[13px] font-medium text-slate-600 resize-none leading-[30px]" 
              placeholder="Ghi chú công việc cụ thể..."
              style={{
                backgroundImage: 'linear-gradient(#f1f5f9 1.1px, transparent 1.1px)',
                backgroundSize: '100% 30px',
                lineHeight: '30px',
                paddingTop: '6px'
              }}
            />
          </div>
        </div>
      </div>

      {/* 5. VÒNG QUAY & ĐỒNG HỒ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl px-6 h-[114px] flex items-center justify-between shadow-lg group">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"><Disc size={24} className="animate-spin-slow" /></div>
            <div>
              <h3 className="text-lg font-black uppercase leading-tight italic">Vòng quay</h3>
              <p className="text-white/60 text-[9px] font-bold uppercase italic tracking-wider">Gọi tên ngẫu nhiên</p>
            </div>
          </div>
          <button onClick={() => navigate('/lucky-wheel')} className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg hover:scale-105 transition-all flex items-center gap-2">Bắt đầu <ArrowRight size={14} /></button>
        </div>

        <div ref={timerContainerRef} className="h-[114px] bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden relative flex flex-col justify-center bg-slate-50/30">
            <div className="absolute top-2 left-4 right-4 flex justify-between items-center z-10">
               <div className="flex items-center gap-2 text-slate-400 font-black text-[8px] uppercase"><Clock size={12}/> Đồng hồ đếm ngược </div>
               <button onClick={() => timerContainerRef.current?.requestFullscreen()} className="text-slate-400 hover:text-blue-600 transition-colors"><Maximize2 size={12}/></button>
            </div>
            <div className="scale-75 origin-center"><CountdownTimer /></div>
        </div>
      </div>

      {/* 6. MODAL QUẢN LÝ TKB */}
      {showTkbModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[7000] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[95vw] h-[92vh] rounded-3xl shadow-3xl flex flex-col overflow-hidden border-4 border-emerald-600/20">
               <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Table2 size={20}/></div>
                     <div>
                       <h2 className="text-lg font-black uppercase text-slate-800 italic">Quản lý Thời khóa biểu</h2>
                       <div className="flex gap-4 mt-1">
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleRealAiScan} />
                         <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase hover:underline">
                           {isScanning ? <Loader2 size={10} className="animate-spin"/> : <Scan size={10}/>} {isScanning ? `Đang quét AI: ${scanProgress}%` : "Quét TKB từ ảnh"}
                         </button>
                       </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setShowTkbModal(false)} className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase italic">Hủy</button>
                     <button onClick={saveAndApply} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-2 shadow-md hover:bg-emerald-500 transition-all"><CheckCircle2 size={14}/> Lưu & Áp dụng</button>
                  </div>
               </div>

               <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
                 <table className="w-full border-separate border-spacing-1 min-w-[800px]">
                   <thead>
                     <tr>
                       <th className="w-16 bg-slate-800 text-white p-3 rounded-lg text-[9px] font-black uppercase">Tiết</th>
                       {DAYS.map(day => <th key={day} className="bg-slate-800 text-white p-3 rounded-lg text-[9px] font-black uppercase">{day}</th>)}
                     </tr>
                   </thead>
                   <tbody>
                     <tr><td colSpan={7} className="py-2 text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-100 italic pt-4">--- Buổi Sáng ---</td></tr>
                     {TIETS.map((t) => (
                       <tr key={`s-${t}`}><td className="bg-blue-600 text-white font-black text-center rounded-lg py-2 italic text-xs">T{t}</td>
                         {DAYS.map(d => (
                           <td key={`${d}-s-${t}`} className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                             <div className="flex gap-1">
                               <input value={tkbData[d].sang[t-1].mon} onChange={(e) => { const v = e.target.value; setTkbData(p => ({...p, [d]: {...p[d], sang: p[d].sang.map((it, i) => i === t-1 ? {...it, mon: v} : it)}})); }} className="w-full bg-slate-50 px-2 py-1 text-[10px] font-black uppercase border-none rounded outline-blue-200" placeholder="Môn" />
                               <input value={tkbData[d].sang[t-1].lop} onChange={(e) => { const v = e.target.value; setTkbData(p => ({...p, [d]: {...p[d], sang: p[d].sang.map((it, i) => i === t-1 ? {...it, lop: v} : it)}})); }} className="w-12 bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-600 border-none rounded outline-blue-200" placeholder="Lớp" />
                             </div>
                           </td>
                         ))}
                       </tr>
                     ))}
                     <tr><td colSpan={7} className="py-2 text-[10px] font-black text-orange-600 uppercase border-b-2 border-orange-100 italic pt-8">--- Buổi Chiều ---</td></tr>
                     {TIETS.map((t) => (
                       <tr key={`c-${t}`}><td className="bg-orange-600 text-white font-black text-center rounded-lg py-2 italic text-xs">T{t}</td>
                         {DAYS.map(d => (
                           <td key={`${d}-c-${t}`} className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                             <div className="flex gap-1">
                               <input value={tkbData[d].chieu[t-1].mon} onChange={(e) => { const v = e.target.value; setTkbData(p => ({...p, [d]: {...p[d], chieu: p[d].chieu.map((it, i) => i === t-1 ? {...it, mon: v} : it)}})); }} className="w-full bg-slate-50 px-2 py-1 text-[10px] font-black uppercase border-none rounded outline-orange-200" placeholder="Môn" />
                               <input value={tkbData[d].chieu[t-1].lop} onChange={(e) => { const v = e.target.value; setTkbData(p => ({...p, [d]: {...p[d], chieu: p[d].chieu.map((it, i) => i === t-1 ? {...it, lop: v} : it)}})); }} className="w-12 bg-orange-50 px-2 py-1 text-[9px] font-black text-orange-600 border-none rounded outline-orange-200" placeholder="Lớp" />
                             </div>
                           </td>
                         ))}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Dashboard;