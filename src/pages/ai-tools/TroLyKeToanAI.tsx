"use client";
import React, { useState, useRef } from 'react';
import { 
  Landmark, Calculator, Sparkles, Loader2, Plus, X, Download, 
  FileSpreadsheet, Printer, TrendingUp, AlertCircle, 
  DollarSign, BarChart3, Receipt, FileText, Search, 
  ArrowUpRight, ArrowDownRight, PieChart 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// Các loại báo cáo / nghiệp vụ kế toán phổ biến trong trường học (theo Luật Kế toán 2015, Thông tư 107/2017/TT-BTC, Thông tư 133/2016/TT-BTC)
const nghiepVuOptions = [
  { value: "bao-cao-tai-chinh", label: "Báo cáo tài chính (B01, B02, B03...)" },
  { value: "so-quy", label: "Sổ quỹ tiền mặt / tiền gửi" },
  { value: "phieu-thu-chi", label: "Phiếu thu / Phiếu chi" },
  { value: "bang-ke-thu-chi", label: "Bảng kê thu chi" },
  { value: "ket-toan-luong", label: "Kết toán lương, phụ cấp giáo viên" },
  { value: "chi-phi-hoc-tap", label: "Chi phí học tập, hoạt động ngoại khóa" },
  { value: "tai-san-co-dinh", label: "Quản lý TSCĐ, khấu hao" },
  { value: "cong-no", label: "Công nợ phải thu / phải trả" },
  { value: "du-toan-ngan-sach", label: "Dự toán ngân sách năm" },
  { value: "quyet-toan", label: "Quyết toán kinh phí" },
  { value: "kiem-ke", label: "Kiểm kê tài sản cuối kỳ" },
  { value: "khac", label: "Nghiệp vụ khác (tùy chỉnh)" },
];

// Đơn vị tiền tệ (chủ yếu VND)
const donViTienOptions = [
  { value: "vnd", label: "VND (Việt Nam Đồng)" },
  { value: "usd", label: "USD (nếu có nguồn tài trợ)" },
];

// Các loại chứng từ phổ biến
const loaiChungTuOptions = [
  "Phiếu thu", "Phiếu chi", "Giấy báo Nợ", "Giấy báo Có", 
  "Hóa đơn GTGT", "Hóa đơn bán hàng", "Biên lai thu tiền", "Chứng từ khác"
];

export const TroLyKeToanAI: React.FC = () => {
  const [nghiepVu, setNghiepVu] = useState("");
  const [thoiGian, setThoiGian] = useState("");
  const [soTien, setSoTien] = useState("");
  const [donViTien, setDonViTien] = useState("vnd");
  const [moTa, setMoTa] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [ketQua, setKetQua] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && files.length < 5) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateBaoCao = async () => {
    setErrorMsg("");
    if (!nghiepVu) {
      setErrorMsg("Vui lòng chọn loại nghiệp vụ / báo cáo.");
      return;
    }
    if (!moTa.trim()) {
      setErrorMsg("Vui lòng mô tả chi tiết nghiệp vụ hoặc dữ liệu đầu vào.");
      return;
    }

    setLoading(true);
    setKetQua("Đang xử lý nghiệp vụ kế toán theo đúng quy định...");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const selectedNghiepVu = nghiepVuOptions.find(opt => opt.value === nghiepVu)?.label || nghiepVu;

      const prompt = `
Bạn là chuyên gia kế toán trường học phổ thông Việt Nam, am hiểu sâu:

- Luật Kế toán 2015 (sửa đổi, bổ sung)
- Thông tư 107/2017/TT-BTC (hướng dẫn chế độ kế toán hành chính sự nghiệp)
- Thông tư 133/2016/TT-BTC (chế độ kế toán doanh nghiệp nhỏ và vừa - áp dụng cho một số khoản thu)
- Các văn bản về quản lý tài chính giáo dục (Nghị định 60/2021/NĐ-CP, Thông tư 16/2018/TT-BGDĐT...)

Yêu cầu xử lý **NGHIỆP VỤ KẾ TOÁN** chuẩn mực, chuyên nghiệp, giống phần mềm MISA/AMIS/Kế Toán Trường Học:

Thông tin đầu vào:
- Loại nghiệp vụ: ${selectedNghiepVu}
- Thời gian: ${thoiGian || "tháng hiện tại / quý / năm"}
- Số tiền liên quan: ${soTien ? new Intl.NumberFormat('vi-VN').format(Number(soTien)) + ' ' + (donViTien === 'vnd' ? 'VND' : 'USD') : "không xác định"}
- Mô tả chi tiết / dữ liệu: ${moTa}
- Tài liệu đính kèm (hóa đơn, chứng từ...): ${files.map(f => f.name).join(", ") || "không có"}

Yêu cầu nghiêm ngặt:
1. Tuân thủ **thể thức chứng từ** và **bút toán** theo Thông tư 107/2017/TT-BTC:
   - Bút toán kép (Nợ - Có)
   - Tài khoản kế toán chuẩn (TK 111, 112, 331, 461, 661, 811...)
   - Có phần diễn giải rõ ràng

2. Định dạng kết quả giống phần mềm kế toán hiện đại (MISA, AMIS):
   - Bảng chứng từ (nếu là phiếu thu/chi)
   - Sổ cái / sổ chi tiết (nếu cần)
   - Báo cáo tài chính ngắn gọn (nếu là báo cáo)
   - Bảng biểu đẹp (markdown table)
   - Ghi chú cảnh báo nếu có sai sót tiềm ẩn (ví dụ: vượt dự toán, thiếu chứng từ)

3. Ngôn ngữ chuyên môn kế toán, ngắn gọn, chính xác.
4. Nếu có số liệu → tính toán tự động (tổng thu, chi, dư quỹ...).
5. Có phần **kiến nghị** (nếu cần điều chỉnh, bổ sung chứng từ).

Trả về kết quả dưới dạng **markdown chuyên nghiệp**, dễ copy vào Excel/Word, có tiêu đề lớn, bảng biểu rõ ràng, số tiền định dạng VND (1.234.567 đ).
`;

      const result = await model.generateContent(prompt);
      setKetQua(result.response.text());
    } catch (err: any) {
      setKetQua("Có lỗi xảy ra khi kết nối AI. Vui lòng thử lại.");
      setErrorMsg(err.message || "Lỗi không xác định");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    return new Intl.NumberFormat('vi-VN').format(Number(value));
  };

  const handleExport = (type: 'pdf' | 'excel' | 'word' | 'print') => {
    if (type === 'print') {
      window.print();
      return;
    }
    alert(`Chức năng xuất ${type.toUpperCase()} đang được phát triển. Bạn có thể copy bảng kết quả và dán vào ${type === 'excel' ? 'Excel' : 'Word'}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 flex items-center gap-3">
              <Landmark className="text-indigo-700" size={32} />
              Trợ lý Kế toán AI - Trường học
            </h1>
            <p className="text-indigo-700 mt-1">
              Chuẩn Luật Kế toán 2015 • TT 107/2017/TT-BTC • Giao diện giống MISA/AMIS
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('print')}
              className="px-5 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center gap-2 shadow-sm"
            >
              <Printer size={18} /> In chứng từ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel nhập liệu - bên trái */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calculator size={20} /> Nhập nghiệp vụ kế toán
              </h2>
            </div>

            <div className="p-5 space-y-5">
              {/* Loại nghiệp vụ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Loại nghiệp vụ / báo cáo
                </label>
                <select
                  value={nghiepVu}
                  onChange={e => setNghiepVu(e.target.value)}
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Chọn nghiệp vụ...</option>
                  {nghiepVuOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Thời gian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kỳ kế toán / Thời gian
                </label>
                <input
                  type="text"
                  value={thoiGian}
                  onChange={e => setThoiGian(e.target.value)}
                  placeholder="Ví dụ: Tháng 3/2026 | Quý I/2026 | Năm 2025-2026"
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Số tiền */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số tiền
                  </label>
                  <input
                    type="number"
                    value={soTien}
                    onChange={e => setSoTien(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Đơn vị
                  </label>
                  <select
                    value={donViTien}
                    onChange={e => setDonViTien(e.target.value)}
                    className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500"
                  >
                    {donViTienOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mô tả chi tiết / Dữ liệu đầu vào
                </label>
                <textarea
                  value={moTa}
                  onChange={e => setMoTa(e.target.value)}
                  placeholder="Ví dụ: Thu học phí 45 HS lớp 10A1: 1.200.000đ/hs... Chi mua sách giáo khoa... (càng chi tiết càng chính xác)"
                  rows={5}
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 resize-y"
                />
              </div>

              {/* Đính kèm chứng từ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Chứng từ gốc (hóa đơn, phiếu thu...)
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= 5}
                  className="w-full py-3 bg-indigo-50 border-2 border-indigo-300 border-dashed rounded-xl text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus size={18} /> Thêm file chứng từ (tối đa 5)
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".pdf,.jpg,.png,.xlsx,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                        <div className="flex items-center gap-2 text-sm">
                          <Receipt size={16} className="text-indigo-600" />
                          <span className="truncate max-w-[180px]">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Khu vực kết quả - giống giao diện phần mềm kế toán */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-5">
              <h2 className="text-lg font-bold flex items-center gap-3">
                <BarChart3 size={20} /> Kết quả xử lý kế toán
              </h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white to-blue-50/30">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Lỗi nhập liệu</p>
                    <p className="text-sm">{errorMsg}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="relative">
                    <Loader2 size={64} className="animate-spin text-blue-600" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-800">
                      CALCULATING...
                    </div>
                  </div>
                  <p className="mt-6 text-lg font-medium text-blue-700">
                    Đang hạch toán và lập báo cáo...
                  </p>
                </div>
              ) : ketQua ? (
                <div className="prose prose-blue max-w-none">
                  <pre className="bg-white p-8 rounded-xl border border-blue-100 shadow-inner overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {ketQua}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                  <Landmark size={80} className="mb-6 opacity-40 text-blue-400" />
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">
                    Chưa có nghiệp vụ kế toán
                  </h3>
                  <p className="max-w-md">
                    Chọn loại nghiệp vụ, nhập số liệu và mô tả chi tiết bên trái, sau đó nhấn "Xử lý kế toán" để bắt đầu.
                  </p>
                </div>
              )}
            </div>

            {/* Thanh điều khiển dưới - phong cách MISA */}
            <div className="border-t border-blue-100 p-5 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={generateBaoCao}
                disabled={loading || !nghiepVu || !moTa.trim()}
                className={`
                  flex-1 sm:flex-none px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all
                  ${loading || !nghiepVu || !moTa.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }
                `}
              >
                <Sparkles size={22} className={loading ? "animate-pulse" : ""} />
                {loading ? "Đang xử lý..." : "Xử lý & Lập Báo cáo"}
              </button>

              {ketQua && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-md transition-all"
                  >
                    <Download size={18} /> PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-md transition-all"
                  >
                    <FileSpreadsheet size={18} /> Excel
                  </button>
                  <button
                    onClick={() => handleExport('word')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
                  >
                    <FileText size={18} /> Word
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroLyKeToanAI;