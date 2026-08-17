import { Home, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { StoreMemberResponse } from '@/features/admin/types/admin.types'

function userInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface MembersCardProps {
  readonly members: StoreMemberResponse[]
  readonly isLoading: boolean
}

export function MembersCard({ members, isLoading }: MembersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Nhân sự biên chế ({members.length})
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 py-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground italic px-6 py-4">Chưa có nhân sự biên chế</p>
        ) : (
          <>
            {members.map((member, index) => (
              <div key={member.userStoreId}>
                {index > 0 && <Separator />}
                <div className="flex items-center gap-3 px-6 py-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="text-xs font-medium">{userInitials(member.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate leading-none">{member.fullName}</p>
                      {member.isHomeStore && (
                        <Badge variant="outline" className="text-[10px] gap-1 py-0 px-1.5 font-normal shrink-0 h-4">
                          <Home className="h-2 w-2" />Chính
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {member.employeeCode}{member.jobLevelName ? ` · ${member.jobLevelName}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
