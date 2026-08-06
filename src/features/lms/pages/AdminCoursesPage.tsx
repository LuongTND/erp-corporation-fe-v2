import { useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CourseTable } from '../components/admin-courses/CourseTable'
import { CourseFormModal } from '../components/admin-courses/CourseFormModal'
import { MOCK_ADMIN_COURSES } from '../mocks/admin-courses.mock'
import type { AdminCourse, CourseStatus } from '../types/admin.types'
import type { CourseSchema } from '../schemas/course.schema'

type StatusFilter = 'all' | CourseStatus
type TypeFilter = 'all' | 'internal' | 'customer'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'draft', label: 'Nháp' },
  { value: 'archived', label: 'Đã lưu trữ' },
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>(MOCK_ADMIN_COURSES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null)

  const filtered = courses.filter((course) => {
    const matchesSearch =
      !search.trim() ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'internal' && course.isInternal) ||
      (typeFilter === 'customer' && !course.isInternal)
    return matchesSearch && matchesStatus && matchesType
  })

  const handleEdit = (course: AdminCourse) => {
    setEditingCourse(course)
    setModalOpen(true)
  }

  const handleDelete = (courseId: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId))
  }

  const handleSubmit = (data: CourseSchema) => {
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id
            ? {
                ...course,
                title: data.title,
                category: data.category,
                instructor: data.instructor,
                duration: data.duration,
                isInternal: data.isInternal,
                status: data.status,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : course
        )
      )
    } else {
      const newCourse: AdminCourse = {
        id: `c-${Date.now()}`,
        title: data.title,
        category: data.category,
        instructor: data.instructor,
        duration: data.duration,
        status: data.status,
        enrolledCount: 0,
        completionRate: 0,
        totalLessons: 0,
        isInternal: data.isInternal,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      }
      setCourses((prev) => [newCourse, ...prev])
    }
    setEditingCourse(null)
  }

  const openCreateModal = () => {
    setEditingCourse(null)
    setModalOpen(true)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
    <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
      {/* Page header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Quản lý Khoá học</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {courses.length} khoá học · {filtered.length} hiển thị
          </p>
        </div>
        <Button className="gap-1.5" onClick={openCreateModal} id="create-course-btn">
          <Plus className="h-4 w-4" aria-hidden />
          Tạo khoá học
        </Button>
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
            id="course-search"
            aria-label="Tìm kiếm khoá học"
            placeholder="Tìm khoá học hoặc giảng viên..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64 pl-9 text-sm"
          />
        </div>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-44 text-sm" aria-label="Lọc theo trạng thái">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type filter badges */}
        <div className="flex items-center gap-1.5 rounded-md border border-border p-1">
          {(['all', 'internal', 'customer'] as TypeFilter[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className="rounded px-2.5 py-1 text-xs font-medium transition-colors"
            >
              <Badge
                variant={typeFilter === type ? 'default' : 'ghost'}
                className="cursor-pointer text-xs"
              >
                {type === 'all' ? 'Tất cả' : type === 'internal' ? 'Nội bộ' : 'Khách hàng'}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Course table */}
      <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
        <CourseTable courses={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Create / Edit modal */}
      <CourseFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingCourse(null)
        }}
        editingCourse={editingCourse}
        onSubmit={handleSubmit}
      />
    </div>
    </div>
  )
}
