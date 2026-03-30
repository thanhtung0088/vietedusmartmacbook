"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { HeaderBar } from "@/components/HeaderBar";

// Thêm prop onLogout để khớp với App.tsx cũ của Thầy/Cô
interface LayoutProps {
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet sẽ render nội dung trang. Nếu trang trắng, hãy kiểm tra file page đó */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};