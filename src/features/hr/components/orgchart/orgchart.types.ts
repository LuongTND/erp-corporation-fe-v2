export interface OrgPerson {
  id: string
  name: string
  initials: string
  title: string
  department: string
  email: string
  phone: string
  location: string
  joinDate: string
  reportsToId?: string
  children: OrgPerson[]
}

export interface DeptConfig {
  dot: string
  avatarBg: string
  avatarText: string
  badgeBg: string
  badgeText: string
}
