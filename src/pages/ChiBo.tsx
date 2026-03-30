"use client";

import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Users, FileText, Calendar, Star, Award, 
  FolderOpen, Eye, Download, Search, Plus, X, 
  FileBadge, Landmark, Briefcase, FileUp, FileArchive
} from 'lucide-react';

export const ChiBo = () => {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Quản lý danh sách file thực tế cho từng thư mục
  const [storage, setStorage] = useState<Record<string, any[]>>({
    "Nghị quyết Chi bộ": [],
    "Hồ sơ Đảng viên": [],
    "Thi đua - Khen thưởng": [],
    "Thu chi Đảng phí": [],
  });

  const folders = [
    { name: "Nghị quyết Chi bộ", icon: FileText, desc: "Các quyết định, nghị quyết" },
    { name: "Hồ sơ Đảng viên", icon: Users, desc: "Lý lịch và quá trình công tác" },
    { name: "Thi đua - Khen thưởng", icon: Award, desc: "Hồ sơ phân loại, khen thưởng" },
    { name: "Thu chi Đảng phí", icon: Briefcase, desc: "Sổ sách tài chính Đảng" },
  ];

  // Hàm kích hoạt chọn file từ máy tính
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý khi người dùng chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && activeFolder) {
      const newFiles = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.name.split('.').pop()?.toUpperCase() || 'NA',
        date: new Date().toLocaleDateString('vi-VN'),
        url: URL.createObjectURL(file) // Tạo đường dẫn tạm để mở xem
      }));

      setStorage(prev => ({
        ...prev,
        [activeFolder]: [...prev[activeFolder], ...newFiles]
      }));
    }
    // Reset input để có thể chọn lại cùng 1 file nếu cần
    if (event.target) event.target.value = '';
  };

  const currentFiles = activeFolder ? storage[activeFolder] : [];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-8">
      {/* Input file ẩn để tương tác với máy tính */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        multiple 
      />

      {/* HEADER */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                <span>Chi bộ trường THCS Bình Hòa</span>
            </div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Hồ sơ nghiệp vụ Đảng</h1>
          </div>
        </div>
        <button 
          onClick={handleUploadClick}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700 transition-all flex items-center gap-2 shadow-md"
        >
          <FileUp size={14} /> Tải file lên từ máy
        </button>
      </div>

      {/* DANH MỤC THẺ HỒ SƠ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {folders.map((item, i) => (
          <button 
            key={i} 
            onClick={() => setActiveFolder(activeFolder === item.name ? null : item.name)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-start gap-3 relative ${
                activeFolder === item.name 
                ? 'bg-white border-red-600 shadow-md scale-[1.02]' 
                : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeFolder === item.name ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-400'
            }`}>
              <item.icon size={20} />
            </div>
            <div className="text-left">
                <span className={`text-[11px] font-black uppercase block ${activeFolder === item.name ? 'text-red-600' : 'text-slate-700'}`}>
                    {item.name}
                </span>
                <span className="text-[9px] font-bold text-slate-400 italic block">
                    {storage[item.name].length} tệp tin
                </span>
            </div>
          </button>
        ))}
      </div>

      {/* WORKSPACE - HIỂN THỊ FILE ĐÃ CHỌN */}
      {activeFolder && (
        <div className="bg-white rounded-xl border-2 border-slate-300 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
            <div className="bg-slate-900 p-4 flex justify-between items-center px-6">
                <div className="flex items-center gap-3">
                    <FolderOpen className="text-red-500" size={18}/>
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest italic">
                        Workspace: {activeFolder}
                    </h3>
                </div>
                <button onClick={() => setActiveFolder(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                    <thead>
                        <tr className="text-slate-400 font-black uppercase tracking-tighter border-b border-slate-100 bg-slate-50">
                            <th className="p-4 text-left w-12">STT</th>
                            <th className="p-4 text-left">Tên tệp từ máy tính</th>
                            <th className="p-4 text-left w-24">Dung lượng</th>
                            <th className="p-4 text-center w-24">Loại</th>
                            <th className="p-4 text-right w-32">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFiles.length > 0 ? (
                            currentFiles.map((doc, idx) => (
                                <tr key={doc.id} className="group hover:bg-blue-50/50 border-b border-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-slate-400">{idx + 1}</td>
                                    <td className="p-4 font-black text-slate-700 uppercase flex items-center gap-2">
                                        <FileText size={14} className="text-blue-500"/> {doc.name}
                                    </td>
                                    <td className="p-4 text-slate-500">{doc.size}</td>
                                    <td className="p-4 text-center">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black border border-slate-200">{doc.type}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {/* Nút mở file trực tiếp */}
                                            <a href={doc.url} target="_blank" rel="noreferrer" className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-blue-600 hover:border-blue-600 shadow-sm">
                                                <Eye size={14}/>
                                            </a>
                                            <button 
                                              onClick={() => {
                                                const updated = storage[activeFolder].filter(f => f.id !== doc.id);
                                                setStorage({...storage, [activeFolder]: updated});
                                              }}
                                              className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-rose-600 hover:border-rose-600 shadow-sm"
                                            >
                                                <X size={14}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <FileArchive size={48} />
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">Chưa có dữ liệu trong thư mục này</p>
                                        <button 
                                            onClick={handleUploadClick}
                                            className="mt-2 px-4 py-2 border-2 border-dashed border-slate-400 rounded-lg text-[9px] font-black hover:bg-slate-100 transition-all"
                                        >
                                            NHẤN ĐỂ CHỌN FILE TỪ MÁY
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {currentFiles.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={handleUploadClick} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase hover:underline">
                        <Plus size={14}/> Thêm tệp khác vào mục này
                    </button>
                </div>
            )}
        </div>
      )}

      {/* PHẦN DƯỚI: THẺ GHI CHÚ THỰC TẾ */}
      {!activeFolder && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xs font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-red-600" /> Trình trạng hồ sơ
                </h3>
                <div className="p-10 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center gap-2">
                    <Landmark size={32} className="text-slate-200" />
                    <p className="text-[10px] text-slate-400 font-bold italic uppercase">Vui lòng chọn thư mục để làm việc</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-4 italic underline underline-offset-4">Ghi chú công tác Chi bộ</h3>
                <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[11px] italic text-slate-300 outline-none focus:border-red-500 h-32 resize-none shadow-inner"
                    placeholder="Thầy ghi nội dung cần nhớ tại đây (ví dụ: Chuẩn bị hồ sơ đại hội, nhắc Đảng viên đóng Đảng phí...)"
                ></textarea>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChiBo;