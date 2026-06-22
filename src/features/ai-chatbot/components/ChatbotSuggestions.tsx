import { Button } from '@/components/ui/button'

interface ChatbotSuggestionsProps {
  readonly suggestions: readonly string[]
  readonly onSelect: (text: string) => void
}

export function ChatbotSuggestions({ suggestions, onSelect }: ChatbotSuggestionsProps) {
  if (!suggestions.length) return null

  return (
    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in-50 duration-500">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal rounded-full border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-95"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

