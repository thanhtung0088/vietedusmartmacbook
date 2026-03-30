"use client";
import React, { useState } from 'react';
import { ClipboardList, Plus, Save, Trash2, Sparkles, Wand2 } from 'lucide-react';

export const Rubrics = () => {
  const [criteria, setCriteria] = useState([
    { id: 1, name: 'Nội dung', weight: 40, level1: 'Sơ sài', level2: 'Đạt yêu cầu', level3: 'Sâu sắc' },
    { id: 2, name: 'Hình thức', weight: 30, level1: 'Cẩu thả', level2: 'Gọn gàng', level3: 'Đẹp, sáng tạo' },
    { id: 3, name: 'Kỹ năng trình bày', weight: 30, level1: 'Yếu', level2: 'Tự tin', level3: 'Cuốn hút' },
  ]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 p-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-3">
            <ClipboardList className="text-indigo-600" size={28} />
            Thiết kế Rubrics đánh giá
          </h1>
          <p className="text-slate-500 text-[11px] mt-1 font-bold uppercase italic">Công cụ tạo tiêu chí đánh giá học sinh bằng AI</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Plus size={18} /> Thêm tiêu chí mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 w-48">Tiêu chí</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 w-24">Trọng số</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 bg-rose-50/50">Mức 1 (Yếu)</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 bg-amber-50/50">Mức 2 (Đạt)</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 bg-emerald-50/50">Mức 3 (Tốt)</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {criteria.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <input type="text" defaultValue={c.name} className="bg-transparent font-bold text-slate-700 outline-none w-full focus:text-indigo-600" />
                </td>
                <td className="p-4 text-center">
                  <input type="text" defaultValue={c.weight + '%'} className="bg-transparent font-bold text-slate-500 outline-none w-full" />
                </td>
                <td className="p-4 bg-rose-50/20 text-[11px] text-slate-600 italic font-medium">{c.level1}</td>
                <td className="p-4 bg-amber-50/20 text-[11px] text-slate-600 italic font-medium">{c.level2}</td>
                <td className="p-4 bg-emerald-50/20 text-[11px] text-slate-600 italic font-medium">{c.level3}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Wand2 size={16} /></button>
                    <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4">
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-black text-[11px] uppercase hover:bg-slate-50 transition-all shadow-sm">
          <Sparkles size={18} className="text-amber-500" /> Gợi ý từ AI
        </button>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase hover:bg-emerald-700 transition-all shadow-lg">
          <Save size={18} /> Lưu Rubrics
        </button>
      </div>
    </div>
  );
};