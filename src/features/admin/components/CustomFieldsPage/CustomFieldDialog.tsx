import { useState, useEffect } from 'react'
import { useFieldArray, Controller } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { Plus, Trash2, GripVertical, ChevronDown, Pencil, Check, ChevronsUpDown } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useCustomFields } from '../../hooks/use-custom-fields'
import { FIELD_TYPE_LABELS, type CustomFieldType } from '../../types/admin.types'
import type { CustomFieldFormValues } from '../../schemas/custom-field.schema'

const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as CustomFieldType[]
const SELECT_TYPES: CustomFieldType[] = ['Select', 'MultiSelect']

const FIELD_TYPE_ICONS: Record<string, string> = {
  Text: 'Aa', Number: '123', Date: '📅', Select: '▾', MultiSelect: '☑', Checkbox: '✓', TextArea: '¶',
}

// Vietnamese-aware slugifier
const toCode = (s: string) =>
  s.replace(/[đĐ]/g, 'd')
   .normalize('NFD').replace(/[̀-ͯ]/g, '')
   .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

interface Props {
  open: boolean
  isEdit: boolean
  form: UseFormReturn<CustomFieldFormValues>
  onSubmit: (values: CustomFieldFormValues) => void
  onOpenChange: (v: boolean) => void
  isPending: boolean
}

function HelperText({ children }: { readonly children: React.ReactNode }) {
  return <p className="text-[10px] text-muted-foreground mt-1">{children}</p>
}

