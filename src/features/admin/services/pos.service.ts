import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'

export interface PosStoreResponse {
  id: string
  name: string
  address: string
  phone: string
  regionId: string | null
  regionName: string | null
}

export const posService = {
  getStores: () => apiCall.get<PosStoreResponse[]>(API_ROUTES.POS.STORES),
}
