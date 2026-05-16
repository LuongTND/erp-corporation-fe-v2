import { jwtDecode, type JwtPayload } from 'jwt-decode'
import { MICROSOFT_ROLE_CLAIM } from '@/config/roles'

// ──────────────────────────────────────────────────────────────
// JWT Payload mở rộng (hỗ trợ cả .NET Identity và custom claims)
// ──────────────────────────────────────────────────────────────

export interface CustomJwtPayload extends JwtPayload {
  // Standard & Custom claims
  id?: string
  Id?: string
  email?: string
  name?: string
  role?: string
  avatar?: string
  avatarUrl?: string
  picture?: string

  // Microsoft Identity Claims (Long URL keys)
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string
}

// ──────────────────────────────────────────────────────────────
// Decode User Info từ JWT Token
// ──────────────────────────────────────────────────────────────

export interface DecodedUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

/**
 * Giải mã JWT token và trích xuất thông tin user.
 * Hỗ trợ cả cấu trúc token chuẩn và Microsoft Identity Claims (.NET Backend).
 *
 * @param token - JWT access token từ server
 * @returns DecodedUser hoặc null nếu token không hợp lệ
 */
export const decodeUserFromToken = (token: string): DecodedUser | null => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token)

    const id = decoded.Id || decoded.sub || decoded.id || ''

    const email =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      decoded.email ||
      ''

    const name =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      decoded.name ||
      ''

    const role = String(
      decoded[MICROSOFT_ROLE_CLAIM] ||
      decoded.role ||
      '',
    ).toLowerCase()

    const avatar = decoded.avatarUrl || decoded.avatar || decoded.picture || undefined

    return { id, email, name, role, avatar }
  } catch (error) {
    console.error('❌ [auth.utils] Lỗi giải mã JWT token:', error)
    return null
  }
}

// ──────────────────────────────────────────────────────────────
// Token Validity
// ──────────────────────────────────────────────────────────────

/**
 * Kiểm tra token còn hạn hay chưa.
 * @param token - JWT access token
 * @returns true nếu token còn hạn, false nếu hết hạn hoặc không hợp lệ
 */
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token)
    if (!decoded.exp) return false
    return decoded.exp > Date.now() / 1000
  } catch {
    return false
  }
}

/**
 * Trả về thời gian còn lại (ms) trước khi token hết hạn.
 * @param token - JWT access token
 * @returns milliseconds còn lại. 0 nếu hết hạn hoặc không hợp lệ.
 */
export const getTokenExpiresIn = (token: string): number => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token)
    if (!decoded.exp) return 0
    const expiresIn = (decoded.exp - Date.now() / 1000) * 1000
    return expiresIn > 0 ? expiresIn : 0
  } catch {
    return 0
  }
}

// ──────────────────────────────────────────────────────────────
// Role Checking
// ──────────────────────────────────────────────────────────────

/**
 * Kiểm tra role từ token có khớp với role yêu cầu hay không.
 * @param token - JWT access token
 * @param requiredRole - Role cần kiểm tra
 * @returns true nếu role khớp
 */
export const checkUserRole = (token: string, requiredRole: string): boolean => {
  const user = decodeUserFromToken(token)
  if (!user) return false
  return user.role === requiredRole.toLowerCase()
}
