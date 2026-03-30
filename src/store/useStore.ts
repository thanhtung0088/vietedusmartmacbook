import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Định nghĩa cấu trúc dữ liệu lưu trữ
interface AppState {
  todos: string;
  pdfUrl: string | null;
  // Kho lưu dữ liệu School Management (Quản trị trường)
  schoolStaffs: string[][]; 
  
  // Các hàm cập nhật dữ liệu
  setTodos: (text: string) => void;
  setPdfUrl: (url: string | null) => void;
  setSchoolStaffs: (data: string[][]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Giá trị khởi tạo ban đầu
      todos: "",
      pdfUrl: null,
      schoolStaffs: [], // Khởi tạo danh sách nhân sự trống
      
      // Hàm cập nhật ghi chú
      setTodos: (todos) => set({ todos }),
      
      // Hàm cập nhật đường dẫn PDF
      setPdfUrl: (pdfUrl) => set({ pdfUrl }),
      
      // Hàm cập nhật danh sách nhân sự từ Excel
      setSchoolStaffs: (schoolStaffs) => set({ schoolStaffs }),
    }),
    {
      // Tên định danh lưu trữ trong LocalStorage
      name: 'viedu-smartpro-storage',
      // Sử dụng localStorage để lưu dữ liệu vĩnh viễn trên trình duyệt
      storage: createJSONStorage(() => localStorage),
    }
  )
);