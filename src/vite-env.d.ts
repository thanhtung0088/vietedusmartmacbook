/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Giúp máy hiểu biến API Key là một chuỗi văn bản (string)
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}