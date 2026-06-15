'use client'
import React, { useState } from 'react'
import { Check, EllipsisVertical, SmilePlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
// import { MessageResponse } from '@/features/chat/schema/conversation-schema'
const formatMessageTime = (d: any) => '12:00 PM'


interface ChatMessageProps {
  messageId: string
  message: any //all data 1 message
  isCurrentUser: boolean
  showSenderName?: boolean
  onReply?: (message: any) => void
  onReact?: any
  onDelete?: any
  onReactionAdd?: any
  onReactionRemove?: any
}

export function MessageItem({
  messageId,
  message,
  isCurrentUser,
  //   showSenderName = false,
  onReply,
  onReact,
  onDelete,
  onReactionAdd,
  onReactionRemove,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Reaction types từ BE schema
  const reactionTypes = ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry']

  // Map reaction type để hiển thị emoji
  const reactionTypeToEmoji: Record<string, string> = {
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Wow: '😮',
    Sad: '😢',
    Angry: '😠',
  }

  // console.log('Data có gì', message)

  return (
    <div
      key={messageId}
      className={cn('flex gap-3 group', isCurrentUser ? 'flex-row-reverse' : 'flex-row')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1 shrink-0">
          <AvatarImage src="https://github.com/shadcn.png" alt={message.senderName} />
          <AvatarFallback className="text-xs font-semibold">{message.senderName}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Container */}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[75%]',
          isCurrentUser ? 'items-end' : 'items-start',
        )}
      >
        {/* Sender Name (Group Chat) */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{message.senderName}</span>
            {/* {message.sender.isOnline && (
            <span className="w-2 h-2 rounded-full bg-green-500" title="Online" />
            )} */}
          </div>
        )}

        {/* {message.replyTo && (
          <div
            className={cn(
              'flex items-start gap-2 px-3 py-2 rounded-lg border border-border/50 mb-1 bg-muted/30',
              isCurrentUser
                ? 'border-l-2 border-l-primary'
                : 'border-l-2 border-l-muted-foreground',
            )}
          >
            <div className="text-[11px] flex-1 min-w-0">
              <p className="font-semibold text-foreground/70">{message.replyTo.senderName}</p>
              <p className="text-muted-foreground truncate">{message.replyTo.content}</p>
            </div>
          </div>
        )} */}

        {/* Main Message Bubble */}
        <div className={cn('flex flex-col relative', isCurrentUser ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'px-3 py-2 rounded-2xl text-sm wrap-break-word',
              isCurrentUser
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-card border border-border text-card-foreground rounded-tl-none',
            )}
          >
            <p>{message.content}</p>
          </div>

          {/* Reactions - Match BE schema (reactionType instead of emoji) */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction: any) => (
                <div
                  key={reaction.reactionType}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-xs border border-border"
                  title={reaction.employeeIds?.join(', ')}
                >
                  <span>{reactionTypeToEmoji[reaction.reactionType] || '👍'}</span>
                  {reaction.count > 1 && (
                    <span className="text-[10px] ml-0.5">{reaction.count}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time + Read Status */}
        <div
          className={cn(
            'flex items-center gap-1 text-[10px] text-muted-foreground px-1',
            isCurrentUser && 'flex-row-reverse',
          )}
        >
          {/* BE trả về  sai định  dạng data: createdAt */}
          <span>
            {message.createdAt
              ? formatMessageTime(message.createdAt)
              : formatMessageTime(message.createdAtUtc)}
          </span>

          {/* <span>{formatMessageTime(message.createdAt)}</span> */}

          {/* {message.isEdited && ' (edited)'} */}
          {isCurrentUser && (
            <>
              {message.readCount === 0 && <Check className="h-3 w-3" />}
              {message.readCount > 0 && <Check className="h-3 w-3 text-blue-500" />}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div
          className={cn(
            'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isCurrentUser ? 'flex-row-reverse' : 'flex-row',
          )}
        >
          {/* Reaction Type Picker - Match BE schema */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-muted"
                title="React"
              >
                <SmilePlus className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" side={isCurrentUser ? 'left' : 'right'}>
              <div className="flex gap-1">
                {reactionTypes.map((reactionType) => (
                  <button
                    key={reactionType}
                    onClick={() => {
                      onReactionAdd?.(reactionType)
                      setShowEmojiPicker(false)
                    }}
                    className="text-lg hover:scale-125 transition-transform cursor-pointer"
                    title={reactionType}
                  >
                    {reactionTypeToEmoji[reactionType]}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Reply Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted"
            onClick={() => onReply?.(message)}
            title="Reply"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </Button>

          {/* More Actions */}
          {isCurrentUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-muted"
              onClick={onDelete}
              title="Delete"
            >
              <EllipsisVertical className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface ChatMessageProps {
  messageId: string
  message: any //all data 1 message
  isCurrentUser: boolean
  showSenderName?: boolean
  onReply?: (message: any) => void
  onReact?: any
  onDelete?: any
  onReactionAdd?: any
  onReactionRemove?: any

  // 🔥 New Props for Grouping UI
  isGroupStart?: boolean
  isGroupEnd?: boolean
  isSequence?: boolean
}

export function MessageItemv2({
  messageId,
  message,
  isCurrentUser,
  onReply,
  onReact,
  onDelete,
  onReactionAdd,
  onReactionRemove,
  isGroupStart = true, // Default true if not provided
  isGroupEnd = true,
  isSequence = false,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Reaction types từ BE schema
  const reactionTypes = ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry']

  const reactionTypeToEmoji: Record<string, string> = {
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Wow: '😮',
    Sad: '😢',
    Angry: '😠',
  }

  return (
    <div
      key={messageId}
      className={cn(
        'flex gap-3 group relative',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row',
        isSequence ? 'mt-0.5' : 'mt-4',
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 🌟 Avatar Logic: Only show for other users AND if it's the start of a group */}
      {!isCurrentUser && (
        <div className="w-8 shrink-0 flex flex-col justify-start">
          {isGroupStart ? (
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src="https://github.com/shadcn.png" alt={message.senderName} />
              <AvatarFallback className="text-xs font-semibold">
                {message.senderName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            // Placeholder to keep alignment for sequence messages
            <div className="w-8" />
          )}
        </div>
      )}

      {/* Message Container */}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[75%]',
          isCurrentUser ? 'items-end' : 'items-start',
        )}
      >
        {/* 🌟 Sender Name: Only show if start of group */}
        {!isCurrentUser && isGroupStart && (
          <div className="flex items-center gap-2 ml-1">
            <span className="text-xs font-semibold text-foreground">{message.senderName}</span>
          </div>
        )}

        {/* Main Message Bubble */}
        <div className={cn('flex flex-col relative', isCurrentUser ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'px-3 py-2 text-sm wrap-break-word',
              isCurrentUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-card-foreground',

              'rounded-2xl', // Default fully rounded

              isCurrentUser
                ? cn(
                    // Right side logic
                    isGroupStart && 'rounded-tr-2xl', // Sharp top-right for start
                    !isGroupStart && 'rounded-tr-md', // Slightly rounded for middle
                    !isGroupEnd && 'rounded-br-md', // Slightly rounded for middle
                    isGroupEnd && 'rounded-br-2xl', // Fully rounded for end
                  )
                : cn(
                    // Left side logic
                    isGroupStart && 'rounded-tl-2xl',
                    !isGroupStart && 'rounded-tl-md',
                    !isGroupEnd && 'rounded-bl-md',
                    isGroupEnd && 'rounded-bl-2xl',
                  ),
            )}
          >
            <p>{message.content}</p>
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div
              className={cn(
                'flex flex-wrap gap-1 mt-1',
                isCurrentUser ? 'justify-end' : 'justify-start',
              )}
            >
              {message.reactions.map((reaction: any) => (
                <div
                  key={reaction.reactionType}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-xs border border-border"
                  title={reaction.employeeIds?.join(', ')}
                >
                  <span>{reactionTypeToEmoji[reaction.reactionType] || '👍'}</span>
                  {reaction.count > 1 && (
                    <span className="text-[10px] ml-0.5">{reaction.count}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🌟 Time + Read Status: Show persistently only for LAST message in group. Others show on hover. */}
        <div
          className={
            isGroupEnd ? `flex items-center gap-1 text-[10px] text-muted-foreground` : `hidden`
          }
        >
          <span>
            {message.createdAt
              ? formatMessageTime(message.createdAt)
              : formatMessageTime(message.createdAtUtc)}
          </span>

          {isCurrentUser && (
            <>
              {message.readCount === 0 && <Check className="h-3 w-3" />}
              {message.readCount > 0 && <Check className="h-3 w-3 text-blue-500" />}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {/* {showActions && (
        <div
          className={cn(
            'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0', // Absolute positioning
            isCurrentUser ? 'right-full mr-2' : 'left-full ml-2', // Show actions on the side
            'z-10', // Ensure actions are above other elements
          )}
        >
          <div className="flex items-center gap-0.5 bg-background border rounded-md shadow-sm p-0.5">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  title="React"
                >
                  <SmilePlus className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side="top">
                <div className="flex gap-1">
                  {reactionTypes.map((reactionType) => (
                    <button
                      key={reactionType}
                      onClick={() => {
                        onReactionAdd?.(reactionType)
                        setShowEmojiPicker(false)
                      }}
                      className="text-lg hover:scale-125 transition-transform cursor-pointer px-1"
                    >
                      {reactionTypeToEmoji[reactionType]}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() => onReply?.(message)}
              title="Reply"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Button>

            {isCurrentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={onDelete}
                title="Delete"
              >
                <EllipsisVertical className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )} */}

      {/* Action Buttons */}
      {showActions && (
        <div
          className={cn(
            'flex gap-1 content-center items-center opacity-0 group-hover:opacity-100 transition-opacity',
            isCurrentUser ? 'flex-row-reverse' : 'flex-row',
            isGroupStart && !isCurrentUser && 'mt-4',
            isGroupEnd && 'mb-4',
          )}
        >
          {/* Reaction Type Picker - Match BE schema */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-muted"
                title="React"
              >
                <SmilePlus className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" side={isCurrentUser ? 'left' : 'right'}>
              <div className="flex gap-1">
                {reactionTypes.map((reactionType) => (
                  <button
                    key={reactionType}
                    onClick={() => {
                      onReactionAdd?.(reactionType)
                      setShowEmojiPicker(false)
                    }}
                    className="text-lg hover:scale-125 transition-transform cursor-pointer"
                    title={reactionType}
                  >
                    {reactionTypeToEmoji[reactionType]}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Reply Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted"
            onClick={() => onReply?.(message)}
            title="Reply"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </Button>

          {/* More Actions */}
          {isCurrentUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-muted"
              onClick={onDelete}
              title="Delete"
            >
              <EllipsisVertical className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
