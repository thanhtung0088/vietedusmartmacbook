"use client";
import StudentPadlet from './StudentPadlet'; 
// Nhập cả hai loại Router để điều hướng thông minh
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { AIAssistant } from './components/AIAssistant';
import { ShieldAlert } from 'lucide-react';
import { SchoolAIAnalysis } from "./pages/SchoolAIAnalysis";

// --- HÀM BỌC AN TOÀN (Safe Lazy) ---
const safeLazy = (importPromise: () => Promise<any>, pageName: string) => {
  return lazy(() => 
    importPromise()
      .then(module => {
        if (module.default) return module;
        const keys = Object.keys(module).filter(k => typeof module[k] === 'function');
        if (keys.length > 0) return { default: module[keys[0]] };
        throw new Error(`Trang ${pageName} không tìm thấy thành phần hiển thị.`);
      })
      .catch((err) => {
        console.error(`Lỗi tại phân hệ ${pageName}:`, err);
        return { 
          default: () => (
            <div className="h-[60vh] flex flex-col items-center justify-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 m-6 p-12 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert size={40} />
              </div>
              <h3 className="text-xl font-black uppercase text-slate-800 tracking-tighter">Đang đồng bộ dữ liệu</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-2 italic max-w-sm">
                Phân hệ {pageName} đang được cập nhật.
              </p>
            </div>
          ) 
        };
      })
  );
};

// --- BỘ LỌC PHÂN QUYỀN (GUARDS) ---
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const TeacherGuard = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("userRole");
  if (role === "student") return <Navigate to="/game-center" replace />;
  return <>{children}</>;
};

// --- ĐĂNG KÝ CÁC TRANG ---
const Login = safeLazy(() => import('./Login'), "Đăng nhập");
const Logout = safeLazy(() => import('./Logout'), "Đăng xuất");
const Dashboard = safeLazy(() => import('./pages/Dashboard'), "Trang chủ");
const SchoolPlan = safeLazy(() => import('./pages/SchoolPlan'), "Kế hoạch chuyên môn");
const Homeroom = safeLazy(() => import('./pages/Homeroom'), "Hồ sơ chủ nhiệm");
const ChiBo = safeLazy(() => import('./pages/ChiBo'), "Chi bộ");
const SchoolManagement = safeLazy(() => import('./pages/SchoolManagement'), "Quản trị trường");
const SoanBaiAI = safeLazy(() => import('./pages/ai-tools/SoanBaiAI'), "Soạn bài AI");
const SoanTkbAI = safeLazy(() => import('./pages/ai-tools/SoanTkbAI'), "Soạn TKB AI");
const SoanVanBanAI = safeLazy(() => import('./pages/ai-tools/SoanVanBanAI'), "Soạn văn bản AI");
const TroLyKeToanAI = safeLazy(() => import('./pages/ai-tools/TroLyKeToanAI'), "Trợ lý Kế toán AI");
const TroLyChuNhiemAI = safeLazy(() => import('./pages/ai-tools/TroLyChuNhiemAI'), "Trợ lý Chủ nhiệm AI");
const ToTruongChuyenMonAI = safeLazy(() => import('./pages/ai-tools/ToTruongChuyenMonAI'), "Trợ lý Tổ trưởng CM AI");
const LuckyWheel = safeLazy(() => import('./pages/LuckyWheel'), "Vòng quay may mắn");
const SmartGradebookPage = safeLazy(() => import('./pages/SmartGradebookPage'), "Sổ điểm");
const OfficeAdmin = safeLazy(() => import('./pages/OfficeAdmin'), "Hành chính");
const DoanThe = safeLazy(() => import('./pages/DoanThe'), "Đoàn thể");
const ToTruongCM = safeLazy(() => import('./pages/ToTruongCM'), "Tổ trưởng");
const Rubrics = safeLazy(() => import('./pages/Rubrics'), "Rubrics đánh giá");
const HocLieuMo = safeLazy(() => import('./pages/HocLieuMo'), "Học liệu mở");
const GameCenter = safeLazy(() => import('./pages/GameCenter'), "Game Center");
const VideoLessons = safeLazy(() => import('./pages/VideoLessons'), "Video bài giảng");
const About = safeLazy(() => import('./pages/About'), "Giới thiệu ứng dụng");

function App() {
  // KIỂM TRA MÔI TRƯỜNG: Nếu là Electron hoặc chạy file cục bộ thì dùng HashRouter
  const isElectron = typeof window !== 'undefined' && 
                     (window.navigator.userAgent.toLowerCase().includes('electron') || 
                      window.location.protocol === 'file:');

  const ContentRouter = isElectron ? HashRouter : BrowserRouter;

  return (
    <ContentRouter>
      <Suspense fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1e40af] text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">VietEdu Smart - Khởi chạy...</h2>
        </div>
      }>
        <Routes>
          {/* 1. Các trang không dùng Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* 2. Các trang nằm TRONG Layout (Có Sidebar & Header) */}
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<TeacherGuard><Dashboard /></TeacherGuard>} />
            
            <Route path="school-admin" element={<TeacherGuard><SchoolManagement /></TeacherGuard>} />
            <Route path="chi-bo" element={<TeacherGuard><ChiBo /></TeacherGuard>} />
            <Route path="doan-the" element={<TeacherGuard><DoanThe /></TeacherGuard>} />
            <Route path="to-truong" element={<TeacherGuard><ToTruongCM /></TeacherGuard>} />
            <Route path="hanh-chinh" element={<TeacherGuard><OfficeAdmin /></TeacherGuard>} />
            <Route path="so-diem" element={<TeacherGuard><SmartGradebookPage /></TeacherGuard>} />
            <Route path="homeroom" element={<TeacherGuard><Homeroom /></TeacherGuard>} />
            <Route path="school-plan" element={<TeacherGuard><SchoolPlan /></TeacherGuard>} />
            <Route path="rubrics" element={<TeacherGuard><Rubrics /></TeacherGuard>} />
            <Route path="admin/ai-analysis" element={<SchoolAIAnalysis />} />
            
            <Route path="soan-bai" element={<TeacherGuard><SoanBaiAI /></TeacherGuard>} />
            <Route path="soan-tkb" element={<TeacherGuard><SoanTkbAI /></TeacherGuard>} />
            <Route path="van-ban" element={<TeacherGuard><SoanVanBanAI /></TeacherGuard>} />
            <Route path="ke-toan" element={<TeacherGuard><TroLyKeToanAI /></TeacherGuard>} />
            <Route path="chu-nhiem-ai" element={<TeacherGuard><TroLyChuNhiemAI /></TeacherGuard>} />
            <Route path="to-truong-ai" element={<TeacherGuard><ToTruongChuyenMonAI /></TeacherGuard>} />

            <Route path="game-center" element={<GameCenter />} />
            <Route path="hoc-lieu-mo" element={<HocLieuMo />} />
            <Route path="video-lessons" element={<VideoLessons />} />
            <Route path="lucky-wheel" element={<LuckyWheel />} />
            <Route path="about" element={<About />} /> 

            <Route path="padlet" element={<StudentPadlet />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <AIAssistant />
      </Suspense>
    </ContentRouter>
  );
}

export default App;