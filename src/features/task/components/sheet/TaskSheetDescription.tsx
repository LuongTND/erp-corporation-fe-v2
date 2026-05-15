import type { Task } from '../../types/task.types'
import { TaskRichTextEditor } from '../editor/TaskRichTextEditor'

interface TaskSheetDescriptionProps {
  description: string
  setDescription: (value: string) => void
  task?: Task | null
  tasks?: Task[]
}

export function TaskSheetDescription({
  description,
  setDescription,
  task,
  tasks = [],
}: TaskSheetDescriptionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-[11px] font-medium uppercase tracking-[0.06em]"
        style={{ color: '#8e8b82' }}
      >
        Mô tả
      </p>

      <TaskRichTextEditor
        content={description}
        onChange={setDescription}
        placeholder={task ? 'Thêm mô tả cho task này…' : 'Nhập mô tả…'}
        tasks={tasks}
      />
    </div>
  )
}
