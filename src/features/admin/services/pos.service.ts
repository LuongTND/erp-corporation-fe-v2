import { apiCall } from '@/lib/api'

export interface PosStoreResponse {
  id: string
  name: string
  address: string
  phone: string
  regionId: string | null
  regionName: string | null
}

export const posService = {
  getStores: () => apiCall.get<PosStoreResponse[]>('/api/pos/stores'),
}
