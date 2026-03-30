"use client";
import React, { useState, useRef } from 'react';
import { 
  FileText, Sparkles, Loader2, Plus, X, Download, 
  Printer, FileSignature, AlertCircle, BookMarked, 
  LayoutList, PenTool 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// Danh sách loại văn bản hành chính phổ biến theo Nghị định 30/2020/NĐ-CP
const loaiVanBanOptions = [
  { value: "quyet-dinh", label: "Quyết định" },
  { value: "cong-van", label: "Công văn" },
  { value: "thong-bao", label: "Thông báo" },
  { value: "ke-hoach", label: "Kế hoạch" },
  { value: "bao-cao", label: "Báo cáo" },
  { value: "chi-thi", label: "Chỉ thị" },
  { value: "bien-ban", label: "Biên bản" },
  { value: "giay-moi", label: "Giấy mời" },
  { value: "thong-cao", label: "Thông cáo" },
  { value: "tuyen-bo", label: "Tuyên bố" },
  { value: "hop-dong", label: "Hợp đồng" },
  { value: "don", label: "Đơn" },
  { value: "khac", label: "Loại khác (tùy chỉnh)" },
];

// Danh sách cơ quan ban hành phổ biến trong trường học
const coQuanBanHanhOptions = [
  "Hiệu trưởng Trường ...",
  "Phòng Giáo dục và Đào tạo ...",
  "Sở Giáo dục và Đào tạo ...",
  "Ban Giám hiệu",
  "Tổ chuyên môn ...",
  "Chi bộ Trường ...",
  "Đoàn Thanh niên",
  "Hội đồng Trường",
  "Khác (nhập tay)",
];

 export const SoanVanBanAI: React.FC = () => {
  const [loaiVanBan, setLoaiVanBan] = useState("");
  const [tieuDe, setTieuDe] = useState("");
  const [soHieu, setSoHieu] = useState("");
  const [ngayThang, setNgayThang] = useState(new Date().toISOString().slice(0, 10));
  const [coQuan, setCoQuan] = useState("");
  const [noiDungChinh, setNoiDungChinh] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [vanBanResult, setVanBanResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && files.length < 5) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateVanBan = async () => {
    setErrorMsg("");
    if (!loaiVanBan) {
      setErrorMsg("Vui lòng chọn loại văn bản.");
      return;
    }
    if (!tieuDe.trim()) {
      setErrorMsg("Vui lòng nhập trích yếu / tiêu đề văn bản.");
      return;
    }
    if (!noiDungChinh.trim()) {
      setErrorMsg("Vui lòng nhập nội dung chính hoặc yêu cầu cụ thể.");
      return;
    }

    setLoading(true);
    setVanBanResult("Đang soạn thảo văn bản theo đúng Nghị định 30/2020/NĐ-CP...");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const selectedLoai = loaiVanBanOptions.find(opt => opt.value === loaiVanBan)?.label || loaiVanBan;

      const prompt = `
Bạn là chuyên gia soạn thảo văn bản hành chính trong lĩnh vực giáo dục Việt Nam, am hiểu sâu **Nghị định 30/2020/NĐ-CP** về công tác văn thư, **Thông tư 01/2011/TT-BNV** (hướng dẫn thể thức), và các quy định liên quan đến văn bản trường học.

Yêu cầu soạn **VĂN BẢN HÀNH CHÍNH CHUẨN** với thông tin sau:

- Loại văn bản: ${selectedLoai}
- Trích yếu / Tiêu đề: ${tieuDe}
- Số hiệu văn bản: ${soHieu || "[tự động sinh nếu để trống]"}
- Ngày tháng: ${ngayThang || new Date().toLocaleDateString('vi-VN')}
- Cơ quan ban hành: ${coQuan || "Hiệu trưởng Trường ..."}
- Nội dung chính / Yêu cầu cụ thể: ${noiDungChinh}
- Tài liệu đính kèm (nếu có): ${files.map(f => f.name).join(", ") || "không có"}

Yêu cầu nghiêm ngặt:
1. Đúng **thể thức** theo Nghị định 30/2020/NĐ-CP và Thông tư 01/2011/TT-BNV:
   - Quốc hiệu, tiêu ngữ
   - Số hiệu, ký hiệu
   - Địa danh, ngày tháng
   - Tên loại + trích yếu
   - Nội dung (căn cứ pháp lý → nội dung chính → điều khoản thi hành)
   - Chức danh, chữ ký, dấu
   - Nơi nhận

2. Ngôn ngữ hành chính chuẩn mực, trang trọng, ngắn gọn, đúng chính tả tiếng Việt.
3. Phù hợp với văn bản trường học phổ thông (THCS/THPT/tiểu học).
4. Nếu là Quyết định/Công văn → có phần căn cứ pháp lý rõ ràng (Luật Giáo dục, Nghị định, Thông tư liên quan).
5. Nếu có đính kèm → đề cập trong văn bản.

Trả về **toàn bộ văn bản** dưới dạng text định dạng đẹp (sử dụng markdown để phân cấp rõ ràng), dễ copy dán vào Word và in ấn.
`;

      const result = await model.generateContent(prompt);
      setVanBanResult(result.response.text());
    } catch (err: any) {
      setVanBanResult("Có lỗi xảy ra khi kết nối AI. Vui lòng thử lại.");
      setErrorMsg(err.message || "Lỗi không xác định");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportAs = (type: 'pdf' | 'word' | 'print') => {
    if (type === 'print') {
      window.print();
      return;
    }
    alert(`Chức năng xuất ${type.toUpperCase()} đang được phát triển. Bạn có thể copy nội dung văn bản và dán vào Word để định dạng thêm.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 flex items-center gap-3">
              <FileSignature className="text-indigo-600" size={32} />
              Soạn Văn Bản Hành Chính AI
            </h1>
            <p className="text-indigo-700 mt-1">Chuẩn Nghị định 30/2020/NĐ-CP • Thể thức văn thư hành chính</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportAs('print')}
              className="px-5 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center gap-2 shadow-sm"
            >
              <Printer size={18} /> In thử
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel cấu hình */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookMarked size={20} /> Thông tin văn bản
              </h2>
            </div>

            <div className="p-5 space-y-5">
              {/* Loại văn bản */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Loại văn bản
                </label>
                <select
                  value={loaiVanBan}
                  onChange={e => setLoaiVanBan(e.target.value)}
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                >
                  <option value="">Chọn loại văn bản...</option>
                  {loaiVanBanOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Tiêu đề / Trích yếu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Trích yếu / Tiêu đề
                </label>
                <input
                  type="text"
                  value={tieuDe}
                  onChange={e => setTieuDe(e.target.value)}
                  placeholder="Ví dụ: Về việc tổ chức Hội nghị tổng kết năm học..."
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Số hiệu & Ngày tháng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số hiệu</label>
                  <input
                    type="text"
                    value={soHieu}
                    onChange={e => setSoHieu(e.target.value)}
                    placeholder="VD: 123/QĐ-THCSABC"
                    className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày ban hành</label>
                  <input
                    type="date"
                    value={ngayThang}
                    onChange={e => setNgayThang(e.target.value)}
                    className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Cơ quan ban hành */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cơ quan / Người ký
                </label>
                <select
                  value={coQuan}
                  onChange={e => setCoQuan(e.target.value)}
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Chọn cơ quan...</option>
                  {coQuanBanHanhOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Nội dung chính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nội dung chính / Yêu cầu
                </label>
                <textarea
                  value={noiDungChinh}
                  onChange={e => setNoiDungChinh(e.target.value)}
                  placeholder="Mô tả chi tiết nội dung văn bản cần soạn (càng cụ thể càng tốt)..."
                  rows={5}
                  className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50/30 focus:ring-2 focus:ring-indigo-400 resize-y"
                />
              </div>

              {/* Đính kèm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Đính kèm (tài liệu liên quan)
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= 5}
                  className="w-full py-3 bg-indigo-50 border-2 border-indigo-300 border-dashed rounded-xl text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus size={18} /> Thêm file (tối đa 5)
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  className="hidden"
                  onChange={handleAddFile}
                />
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText size={16} className="text-indigo-600" />
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

          {/* Khu vực kết quả */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5">
              <h2 className="text-lg font-bold flex items-center gap-3">
                <PenTool size={20} /> Văn bản hành chính được soạn
              </h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white to-purple-50/20">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Lỗi cấu hình</p>
                    <p className="text-sm">{errorMsg}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Loader2 size={64} className="animate-spin text-purple-600" />
                  <p className="mt-6 text-lg font-medium text-purple-700">Đang soạn thảo chuẩn thể thức...</p>
                </div>
              ) : vanBanResult ? (
                <div className="prose prose-purple max-w-none">
                  <pre className="bg-white p-8 rounded-xl border border-purple-100 shadow-inner overflow-x-auto text-base leading-relaxed whitespace-pre-wrap font-serif">
                    {vanBanResult}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                  <FileText size={80} className="mb-6 opacity-40 text-purple-400" />
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">
                    Chưa có văn bản nào
                  </h3>
                  <p className="max-w-md">
                    Điền thông tin bên trái và nhấn "Soạn văn bản" để tạo văn bản hành chính chuẩn quy định.
                  </p>
                </div>
              )}
            </div>

            {/* Thanh công cụ */}
            <div className="border-t border-purple-100 p-5 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={generateVanBan}
                disabled={loading || !loaiVanBan || !tieuDe.trim() || !noiDungChinh.trim()}
                className={`
                  flex-1 sm:flex-none px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all
                  ${loading || !loaiVanBan || !tieuDe.trim() || !noiDungChinh.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                  }
                `}
              >
                <Sparkles size={22} className={loading ? "animate-pulse" : ""} />
                {loading ? "Đang soạn..." : "Soạn Văn Bản Chuẩn"}
              </button>

              {vanBanResult && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => exportAs('pdf')}
                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2 shadow-md transition-all"
                  >
                    <Download size={18} /> PDF
                  </button>
                  <button
                    onClick={() => exportAs('word')}
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

export default SoanVanBanAI;