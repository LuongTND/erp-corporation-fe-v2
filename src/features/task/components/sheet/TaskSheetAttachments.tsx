import { useEffect, useRef, useState } from 'react'
import { File, FileImage, FileText, Paperclip, Trash2, Upload } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { TaskAttachment } from '../../types/task.types'
import { taskAttachmentService } from '../../mocks/task.mock'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('image/')) return <FileImage className="h-4 w-4" style={{ color: '#6366f1' }} />
  if (mimeType === 'application/pdf') return <FileText className="h-4 w-4" style={{ color: '#ef4444' }} />
  return <File className="h-4 w-4" style={{ color: C.muted }} />
}

interface Props {
  taskId: string
}

export function TaskSheetAttachments({ taskId }: Props) {
  const [attachments, setAttachments] = useState<TaskAttachment[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!taskId) return
    taskAttachmentService.getByTaskId(taskId).then(setAttachments)
  }, [taskId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const uploaded = await Promise.all(files.map((f) => taskAttachmentService.upload(taskId, f)))
      setAttachments((prev) => [...prev, ...uploaded])
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    await taskAttachmentService.delete(id)
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: C.muted }}>
          Tệp đính kèm{attachments.length > 0 ? ` (${attachments.length})` : ''}
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors duration-[120ms]"
          style={{ color: C.accent }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <Upload className="h-3 w-3" />
          {uploading ? 'Đang tải...' : 'Tải lên'}
        </button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
      </div>

      {attachments.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-1.5 py-5 rounded-lg border border-dashed cursor-pointer transition-colors duration-[120ms]"
          style={{ borderColor: C.border, color: C.muted }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <Paperclip className="h-5 w-5" style={{ color: C.border }} />
          <span className="text-[12px]">Kéo thả hoặc click để tải file</span>
        </button>
      ) : (
        <div className="flex flex-col gap-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg group transition-colors duration-[120ms]"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              {att.mimeType.startsWith('image/') ? (
                <img
                  src={att.dataUrl}
                  alt={att.name}
                  className="w-8 h-8 rounded object-cover shrink-0"
                  style={{ border: `0.5px solid ${C.border}` }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: C.bgHover, border: `0.5px solid ${C.border}` }}
                >
                  <FileTypeIcon mimeType={att.mimeType} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <a
                  href={att.dataUrl}
                  download={att.name}
                  className="text-[12px] font-medium truncate block cursor-pointer hover:underline"
                  style={{ color: C.text }}
                >
                  {att.name}
                </a>
                <p className="text-[11px]" style={{ color: C.muted }}>
                  {formatBytes(att.size)} · {format(parseISO(att.uploadedAt), 'dd/MM/yyyy')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(att.id)}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-all duration-[120ms]"
                style={{ color: C.muted }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.muted }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
