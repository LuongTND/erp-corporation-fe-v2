import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Users, Briefcase, Shield, Layers } from 'lucide-react'
import { PORTAL_ROLES, type PortalRoleConfig } from '@/config/auth.config'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

const ICON_MAP: Record<string, React.ElementType> = {
  Crown,
  Users,
  Briefcase,
  Shield,
}

function RoleCard({ role, index }: { role: PortalRoleConfig; index: number }) {
  const Icon = ICON_MAP[role.icon] || Briefcase

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={`/login?role=${role.id}`} className="group flex flex-col rounded-xl border border-border bg-card p-5 outline-none transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
              {/* Icon + Badge row */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-widest">
                  {role.id}
                </Badge>
              </div>

              {/* Title + subtitle */}
              <h3 className="text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
                {role.label}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground/70">
                {role.subLabel}
              </p>

              {/* Description */}
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {role.description}
              </p>

              {/* CTA */}
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                Truy cập
                <ArrowRight className="h-4 w-4 -translate-x-1 transition-transform duration-200 group-hover:translate-x-0" />
              </div>
            </Link>
          </TooltipTrigger>

          <TooltipContent side="bottom" align="start" className="w-64">
            <div className="space-y-2">
              <p className="text-xs font-semibold">Quyền hạn</p>
              <Separator />
              <div className="grid gap-1.5">
                {role.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default function PortalPage() {
  return (
    <div className="flex-1 w-full bg-background transition-colors duration-500">
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-8 md:px-8">

        {/* Header */}
        <div className="mb-6 space-y-3 text-center animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="mb-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/25 transition-transform duration-300 hover:scale-105">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Chọn vai trò truy cập</h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground md:max-w-md md:text-base">
            Chọn vai trò phù hợp để đăng nhập vào hệ thống quản lý doanh nghiệp.
          </p>
        </div>

        {/* Role Cards — 1 col mobile / 2 col tablet / 3 col desktop */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PORTAL_ROLES.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs font-medium text-muted-foreground/50 animate-in fade-in duration-1000 delay-700">
          ERP Corporation v2 © {new Date().getFullYear()}
        </div>

      </div>
    </div>
  )
}
