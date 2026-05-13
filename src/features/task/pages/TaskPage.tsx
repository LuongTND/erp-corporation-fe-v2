/**
 * Task Page
 * Main page component cho task feature
 * Hiển thị task board hoặc list view
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskBoard } from '../components/TaskBoard'
import { TaskForm } from '../components/TaskForm'
import { useTasks } from '../hooks/use-tasks'
import type { Task, TaskStatus } from '../types/task.types'

export default function TaskPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { tasks, isLoading, updateTask } = useTasks()

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTask({
      id: taskId,
      data: { status },
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-full space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and track progress</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 gap-4">
        {/* Task Board */}
        <div className="flex-1">
          <TaskBoard
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Sidebar - Task Form or Details */}
        {(showForm || selectedTask) && (
          <div className="w-96 rounded-lg border bg-card p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">
                {showForm ? 'New Task' : selectedTask?.title}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setSelectedTask(null)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {showForm ? (
              <TaskForm
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            ) : selectedTask ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedTask.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <p className="capitalize">{selectedTask.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="capitalize">{selectedTask.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p>{selectedTask.assignedTo?.name || 'Unassigned'}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowForm(true)}
                >
                  Edit Task
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
