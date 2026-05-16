import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Users, Briefcase, Shield, Layers } from 'lucide-react'
import { PORTAL_ROLES, type PortalRoleConfig } from '@/config/auth.config'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

// ──────────────────────────────────────────────────────────────
// Icon Mapping
// ──────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Crown,
  Users,
  Briefcase,
  Shield,
}

// ──────────────────────────────────────────────────────────────
// Role Card Component
// ──────────────────────────────────────────────────────────────

function RoleCard({ role, index }: { role: PortalRoleConfig; index: number }) {
  const Icon = ICON_MAP[role.icon] || Briefcase
  const animationDelay = `${index * 150}ms`

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
      style={{ animationDelay }}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={`/login?role=${role.id}`} className="block h-full outline-none">
              <Card className="group relative flex h-full flex-col overflow-hidden border-border transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl hover:shadow-primary/5 md:flex-row">
                {/* Icon Section */}
                <div className="relative flex w-full items-center justify-center overflow-hidden p-6 md:w-2/5 bg-muted/30">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col">
                  <CardHeader className="space-y-1 pb-2">
                    <Badge variant="secondary" className="w-fit mb-2 uppercase text-xs font-bold tracking-wider">
                      {role.id}
                    </Badge>
                    <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                      {role.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{role.subLabel}</p>
                  </CardHeader>

                  <CardContent className="flex-1 pt-2">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button
                      variant="link"
                      className="ml-auto flex items-end font-medium text-muted-foreground transition-colors hover:text-primary hover:no-underline p-0"
                    >
                      Truy cập
                      <ArrowRight className="ml-1 h-4 w-4 -translate-x-2 transition-all duration-300 group-hover:translate-x-0" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          </TooltipTrigger>

          <TooltipContent side="right" align="start" className="w-72">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Quyền hạn</h4>
              <Separator />
              <div className="grid gap-2">
                {role.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {perm}
                    </span>
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

// ──────────────────────────────────────────────────────────────
// Portal Page
// ──────────────────────────────────────────────────────────────

export default function PortalPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 transition-colors duration-500 md:p-8">
      {/* Header */}
      <div className="mb-12 space-y-3 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/20 transition-transform duration-300 hover:scale-105">
            <Layers className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Chọn vai trò truy cập</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Chọn vai trò phù hợp để đăng nhập vào hệ thống quản lý doanh nghiệp.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {PORTAL_ROLES.map((role, index) => (
          <RoleCard key={role.id} role={role} index={index} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-xs font-medium text-muted-foreground/60 animate-in fade-in duration-1000 delay-1000">
        ERP Corporation v2 © {new Date().getFullYear()}
      </div>
    </div>
  )
}
