'use client';
import { Pencil, MessageSquarePlus, Users, BarChart2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button'

export function LeftSideBarAction() {
  const handleAction = (action: string) => {
    // Logic mở modal tạo group/vote/call sẽ nằm ở đây
    alert(`Selected action: ${action}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Tạo mới</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Tạo mới</DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction('chat')}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>Tin nhắn mới</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('group')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Tạo nhóm chat</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction('vote')}>
            <BarChart2 className="mr-2 h-4 w-4" />
            <span>Tạo bình chọn</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}