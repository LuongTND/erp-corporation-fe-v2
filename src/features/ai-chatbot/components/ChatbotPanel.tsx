import { useState, useRef, useEffect } from 'react'
import { Bot, Maximize2, Minimize2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatbotMessage } from './ChatbotMessage'
import { ChatbotTypingIndicator } from './ChatbotTypingIndicator'
import { ChatbotSuggestions } from './ChatbotSuggestions'
import { ChatbotInput } from './ChatbotInput'
import { ROUTES } from '@/config/routes'
import {
  detectIntent,
  getBotResponse,
  getFollowUpSuggestions,
  INITIAL_SUGGESTIONS,
} from '../data/ai-responses.mock'
import type { ChatMessage, QuickSuggestion } from '../types/ai-chatbot.types'

interface ChatbotPanelProps {
  readonly onClose?: () => void
  readonly isFullScreen?: boolean
}

export function ChatbotPanel({ onClose, isFullScreen = false }: ChatbotPanelProps) {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: '👋 Xin chào! Tôi là trợ lý AI của DigiFNB. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<QuickSuggestion[]>(INITIAL_SUGGESTIONS)
  const [stringSuggestions, setStringSuggestions] = useState<string[]>([])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setSuggestions([])
    setStringSuggestions([])
    setIsTyping(true)

    // Simulate AI delay processing
    setTimeout(() => {
      const intent = detectIntent(text)
      const botReply = getBotResponse(intent)
      const followUps = getFollowUpSuggestions(intent)

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: botReply,
        timestamp: new Date().toISOString(),
        intent,
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
      setStringSuggestions(followUps)
    }, 1200 + Math.random() * 800) // 1.2s - 2.0s delay
  }

  const handleSuggestionSelect = (text: string) => {
    handleSendMessage(text)
  }

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Trợ lý AI DigiFNB</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
              </span>
              <p className="text-[10px] font-semibold text-emerald-600">Luôn sẵn sàng hỗ trợ</p>
            </div>
          </div>
        </div>

        {!isFullScreen && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
              onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.AI_CHATBOT)}
              aria-label="Mở toàn màn hình"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors duration-200"
                onClick={onClose}
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <ChatbotMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <ChatbotTypingIndicator />}
          
          {/* Active suggestions */}
          {!isTyping && suggestions.length > 0 && (
            <ChatbotSuggestions
              suggestions={suggestions.map(s => s.message)}
              onSelect={handleSuggestionSelect}
            />
          )}
          {!isTyping && stringSuggestions.length > 0 && (
            <ChatbotSuggestions
              suggestions={stringSuggestions}
              onSelect={handleSuggestionSelect}
            />
          )}

          <div ref={scrollRef} className="h-1" />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatbotInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
