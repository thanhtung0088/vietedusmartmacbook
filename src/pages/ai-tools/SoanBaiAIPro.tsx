"use client";

import React, { useState } from "react";
import { Sparkles, Download, FileText, Presentation } from "lucide-react";

export default function SoanBaiAIPro() {

  const [monHoc, setMonHoc] = useState("");
  const [lop, setLop] = useState("");
  const [tenBai, setTenBai] = useState("");
  const [ketQua, setKetQua] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState("docx");

  const taoGiaoAn = async () => {

    setLoading(true);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt =
      "Bạn là chuyên gia giáo dục Việt Nam.\n\n" +
      "Hãy soạn giáo án theo CTGDPT 2018.\n\n" +
      "Thông tin bài học:\n" +
      "Môn: " + monHoc + "\n" +
      "Lớp: " + lop + "\n" +
      "Tên bài: " + tenBai + "\n\n" +
      "Giáo án cần có:\n" +
      "1. Mục tiêu\n" +
      "2. Chuẩn bị\n" +
      "3. Hoạt động dạy học\n" +
      "4. Luyện tập\n" +
      "5. Vận dụng\n" +
      "6. Đánh giá\n";

    try {

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      setKetQua(data.result || "AI chưa trả kết quả");

    } catch (error) {

      setKetQua("Lỗi kết nối AI");

    }

    setLoading(false);

  };

  const xuatFile = () => {

    if (!ketQua) return;

    const blob = new Blob([ketQua], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "giao-an." + fileType;

    a.click();

  };

  return (

    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}

      <div className="flex items-center gap-3">

        <Sparkles className="text-indigo-600" />

        <h1 className="text-2xl font-black uppercase">
          Soạn bài AI PRO
        </h1>

      </div>

      {/* FORM */}

      <div className="grid grid-cols-3 gap-4">

        <input
          placeholder="Môn học"
          value={monHoc}
          onChange={(e) => setMonHoc(e.target.value)}
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Lớp"
          value={lop}
          onChange={(e) => setLop(e.target.value)}
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Tên bài"
          value={tenBai}
          onChange={(e) => setTenBai(e.target.value)}
          className="border rounded-xl p-3"
        />

      </div>

      {/* BUTTON */}

      <button
        onClick={taoGiaoAn}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
      >

        <Sparkles size={18} />

        {loading ? "AI đang soạn..." : "Tạo giáo án"}

      </button>

      {/* KẾT QUẢ */}

      <textarea
        value={ketQua}
        onChange={(e) => setKetQua(e.target.value)}
        className="w-full h-[400px] border rounded-xl p-4"
        placeholder="Kết quả AI sẽ hiển thị ở đây..."
      />

      {/* XUẤT FILE */}

      <div className="flex items-center gap-4">

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="border p-2 rounded-lg"
        >

          <option value="docx">Word (DOCX)</option>
          <option value="pdf">PDF</option>
          <option value="pptx">PowerPoint</option>

        </select>

        <button
          onClick={xuatFile}
          className="bg-emerald-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >

          <Download size={16} />

          Xuất file

        </button>

      </div>

    </div>

  );

}