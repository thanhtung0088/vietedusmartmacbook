"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldCheck, School, Building2, Users, 
  UserSquare2, Brain, Table2, FolderInput, BookOpen, 
  LogOut, Camera, ClipboardCheck, PlayCircle, Disc, Gamepad2, Library, Sparkles,
  BrainCircuit, LayoutGrid 
} from 'lucide-react';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatar, setAvatar] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem('user_avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return <aside className="w-64 h-screen bg-[#0052cc] shrink-0" />;

  // Danh sách Menu - Đã sửa lỗi truyền Icon
  const menuItems = [
    { name: "Trang chủ", path: "/", icon: LayoutDashboard },
    { name: "Chi bộ", path: "/chi-bo", icon: ShieldCheck },
    { name: "Quản trị trường", path: "/school-admin", icon: School },
    { name: "Hành chính VP", path: "/hanh-chinh", icon: Building2 },
    { name: "Đoàn thể", path: "/doan-the", icon: Users },
    { name: "Tổ trưởng CM", path: "/to-truong", icon: UserSquare2 },
    { name: "Soạn bài AI", path: "/soan-bai", icon: Brain },
    { name: "Sổ điểm thông minh", path: "/so-diem", icon: Table2 },
    { name: "Hồ sơ chủ nhiệm", path: "/homeroom", icon: FolderInput },
    { name: 'Kế hoạch chuyên môn', path: '/school-plan', icon: BookOpen },
    { name: "Bức tường nộp bài", path: "/padlet", icon: LayoutGrid }, 
    { name: "Rubrics đánh giá", path: "/rubrics", icon: ClipboardCheck },
    { name: "Video bài giảng", path: "/video-lessons", icon: PlayCircle },
    { name: "Vòng quay may mắn", path: "/lucky-wheel", icon: Disc },
    { name: "Game Center", path: "/game-center", icon: Gamepad2 },
    { name: "Học liệu mở", path: "/hoc-lieu-mo", icon: Library },
    { name: "Giới thiệu ứng dụng", path: "/about", icon: Sparkles },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0052cc] flex flex-col sticky top-0 shadow-xl overflow-hidden border-r border-blue-400/20 z-40 shrink-0 font-sans">
      
      {/* KHU VỰC AVATAR */}
      <div className="flex flex-col items-center pt-6 pb-8 bg-blue-900/10 border-b border-blue-400/10 relative">
        <div className="relative group z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-blue-800 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:scale-105">
            {avatar ? (
              <img src={avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <Camera size={28} className="text-blue-300" />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 text-[9px] font-black uppercase">
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              Thay ảnh
            </label>
          </div>
          <div className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-500 border-2 border-[#0052cc] rounded-full"></div>
        </div>
        
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.15em] text-blue-100 italic">
          VIETEDUSMART-PRO 2026
        </p>
      </div>

      {/* MENU ITEMS */}
      <div className="flex-1 overflow-y-auto pl-0 pr-2 py-4 custom-scrollbar scroll-smooth"> 
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon; // Gán vào biến viết hoa để dùng làm Component
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-r-xl mb-1 transition-all duration-200 relative group
                ${isActive ? 'bg-white text-blue-700 shadow-md translate-x-1' : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'}`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-400 rounded-r-full"></div>}
              <IconComponent size={16} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-200 group-hover:scale-110 transition-transform'}`} />
              <span className="font-bold uppercase text-[10px] tracking-wide whitespace-nowrap">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* CHÂN TRANG */}
      <div className="p-4 border-t border-blue-400/20 bg-blue-900/30 space-y-3">
        <div className="text-center py-2 px-1 bg-white/5 rounded-lg border border-white/5">
            <span className="text-[9px] font-bold text-blue-100 uppercase tracking-widest block opacity-80">
                TK: Nguyễn Thanh Tùng
            </span>
        </div>
        <button 
          onClick={() => confirm("Thầy/Cô có chắc chắn muốn thoát hệ thống?") && navigate("/logout")} 
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-600 hover:text-white transition-all font-black uppercase text-[9px] tracking-widest border border-rose-500/10"
        >
          <LogOut size={16} /> <span>Thoát hệ thống</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </aside>
  );
};