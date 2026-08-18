import { useQuery } from '@tanstack/react-query'
import { posService } from '../services/pos.service'

export function usePosStores() {
  return useQuery({
    queryKey: ['pos-stores'],
    queryFn: () => posService.getStores(),
  })
}
