'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart2, BellOff, ChevronRight, UserPlus, Users, X, MessageSquarePlus } from 'lucide-react'
import { useState, useEffect } from 'react'

// Import file panel
// import { GroupMembersPanel } from './group-members-panel'

// --- SUB COMPONENTS ---

const ChatHeader = ({ onClose, title }: { onClose: () => void; title: string }) => (
  <div className="flex items-center justify-between p-4 h-[70px] shrink-0 border-b">
    <h3 className="font-semibold text-lg">{title}</h3>
    <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
      <X className="h-5 w-5" />
    </Button>
  </div>
)

const ProfileInfo = ({
  isGroup,
  name,
  subText,
  avatarSrc,
  initials,
}: {
  isGroup: boolean
  name: string
  subText: string
  avatarSrc?: string
  initials: string
}) => (
  // Sửa: Giảm pt-6 xuống pt-4 cho đỡ trống phía trên
  <div className="flex flex-col items-center gap-3 pt-4 pb-4">
    <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
      <AvatarImage src={avatarSrc} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
    <div className="text-center">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-muted-foreground">{subText}</p>
    </div>
  </div>
)

const QuickActions = ({ isGroup }: { isGroup: boolean }) => {
  const ActionItem = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) => (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
        <Icon className="h-5 w-5 text-secondary-foreground" />
      </div>
      <span className="text-xs font-medium text-center max-w-[80px] leading-tight">{label}</span>
    </div>
  )
  
  const handleCreateGroup = () => {
    // TODO: Implement create group functionality
    console.log('Tạo nhóm trò chuyện')
  }

  // Sửa: Giảm py-2 xuống py-0 hoặc bỏ luôn để gần phần dưới hơn
  return (
    <div className="flex items-start justify-center gap-8 pb-4">
      <ActionItem icon={BellOff} label="Tắt thông báo" />
      {isGroup ? (
        <ActionItem icon={UserPlus} label="Thêm thành viên" />
      ) : (
        <ActionItem icon={MessageSquarePlus} label="Tạo nhóm trò chuyện" onClick={handleCreateGroup} />
      )}
    </div>
  )
}

const GroupBoard = () => (
  // Sửa: Bỏ py-2 cũ, thêm mt-2 để tách nhẹ khỏi phần trên
  <div className="space-y-2 py-3">
    <h4 className="text-sm font-medium text-muted-foreground px-1">Bảng tin nhóm</h4>
    <Button
      variant="outline"
      className="w-full justify-start gap-2 h-10 border-dashed text-muted-foreground hover:text-foreground"
    >
      <BarChart2 className="w-4 h-4 text-blue-500" />
      <span>Tạo bình chọn mới</span>
    </Button>
  </div>
)

// Component Accordion dùng chung
interface ResourceItemProps {
  value: string
  title: string
  icon?: any
  count: number
  emptyText: string
  children?: React.ReactNode
}
const ResourceAccordionItem = ({
  value,
  title,
  icon: Icon,
  count,
  emptyText,
  children,
}: ResourceItemProps) => (
  <AccordionItem value={value} className="border-b-0">
    <AccordionTrigger className="hover:no-underline py-3 px-1">
      <div className="flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        {title}
      </div>
      {count > 0 && <span className="text-xs text-muted-foreground mr-2 ml-auto">{count}</span>}
    </AccordionTrigger>
    <AccordionContent className="px-1 pb-2">
      {count === 0 ? (
        <p className="text-xs text-muted-foreground italic pl-6">{emptyText}</p>
      ) : (
        children || <div className="pl-6">Nội dung...</div>
      )}
    </AccordionContent>
  </AccordionItem>
)

// --- MAIN COMPONENT ---


interface ChatDetailsProps {
  activeConversation: SidebarItemData | null
  onClose: () => void
}

