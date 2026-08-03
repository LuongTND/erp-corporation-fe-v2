# 📡 API Configuration Guide

## Overview

Setup axios chuyên nghiệp với:
- ✅ Token management (access + refresh)
- ✅ Automatic token refresh
- ✅ Request queue khi refreshing
- ✅ Error handling
- ✅ Type-safe API calls

## File Structure

```
src/lib/
  ├── axios.ts       # Axios instance + interceptors
  ├── api.ts         # API utilities
  └── index.ts       # Exports
src/services/
  └── auth.service.ts # Example service
```

## Setup Requirements

### 1. Environment Variables

```bash
# .env
VITE_API_BASE_URL=https://your-api-base-url
```

### 2. Token Storage

Tokens được lưu ở localStorage:
- `access_token`: JWT token cho requests
- `refresh_token`: Dùng để refresh access token

## Usage Examples

### Basic API Call

```typescript
import { apiCall } from '@/lib'

// GET
const data = await apiCall.get('/users')

// POST
const result = await apiCall.post('/users', { name: 'John' })

// PUT
await apiCall.put('/users/1', { name: 'Jane' })

// PATCH
await apiCall.patch('/users/1', { status: 'active' })

// DELETE
await apiCall.delete('/users/1')
```

### With Type Safety

```typescript
import { apiCall } from '@/lib'

interface User {
  id: string
  name: string
  email: string
}

const user = await apiCall.get<User>('/users/1')
// user.data is User
```

### Using Service Layer

```typescript
import { authService } from '@/services/auth.service'

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
})

localStorage.setItem('access_token', response.data.access_token)
localStorage.setItem('refresh_token', response.data.refresh_token)
```

### Error Handling

```typescript
import { apiCall, getErrorMessage, isNetworkError } from '@/lib'

try {
  const data = await apiCall.post('/users', userData)
} catch (error) {
  if (isNetworkError(error)) {
    console.log('Network error')
  } else {
    const message = getErrorMessage(error)
    console.error(message)
  }
}
```

## Features

### 1. Automatic Token Refresh

Khi token hết hạn (401):
1. Gửi refresh token tới server
2. Nếu thành công → lưu token mới
3. Retry original request
4. Nếu thất bại → redirect /login

### 2. Request Queue

Khi token đang refresh:
- Các request khác sẽ chờ
- Sau khi refresh xong → tiếp tục toàn bộ requests
- Tránh multiple refresh calls

### 3. Error Handling

- **401**: Token refresh or redirect login
- **403**: Redirect /forbidden
- Network error: Log and reject

## API Response Format

```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}
```

## Best Practices

1. **Use Service Layer**: Tạo file service cho từng module
   ```typescript
   // services/user.service.ts
   export const userService = {
     getAll: () => apiCall.get<User[]>('/users'),
     getById: (id) => apiCall.get<User>(`/users/${id}`),
     create: (data) => apiCall.post<User>('/users', data),
   }
   ```

2. **Type Definition**: Define types cho mỗi API response
   ```typescript
   export interface User {
     id: string
     name: string
     email: string
   }
   ```

3. **Error Handling**: Always handle errors
   ```typescript
   try {
     const data = await apiCall.get('/users')
   } catch (error) {
     const message = getErrorMessage(error)
     // Show toast, alert, etc.
   }
   ```

4. **Loading States**: Quản lý loading state trong component
   ```typescript
   const [loading, setLoading] = useState(false)
   
   const handleFetch = async () => {
     setLoading(true)
     try {
       const data = await apiCall.get('/users')
     } finally {
       setLoading(false)
     }
   }
   ```

## Troubleshooting

### Token không auto refresh?
- Kiểm tra `refresh_token` có trong localStorage không
- Kiểm tra `/auth/refresh` endpoint hoạt động

### CORS Error?
- Kiểm tra backend CORS config
- Verify `VITE_API_BASE_URL` đúng

### Type Issues?
- Pass generic type: `apiCall.get<YourType>(url)`
- Import types từ `/types`

---

For more info: See TEAM_SETUP.md or CODE_FORMAT_GUIDE.md
