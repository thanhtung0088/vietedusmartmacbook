// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const AI_MODELS = {
  // Đồng bộ với bản Gemini 2.5 Flash như bạn mong muốn
  FLASH: "gemini-2.5-flash", 
  PRO: "gemini-2.5-pro",
};

export const getAiModel = (type: 'FLASH' | 'PRO' = 'FLASH') => {
  if (typeof window === 'undefined') return null;

  const apiKey = localStorage.getItem('user_gemini_api_key') || "";
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ 
    model: AI_MODELS[type] 
  });
};