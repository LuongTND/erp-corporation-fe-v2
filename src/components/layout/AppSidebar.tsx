import { cn } from '@/lib/utils'
import {
  CheckSquare,
  Inbox,
  LayoutDashboard,
  Calendar,
  Settings,
  ChevronDown,
  Search,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/' },
  { icon: CheckSquare,    label: 'My Tasks',      href: '/tasks', badge: 9 },
  { icon: Inbox,          label: 'Inbox',         href: '/inbox' },
  { icon: Calendar,       label: 'Calendar',      href: '/calendar' },
]

const PROJECTS = [
  { label: 'Product Roadmap',    color: '#185FA5' },
  { label: 'Marketing Campaign', color: '#3C3489' },
  { label: 'Q3 Report',          color: '#3B6D11' },
  { label: 'Design System',      color: '#993C1D' },
]

const FAVORITES = [
  { label: 'Homepage Redesign', color: '#72243E' },
  { label: 'Sprint Planning',   color: '#B7770D' },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [favoritesOpen, setFavoritesOpen] = useState(true)

  return (
    <aside
      className="flex flex-col h-screen shrink-0 overflow-hidden"
      style={{ width: 240, backgroundColor: '#191919' }}
    >
      {/* Workspace header */}
      <button
        type="button"
        className="flex items-center gap-2 h-[52px] px-3 w-full transition-colors duration-[120ms] rounded-md mx-1 hover:bg-white/[0.06] cursor-pointer"
        style={{ color: '#E0E0E0' }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 text-white font-bold text-sm"
          style={{ backgroundColor: '#E8784A' }}
        >
          T
        </span>
        <span className="text-[13px] font-medium flex-1 text-left truncate" style={{ color: '#E0E0E0' }}>
          My Workspace
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0" style={{ color: '#666' }} />
      </button>

      {/* Search bar */}
      <div className="px-2 mb-1">
        <div
          className="flex items-center gap-2 h-[30px] px-2.5 rounded-md border text-[12px]"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.1)',
            color: '#555',
          }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search...</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="px-1 flex flex-col gap-0.5 mt-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
          const active = location.pathname === href
          return (
            <button
              key={href}
              type="button"
              onClick={() => navigate(href)}
              className={cn(
                'flex items-center gap-2 h-8 px-2 rounded-md w-full text-[13px] font-normal transition-colors duration-[120ms] cursor-pointer',
                active
                  ? 'border-l-2 pl-[6px]'
                  : 'border-l-2 border-transparent',
              )}
              style={
                active
                  ? {
                      backgroundColor: 'rgba(232, 120, 74, 0.15)',
                      color: '#E8784A',
                      borderColor: '#E8784A',
                    }
                  : {
                      color: '#999',
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.color = '#E0E0E0'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#999'
                }
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span
                  className="text-[10px] font-medium rounded-full px-1.5 py-px leading-none"
                  style={{ backgroundColor: '#E8784A', color: '#fff' }}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Projects */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setProjectsOpen((v) => !v)}
          className="flex items-center gap-1 w-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.06em] cursor-pointer transition-colors duration-[120ms]"
          style={{ color: '#555' }}
        >
          <ChevronDown
            className="h-3 w-3 shrink-0 transition-transform duration-200"
            style={{ transform: projectsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
          Projects
        </button>
        {projectsOpen && (
          <div className="px-1 flex flex-col gap-px">
            {PROJECTS.map(({ label, color }) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-2 h-7 px-2 rounded-md w-full text-[12px] transition-colors duration-[120ms] cursor-pointer"
                style={{ color: '#888' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLElement).style.color = '#CCC'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#888'
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Favorites */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setFavoritesOpen((v) => !v)}
          className="flex items-center gap-1 w-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.06em] cursor-pointer"
          style={{ color: '#555' }}
        >
          <Star className="h-3 w-3 shrink-0" />
          Favorites
        </button>
        {favoritesOpen && (
          <div className="px-1 flex flex-col gap-px">
            {FAVORITES.map(({ label, color }) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-2 h-7 px-2 rounded-md w-full text-[12px] transition-colors duration-[120ms] cursor-pointer"
                style={{ color: '#888' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLElement).style.color = '#CCC'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#888'
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User row */}
      <div
        className="flex items-center gap-2 h-10 px-3 mt-1"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        <span
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0"
          style={{ backgroundColor: '#E8784A' }}
        >
          MT
        </span>
        <span className="text-[12px] flex-1 truncate" style={{ color: '#BBB' }}>
          My Account
        </span>
        <Settings className="h-3.5 w-3.5 shrink-0" style={{ color: '#666' }} />
      </div>
    </aside>
  )
}
