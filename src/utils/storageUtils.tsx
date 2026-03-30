import React from 'react';
import { Save, Download, Upload } from 'lucide-react';

export const StorageCard: React.FC = () => {
  // Hàm xuất dữ liệu
  const exportDataToFile = () => {
    try {
      const data = localStorage.getItem('vietedu_data') || '{}';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vietedu_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi xuất file:", error);
    }
  };

  // Hàm nhập dữ liệu
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        JSON.parse(result); 
        localStorage.setItem('vietedu_data', result);
        alert("Khôi phục thành công!");
        window.location.reload();
      } catch (err) {
        alert("File không hợp lệ!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Save className="text-blue-600" size={24} />
        <h3 className="font-bold text-blue-900 uppercase text-sm tracking-wide">
          Trung tâm dữ liệu cá nhân
        </h3>
      </div>
      
      <p className="text-xs text-blue-700 mb-4 italic leading-relaxed">
        Toàn bộ dữ liệu của thầy cô được tự động bảo mật và lưu trữ cục bộ tại máy tính này.
      </p>

      <div className="flex flex-wrap gap-3">
        <button 
          onClick={exportDataToFile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <Download size={14} /> Xuất file dự phòng (.json)
        </button>
        
        <label className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 cursor-pointer transition-all active:scale-95">
          <Upload size={14} /> Khôi phục dữ liệu
          <input 
            type="file" 
            className="hidden" 
            accept=".json" 
            onChange={handleImportData} 
          />
        </label>
      </div>
    </div>
  );
};