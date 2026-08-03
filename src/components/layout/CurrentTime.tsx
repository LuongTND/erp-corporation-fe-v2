import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CurrentTimeProps {
  className?: string
}

export function CurrentTime({ className }: CurrentTimeProps) {
  const [date, setDate] = useState<Date | null>(null)

  useEffect(() => {
    setDate(new Date())
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!date) return null

  const currentLocale = 'vi-VN'

  const timeStr = new Intl.DateTimeFormat(currentLocale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)

  const dateStr = new Intl.DateTimeFormat(currentLocale, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  return (
    <div className={cn('flex flex-col items-end leading-none', className)}>
      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {timeStr}
      </span>
      <span className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">
        {dateStr}
      </span>
    </div>
  )
}
