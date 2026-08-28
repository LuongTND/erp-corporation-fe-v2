import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'
import type { UploadDocumentPayload } from '../types/employee-document.types'

const MY_DOCS_KEY = ['my-documents']

export function useMyDocuments() {
  return useQuery({
    queryKey: MY_DOCS_KEY,
    queryFn: () => employeesService.getMyDocuments(),
  })
}

export function useUploadMyDocument() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => employeesService.uploadMyDocument(payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MY_DOCS_KEY })
      toast.success('Tải lên tài liệu thành công')
    },
    onError: () => toast.error('Tải lên thất bại'),
  })
}

export function useDeleteMyDocument() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (documentId: string) => employeesService.deleteMyDocument(documentId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MY_DOCS_KEY })
      toast.success('Đã xóa tài liệu')
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}
