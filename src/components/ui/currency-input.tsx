import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// VND: groups of 3 digits separated by dots, no decimals (1.000.000 ₫)
const fmt = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value?: number
  onChange: (val: number | undefined) => void
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false)

  const display = focused
    ? (value != null ? String(value) : '')
    : (value ? fmt.format(value) + ' ₫' : '')

  return (
    <Input
      {...props}
      inputMode="numeric"
      className={cn('tabular-nums', className)}
      value={display}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, '')
        onChange(raw ? Number(raw) : undefined)
      }}
    />
  )
}
