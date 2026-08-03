import { useState } from 'react'
import { Bell, Trash2, Check, AlertCircle, MessageSquare, ClipboardList, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MockNotification {
  id: string
  type: 'task' | 'message' | 'system'
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  timeVi: string
  timeEn: string
  isRead: boolean
}

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false)

  // Standard mock ERP notifications
  const [notifications, setNotifications] = useState<MockNotification[]>([
    {
      id: '1',
      type: 'task',
      titleVi: 'Nhiệm vụ mới được giao',
      titleEn: 'New Task Assigned',
      descVi: 'Bạn đã được chỉ định làm người thực hiện cho công việc "Thiết kế Header ERP".',
      descEn: 'You have been assigned as the assignee for "ERP Header Design" task.',
      timeVi: '5 phút trước',
      timeEn: '5 mins ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'message',
      titleVi: 'Tin nhắn từ Nguyễn Văn A',
      titleEn: 'Message from Nguyen Van A',
      descVi: 'Lịch họp đánh giá dự án đã được dời sang 15:00 chiều nay.',
      descEn: 'The project review meeting has been rescheduled to 3:00 PM today.',
      timeVi: '1 giờ trước',
      timeEn: '1 hour ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'system',
      titleVi: 'Bảo trì hệ thống định kỳ',
      titleEn: 'Scheduled System Maintenance',
      descVi: 'Hệ thống DigiERP sẽ tạm ngưng dịch vụ để nâng cấp vào lúc 23:00 đêm nay.',
      descEn: 'DigiERP system will be temporarily down for upgrades tonight at 11:00 PM.',
      timeVi: '3 giờ trước',
      timeEn: '3 hours ago',
      isRead: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    toast.success('Đã đánh dấu thông báo là đã đọc')
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc')
  }

  const handleClearAll = () => {
    setNotifications([])
    toast.info('Đã xóa tất cả thông báo')
  }

  const getIcon = (type: MockNotification['type']) => {
    switch (type) {
      case 'task':
        return <ClipboardList className="h-4 w-4 text-blue-500" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'system':
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border border-background animate-pulse">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h4 className="text-sm font-semibold">Thông báo</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {`Bạn có ${unreadCount} thông báo chưa đọc`}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 px-2 text-xs text-primary hover:text-primary/95"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Đọc tất cả
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-72">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className={cn(
                    'flex items-start gap-3 p-4 border-b border-border/40 hover:bg-muted/50 cursor-pointer transition-colors',
                    !n.isRead && 'bg-primary/5 dark:bg-primary/10'
                  )}
                >
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-background border shadow-sm">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('text-xs font-semibold text-foreground', !n.isRead && 'font-bold')}>
                        {n.titleVi}
                      </p>
                      {!n.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {n.descVi}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium pt-1">
                      {n.timeVi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                Không có thông báo nào
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Chúng tôi sẽ báo cho bạn khi có tin mới
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t bg-muted/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="w-full h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Xóa tất cả thông báo
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
