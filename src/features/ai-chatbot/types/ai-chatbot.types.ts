// ── AI Chatbot Domain Types ────────────────────────────────────────────────

export type MessageRole = 'user' | 'bot'
export type BotIntent =
  | 'product_info'
  | 'pricing'
  | 'order_help'
  | 'formula'
  | 'promotion'
  | 'complaint'
  | 'greeting'
  | 'fallback'

export interface ChatMessage {
  readonly id: string
  readonly role: MessageRole
  readonly content: string
  readonly timestamp: string
  readonly intent?: BotIntent
  readonly suggestions?: readonly string[]
}

export interface QuickSuggestion {
  readonly label: string
  readonly message: string
}
