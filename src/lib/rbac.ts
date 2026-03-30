// rbac.ts
export type Role = 
  | 'hieu-truong' 
  | 'hieu-pho' 
  | 'to-truong-cm' 
  | 'giao-vien' 
  | 'cong-nhan-vien' 
  | 'admin';

export interface MenuItemConfig {
  id: string;
  title: string;
  icon: string;          // Tên icon từ lucide-react
  route: string;
  roles: Role[];         // Vai trò nào được xem menu này
}

export interface QuickActionConfig {
  id: string;
  title: string;
  icon: string;
  color: string;         // Màu nền nút (ví dụ: blue, red, green...)
  route: string;
  roles: Role[];         // Vai trò nào thấy thẻ nhỏ này trên Dashboard
}

export interface MenuConfigFile {
  version: string;
  app: string;
  menus: MenuItemConfig[];
  quickActions: QuickActionConfig[];  // Thêm phần thẻ nhỏ trên Dashboard
}

// Tải cấu hình menu từ file JSON (hoặc hardcode nếu không dùng file)
export const loadMenuConfig = async (): Promise<MenuConfigFile> => {
  try {
    const res = await fetch('/menu.config.json');
    if (!res.ok) throw new Error('Không tải được cấu hình menu');
    return res.json();
  } catch (err) {
    console.error('Lỗi tải menu.config.json:', err);
    // Fallback cấu hình hardcode nếu file không tồn tại
    return {
      version: '1.0',
      app: 'VIETEDUSMARTPRO',
      menus: [
        { id: 'trang-chu', title: 'Trang chủ', icon: 'Home', route: '/', roles: ['hieu-truong', 'hieu-pho', 'to-truong-cm', 'giao-vien', 'cong-nhan-vien', 'admin'] },
        { id: 'ho-so-chu-nhiem', title: 'Hồ sơ chủ nhiệm', icon: 'Users', route: '/ho-so-chu-nhiem', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'so-diem-thong-minh', title: 'Sổ điểm thông minh', icon: 'BookOpen', route: '/so-diem-thong-minh', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'soan-bai-ai', title: 'Soạn bài AI', icon: 'Sparkles', route: '/soan-bai-ai', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'to-truong-chuyen-mon', title: 'Tổ trưởng chuyên môn', icon: 'Award', route: '/to-truong-chuyen-mon', roles: ['to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'hoc-lieu-mo', title: 'Học liệu mở', icon: 'Book', route: '/hoc-lieu-mo', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'vong-quay-may-man', title: 'Vòng quay may mắn', icon: 'Dices', route: '/vong-quay-may-man', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'zalo-noi-bo', title: 'Zalo nội bộ', icon: 'MessageCircle', route: '/zalo-noi-bo', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'cong-nhan-vien', 'admin'] },
        { id: 'rubrics', title: 'Rubrics', icon: 'ListChecks', route: '/rubrics', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'video-bai-giang', title: 'Video bài giảng', icon: 'Video', route: '/video-bai-giang', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'gioi-thieu', title: 'Giới thiệu ứng dụng', icon: 'Info', route: '/gioi-thieu', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'cong-nhan-vien', 'admin'] },
        { id: 'thoat', title: 'Thoát', icon: 'LogOut', route: '/thoat', roles: ['hieu-truong', 'hieu-pho', 'to-truong-cm', 'giao-vien', 'cong-nhan-vien', 'admin'] },
      ],
      quickActions: [
        { id: 'soan-bai-ai', title: 'SOẠN BÀI AI', icon: 'Sparkles', color: 'blue', route: '/soan-bai-ai', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'video', title: 'VIDEO', icon: 'Video', color: 'red', route: '/video-bai-giang', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'hoc-lieu', title: 'HỌC LIỆU', icon: 'Book', color: 'green', route: '/hoc-lieu-mo', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'vong-quay', title: 'VÒNG QUAY', icon: 'Dices', color: 'purple', route: '/vong-quay-may-man', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'so-diem', title: 'SỔ ĐIỂM', icon: 'BookOpen', color: 'orange', route: '/so-diem-thong-minh', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'admin'] },
        { id: 'huong-dan', title: 'HƯỚNG DẪN', icon: 'HelpCircle', color: 'gray', route: '/huong-dan', roles: ['giao-vien', 'to-truong-cm', 'hieu-pho', 'hieu-truong', 'cong-nhan-vien', 'admin'] },
      ],
    };
  }
};

// Lọc menu theo vai trò
export const filterMenusByRole = (menus: MenuItemConfig[], role: Role): MenuItemConfig[] => {
  return menus.filter((m) => m.roles.includes(role));
};

// Lọc thẻ nhỏ (quick actions) trên Dashboard theo vai trò
export const filterQuickActionsByRole = (actions: QuickActionConfig[], role: Role): QuickActionConfig[] => {
  return actions.filter((a) => a.roles.includes(role));
};