export function CustomFieldDialog({ open, isEdit, form, onSubmit, onOpenChange, isPending }: Props) {
  const { data: definitions = [] } = useCustomFields()
  const existingGroups = [...new Set(definitions.map(d => d.group).filter(Boolean))] as string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isDirty } } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'options' })
  const fieldType = watch('fieldType')
  const isRequired = watch('isRequired')
  const nameValue = watch('name')
  const needsOptions = SELECT_TYPES.includes(fieldType)

  const [showConfirm, setShowConfirm] = useState(false)
  const [codeUnlocked, setCodeUnlocked] = useState(false)
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false)

  // Auto-generate code from name (only on create, only while not manually unlocked)
  useEffect(() => {
    if (!isEdit && !codeUnlocked && nameValue) {
      setValue('code', toCode(nameValue), { shouldValidate: false, shouldDirty: false })
    }
  }, [nameValue, isEdit, codeUnlocked, setValue])

  // Reset unlock state when dialog opens/closes
  useEffect(() => {
    if (open) setCodeUnlocked(false)
  }, [open])

  const handleOpenChange = (v: boolean) => {
    if (!v && isDirty) { setShowConfirm(true); return }
    onOpenChange(v)
  }

  const handleConfirmClose = () => { setShowConfirm(false); onOpenChange(false) }

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden"
        onInteractOutside={e => { if (isDirty) e.preventDefault() }}
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? 'Chỉnh sửa trường' : 'Tạo trường tùy chỉnh'}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEdit
              ? 'Chỉnh sửa cấu hình cho trường này'
              : 'Định nghĩa trường dữ liệu mở rộng cho nhân viên'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-0 flex-1">
          <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">

            {/* Tên hiển thị + Vị trí */}
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tên hiển thị <span className="text-destructive">*</span></Label>
                <Input {...register('name')} placeholder="vd: Nhóm máu" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Vị trí</Label>
                <Input type="number" {...register('sortOrder')} className="text-center" />
                <HelperText>Nhỏ → trước</HelperText>
              </div>
            </div>

            {/* Mã định danh — auto-generated, lockable */}
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                Mã định danh <span className="text-destructive">*</span>
                {!isEdit && (
                  <span className="font-normal text-muted-foreground">
                    — tự động tạo từ tên
                  </span>
                )}
                {isEdit && (
                  <span className="font-normal text-muted-foreground">(không thể thay đổi)</span>
                )}
              </Label>
              <div className="flex gap-2">
                <Input
                  {...register('code')}
                  disabled={isEdit || !codeUnlocked}
                  placeholder="vd: blood_type"
                  className="font-mono text-sm flex-1"
                />
                {!isEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5 shrink-0"
                    onClick={() => setCodeUnlocked(v => !v)}
                    title={codeUnlocked ? 'Khóa lại (tự động)' : 'Chỉnh sửa thủ công'}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              <HelperText>Dùng để nhận dạng trong hệ thống. Không thể đổi sau khi tạo.</HelperText>
            </div>

            {/* Loại trường + Bắt buộc */}
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs">Loại trường <span className="text-destructive">*</span></Label>
                <Select
                  value={fieldType}
                  disabled={isEdit}
                  onValueChange={v => setValue('fieldType', v as CustomFieldType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" sideOffset={4}>
                    {FIELD_TYPES.map(t => (
                      <SelectItem key={t} value={t}>
                        <span className="font-mono text-xs text-muted-foreground mr-2 w-5 inline-block">
                          {FIELD_TYPE_ICONS[t]}
                        </span>
                        {FIELD_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bắt buộc toggle */}
              <div className="space-y-1.5">
                <Label className="text-xs">Bắt buộc nhập</Label>
                <button
                  type="button"
                  onClick={() => setValue('isRequired', !isRequired)}
                  className={`h-9 px-3 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                    isRequired
                      ? 'bg-destructive/10 border-destructive/40 text-destructive'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isRequired ? 'Bắt buộc' : 'Tuỳ chọn'}
                </button>
              </div>
            </div>

            {/* Nhóm hiển thị */}
            <div className="space-y-1.5">
              <Label className="text-xs">Nhóm hiển thị</Label>
              <Controller
                control={control}
                name="group"
                render={({ field }) => {
                  const filtered = existingGroups.filter(g =>
                    g.toLowerCase().includes((field.value ?? '').toLowerCase())
                  )
                  return (
                    <Popover open={groupPopoverOpen && existingGroups.length > 0} onOpenChange={setGroupPopoverOpen}>
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <Input
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            onFocus={() => setGroupPopoverOpen(true)}
                            placeholder="vd: Thông tin cá nhân"
                            className={cn('w-full', existingGroups.length > 0 && 'pr-7')}
                          />
                          {existingGroups.length > 0 && (
                            <ChevronsUpDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0"
                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <Command>
                          <CommandList>
                            {filtered.length === 0
                              ? <CommandEmpty>Nhập để tạo nhóm mới</CommandEmpty>
                              : (
                                <CommandGroup>
                                  {filtered.map(g => (
                                    <CommandItem
                                      key={g}
                                      value={g}
                                      onSelect={() => { field.onChange(g); setGroupPopoverOpen(false) }}
                                    >
                                      <Check className={cn('mr-2 h-4 w-4', field.value === g ? 'opacity-100' : 'opacity-0')} />
                                      {g}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )
                            }
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )
                }}
              />
              <HelperText>Gộp các trường liên quan vào cùng một mục trên form</HelperText>
            </div>

            {/* ── Danh sách lựa chọn (chỉ Select/MultiSelect) ── */}
            {needsOptions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Danh sách lựa chọn
                  </p>
                  <Button
                    type="button" variant="outline" size="sm"
                    className="h-6 gap-1 text-xs px-2"
                    onClick={() => append({ value: '', label: '', sortOrder: fields.length, isActive: true })}
                  >
                    <Plus className="h-3 w-3" /> Thêm
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                  {fields.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-3">
                      Chưa có lựa chọn — nhấn Thêm để bắt đầu
                    </p>
                  )}
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 cursor-grab" aria-hidden />
                      <Input
                        {...register(`options.${idx}.value`)}
                        placeholder="key"
                        className="h-7 text-xs flex-1 font-mono"
                      />
                      <Input
                        {...register(`options.${idx}.label`)}
                        placeholder="Nhãn hiển thị"
                        className="h-7 text-xs flex-[2]"
                      />
                      <Button
                        type="button" variant="ghost" size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => remove(idx)}
                        aria-label="Xóa lựa chọn"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Nâng cao (collapsible) ── */}
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between group cursor-pointer">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Nâng cao
                </p>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Gợi ý nhập liệu</Label>
                  <Input {...register('placeholder')} placeholder="vd: Nhập nhóm máu của bạn..." />
                  <HelperText>Hiện bên trong ô nhập khi chưa có dữ liệu</HelperText>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mô tả</Label>
                  <Textarea {...register('helpText')} rows={2} placeholder="Mô tả ngắn về trường này" className="resize-none text-sm" />
                  <HelperText>Hiện bên dưới ô nhập để hướng dẫn người dùng</HelperText>
                </div>
              </CollapsibleContent>
            </Collapsible>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 shrink-0">
            <Button type="button" variant="outline" className="min-w-[80px]" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="min-w-[100px]" disabled={isPending}>
              {isPending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo trường'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Bỏ thay đổi?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Dữ liệu bạn đã nhập sẽ không được lưu.</p>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={handleConfirmClose}>Bỏ thay đổi</Button>
          <Button onClick={() => setShowConfirm(false)}>Tiếp tục chỉnh sửa</Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
