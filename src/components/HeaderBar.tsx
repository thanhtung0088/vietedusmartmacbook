"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Crown,
  Video,
  MessageSquare,
  Bell,
  X,
  Check,
  Calendar as CalIcon,
  KeyRound,
  ExternalLink,
  Search,
  Sparkles,
  Zap
} from "lucide-react";

export const HeaderBar = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState<string>("");
  const [time, setTime] = useState(new Date());
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const savedBanner = localStorage.getItem("school_banner");
    if (savedBanner) setBanner(savedBanner);

    const savedKey = localStorage.getItem("user_gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
    }
    return () => clearInterval(timer);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim().startsWith("AIzaSy") && apiKey.trim().length > 20) {
      localStorage.setItem("user_gemini_api_key", apiKey.trim());
      setIsKeySaved(true);
      alert("🎉 Đã kết nối 'chìa khóa' AI thành công!");
    } else {
      alert("❌ Mã Key không đúng. Vui lòng kiểm tra lại.");
    }
  };

  const formatDay = () => {
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return days[time.getDay()];
  };

  return (
    <>
      <header className="h-35 bg-[#00acee] flex items-center justify-between px-8 shadow-lg z-30 border-b border-white/10 relative">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">
          {/* BANNER */}
          <div className="w-56 h-[130px] bg-white/10 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/20 transition overflow-hidden relative">
            {banner ? (
              <img src={banner} className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={22} />
                <span className="text-[9px] font-black uppercase mt-1">Dán Banner (16:9)</span>
              </>
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result as string;
                  setBanner(base64);
                  localStorage.setItem("school_banner", base64);
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>

          {/* TEXT */}
          <div className="text-white text-left">
            <h2 className="text-[15px] font-black uppercase text-white/90 mb-1">
              Hệ sinh thái quản trị trường học & giảng dạy thế hệ mới
            </h2>
            <h1 className="text-4xl font-black text-[#ffaa00] uppercase italic">
              Chào mừng quý Thầy Cô !
            </h1>

            {/* API KEY */}
            <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full mt-6">
              <KeyRound size={14} className={isKeySaved ? "text-green-300" : "text-yellow-300"} />
              {isKeySaved ? (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold">Đã kết nối AI (...{apiKey.slice(-4)})</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user_gemini_api_key");
                      setApiKey("");
                      setIsKeySaved(false);
                    }}
                    className="text-[8px] underline"
                  >
                    Thay đổi
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Dán mã khóa AI..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-transparent text-[10px] outline-none w-40"
                  />
                  <button onClick={handleSaveKey} className="bg-green-500 px-2 py-1 rounded text-[9px]">
                    Kết nối
                  </button>
                  <button onClick={() => setShowGuideModal(true)} className="bg-white/10 px-2 py-1 rounded text-[9px]">
                    Cách lấy mã
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase"
            >
              <Crown size={14} />
              Nâng cấp PRO
            </button>

            <button onClick={() => window.open("https://meet.google.com")} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-[10px]">
              <Video size={14} />
              Họp online
            </button>

            <button onClick={() => window.open("https://chat.zalo.me")} className="flex items-center gap-2 bg-[#0068ff] px-4 py-2 rounded-lg text-[10px]">
              <MessageSquare size={14} />
              Zalo nội bộ
            </button>

            <button className="p-3 bg-white/10 rounded-lg">
              <Bell size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-lg text-white">
              <CalIcon size={14} />
              <span className="text-[10px] font-bold">{formatDay()} {time.toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 rounded-lg pl-8 pr-24 py-2 text-[8px]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ========================== */}
      {/* MODAL HƯỚNG DẪN LẤY MÃ AI (MỚI CẬP NHẬT) */}
      {/* ========================== */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setShowGuideModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase">Cách lấy khóa AI miễn phí</h2>
                  <p className="text-xs text-slate-500 font-bold">CHỈ MẤT 30 GIÂY ĐỂ KÍCH HOẠT QUYỀN NĂNG TRỢ LÝ</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { step: "01", title: "Truy cập Google AI Studio", desc: "Nhấn vào nút bên dưới để mở trang quản lý mã của Google.", link: "https://aistudio.google.com/app/apikey" },
                  { step: "02", title: "Tạo mã API Key", desc: "Nhấn vào nút 'Create API key' màu xanh trong trang mới hiện ra.", icon: <Zap size={14} /> },
                  { step: "03", title: "Sao chép & Dán", desc: "Copy đoạn mã có dạng 'AIzaSy...' và dán vào ô kết nối phía trên Header.", icon: <KeyRound size={14} /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-2xl font-black text-blue-200 italic">{item.step}</span>
                    <div>
                      <h4 className="font-black text-sm text-slate-700 uppercase flex items-center gap-2">
                        {item.title} {item.icon}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2 hover:underline"
                        >
                          Đến trang lấy mã ngay <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[10px] text-amber-700 leading-relaxed italic">
                  * Lưu ý: Mã này hoàn toàn bảo mật và miễn phí. Google cung cấp để Thầy Cô có thể sử dụng trí tuệ nhân tạo Gemini trực tiếp trên hệ thống này.
                </p>
              </div>

              <button 
                onClick={() => setShowGuideModal(false)}
                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg"
              >
                Tôi đã hiểu, để tôi thử!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================== */}
      {/* MODAL NÂNG CẤP PRO (GIỮ NGUYÊN) */}
      {/* ========================== */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[9999]">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl p-10 relative">
            <button onClick={() => setShowProModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500">
              <X size={22} />
            </button>
            <div className="text-center mb-10">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Crown className="text-blue-600" />
                <h2 className="text-sm font-black uppercase">Cập nhật nâng cao</h2>
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase">Lựa chọn gói dịch vụ phù hợp với Thầy/Cô</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* FREE */}
              <div className="bg-white rounded-3xl border p-8 text-center shadow-sm">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-3">STANDARD</h3>
                <p className="text-3xl font-black mb-6">Miễn phí</p>
                <ul className="space-y-3 text-left text-xs">
                  <li className="flex gap-2"><Check size={14} /> Soạn 03 bài AI/tháng</li>
                  <li className="flex gap-2"><Check size={14} /> Quản lý 01 lớp</li>
                  <li className="flex gap-2"><Check size={14} /> Kho học liệu</li>
                </ul>
                <button className="mt-8 w-full bg-gray-100 py-3 rounded-xl text-xs font-black">Đang sử dụng</button>
              </div>

              {/* PRO */}
              <div className="bg-white rounded-3xl border-2 border-blue-600 p-8 text-center shadow-xl scale-105 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black">Khuyên dùng</div>
                <h3 className="text-xs font-black uppercase text-blue-600 mb-3">PRO ACCESS</h3>
                <p className="text-3xl font-black mb-6">199k/tháng</p>
                <ul className="space-y-3 text-left text-xs">
                  <li className="flex gap-2"><Check size={14} /> Không giới hạn AI</li>
                  <li className="flex gap-2"><Check size={14} /> Trợ lý kế toán AI</li>
                  <li className="flex gap-2"><Check size={14} /> Full Game Center</li>
                  <li className="flex gap-2"><Check size={14} /> 100GB Cloud</li>
                </ul>
                <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-black">Nâng cấp ngay</button>
              </div>

              {/* ELITE */}
              <div className="bg-white rounded-3xl border p-8 text-center shadow-sm">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-3">ELITE SCHOOL</h3>
                <p className="text-3xl font-black mb-6">Liên hệ</p>
                <ul className="space-y-3 text-left text-xs">
                  <li className="flex gap-2"><Check size={14} /> Tùy chỉnh hệ thống riêng</li>
                  <li className="flex gap-2"><Check size={14} /> Hỗ trợ kỹ thuật 24/7</li>
                </ul>
                <div className="mt-6 bg-gray-50 rounded-xl p-4 border text-[11px] space-y-1">
                  <p className="font-bold text-gray-700">LH: Nguyễn Thanh Tùng</p>
                  <p className="text-gray-600">Số TK: <span className="font-bold">916033681</span></p>
                  <p className="text-gray-600">Ngân hàng Đông Á (VikkiME)</p>
                </div>
                <div className="mt-5 flex justify-center">
                  <img src="/zalo_qr.png" alt="QR Zalo" className="w-44 rounded-lg border shadow" />
                </div>
                <button className="mt-6 w-full bg-gray-100 py-3 rounded-xl text-xs font-black hover:bg-gray-200 transition">Quét QR để liên hệ Zalo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};