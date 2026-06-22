import type { BotIntent, QuickSuggestion } from '../types/ai-chatbot.types'

// Keyword → intent mapping for simple NLP simulation
export const INTENT_KEYWORDS: Record<BotIntent, string[]> = {
  greeting: ['xin chào', 'hello', 'hi', 'chào', 'chào bạn', 'helo'],
  product_info: ['sản phẩm', 'product', 'thông tin', 'mô tả', 'thành phần', 'đặc điểm', 'loại', 'dòng'],
  pricing: ['giá', 'bao nhiêu', 'chi phí', 'price', 'báo giá', 'cost', 'tiền', 'đơn giá'],
  order_help: ['đặt hàng', 'order', 'mua', 'tạo đơn', 'đơn hàng', 'giao hàng', 'vận chuyển', 'shipping'],
  formula: ['công thức', 'formula', 'cách dùng', 'hướng dẫn', 'mix', 'pha trộn', 'tỷ lệ', 'recipe'],
  promotion: ['ưu đãi', 'khuyến mãi', 'giảm giá', 'promo', 'discount', 'voucher', 'mã giảm', 'deal'],
  complaint: ['khiếu nại', 'lỗi', 'sai', 'hỏng', 'không hài lòng', 'complaint', 'vấn đề', 'sự cố'],
  fallback: [],
}

// Responses per intent (randomized to feel more natural)
export const BOT_RESPONSES: Record<BotIntent, string[]> = {
  greeting: [
    '👋 Xin chào! Tôi là trợ lý AI của DigiFNB. Tôi có thể hỗ trợ bạn về sản phẩm, đơn hàng, công thức và ưu đãi. Bạn cần hỗ trợ gì hôm nay?',
    '😊 Chào bạn! Rất vui được gặp bạn. Tôi sẵn sàng hỗ trợ bạn 24/7. Bạn cần tìm hiểu về điều gì?',
  ],
  product_info: [
    '📦 Chúng tôi hiện có **5 dòng sản phẩm chính**:\n\n• **Sản phẩm A Premium** — Chất lượng cao cấp, phù hợp phân khúc cao\n• **Sản phẩm B Standard** — Cân bằng chất lượng và giá cả\n• **Sản phẩm C Special** — Phiên bản đặc biệt theo mùa\n• **Sản phẩm D Exclusive** — Dòng độc quyền giới hạn\n• **Sản phẩm E Basic** — Kinh tế, phù hợp số lượng lớn\n\nBạn muốn biết thêm về sản phẩm nào?',
    '🔍 Danh mục sản phẩm của chúng tôi bao gồm nhiều dòng từ phổ thông đến cao cấp. Mỗi sản phẩm đều có chứng nhận chất lượng và xuất xứ rõ ràng. Bạn quan tâm đến dòng nào cụ thể?',
  ],
  pricing: [
    '💰 Bảng giá tham khảo hiện tại:\n\n| Sản phẩm | Đơn giá |\n|---|---|\n| A Premium | 180,000đ/thùng |\n| B Standard | 140,000đ/thùng |\n| C Special | 225,000đ/thùng |\n| D Exclusive | 210,000đ/thùng |\n| E Basic | 70,000đ/thùng |\n\n*Giá chưa bao gồm ưu đãi theo tier của bạn. Khách hàng Gold được giảm thêm **10%**!*',
    '📊 Giá được điều chỉnh theo số lượng và tier khách hàng. Với tư cách là khách hàng **Gold**, bạn đang hưởng mức chiết khấu **10%** trên tất cả sản phẩm. Muốn tôi tính giá cho đơn cụ thể không?',
  ],
  order_help: [
    '🛒 Để đặt hàng, bạn có thể:\n\n1. Vào **Cổng Khách hàng → Đơn hàng** và nhấn **"Tạo đơn mới"**\n2. Chọn sản phẩm và số lượng cần thiết\n3. Nhập địa chỉ giao hàng\n4. Xác nhận đơn — Đội ngũ của chúng tôi sẽ xử lý trong **2-4 giờ làm việc**\n\nBạn có muốn tôi hướng dẫn chi tiết hơn không?',
    '📝 Đặt hàng rất đơn giản! Vào mục **Đơn hàng** trên menu, nhấn nút cam **"Tạo đơn mới"** và điền thông tin. Thời gian xử lý thông thường 2-4h, giao hàng 1-3 ngày tùy khu vực.',
  ],
  formula: [
    '🧪 **Hướng dẫn công thức pha trộn cơ bản:**\n\nCông thức Standard Mix:\n• Sản phẩm A Premium: 60%\n• Sản phẩm B Standard: 40%\n\nCông thức Premium Blend:\n• Sản phẩm A Premium: 70%\n• Sản phẩm C Special: 30%\n\n💡 *Tỷ lệ có thể điều chỉnh tùy theo nhu cầu cụ thể. Muốn tôi tư vấn công thức riêng cho bạn không?*',
    '📋 Tôi có thể tư vấn công thức phù hợp với nhu cầu của bạn! Bạn đang cần công thức cho ứng dụng gì? (Vui lòng mô tả cụ thể hơn để tôi hỗ trợ tốt nhất)',
  ],
  promotion: [
    '🎁 Ưu đãi hiện có cho bạn:\n\n🟠 **GOLD1024** — Giảm 10% đơn từ 10 triệu (HSD: 31/10)\n📦 **BUNDLE50** — Mua 50 tặng 5 thùng (HSD: 15/11)\n💸 **FLASH48** — Giảm 500K đơn từ 8 triệu (HSD: 31/10)\n🎂 **BDAY24** — Quà sinh nhật tháng này!\n\nXem đầy đủ tại **Cổng Khách hàng → Ưu đãi**.',
    '✨ Bạn đang có **4 ưu đãi chưa sử dụng** trong tháng này! Bao gồm giảm giá 10-12%, tặng sản phẩm và hoàn tiền điểm thưởng. Vào mục **Ưu đãi** để xem chi tiết và sao chép mã.',
  ],
  complaint: [
    '😟 Tôi rất tiếc về trải nghiệm chưa tốt của bạn. Để xử lý nhanh nhất, vui lòng cung cấp:\n\n1. Mã đơn hàng liên quan\n2. Mô tả vấn đề cụ thể\n3. Ảnh chụp (nếu có)\n\nTôi sẽ **chuyển ngay cho nhân viên phụ trách** để liên hệ lại trong vòng **30 phút** trong giờ hành chính.',
    '🙏 Cảm ơn bạn đã phản hồi. Tôi đã ghi nhận và sẽ chuyển đến bộ phận hỗ trợ khách hàng ngay. Bạn cũng có thể gọi hotline **1800-xxxx** để được hỗ trợ trực tiếp (T2-T6, 8h-17h30).',
  ],
  fallback: [
    '🤔 Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi tôi về:\n\n• **Sản phẩm** — thông tin, đặc tính\n• **Giá cả** — báo giá, chiết khấu\n• **Đặt hàng** — quy trình, theo dõi đơn\n• **Công thức** — hướng dẫn pha trộn\n• **Ưu đãi** — khuyến mãi hiện hành\n\nHoặc tôi có thể **kết nối bạn với nhân viên** ngay bây giờ!',
    '💬 Câu hỏi của bạn có vẻ cần tư vấn chuyên sâu hơn. Để đảm bảo bạn nhận được hỗ trợ tốt nhất, bạn có muốn tôi **chuyển đến nhân viên Sale** phụ trách không?',
  ],
}

