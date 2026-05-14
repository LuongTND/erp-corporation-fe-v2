import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar — sẽ build sau */}
      <aside className="w-64 border-r bg-background" />
      <main className="flex-1 overflow-auto p-6 bg-background">
        <Outlet />
      </main>
    </div>
  )
}
