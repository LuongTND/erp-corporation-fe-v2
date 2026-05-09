import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 phút — phù hợp data ERP ít thay đổi real-time
      gcTime: 1000 * 60 * 10,        // 10 phút giữ cache
      retry: 1,
      refetchOnWindowFocus: false,   // ERP không cần aggressive refetch
    },
    mutations: {
      retry: 0,
    },
  },
})
