import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Interface này khớp với TypingIndicator trong file service của bạn
interface TypingUser {
  userId: string
  userName: string
  avatarUrl?: string // Tùy chọn, nếu bạn có avatar
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[]
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) return null

  // Logic hiển thị text: "A đang soạn..." hoặc "A, B và 2 người khác đang soạn..."
  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} đang soạn tin...`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} và ${typingUsers[1].userName} đang soạn tin...`
    } else {
      return `${typingUsers[0].userName}, ${typingUsers[1].userName} và ${typingUsers.length - 2} người khác đang soạn...`
    }
  }

  // Lấy avatar của người đầu tiên để hiển thị (đỡ rối mắt)
  const primaryUser = typingUsers[0]

  return (
    <div className="flex items-end gap-2 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Avatar người đang gõ */}
      {/* <Avatar className="h-8 w-8 border border-border">
        <AvatarImage src={primaryUser.avatarUrl} alt={primaryUser.userName} />
        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
          {primaryUser.userName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar> */}

      <div className="flex flex-col gap-1">
        {/* Bong bóng chat chứa hiệu ứng dots */}
        <div className="relative px-4 py-3 bg-muted rounded-2xl rounded-bl-none w-fit max-w-[100px]">
          <div className="flex items-center gap-1 h-3">
            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
          </div>
        </div>

        {/* Text nhỏ hiển thị tên */}
        {/* <span className="text-xs text-muted-foreground ml-1">{getTypingText()}</span> */}
      </div>
    </div>
  )
}
