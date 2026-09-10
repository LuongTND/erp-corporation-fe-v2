import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type {
  CustomFieldDefinitionResponse,
  CreateCustomFieldPayload,
  UpdateCustomFieldPayload,
} from '../types/admin.types'

export const customFieldsService = {
  list: (module?: string) =>
    apiCall.get<CustomFieldDefinitionResponse[]>(API_ROUTES.CUSTOM_FIELDS.BASE, {
      params: module ? { module } : undefined,
    }),

  create: (data: CreateCustomFieldPayload) =>
    apiCall.post<string>(API_ROUTES.CUSTOM_FIELDS.BASE, data),

  update: (id: string, data: UpdateCustomFieldPayload) =>
    apiCall.put<void>(API_ROUTES.CUSTOM_FIELDS.GET_BY_ID(id), data),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.CUSTOM_FIELDS.GET_BY_ID(id)),
}
