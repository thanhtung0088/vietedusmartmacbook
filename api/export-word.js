import { Document, Packer, Paragraph, TextRun } from "docx";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "No content provided" });
    }

    // Tách nội dung thành từng dòng
    const lines = content.split("\n");

    const paragraphs = lines.map((line) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 26, // ~13pt
            font: "Times New Roman",
          }),
        ],
        spacing: {
          after: 200,
        },
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ke-hoach-bai-day.docx"
    );

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tạo file Word" });
  }
}