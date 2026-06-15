'use client'
import { Search, ListFilter, CheckCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LeftSideBarAction } from './left-sidebar-action'

export function LeftSideBarHeader({ searchTerm, setSearchTerm }: any) {
  return (
    <aside className="w-[320px] flex flex-col border-r bg-background shrink-0">
      {/* 1. HEADER - Fixed height */}
      <div className="flex items-center gap-2 p-3 border-b h-17.5 shrink-0">
        {/* Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => alert('Mark read')}>
              <CheckCheck className="mr-2 h-4 w-4" />
              <span>Đánh dấu đọc tất cả</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-8 h-9 bg-muted/50 border-transparent focus:bg-background transition-all w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <LeftSideBarAction />
      </div>
    </aside>
  )
}
