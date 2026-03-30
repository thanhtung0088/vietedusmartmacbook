import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
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

    res.status(200).json({
      image: `data:image/png;base64,${imagePart.inlineData.data}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image error" });
  }
}