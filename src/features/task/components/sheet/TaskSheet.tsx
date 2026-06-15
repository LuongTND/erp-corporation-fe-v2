import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import type { Column, Task, TaskItemDto, UpdateTaskRequest } from '../../types/task.types'
import { TaskSheetDescription } from './TaskSheetDescription'
import { TaskSheetHeader } from './TaskSheetHeader'
import { TaskSheetProperties } from './TaskSheetProperties'
import { useTaskSheet } from '../../hooks/use-task-sheet'

interface TaskSheetProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  columns?: Column[]
  onTaskUpdate?: (taskId: string, updateData: UpdateTaskRequest) => Promise<TaskItemDto>
}

export function TaskSheet(props: TaskSheetProps) {
  const { task, columns, isOpen } = props
  const { formState, setters, handleSheetClose } = useTaskSheet(props)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleSheetClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[900px] p-0 gap-0 flex flex-col bg-background border-l border-border text-foreground [&>button]:hidden"
      >
        <SheetTitle className="sr-only">{task ? task.title : 'Create New Task'}</SheetTitle>

        <TaskSheetHeader
          task={task}
          onClose={handleSheetClose}
          isUpdating={formState.isUpdating}
        />

        <div className="flex-1 overflow-y-auto px-[56px] py-4">
          <div className="mb-6 mt-4">
            <input
              value={formState.title}
              onChange={(e) => setters.setTitle(e.target.value)}
              placeholder="Task Title"
              className={cn(
                'w-full bg-transparent border-none outline-none shadow-none',
                'text-5xl font-bold',
                'text-foreground placeholder:text-muted-foreground/30',
                'h-auto py-2',
              )}
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

          <Separator className="my-6" />

          <TaskSheetDescription
            description={formState.description}
            setDescription={setters.setDescription}
            task={task}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
