"use client";

import React from 'react';
import { 
  Library, ExternalLink, School, Globe, BookOpen, 
  Database, Search, GraduationCap, Video, Cpu, 
  Layout, Newspaper, Languages, HeartHandshake, MonitorPlay, Network,
  FileText, Globe2, Link, BookCheck
} from 'lucide-react';

const HocLieuMo = () => {
  const resources = [
    { name: "Bộ Giáo dục & Đào tạo", url: "https://moet.gov.vn", desc: "Cổng thông tin chính thức của Bộ GD&ĐT Việt Nam.", icon: <School size={20} />, color: "bg-blue-600" },
    { name: "Kho Học Liệu Số Quốc Gia", url: "https://igiaoduc.vn", desc: "Hệ thống học liệu số dùng chung cho cả nước.", icon: <Database size={20} />, color: "bg-emerald-600" },
    { name: "Thư viện ViOLET", url: "https://violet.vn", desc: "Cộng đồng chia sẻ bài giảng điện tử lớn nhất.", icon: <Library size={20} />, color: "bg-orange-600" },
    { name: "Hành Trang Số", url: "https://hanhtrangso.nxbgd.vn", desc: "Nền tảng sách giáo khoa điện tử của NXB Giáo dục.", icon: <BookOpen size={20} />, color: "bg-rose-600" },
    { name: "Báo Giáo dục & Thời đại", url: "https://giaoducthoidai.vn", desc: "Cơ quan ngôn luận của Bộ Giáo dục và Đào tạo.", icon: <Newspaper size={20} />, color: "bg-blue-800" },
    { name: "Tạp chí Giáo dục VN", url: "https://giaoduc.net.vn", desc: "Tin tức, phản biện và góc nhìn chuyên sâu về giáo dục.", icon: <FileText size={20} />, color: "bg-red-700" },
    { name: "Học trực tuyến Hoc24h", url: "https://hoc24h.vn", desc: "Nền tảng học và ôn thi trực tuyến phổ biến.", icon: <Globe2 size={20} />, color: "bg-teal-600" },
    { name: "Lớp học kết nối", url: "https://lophocketnoi.edu.vn", desc: "Môi trường học tập trực tuyến dành cho phổ thông.", icon: <Link size={20} />, color: "bg-indigo-600" },
    { name: "Kênh bài giảng VTV7", url: "https://vtv.vn/truyen-hinh-truc-tuyen/vtv7.htm", desc: "Kênh truyền hình giáo dục quốc gia trực quan.", icon: <MonitorPlay size={20} />, color: "bg-red-500" },
    { name: "Mạng giáo dục vnEdu", url: "https://vnedu.vn", desc: "Hệ sinh thái mạng giáo dục hàng đầu Việt Nam.", icon: <Network size={20} />, color: "bg-blue-500" },
    { name: "Khan Academy", url: "https://vi.khanacademy.org", desc: "Nền tảng học tập miễn phí đẳng cấp quốc tế.", icon: <GraduationCap size={20} />, color: "bg-green-600" },
    { name: "Coursera", url: "https://www.coursera.org", desc: "Khóa học trực tuyến từ các đại học hàng đầu.", icon: <Cpu size={20} />, color: "bg-sky-700" },
    { name: "TED-Ed", url: "https://ed.ted.com", desc: "Video bài giảng hoạt hình sáng tạo.", icon: <Video size={20} />, color: "bg-red-600" },
    { name: "Google Scholar", url: "https://scholar.google.com", desc: "Công cụ tìm kiếm tài liệu học thuật chuyên sâu.", icon: <Search size={20} />, color: "bg-indigo-500" },
    { name: "UNESCO Education", url: "https://www.unesco.org/en/education", desc: "Tổ chức Giáo dục, Khoa học và Văn hóa LHQ.", icon: <Globe size={20} />, color: "bg-cyan-600" },
    { name: "National Geographic", url: "https://www.nationalgeographic.org/education", desc: "Học liệu về địa lý, khoa học và thiên nhiên.", icon: <Layout size={20} />, color: "bg-yellow-600" },
    { name: "Duolingo", url: "https://www.duolingo.com", desc: "Nền tảng học ngoại ngữ phổ biến nhất.", icon: <Languages size={20} />, color: "bg-lime-500" },
    { name: "Edutopia", url: "https://www.edutopia.org", desc: "Chia sẻ phương pháp giảng dạy đổi mới.", icon: <HeartHandshake size={20} />, color: "bg-orange-500" },
    { name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", desc: "Học tiếng Anh chuẩn từ đài truyền hình Anh.", icon: <Newspaper size={20} />, color: "bg-stone-800" },
    { name: "PhET Simulations", url: "https://phet.colorado.edu", desc: "Mô phỏng tương tác khoa học và toán học.", icon: <Cpu size={20} />, color: "bg-blue-400" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-700">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner shrink-0">
            <Library size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Học liệu mở chuyên sâu</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">Kết nối tri thức thế giới cùng Thầy/Cô</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {resources.map((item, index) => (
          <a 
            key={index} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
          >
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
              {item.icon}
            </div>
            <h3 className="text-[12px] font-black text-slate-800 uppercase mb-2 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{item.name}</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4 flex-1 italic line-clamp-2">
              {item.desc}
            </p>
            <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Truy cập</span>
              <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default HocLieuMo;