const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "VietEdu Smart Pro",
    // Đường dẫn icon (đảm bảo file này có trong dist sau khi build)
    icon: path.join(__dirname, 'dist/logo-app.png'), 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Cho phép chạy các script từ Firebase/Google
      webSecurity: false 
    },
  });

  // Kiểm tra chế độ môi trường
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // Nạp file index.html từ thư mục dist
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // --- GIẢI PHÁP CHO GOOGLE LOGIN ---
  // Khi người dùng bấm nút đăng nhập Google, App sẽ mở trình duyệt thật (Chrome/Edge) 
  // thay vì mở cửa sổ trắng bên trong App (vốn bị Google chặn).
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('accounts.google.com') || url.includes('firebaseapp.com')) {
      shell.openExternal(url); // Mở bằng trình duyệt máy tính
      return { action: 'deny' }; // Chặn không cho mở popup bên trong App
    }
    return { action: 'allow' };
  });

  // Xóa menu mặc định để app giống phần mềm chuyên nghiệp
  // win.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});