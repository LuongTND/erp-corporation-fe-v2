/**
 * useTaskForm Hook
 * Custom hook cho task form management
 * Handle validation, submission
 */

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { taskService } from '../services/task.service'
import type { CreateTaskPayload, UpdateTaskPayload, Task } from '../types/task.types'

interface UseTaskFormProps {
  initialData?: Task
  onSuccess?: () => void
}

export function useTaskForm({ initialData, onSuccess }: UseTaskFormProps = {}) {
  const [formData, setFormData] = useState<CreateTaskPayload | UpdateTaskPayload>(
    initialData || {
      title: '',
      status: 'todo',
      priority: 'medium',
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mutation for create/update
  const mutation = useMutation({
    mutationFn: async () => {
      if (initialData) {
        return taskService.updateTask(String(initialData.id), formData as UpdateTaskPayload)
      } else {
        return taskService.createTask(formData as CreateTaskPayload)
      }
    },
    onSuccess: () => {
      setFormData({
        title: '',
        status: 'todo',
        priority: 'medium',
      })
      setErrors({})
      onSuccess?.()
    },
  })

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      await mutation.mutateAsync()
    }
  }

  // Handle field change
  const handleChange = (
    field: keyof (CreateTaskPayload | UpdateTaskPayload),
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    reset: () => {
      setFormData({
        title: '',
        status: 'todo',
        priority: 'medium',
      })
      setErrors({})
    },
  }
}
