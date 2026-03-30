"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
// CHÚ Ý DÒNG NÀY: Dấu ./ nghĩa là tìm file firebaseConfig nằm ngay cùng thư mục src với nó
import { auth } from "./firebaseConfig"; 
import { signOut } from "firebase/auth";

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // 1. Lệnh này sẽ dùng 'auth' từ file firebaseConfig Thầy vừa tạo
        await signOut(auth);
        
        // 2. Xóa sạch dữ liệu tạm trên máy
        localStorage.clear();

        // 3. Đợi một chút rồi về trang đăng nhập
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        // Nếu lỗi vẫn cho về trang login để đồng nghiệp không bị kẹt
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f0f4f8] z-[10000]">
      <div className="p-10 bg-white rounded-[40px] shadow-2xl max-w-md w-full text-center border border-white">
        <div className="mx-auto mb-6 w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center">
          <LogOut className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic leading-tight">Đang thoát khỏi<br/>hệ thống</h2>
        <div className="flex items-center justify-center gap-3 text-blue-600 font-bold mt-6">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-[11px] uppercase tracking-widest">Đang bảo mật dữ liệu...</span>
        </div>
      </div>
    </div>
  );
};

export default Logout;