import { useState } from 'react'
import { Search, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VideoTable } from '../components/admin-videos/VideoTable'
import { VideoUploadModal } from '../components/admin-videos/VideoUploadModal'
import { MOCK_VIDEO_ASSETS } from '../mocks/videos.mock'
import { MOCK_ADMIN_COURSES } from '../mocks/admin-courses.mock'
import type { VideoAsset } from '../types/admin.types'

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoAsset[]>(MOCK_VIDEO_ASSETS)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoAsset | null>(null)

  const filtered = videos.filter((video) => {
    const matchesSearch =
      !search.trim() || video.title.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = courseFilter === 'all' || video.courseId === courseFilter
    return matchesSearch && matchesCourse
  })

  const handleEdit = (video: VideoAsset) => {
    setEditingVideo(video)
    setModalOpen(true)
  }

  const handleDelete = (videoId: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== videoId))
  }

  const handleUploadSubmit = (data: { title: string; courseId: string; description?: string }) => {
    const targetCourse = MOCK_ADMIN_COURSES.find((course) => course.id === data.courseId)
    const newVideo: VideoAsset = {
      id: `v-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseName: targetCourse?.title ?? 'Chưa xác định',
      duration: '—',
      fileSize: '—',
      status: 'processing',
      views: 0,
      watchedPercent: 0,
      uploadedAt: new Date().toISOString().slice(0, 10),
    }
    setVideos((prev) => [newVideo, ...prev])
  }

  const openUploadModal = () => {
    setEditingVideo(null)
    setModalOpen(true)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
    <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
      {/* Page header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Quản lý Video Đào tạo</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {videos.length} video · {filtered.length} hiển thị
          </p>
        </div>
        <Button className="gap-1.5" onClick={openUploadModal} id="upload-video-btn">
          <UploadCloud className="h-4 w-4" aria-hidden />
          Tải lên video
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
            id="video-search"
            aria-label="Tìm kiếm video"
            placeholder="Tìm video..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64 pl-9 text-sm"
          />
        </div>

        {/* Course filter */}
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-56 text-sm" aria-label="Lọc theo khoá học">
            <SelectValue placeholder="Tất cả khoá học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khoá học</SelectItem>
            {MOCK_ADMIN_COURSES.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Video table */}
      <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
        <VideoTable
          videos={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Upload modal */}
      <VideoUploadModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingVideo(null)
        }}
        courses={MOCK_ADMIN_COURSES}
        onSubmit={handleUploadSubmit}
      />
    </div>
    </div>
  )
}
