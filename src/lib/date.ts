const VN_TZ = 'Asia/Ho_Chi_Minh'

/** dd/MM/yyyy — dùng cho DateOnly từ BE (dateOfBirth, dateOfJoin, ...) */
export function fmtDate(value: string | null | undefined): string {
  if (!value) return '—'
  // DateOnly string "YYYY-MM-DD": append time to avoid UTC parse shifting the day
  const d = new Date(value.length === 10 ? value + 'T00:00:00' : value)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    timeZone: VN_TZ,
  }).format(d)
}

/** dd/MM/yyyy HH:mm — dùng cho DateTimeOffset từ BE (changedAt, createdAt, ...) */
export function fmtDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: VN_TZ,
  }).format(d)
}

/** Lấy "YYYY-MM-DD" theo giờ VN từ một Date object (dùng trong DatePickerField) */
export function toVnDateString(date: Date): string {
  // en-CA gives YYYY-MM-DD format consistently
  return new Intl.DateTimeFormat('en-CA', { timeZone: VN_TZ }).format(date)
}

/** Parse "YYYY-MM-DD" thành Date tại midnight VN */
export function parseVnDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00+07:00')
}

/** Format số tiền VN: 1.000.000 */
export function fmtVnd(amount: number): string {
  return amount.toLocaleString('vi-VN')
}