export function RightSidebarDetails({ activeConversation, onClose }: ChatDetailsProps) {
  const [currentView, setCurrentView] = useState<'main' | 'members'>('main')
  
  // Reset về view 'main' khi chuyển sang chat khác
  useEffect(() => {
    setCurrentView('main')
  }, [activeConversation?.id])
  
  if (!activeConversation) {
    return (
      <div className="h-full flex flex-col bg-background w-full">
        <ChatHeader onClose={onClose} title="Thông tin hội thoại" />
        <div className="flex items-center justify-center flex-1">
          <p className="text-sm text-muted-foreground">Không có thông tin</p>
        </div>
      </div>
    )
  }

  const isGroup = activeConversation.type === 'group'
  const displayName = activeConversation.name
  const subText = activeConversation.subText || (isGroup ? `Nhóm • ${activeConversation.totalMembers || 0} thành viên` : 'Người dùng')
  const avatarSrc = activeConversation.avatar
  const initials = displayName.substring(0, 2).toUpperCase()

  // Chỉ cho phép xem members nếu là group
  if (currentView === 'members' && isGroup) {
    return (
      <GroupMembersPanel
        totalMembers={activeConversation.totalMembers || 0}
        members={activeConversation.members || []}
        onBack={() => setCurrentView('main')}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-background w-full">
      <ChatHeader onClose={onClose} title="Thông tin hội thoại" />

      <ScrollArea className="flex-1 overflow-y-auto">
        {/* SỬA QUAN TRỌNG: Đổi space-y-6 thành space-y-0 để kiểm soát khoảng cách thủ công hoặc space-y-1 */}
        <div className="px-4 pb-4 space-y-1">
          <ProfileInfo
            isGroup={isGroup}
            name={displayName}
            subText={subText}
            avatarSrc={avatarSrc}
            initials={initials}
          />

          <QuickActions isGroup={isGroup} />

          {/* Dùng div rỗng để tạo khoảng cách ngăn cách giữa header và list bên dưới nếu cần */}
          <div className="h-2"></div>

          {isGroup && (
            <>
              {/* Button Members: Giảm py-4 xuống py-3 */}
              <div
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-md -mx-2 px-2 group"
                onClick={() => setCurrentView('members')}
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Thành viên nhóm</h4>
                  {/* Đổi font-semibold thành font-medium cho đồng bộ với Accordion */}
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{activeConversation.totalMembers || 0} thành viên</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>

              <GroupBoard />
            </>
          )}

          <Accordion type="multiple" className="w-full" defaultValue={['images', 'links']}>
            <ResourceAccordionItem
              value="images"
              title="Ảnh & Video"
              count={0}
              emptyText="Chưa có Ảnh/Video được chia sẻ trong hội thoại này."
            />

            <ResourceAccordionItem
              value="links"
              title="Link"
              count={0}
              emptyText="Chưa có Link được chia sẻ trong hội thoại này."
            />
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

import { Search, ChevronLeft, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Member, SidebarItemData } from '../../schema/conversation-schema'

interface GroupMembersPanelProps {
  onBack: () => void // Hàm để quay lại màn hình trước
  totalMembers: number
  members?: Member[] // Danh sách thành viên từ mock data
}

export function GroupMembersPanel({ onBack, totalMembers, members = [] }: GroupMembersPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-background w-full">
      {/* 1. HEADER: Nút Back + Tiêu đề */}
      <div className="flex items-center gap-2 p-4 h-[70px] shrink-0 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h3 className="font-semibold text-lg">Thành viên</h3>
      </div>

      {/* 2. CONTENT */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Nút Thêm thành viên */}
        <div className="p-4 pb-0">
          <Button
            variant="secondary"
            className="w-full bg-muted hover:bg-muted/70 text-foreground justify-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm thành viên
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Danh sách thành viên ({totalMembers})</span>
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button> */}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thành viên"
              className="pl-9 bg-card border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách cuộn */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.name}</span>
                      {member.role === 'Trưởng nhóm' && (
                        <span className="text-xs text-muted-foreground">Trưởng nhóm</span>
                      )}
                    </div>
                  </div>
                  {/* <Button
                    variant="secondary"
                    size="sm"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium h-8 px-4"
                  >
                    Kết bạn
                  </Button> */}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <Search className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Không tìm thấy thành viên</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
