import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// =============================
// KHỞI TẠO GEMINI
// =============================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =============================
// API TEST
// =============================
app.get("/", (req, res) => {
  res.send("Gemini AI Server đang chạy 🚀");
});

// =============================
// API SOẠN NỘI DUNG AI (TEXT)
// =============================
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ result: text });

  } catch (error) {
    console.error("Lỗi generate:", error);
    res.status(500).json({ error: "Lỗi khi tạo nội dung AI" });
  }
});

// =============================
// API TẠO HÌNH ẢNH AI (IMAGE)
// =============================
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Tạo hình minh họa giáo dục cho slide PowerPoint.

Chủ đề:
${prompt}

Yêu cầu:
- Phong cách hiện đại
- Màu sắc hài hòa
- Phù hợp học sinh Việt Nam
- Bố cục rõ ràng
- Tỷ lệ 16:9
`
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["IMAGE"]
      }
    });

    const imagePart =
      result.response.candidates[0].content.parts.find(
        (part) => part.inlineData
      );

    if (!imagePart) {
      return res.status(500).json({
        error: "Không nhận được dữ liệu ảnh từ Gemini"
      });
    }

    const base64Image = imagePart.inlineData.data;

    res.json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {
    console.error("Lỗi generate-image:", error);
    res.status(500).json({ error: "Lỗi khi tạo hình ảnh AI" });
  }
});

// =============================
// CHẠY SERVER
// =============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Gemini AI Server chạy tại http://localhost:${PORT}`);
});