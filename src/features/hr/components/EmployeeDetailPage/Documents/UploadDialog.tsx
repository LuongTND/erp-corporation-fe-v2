import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { DatePickerField } from '../DatePickerField'
import { DOCUMENT_CATEGORIES, type UploadDocumentPayload } from '../../../types/employee-document.types'

interface Props {
  open: boolean
  onClose: () => void
  onUpload: (payload: UploadDocumentPayload, callbacks: { onSuccess: () => void }) => void
  isUploading: boolean
}

export function UploadDialog({ open, onClose, onUpload, isUploading }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [customName, setCustomName] = useState('')
  const [issuedDate, setIssuedDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [notes, setNotes] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setFile(null)
    setCategory('')
    setCustomName('')
    setIssuedDate('')
    setExpiryDate('')
    setNotes('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = () => {
    if (!file || !category) return
    onUpload(
      { file, category, customName: customName || undefined, issuedDate: issuedDate || undefined, expiryDate: expiryDate || undefined, notes: notes || undefined },
      { onSuccess: handleClose },
    )
  }

  const catMeta = DOCUMENT_CATEGORIES.find((c) => c.value === category)

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Loại tài liệu *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Chọn loại..." /></SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tên hiển thị (tùy chọn)</Label>
            <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Để trống = dùng tên loại" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ngày cấp</Label>
              <DatePickerField value={issuedDate} onChange={setIssuedDate} fromYear={1990} toYear={new Date().getFullYear()} />
            </div>
            {catMeta?.hasExpiry && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ngày hết hạn</Label>
                <DatePickerField value={expiryDate} onChange={setExpiryDate} fromYear={new Date().getFullYear()} toYear={new Date().getFullYear() + 30} />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Ghi chú</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ghi chú thêm..." />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tệp *</Label>
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              {file ? (
                <p className="text-sm font-medium text-foreground">{file.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Nhấn để chọn tệp</p>
              )}
              <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={!file || !category || isUploading}>
            {isUploading ? 'Đang tải...' : 'Tải lên'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