export const INITIAL_SUGGESTIONS: QuickSuggestion[] = [
  { label: '📦 Xem sản phẩm', message: 'Cho tôi xem danh sách sản phẩm' },
  { label: '💰 Bảng giá', message: 'Bảng giá các sản phẩm hiện tại là bao nhiêu?' },
  { label: '🛒 Đặt hàng', message: 'Hướng dẫn tôi cách đặt hàng' },
  { label: '🧪 Công thức', message: 'Tư vấn công thức pha trộn cho tôi' },
  { label: '🎁 Ưu đãi', message: 'Tôi có những ưu đãi gì?' },
]

export function detectIntent(text: string): BotIntent {
  const lower = text.toLowerCase()
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [BotIntent, string[]][]) {
    if (intent === 'fallback') continue
    if (keywords.some((kw) => lower.includes(kw))) return intent
  }
  return 'fallback'
}

export function getBotResponse(intent: BotIntent): string {
  const responses = BOT_RESPONSES[intent]
  return responses[Math.floor(Math.random() * responses.length)]
}

export function getFollowUpSuggestions(intent: BotIntent): string[] {
  const map: Partial<Record<BotIntent, string[]>> = {
    product_info: ['Giá sản phẩm A Premium?', 'Sản phẩm nào phù hợp số lượng lớn?'],
    pricing: ['Tôi có ưu đãi giảm giá gì?', 'Đặt 100 thùng giá bao nhiêu?'],
    order_help: ['Theo dõi đơn hàng của tôi', 'Thời gian giao hàng bao lâu?'],
    formula: ['Công thức Premium Blend', 'Có thể tùy chỉnh tỷ lệ không?'],
    promotion: ['Cách dùng mã GOLD1024?', 'Ưu đãi nào hết hạn sớm nhất?'],
  }
  return map[intent] ?? ['Hỏi thêm về sản phẩm', 'Xem ưu đãi hiện có', 'Kết nối nhân viên']
}
