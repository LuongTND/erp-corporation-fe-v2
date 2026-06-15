import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export default function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — sẽ build sau */}
        {/* <aside className="w-64 border-r bg-background" /> */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
