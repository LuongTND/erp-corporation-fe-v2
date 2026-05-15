import { set, startOfDay, isBefore } from 'date-fns'
import type { TimeFormatType } from '../types/task.types'

export const DATE_FORMAT = 'MMM d, yyyy'
export const TIME_FORMAT_12 = 'h:mm aa'
export const TIME_FORMAT_24 = 'H:mm'

export function applyTimePreserved(base: Date | undefined, next: Date) {
  if (!base) return next
  return set(next, { hours: base.getHours(), minutes: base.getMinutes() })
}

export function getTimeFormatPattern(type: TimeFormatType) {
  return type === '24h' ? TIME_FORMAT_24 : TIME_FORMAT_12
}

export function isDateDisabled(date: Date) {
  return isBefore(date, startOfDay(new Date()))
}
