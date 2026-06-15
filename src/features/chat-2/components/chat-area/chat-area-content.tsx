'use client'
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

const useAuth = () => ({ user: { id: 'mock', name: 'Mock' } })
import { MessageItem, MessageItemv2 } from './message-item'
import { Loader2 } from 'lucide-react'
import { TypingIndicator } from './typing-indicator'
import { format, isSameDay, differenceInMinutes } from 'date-fns'
import { vi } from 'date-fns/locale'
// import { formatMessageTime } from '@/features/chat/services/chat-service'

const formatMessageTime = (createdAtUtc: string): string => {
  const date = new Date(createdAtUtc)
  const now = new Date()

  // Cùng ngày - hiển thị giờ phút
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Hôm qua
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Hôm qua'
  }

  // Trong tuần
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return days[date.getDay()]
  }

  // Năm nay
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' })
  }

  // Khác năm
  return date.toLocaleDateString('vi-VN')
}

// --- Component hiển thị Divider thời gian ---
const DateDivider = ({ date }: { date: string }) => {
  return (
    <div className="flex justify-center my-4">
      <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
        {/* {format(date, 'HH:mm - dd/MM/yyyy', { locale: vi })} */}
        {formatMessageTime(date)}
      </span>
    </div>
  )
}

interface Props {
  typingUsers: any
  activeConversation?: any
  messages: any[]
  addReaction: any
  removeReaction: any
  setOpenReplyMessage: any
  setReplyingTo: any
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
}

