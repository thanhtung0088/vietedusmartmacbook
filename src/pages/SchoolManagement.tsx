"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, ClipboardPaste, FileSpreadsheet, ShieldCheck, 
  Download, Trash2, CheckCircle2, Loader2, Plus, 
  ChevronLeft, FileText, Image as ImageIcon,
  LayoutGrid, Wallet, GraduationCap, Warehouse, BarChart3, Cpu, Calendar, Inbox,
  Search, Bell, ArrowUpRight, UserCheck, FileStack, BrainCircuit, Sparkles,
  Bot, Settings
} from 'lucide-react';

// Nhập các component bổ trợ (Đảm bảo các file này tồn tại trong thư mục của bạn)
import SoanTkbAI from './ai-tools/SoanTkbAI';
import { SchoolAIAnalysis } from './SchoolAIAnalysis'; 

// --- 1. CẤU TRÚC CÁC CỘT DỮ LIỆU ---
const TAB_CONFIGS: any = {
  'Nhân sự & Tổ chức': {
    columns: [
      { label: 'Mã định danh', key: 'idCode', width: 'w-32' },
      { label: 'Họ và tên', key: 'name', width: 'w-48' },
      { label: 'Năm sinh', key: 'dob', width: 'w-24' },
      { label: 'Phân công CM', key: 'assignment', width: 'w-84' },
      { label: 'Ghi chú', key: 'note', width: 'auto' }
    ]
  },
  'Trợ lý Hiệu trưởng AI': {
    columns: [
      { label: 'Nội dung phân tích', key: 'name', width: 'w-64' },
      { label: 'Gợi ý từ AI', key: 'assignment', width: 'w-84' },
      { label: 'Ghi chú', key: 'note', width: 'auto' }
    ]
  },
  'Quản lý tài chính': {
    columns: [
      { label: 'Mã chứng từ', key: 'idCode', width: 'w-32' },
      { label: 'Nội dung chi', key: 'name', width: 'w-64' },
      { label: 'Số tiền', key: 'amount', width: 'w-32' },
      { label: 'Ngày thực hiện', key: 'dob', width: 'w-32' },
      { label: 'Ghi chú', key: 'note', width: 'auto' }
    ]
  },
  'Báo cáo tổng hợp': {
    columns: [
      { label: 'Nguồn gửi', key: 'source', width: 'w-40' },
      { label: 'Loại văn bản', key: 'type', width: 'w-32' },
      { label: 'Tên báo cáo/Kế hoạch', key: 'name', width: 'w-64' },
      { label: 'Ngày nhận', key: 'receivedDate', width: 'w-32' },
      { label: 'Trạng thái', key: 'status', width: 'w-32' },
      { label: 'Người duyệt', key: 'approver', width: 'auto' }
    ]
  },
  'Lịch công tác tuần': {
    columns: [
      { label: 'Thứ/Ngày', key: 'date', width: 'w-32' },
      { label: 'Nội dung công việc', key: 'name', width: 'w-80' },
      { label: 'Thành phần', key: 'members', width: 'w-48' },
      { label: 'Chủ trì', key: 'host', width: 'auto' }
    ]
  },
  'Công văn mới': {
    columns: [
      { label: 'Số hiệu', key: 'idCode', width: 'w-32' },
      { label: 'Ngày ban hành', key: 'dob', width: 'w-32' },
      { label: 'Trích yếu nội dung', key: 'name', width: 'w-80' },
      { label: 'Cơ quan ban hành', key: 'agency', width: 'w-48' },
      { label: 'Mức độ', key: 'priority', width: 'auto' }
    ]
  }
};

// --- 2. DANH SÁCH CÁC TAB ---
const TABS = [
  { id: 'Nhân sự & Tổ chức', icon: <ShieldCheck size={16}/> },
  { id: 'Trợ lý Hiệu trưởng AI', icon: <Bot size={16}/> }, 
  { id: 'Quản lý tài chính', icon: <Wallet size={16}/> },
  { id: 'Quản lý chuyên môn', icon: <GraduationCap size={16}/> },
  { id: 'Quản lý CSVC', icon: <Warehouse size={16}/> },
  { id: 'Báo cáo tổng hợp', icon: <BarChart3 size={16}/> },
  { id: 'Soạn TKB AI', icon: <Cpu size={16}/> },
  { id: 'Lịch công tác tuần', icon: <Calendar size={16}/> },
  { id: 'Công văn mới', icon: <Inbox size={16}/> },
  { id: 'AI Phân tích chất lượng', icon: <BrainCircuit size={16}/> },
];

