import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'

import type { Column, Task, TaskItemDto, UpdateTaskRequest } from '@/features/task/types/task.types'
import { TaskSheetDescription } from './TaskSheetDescription'
import { TaskSheetHeader } from './TaskSheetHeader'
import { TaskSheetProperties } from './TaskSheetProperties'
import { TaskSheetSubTasks } from './TaskSheetSubTasks'
import { TaskSheetComments } from './TaskSheetComments'
import { TaskSheetAttachments } from './TaskSheetAttachments'
import { TaskSheetDependencies } from './TaskSheetDependencies'
import { TaskSheetCustomProperties } from './TaskSheetCustomProperties'
import { TaskSheetActivityLog } from './TaskSheetActivityLog'
import { TaskBreadcrumb } from './TaskBreadcrumb'
import { useTaskSheet } from '@/features/task/hooks/useTaskSheet'

interface TaskSheetProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  columns?: Column[]
  tasks?: Task[]
  onTaskUpdate?: (taskId: string, updateData: UpdateTaskRequest) => Promise<TaskItemDto>
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onTaskNavigate?: (taskId: string) => void
}

export function TaskSheet(props: TaskSheetProps) {
  const { task, columns, tasks = [], isOpen, isFavorite, onToggleFavorite, onTaskNavigate } = props
  const { formState, setters, handleSheetClose } = useTaskSheet(props)
  const [titleFocused, setTitleFocused] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleSheetClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 gap-0 flex flex-col text-foreground [&>button]:hidden"
        style={{ backgroundColor: '#FFFFFF', borderLeft: '0.5px solid #e6dfd8' }}
      >
        <SheetTitle className="sr-only">{task ? task.title : 'Tạo Task mới'}</SheetTitle>

        <TaskSheetHeader
          task={task}
          onClose={handleSheetClose}
          isUpdating={formState.isUpdating}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {task && <TaskBreadcrumb task={task} onNavigate={onTaskNavigate} />}
          <div className="mb-4 mt-1">
            <input
              value={formState.title}
              onChange={(e) => setters.setTitle(e.target.value)}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholder="Tiêu đề task"
              className="w-full bg-transparent border-none outline-none shadow-none h-auto py-1 text-[15px] font-semibold placeholder:text-[#8e8b82]"
              style={{
                fontFamily: '"Cormorant Garamond", Tiempos Headline, Garamond, serif',
                color: '#141413',
                borderBottom: titleFocused ? '1.5px solid #cc785c' : '1.5px solid transparent',
                transition: 'border-color 150ms ease',
              }}
            />
          </div>

          <TaskSheetProperties
            columns={columns}
            status={formState.status}
            setStatus={setters.setStatus}
            priority={formState.priority}
            setPriority={setters.setPriority}
            assignee={formState.assignee}
            setAssignee={setters.setAssignee}
            tag={formState.tag}
            setTag={setters.setTag}
            startDate={formState.startDate}
            setStartDate={setters.setStartDate}
            dueDate={formState.dueDate}
            setDueDate={setters.setDueDate}
            createdAt={formState.createdAt}
          />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetSubTasks taskId={task?.id as string} />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetDescription
            description={formState.description}
            setDescription={setters.setDescription}
            task={task}
            tasks={tasks}
          />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetAttachments taskId={String(task?.id ?? '')} />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetDependencies taskId={String(task?.id ?? '')} />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetCustomProperties taskId={String(task?.id ?? '')} />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetComments taskId={String(task?.id ?? '')} />

          <div className="my-4" style={{ height: '0.5px', backgroundColor: '#e6dfd8' }} />

          <TaskSheetActivityLog taskId={String(task?.id ?? '')} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
