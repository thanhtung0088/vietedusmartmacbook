// src/lib/geminiConfig.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Cấu hình tên Model mới nhất theo tài liệu bạn cung cấp
export const AI_MODELS = {
  FAST: "gemini-2.5-flash-lite-preview", // Tối ưu cho nhận xét điểm, tốc độ cực nhanh
  PRO: "gemini-2.5-flash-preview",        // Tối ưu cho soạn bài, tư duy phức tạp
  IMAGE: "gemini-2.5-flash-image-preview" // Dành cho xử lý hình ảnh
};

// 2. Hàm khởi tạo AI dùng chung
export const getGeminiModel = (type: keyof typeof AI_MODELS = 'FAST') => {
  if (typeof window === 'undefined') return null;

  // Lấy key từ nơi lưu trữ chung mà bạn đã kết nối trên toàn ứng dụng
  const apiKey = localStorage.getItem('user_gemini_api_key');
  
  if (!apiKey) {
    throw new Error("CHƯA_KẾT_NỐI_AI");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: AI_MODELS[type] });
};