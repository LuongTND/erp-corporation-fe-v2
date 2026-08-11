import { Edit2, Lock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { FIELD_TYPE_LABELS, type CustomFieldDefinitionResponse } from '../../types/admin.types'
const FIELD_TYPE_BADGE: Record<string, string> = {
  Text:        'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  Number:      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  Date:        'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300',
  Select:      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
  MultiSelect: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
  Checkbox:    'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
  TextArea:    'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
}

const COL_SPAN = 7

interface CustomFieldTableProps {
  definitions: CustomFieldDefinitionResponse[]
  isLoading: boolean
  onEdit: (def: CustomFieldDefinitionResponse) => void
  onDelete: (def: CustomFieldDefinitionResponse) => void
}

function groupAndSort(definitions: CustomFieldDefinitionResponse[]) {
  const sorted = [...definitions].sort((a, b) => {
    const ga = a.group ?? '', gb = b.group ?? ''
    if (ga !== gb) return ga.localeCompare(gb, 'vi')
    return a.sortOrder - b.sortOrder
  })
  const map = new Map<string, CustomFieldDefinitionResponse[]>()
  for (const def of sorted) {
    const key = def.group ?? ''
    const bucket = map.get(key) ?? []
    bucket.push(def)
    map.set(key, bucket)
  }
  return map
}

export function CustomFieldTable({ definitions, isLoading, onEdit, onDelete }: CustomFieldTableProps) {
  const groups = groupAndSort(definitions)

  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Tên trường</TableHead>
            <TableHead>Mã</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Bắt buộc</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[80px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: COL_SPAN }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : definitions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COL_SPAN} className="text-center py-16 text-muted-foreground text-sm">
                Chưa có trường tùy chỉnh nào
              </TableCell>
            </TableRow>
          ) : (
            Array.from(groups.entries()).map(([group, defs]) => (
              <>
                <TableRow key={`group-${group}`} className="bg-muted/40 hover:bg-muted/40">
                  <TableCell colSpan={COL_SPAN} className="py-1.5 px-4">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {group || 'Chưa phân nhóm'}
                    </span>
                  </TableCell>
                </TableRow>
                {defs.map((def) => (
                  <TableRow key={def.id} className="group">
                    <TableCell className="text-muted-foreground text-xs tabular-nums">{def.sortOrder}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm">{def.name}</span>
                        {def.isSystem && (
                          <Lock className="h-3 w-3 text-muted-foreground shrink-0" aria-label="Trường hệ thống" />
                        )}
                      </div>
                      {def.helpText && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] truncate">{def.helpText}</p>
                      )}
                    </TableCell>

                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{def.code}</code>
                    </TableCell>

                    <TableCell>
                      <Badge className={`text-xs ${FIELD_TYPE_BADGE[def.fieldType] ?? ''}`}>
                        {FIELD_TYPE_LABELS[def.fieldType]}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {def.isRequired ? (
                        <Badge className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300">Bắt buộc</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Tùy chọn</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {def.isActive ? (
                        <Badge className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300">Hoạt động</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Tắt</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost" size="sm" className="h-7 w-7 p-0"
                          onClick={() => onEdit(def)}
                          aria-label={`Sửa ${def.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        {!def.isSystem && (
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => onDelete(def)}
                            aria-label={`Xóa ${def.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
