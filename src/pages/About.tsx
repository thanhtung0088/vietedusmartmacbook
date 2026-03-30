"use client";

import React from 'react';
import { Sparkles, PlayCircle, Heart } from 'lucide-react';

export const About = () => (
  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
    {/* BÊN TRÁI: THƯ NGỎ (CÓ NÚT CUỘN) */}
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[500px]">
      <h2 className="text-xl font-black text-blue-700 mb-6 uppercase flex items-center gap-2">
        <Sparkles size={20} /> Thư Ngỏ VietEdu 2026
      </h2>
      
      <div className="text-[13px] text-slate-600 space-y-5 leading-relaxed overflow-y-auto pr-4 custom-scrollbar">
        <h3 className="font-black text-slate-800 text-sm uppercase">CÙNG VIETEDU SMART-PRO 2026 THẮP SÁNG NGỌN LỬA GIÁO DỤC SỐ</h3>
        
        <p className="italic font-medium text-blue-600">Kính thưa quý Thầy Cô – Những người kỹ sư tâm hồn tận tụy!</p>
        
        <p>Thầy cô có bao giờ tự hỏi: “Nếu không phải dành hàng giờ mỗi tối để soạn từng trang giáo án, soạn báo cáo, kế hoạch kẻ bảng hay loay hoay với những tệp hồ sơ dày cộm... mình sẽ dành thời gian đó để làm gì?”</p>
        
        <p>Có lẽ là một tách trà ấm bên gia đình, một cuốn sách hay chưa kịp đọc, hay đơn giản là thêm một ý tưởng sáng tạo cho tiết dạy ngày mai thêm bùng nổ. Chúng tôi thấu hiểu rằng: Phía sau mỗi tiết dạy thăng hoa là một sự hy sinh thầm lặng về thời gian và sức khỏe.</p>
        
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
           <p className="font-bold text-blue-800 mb-2">🔥 TẠI SAO VIETEDU LÀ "CUỘC CÁCH MẠNG"?</p>
           <ul className="space-y-3">
             <li><strong>1. Sidebar Toàn Năng:</strong> Một chạm đến mọi đích đến giáo vụ ngay bên trái màn hình.</li>
             <li><strong>2. Soạn Bài AI:</strong> Trợ lý gợi ý khung bài giảng và hoạt động khởi động hấp dẫn chỉ trong vài giây.</li>
             <li><strong>3. Lớp Học Hạnh Phúc:</strong> Vòng quay may mắn và Game Center giúp tiết dạy đầy phấn khích.</li>
             <li><strong>4. Sổ Điểm & Hồ Sơ "Không Giấy Tờ":</strong> Tự động hóa tính toán, biểu đồ và hồ sơ theo chuẩn của Bộ Giáo dục.</li>
           </ul>
        </div>

        <p>Chúng tôi không mang đến một công cụ làm khó thầy cô. Chúng tôi mang đến sự <strong>TỰ DO</strong>. Tự do khỏi những con số khô khan, khỏi thủ tục rườm rà để thầy cô tập trung vào việc yêu thương và thấu hiểu học trò.</p>
        
        <p>Hãy để VietEduSmart-Pro 2026 gánh vác những vất vả đời thường, để thầy cô thảnh thơi tận hưởng niềm hạnh phúc của nghề giáo.</p>
        
        <div className="pt-4 border-t border-slate-100">
          <p className="font-black text-slate-800 uppercase text-xs">Trân trọng,</p>
          <p className="font-black text-blue-700 text-base">Thanh Tùng</p>
          <p className="text-[11px] text-slate-400">Đội ngũ phát triển Hệ sinh thái VietEduSmart-Pro 2026</p>
        </div>
      </div>
    </div>

    {/* BÊN PHẢI: VIDEO (GIỮ NGUYÊN) */}
    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center h-[500px]">
      <div className="mb-6">
        <div className="bg-white/10 p-4 rounded-full animate-pulse">
          <PlayCircle size={48} className="text-white" />
        </div>
      </div>
      <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Video Giới Thiệu Hệ Sinh Thái</h3>
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border-4 border-white/5 shadow-2xl">
         <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/yBK8o6myu-g"
          title="VietEdu Intro"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p className="mt-6 text-white/40 text-[10px] uppercase font-medium tracking-tight">Khám phá hành trình số hóa giáo dục cùng chúng tôi</p>
    </div>

    {/* CSS CHO THANH CUỘN (Tùy chọn) */}
    <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `}</style>
  </div>
);

export default About;