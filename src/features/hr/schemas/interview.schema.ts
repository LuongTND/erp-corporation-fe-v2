import { z } from 'zod'

export const createInterviewSchema = z.object({
  interviewerId: z.string().min(1, 'Chọn người phỏng vấn'),
  scheduledAt: z.string().min(1, 'Chọn thời gian'),
  location: z.enum(['AtStore', 'AtOffice', 'AtFactory', 'Remote']),
  locationNote: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateInterviewFormData = z.infer<typeof createInterviewSchema>

export const completeInterviewSchema = z.object({
  interviewResult: z.string().min(1, 'Nhập kết quả phỏng vấn'),
})

export type CompleteInterviewFormData = z.infer<typeof completeInterviewSchema>

export const evaluateCandidateSchema = z.object({
  score: z.number().min(1).max(10),
  recommendation: z.string().min(1, 'Nhập khuyến nghị'),
  note: z.string().optional(),
})

export type EvaluateCandidateFormData = z.infer<typeof evaluateCandidateSchema>
