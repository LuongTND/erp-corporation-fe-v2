import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { regionsService } from '../services/regions.service'
import type { RegionHoursPayload } from '../types/admin.types'

export function useRegions(params?: { searchText?: string }) {
  return useQuery({
    queryKey: ['regions', params],
    queryFn: () => regionsService.getRegions({ ...params, top: 200 }),
  })
}

export function useSyncRegions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => regionsService.syncRegions(),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['regions'] })
      toast.success(count === 0 ? 'Không có khu vực mới, đã đồng bộ hết' : `Đã thêm ${count} khu vực mới`)
    },
    onError: () => toast.error('Đồng bộ khu vực thất bại'),
  })
}

export function useRegionHours(regionId: string | null) {
  return useQuery({
    queryKey: ['region-hours', regionId],
    queryFn: () => regionsService.getRegionHours(regionId!),
    enabled: !!regionId,
  })
}

export function useUpsertRegionHours() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegionHoursPayload) => regionsService.upsertRegionHours(payload),
    onSuccess: (_, { regionId }) => {
      client.invalidateQueries({ queryKey: ['region-hours', regionId] })
      client.invalidateQueries({ queryKey: ['regions'] })
      client.invalidateQueries({ queryKey: ['stores'] })
      client.invalidateQueries({ queryKey: ['stores-by-region'] })
      client.invalidateQueries({ queryKey: ['store-hours'] })
      toast.success('Cập nhật giờ mở cửa khu vực thành công')
    },
    onError: () => toast.error('Cập nhật giờ mở cửa khu vực thất bại'),
  })
}
