import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md bg-background p-8 rounded-2xl shadow-sm border">
        <LoginForm />
      </div>
    </div>
  )
}
