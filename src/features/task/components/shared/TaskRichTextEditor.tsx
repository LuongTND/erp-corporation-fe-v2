import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import {
  AtSign,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
} from 'lucide-react'
import type { Task } from '@/features/task/types/task.types'

// ── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
  bgActive: '#f5f0e8',
} as const

// ── Toolbar button ────────────────────────────────────────────────────────────

interface ToolbarBtnProps {
  icon?: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  title?: string
}

function ToolbarBtn({ icon, label, active, onClick, title }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      title={title ?? label}
      aria-label={label}
      onMouseDown={(e) => {
        e.preventDefault() // keep editor focus
        onClick()
      }}
      className="w-6 h-6 flex items-center justify-center rounded text-[11px] font-semibold cursor-pointer transition-colors duration-[100ms]"
      style={{
        color: active ? C.accent : C.muted,
        backgroundColor: active ? C.bgActive : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
      }}
    >
      {icon}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-4 mx-0.5 shrink-0" style={{ backgroundColor: C.border }} />
}

// ── Task mention picker ──────────────────────────────────────────────────────

interface MentionPickerProps {
  tasks: Task[]
  onSelect: (task: Task) => void
  onClose: () => void
}

function TaskMentionPicker({ tasks, onSelect, onClose }: MentionPickerProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = tasks
    .filter((t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      (t.code ?? '').toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 8)

  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: '#FFFFFF',
        border: `0.5px solid ${C.border}`,
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        width: 260,
      }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ borderBottom: `0.5px solid ${C.border}` }}>
        <AtSign className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm task..."
          className="flex-1 text-[12px] bg-transparent outline-none"
          style={{ color: C.text }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); onClose() }
          }}
        />
      </div>
      <div className="max-h-48 overflow-y-auto py-1">
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-[12px]" style={{ color: C.muted }}>Không tìm thấy task</p>
        )}
        {filtered.map((task) => (
          <button
            key={String(task.id)}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onSelect(task) }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-left cursor-pointer transition-colors duration-[100ms]"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {task.code && (
              <span className="text-[10px] shrink-0 font-mono px-1 py-0.5 rounded" style={{ backgroundColor: C.bgHover, color: C.muted }}>
                {task.code}
              </span>
            )}
            <span className="flex-1 text-[12px] truncate" style={{ color: C.text }}>{task.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Image URL input ───────────────────────────────────────────────────────────

interface ImageInputProps {
  onInsert: (url: string) => void
  onClose: () => void
}

function ImageUrlInput({ onInsert, onClose }: ImageInputProps) {
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const commit = () => {
    const trimmed = url.trim()
    if (trimmed) onInsert(trimmed)
    else onClose()
  }

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-md"
      style={{ backgroundColor: '#FFFFFF', border: `0.5px solid ${C.border}` }}
    >
      <Image className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} />
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Nhập URL hình ảnh..."
        className="w-44 text-[12px] bg-transparent outline-none"
        style={{ color: C.text }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit() }
          if (e.key === 'Escape') { e.preventDefault(); onClose() }
        }}
      />
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); commit() }}
        className="text-[11px] font-medium cursor-pointer px-1.5 py-0.5 rounded transition-colors duration-[100ms]"
        style={{ backgroundColor: C.accent, color: '#FFFFFF' }}
      >
        OK
      </button>
    </div>
  )
}

// ── Editor component ──────────────────────────────────────────────────────────

interface TaskRichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  tasks?: Task[]
}

