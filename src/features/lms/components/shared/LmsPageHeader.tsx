import { Bell, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { LMS_PALETTE } from './lms-palette'

interface LmsPageHeaderProps {
  readonly searchSlot: ReactNode
  readonly notificationLabel: string
  readonly unreadCount: number
  readonly accountLabel: string
  readonly accountInitials: string
}

export function LmsPageHeader({
  searchSlot,
  notificationLabel,
  unreadCount,
  accountLabel,
  accountInitials,
}: LmsPageHeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 flex h-[52px] items-center gap-3 px-6"
      style={{ backgroundColor: LMS_PALETTE.canvas, borderBottom: `1px solid ${LMS_PALETTE.border}` }}
    >
      <div className="flex-1" />
      {searchSlot}
      <div className="flex flex-1 items-center justify-end gap-2.5">
        <button
          type="button"
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2"
          style={{ color: LMS_PALETTE.muted }}
          onMouseEnter={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.surfaceCard
          }}
          onMouseLeave={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
          }}
          aria-label={notificationLabel}
        > 
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ backgroundColor: LMS_PALETTE.primary, color: LMS_PALETTE.onDark }}
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        </button>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2"
          onMouseEnter={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.surfaceCard
          }}
          onMouseLeave={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
          }}
          aria-label={`${accountLabel} menu`}
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: LMS_PALETTE.primary, color: LMS_PALETTE.onDark }}
          >
            {accountInitials}
          </span>
          <span className="text-xs font-medium" style={{ color: LMS_PALETTE.body }}>
            {accountLabel}
          </span>
          <ChevronDown className="h-3 w-3" style={{ color: LMS_PALETTE.mutedSoft }} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}