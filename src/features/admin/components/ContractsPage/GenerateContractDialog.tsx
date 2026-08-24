import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { EmploymentContractResponse, ContractTemplateResponse, FormSchemaField } from '../../types/admin.types'

interface Props {
  contract: EmploymentContractResponse | null
  templates: ContractTemplateResponse[]
  onOpenChange: (open: boolean) => void
  onGenerate: (contractId: string, dynamicData: Record<string, string>) => Promise<void>
  isPending: boolean
}

export function GenerateContractDialog({ contract, templates, onOpenChange, onGenerate, isPending }: Props) {
  const template = templates.find((t) => t.id === contract?.templateId)
  const fields: FormSchemaField[] = template
    ? (() => { try { return JSON.parse(template.formSchema ?? '[]') } catch { return [] } })()
    : []

  const [values, setValues] = useState<Record<string, string>>({})

  function handleChange(field: string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!contract) return
    await onGenerate(contract.id, values)
    setValues({})
    onOpenChange(false)
  }

  const allRequiredFilled = fields
    .filter((field) => field.required)
    .every((field) => values[field.field]?.trim())

  return (
    <Dialog open={!!contract} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-4 w-4" aria-hidden="true" />
            Tạo file hợp đồng — {contract?.contractNumber}
          </DialogTitle>
        </DialogHeader>

        {!template ? (
          <p className="text-sm text-muted-foreground py-4">
            Hợp đồng này chưa gắn mẫu template. Không thể tạo file tự động.
          </p>
        ) : (
          <div className="py-2 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-xs text-muted-foreground">
              Mẫu: <strong>{template.name}</strong> — điền các thông tin để trộn vào file Word.
            </p>
            {fields.map((field) => (
              <div key={field.field} className="flex flex-col gap-1.5">
                <Label htmlFor={`field-${field.field}`}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  id={`field-${field.field}`}
                  type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                  value={values[field.field] ?? ''}
                  onChange={(event) => handleChange(field.field, event.target.value)}
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !template || !allRequiredFilled}
            className="cursor-pointer"
          >
            {isPending ? 'Đang tạo...' : 'Tạo file'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