export function TaskRichTextEditor({
  content,
  onChange,
  placeholder = 'Thêm mô tả…',
  minHeight: _minHeight = 72,
  tasks = [],
}: TaskRichTextEditorProps) {
  const [showImageInput, setShowImageInput] = useState(false)
  const [showMentionPicker, setShowMentionPicker] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Inject styles once into document head
  useEffect(() => {
    const STYLE_ID = 'tiptap-editor-global-styles'
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement('style')
      el.id = STYLE_ID
      el.textContent = EDITOR_STYLES
      document.head.appendChild(el)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: {},
        blockquote: {},
        bulletList: {},
        orderedList: {},
        horizontalRule: {},
      }),
      ImageExtension.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    onFocus() { setIsFocused(true) },
    onBlur() { setIsFocused(false) },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        spellcheck: 'false',
      },
    },
  })

  // Sync external content changes (e.g. task switch)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const current = editor.getHTML()
    const incoming = content || ''
    if (current !== incoming && (current !== '<p></p>' || incoming !== '')) {
      editor.commands.setContent(incoming, { emitUpdate: false })
    }
  }, [editor, content])

  // Cleanup
  useEffect(() => () => { editor?.destroy() }, [editor])

  const insertImage = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run()
    setShowImageInput(false)
  }

  const insertMention = (task: Task) => {
    const label = task.code ? `@${task.code}` : `@${task.title}`
    editor?.chain().focus().insertContent(
      `<span class="task-mention-chip" data-task-id="${task.id}" contenteditable="false">${label}</span>&nbsp;`
    ).run()
    setShowMentionPicker(false)
  }

  if (!editor) return null

  const showToolbar = isFocused || !editor.isEmpty

  return (
    <div className="flex flex-col gap-0">
        {/* Toolbar */}
        <div
          className="flex items-center gap-0.5 flex-wrap transition-all duration-[150ms]"
          style={{
            marginBottom: showToolbar ? 6 : 0,
            opacity: showToolbar ? 1 : 0,
            height: showToolbar ? 'auto' : 0,
            overflow: showToolbar ? 'visible' : 'hidden',
            pointerEvents: showToolbar ? 'all' : 'none',
          }}
        >
          {/* Headings */}
          <ToolbarBtn
            icon={<Heading1 className="h-3.5 w-3.5" />}
            label="Heading 1"
            title="H1 (Ctrl+Alt+1)"
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarBtn
            icon={<Heading2 className="h-3.5 w-3.5" />}
            label="Heading 2"
            title="H2 (Ctrl+Alt+2)"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarBtn
            icon={<Heading3 className="h-3.5 w-3.5" />}
            label="Heading 3"
            title="H3 (Ctrl+Alt+3)"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />

          <Divider />

          {/* Inline marks */}
          <ToolbarBtn
            icon={<Bold className="h-3.5 w-3.5" />}
            label="Bold"
            title="Bold (Ctrl+B)"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarBtn
            icon={<Italic className="h-3.5 w-3.5" />}
            label="Italic"
            title="Italic (Ctrl+I)"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />

          <Divider />

          {/* Lists */}
          <ToolbarBtn
            icon={<List className="h-3.5 w-3.5" />}
            label="Bullet list"
            title="Bullet list (Ctrl+Shift+8)"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarBtn
            icon={<ListOrdered className="h-3.5 w-3.5" />}
            label="Ordered list"
            title="Numbered list (Ctrl+Shift+7)"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />

          <Divider />

          {/* Blocks */}
          <ToolbarBtn
            icon={<Code2 className="h-3.5 w-3.5" />}
            label="Code block"
            title="Code block (Ctrl+Alt+C)"
            active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarBtn
            icon={<Quote className="h-3.5 w-3.5" />}
            label="Blockquote"
            title="Blockquote (Ctrl+Shift+B)"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarBtn
            icon={<Minus className="h-3.5 w-3.5" />}
            label="Horizontal rule"
            title="Horizontal rule"
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />

          <Divider />

          {/* Image */}
          <ToolbarBtn
            icon={<Image className="h-3.5 w-3.5" />}
            label="Insert image"
            title="Insert image"
            active={showImageInput}
            onClick={() => setShowImageInput((v) => !v)}
          />

          {/* Mention */}
          {tasks.length > 0 && (
            <ToolbarBtn
              icon={<AtSign className="h-3.5 w-3.5" />}
              label="Mention task"
              title="@mention task"
              active={showMentionPicker}
              onClick={() => { setShowMentionPicker((v) => !v); setShowImageInput(false) }}
            />
          )}
        </div>

        {/* Image URL input row */}
        {showImageInput && (
          <div className="mb-2">
            <ImageUrlInput onInsert={insertImage} onClose={() => setShowImageInput(false)} />
          </div>
        )}

        {/* Mention picker row */}
        {showMentionPicker && (
          <div className="mb-2">
            <TaskMentionPicker
              tasks={tasks}
              onSelect={insertMention}
              onClose={() => setShowMentionPicker(false)}
            />
          </div>
        )}

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
  )
}


