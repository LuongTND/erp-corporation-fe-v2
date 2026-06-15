import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Header /> */}
      <AppSidebar />
      <main className="flex-1 overflow-auto" style={{ backgroundColor: '#FAFAF8' }}>
        <Outlet />
      </main>
    </div>
  )
}