export function ChatAreaContent({
  typingUsers,
  activeConversation,
  messages,
  addReaction,
  removeReaction,
  setOpenReplyMessage,
  setReplyingTo,
  onLoadMore,
  hasMore = false,
}: Props) {
  const { user } = useAuth()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Refs
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)
  const previousScrollHeight = useRef(0)

  // --- Scroll Logic (Giữ nguyên của bạn) ---
  useEffect(() => {
    const viewport = document.querySelector('[data-radix-scroll-area-viewport]')
    if (viewport) {
      // @ts-ignore
      scrollViewportRef.current = viewport
    }
  }, [])

  useEffect(() => {
    if (!activeConversation || messages.length === 0) return
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' })
      isFirstLoad.current = false
    } else {
      const lastMessage = messages[messages.length - 1]
      const isMyMessage = lastMessage?.senderId === user?.id
      if (isMyMessage) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages, activeConversation, user?.id])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          if (scrollViewportRef.current) {
            previousScrollHeight.current = scrollViewportRef.current.scrollHeight
          }
          setIsLoadingMore(true)
          if (onLoadMore) await onLoadMore()
          setIsLoadingMore(false)
        }
      },
      { threshold: 1.0 },
    )
    const currentTopRef = topRef.current
    if (currentTopRef) observer.observe(currentTopRef)
    return () => {
      if (currentTopRef) observer.unobserve(currentTopRef)
    }
  }, [hasMore, isLoadingMore, onLoadMore])

  useLayoutEffect(() => {
    if (
      !isLoadingMore &&
      !isFirstLoad.current &&
      scrollViewportRef.current &&
      previousScrollHeight.current > 0
    ) {
      const newScrollHeight = scrollViewportRef.current.scrollHeight
      const heightDifference = newScrollHeight - previousScrollHeight.current
      scrollViewportRef.current.scrollTop = heightDifference
      previousScrollHeight.current = 0
    }
  }, [messages, isLoadingMore])

  if (!activeConversation) {
    return (
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">Chọn một cuộc trò chuyện để xem tin nhắn</p>
        </div>
      </ScrollArea>
    )
  }

  // --- Helpers UI Actions ---
  const handleReply = (message: any) => {
    setReplyingTo(message)
    setOpenReplyMessage(true)
  }
  const handleReact = (emoji: string) => console.log('Reacting with:', emoji)
  const handleDelete = (messageId: string) => console.log('Deleting:', messageId)

  // --- 🌟 LOGIC GROUPING MESSAGE QUAN TRỌNG 🌟 ---
  // Sử dụng useMemo để tính toán lại mỗi khi messages thay đổi, tránh tính toán dư thừa khi render
  const renderMessages = useMemo(() => {
    // console.log('>>>>>>Chat content -- messages <<<<<', messages)

    return messages.map((message, index) => {
      const prevMessage = messages[index - 1]
      const nextMessage = messages[index + 1]

      const isCurrentUser = message.senderId === user?.id
      // const isPrevCurrentUser = prevMessage?.senderId === user?.id

      // 1. Logic Divider Thời gian (30 phút hoặc khác ngày)
      const getMessageDate = (msg: any) => {
        if (!msg) return null

        // 1. Lấy chuỗi thời gian: Ưu tiên createdAt, nếu không có thì lấy createdAtUtc
        let dateString = msg.createdAt || msg.createdAtUtc

        if (!dateString) return new Date()

        // 2. Xử lý UTC nếu thiếu chữ 'Z' ở cuối (để trình duyệt không hiểu nhầm là giờ Local)
        // Chỉ thêm Z nếu dùng field Utc và chuỗi chưa có Z
        if (!msg.createdAt && msg.createdAtUtc && !dateString.endsWith('Z')) {
          dateString += 'Z'
        }

        return new Date(dateString)
      }

      // const getSafeDate = (msg:any) => {
      //   if (!msg) return null
      //   let dateStr = msg.createdAt || msg.createdAtUtc
      //   if (!dateStr) return new Date()
      //   if (
      //     msg.createdAtUtc &&
      //     !msg.createdAt &&
      //     typeof dateStr === 'string' &&
      //     !dateStr.endsWith('Z')
      //   ) {
      //     dateStr += 'Z'
      //   }
      //   const dateObj = new Date(dateStr)
      //   return isNaN(dateObj.getTime()) ? new Date() : dateObj
      // }

      // console.log('>>>>>>>>>>>>>')
      // console.log(prevMessage)
      // console.log('----------')
      // console.log(nextMessage)
      // console.log('<<<<<<<<<<<<<')

      const createdAt = getMessageDate(message) || new Date()
      const prevCreatedAt = getMessageDate(prevMessage)
      const nextCreatedAt = getMessageDate(nextMessage)

      // const createdAt =  new Date(message.createdAt)
      // const prevCreatedAt = prevMessage ? new Date(prevMessage.createdAt) : null

      let showDateDivider = false
      if (!prevMessage || !prevCreatedAt) {
        showDateDivider = true // Tin nhắn đầu tiên luôn hiện ngày
      } else if (prevCreatedAt) {
        const isDiffDay = !isSameDay(createdAt, prevCreatedAt)
        const isLongTimeGap = differenceInMinutes(createdAt, prevCreatedAt) > 60 // > 30 phút

        if (isDiffDay || isLongTimeGap) {
          showDateDivider = true
        }
      }

      // 2. Logic Grouping (Gộp nhóm tin nhắn liên tiếp)
      // Điều kiện để gộp: Cùng người gửi + Cùng ngày + Khoảng cách thời gian ngắn (< 5 phút)
      const isSequence =
        prevMessage &&
        prevMessage.senderId === message.senderId &&
        differenceInMinutes(createdAt, prevCreatedAt!) < 5 &&
        !showDateDivider // Nếu có divider ở giữa thì không gộp

      // Xác định vị trí trong nhóm (Đầu, Giữa, Cuối) để chỉnh UI (Bo góc, Avatar)
      const isGroupStart = !isSequence

      // Kiểm tra xem tin tiếp theo có cùng nhóm không
      // const nextCreatedAt = nextMessage ? new Date(nextMessage.createdAt) : null
      const isNextSequence =
        nextMessage &&
        nextMessage.senderId === message.senderId &&
        differenceInMinutes(nextCreatedAt!, createdAt) < 5

      const isGroupEnd = !isNextSequence

      return (
        <div key={message.id}>
          {/* Hiển thị thanh ngăn cách thời gian nếu cần */}
          {showDateDivider && <DateDivider date={String(createdAt)} />}

          <MessageItemv2
            messageId={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            onReactionAdd={addReaction}
            onReply={handleReply}
            onReactionRemove={removeReaction}
            onReact={handleReact}
            onDelete={() => handleDelete(message.id)}
            // 🔥 Các props mới truyền vào để MessageItem xử lý UI
            isGroupStart={isGroupStart} // True: hiện Avatar/Tên (nếu cần)
            isGroupEnd={isGroupEnd} // True: hiện trạng thái đã xem, timestamp nhỏ (nếu cần)
            isSequence={isSequence} // True: ẩn Avatar, ẩn Tên

          // Truyền luôn date object đã chuẩn hóa xuống dưới nếu MessageItem cần hiển thị giờ
          // displayDate={createdAt}
          />
        </div>
      )
    })
  }, [messages, user?.id, addReaction, removeReaction]) // Dependency array

  return (
    <ScrollArea className="flex-1 p-4 pt-0 pb-0 bg-muted/20 overflow-y-auto h-full">
      <div className="flex flex-col justify-end min-h-full pb-4">
        {/* Loading Indicator for Infinite Scroll */}
        <div ref={topRef} className="h-4 flex justify-center w-full my-2">
          {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {/* Danh sách tin nhắn đã xử lý Grouping */}
        <div className="flex flex-col gap-y-0.5 pb-4">{renderMessages}</div>

        {/* Typing Indicator */}
        {typingUsers && typingUsers.length > 0 && (
          <div className="mb-2 pl-2">
            {' '}
            {/* Thêm padding để thẳng hàng */}
            <TypingIndicator typingUsers={typingUsers} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
