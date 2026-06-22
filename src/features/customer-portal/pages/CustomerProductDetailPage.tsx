import { useState } from 'react'
import { ChevronRight, Star, Minus, Plus, ShoppingCart, Award, RefreshCw, Globe, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// Mock thumbnails for Toschi Caramel
const IMAGES = [
  'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&h=600&q=80',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=600&q=80',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&h=600&q=80',
]

// Wholesale tiered prices
const WHOLESALE_TIERS = [
  { minQty: 1, maxQty: 2, price: 285000 },
  { minQty: 3, maxQty: 5, price: 270000 },
  { minQty: 6, maxQty: 11, price: 255000 },
  { minQty: 12, maxQty: null, price: 240000 },
]

// Mock related products
const RELATED_PRODUCTS = [
  {
    id: 'p7',
    name: 'Siro Bạc Hà Trắng Toschi 1000ml',
    brand: 'Toschi (Ý)',
    price: 275000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'p11',
    name: 'Sốt Pomona Socola Trắng Lỏng 2kg',
    brand: 'Pomona (Hàn Quốc)',
    price: 295000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'p5',
    name: 'Mứt Dâu Tây Tây Nguyên Puree 1L',
    brand: 'Ezmix (Việt Nam)',
    price: 135000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=150&h=150&q=80',
  },
]

// Mock Recipes suggested
const RECIPES = [
  {
    name: 'Caramel Macchiato Đá',
    ingredients: 'Espresso (60ml), Siro Toschi Caramel (15ml), Sữa tươi không đường (120ml), Bọt sữa & Sốt caramel phủ.',
    steps: 'Cho siro caramel vào đáy ly. Thêm đá viên. Rót sữa tươi lên trên. Rót nhẹ espresso tạo tầng. Phủ bọt sữa và trang trí sốt caramel.',
  },
  {
    name: 'Trà Sữa Caramel Trân Châu',
    ingredients: 'Cốt hồng trà (150ml), Bột sữa béo Master (20g), Siro Toschi Caramel (25ml), Trân châu hoàng kim Ezmix (50g).',
    steps: 'Hòa tan bột sữa béo vào cốt trà nóng. Thêm siro caramel khuấy đều. Thêm đá và lắc kỹ. Rót ra ly có sẵn trân châu hoàng kim.',
  },
  {
    name: 'Sinh Tố Caramel Chuối',
    ingredients: 'Chuối chín (1 quả), Siro Toschi Caramel (20ml), Sữa tươi (80ml), Sữa đặc (10ml), Đá viên.',
    steps: 'Cho tất cả nguyên liệu vào máy xay sinh tố. Xay mịn đến khi đồng nhất. Rót ra ly, rưới thêm một ít siro caramel lên mặt để trang trí.',
  },
]

export default function CustomerProductDetailPage() {
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Determine current unit price from tiers based on quantity selected
  const getCurrentPrice = () => {
    const matchedTier = WHOLESALE_TIERS.find(
      (tier) => quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
    )
    return matchedTier ? matchedTier.price : 285000
  }

  const currentPrice = getCurrentPrice()

  const handleQtyChange = (type: 'inc' | 'dec') => {
    if (type === 'dec') {
      setQuantity((q) => Math.max(1, q - 1))
    } else {
      setQuantity((q) => q + 1)
    }
  }

  const handleAddToCart = () => {
    toast.success(`Đã thêm ${quantity} Chai Siro Toschi Caramel vào đơn đặt hàng với giá sỉ tốt nhất!`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-t-text-muted font-medium px-1">
        <span>Nguyên liệu</span>
        <ChevronRight className="h-3 w-3" />
        <span>Siro</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-t-text-primary">Toschi Caramel 1000ml</span>
      </nav>

      {/* Main detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Images (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4 p-5 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-t-bg-hover border border-t-border/50">
            <img
              src={IMAGES[activeImageIdx]}
              alt="Toschi Caramel Syrup"
              className="h-full w-full object-cover transition-all duration-300"
            />
          </div>
          <div className="flex gap-3">
            {IMAGES.map((img, idx) => (
              <button
                key={idx}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === activeImageIdx ? 'border-t-accent shadow-sm' : 'border-t-border opacity-70 hover:opacity-100'
                }`}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column: Specs & Actions (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-5 p-5 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm">
          <div>
            <span className="text-xs text-t-accent font-bold tracking-wide uppercase">Toschi (Ý)</span>
            <h1 className="text-2xl font-black text-t-text-primary font-display mt-0.5 leading-tight">
              Siro Toschi Caramel 1000ml
            </h1>
            <p className="text-xs text-t-text-muted mt-1 font-semibold">SKU: TO-CRM-1000 | Xuất xứ: Ý</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-t-accent tracking-tight">
              {currentPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-sm text-t-text-secondary/80 font-bold">/ Chai</span>
            {quantity >= 3 && (
              <Badge className="bg-t-priority-high-bg text-t-priority-high-text font-black rounded-lg border-none hover:bg-t-priority-high-bg shadow-sm">
                Đang áp dụng giá sỉ
              </Badge>
            )}
          </div>

          {/* Wholesale Tier Pricing Table */}
          <div className="rounded-xl border border-t-border overflow-hidden">
            <div className="grid grid-cols-3 bg-t-bg-hover text-xs font-bold text-t-text-secondary px-4 py-2 border-b border-t-border">
              <span>Số lượng (Chai)</span>
              <span className="text-center">Đơn giá sỉ</span>
              <span className="text-right">Tiết kiệm</span>
            </div>
            <div className="flex flex-col text-xs font-semibold text-t-text-primary">
              {WHOLESALE_TIERS.map((tier, idx) => {
                const isActive = quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-3 px-4 py-2.5 border-b border-t-border/40 last:border-b-0 items-center ${
                      isActive ? 'bg-t-accent-subtle/50 text-t-accent font-bold' : ''
                    }`}
                  >
                    <span>
                      {tier.maxQty ? `${tier.minQty} - ${tier.maxQty}` : `>= ${tier.minQty}`}
                    </span>
                    <span className="text-center">{tier.price.toLocaleString('vi-VN')}đ</span>
                    <span className="text-right text-t-text-muted/80">
                      {idx === 0 ? '-' : `Giảm ${((285000 - tier.price) / 285).toFixed(0)}%`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-t-text-secondary mb-1">Mô tả ngắn</p>
            <p className="text-sm text-t-text-muted leading-relaxed">
              Siro Caramel Toschi có màu hổ phách đậm đà cùng hương thơm đặc trưng của đường thắng, đem lại vị ngọt đắng hài hòa hoàn hảo cho các món cà phê Macchiato, sinh tố và đá xay cao cấp.
            </p>
          </div>

          {/* Adjust quantity and Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
            <div className="flex items-center rounded-xl border border-t-border bg-t-bg-hover overflow-hidden shrink-0">
              <button
                className="h-10 w-10 flex items-center justify-center hover:bg-t-border/50 text-t-text-secondary active:scale-90"
                onClick={() => handleQtyChange('dec')}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                className="h-10 w-14 bg-transparent border-0 text-center text-sm font-bold focus:ring-0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              />
              <button
                className="h-10 w-10 flex items-center justify-center hover:bg-t-border/50 text-t-text-secondary active:scale-90"
                onClick={() => handleQtyChange('inc')}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              className="w-full h-10 rounded-xl bg-t-accent hover:bg-t-accent/95 text-white font-bold gap-2 shadow-sm transition-all"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              Thêm vào đơn hàng
            </Button>
          </div>

          {/* Info Tags */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-t-border/40 text-xs">
            <span className="flex items-center gap-1 text-t-text-secondary/80 font-bold bg-t-bg-hover px-2.5 py-1 rounded-lg">
              <Award className="h-3.5 w-3.5 text-t-accent" /> Hãng Toschi
            </span>
            <span className="flex items-center gap-1 text-t-text-secondary/80 font-bold bg-t-bg-hover px-2.5 py-1 rounded-lg">
              <Globe className="h-3.5 w-3.5 text-t-accent" /> Xuất xứ Ý
            </span>
            <span className="flex items-center gap-1 text-t-text-secondary/80 font-bold bg-t-bg-hover px-2.5 py-1 rounded-lg">
              <RefreshCw className="h-3.5 w-3.5 text-t-accent" /> HSD 24 Tháng
            </span>
          </div>
        </div>
      </div>

      {/* Tabs and Related layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Bottom Details Tabs (Col Span 3) */}
        <div className="lg:col-span-3 p-5 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-3 bg-t-bg-hover p-1 rounded-xl mb-4 border border-t-border/30">
              <TabsTrigger value="description" className="rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-t-accent transition-all">Mô tả sản phẩm</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-t-accent transition-all">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="recipes" className="rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-t-accent transition-all">Gợi ý pha chế</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="text-sm text-t-text-muted leading-relaxed space-y-3">
              <p>
                Toschi Syrup là thương hiệu nguyên liệu pha chế hàng đầu từ vùng Emilia-Romagna (Ý) với hơn 75 năm lịch sử. Được làm từ nước ép trái cây cô đặc tự nhiên và đường mía chất lượng cao, siro Toschi giữ trọn vẹn hương vị caramel nguyên bản ngọt thơm tinh khiết, mang lại chất lượng pha chế cao cấp đồng đều.
              </p>
              <p>
                Sản phẩm được các barista và bartender chuyên nghiệp ưa chuộng sử dụng rộng rãi cho các thức uống Horeca nhằm nâng cao giá trị ly nước uống phục vụ khách hàng.
              </p>
            </TabsContent>

            <TabsContent value="specs" className="text-sm text-t-text-primary">
              <div className="flex flex-col border border-t-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 px-4 py-2 border-b border-t-border/60 bg-t-bg-hover font-bold text-xs text-t-text-secondary">
                  <span>Thông số</span>
                  <span>Chi tiết</span>
                </div>
                <div className="grid grid-cols-2 px-4 py-2.5 border-b border-t-border/40 text-xs font-semibold">
                  <span className="text-t-text-secondary font-bold">Quy cách đóng gói</span>
                  <span>Chai thủy tinh 1000ml (1 Thùng = 6 Chai)</span>
                </div>
                <div className="grid grid-cols-2 px-4 py-2.5 border-b border-t-border/40 text-xs font-semibold">
                  <span className="text-t-text-secondary font-bold">Thành phần</span>
                  <span>Đường mía, nước, hương caramel tự nhiên, axit citric</span>
                </div>
                <div className="grid grid-cols-2 px-4 py-2.5 text-xs font-semibold">
                  <span className="text-t-text-secondary font-bold">Điều kiện bảo quản</span>
                  <span>Nơi khô ráo thoáng mát, bảo quản tủ mát sau khi mở nắp</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recipes" className="space-y-4">
              {RECIPES.map((recipe, idx) => (
                <div key={idx} className="p-4 border border-t-border bg-t-bg-hover/30 rounded-xl">
                  <h4 className="text-sm font-bold text-t-accent tracking-tight mb-1">{recipe.name}</h4>
                  <p className="text-xs text-t-text-primary font-semibold mb-2">
                    <span className="text-t-text-secondary font-black">Nguyên liệu:</span> {recipe.ingredients}
                  </p>
                  <p className="text-xs text-t-text-muted leading-relaxed">
                    <span className="text-t-text-secondary font-black">Các bước thực hiện:</span> {recipe.steps}
                  </p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sticky Sidebar: Related Products (Col Span 1) */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-4 p-4 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-t-text-secondary px-1">Sản phẩm liên quan</p>
          <div className="flex flex-col gap-3">
            {RELATED_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2 rounded-xl border border-t-border/50 hover:bg-t-bg-hover/20 hover:scale-[1.02] cursor-pointer transition-all group"
              >
                <div className="h-14 w-14 overflow-hidden rounded-lg bg-t-bg-hover border border-t-border/30 shrink-0">
                  <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-t-text-primary group-hover:text-t-accent transition-colors line-clamp-2 leading-tight">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-t-text-muted mt-0.5 font-medium">{prod.brand}</p>
                  <p className="text-xs font-extrabold text-t-accent mt-1 tracking-tight">
                    {prod.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
