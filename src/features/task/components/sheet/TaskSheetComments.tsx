import { useState, useRef, useEffect } from 'react'
import { CornerDownRight, Send } from 'lucide-react'
import { format } from 'date-fns'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
  avatarBg: '#cc785c',
} as const

interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: Date
  replies: Comment[]
}

const SEED_COMMENTS: Comment[] = [
  {
    id: 'c1',
    authorName: 'Nguyễn Văn A',
    content: 'Đã xem qua yêu cầu, cần làm thêm phần validation input trước khi submit.',
    createdAt: new Date(Date.now() - 3600 * 2 * 1000),
    replies: [
      {
        id: 'c1r1',
        authorName: 'Trần Thị B',
        content: 'Đồng ý, tôi sẽ thêm Zod schema cho form này.',
        createdAt: new Date(Date.now() - 3600 * 1 * 1000),
        replies: [],
      },
    ],
  },
]

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return format(date, 'dd/MM/yyyy')
}

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <span
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: C.avatarBg,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

interface ReplyInputProps {
  onSubmit: (text: string) => void
  onCancel: () => void
  placeholder?: string
}

function ReplyInput({ onSubmit, onCancel, placeholder = 'Trả lời...' }: ReplyInputProps) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { ref.current?.focus() }, [])

  const submit = () => {
    const text = value.trim()
    if (!text) return
    onSubmit(text)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div
      className="flex items-end gap-2 mt-1.5 rounded-lg p-2"
      style={{ border: `0.5px solid ${C.border}`, backgroundColor: '#FFFFFF' }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-transparent outline-none text-[12px] leading-relaxed"
        style={{ color: C.text, maxHeight: 80 }}
      />
      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        className="w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: C.accent }}
      >
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string, text: string) => void
  depth?: number
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [repliesExpanded, setRepliesExpanded] = useState(true)

  const handleReply = (text: string) => {
    onReply(comment.id, text)
    setShowReplyInput(false)
    setRepliesExpanded(true)
  }

  return (
    <div className={depth > 0 ? 'ml-6 mt-2' : 'mt-3'}>
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ backgroundColor: C.border }}
        />
      )}

      <div className="flex gap-2.5">
        <Avatar name={comment.authorName} size={depth > 0 ? 20 : 24} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-1.5 mb-0.5">
            <span className="text-[12px] font-medium" style={{ color: C.text }}>
              {comment.authorName}
            </span>
            <span className="text-[11px]" style={{ color: C.muted }}>
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Content */}
          <p className="text-[13px] leading-relaxed" style={{ color: C.text }}>
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] cursor-pointer transition-colors duration-[120ms]"
              style={{ color: C.muted }}
              onClick={() => setShowReplyInput((v) => !v)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.accent }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.muted }}
            >
              <CornerDownRight className="h-3 w-3" />
              Trả lời
            </button>

            {comment.replies.length > 0 && (
              <button
                type="button"
                className="text-[11px] cursor-pointer transition-colors duration-[120ms]"
                style={{ color: C.muted }}
                onClick={() => setRepliesExpanded((v) => !v)}
              >
                {repliesExpanded ? 'Ẩn' : `${comment.replies.length} phản hồi`}
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <ReplyInput
              onSubmit={handleReply}
              onCancel={() => setShowReplyInput(false)}
              placeholder={`Trả lời ${comment.authorName}...`}
            />
          )}

          {/* Nested replies */}
          {repliesExpanded && comment.replies.length > 0 && (
            <div className="relative">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface TaskSheetCommentsProps {
  taskId?: string
}

export function TaskSheetComments({ taskId }: TaskSheetCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    setComments(SEED_COMMENTS)
    setNewComment('')
  }, [taskId])

  const addComment = () => {
    const text = newComment.trim()
    if (!text) return
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        authorName: 'Bạn',
        content: text,
        createdAt: new Date(),
        replies: [],
      },
    ])
    setNewComment('')
  }

  const handleReply = (parentId: string, text: string) => {
    const addReply = (list: Comment[]): Comment[] =>
      list.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                id: `r-${Date.now()}`,
                authorName: 'Bạn',
                content: text,
                createdAt: new Date(),
                replies: [],
              },
            ],
          }
        }
        if (c.replies.length > 0) {
          return { ...c, replies: addReply(c.replies) }
        }
        return c
      })

    setComments((prev) => addReply(prev))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <p
        className="text-[11px] font-medium uppercase tracking-[0.06em]"
        style={{ color: C.muted }}
      >
        Bình luận
        {comments.length > 0 && (
          <span className="ml-1.5 normal-case font-normal">({comments.length})</span>
        )}
      </p>

      {/* Comment list */}
      <div className="flex flex-col">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
        ))}
      </div>

      {/* New comment input */}
      <div
        className="flex items-end gap-2 rounded-lg p-2 mt-1"
        style={{ border: `0.5px solid ${C.border}`, backgroundColor: '#FFFFFF' }}
      >
        <Avatar name="Bạn" size={20} />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Thêm bình luận... (Enter để gửi)"
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-[12px] leading-relaxed"
          style={{ color: C.text, maxHeight: 80 }}
        />
        <button
          type="button"
          onClick={addComment}
          disabled={!newComment.trim()}
          className="w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: C.accent }}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
