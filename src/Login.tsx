"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { Loader2, ArrowRight, GraduationCap, CheckCircle2, KeyRound } from "lucide-react";

interface LoginProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"gv" | "admin" | "hs">("gv");
  const [studentPass, setStudentPass] = useState("");
  const [teacherCode, setTeacherCode] = useState(""); 
  const [showTeacherVerify, setShowTeacherVerify] = useState(false); 
  const [tempUser, setTempUser] = useState<any>(null);
  
  const navigate = useNavigate();

  // --- CẤU HÌNH BẢO MẬT ---
  const ADMIN_EMAIL = "tungnguyenthanh0088@gmail.com";
  const TEACHER_SECRET_CODE = "gv2026"; 
  const STUDENT_PASS = "2026";

  // 1. Xử lý Đăng nhập Google (Dành cho bản Web)
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        doLogin("admin", user.displayName || "Thầy Tùng Admin", user.photoURL || "");
        return;
      }

      setTempUser(user);
      setShowTeacherVerify(true); 
    } catch (error) {
      console.error("Lỗi Google:", error);
      alert("Trên bản Desktop, Thầy/Cô vui lòng nhập Mã xác thực trực tiếp bên dưới.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm đăng nhập chung để tái sử dụng
  const doLogin = (role: string, name: string, avatar: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    localStorage.setItem("username", name);
    localStorage.setItem("user_avatar", avatar);
    if (onLogin) onLogin();
    
    // Điều hướng dựa trên vai trò
    if (role === "student") navigate("/game-center");
    else navigate("/");
  };

  // 3. Xử lý đăng nhập bằng mã (Dành cho GV và Admin) - KHÔNG CẦN GOOGLE
  const handleQuickLogin = () => {
    if (teacherCode === TEACHER_SECRET_CODE) {
      if (activeTab === "admin") {
        doLogin("admin", "Quản trị viên", "");
      } else {
        doLogin("teacher", "Giáo viên nội bộ", "");
      }
    } else {
      alert("Mã xác thực nội bộ không đúng!");
    }
  };

  // 4. Đăng nhập Học sinh
  const handleStudentLogin = () => {
    if (studentPass === STUDENT_PASS) {
      doLogin("student", "Học sinh", "");
    } else {
      alert("Mã truy cập học sinh chưa đúng!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f0f2f5] p-4 font-sans z-[9999]">
      <div className="flex w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* PANEL TRÁI */}
        <div className="hidden lg:flex lg:w-[35%] bg-[#1a4cd3] p-12 flex-col justify-between text-white">
          <div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-tight">VIETEDU <br/> SMART</h1>
            <p className="text-white/70 text-sm mt-4 font-medium">Trợ lý AI cho giáo dục hiện đại.</p>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Thanh Tùng Design</p>
        </div>

        {/* PANEL PHẢI */}
        <div className="w-full lg:w-[65%] p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-black text-[#1e293b] mb-1 italic uppercase tracking-tighter">
              {showTeacherVerify ? "XÁC THỰC" : "ĐĂNG NHẬP"}
            </h2>
            <p className="text-slate-400 text-sm mb-10 font-medium italic">
              {showTeacherVerify ? "Nhập mã xác thực để hoàn tất" : "Chọn vai trò để bắt đầu"}
            </p>

            {!showTeacherVerify ? (
              <>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
                  {["gv", "hs", "admin"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white shadow-sm text-blue-700' : 'text-slate-400'}`}
                    >
                      {tab === "gv" ? "Giáo viên" : tab === "hs" ? "Học sinh" : "Quản trị"}
                    </button>
                  ))}
                </div>

                {activeTab === "hs" ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <input 
                      type="password" placeholder="Nhập mã 2026..." 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-center text-xl font-black tracking-[0.5em] focus:ring-2 focus:ring-blue-100 outline-none shadow-inner"
                      value={studentPass} onChange={(e) => setStudentPass(e.target.value)}
                    />
                    <button onClick={handleStudentLogin} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[12px] flex items-center justify-center gap-2 group">
                      VÀO HỌC TẬP <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* NÚT GOOGLE (Ưu tiên bản Web) */}
                    <button
                      onClick={handleGoogleLogin} disabled={loading}
                      className="w-full bg-white border-2 border-slate-100 hover:border-blue-100 text-slate-600 py-3.5 px-6 rounded-2xl font-bold flex justify-center items-center gap-3 transition-all active:scale-95"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="G" className="w-4 h-4" />
                      <span className="text-[11px] uppercase tracking-wider">Đăng nhập Google</span>
                    </button>

                    <div className="relative py-4 flex items-center">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase">Hoặc dùng mã nội bộ</span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    {/* Ô NHẬP MÃ NHANH (Cứu cánh cho bản Desktop) */}
                    <div className="relative">
                       <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="password" placeholder="Nhập mã gv2026..." 
                        className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={teacherCode} onChange={(e) => setTeacherCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuickLogin()}
                      />
                    </div>
                    
                    <button onClick={handleQuickLogin} className="w-full bg-[#1a4cd3] text-white py-4 rounded-2xl font-black uppercase text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all">
                      XÁC NHẬN TRUY CẬP <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* XÁC THỰC SAU KHI LOGIN GOOGLE (GIỮ LẠI NẾU DÙNG WEB) */
              <div className="space-y-4 animate-in zoom-in duration-300">
                <div className="p-4 bg-blue-50 rounded-2xl mb-4 flex items-center gap-3 border border-blue-100">
                   <img src={tempUser?.photoURL} className="w-10 h-10 rounded-full" alt="avatar" />
                   <div>
                      <p className="text-xs font-bold text-blue-800">{tempUser?.displayName}</p>
                      <p className="text-[10px] text-blue-600">Google Auth thành công</p>
                   </div>
                </div>
                <input 
                  type="password" placeholder="Nhập mã gv2026" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-center text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                  value={teacherCode} onChange={(e) => setTeacherCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickLogin()}
                />
                <button onClick={handleQuickLogin} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[12px] shadow-xl flex items-center justify-center gap-2">
                  HOÀN TẤT <CheckCircle2 size={16} />
                </button>
                <button onClick={() => setShowTeacherVerify(false)} className="w-full text-slate-400 text-[10px] font-bold uppercase">Quay lại</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}