// ── Editor content CSS ────────────────────────────────────────────────────────

const EDITOR_STYLES = `
.tiptap-editor-content {
  outline: none;
  min-height: 72px;
  font-size: 13px;
  line-height: 1.65;
  color: #141413;
  cursor: text;
}

/* Placeholder — shown on empty p/h nodes by Tiptap Placeholder extension */
.tiptap-editor-content p.is-empty::before,
.tiptap-editor-content h1.is-empty::before,
.tiptap-editor-content h2.is-empty::before,
.tiptap-editor-content h3.is-empty::before {
  content: attr(data-placeholder);
  color: #8e8b82;
  pointer-events: none;
  float: left;
  height: 0;
}

/* Also cover the editor-level empty class */
.tiptap-editor-content.is-editor-empty > p:first-child::before {
  content: attr(data-placeholder);
  color: #8e8b82;
  pointer-events: none;
  float: left;
  height: 0;
}

.tiptap-editor-content p {
  margin: 0 0 6px;
}

.tiptap-editor-content h1 {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #141413;
  margin: 16px 0 8px;
  font-family: "Cormorant Garamond", Garamond, serif;
}

.tiptap-editor-content h2 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: #141413;
  margin: 14px 0 6px;
}

.tiptap-editor-content h3 {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: #141413;
  margin: 12px 0 4px;
}

.tiptap-editor-content h1:first-child,
.tiptap-editor-content h2:first-child,
.tiptap-editor-content h3:first-child {
  margin-top: 0;
}

.tiptap-editor-content ul,
.tiptap-editor-content ol {
  padding-left: 20px;
  margin: 4px 0 8px;
}

.tiptap-editor-content ul {
  list-style-type: disc;
}

.tiptap-editor-content ol {
  list-style-type: decimal;
}

.tiptap-editor-content li {
  margin: 2px 0;
  line-height: 1.65;
}

.tiptap-editor-content li > p {
  margin: 0;
}

.tiptap-editor-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  background-color: #f5f0e8;
  color: #cc785c;
  padding: 1px 4px;
  border-radius: 3px;
}

.tiptap-editor-content pre {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 12px 14px;
  margin: 8px 0;
  overflow-x: auto;
}

.tiptap-editor-content pre code {
  background: none;
  color: #d4d4d4;
  padding: 0;
  font-size: 12.5px;
  line-height: 1.6;
  border-radius: 0;
}

.tiptap-editor-content blockquote {
  border-left: 3px solid #cc785c;
  padding-left: 12px;
  margin: 8px 0;
  color: #6c6a64;
  font-style: italic;
}

.tiptap-editor-content hr {
  border: none;
  border-top: 0.5px solid #e6dfd8;
  margin: 12px 0;
}

.tiptap-editor-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
  border: 0.5px solid #e6dfd8;
  display: block;
}

.tiptap-editor-content img.ProseMirror-selectednode {
  outline: 2px solid #cc785c;
  border-radius: 8px;
}

/* Placeholder for all nodes */
.tiptap-editor-content .is-empty::before {
  content: attr(data-placeholder);
  color: #8e8b82;
  pointer-events: none;
  float: left;
  height: 0;
}

/* Task mention chip */
.tiptap-editor-content .task-mention-chip {
  display: inline-flex;
  align-items: center;
  background-color: #f5f0e8;
  color: #cc785c;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  border: 0.5px solid #e6dfd8;
  transition: background-color 120ms;
}

.tiptap-editor-content .task-mention-chip:hover {
  background-color: #ecd9cc;
}
`
