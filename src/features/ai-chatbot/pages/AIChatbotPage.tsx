import { Bot } from 'lucide-react'
import { ChatbotPanel } from '../components/ChatbotPanel'

export default function AIChatbotPage() {
  return (
    <div className="flex h-full flex-col bg-background p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Trợ lý AI DigiFNB
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Hỗ trợ giải đáp thắc mắc, tư vấn sản phẩm và công thức 24/7
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* We reuse the ChatbotPanel but pass isFullScreen=true to hide close buttons */}
        <ChatbotPanel isFullScreen />
      </div>
    </div>
  )
}

