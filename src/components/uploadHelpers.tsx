import React, { useRef } from 'react'

export interface UploadButtonProps {
  label?: string
  accept?: string
  multiple?: boolean
  onFilesSelected?: (files: FileList) => void
  className?: string
}

/**
 * Nút upload chuẩn: mở hộp chọn file từ máy, trả về FileList qua callback.
 * Không tự upload lên server, không tự sinh dữ liệu.
 */
export const UploadButton: React.FC<UploadButtonProps> = ({
  label = 'Chọn file từ máy',
  accept,
  multiple,
  onFilesSelected,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected?.(e.target.files)
    }
  }

  return (
    <>
      <button
        type="button"
        className={
          className ||
          'rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
        }
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
    </>
  )
}

export interface DownloadButtonProps {
  label?: string
  href: string
  filename?: string
  className?: string
}

/**
 * Nút download chuẩn: tải file từ một URL (server / public), không giả lập dữ liệu.
 */
export const DownloadButton: React.FC<DownloadButtonProps> = ({
  label = 'Tải xuống',
  href,
  filename,
  className = '',
}) => {
  const handleClick = () => {
    const a = document.createElement('a')
    a.href = href
    if (filename) a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        'rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400'
      }
    >
      {label}
    </button>
  )
}

/**
 * Ví dụ component nhỏ hiển thị danh sách file đã chọn từ UploadButton.
 */
export const SelectedFilesList: React.FC<{ files: File[] }> = ({ files }) => {
  if (!files.length) return null
  return (
    <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
      {files.map((file, idx) => (
        <li key={idx} className="truncate">
          {file.name} ({Math.round(file.size / 1024)} KB)
        </li>
      ))}
    </ul>
  )
}