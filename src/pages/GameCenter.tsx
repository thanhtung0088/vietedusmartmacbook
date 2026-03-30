"use client";

import React, { useState } from 'react';
import { 
  Gamepad2, Trophy, Star, Play, ChevronRight, Brain, Zap, 
  Medal, Rocket, Atom, Languages, Calculator, Microscope, 
  Palette, Music, AlertCircle, Home, RotateCcw
} from 'lucide-react';

// --- HỆ THỐNG DỮ LIỆU 10 TRÒ CHƠI HOÀN CHỈNH ---
const gameCards = [
  {
    id: "g1", title: "Thần đồng Toán học", grade: "Lớp 6", subject: "Toán học", level: "Cơ bản",
    icon: <Calculator size={20} />, color: "text-blue-500", bg: "bg-blue-50",
    questions: [
      { id: 1, q: "Số tự nhiên nhỏ nhất là số nào?", options: ["1", "0", "Không có", "10"], correct: 1 },
      { id: 2, q: "Kết quả của phép tính 2^3 là?", options: ["6", "5", "8", "9"], correct: 2 },
      { id: 3, q: "Số nào sau đây là số nguyên tố?", options: ["1", "2", "4", "9"], correct: 1 },
      { id: 4, q: "Phân số 1/2 bằng phân số nào dưới đây?", options: ["2/4", "2/1", "1/4", "3/2"], correct: 0 },
      { id: 5, q: "Hình vuông cạnh 4cm thì diện tích là?", options: ["8cm2", "16cm2", "12cm2", "4cm2"], correct: 1 },
      { id: 6, q: "Ước chung lớn nhất của 12 và 18 là?", options: ["2", "3", "6", "12"], correct: 2 },
      { id: 7, q: "Giá trị của x trong x + 5 = 12 là?", options: ["7", "8", "17", "6"], correct: 0 },
      { id: 8, q: "Số đối của số 5 là?", options: ["5", "0", "-5", "1/5"], correct: 2 },
      { id: 9, q: "Góc vuông có số đo là?", options: ["180 độ", "45 độ", "90 độ", "60 độ"], correct: 2 },
      { id: 10, q: "Số nào chia hết cho cả 2 và 5?", options: ["12", "15", "20", "22"], correct: 2 },
    ]
  },
  {
    id: "g2", title: "English Master", grade: "Lớp 7", subject: "Tiếng Anh", level: "Thách thức",
    icon: <Languages size={20} />, color: "text-purple-500", bg: "bg-purple-50",
    questions: [
      { id: 1, q: "What is the past tense of 'Go'?", options: ["Goed", "Gone", "Went", "Goes"], correct: 2 },
      { id: 2, q: "Choose the odd one out:", options: ["Apple", "Banana", "Carrot", "Orange"], correct: 2 },
      { id: 3, q: "She ___ playing badminton now.", options: ["is", "are", "am", "be"], correct: 0 },
      { id: 4, q: "Which word means 'Trường học'?", options: ["Hospital", "School", "Park", "Market"], correct: 1 },
      { id: 5, q: "How many months are there in a year?", options: ["10", "11", "12", "13"], correct: 2 },
      { id: 6, q: "I ___ to the cinema yesterday.", options: ["go", "goes", "went", "going"], correct: 2 },
      { id: 7, q: "The sun rises in the ___.", options: ["West", "East", "North", "South"], correct: 1 },
      { id: 8, q: "What is the capital of Vietnam?", options: ["HCMC", "Danang", "Hanoi", "Hue"], correct: 2 },
      { id: 9, q: "Opposite of 'Hot' is ___.", options: ["Warm", "Cold", "Dry", "Wet"], correct: 1 },
      { id: 10, q: "___ you like coffee?", options: ["Do", "Does", "Is", "Are"], correct: 0 },
    ]
  },
  {
    id: "g3", title: "Nhà bác học nhí", grade: "Lớp 3-5", subject: "Khoa học", level: "Dễ",
    icon: <Microscope size={20} />, color: "text-emerald-500", bg: "bg-emerald-50",
    questions: [
      { id: 1, q: "Nước sôi ở bao nhiêu độ C?", options: ["50", "80", "100", "120"], correct: 2 },
      { id: 2, q: "Động vật nào đẻ trứng?", options: ["Mèo", "Gà", "Chó", "Lợn"], correct: 1 },
      { id: 3, q: "Hỗn hợp nào sau đây là dung dịch?", options: ["Nước đường", "Nước cát", "Nước dầu", "Gạo trộn đỗ"], correct: 0 },
      { id: 4, q: "Cơ quan nào giúp cá thở dưới nước?", options: ["Phổi", "Mang", "Da", "Vây"], correct: 1 },
      { id: 5, q: "Cây xanh cần gì để quang hợp?", options: ["Ánh sáng mặt trời", "Bóng tối", "Thức ăn", "Lửa"], correct: 0 },
      { id: 6, q: "Vật nào dẫn điện tốt?", options: ["Gỗ", "Nhựa", "Đồng", "Cao su"], correct: 2 },
      { id: 7, q: "Mặt trăng là gì của Trái đất?", options: ["Hành tinh", "Vệ tinh tự nhiên", "Ngôi sao", "Thiên thạch"], correct: 1 },
      { id: 8, q: "Năng lượng mặt trời là năng lượng?", options: ["Sạch", "Ô nhiễm", "Cạn kiệt", "Đắt đỏ"], correct: 0 },
      { id: 9, q: "Cơ thể người có bao nhiêu phần trăm là nước?", options: ["30%", "50%", "70%", "90%"], correct: 2 },
      { id: 10, q: "Hiện tượng nước chuyển thành hơi gọi là?", options: ["Đông đặc", "Bay hơi", "Ngưng tụ", "Nóng chảy"], correct: 1 },
    ]
  },
  {
    id: "g4", title: "Sử Việt hào hùng", grade: "Tổng hợp", subject: "Lịch sử", level: "Khó",
    icon: <Medal size={20} />, color: "text-rose-500", bg: "bg-rose-50",
    questions: [
      { id: 1, q: "Ai đọc bản Tuyên ngôn Độc lập năm 1945?", options: ["Võ Nguyên Giáp", "Hồ Chí Minh", "Trần Phú", "Lê Duẩn"], correct: 1 },
      { id: 2, q: "Chiến thắng Điện Biên Phủ diễn ra năm nào?", options: ["1945", "1954", "1975", "1930"], correct: 1 },
      { id: 3, q: "Vua nào đặt tên nước là Đại Cồ Việt?", options: ["Đinh Bộ Lĩnh", "Lê Hoàn", "Lý Thái Tổ", "Trần Hưng Đạo"], correct: 0 },
      { id: 4, q: "Kinh đô nhà Lý đặt tại đâu?", options: ["Hoa Lư", "Thăng Long", "Huế", "Phong Châu"], correct: 1 },
      { id: 5, q: "Trận Bạch Đằng năm 938 do ai chỉ huy?", options: ["Lý Thường Kiệt", "Trần Hưng Đạo", "Ngô Quyền", "Lê Lợi"], correct: 2 },
      { id: 6, q: "Chiến dịch Hồ Chí Minh kết thúc ngày nào?", options: ["30/4/1975", "2/9/1945", "19/5/1890", "7/5/1954"], correct: 0 },
      { id: 7, q: "Ai là nữ vương đầu tiên của nước ta?", options: ["Nguyên Phi Ỷ Lan", "Hai Bà Trưng", "Bà Triệu", "Dương Vân Nga"], correct: 1 },
      { id: 8, q: "Nước ta mang tên Việt Nam từ thời vua nào?", options: ["Minh Mạng", "Gia Long", "Quang Trung", "Tự Đức"], correct: 1 },
      { id: 9, q: "Ai lấy bông lau làm cờ tập trận?", options: ["Đinh Bộ Lĩnh", "Lê Hoàn", "Lý Công Uẩn", "Trần Quốc Toản"], correct: 0 },
      { id: 10, q: "Thành phố Sài Gòn đổi tên là TP.HCM năm nào?", options: ["1975", "1976", "1980", "1986"], correct: 1 },
    ]
  },
  {
    id: "g5", title: "Vũ trụ huyền bí", grade: "Lớp 8-9", subject: "Vật lý", level: "Trí tuệ",
    icon: <Atom size={20} />, color: "text-cyan-500", bg: "bg-cyan-50",
    questions: [
      { id: 1, q: "Đơn vị đo cường độ dòng điện là?", options: ["Vôn", "Oát", "Ampe", "Ôm"], correct: 2 },
      { id: 2, q: "Công thức tính vận tốc là?", options: ["v = s/t", "v = s*t", "v = t/s", "v = m*g"], correct: 0 },
      { id: 3, q: "Trọng lực là lực hút của?", options: ["Mặt trăng", "Trái đất", "Mặt trời", "Nam châm"], correct: 1 },
      { id: 4, q: "Sóng âm không truyền được trong?", options: ["Rắn", "Lỏng", "Khí", "Chân không"], correct: 3 },
      { id: 5, q: "Đơn vị đo công suất là?", options: ["Jun", "Niuton", "Oát (W)", "Ampe"], correct: 2 },
      { id: 6, q: "Hiện tượng phản xạ ánh sáng xảy ra trên?", options: ["Mặt hồ", "Gương phẳng", "Kim loại bóng", "Tất cả"], correct: 3 },
      { id: 7, q: "Tác dụng của ròng rọc cố định là?", options: ["Lợi về lực", "Lợi về đường đi", "Đổi hướng lực", "Tất cả"], correct: 2 },
      { id: 8, q: "Đơn vị đo hiệu điện thế là?", options: ["Ampe", "Vôn (V)", "Ôm", "Oát"], correct: 1 },
      { id: 9, q: "Khi nhiệt độ tăng, các nguyên tử sẽ?", options: ["Chuyển động chậm", "Chuyển động nhanh", "Đứng yên", "Biến mất"], correct: 1 },
      { id: 10, q: "Lực đẩy Ác-si-mét phụ thuộc vào?", options: ["Trọng lượng", "Thể tích chiếm chỗ", "Hình dạng", "Độ sâu"], correct: 1 },
    ]
  },
  {
    id: "g6", title: "Hành tinh xanh", grade: "Lớp 6-7", subject: "Địa lý", level: "Cơ bản",
    icon: <Rocket size={20} />, color: "text-green-600", bg: "bg-green-50",
    questions: [
      { id: 1, q: "Châu lục nào rộng lớn nhất thế giới?", options: ["Châu Âu", "Châu Mỹ", "Châu Á", "Châu Phi"], correct: 2 },
      { id: 2, q: "Việt Nam nằm ở bán đảo nào?", options: ["Triều Tiên", "Ấn Độ", "Đông Dương", "Ả Rập"], correct: 2 },
      { id: 3, q: "Đại dương nào sâu nhất thế giới?", options: ["Đại Tây Dương", "Thái Bình Dương", "Ấn Độ Dương", "Bắc Băng Dương"], correct: 1 },
      { id: 4, q: "Đỉnh núi cao nhất Việt Nam là?", options: ["Fansipan", "Bà Đen", "Tam Đảo", "Mẫu Sơn"], correct: 0 },
      { id: 5, q: "Sông nào dài nhất thế giới?", options: ["Sông Mê Kông", "Sông Nile", "Sông Amazon", "Sông Hồng"], correct: 1 },
      { id: 6, q: "Nước ta có bao nhiêu dân tộc anh em?", options: ["50", "52", "54", "56"], correct: 2 },
      { id: 7, q: "Thủ đô của nước Úc là?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
      { id: 8, q: "Hành tinh nào gần Mặt trời nhất?", options: ["Kim", "Thủy", "Hỏa", "Mộc"], correct: 1 },
      { id: 9, q: "Loại đất phổ biến ở vùng đồi núi nước ta?", options: ["Phù sa", "Feralit", "Đất phèn", "Đất mặn"], correct: 1 },
      { id: 10, q: "Đường kinh tuyến gốc đi qua thành phố nào?", options: ["Paris", "New York", "London", "Tokyo"], correct: 2 },
    ]
  },
  {
    id: "g7", title: "Logic & Hack não", grade: "Mọi lứa tuổi", subject: "Tư duy", level: "Cực khó",
    icon: <Brain size={20} />, color: "text-amber-600", bg: "bg-amber-50",
    questions: [
      { id: 1, q: "Cái gì càng thui càng ngắn?", options: ["Con đường", "Bút chì", "Cây nến", "Sợi dây"], correct: 2 },
      { id: 2, q: "Con gì đập thì sống, không đập thì chết?", options: ["Con tim", "Con cá", "Con muỗi", "Con cua"], correct: 0 },
      { id: 3, q: "Cái gì đen khi sạch, trắng khi bẩn?", options: ["Cái bảng", "Cái áo", "Cái răng", "Cái gương"], correct: 0 },
      { id: 4, q: "Tháng nào có 28 ngày?", options: ["Tháng 2", "Tháng 1", "Tháng nào cũng có", "Tháng 12"], correct: 2 },
      { id: 5, q: "Cái gì người mua biết, người bán biết, người dùng không biết?", options: ["Quần áo", "Thức ăn", "Quan tài", "Tiền bạc"], correct: 2 },
      { id: 6, q: "Con mèo nào cực kỳ sợ chuột?", options: ["Mèo máy Doraemon", "Mèo Tom", "Mèo nhà", "Mèo rừng"], correct: 0 },
      { id: 7, q: "Nắng ba năm tôi không bỏ bạn, mưa một ngày bạn bỏ tôi?", options: ["Cái nón", "Cái ô", "Cái bóng", "Đôi dép"], correct: 2 },
      { id: 8, q: "Càng kéo càng ngắn là cái gì?", options: ["Sợi dây", "Điếu thuốc", "Sợi tóc", "Sợi chun"], correct: 1 },
      { id: 9, q: "Bỏ ngoài nướng trong, ăn ngoài bỏ trong?", options: ["Củ khoai", "Bắp ngô", "Quả trứng", "Con cá"], correct: 1 },
      { id: 10, q: "Có một đàn vịt, 2 con đi trước, 2 con đi sau, 2 con đi giữa. Hỏi có mấy con?", options: ["2", "4", "6", "8"], correct: 1 },
    ]
  },
  {
    id: "g8", title: "Họa sĩ tương lai", grade: "Tiểu học", subject: "Mỹ thuật", level: "Dễ",
    icon: <Palette size={20} />, color: "text-pink-500", bg: "bg-pink-50",
    questions: [
      { id: 1, q: "Màu nào là màu nóng?", options: ["Xanh dương", "Đỏ", "Xanh lá", "Tím"], correct: 1 },
      { id: 2, q: "Pha màu Đỏ với Vàng sẽ ra màu gì?", options: ["Xanh", "Tím", "Cam", "Nâu"], correct: 2 },
      { id: 3, q: "Hình tròn có mấy góc?", options: ["0", "1", "4", "Vô số"], correct: 0 },
      { id: 4, q: "Họa sĩ vẽ chân dung là vẽ gì?", options: ["Phong cảnh", "Con vật", "Khuôn mặt", "Nhà cửa"], correct: 2 },
      { id: 5, q: "Màu nào là màu cơ bản?", options: ["Xanh lá", "Cam", "Vàng", "Tím"], correct: 2 },
      { id: 6, q: "Bố cục trong tranh là gì?", options: ["Màu sắc", "Sự sắp xếp", "Khung tranh", "Giấy vẽ"], correct: 1 },
      { id: 7, q: "Chì 2B dùng để làm gì?", options: ["Tô màu", "Phác thảo", "Xóa", "Gọt"], correct: 1 },
      { id: 8, q: "Độ đậm nhạt giúp tranh trông thế nào?", options: ["Phẳng", "Khối 3D", "Xấu hơn", "Nhòe đi"], correct: 1 },
      { id: 9, q: "Làng tranh dân đông hồ nổi tiếng ở tỉnh nào?", options: ["Bắc Ninh", "Hà Nội", "Huế", "Nam Định"], correct: 0 },
      { id: 10, q: "Màu lạnh gồm những màu nào?", options: ["Đỏ, Vàng", "Xanh lam, Xanh lá", "Cam, Hồng", "Đen, Trắng"], correct: 1 },
    ]
  },
  {
    id: "g9", title: "Giai điệu học đường", grade: "Tổng hợp", subject: "Âm nhạc", level: "Cơ bản",
    icon: <Music size={20} />, color: "text-indigo-500", bg: "bg-indigo-50",
    questions: [
      { id: 1, q: "Nốt nhạc nào thấp nhất trong hàng âm?", options: ["Rê", "Mi", "Đô", "La"], correct: 2 },
      { id: 2, q: "Đồ - Rê - Mi - ...? Nốt tiếp theo là?", options: ["Son", "Pha", "La", "Si"], correct: 1 },
      { id: 3, q: "Nhạc sĩ Văn Cao sáng tác bài hát nào?", options: ["Tiến quân ca", "Như có Bác Hồ", "Đi học", "Bụi phấn"], correct: 0 },
      { id: 4, q: "Đàn Piano có bao nhiêu phím đen trắng?", options: ["66", "77", "88", "99"], correct: 2 },
      { id: 5, q: "Dấu lặng dùng để làm gì?", options: ["Hát to hơn", "Nghỉ không hát", "Hát nhanh", "Hát chậm"], correct: 1 },
      { id: 6, q: "Sáo trúc thuộc nhóm nhạc cụ nào?", options: ["Gõ", "Dây", "Hơi", "Phím"], correct: 2 },
      { id: 7, q: "Khuông nhạc gồm mấy dòng kẻ?", options: ["4", "5", "6", "3"], correct: 1 },
      { id: 8, q: "Nốt Trắng có độ dài bằng mấy nốt Đen?", options: ["1", "2", "3", "4"], correct: 1 },
      { id: 9, q: "Ai được mệnh danh là thần đồng âm nhạc thế giới?", options: ["Beethoven", "Mozart", "Bach", "Chopin"], correct: 1 },
      { id: 10, q: "Nhịp 2/4 có mấy phách trong một ô nhịp?", options: ["1", "2", "3", "4"], correct: 1 },
    ]
  },
  {
    id: "g10", title: "Kỹ năng số", grade: "Lớp 6-9", subject: "Tin học", level: "Thách thức",
    icon: <Zap size={20} />, color: "text-slate-600", bg: "bg-slate-100",
    questions: [
      { id: 1, q: "Phím tắt để Copy là?", options: ["Ctrl+V", "Ctrl+C", "Ctrl+X", "Ctrl+Z"], correct: 1 },
      { id: 2, q: "Excel dùng để làm gì?", options: ["Soạn văn bản", "Bảng tính", "Trình chiếu", "Vẽ"], correct: 1 },
      { id: 3, q: "RAM là bộ nhớ gì?", options: ["Trong", "Ngoài", "Chỉ đọc", "Tạm thời"], correct: 3 },
      { id: 4, q: "Chrome là một loại?", options: ["Hệ điều hành", "Trình duyệt web", "Phần cứng", "Virus"], correct: 1 },
      { id: 5, q: "1 Gigabyte (GB) bằng bao nhiêu MB?", options: ["100", "512", "1024", "1000"], correct: 2 },
      { id: 6, q: "Đuôi .docx là file của phần mềm nào?", options: ["Excel", "PowerPoint", "Word", "Notepad"], correct: 2 },
      { id: 7, q: "Để gõ chữ hoa ta nhấn giữ phím?", options: ["Alt", "Ctrl", "Shift", "Tab"], correct: 2 },
      { id: 8, q: "WWW viết tắt của từ gì?", options: ["World Wide Web", "World Wild West", "Web Wide World", "Không có"], correct: 0 },
      { id: 9, q: "Hệ điều hành Windows do hãng nào sản xuất?", options: ["Apple", "Google", "Microsoft", "Samsung"], correct: 2 },
      { id: 10, q: "Bộ não của máy tính là?", options: ["Chuột", "Màn hình", "CPU", "Bàn phím"], correct: 2 },
    ]
  }
];

const GameCenter = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleStartGame = (game: any) => {
    setSelectedGame(game);
    setIsPlaying(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswer = (idx: number) => {
    if (idx === selectedGame.questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
    }
    
    if (currentQuestion < selectedGame.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleExit = () => {
    setIsPlaying(false);
    setSelectedGame(null);
    setShowResult(false);
  };

  // --- MÀN HÌNH KẾT QUẢ ---
  if (showResult) {
    const isHighScore = score >= 80;
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 animate-in zoom-in-95">
        <div className="bg-white rounded-[2rem] p-10 shadow-2xl border-4 border-slate-50 text-center max-w-lg w-full relative">
          <button onClick={handleExit} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors">
             <Home size={24} />
          </button>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isHighScore ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
            <Trophy size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
            {isHighScore ? "Tuyệt vời Thầy/Cô ơi!" : "Hoàn thành thử thách"}
          </h2>
          <div className="text-5xl font-black text-blue-600 my-6">{score}/100</div>
          
          {isHighScore && (
            <div className="bg-emerald-50 p-4 rounded-xl mb-8 animate-bounce border border-emerald-100">
              <p className="text-emerald-700 font-bold text-sm italic">👏 Một tràng vỗ tay nồng nhiệt dành cho Thầy/Cô! 👏</p>
            </div>
          )}

          <button 
            onClick={handleExit}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Chơi trò khác
          </button>
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHƠI GAME ---
  if (isPlaying && selectedGame) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in">
        <div className="w-full max-w-2xl relative">
          <button onClick={handleExit} className="absolute -top-12 right-0 text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2 font-black text-[10px] uppercase">
             Thoát <Home size={18} />
          </button>
          <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${selectedGame.bg} ${selectedGame.color} rounded-lg flex items-center justify-center`}>
                  {selectedGame.icon}
                </div>
                <div>
                   <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-tighter">{selectedGame.title}</h3>
                   <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${(currentQuestion + 1) * 10}%` }}></div>
                   </div>
                </div>
             </div>
             <div className="text-right">
                <p className="text-lg font-black text-slate-800">{currentQuestion + 1}<span className="text-slate-300 text-xs">/10</span></p>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50 text-center">
            <h2 className="text-xl font-black text-slate-800 mb-8 leading-tight h-24 flex items-center justify-center px-4">
              {selectedGame.questions[currentQuestion].q}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {selectedGame.questions[currentQuestion].options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="p-4 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-xl font-bold transition-all text-left flex items-center gap-4 group"
                >
                  <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">{String.fromCharCode(65 + idx)}</span>
                  <span className="text-slate-700 text-sm">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SẢNH CHỜ (DANH SÁCH 10 TRÒ CHƠI) ---
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Gamepad2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Trung tâm trò chơi</h1>
               <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">10 GAMES</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">Hệ thống thử thách trí tuệ chuẩn Bộ GD&ĐT</p>
          </div>
        </div>
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase transition-all shadow-sm">
           <Home size={16} /> Trang chủ
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-10">
        {gameCards.map((game) => (
          <div key={game.id} className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between h-[220px]">
            <div>
              <div className={`w-10 h-10 ${game.bg} ${game.color} rounded-xl flex items-center justify-center mb-4`}>
                {game.icon}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[7px] font-black text-blue-500 uppercase">{game.grade}</span>
                <span className="text-[7px] font-black text-slate-300 uppercase">{game.level}</span>
              </div>
              <h3 className="text-[11px] font-black text-slate-800 uppercase leading-tight mb-4 group-hover:text-blue-600 transition-colors h-8 line-clamp-2">{game.title}</h3>
            </div>
            
            <button 
              onClick={() => handleStartGame(game)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Play size={10} fill="currentColor" /> Bắt đầu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCenter;