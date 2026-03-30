"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, Search, GraduationCap, 
  BookOpen, Zap, Save, RefreshCw, Calendar, Plus, FileText, X, Video
} from 'lucide-react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

const StudentPadlet = () => {
  const [hoHs, setHoHs] = useState('');
  const [tenHs, setTenHs] = useState('');
  const [selectedKhoi, setSelectedKhoi] = useState('6');
  const [selectedLop, setSelectedLop] = useState('6.1');
  const [selectedMon, setSelectedMon] = useState('Toán');
  const [deBai, setDeBai] = useState('');
  const [dapAn, setDapAn] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [filterLop, setFilterLop] = useState('Tất cả');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Logic tính toán ngày dựa trên số Tuần
  const getRangeByWeekNumber = (weekNum: number) => {
    const mocNgay = new Date('2026-03-16'); 
    const mocTuan = 28;
    const diffWeeks = weekNum - mocTuan;
    const targetMon = new Date(mocNgay);
    targetMon.setDate(mocNgay.getDate() + (diffWeeks * 7));
    const targetSat = new Date(targetMon);
    targetSat.setDate(targetMon.getDate() + 5);

    const format = (d: Date) => {
      const dd = d.getDate().toString().padStart(2, '0');
      const mm = (d.getMonth() + 1).toString().padStart(2, '0');
      const yy = d.getFullYear().toString().slice(-2);
      return `${dd}/${mm}/${yy}`;
    };

    return {
      range: `${format(targetMon)} - ${format(targetSat)}`,
      deadline: format(targetSat)
    };
  };

  // 2. Tính tuần hiện tại tự động
  const autoWeek = useMemo(() => {
    const today = new Date();
    const mocNgay = new Date('2026-03-16');
    const diffDays = Math.floor((today.getTime() - mocNgay.getTime()) / (24 * 60 * 60 * 1000));
    const weekNum = 28 + Math.floor(diffDays / 7);
    return (weekNum > 0 && weekNum <= 37) ? weekNum : 28;
  }, []);

  const [selectedTuanNum, setSelectedTuanNum] = useState(autoWeek.toString());

  const currentWeekRange = useMemo(() => {
    return getRangeByWeekNumber(parseInt(selectedTuanNum));
  }, [selectedTuanNum]);

  const monOptions = ['Toán', 'Ngữ Văn', 'Tiếng Anh', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Khoa học tự nhiên', 'Lịch Sử', 'Địa Lý', 'Lịch sử và Địa lý', 'GDCD', 'Tin Học', 'Công Nghệ', 'Âm Nhạc', 'Mỹ Thuật', 'GDQP-AN', 'Thể Dục', 'Hoạt động trải nghiệm'];
  const khoiOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const lopOptions = Array.from({ length: 15 }, (_, i) => `${selectedKhoi}.${i + 1}`);
  const allWeeks = Array.from({ length: 37 }, (_, i) => (i + 1).toString());

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
      if (data) setPosts(data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchPosts();
    setDeBai(localStorage.getItem('current_de_bai') || '');
    setDapAn(localStorage.getItem('current_dap_an') || '');
  }, [fetchPosts]);

  const saveConfig = () => {
    localStorage.setItem('current_de_bai', deBai);
    localStorage.setItem('current_dap_an', dapAn);
    alert("✅ Đã lưu cấu hình đề bài và đáp án khắt khe!");
  };

  const handleDelete = async (id: any, studentName: string) => {
    if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa bài của em: ${studentName}?`)) {
      try {
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) throw error;
        setPosts(posts.filter(p => p.id !== id));
        alert("✅ Đã xóa thành công!");
      } catch (err: any) { alert("Lỗi: " + err.message); }
    }
  }

  // LOGIC CHẤM ĐIỂM QUAN TRỌNG
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenHs) return alert("Thầy nhắc các em nhập tên và chọn file nhé!");

    setIsUploading(true);
    setStatusMessage(file.type.startsWith('video/') ? "📤 ĐANG TẢI VIDEO..." : "🤖 AI GEMINI 2.5 ĐANG CHẤM ĐIỂM KHẮT KHE...");

    try {
      let aiGradeResult = "";
      
      if (file.type.startsWith('image/')) {
        // Cấu hình AI nghiêm túc nhất
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash", // Model Flash 2.5/2.0 mới nhất
          generationConfig: {
            temperature: 0.1, // Hạn chế sáng tạo, tập trung vào độ chính xác
            topP: 0.1,
          }
        });

        const reader = new FileReader();
        const base64Data = await new Promise((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });

        const prompt = `
          Bạn là một giám khảo cực kỳ KHẮT KHE và CẨN THẬN.
          NHIỆM VỤ: Chấm điểm bài làm của học sinh trong ảnh dựa trên Đề bài và Đáp án.
          
          DỮ LIỆU:
          - Đề bài: ${deBai}
          - Đáp án & Barem: ${dapAn}
          
          QUY TẮC CHẤM (BẮT BUỘC):
          1. Thang điểm 10. Điểm lẻ tính đến 0.25 (ví dụ: 6.25, 6.5, 6.75, 7.0).
          2. Trừ điểm nặng nếu: Sai kiến thức cơ bản, thiếu đơn vị, trình bày cẩu thả hoặc không rõ ràng.
          3. Không được "vớt" điểm. Nếu thiếu 1 ý nhỏ trong đáp án, phải trừ ít nhất 0.25 hoặc 0.5 tùy mức độ.
          4. Nếu bài làm quá sơ sài hoặc sai hướng, cho điểm thấp thẳng tay.
          
          ĐỊNH DẠNG TRẢ VỀ:
          [ĐIỂM]: .../10
          [NHẬN XÉT]: (Ghi rõ lỗi sai, điểm thiếu. Nhận xét thẳng thắn, nghiêm túc để học sinh tiến bộ).
        `;

        const result = await model.generateContent([{ inlineData: { data: base64Data as string, mimeType: file.type } }, prompt]);
        aiGradeResult = result.response.text();
      } else if (file.type.startsWith('video/')) {
        aiGradeResult = `[VIDEO]: ${file.name} | Đã nhận file thực hành. Giáo viên sẽ chấm sau.`;
      } else {
        aiGradeResult = `[TÀI LIỆU]: ${file.name} | Đã nộp thành công.`;
      }
      
      const fileName = `${Date.now()}_${file.name}`;
      await supabase.storage.from('BAI-NOP').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('BAI-NOP').getPublicUrl(fileName);

      await supabase.from('submissions').insert([{ 
        student_name: `${hoHs} ${tenHs}`.trim(), 
        image_url: publicUrl, 
        lop: selectedLop, 
        mon_hoc: `${selectedMon} (Tuần ${selectedTuanNum})`,
        ai_grade: aiGradeResult 
      }]);

      await fetchPosts();
      setHoHs(''); setTenHs('');
      alert("🎉 Đã hoàn tất chấm điểm!");
    } catch (err: any) { alert("Lỗi: " + err.message); } finally { setIsUploading(false); }
  };

  const filteredPosts = useMemo(() => {
    return filterLop === 'Tất cả' ? posts : posts.filter(p => p.lop === filterLop);
  }, [posts, filterLop]);

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen font-sans text-slate-900 text-sm">
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center text-white text-center p-4">
          <RefreshCw className="animate-spin mb-4" size={40} />
          <p className="font-bold text-xl">{statusMessage}</p>
        </div>
      )}

      {/* CẤU HÌNH CỦA THẦY */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-sm shadow-sm mb-4 border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black text-indigo-700 flex items-center gap-2 uppercase">
            <GraduationCap size={24} className="text-yellow-500" /> Viet Edu Smart Pro (Gemini 2.5)
          </h1>
          <button onClick={saveConfig} className="bg-indigo-600 text-white px-4 py-2 rounded-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm">
            <Save size={16} /> LƯU CẤU HÌNH CHẤM
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea value={deBai} onChange={(e) => setDeBai(e.target.value)} placeholder="Nội dung đề bài..." className="w-full h-20 p-3 bg-slate-50 rounded-sm border outline-none focus:border-indigo-500" />
          <textarea value={dapAn} onChange={(e) => setDapAn(e.target.value)} placeholder="Đáp án & Barem điểm..." className="w-full h-20 p-3 bg-slate-50 rounded-sm border outline-none focus:border-indigo-500" />
        </div>
      </div>

      {/* KHU VỰC NỘP BÀI */}
      <div className="max-w-7xl mx-auto bg-indigo-700 p-6 rounded-sm shadow-xl mb-6 text-white border-b-4 border-indigo-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter"><Zap size={20} className="text-yellow-400" /> Học sinh nộp bài</h3>
          <div className="bg-white/10 p-3 rounded-sm border border-white/20 flex items-center gap-4">
            <Calendar size={20} className="text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase opacity-80">Hạn nộp: {currentWeekRange.deadline}</span>
              <div className="flex items-center gap-1 font-black text-sm text-yellow-300">
                <span>Tuần</span>
                <select value={selectedTuanNum} onChange={(e) => setSelectedTuanNum(e.target.value)} className="bg-yellow-400 text-indigo-900 px-2 py-0.5 rounded-sm outline-none font-black">
                  {allWeeks.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <span className="ml-1 opacity-90">({currentWeekRange.range})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <input value={hoHs} onChange={(e) => setHoHs(e.target.value)} placeholder="Họ & chữ lót" className="p-3 rounded-sm bg-white/10 text-white border border-white/20 outline-none focus:bg-white focus:text-slate-900 font-bold" />
          <input value={tenHs} onChange={(e) => setTenHs(e.target.value)} placeholder="Tên" className="p-3 rounded-sm bg-white/10 text-white border border-white/20 outline-none focus:bg-white focus:text-slate-900 font-bold" />
          <select value={selectedKhoi} onChange={(e) => setSelectedKhoi(e.target.value)} className="p-3 rounded-sm bg-white text-slate-900 font-bold outline-none">
            {khoiOptions.map(k => <option key={k} value={k}>Khối {k}</option>)}
          </select>
          <select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)} className="p-3 rounded-sm bg-white text-slate-900 font-bold outline-none">
            {lopOptions.map(l => <option key={l} value={l}>Lớp {l}</option>)}
          </select>
          <select value={selectedMon} onChange={(e) => setSelectedMon(e.target.value)} className="p-3 rounded-sm bg-white text-slate-900 font-bold outline-none">
            {monOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <label className="bg-yellow-400 text-indigo-900 p-3 rounded-sm font-black text-center cursor-pointer hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 uppercase">
            <Plus size={20} strokeWidth={3} /> Gửi Bài
            <input type="file" onChange={handleUpload} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" />
          </label>
        </div>
      </div>

      {/* KẾT QUẢ */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="font-black text-lg uppercase flex items-center gap-2 text-slate-700"><BookOpen size={20} className="text-indigo-600" /> Bảng điểm AI</h2>
          <select value={filterLop} onChange={(e) => setFilterLop(e.target.value)} className="p-2 rounded-sm border bg-white font-bold text-xs shadow-sm">
            <option value="Tất cả">TẤT CẢ LỚP</option>
            {khoiOptions.map(k => Array.from({ length: 15 }, (_, i) => <option key={`${k}.${i+1}`} value={`${k}.${i+1}`}>Lớp {`${k}.${i+1}`}</option>))}
          </select>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Học sinh</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Thông tin</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">AI Nhận xét & Điểm</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Minh chứng</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <p className="font-black text-slate-800 uppercase">{post.student_name}</p>
                    <p className="text-[10px] text-slate-400">{new Date(post.created_at).toLocaleString('vi-VN')}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-sm font-black block w-fit mb-1">LỚP {post.lop}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm font-bold block w-fit">{post.mon_hoc}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-sm border border-slate-100 whitespace-pre-wrap">
                      {post.ai_grade}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <a href={post.image_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-slate-100 border border-slate-200 overflow-hidden group">
                      {post.image_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      ) : post.image_url?.match(/\.(mp4|mov|webm)$/i) ? (
                        <Video size={20} className="text-red-500" />
                      ) : (
                        <FileText size={20} className="text-slate-400" />
                      )}
                    </a>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(post.id, post.student_name)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all">
                      <X size={18} strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPadlet;