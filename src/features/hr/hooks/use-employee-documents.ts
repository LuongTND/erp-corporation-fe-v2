import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'
import type { UploadDocumentPayload } from '../types/employee-document.types'

const docsKey = (userId: string) => ['employee-documents', userId]

export function useEmployeeDocuments(userId: string) {
  return useQuery({
    queryKey: docsKey(userId),
    queryFn: () => employeesService.getDocuments(userId),
    enabled: !!userId,
  })
}

export function useUploadDocument(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => employeesService.uploadDocument(userId, payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: docsKey(userId) })
      toast.success('Tải lên tài liệu thành công')
    },
    onError: () => toast.error('Tải lên thất bại'),
  })
}

export function useDeleteDocument(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (documentId: string) => employeesService.deleteDocument(userId, documentId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: docsKey(userId) })
      toast.success('Đã xóa tài liệu')
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}
