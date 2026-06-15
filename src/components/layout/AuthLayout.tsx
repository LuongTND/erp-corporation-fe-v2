import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <div className="flex flex-1 items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  )
}
