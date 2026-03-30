export interface AiGenerateRequest {
  user_id: string
  role: string
  menu_id: string
  function_id: string
  input_data: Record<string, unknown>
}

export interface AiGenerateResponse {
  status: 'success' | 'error'
  data?: {
    content: string
    format?: string
    suggested_exports?: string[]
  }
  error?: string
}

const API_BASE = '/api'

export async function callAiGenerate(req: AiGenerateRequest): Promise<AiGenerateResponse> {
  try {
    const res = await fetch(`${API_BASE}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    })
    if (!res.ok) {
      return { status: 'error', error: `HTTP ${res.status}` }
    }
    return (await res.json()) as AiGenerateResponse
  } catch (e) {
    return { status: 'error', error: e instanceof Error ? e.message : 'Network error' }
  }
}