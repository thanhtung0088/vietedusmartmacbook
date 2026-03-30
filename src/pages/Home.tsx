const Home = () => {
  return (
    <div className="space-y-6">

      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="w-full max-w-xl border border-gray-300 rounded-xl px-4 py-2 bg-white"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LỊCH DẠY */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-800">
              Lịch dạy hôm nay
            </h2>
            <button className="text-blue-600 text-sm hover:underline">
              Cập nhật TKB
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Tiết</th>
                <th className="py-2 text-left">Môn</th>
                <th className="py-2 text-left">Lớp</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map((i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2">{i}</td>
                  <td className="py-2 text-gray-500">Trống</td>
                  <td className="py-2">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PHÒNG TRÌNH CHIẾU */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Phòng trình chiếu
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
            Kéo thả PDF hoặc{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Chọn file
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
