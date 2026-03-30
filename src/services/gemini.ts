import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Cấu hình mẫu model mạnh nhất hiện tại (Flash 2.0/1.5 tùy gói của bạn)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // Hoặc gemini-3.0-flash-exp
  systemInstruction: "Bạn là trợ lý AI thông minh trong ứng dụng VietEdu Smart. Bạn hỗ trợ giáo viên soạn giáo án, thời khóa biểu và quản lý hành chính trường học. Hãy trả lời chuyên nghiệp, ngắn gọn bằng tiếng Việt.",
});

export const askGemini = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Lỗi khi kết nối não AI:", error);
    return "Hệ thống AI đang bận, Thầy/Cô vui lòng thử lại sau.";
  }
};