export const SchoolManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Lưu trữ dữ liệu tập trung
  const [allData, setAllData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vietedu_hr_master_v3');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('vietedu_hr_master_v3', JSON.stringify(allData));
  }, [allData]);

  const currentTabData = allData[activeTab] || Array(10).fill({});
  const currentConfig = TAB_CONFIGS[activeTab] || TAB_CONFIGS['Nhân sự & Tổ chức'];

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  const handleCellChange = (index: number, key: string, value: string) => {
    const newTabData = [...currentTabData];
    newTabData[index] = { ...newTabData[index], [key]: value };
    setAllData({ ...allData, [activeTab]: newTabData });
  };

  const handleImport = () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const rows = pastedText.split(/\r?\n/).filter(row => row.trim() !== "");
      const newEntries = rows.map((row) => {
        const cols = row.split(/\t/);
        const entry: any = {};
        currentConfig.columns.forEach((col: any, index: number) => {
          entry[col.key] = cols[index] || "";
        });
        return entry;
      });
      setAllData({ ...allData, [activeTab]: newEntries });
      setIsProcessing(false);
      setShowPasteModal(false);
      setPastedText("");
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] p-2 overflow-hidden font-sans text-left">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-300">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all flex items-center gap-1 group">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Quay lại</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg text-white shadow-lg"><LayoutGrid size={18} /></div>
            <div>
              <h1 className="font-black uppercase italic text-[13px] tracking-tighter text-slate-800 leading-none">Quản trị trường học số</h1>
              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 italic">VietEdu AI Dashboard 2026</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 w-64">
                <Search size={14} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Tìm kiếm dữ liệu..." className="bg-transparent outline-none text-[11px] font-bold w-full" />
            </div>
            <button className="p-2 text-slate-400 hover:text-indigo-600 relative"><Bell size={18} /><span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span></button>
            <button onClick={() => window.location.href = '/'} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><X size={18} /></button>
        </div>
      </div>

      {/* --- TABS MENU --- */}
      <div className="flex gap-2 mb-2 overflow-x-auto pb-3 pt-1 custom-scrollbar-h select-none">
        <div className="flex gap-2 min-w-max px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all border-2 shadow-sm ${
                activeTab === tab.id 
                ? 'bg-indigo-700 text-white border-indigo-800 shadow-indigo-200 ring-4 ring-indigo-50 scale-105 z-10' 
                : 'bg-white text-slate-500 border-slate-300 hover:border-indigo-400 hover:text-indigo-600 active:scale-95'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-yellow-400' : 'text-slate-400'}`}>
                {tab.icon}
              </span>
              {tab.id}
            </button>
          ))}
        </div>
      </div>

      {/* --- VÙNG LÀM VIỆC CHÍNH --- */}
      <div className="flex-1 bg-white rounded-2xl border-2 border-slate-300 shadow-inner overflow-hidden flex flex-col">
        
        {/* NỘI DUNG TỪNG TAB */}
        {activeTab === 'Soạn TKB AI' ? (
          <div className="flex-1 overflow-hidden"><SoanTkbAI /></div>
        ) : activeTab === 'AI Phân tích chất lượng' ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50"><SchoolAIAnalysis /></div>
        ) : activeTab === 'Trợ lý Hiệu trưởng AI' ? (
          /* ============================================================
             GIAO DIỆN SIÊU TRỢ LÝ AI (TRUNG TÂM ĐIỀU HÀNH)
             ============================================================ */
          <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden animate-in fade-in duration-500">
            {/* 1. THẺ THỐNG KÊ AI (LẤY DỮ LIỆU THẬT) */}
            {(() => {
                const hrData = allData['Nhân sự & Tổ chức'] || [];
                const finData = allData['Quản lý tài chính'] || [];
                const repData = allData['Báo cáo tổng hợp'] || [];
                
                const totalStaff = hrData.filter((i:any) => i.name).length;
                const totalCash = finData.reduce((sum:number, i:any) => sum + (Number(i.amount) || 0), 0);
                const pending = repData.filter((i:any) => i.status?.includes("Chờ")).length;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                      <div className="bg-white p-5 rounded-[1rem] border-2 border-blue-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all w-fit"><UserCheck size={20} /></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mt-4">Nhân sự hiện diện</p>
                          <h4 className="text-2xl font-black text-slate-800 italic">{totalStaff} <span className="text-sm font-bold text-slate-400">cán bộ</span></h4>
                      </div>
                      <div className="bg-white p-5 rounded-[1rem] border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all w-fit"><Wallet size={20} /></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mt-4">Tổng chi tháng</p>
                          <h4 className="text-2xl font-black text-slate-800 italic">{totalCash.toLocaleString()} <span className="text-sm font-bold text-slate-400">đ</span></h4>
                      </div>
                      <div className="bg-white p-5 rounded-[1rem] border-2 border-rose-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all w-fit"><Inbox size={20} /></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mt-4">Báo cáo chờ</p>
                          <h4 className="text-2xl font-black text-slate-800 italic">{pending} <span className="text-sm font-bold text-slate-400">văn bản</span></h4>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-[1rem] shadow-lg relative overflow-hidden group">
                          <div className="relative z-10 text-white">
                              <p className="text-[10px] font-black uppercase text-indigo-100">Sức khỏe hệ thống</p>
                              <h4 className="text-2xl font-black italic mt-2 tracking-tighter">ỔN ĐỊNH 98%</h4>
                              <div className="w-full bg-white/20 h-1.5 rounded-full mt-4"><div className="bg-yellow-400 h-full w-[98%]"></div></div>
                          </div>
                          <BrainCircuit size={80} className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform" />
                      </div>
                  </div>
                )
            })()}

            {/* 2. KHUNG CHAT VÀ ĐIỀU HÀNH */}
            <div className="flex-1 px-6 pb-6 flex gap-6 overflow-hidden">
                {/* TRÁI: AI TERMINAL */}
                <div className="flex-[1.8] bg-white rounded-[1rem] border-2 border-slate-300 shadow-2xl flex flex-col overflow-hidden">
                    <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center animate-pulse"><Bot size={22}/></div>
                            <div>
                                <h3 className="font-black uppercase italic text-[12px]">Hệ điều hành AI VietEdu</h3>
                                <p className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Trực tuyến</p>
                            </div>
                        </div>
                        <Settings size={18} className="text-slate-500 cursor-pointer" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0"><Sparkles size={18}/></div>
                            <div className="max-w-[85%] bg-white p-5 rounded-3xl rounded-tl-none border border-slate-200 shadow-sm">
                                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                    Chào Hiệu trưởng! Dữ liệu từ tab Nhân sự và Tài chính đã được tôi đồng bộ. <br />
                                    Hiện tại chưa có xung đột lịch dạy nào được phát hiện. Ông muốn tôi phân tích rủi ro ngân sách hay lập báo cáo tuần?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 bg-white border-t-2 border-slate-100 flex items-center gap-2">
                        <input type="text" placeholder="Gửi yêu cầu cho AI (VD: Phân tích bảng lương)..." className="flex-1 py-4 px-6 bg-slate-100 rounded-2xl outline-none font-bold text-[13px] focus:bg-white border-2 border-transparent focus:border-indigo-500 transition-all" />
                        <button className="p-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"><ArrowUpRight size={20}/></button>
                    </div>
                </div>

                {/* PHẢI: QUICK ACTIONS */}
                <div className="flex-1 space-y-4">
                    <div className="bg-white p-6 rounded-[1rem] border-2 border-slate-300 shadow-xl text-left">
                        <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-6">Lệnh điều hành nhanh</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-white hover:shadow-lg transition-all group">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-indigo-600"><FileStack size={16}/></div>
                                <span className="text-[10px] font-black uppercase text-slate-600">Tối ưu TKB tự động</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white hover:shadow-lg transition-all group">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-emerald-600"><BarChart3 size={16}/></div>
                                <span className="text-[10px] font-black uppercase text-slate-600">Dự báo chất lượng HS</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all group">
                                <div className="p-2 bg-white/10 rounded-lg shadow-sm text-white"><Download size={16}/></div>
                                <span className="text-[10px] font-black uppercase">Xuất báo cáo AI</span>
                            </button>
                        </div>
                    </div>
                    {/* BIỂU ĐỒ GIẢ LẬP BẰNG CSS */}
                    <div className="bg-white p-6 rounded-[1rem] border-2 border-slate-300 shadow-xl flex-1 text-left flex flex-col">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Chỉ số nề nếp tuần</h3>
                        <div className="flex-1 flex items-end gap-2 px-2">
                            {[60, 40, 95, 70, 85, 45, 65].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group transition-all hover:bg-indigo-500" style={{height: '100%'}}>
                                    <div className={`absolute bottom-0 w-full rounded-t-lg transition-all ${h > 80 ? 'bg-indigo-500' : 'bg-slate-300'}`} style={{height: `${h}%`}}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          /* --- MẶC ĐỊNH CHO CÁC TAB BẢNG DỮ LIỆU --- */
          <>
            <div className="p-3 border-b-2 border-slate-300 bg-slate-50 flex justify-between items-center px-6">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white uppercase bg-indigo-600 px-3 py-1.5 rounded-lg shadow-md italic">{activeTab}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowPasteModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-indigo-700 transition-all"><ClipboardPaste size={14}/> Dán dữ liệu Excel</button>
                    <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-emerald-700 transition-all"><Download size={14}/> Xuất file</button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-200/40 custom-scrollbar">
                <div className="bg-white border-2 border-slate-400 shadow-2xl overflow-hidden min-w-[1250px] rounded-lg">
                    <table className="w-full text-[11px] border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white font-black uppercase italic tracking-widest text-center">
                                <th className="p-3 border-2 border-slate-700 w-12">STT</th>
                                {currentConfig.columns.map((col: any, i: number) => (
                                    <th key={i} className={`p-3 border-2 border-slate-700 ${col.width}`}>{col.label}</th>
                                ))}
                                <th className="p-3 border-2 border-slate-700 w-12 text-rose-400"><Trash2 size={14}/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTabData.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-blue-50/80 transition-colors text-left">
                                    <td className="p-2 text-center text-slate-900 font-black bg-slate-100 border-2 border-slate-400">{index + 1}</td>
                                    {currentConfig.columns.map((col: any) => (
                                        <td key={col.key} className="p-0 border-2 border-slate-400">
                                            <input type="text" value={item[col.key] || ""} onChange={(e) => handleCellChange(index, col.key, e.target.value)} className="w-full p-2.5 bg-transparent outline-none font-bold text-slate-800 focus:bg-yellow-50 transition-all text-left" placeholder="..." />
                                        </td>
                                    ))}
                                    <td className="p-2 border-2 border-slate-400 text-center bg-slate-50">
                                        <button onClick={() => {
                                          const filtered = currentTabData.filter((_: any, i: number) => i !== index);
                                          setAllData({ ...allData, [activeTab]: filtered });
                                        }} className="text-slate-300 hover:text-rose-600"><X size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </>
        )}
      </div>

      {/* --- MODAL NHẬP LIỆU --- */}
      {showPasteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowPasteModal(false)}></div>
          <div className="bg-white w-full max-w-4xl rounded-[1rem] shadow-2xl relative z-10 overflow-hidden border-4 border-slate-400 text-left">
            <div className="p-8 border-b-2 border-slate-300 bg-slate-50 flex justify-between items-center text-slate-800">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><FileSpreadsheet size={32}/></div>
                    <div><h3 className="text-lg font-black uppercase tracking-tight">Cổng nạp dữ liệu Excel</h3><p className="text-[10px] font-bold text-rose-500 uppercase">Dán đúng cột để AI xử lý chính xác</p></div>
                </div>
                <button onClick={() => setShowPasteModal(false)} className="text-slate-400 hover:text-rose-600"><X size={32} /></button>
            </div>
            <div className="p-8">
                <textarea autoFocus value={pastedText} onChange={(e) => setPastedText(e.target.value)} className="w-full h-80 p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl outline-none focus:bg-white text-sm font-mono transition-all" placeholder="Quét khối trong Excel và dán vào đây..." />
            </div>
            <div className="p-8 border-t-2 border-slate-300 bg-slate-50 flex gap-4">
                <button onClick={handleImport} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                   {isProcessing ? <Loader2 className="animate-spin"/> : <CheckCircle2 size={18}/>} Xác nhận cập nhật
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default SchoolManagement;