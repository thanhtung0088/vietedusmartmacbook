export type FunctionId =
  | 'smart_gradebook.nhan_xet_ai'
  | 'homeroom.danh_gia_hs'
  | 'game_center.game'
  | 'ai_lesson.khbd_5512'
  | 'ai_lesson.ppt_lesson'
  | 'ai_lesson.exam_7991'
  | 'ai_lesson.revision_outline'
  | 'ai_lesson.interactive_game'
  | 'chi_bo.CB_01'
  | 'chi_bo.CB_02'
  | 'chi_bo.CB_04'

export interface SchemaField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  description?: string
}

export interface AiFunctionSchema {
  id: FunctionId
  menu_id: string
  description: string
  input_fields: SchemaField[]
}

export const aiSchemas: AiFunctionSchema[] = [
  {
    id: 'smart_gradebook.nhan_xet_ai',
    menu_id: 'smart_gradebook',
    description: 'Nhận xét AI toàn lớp theo sổ điểm',
    input_fields: [
      { name: 'grade', type: 'string', required: false },
      { name: 'class_name', type: 'string', required: false },
      { name: 'term', type: 'string', required: false },
      { name: 'subject', type: 'string', required: false },
      { name: 'students', type: 'array', required: true, description: 'Danh sách học sinh với điểm thô' },
    ],
  },
  {
    id: 'homeroom.danh_gia_hs',
    menu_id: 'homeroom',
    description: 'Nhận xét học sinh theo hồ sơ chủ nhiệm',
    input_fields: [
      { name: 'class_name', type: 'string', required: false },
      { name: 'term', type: 'string', required: false },
      { name: 'students', type: 'array', required: false, description: 'Danh sách học sinh với mức học lực, hạnh kiểm' },
    ],
  },
  {
    id: 'game_center.game',
    menu_id: 'game_center',
    description: 'Sinh câu hỏi trò chơi theo môn và khối',
    input_fields: [
      { name: 'subject', type: 'string', required: true },
      { name: 'grade', type: 'string', required: true },
      { name: 'num_questions', type: 'number', required: false },
    ],
  },
  {
    id: 'ai_lesson.khbd_5512',
    menu_id: 'ai_lesson',
    description: 'Soạn KHBD theo CV 5512',
    input_fields: [
      { name: 'grade', type: 'number', required: true },
      { name: 'subject', type: 'string', required: true },
      { name: 'periods', type: 'number', required: true },
      { name: 'student_type', type: 'string', required: true },
    ],
  },
  // Các flow ai_lesson khác có thể khai báo tương tự...
  {
    id: 'chi_bo.CB_01',
    menu_id: 'chi_bo',
    description: 'Soạn biên bản sinh hoạt Chi bộ',
    input_fields: [
      { name: 'thoi_gian', type: 'string', required: false },
      { name: 'dia_diem', type: 'string', required: false },
      { name: 'noi_dung', type: 'array', required: false },
    ],
  },
  {
    id: 'chi_bo.CB_02',
    menu_id: 'chi_bo',
    description: 'Soạn nghị quyết Chi bộ',
    input_fields: [
      { name: 'can_cu', type: 'array', required: false },
      { name: 'muc_tieu', type: 'array', required: false },
    ],
  },
  {
    id: 'chi_bo.CB_04',
    menu_id: 'chi_bo',
    description: 'Báo cáo định kỳ Chi bộ',
    input_fields: [
      { name: 'report_type', type: 'string', required: false },
    ],
  },
]

export const getSchemaById = (id: FunctionId): AiFunctionSchema | undefined =>
  aiSchemas.find((s) => s.id === id)