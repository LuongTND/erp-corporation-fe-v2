import { z } from 'zod'

export const getLoginSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email({ message: t('login.validation.emailInvalid') }),
    password: z.string().min(6, { message: t('login.validation.passwordMin') }),
    rememberMe: z.boolean().optional(),
  })
}

export type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>
