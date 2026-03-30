"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Sparkles, Settings, PenTool, FileText, Plus, Target, 
  Table, EyeOff, MessageSquare, BrainCircuit, Zap
} from 'lucide-react';

const SUPABASE_URL = 'https://erkeqbxlwofjjddtqwiw.supabase.co'; 
const SUPABASE_ANON_KEY = 'DÁN_ANON_KEY_CỦA_THẦY_VÀO_ĐÂY';   
const GEMINI_API_KEY = 'DÁN_MÃ_GEMINI_API_KEY_2_5_VÀO_ĐÂY';    

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PadletPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [activeConfigTab, setActiveConfigTab] = useState<'req' | 'ans'>('req');
  
  // KHÔI PHỤC PHƯƠNG THỨC CHẤM
  const [gradingMode, setGradingMode] = useState<'auto' | 'manual'>('auto');
  const [examReq, setExamReq] = useState(''); 
  const [hiddenAnswer, setHiddenAnswer] = useState(''); 
  const [summaryTable, setSummaryTable] = useState<string | null>(null);

  const subjects = ["Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "GDCD", "Tin học", "Công nghệ", "KHTN", "Lịch sử & Địa lý", "Âm nhạc", "Mỹ thuật"];
  const [formData, setFormData] = useState({ name: '', grade: '6', subject: 'Toán học', classNum: '6.1' });

  useEffect(() => {
    loadData();
    const sub = supabase.channel('any').on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => loadData()).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const handleSummarize = async () => {
    const filteredPosts = posts.filter(p => activeTab === 'Tất cả' || p.class_name === activeTab);
    if (filteredPosts.length === 0) return alert("Chưa có bài để tổng hợp!");
    const dataString = filteredPosts.map(p => `HS: ${p.student_name}, Môn: ${p.subject}, KQ: ${p.ai_grade}`).join("\n");
    const prompt = `Lập bảng điểm Markdown cho lớp ${activeTab}. Gồm: STT, Tên, Môn, Điểm, Nhận xét ngắn. Dữ liệu: ${dataString}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const resJson = await response.json();
    setSummaryTable(resJson.candidates[0].content.parts[0].text);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.name) return alert("Học sinh vui lòng nhập tên!");
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `viedu_${Date.now()}.${fileExt}`;
    
    try {
      const { data: upData } = await supabase.storage.from('BAI-NOP').upload(fileName, file);
      if (upData) {
        const { data: { publicUrl } } = supabase.storage.from('BAI-NOP').getPublicUrl(fileName);
        
        // LOGIC CHẤM KẾT HỢP
        const promptInstruction = `Bạn là giáo viên môn ${formData.subject}. Chấm bài cho em ${formData.name}.
        ${gradingMode === 'auto' ? 'PHƯƠNG THỨC: AI Tự giải bài tập trong ảnh.' : `PHƯƠNG THỨC: Chấm dựa trên Đáp án chuẩn: ${hiddenAnswer}`}
        Yêu cầu/Đề bài bổ sung: ${examReq || "Không có"}
        YÊU CẦU ĐẦU RA: Cho điểm/10 và nhận xét ngắn gọn, chuyên nghiệp. Không nhắc lại đáp án mật.`;

        const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt!.toLowerCase());
        const aiBody = isImage 
          ? { contents: [{ parts: [{ text: promptInstruction }, { inline_data: { mime_type: file.type, data: await fetch(publicUrl).then(r => r.arrayBuffer()).then(b => btoa(String.fromCharCode(...new Uint8Array(b)))) } }] }] }
          : { contents: [{ parts: [{ text: `${promptInstruction} (Nội dung file: ${fileExt})` }] }] };

        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aiBody)
        });
        const resJson = await aiRes.json();
        await supabase.from('submissions').insert([{ student_name: formData.name, class_name: formData.classNum, subject: formData.subject, image_url: publicUrl, ai_grade: resJson.candidates[0].content.parts[0].text }]);
        setFormData({ ...formData, name: '' });
      }
    } catch (e) { alert("Lỗi chấm bài!"); } finally { setIsUploading(false); }
  };

  const classes = ['Tất cả', ...Array.from(new Set(posts.map(p => p.class_name))).sort()];

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* KHU VỰC CẤU HÌNH CỦA THẦY */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><Settings size={16} className="text-blue-600"/> Cấu hình bài chấm</h2>
              {/* NÚT CHỌN PHƯƠNG THỨC CHẤM MỚI QUAY TRỞ LẠI */}
              <div className="flex bg-slate-100 p-1 rounded-md">
                <button onClick={() => setGradingMode('auto')} className={`px-3 py-1 flex items-center gap-1 rounded text-[9px] font-black uppercase transition-all ${gradingMode === 'auto' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><Zap size={12}/> AI Tự Chấm</button>
                <button onClick={() => setGradingMode('manual')} className={`px-3 py-1 flex items-center gap-1 rounded text-[9px] font-black uppercase transition-all ${gradingMode === 'manual' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}><Target size={12}/> Chấm theo đáp án</button>
              </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-md h-fit">
              <button onClick={() => setActiveConfigTab('req')} className={`px-4 py-1.5 flex items-center gap-2 rounded text-[10px] font-black uppercase transition-all ${activeConfigTab === 'req' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><MessageSquare size={14}/> Đề bài</button>
              <button onClick={() => setActiveConfigTab('ans')} className={`px-4 py-1.5 flex items-center gap-2 rounded text-[10px] font-black uppercase transition-all ${activeConfigTab === 'ans' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}><EyeOff size={14}/> Đáp án mật</button>
            </div>
          </div>
          
          <textarea className={`w-full h-20 p-3 rounded-md text-[11px] font-medium outline-none border transition-all ${activeConfigTab === 'req' ? 'bg-blue-50/50 border-blue-100' : 'bg-rose-50/30 border-rose-100'}`} 
            placeholder={activeConfigTab === 'req' ? "Thầy viết yêu cầu kiểm tra hoặc đề bài tại đây..." : "Dán đáp án mật để AI đối chiếu (HS sẽ không thấy)..."} 
            value={activeConfigTab === 'req' ? examReq : hiddenAnswer} 
            onChange={e => activeConfigTab === 'req' ? setExamReq(e.target.value) : setHiddenAnswer(e.target.value)} />
        </div>

        {/* FORM NỘP BÀI (GIỮ NGUYÊN) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">1. Tên HS</label><input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none" placeholder="Họ tên..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">2. Khối</label><select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value, classNum: `${e.target.value}.1`})}>{Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>Khối {i+1}</option>)}</select></div>
          <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">3. Môn</label><select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">4. Lớp</label><select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none text-blue-600" value={formData.classNum} onChange={e => setFormData({...formData, classNum: e.target.value})}>{Array.from({length: 15}, (_, i) => <option key={i+1} value={`${formData.grade}.${i+1}`}>Lớp {formData.grade}.{i+1}</option>)}</select></div>
          <label className="bg-blue-600 text-white p-3 rounded-md flex justify-center items-center gap-2 font-black text-[11px] uppercase cursor-pointer hover:bg-blue-700 shadow-md transition-all active:scale-95">
            {isUploading ? "..." : <Plus size={18}/>} {isUploading ? "Đang chấm" : "Nộp bài ngay"}
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf,.doc,.docx,.ppt,.pptx" />
          </label>
        </div>

        {/* CÁC PHẦN DƯỚI (GRID & TỔNG HỢP) GIỮ NGUYÊN */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {classes.map(cls => (
              <button key={cls} onClick={() => {setActiveTab(cls); setSummaryTable(null);}} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase whitespace-nowrap transition-all ${activeTab === cls ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>{cls === 'Tất cả' ? cls : `Lớp ${cls}`}</button>
            ))}
          </div>
          <button onClick={handleSummarize} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md text-[10px] font-black uppercase hover:bg-emerald-700 shadow-md"><Table size={14}/> Tổng hợp bảng điểm {activeTab}</button>
        </div>

        {summaryTable && (
          <div className="mb-10 p-6 bg-white border-2 border-emerald-200 rounded-lg shadow-xl animate-in zoom-in duration-300">
            <h3 className="text-emerald-700 font-black text-sm uppercase mb-4 flex justify-between">Bảng tổng hợp {activeTab} <button onClick={() => setSummaryTable(null)}>X</button></h3>
            <pre className="text-[11px] text-slate-700 font-mono bg-slate-50 p-4 rounded-md whitespace-pre-wrap italic">{summaryTable}</pre>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.filter(p => activeTab === 'Tất cả' || p.class_name === activeTab).map((p) => (
            <div key={p.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-100 relative">
                <img src={p.image_url} className="w-full h-full object-cover" alt="Bài nộp"/>
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-md">Lớp {p.class_name}</div>
              </div>
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div><h4 className="font-black text-slate-800 text-[10px] uppercase">{p.student_name}</h4><p className="text-[8px] font-bold text-blue-500 uppercase">{p.subject}</p></div>
                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black italic">Đã chấm</div>
              </div>
              <div className="p-4 flex-1 bg-white">
                <div className="bg-slate-50 rounded-md p-3 border border-slate-100 h-full">
                  <div className="flex items-center gap-1.5 mb-2 text-blue-600"><Sparkles size={10}/><span className="text-[9px] font-black uppercase italic">AI Feedback</span></div>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-bold italic whitespace-pre-line">{p.ai_grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PadletPage;