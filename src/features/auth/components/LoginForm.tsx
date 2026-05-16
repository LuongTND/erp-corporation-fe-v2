import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Mail, KeyRound, Eye, EyeOff, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Lấy role từ URL param (khi user click từ Portal Page)
  const roleParam = searchParams.get('role')
  const expectedRole = roleParam || undefined

  // Hiển thị title dựa trên role
  const titleText = expectedRole
    ? `Đăng nhập — ${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)}`
    : 'Đăng nhập'
  const descText = expectedRole
    ? `Nhập thông tin để đăng nhập với vai trò ${expectedRole}.`
    : 'Nhập thông tin để đăng nhập vào hệ thống.'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: FormValues) => {

    console.log("Có call API không?", values)

    setIsLoading(true)
    try {
      await login(
        { email: values.email, password: values.password },
        expectedRole,
      )
    } catch {
      // Error đã được xử lý trong useAuth hook (toast.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border bg-primary/5">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{titleText}</CardTitle>
        <CardDescription>{descText}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  placeholder="••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          type="submit"
          form="login-form"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
        {expectedRole && (
          <a
            href="/portal"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Quay lại chọn vai trò
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
