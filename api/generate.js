import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.status(200).json({
      result: response.text()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini error" });
  }
}