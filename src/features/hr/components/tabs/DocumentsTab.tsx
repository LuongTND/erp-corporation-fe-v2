import { useState } from 'react'
import { Download, Eye, FileText, UploadCloud } from 'lucide-react'
import type { DocumentFile } from '../../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const DOCUMENTS: DocumentFile[] = [
  { id: '1', name: 'Hợp đồng lao động.pdf',      uploadDate: '15/01/2022', fileSize: '1.2 MB',  fileType: 'pdf'   },
  { id: '2', name: 'Bản sao CCCD.jpg',            uploadDate: '15/01/2022', fileSize: '890 KB',  fileType: 'image' },
  { id: '3', name: 'Bằng tốt nghiệp.pdf',         uploadDate: '20/01/2022', fileSize: '2.4 MB',  fileType: 'pdf'   },
  { id: '4', name: 'Đánh giá thử việc Q1.pdf',    uploadDate: '20/04/2022', fileSize: '540 KB',  fileType: 'pdf'   },
  { id: '5', name: 'Đánh giá năm 2023.pdf',       uploadDate: '10/01/2024', fileSize: '1.8 MB',  fileType: 'pdf'   },
  { id: '6', name: 'Chứng chỉ đào tạo.pdf',       uploadDate: '15/06/2024', fileSize: '670 KB',  fileType: 'pdf'   },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function DocumentsTab() {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="space-y-6">
      {/* Upload dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50 hover:bg-card'
        }`}
      >
        <UploadCloud className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Kéo thả hoặc click để tải lên</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG tối đa 10 MB</p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-border text-foreground rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer"
        >
          Chọn tệp
        </button>
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="bg-card rounded-xl shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">
              {doc.name}
            </p>
            <p className="text-xs text-muted-foreground">{doc.uploadDate}</p>
            <p className="text-xs text-muted-foreground">{doc.fileSize}</p>
            <div className="flex items-center gap-3 mt-4 pt-3 w-full border-t border-border">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={`Xem trước ${doc.name}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Xem trước
              </button>
              <div className="w-px h-4 bg-border" />
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                aria-label={`Tải về ${doc.name}`}
              >
                <Download className="w-3.5 h-3.5" />
                Tải về
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
