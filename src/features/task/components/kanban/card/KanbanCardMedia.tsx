interface KanbanCardMediaProps {
  src: string
  alt: string
}

export function KanbanCardMedia({ src, alt }: KanbanCardMediaProps) {
  return (
    <div className="relative w-full aspect-[2/1] rounded-md overflow-hidden border border-border/50 mb-1">
      <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy" />
    </div>
  )
}
