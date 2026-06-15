'use client'

import { Phone, Video, PanelRight, PanelRightOpen, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils' // Sử dụng hàm cn để xử lý class điều kiện cho gọn
// import { SidebarItemData } from '@/features/chat/mock/mock-conversations'



interface ChatHeaderProps {
  activeConversation: any | null
  activePanel: 'none' | 'info' | 'search'
  onToggleInfo: () => void
  onToggleSearch: () => void
}

export function ChatAreaHeader({
  activeConversation,
  activePanel,
  onToggleInfo,
  onToggleSearch,
}: ChatHeaderProps) {
  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center p-4 border-b h-[70px] shrink-0 bg-background">
        <p className="text-sm text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    )
  }

  const isGroup = activeConversation.type === String(1)
  const displayName = activeConversation.name
  const avatarSrc = activeConversation.avatarUrl
  const initials = displayName?.substring(0, 2).toUpperCase()

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b h-17.5 shrink-0 bg-background">
        {/* 1. User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              {displayName}
              {isGroup && (
                <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                  Nhóm
                </Badge>
              )}
            </h3>
            <span
              className={cn(
                'text-xs flex items-center gap-1',
                activeConversation.isOnline ? 'text-green-600' : 'text-muted-foreground',
              )}
            >
              {activeConversation.isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  Online
                </>
              ) : (
                'Offline'
              )}
            </span>
          </div>
        </div>

        {/* 2. Actions Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant={activePanel === 'search' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'text-muted-foreground',
              activePanel === 'search' && 'text-blue-600', // Đổi màu icon khi active
            )}
            onClick={onToggleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Nút Info Toggle */}
          <Button
            variant={activePanel === 'info' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'text-muted-foreground',
              activePanel === 'info' && 'text-blue-600', // Đổi màu icon khi active
            )}
            onClick={onToggleInfo}
          >
            {activePanel === 'info' ? (
              <PanelRightOpen className="h-5 w-5" />
            ) : (
              <PanelRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
