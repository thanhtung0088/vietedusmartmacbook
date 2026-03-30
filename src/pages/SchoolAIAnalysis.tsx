"use client";

import React, { useState } from 'react';
import { 
  BrainCircuit, FileSpreadsheet, TrendingUp, Users, Award, 
  AlertTriangle, RefreshCcw, Sparkles, BarChart3, X, 
  CheckCircle2, FileUp, Loader2, Info, ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

export const SchoolAIAnalysis = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [pastedData, setPastedData] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // States cho bộ lọc
  const [selectedGrade, setSelectedGrade] = useState('Khối 6');
  const [selectedTerm, setSelectedTerm] = useState('HK1');
  
  const [data, setData] = useState<{
    stats: any[],
    chartData: any[],
    timeline: any[],
    insight: string
  } | null>(null);

  const handleProcessData = () => {
    if (!pastedData.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const realResult = {
        stats: [
          { name: 'Học sinh phân tích', value: '452', trend: 'Thực tế', icon: <Users />, color: 'bg-blue-600' },
          { name: 'Tỉ lệ Trên TB', value: '78.5%', trend: selectedTerm, icon: <Award />, color: 'bg-indigo-600' },
          { name: 'Cần phụ đạo', value: '22', trend: 'HS yếu', icon: <AlertTriangle />, color: 'bg-rose-500' },
          { name: 'Điểm TB ' + selectedGrade, value: '7.2', trend: 'Toàn diện', icon: <TrendingUp />, color: 'bg-emerald-600' },
        ],
        chartData: [
          { subject: 'Toán', v: 7.2 }, { subject: 'Văn', v: 6.8 }, { subject: 'Anh', v: 7.5 }, { subject: 'Lý', v: 6.5 }, { subject: 'Hóa', v: 6.2 },
        ],
        timeline: [ { m: 'L1', s: 6.5 }, { m: 'L2', s: 7.0 }, { m: 'L3', s: 7.2 } ],
        insight: `Dựa trên dữ liệu ${selectedGrade} - ${selectedTerm} vừa nạp, AI nhận thấy môn Anh văn có sự tiến bộ vượt bậc.`
      };

      setData(realResult);
      setIsAnalyzing(false);
      setShowImportModal(false);
      setPastedData("");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-screen font-sans text-left">
      
      {/* 1. HEADER & FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 rounded-xl text-white shadow-lg"><BrainCircuit size={28} /></div>
          <div>
            <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight leading-none">AI Phân tích toàn trường</h2>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1 italic">
                {data ? `Dữ liệu thực: ${selectedGrade} - ${selectedTerm}` : 'Chờ nạp dữ liệu'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Chọn Khối */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${
                  selectedGrade === g ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Chọn Học Kỳ */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['HK1', 'HK2', 'CN'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${
                  selectedTerm === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
            <FileUp size={16}/> Nạp Excel
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data?.stats || Array(4).fill(null)).map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            {!data && <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center text-[9px] font-black text-slate-300 uppercase italic">Đang chờ...</div>}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-white ${s?.color || 'bg-slate-200'} shadow-lg`}>{s?.icon || <div className="w-5 h-5"/>}</div>
              <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-400">{s?.trend || '---'}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{s?.name || 'Chỉ số...'}</p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{s?.value || '--.--'}</p>
          </div>
        ))}
      </div>

      {/* 3. BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px] flex flex-col">
          <h3 className="text-sm font-black uppercase text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600"/> Phân tích môn học {selectedGrade}
          </h3>
          <div className="flex-1 w-full relative">
            {!data && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-50/40 rounded-xl border-2 border-dashed border-slate-100">
                <BarChart3 size={40} className="text-slate-200" />
                <span className="text-[10px] font-black text-slate-300 uppercase text-center">Nạp dữ liệu {selectedTerm} để xem biểu đồ</span>
            </div>}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:700}}/>
                <YAxis hide/>
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="v" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px] flex flex-col">
          <h3 className="text-sm font-black uppercase text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600"/> Xu hướng {selectedTerm}
          </h3>
          <div className="flex-1 w-full relative">
            {!data && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-50/40 rounded-xl border-2 border-dashed border-slate-100">
                <TrendingUp size={40} className="text-slate-200" />
                <span className="text-[10px] font-black text-slate-300 uppercase">Đang chờ dữ liệu thực...</span>
            </div>}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.timeline || []}>
                <Area type="monotone" dataKey="s" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={4}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 4. AI INSIGHTS */}
      <div className="bg-indigo-950 rounded-xl p-8 text-white min-h-[120px] relative overflow-hidden border-b-4 border-indigo-500">
         {!data ? (
           <div className="flex items-center gap-4 text-indigo-300 animate-pulse">
              <Info size={24} />
              <p className="text-[11px] font-black uppercase tracking-widest italic text-left">Hệ thống sẵn sàng cho {selectedGrade}. Vui lòng nạp dữ liệu {selectedTerm}.</p>
           </div>
         ) : (
           <div className="animate-in fade-in zoom-in duration-500 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-yellow-400 animate-pulse" size={20} />
                <h3 className="font-black uppercase tracking-widest text-[11px]">Kết luận từ trợ lý AI</h3>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed italic border-l-4 border-indigo-500 pl-4">
                {data.insight}
              </p>
           </div>
         )}
      </div>

      {/* --- MODAL NHẬP LIỆU --- */}
      {showImportModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowImportModal(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-200 text-left">
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg"><FileSpreadsheet size={24}/></div>
                <div>
                  <h3 className="font-black uppercase text-slate-800 leading-none">Nạp dữ liệu {selectedGrade}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 italic">Học kỳ hiện tại: {selectedTerm}</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24}/></button>
            </div>
            <div className="p-8">
              <textarea 
                value={pastedData} onChange={(e) => setPastedData(e.target.value)}
                className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-xs font-mono"
                placeholder={`Dán dữ liệu Excel cho ${selectedGrade} tại đây...`}
              />
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button onClick={() => setShowImportModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-100 rounded-xl">Hủy</button>
              <button onClick={handleProcessData} disabled={!pastedData.trim() || isAnalyzing}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>}
                Bắt đầu phân tích {selectedTerm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};