import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WebinarTable } from '../components/admin-webinars/WebinarTable'
import { WebinarFormModal } from '../components/admin-webinars/WebinarFormModal'
import { MOCK_WEBINARS } from '../mocks/webinars.mock'
import type { Webinar } from '../types/admin.types'
import type { WebinarSchema } from '../schemas/webinar.schema'

export default function AdminWebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>(MOCK_WEBINARS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)

  const upcomingWebinars = webinars.filter(
    (webinar) => webinar.status === 'upcoming' || webinar.status === 'live'
  )
  const pastWebinars = webinars.filter(
    (webinar) => webinar.status === 'ended' || webinar.status === 'cancelled'
  )

  const handleEdit = (webinar: Webinar) => {
    setEditingWebinar(webinar)
    setModalOpen(true)
  }

  const handleDelete = (webinarId: string) => {
    setWebinars((prev) => prev.filter((webinar) => webinar.id !== webinarId))
  }

  const handleSubmit = (data: WebinarSchema) => {
    if (editingWebinar) {
      setWebinars((prev) =>
        prev.map((webinar) =>
          webinar.id === editingWebinar.id
            ? {
                ...webinar,
                title: data.title,
                host: data.host,
                scheduledAt: data.scheduledAt,
                durationMinutes: data.durationMinutes,
                maxCapacity: data.maxCapacity,
                isInternal: data.isInternal,
              }
            : webinar
        )
      )
    } else {
      const newWebinar: Webinar = {
        id: `w-${Date.now()}`,
        title: data.title,
        host: data.host,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        status: 'upcoming',
        registeredCount: 0,
        attendedCount: 0,
        maxCapacity: data.maxCapacity,
        isInternal: data.isInternal,
      }
      setWebinars((prev) => [newWebinar, ...prev])
    }
    setEditingWebinar(null)
  }

  const openCreateModal = () => {
    setEditingWebinar(null)
    setModalOpen(true)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
    <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
      {/* Page header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Quản lý Webinar</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {upcomingWebinars.length} sắp diễn ra · {pastWebinars.length} đã kết thúc
          </p>
        </div>
        <Button className="gap-1.5" onClick={openCreateModal} id="create-webinar-btn">
          <Plus className="h-4 w-4" aria-hidden />
          Tạo webinar
        </Button>
      </div>

      {/* Tabs: Upcoming / Past */}
      <Tabs defaultValue="upcoming" className="flex-1 min-h-0 flex flex-col">
        <TabsList className="shrink-0">
          <TabsTrigger value="upcoming">
            Sắp diễn ra
            {upcomingWebinars.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {upcomingWebinars.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Đã kết thúc / Đã huỷ</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <WebinarTable
            webinars={upcomingWebinars}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="past" className="mt-4 rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <WebinarTable
            webinars={pastWebinars}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Create / Edit modal */}
      <WebinarFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingWebinar(null)
        }}
        editingWebinar={editingWebinar}
        onSubmit={handleSubmit}
      />
    </div>
    </div>
  )
}
