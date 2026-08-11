import { FileText, Image, Film, Archive, File } from 'lucide-react'

export function FileIcon({ contentType, className }: { contentType: string; className?: string }) {
  if (contentType.startsWith('image/')) return <Image className={className} />
  if (contentType.startsWith('video/')) return <Film className={className} />
  if (contentType === 'application/pdf') return <FileText className={className} />
  if (contentType.includes('zip') || contentType.includes('rar')) return <Archive className={className} />
  return <File className={className} />
}
