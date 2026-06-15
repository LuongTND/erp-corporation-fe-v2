import type { Task, TaskStatusDto } from '@/features/task/types/task.types'
import { cn } from '@/lib/utils'
import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TaskListProps {
  tasks: Task[]
  statuses: TaskStatusDto[]
  onTaskClick?: (task: Task) => void
  searchQuery?: string
}

export function TaskList({ tasks, statuses, onTaskClick, searchQuery = '' }: TaskListProps) {
  const statusMap = React.useMemo(() => {
    const map = new Map<string, TaskStatusDto>()
    statuses.forEach((status) => {
      map.set(status.id, status)
    })
    return map
  }, [statuses])

  const getStatusInfo = React.useCallback(
    (statusId: string) => statusMap.get(statusId),
    [statusMap],
  )

  const filteredTasks = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return tasks

    return tasks.filter((task) => {
      const haystack = [task.title, task.tag, task.code, task.assignee, task.status, task.priority]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [tasks, searchQuery])

  return (
    <div className="h-full flex-1 min-h-0">
      <div className="rounded-md border bg-background h-full flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-auto">
          <Table className="min-w-[720px] relative">
            <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[150px]">Assignee</TableHead>
                <TableHead className="w-[120px]">Due</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.map((task) => {
                const statusInfo = getStatusInfo(String(task.columnId))
                return (
                  <TableRow
                    key={String(task.id)}
                    onClick={() => onTaskClick?.(task)}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[280px] font-medium text-foreground">
                          {task.title}
                        </span>
                        {task.code && (
                          <span className="mt-0.5 text-xs text-muted-foreground">{task.code}</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            statusInfo ? statusInfo.color : 'bg-zinc-400',
                          )}
                        />
                        <span className="text-sm font-medium text-foreground/80">
                          {statusInfo ? statusInfo.name : task.status || 'Unknown'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{task.priority || '-'}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-semibold">
                            {task.assignee?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {task.assignee || 'Unassigned'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{task.date || '-'}</TableCell>
                  </TableRow>
                )
              })}

              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
