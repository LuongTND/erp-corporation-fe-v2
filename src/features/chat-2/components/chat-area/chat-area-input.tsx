'use client'
import { useRef, ChangeEvent, useState, useEffect } from 'react' // ✅ Add useEffect
import { Send, Paperclip, Smile, FileUp, Cloud, CheckSquare, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TextareaAutosize from 'react-textarea-autosize'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
// import { useSendMessage, useTypingIndicator } from '../../hooks/useChat'

import ChatReplyMessage from './chat-reply-message'

interface ChatAreaInputProps {
  activeConversation: any | null
  onSendMessage: any
  sendTypingIndicator: any
  // isLoading: any
  openReplyMessage: any
  replyingToMessage: any
  setOpenReplyMessage: any
  sendMessage: any
}

//Chưa có loading gửi tin nhắn

export function ChatAreaInput({
  activeConversation,
  onSendMessage,
  sendTypingIndicator,
  openReplyMessage,
  replyingToMessage,
  setOpenReplyMessage,
  sendMessage
}: ChatAreaInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  // const typingTimeoutRef = useRef<NodeJS.Timeout>(null)
  const isTypingSentRef = useRef(false) // ✅ Track if currently sending typing indicator
  const [isSending, setIsSending] = useState(false)

  // ✅ CLEANUP: Send stop typing when unmount
  // useEffect(() => {
  //   return () => {
  //     if (isTypingSentRef.current) {
  //       sendTypingIndicator(false).catch(() => {})
  //     }
  //   }
  // }, [sendTypingIndicator])

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)

    // ✅ MESSENGER STYLE: Send typing indicator if user has content
    if (value.length > 0 && !isTypingSentRef.current) {
      // First keystroke - send typing start
      await sendTypingIndicator(true)
      isTypingSentRef.current = true
      console.log('⌨️ [ChatInput] User typing - START')
    } else if (value.length === 0 && isTypingSentRef.current) {
      // Content cleared - send typing stop
      await sendTypingIndicator(false)
      isTypingSentRef.current = false
      console.log('⌨️ [ChatInput] User typing - STOP (cleared)')
    }

    // Clear previous timeout
    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current)
    // }


    // ✅ Auto stop typing after 3 seconds of inactivity (Messenger style)
    // typingTimeoutRef.current = setTimeout(() => {
    //   if (isTypingSentRef.current) {
    //     sendTypingIndicator(false)
    //     isTypingSentRef.current = false
    //     console.log('⌨️ [ChatInput] User typing - STOP (timeout 3s)')
    //   }
    // }, 3000)
  }

  const handleSend = async () => {
    if (!content.trim() || isSending) return
    try {
      setContent('')
      setIsSending(true)
      await sendTypingIndicator(false)

      console.log("Input truyền data", activeConversation?.id, content)
      await sendMessage(content, activeConversation?.id)

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing && !isSending) {
      e.preventDefault()

      handleSend()
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // 4. Hàm xử lý khi người dùng đã chọn file xong
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Xử lý file tại đây (gửi lên server, hiển thị preview, v.v.)
      console.log('File đã chọn:', files[0])

      // Reset giá trị input để cho phép chọn lại cùng 1 file nếu cần
      event.target.value = ''
    }
  }

  if (!activeConversation) {
    return null
  }

  return (
    <div className="">
      {/* 5. Thẻ input ẩn nằm ở đâu cũng được, miễn là trong component */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" // Ẩn thẻ này đi
        multiple // Thêm thuộc tính này nếu muốn chọn nhiều file cùng lúc
      />

      {openReplyMessage && (
        <ChatReplyMessage
          replyingToMessage={replyingToMessage}
          setOpenReplyMessage={setOpenReplyMessage}
        />
      )}

      <div className="flex items-end gap-2 p-4 border-t bg-background">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground shrink-0 mb-0.5"
              disabled={isSending} // Disable nút attach khi đang gửi
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-64">
            {/* 6. Gán sự kiện onClick vào Item này */}
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleUploadClick}>
              <FileUp className="h-4 w-4 text-muted-foreground" />
              <span>Tập tin trên máy tính này</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Sự kiện hoặc cuộc họp</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 relative bg-muted/30 rounded-md border border-muted focus-within:ring-1 focus-within:ring-ring">
          <TextareaAutosize
            ref={textareaRef}
            minRows={1}
            maxRows={20}
            placeholder="Nhập tin nhắn..."
            value={content}
            onChange={handleChange}
            // disabled={sending}
            className="flex w-full rounded-md bg-transparent px-3 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none pr-10 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20"
            onKeyDown={handleKeyDown}
          />

           <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-1.5 h-8 w-8 text-muted-foreground hover:bg-transparent"
            onClick={handleSend}
            // Disable nút khi đang gửi hoặc không có nội dung
            disabled={isSending || !content.trim()}
          >
            {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Send className="h-5 w-5" />
            )}
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-1.5 h-8 w-8 text-muted-foreground hover:bg-transparent"
            onClick={handleSend}
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <Send className="h-5 w-5" />
            <Smile className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}
