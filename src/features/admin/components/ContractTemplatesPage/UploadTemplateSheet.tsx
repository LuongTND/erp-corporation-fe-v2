import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, FileText } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadTemplateSchema, type UploadTemplateFormValues } from '../../schemas/contract-template.schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: UploadTemplateFormValues, file: File) => Promise<void>
  isPending: boolean
}

export function UploadTemplateSheet({ open, onOpenChange, onSubmit, isPending }: Props) {
  const form = useForm<UploadTemplateFormValues>({ resolver: zodResolver(uploadTemplateSchema) })
  const watchedFile = form.watch('file')

  async function handleSubmit(values: UploadTemplateFormValues) {
    const file = values.file?.[0] as File | undefined
    if (!file) return
    await onSubmit(values, file)
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right animation-duration-300 ease-out"
      >
        <SheetHeader>
          <SheetTitle>Tải lên mẫu hợp đồng</SheetTitle>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 px-4 py-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-name">Tên mẫu <span className="text-destructive">*</span></Label>
            <Input id="template-name" placeholder="VD: Hợp đồng chính thức 2026" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-desc">Mô tả</Label>
            <Textarea id="template-desc" rows={2} placeholder="Mô tả ngắn..." {...form.register('description')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-file">File mẫu (.docx) <span className="text-destructive">*</span></Label>
            <label
              htmlFor="template-file"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border cursor-pointer py-6 hover:border-primary/50 hover:bg-muted/30 transition-colors duration-200"
            >
              {watchedFile?.[0]?.name ? (
                <>
                  <FileText className="h-8 w-8 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{watchedFile[0].name}</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">Chọn file .docx</span>
                </>
              )}
              <input
                id="template-file"
                type="file"
                accept=".docx"
                className="hidden"
                {...form.register('file')}
              />
            </label>
            {form.formState.errors.file && (
              <p className="text-xs text-destructive">{form.formState.errors.file.message as string}</p>
            )}
          </div>
        </form>

        <SheetFooter className="px-4 pb-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">
            Huỷ
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isPending} className="cursor-pointer">
            {isPending ? 'Đang tải...' : 'Tải lên'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
