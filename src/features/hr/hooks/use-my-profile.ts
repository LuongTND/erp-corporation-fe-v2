import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'

export const myProfileKeys = {
  detail: ['my-profile-detail'] as const,
  salary: ['my-profile-salary'] as const,
}

export function useMyDetail() {
  return useQuery({
    queryKey: myProfileKeys.detail,
    queryFn: () => authService.getMyDetail(),
  })
}

export function useMyCurrentSalary(enabled = true) {
  return useQuery({
    queryKey: myProfileKeys.salary,
    queryFn: () => authService.getMyCurrentSalary(),
    enabled,
  })
}

export function useUpdateMyProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authService.updateMyProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: myProfileKeys.detail }),
  })
}
