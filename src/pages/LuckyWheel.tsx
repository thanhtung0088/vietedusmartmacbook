"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Gauge, Maximize, Minimize, Trophy, 
  Volume2, VolumeX, GraduationCap, Play, ClipboardPaste, Eraser, Save
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LuckyWheel: React.FC = () => {
  const schoolData: Record<string, string[]> = {
    "6.1": ["Nguyễn Thị Bình An", "NGUYỄN THỊ TRÂM ANH", "Phan Lý Ngọc Anh", "Huỳnh Tường Gia Bảo", "Lê Gia Bảo", "Tạ Bùi Gia Bảo", "Trần Phạm Linh Chi", "Nguyễn Chí Công", "Nguyễn Thùy Dương", "Lê Hoàng Đạt", "Phạm Tuấn Đạt", "Phạm Mai Ngọc Giỏi", "Đàm Gia Hân", "Phạm Nguyễn Gia Hân", "Trịnh Nguyễn Gia Hân", "Trần Văn Hậu", "Nguyễn Trung Hoàng", "Đặng Gia Huy", "Lê Nguyễn Quốc Huy", "Lê Phương Huy", "Trần Phan Minh Khuê", "LÊ TRUNG KIÊN", "Khúc Tuấn Kiệt", "Dương Chí Lâm", "Hồ Hoàng Gia Linh", "Nguyễn Hoàng Khánh Ly", "Võ Hồ Nhật Minh", "Bùi Thị Thúy Ngân", "Đoàn Gia Nghi", "Nguyễn Khánh Ngọc", "Võ Trần An Nhiên", "Nguyễn Hoàng Phát", "Nguyễn Hữu Phát", "Lê Văn Phước", "Nguyễn Huỳnh Nhã Phương", "Hoa Văn Sang", "Trần Minh Thư", "Lâm Thị Cẩm Tiên", "Trần Minh Tiến", "Lê Nguyễn Trung Tính", "Danh Thị Ngọc Trân", "Lê Đình Tuyển", "Trần Thị Ánh Tuyết", "Nguyễn Trần Như Ý"],
    "6.2": ["Đặng Trương Quỳnh Anh", "Trương Nguyễn Trâm Anh", "Phạm Hoàng Ân", "Nguyễn Duy Bảo", "Phan Ngọc Bích", "Trần Thị Mỹ Duyên", "Đào Đức Dương", "Nguyễn Thế Đạt", "Nhiệm Thành Đạt", "Phạm Thái Bảo Đăng", "Phạm Thanh Đông", "Vũ Gia Hân", "Huỳnh Quốc Hưng", "Đặng Nguyễn Gia Khang", "Lê Quốc Khang", "Nguyễn Tuấn Khang", "Nguyễn Thị Mỹ Khánh", "Nguyễn Gia Kiệt", "Nguyễn Minh Kiệt", "Phạm Tường Lam", "Nguyễn Trịnh Nhật Lâm", "Nguyễn Thị Xuân Mai", "Lê Cảnh Diễm Mi", "Nguyễn Công Minh", "NGUYỄN GIA MINH", "Nguyễn Ngọc Diễm My", "Nguyễn Ngọc Thảo My", "Nguyễn Ngọc Thảo Nguyên", "Cao Thị Yến Nhi", "Đào Tuấn Phát", "Nguyễn Hoàng Phát", "Võ Hữu Phúc", "Lê Tuấn Tài", "Phạm Nguyễn Mỹ Thiện", "Phùng Quốc Thịnh", "Nguyễn Văn Hoài Thương", "Đỗ Thị Thanh Trúc", "Nguyễn Thanh Tuyền", "Trần Hoàng Phương Uyên", "Lương Nhật Vy", "Trần Nguyễn Khánh Vy", "Vũ Anh Thái Xuân"],
    "6.3": ["Bùi Bảo An", "Dương Tấn An", "Dương Quỳnh Anh", "Phan Thị Minh Anh", "Lê Hồng Ánh", "Nguyễn Thị Ngọc Ánh", "Phạm Hương Giang", "Đặng Hoàng Gia Hân", "Nguyễn Gia Hân", "Nguyễn Minh Khang", "Bùi Quốc Khánh", "Hồ Duy Khoa", "Nguyễn Huỳnh Minh Khôi", "Võ Hoàng Thiên Kim", "Lưu Phạm Diệu Linh", "Đinh Trọng Luân", "Huỳnh Ngọc Trà My", "Võ Tuyết Ngân", "Nguyễn Hồ Trọng Nghĩa", "Trần Trịnh Hồng Ngọc", "Nguyễn Phạm Bình Nguyên", "Đoàn Thảo Nhi", "Dương Hoàng Tố Như", "Lê Đình Phát", "Ngô Lâm Vũ Phong", "Nguyễn Thiên Phúc", "Hồ Minh Quân", "Lê Duy Sang", "Trần Huỳnh Bảo Sơn", "Lê Nguyễn Hoàng Thái", "Nguyễn Văn Chiến Thắng", "Nguyễn Hoàng Vũ Thiên", "Bùi Kim Minh Thư", "Đinh Hà Thy", "Nguyễn Thiện Tính", "Lưu Thảo Bích Trâm", "Nguyễn Hoàng Minh Trí", "Ninh Thiên Trí", "Huỳnh Tuấn Trung", "Đoàn Hồng Cẩm Tú", "Nguyễn Đình Tú", "Nguyễn Minh Vương", "Lê Vy", "Nguyễn Ngọc Như Ý", "Trần Ngọc Như Ý"],
    "6.4": ["Huỳnh Bảo Anh", "Nguyễn Đức Anh", "Trần Bảo Anh", "Trịnh Ngọc Bảo Anh", "Chiêm Nguyễn Gia Bảo", "Nguyễn Gia Bảo", "Nguyễn Ngọc Gia Bảo", "Huỳnh Ngọc Diệp", "Nguyễn Phạm Khánh Duy", "Nguyễn Kiên Giang", "Phạm Thu Hà", "Nguyễn Bảo Hân", "Huỳnh Lưu Minh Hiếu", "Lương Thị Kim Huế", "Huỳnh Quốc Huy", "Thái Hoàng Khang", "Huỳnh Nhật Bảo Khánh", "Nguyễn Hoàng Đăng Khôi", "Huỳnh Anh Kiệt", "NGUYỄN ANH KIỆT", "Đoàn Hồng Long", "TIÊU ĐẠI LỢI", "Lê Thị Ngọc Minh", "Nguyễn Hoàng Nam", "Trần Nguyễn Kim Ngân", "Trần Lê Thị Phương Nghi", "Huỳnh Bảo Ngọc", "Nguyễn Phạm Bích Ngọc", "Trần Huỳnh Bảo Ngọc", "Hồ Nguyễn Ngọc Phụng", "Nguyễn Trường Phước", "Đặng Nguyễn Mai Phương", "Cổ Thụy Minh Quân", "Đỗ Tiến Sĩ", "Nguyễn Ngọc An Thảo", "Phan Thanh Thùy", "Nguyễn Thiên Trà", "Phan Ngọc Thiên Trang", "Phạm Ngọc Quế Trân", "Đỗ Anh Tuấn", "Lê Mộng Tuấn", "Thái Thanh Vân", "Trần Quốc Vinh", "Nguyễn Thị Kiều Yên"],
    "6.5": ["Nguyễn Minh An", "Nguyễn Phúc An", "Trần Huỳnh Anh", "Lê Hà Thiên Ân", "Nguyễn Đinh Hoàng Bách", "Hồ Hoàng Tâm Châu", "Trịnh Minh Châu", "Nguyễn Thành Bảo Duy", "TRẦN QUỐC ĐẠI", "Nguyễn Phạm Hải Đăng", "Nguyễn Huỳnh Gia Hân", "Võ Nhật Huy", "Nguyễn Thái Phúc Khang", "Nguyễn Huỳnh Đăng Khoa", "Nguyễn Hoàng Kim", "Phan Ngọc Phương Linh", "Nguyễn Đinh Bảo Long", "Lê Đức Lộc", "Nguyễn Thị Tuyết Mai", "Trần Thị Diễm My", "Nguyễn Đình Nam", "Đặng Kim Ngân", "Lê Như Ngọc", "Nguyễn Hoàng Khánh Nhi", "Hồ Đỗ Mỹ Như", "Trần Phúc", "Hồ Nhã Phương", "Nguyễn Hoàng Quân", "Phạm Ngô Hoàng Quí", "Vũ Hương Quỳnh", "Phạm Thanh Sang", "Nguyễn Duy Anh Sơn", "Đặng Thị Thanh Tâm", "Nguyễn Thành Thái", "Cao Phước Thịnh", "Nguyễn Thanh Thư", "Trịnh Kim Thư", "Huỳnh Minh Tiến", "Trần Hà Minh Tiến", "Nguyễn Minh Tú", "ĐINH THỊ THANH VÂN", "Lữ Nguyễn Thùy Vân", "Nguyễn Ngọc Ái Vy", "Trịnh Thảo Vy", "Phạm Ngọc Như Ý"],
    "6.6": ["Nguyễn Ngọc Anh", "Võ Ngọc Bảo Anh", "Lý Huỳnh Gia Bảo", "Nguyễn Ngọc Bảo", "Hoàng Ngọc Bích", "Phạm Thị Ngọc Châu", "Nguyễn Bùi Thành Danh", "Triệu Ngô Khánh Duy", "Nguyễn Hải Đăng", "Phan Ngô Thanh Hoa", "Hồ Gia Huy", "Trần Quốc Huy", "Trần Anh Khang", "Trần Nguyễn Hoàng Khánh", "Nguyễn Lập Thủy Linh", "Bùi Nguyễn Hoàng Long", "Lê Việt Long", "Nguyễn Đăng Hoàng Long", "Nguyễn Trúc Mai", "Nguyễn Ngọc Ánh Minh", "Huỳnh Bảo Ngọc", "Đỗ Trọng Nhân", "Trần Thị Hoàng Như", "Võ Ngọc Thảo Như", "Nguyễn Vũ Kim Phát", "Nguyễn Minh Quân", "Hồ Trần Như Quỳnh", "Nguyễn Bá Tài", "Nguyễn Tấn Thành", "Ngô Đức Thiện", "Trần Phước Thiện", "Nguyễn Thị Anh Thư", "Cao Ngọc Cẩm Tiên", "Vũ Thủy Tiên", "Nguyễn Ngọc Trâm", "Nguyễn Minh Trí", "Thái Nguyễn Hoàng Triều", "Nguyễn Minh Tuấn", "Bùi Thị Kim Tuyền", "Đỗ Ngọc Kim Tuyền", "Lường Thị Ánh Tuyết", "Phùng Quốc Việt", "Lê Ngọc Khánh Vy", "Phan Hoàng Phương Vy"],
    "6.7": ["Lê Tạ Trúc Anh", "Lê Thị Quỳnh Anh", "Nguyễn Lê Gia Bảo", "Phạm Hoàng Gia Bảo", "Trần Ngọc Gia Bảo", "Võ Lê Đình Bảo", "Giản Thành Đạt", "Đoàn Võ Gia Hân", "Huỳnh Bảo Gia Hân", "Trịnh Phạm Gia Hân", "Nguyễn Đức Hiếu", "Lê Mai Xuân Hoàng", "Trần Trọng Hoàng", "Lê Gia Huy", "Nguyễn Thế Hưng", "Ung Nho Đăng Khoa", "Nguyễn Trần Đăng Khôi", "Nguyễn Viết Bảo Khôi", "Phan Anh Kiệt", "Lê Trần Ngọc Linh", "Đặng Trần Trung Lương", "Nguyễn Hồng Ngọc", "Nguyễn Kim Bảo Ngọc", "Nguyễn Hoàng Nguyên", "Cao Lê An Nhiên", "Trần Nhật Phát", "Huỳnh Gia Phú", "Nguyễn Gia Phúc", "Phạm Hữu Phúc", "Võ Hoàng Thiên Phúc", "Lê Thị Thu Thanh", "Nguyễn Ngọc Thanh", "Đỗ Hương Thảo", "Nguyễn Văn Thắng", "Trần Hoàng Hoài Thương", "Bùi Nguyễn Hương Trà", "Nguyễn Võ Bảo Trang", "Nguyễn ngọc Nhã Trân", "Phan Minh Trọng", "Nguyễn Ngọc Thanh Trúc", "Lê Hữu Vinh", "Cao Thị Kiều Vy", "Nguyễn Ngọc Như Ý", "Lê Phạm Hoàng Yến"],
    "6.8": ["Hồ Thị Phước An", "Vũ Trần An", "Lê Kim Anh", "Nguyễn Thị Kiều Anh", "Nguyễn Ngọc Gia Bảo", "Nguyễn Ngọc Chung", "Lê Nguyễn Văn Dương", "Trần Thùy Dương", "Lê Minh Đạt", "Đồng Gia Hào", "Đỗ Gia Hân", "Nguyễn Thị Ngọc Hân", "Phan Nguyễn Bảo Hân", "Nguyễn Trần Ngọc Hoàng", "Đặng Quốc Huy", "Hoàng Phạm Minh Huyền", "Võ Trương Minh Hưng", "Y Thiên Kỳ HWING", "Đoàn Minh Khang", "Đặng Đăng Khôi", "NGUYỄN MINH KHÔI", "Đoàn Thị Như Lan", "Trương Ngọc Gia Linh", "Hoàng Văn Lời", "Trương Thị Hà My", "Nguyễn Mai My Na", "Lê Ngô Kim Ngân", "Trần Dương Thảo Ngân", "Lê Nguyễn Thảo Nguyên", "Lê Minh Nhựt", "Trần Phan Tuấn Phát", "Dũ Minh Phong", "Đỗ Thành Phong", "Thái Nguyễn Hoàng Phúc", "Nguyễn Minh Quang", "Hứa Hoàng Quân", "Đỗ Thị Phương Thảo", "Nguyễn Thị Thanh Thảo", "Phạm Thị Kim Thảo", "Trần Đình Tiến", "Đinh Ngọc Trâm", "Phan Bảo Trâm", "Võ Tường Vy", "Nguyễn Ngọc Tường Vy", "Nguyễn Ngọc Như Ý", "Phan Bảo Yến"],
    "6.9": ["Hồ Thị Bảo An", "Lê Hoài An", "Nguyễn Lê Tuấn Anh", "Nguyễn Ngọc Tuấn Anh", "Nguyễn Thị Lan Anh", "Nguyễn Văn Quốc Anh", "Phan Huỳnh Anh", "Nguyễn Hữu Gia Bảo", "Seo Gia Bảo", "Phan Nguyễn Mạnh Cường", "Võ Linh Đan", "Đỗ Tất Đạt", "Nguyễn Xuân Hải Đăng", "Hoàng Nguyễn Nhật Huy", "Huỳnh Quốc Khánh", "Dương Chí Kiên", "Hoàng Thùy Linh", "Lưu Hoàng Long", "Trần Thị Tuyết Mai", "Võ Hải Nam", "Nguyễn Trọng Nghĩa", "Nguyễn Phan Bảo Ngọc", "Nguyễn Đoàn Phương Nguyên", "Nguyễn Minh Nguyên", "Nguyễn Gia Nhân", "Võ Trần Tuyết Nhi", "Võ Uyên Nhi", "Lê Thị Nhung", "Lê Thị Quỳnh Như", "Nguyễn Trần Hải Phong", "Nguyễn Lê Anh Quân", "TRỊNH NGỌC QUYÊN", "Hồ Đặng Như Quỳnh", "Mai Thị Diễm Quỳnh", "Nguyễn Quốc Sang", "Võ Hoàng Sang", "Mai Thị Kim Thư", "Đồng Thị Bích Trâm", "Lương Bích Trâm", "Mai Bảo Trâm", "Nguyễn Ngọc Trí", "Nguyễn Cao Anh Tú", "Nguyễn Thị Ngọc Trinh", "Trần Quốc Việt", "Cao Thị Ngọc Yến"],
    "6.10": ["Hồ Trịnh Nhật Anh", "PHAN QUỲNH ANH", "Trần Bảo Anh", "Nguyễn Đức Bảo", "Trần Hoàng Gia Bảo", "Doãn Ngọc Chi", "Hoàng Mai Chi", "Vũ Ngọc Mai Chi", "Nguyễn Bá Dũng", "Lê Thế Dương", "NGUYỄN THÀNH ĐẠT", "Nguyễn Tiến Đạt", "Phạm Hải Đăng", "Nguyễn Nhã Hân", "Phạm Tiến Hùng", "Lương Nhật Hưng", "Phạm Ngọc Nhã Khanh", "Nguyễn Gia Lâm", "Nguyễn Duy Long", "Kiều Đức Mạnh", "Trương Tuệ Mẫn", "Đỗ Hải My", "Đặng Hoàng Bảo Ngọc", "Hồ Sỹ Khôi Nguyên", "Lê Thị Yến Nhi", "Nguyễn Yến Nhi", "Lê Thảo Như", "Nguyễn Hoàng Minh Phát", "Nguyễn Tấn Phát", "Đỗ Hoàng Phúc", "Lương Phạm Bảo Phúc", "Nguyễn Hoàng Minh Phúc", "Đinh Thế Sang", "Vũ Đức Thịnh", "Dương Thị Thu Thùy", "Trần Thị Thu Thủy", "Trần Nhật Tiến", "Trần Phạm Huyền Trang", "Vũ Lê Kiều Trang", "Nguyễn Ngọc Bảo Trâm", "Bùi Thanh Trúc", "Sử Hồng Vân", "Vũ Thị Bích Uyên", "Cao Thị Ngọc Yến"],
    "9.1": ["Trần Gia Bảo", "Lương Kiến Bình", "Võ Ngọc Minh Châu", "Lê Trần Yến Chi", "Trần Diệp Chi", "Nguyễn Trần Kim Dung", "Nguyễn Nhựt Duy", "Trần Quang Duy", "Phan Khải Định", "Nguyễn Trọng Minh Đức", "Trần Thị Ngọc Giàu", "Võ Thị Ánh Hồng", "Vũ Quang Huy", "Nguyễn Tăng KaKa", "Võ Đăng Khoa", "Huỳnh Tuấn Kiệt", "Nguyễn Lê Quốc Kiệt", "Lê Nghĩa Lâm", "Cao Ánh Linh", "Nghiêm Hoàng Long", "Phạm Thị Kim Ngân", "Nguyễn Khánh Ngọc", "Võ Lê Thảo Nguyên", "Hồ Hoàng Gia Linh", "Nguyễn Thị Hồng Nhung", "Huỳnh Nhật Phát", "Bùi Nam Phong", "Võ Tuấn Phong", "Trần Phước", "Nguyễn Ngọc Mai Phương", "Chiêu Thục Quyên", "Nguyễn Phước Thành Tài", "Hồ Nguyễn Chí Thiện", "Nguyễn Công Trứ", "Đinh Văn Tuấn", "Nguyễn Thị Bích Tuyền", "Phan Bích Tuyền", "Đào Tuấn Vĩ", "Nguyễn Thùy Vy", "Lưu Bảo Yến"],
    "9.2": ["Huỳnh Trâm Anh", "Phan Huỳnh Anh", "Trần Hoàng Anh", "Trần Thị Kiều Diễm", "Nguyễn Hải Đăng", "Nguyễn Minh Đức", "Nguyễn Thế Đức", "Trần Minh Đức", "Trần Ngân Hằng", "Bùi Ngọc Hân", "Phạm Gia Hân", "Trần Gia Huy", "Đặng Lan Hương", "Cao Hoàng Anh Khôi", "Lê Anh Kiệt", "Nguyễn Tiến Minh", "Dương Thanh Nam", "Nguyễn Thị Phương Nga", "Trần Lê Bảo Ngọc", "Bùi Dương Chí Nguyện", "Nguyễn Hà Tâm Như", "Phạm Bình Phàm", "Đặng Hoàng Bảo Ngọc", "Nguyễn Đình Phú", "Bùi Hoàng Phúc", "Đặng Kim Phượng", "Trần Minh Tâm", "Tạ Nguyễn Danh Thái", "Sơn Hoàng Thành", "Phan Thị Thu Thảo", "Nguyễn Thị Hồng Thắm", "Nguyễn Ngọc Trúc Thy", "Lê Ngọc Tiên", "Huỳnh Ngọc Trâm", "Nguyễn Thị Bảo Trân", "Nguyễn Trung Trị", "Trần Nguyễn Minh Triết", "Nguyễn Tuấn Trung", "Lương Huỳnh Phước Tú", "Lâm Phạm Thái Tuấn"],
    "9.3": ["Nguyễn Trường An", "Lê Nguyễn Thái Bảo", "Trần Phương Dung", "Nguyễn Thị Thu Hà", "Nguyễn Trần Thúy Hà", "Nguyễn Minh Đức", "Nguyễn Thị Ngọc Hân", "Trần Huỳnh Gia Hân", "Nguyễn Phùng Gia Huy", "Đặng Phúc Khang", "Nguyễn Tông Gia Khang", "Lê Thị Vĩnh Khánh", "Nguyễn Gia Khánh", "Lê Nguyễn Ngọc Lan", "Bông Nguyễn Phi Long", "Trần Đức Long", "Nguyễn Thị Trúc Mai", "Dương Thị Thùy Nguyên", "Lê Thảo Phúc Nguyên", "Huỳnh Thị Quỳnh Như", "Châu Yến Nhi", "Lê Thị Nhi", "Trần Nguyễn Kim Ngọc", "Bùi Hoàng Phúc", "Lê Hoàng Phúc", "Trần Hoàng Phúc", "Lương Hoàng Phi Phụng", "Nguyễn Bình Phương", "Phạm Trúc Phương", "Phạm Hoàng Quân", "Lê Phạm Tuấn Tài", "Phạm Lê Mỹ Tâm", "Trần Thị Thanh Thảo", "Nguyễn Phú Thịnh", "Nguyễn Thị Bảo Trân", "Phan Minh Trí", "Trần Bảo Trí", "Đào Nguyễn Xuân Trúc", "Nguyễn Văn Tuấn", "Trần Anh Tuấn"],
    "9.4": ["Bùi Thúy An", "Trần Khánh An", "Hoàng Thị Lan Anh", "Phạm Thị Lan Anh", "Đặng Thị Ngọc Ánh", "Huỳnh Nhựt Tường Hải", "Trần Kim Mỹ Duyên", "Lê Trường Giang", "Trần Thanh Hảo", "Nguyễn Đức Huy", "Nguyễn Lê Tấn Hưng", "Lý Trần Đăng Khôi", "Nguyễn Khánh Linh", "Trần Phước Lợi", "Nguyễn Ngọc Khánh Ngân", "Đỗ Quang Nghị", "Nguyễn Khắc Nghiêm", "Nguyễn Ngọc Bảo Nhung", "Nguyễn Thị Tuyết Nhung", "Huỳnh Ngọc Loan", "Nguyễn Châu Ngọc Như", "Lê Quốc Nhựt", "Hồ Trường Phú", "Đoàn Thanh Phú", "Trần Thanh Phú", "Nguyễn Văn Phước", "Đoàn Võ Mai Phương", "Nguyễn Minh Quân", "Trương Thị Thảo Quyên", "Bùi Lưu Thái Sơn", "Lê Tấn Tài", "Nguyễn Tấn Thành", "Lê Hà Xuân Thiên", "Nguyễn Ngọc Thiên", "Nguyễn Tri Thức", "Đặng Quế Trâm", "Thái Bích Trâm", "Lương Văn Trí", "Nguyễn Thế Vinh", "Trang Trần Khánh Vy"],
    "9.5": ["Đặng Hải Anh", "Đào Gia Bảo", "Nguyễn Gia Bảo", "Nguyễn Ngọc Duyên", "Nguyễn Ánh Dương", "Nguyễn Thị Mỹ Duyên", "Nguyễn Hoàng Giang", "Nguyễn Thị Thanh Hà", "Hoàng Nguyễn Ngọc Hải", "Ong Vĩ Hào", "Trần Xuân Hiếu", "Trương Ngọc Hoàng", "Đỗ Trần Nguyễn Huy", "Ngô Hồ Đình Huy", "Hồ Khánh Hưng", "Dương Nguyễn Gia Hưng", "Nguyễn Đình Vĩnh Khang", "Trần Lê Tuấn Kiệt", "Nguyễn Lê Mai Lan", "Đinh Hải Nguyên", "Lê Nguyễn Nhật Long", "Nguyễn Thành Lộc", "Vũ Nguyễn Linh Nhi", "Nguyễn Thị Như Mỹ", "Bùi Phan Khánh Ngọc", "Trần Bình Bảo Như", "Trịnh Công Phát", "Trần Thanh Phong", "Nguyễn Trọng Phúc", "Đồng Thị Diễm Phương", "Nguyễn Minh Quân", "Nguyễn Thành Tài", "Đỗ Thúc Thanh Tân", "Nguyễn Kim Thoa", "Lê Thị Quỳnh Trang", "Bùi Thị Thủy Tiên", "Nguyễn Thị Bảo Trâm", "Nguyễn Ngọc Bảo Trân", "Lâm Thị Thanh Trúc", "Lê Thị Mộng Tuyền"],
    "9.6": ["Phạm Trường An", "Tô Quốc An", "Dương Đức Anh", "Trần Ngọc Gia Bảo", "Trần Văn Duy", "Trần Lâm Thùy Dương", "Phan Thị Hương Giang", "Lê Phạm Minh Hằng", "Trần Trọng Hoàng", "Dương Hoàng Minh Huy", "Đặng Phạm Gia Huy", "Đoàn Phú Huy", "Nguyễn Đức Huy", "Hà Nguyễn Thanh Hưng", "Nguyễn Tuấn Khải", "Phạm Gia Lân", "Đỗ Hoàng Mai Linh", "Phạm Ngọc Ái My", "Nguyễn Hứa Bảo Ngân", "Trương Huỳnh Gia Nghi", "Võ Nguyễn Phương Nhã", "Trần Thanh Nhàn", "Cao Thiên Phong", "Hồ Đông Nhi", "Nguyễn Tiến Vũ Phong", "Nguyễn Đặng Phong Phú", "Huỳnh Tấn Phúc", "Đặng Thu Phương", "Hoàng Nguyễn Ngọc Thảo", "Nguyễn Ngọc Thi", "Nguyễn Lê Quang Thịnh", "Mai Hồng Anh Thư", "Trần Thị Kiều Tiên", "Lê Đức Toàn", "Dương Thanh Trúc", "Nguyễn Thị Thùy Trang", "Phạm Huỳnh Bảo Trân", "Mai Xuân Trường", "Huỳnh Thanh Vân", "Trần Thị Bích Vân"],
    "9.7": ["Đỗ Nguyễn Bảo Anh", "Hoàng Vũ Đức Anh", "Nguyễn Minh Anh", "Trần Thị Hồng Ánh", "Trần Hoàng Bách", "Đào Anh Đức", "Nguyễn Hoàng Duy", "Trần Minh Đạt", "Trịnh Thành Đạt", "Nguyễn Văn Đức", "Trần Hương Giang", "Phạm Thanh Hà", "Đỗ Công Hiếu", "Đinh Hoàng Gia Huy", "Trần Thị Minh Hoa", "Lượng Tuấn Kiệt", "Nguyễn Duy Minh", "Đoàn Phạm Diễm My", "Huỳnh Lê Kim Ngân", "Lê Đặng Phương Linh", "Cao Trần Khánh Ngọc", "Lương Nguyễn Bảo Ngọc", "Vũ Lê Trà My", "Trương Thành Phát", "Hồ Duy Phong", "Trần Văn Phong", "Đỗ Huỳnh Trúc Phương", "Nguyễn Thanh Quyên", "Nguyễn Hoàng Minh Tâm", "Huỳnh Nguyên Thảo", "Lê Thị Hoài Thương", "Nguyễn Thị An Thy", "Nguyễn Văn Tiến", "Trần Lê Quỳnh Trang", "Nguyễn Ngọc Kim Thư", "Thạch Đinh Thanh Trúc", "Nguyễn Kiết Tường", "Trần Huy Vủ", "Bùi Thị Khánh Vy", "Lê Thúy Vy"],
    "9.8": ["Nguyễn Gia Bảo", "Đặng Thị Ngọc Bích", "Đặng Bảo Duy", "Tô Đông Dương", "Cao Thành Đạt", "Nguyễn Chí Dũng", "Võ Hoàng Gia", "Lê Thị Ngọc Giàu", "Lê Trung Hiếu", "Trần Nguyễn Trung Hiếu", "Phạm Ngọc Ánh Hồng", "Trương Cẩm Hồng", "Bùi Gia Huy", "Nguyễn Khánh Huyền", "Lê Chí Khang", "Quách Tuấn Khang", "Thạch Trung Kiên", "Huỳnh Thị Gia Kỳ", "Nguyễn Hoàng Hải My", "Nguyễn Khánh Linh", "Phan Lê Thùy Linh", "Trương Hoàng Linh", "Park woo Long", "Đinh Nguyễn Nam", "Nguyễn Hoàng Ngọc Ngân", "Nguyễn Lê Phát", "Nguyễn Viết Bảo Nghi", "Lê Quang Trọng Nghĩa", "LÝ NGUYỄN DIỄM NGỌC", "Huỳnh Anh Thư", "Trần Văn Anh Tài", "Đỗ Văn Tâm", "Lê Đức Toàn", "Nguyễn Lê Ngọc Trân", "Nguyễn Ngọc Thanh Trúc", "Hoàng Đức Việt", "Nguyễn Thị Thúy Vy", "Hồ Như Ý", "Nguyễn Lê Thúy Vy", "Thái Như Ý"],
    "9.9": ["Nguyễn Tuấn Anh", "Phạm Nguyễn Hoàng Anh", "Trần Nguyễn Tuyết Anh", "Lê Nguyễn Hoài Ân", "Huỳnh Nguyên Bảo", "Nguyễn Văn Bình", "Đỗ Tất Tấn Dũng", "Võ Trần Đức Duy", "Lê Thùy Dương", "Trần Tấn Đạt", "Phạm Đoàn Hoa Đăng", "Vũ Anh Thái Hà", "Hồ Ngọc Gia Hân", "Trần Lê Trung Hiếu", "Nguyễn Ngọc Gia Huy", "Trần Phan Khánh Huy", "Nguyễn Thị Thu Hương", "Đặng Tấn Quốc Kiệt", "Nguyễn Vũ Kim Ngân", "Trần Lê Trung Nghĩa", "Phạm Khánh Ngọc", "Trần Bảo Ngọc", "Nguyễn Đỗ Bảo Nhi", "Nguyễn Thị Nhi", "Danh Phường", "Nguyễn Duy Thái", "Lê Minh Thiện", "NGUYỄN NGỌC MINH THƯ", "Võ Ngọc Anh Thư", "Bùi Bảo Trân", "Trương Trần Tuấn Trung", "Nguyễn Thị Ánh Tuyết", "Lâm Trần Ngọc Uyên", "PhanThị Mỹ Uyên", "Cao Đỗ Phương Vy", "Lê Khánh Tùng", "Trần Hoài Thảo Vy", "Đinh Thị Thúy Vân", "Trần Hà Minh Vy", "Nguyễn Ngọc Yến Vy", "Nguyễn Cao Hải Yến"]
  };

  const [students, setStudents] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [spinDuration, setSpinDuration] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Sửa đường dẫn âm thanh đúng như bản cũ
  const spinAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Sửa: Bỏ dấu gạch chéo ở đầu đường dẫn
    spinAudio.current = new Audio('sounds/nhac-xo-so.mp3'); 
    winAudio.current = new Audio('sounds/vo-tay.mp3');

    if (spinAudio.current) {
        spinAudio.current.preload = "auto";
        spinAudio.current.loop = true;
    }
    if (winAudio.current) {
        winAudio.current.preload = "auto";
    }

    const saved = localStorage.getItem('vietedu_student_list');
    if (saved) {
      const list = JSON.parse(saved);
      setStudents(list);
      setInputText(list.join('\n'));
    }

    return () => {
      spinAudio.current?.pause();
      winAudio.current?.pause();
    };
  }, []);

  useEffect(() => { drawWheel(); }, [students, rotation]);

  const unlockAudio = () => {
    if (spinAudio.current) {
      spinAudio.current.play().then(() => spinAudio.current?.pause()).catch(() => {});
    }
    if (winAudio.current) {
      winAudio.current.play().then(() => winAudio.current?.pause()).catch(() => {});
    }
  };

  const handleSelectClass = (clsName: string) => {
    unlockAudio();
    const list = schoolData[clsName] || [];
    setStudents(list);
    setSelectedClass(clsName);
    setInputText(list.join('\n'));
    setWinner(null);
    localStorage.setItem('vietedu_student_list', JSON.stringify(list));
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || students.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const angleStep = (Math.PI * 2) / students.length;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotation * Math.PI) / 180);

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

    students.forEach((name, i) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.rotate(i * angleStep + angleStep / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      let fontSize = students.length > 30 ? 9 : 12;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillText(name.toUpperCase(), radius - 25, 5);
      ctx.restore();
    });
    ctx.restore();

    ctx.beginPath();
    ctx.arc(center, center, 35, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#1E40AF';
    ctx.textAlign = "center";
    ctx.font = "bold 9px Arial";
    ctx.fillText("VIETEDU", center, center + 4);
  };

  const spinWheel = () => {
    if (spinning || students.length < 2) return;
    setSpinning(true);
    setWinner(null);

    if (!isMuted && spinAudio.current) {
      spinAudio.current.currentTime = 0;
      spinAudio.current.play().catch(() => {});
    }
    
    const totalSpin = 360 * 10 + Math.random() * 360;
    const startTime = performance.now();
    const duration = spinDuration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setRotation(totalSpin * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        if (spinAudio.current) spinAudio.current.pause();

        if (!isMuted && winAudio.current) {
          winAudio.current.currentTime = 0;
          winAudio.current.play().catch(() => {});
        }

        const actualRotation = (totalSpin * easeOut) % 360;
        const winningIndex = Math.floor((360 - actualRotation) / (360 / students.length)) % students.length;
        setWinner(students[winningIndex]);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div ref={containerRef} className={`min-h-screen ${isFullscreen ? 'bg-slate-900' : 'bg-slate-50'} p-4 transition-colors`}>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
        
        {!isFullscreen && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-blue-600" />
                    <h2 className="font-black text-sm uppercase tracking-wider text-slate-700">Chọn lớp của Thầy/Cô</h2>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-xl transition-all ${isMuted ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                  >
                      {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                  </button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(schoolData).map(cls => (
                <button
                  key={cls}
                  onClick={() => handleSelectClass(cls)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${selectedClass === cls ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  Lớp {cls}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 ${isFullscreen ? '' : 'lg:grid-cols-12'} gap-6`}>
          {!isFullscreen && (
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-full">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Users size={16}/> Danh sách lớp {selectedClass}</span>
                  <div className="flex gap-1">
                     <button onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                              setInputText(text);
                              const list = text.split('\n').map(n => n.trim()).filter(n => n !== "");
                              setStudents(list);
                              localStorage.setItem('vietedu_student_list', JSON.stringify(list));
                          }
                        } catch (err) { alert("Vui lòng cho phép quyền truy cập Clipboard!"); }
                     }} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                        <ClipboardPaste size={12}/> Dán nhanh
                     </button>
                     <button onClick={() => { 
                       if(confirm("Xóa toàn bộ danh sách?")) {
                          setInputText(""); setStudents([]); setWinner(null);
                          localStorage.removeItem('vietedu_student_list');
                       }
                     }} className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                        <Eraser size={12}/> Xóa
                     </button>
                  </div>
                </div>
                <textarea 
                  className="w-full h-[300px] p-4 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium text-slate-600 resize-none leading-relaxed"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    const list = e.target.value.split('\n').map(n => n.trim()).filter(n => n !== "");
                    setStudents(list);
                  }}
                  placeholder="Nhập tên học sinh (mỗi tên một dòng)..."
                />
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                    <span className="flex items-center gap-1"><Gauge size={14}/> Tốc độ quay</span>
                    <span>{spinDuration} giây</span>
                  </div>
                  <input type="range" min="3" max="20" value={spinDuration} onChange={(e) => setSpinDuration(Number(e.target.value))} className="w-full accent-blue-600 h-1.5" />
                </div>
                <button onClick={() => {
                   const list = inputText.split('\n').map(n => n.trim()).filter(n => n !== "");
                   localStorage.setItem('vietedu_student_list', JSON.stringify(list));
                   alert("Đã lưu danh sách!");
                }} className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                  <Save size={16}/> Lưu danh sách này
                </button>
              </div>
            </div>
          )}

          <div className={`${isFullscreen ? 'w-full h-screen' : 'lg:col-span-8 min-h-[550px]'} bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative`}>
            <button 
              onClick={() => {
                if (!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); }
                else { if (document.exitFullscreen) document.exitFullscreen(); setIsFullscreen(false); }
              }} 
              className="absolute top-6 right-6 p-3 bg-slate-100 text-slate-500 rounded-full z-50 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              {isFullscreen ? <Minimize size={24}/> : <Maximize size={24}/>}
            </button>

            <div className={`relative ${isFullscreen ? 'scale-125' : 'scale-100'} transition-transform duration-500`}>
              <div className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-20">
                <div className="w-12 h-10 bg-rose-600 shadow-xl" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}></div>
              </div>
              <canvas ref={canvasRef} width={480} height={480} className="max-w-full h-auto drop-shadow-2xl" />
            </div>

            {winner && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-in zoom-in duration-300">
                <div className="bg-yellow-400 text-blue-900 px-10 py-6 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.6)] border-4 border-white text-center">
                  <Trophy size={32} className="mx-auto mb-2" />
                  <h2 className="text-3xl font-black uppercase italic">{winner}</h2>
                </div>
              </div>
            )}

            <button 
              onClick={spinWheel} 
              disabled={spinning || students.length < 2}
              className={`mt-10 px-20 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3 ${spinning ? 'bg-slate-100 text-slate-300' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
            >
              {spinning ? 'Đang quay...' : <><Play fill="currentColor" size={18}/> Quay thưởng</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheel;