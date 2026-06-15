export interface Member {
  id: string
  name: string
  avatar?: string
  role?: string
}

export interface SidebarItemData {
  id: string
  name: string
  type: 'direct' | 'group'
  avatar?: string
  subText?: string
  totalMembers?: number
  members?: Member[]
}
