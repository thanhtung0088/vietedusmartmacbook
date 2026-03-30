const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Menu config mô phỏng đúng schema MenuConfigFile
const menuConfig = require('./src/menu.config.json')

app.get('/api/menus', (_req, res) => {
  res.json(menuConfig)
})

app.post('/api/ai/generate', async (req, res) => {
  const { role, menu_id, function_id, input_data } = req.body || {}
  if (!role || !menu_id || !function_id) {
    return res.status(400).json({ status: 'error', error: 'Thiếu role, menu_id hoặc function_id' })
  }

  // Nếu KHÔNG có GOOGLE_API_KEY trong env thì trả mock an toàn
  if (!process.env.GOOGLE_API_KEY) {
    return res.json({
      status: 'success',
      data: {
        content: `Mô phỏng AI: role=${role}, menu=${menu_id}, function=${function_id}.\nDữ liệu vào: ${JSON.stringify(
          input_data ?? {},
        )}`,
        format: 'text',
        suggested_exports: ['docx', 'pdf'],
      },
    })
  }

  // Ví dụ tích hợp Gemini Flash 2.5 phía backend (ẩn KEY trong env, không lộ cho FE)
  try {
    const apiKey = process.env.GOOGLE_API_KEY
    const prompt = `Vai trò: ${role}, menu: ${menu_id}, chức năng: ${function_id}.\nDữ liệu đầu vào: ${JSON.stringify(
      input_data ?? {},
    )}`

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      },
    )

    if (!geminiRes.ok) {
      const text = await geminiRes.text()
      console.error('Gemini error', text)
      return res.status(500).json({ status: 'error', error: 'Gemini API lỗi' })
    }

    const data = await geminiRes.json()
    const content =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') ||
      'Không có nội dung từ Gemini.'

    return res.json({
      status: 'success',
      data: {
        content,
        format: 'text',
        suggested_exports: ['docx', 'pdf'],
      },
    })
  } catch (e) {
    console.error('Gemini exception', e)
    return res.status(500).json({ status: 'error', error: 'Lỗi kết nối Gemini' })
  }
})

app.post('/api/workflow/approve', (req, res) => {
  const { document_id, action, comment } = req.body || {}
  if (!document_id || !action) {
    return res.status(400).json({ message: 'Thiếu document_id hoặc action' })
  }
  res.json({
    document_id,
    action,
    comment: comment ?? '',
    approved_at: new Date().toISOString(),
  })
})

const port = 5174
app.listen(port, () => {
  console.log(`Mock backend chạy tại http://localhost:${port}`)
})