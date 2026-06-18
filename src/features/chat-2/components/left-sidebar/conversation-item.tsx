import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ConversationItemProps {
  id: string
  type: string
  name: string
  time: string
  message: string
  avatarSrc?: string
  unreadCount?: number
  isActive?: boolean //Hiển thị conversations đang active
  isOnline?: boolean
  onClick: () => void
}

//Cải thiện ava hiển thị theo private và group
export function ConversationItem({
  id,
  type,
  name,
  time,
  message,
  avatarSrc,
  unreadCount,
  isActive,
  isOnline,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      key={id}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent/50',
        isActive && 'bg-accent hover:bg-accent',
      )}
    >
      {/* Avatar Container with Online Status */}
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 border border-border/50">
          <AvatarImage src={avatarSrc} alt={name} className="object-cover" />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Online Status Indicator */}
        {isOnline !== undefined && (
          <span
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
              isOnline ? 'bg-green-500' : 'bg-muted-foreground/50',
            )}
            title={isOnline ? 'Online' : 'Offline'}
          />
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Row 1: Name + Time */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-semibold text-sm truncate flex-1 min-w-0">{name}</span>
          <span
            className={cn(
              'text-[11px] text-muted-foreground shrink-0 whitespace-nowrap',
              (unreadCount ?? 0) > 0 && 'font-bold text-foreground',
            )}
          >
            {time}
          </span>
        </div>

        {/* Row 2: Message + Unread Badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs truncate flex-1 min-w-0',
              (unreadCount ?? 0) > 0 ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}
          >
            {/* Hiển thị tạm  */}
            {Number(type) === 1 ? name + ': ' + message : message}
          </span>

          {(unreadCount ?? 0) > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shrink-0">
              {(unreadCount ?? 0) > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
