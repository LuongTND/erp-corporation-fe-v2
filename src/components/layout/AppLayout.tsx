import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background text-foreground">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
