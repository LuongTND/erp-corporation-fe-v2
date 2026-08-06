import { Outlet } from 'react-router-dom'
import { PublicHeader } from './PublicHeader'

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <PublicHeader />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
