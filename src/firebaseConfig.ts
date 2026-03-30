import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Thêm dòng này
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDxAgi1owSIkwilcWrIbJfBNC8r6bG8cic",
  authDomain: "gen-lang-client-0168920715.firebaseapp.com",
  projectId: "gen-lang-client-0168920715",
  storageBucket: "gen-lang-client-0168920715.firebasestorage.app",
  messagingSenderId: "365370339194",
  appId: "1:365370339194:web:3ebdcce8fccac43bf930c3",
  measurementId: "G-89DRK7PMM3"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ cần thiết
export const auth = getAuth(app); // Xuất biến auth để dùng ở trang Login
export const googleProvider = new GoogleAuthProvider(); // Xuất provider để dùng đăng nhập Google
export const analytics = getAnalytics(app);

export default app;