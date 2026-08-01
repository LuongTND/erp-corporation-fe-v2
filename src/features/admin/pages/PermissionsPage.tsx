import { useState } from 'react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissions } from '../hooks/use-permissions'

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = usePermissions({ Top: 200, SearchText: search || undefined, NeedTotalCount: true })

  // Group by resource prefix
  const grouped = (data?.items ?? []).reduce<Record<string, NonNullable<typeof data>['items']>>((acc, p) => {
    const resource = p.permissionCode.split(':')[0] ?? 'other'
    ;(acc[resource] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Permissions', isActive: true },
        ]}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Permissions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Auto-seeded from API attributes · {data?.totalCount ?? 0} total
            </p>
          </div>
          <Input
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([resource, permissions]) => (
              <div key={resource} className="rounded-lg border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{resource}</span>
                  <Badge variant="secondary" className="text-[10px]">{permissions.length}</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission Code</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => {
                      const action = permission.permissionCode.split(':')[1] ?? ''
                      return (
                        <TableRow key={permission.id}>
                          <TableCell className="font-mono text-sm">{permission.permissionCode}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{action}</TableCell>
                          <TableCell>
                            {permission.isActive
                              ? <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400">Active</Badge>
                              : <Badge variant="destructive">Inactive</Badge>
                            }
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
            {Object.keys(grouped).length === 0 && (
              <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
                No permissions found. Start the API to auto-seed permissions.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
