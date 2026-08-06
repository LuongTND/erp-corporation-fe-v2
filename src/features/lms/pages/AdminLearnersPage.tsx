import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LearnerTable } from '../components/admin-learners/LearnerTable'
import { LearnerDetailSheet } from '../components/admin-learners/LearnerDetailSheet'
import { MOCK_LEARNERS, MOCK_LEARNER_ENROLLMENTS } from '../mocks/learners.mock'
import type { Learner, LearnerStatus } from '../types/admin.types'

type StatusFilter = 'all' | LearnerStatus
type RoleFilter = 'all' | 'internal' | 'customer'

export default function AdminLearnersPage() {
  const [learners] = useState<Learner[]>(MOCK_LEARNERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = learners.filter((learner) => {
    const matchesSearch =
      !search.trim() ||
      learner.name.toLowerCase().includes(search.toLowerCase()) ||
      learner.email.toLowerCase().includes(search.toLowerCase()) ||
      learner.department.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || learner.status === statusFilter
    const matchesRole = roleFilter === 'all' || learner.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleViewDetail = (learner: Learner) => {
    setSelectedLearner(learner)
    setSheetOpen(true)
  }

  const handleDelete = (learnerId: string) => {
    // In production this would call a mutation; mock just closes the sheet if needed
    console.error('Delete learner not implemented for mock', learnerId)
  }

  const enrollments = selectedLearner
    ? (MOCK_LEARNER_ENROLLMENTS[selectedLearner.id] ?? [])
    : []

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
    <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
      {/* Page header */}
      <div className="shrink-0">
        <h1 className="text-xl font-semibold text-foreground">Quản lý Học viên</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {learners.length} học viên · {filtered.length} hiển thị
        </p>
      </div>

      {/* Filter bar */}
      <div className="shrink-0 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="learner-search"
            aria-label="Tìm kiếm học viên"
            placeholder="Tìm tên, email, phòng ban..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-72 pl-9 text-sm"
          />
        </div>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-44 text-sm" aria-label="Lọc theo trạng thái">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="suspended">Đã khoá</SelectItem>
          </SelectContent>
        </Select>

        {/* Role filter */}
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as RoleFilter)}
        >
          <SelectTrigger className="w-40 text-sm" aria-label="Lọc theo loại">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="internal">Nội bộ</SelectItem>
            <SelectItem value="customer">Khách hàng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Learner table */}
      <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
        <LearnerTable
          learners={filtered}
          onViewDetail={handleViewDetail}
          onDelete={handleDelete}
        />
      </div>

      {/* Learner detail sheet */}
      <LearnerDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        learner={selectedLearner}
        enrollments={enrollments}
      />
    </div>
    </div>
  )
}
