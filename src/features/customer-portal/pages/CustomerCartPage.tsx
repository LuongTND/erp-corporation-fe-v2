import { useState } from 'react'
import { ShoppingCart, Trash2, ShieldCheck, ChevronRight, FileText, Send, Save, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ROUTES } from '@/config/routes'

// Initial cart items grouped by category
interface CartItem {
  id: string
  name: string
  sku: string
  category: string
  categoryLabel: string
  image: string
  price: number
  quantity: number
  unit: string
}

const INITIAL_CART: CartItem[] = [
  // Category: Siro
  {
    id: 'p1',
    name: 'Siro Toschi Caramel 1000ml',
    sku: 'TO-CRM-1000',
    category: 'siro',
    categoryLabel: 'Siro (Syrup)',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=150&h=150&q=80',
    price: 270000, // Tier price for 3 bottles
    quantity: 3,
    unit: 'Chai',
  },
  {
    id: 'p2',
    name: 'Siro Pomona Đào Nhật Bản 1000ml',
    sku: 'PM-PEH-1000',
    category: 'siro',
    categoryLabel: 'Siro (Syrup)',
    image: 'https://images.unsplash.com/photo-1589733901241-5e39127b53e8?auto=format&fit=crop&w=150&h=150&q=80',
    price: 260000,
    quantity: 2,
    unit: 'Chai',
  },
  // Category: Bột
  {
    id: 'p3',
    name: 'Bột Trà Xanh Uji Matcha Nhật Bản 500g',
    sku: 'UJ-MTC-500',
    category: 'bot',
    categoryLabel: 'Bột pha chế',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=150&h=150&q=80',
    price: 320000,
    quantity: 2,
    unit: 'Gói',
  },
  {
    id: 'p8',
    name: 'Bột Sữa Thực Vật Master 1kg',
    sku: 'MT-MLK-1000',
    category: 'bot',
    categoryLabel: 'Bột pha chế',
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=150&h=150&q=80',
    price: 95000,
    quantity: 5,
    unit: 'Gói',
  },
  {
    id: 'p6',
    name: 'Trân Châu Hoàng Kim Ezmix 3kg',
    sku: 'EZ-PKM-3000',
    category: 'topping',
    categoryLabel: 'Topping & Thạch',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=150&h=150&q=80',
    price: 85000,
    quantity: 4,
    unit: 'Bao',
  },
]

export default function CustomerCartPage() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART)
  const [note, setNote] = useState('')
  const navigate = useNavigate()

  const handleQtyChange = (id: string, qty: number) => {
    if (qty < 1) return
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    )
  }

  const handleDeleteItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
    toast.info('Đã xóa sản phẩm khỏi giỏ hàng.')
  }

  const handleCheckout = () => {
    toast.success('Đơn hàng của bạn đã được xác nhận gửi đi thành công!')
    setCart([])
    navigate(ROUTES.CUSTOMER_PORTAL.ORDERS)
  }

  const handleSaveDraft = () => {
    toast.info('Đã lưu nháp giỏ hàng hiện tại.')
  }

  // Calculate stats
  const totalSkus = cart.length
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Shipping rule: free if > 1,000,000 VND
  const shippingFee = subtotal > 1000000 ? 0 : 50000
  const vat = Math.round(subtotal * 0.1)
  const finalTotal = subtotal + shippingFee + vat

  // Group items by category label
  const categoriesInCart = Array.from(new Set(cart.map((item) => item.categoryLabel)))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to={ROUTES.CUSTOMER_PORTAL.CATALOG}>
          <Button variant="ghost" size="icon" className="rounded-xl border border-border h-9 w-9 text-t-text-secondary hover:text-t-text-primary">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Giỏ hàng của tôi</h1>
          <p className="text-xs text-t-text-muted mt-0.5 font-medium">
            Có {totalSkus} nguyên liệu ({totalQty} đơn vị) trong giỏ hàng
          </p>
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Area (70%): Cart items grouped by category */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {categoriesInCart.map((catLabel) => {
              const items = cart.filter((item) => item.categoryLabel === catLabel)
              const groupSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

              return (
                <div
                  key={catLabel}
                  className="rounded-2xl border border-t-border bg-t-bg-surface p-4 shadow-sm"
                >
                  <h3 className="text-sm font-black text-t-accent tracking-tight pb-3 border-b border-t-border mb-3">
                    {catLabel}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-t-border/40 last:border-0"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-14 w-14 overflow-hidden rounded-lg bg-t-bg-hover border border-t-border/40 shrink-0">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-t-text-primary line-clamp-1 leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-t-text-muted font-bold mt-0.5">
                              SKU: {item.sku} | Đơn vị: {item.unit}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                          {/* Quantity control */}
                          <div className="flex items-center rounded-lg border border-t-border bg-t-bg-hover overflow-hidden scale-90">
                            <button
                              className="h-8 w-8 flex items-center justify-center hover:bg-t-border/50 text-t-text-secondary active:scale-95"
                              onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="h-8 w-10 bg-transparent border-0 text-center text-xs font-bold focus:ring-0"
                              value={item.quantity}
                              onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                            />
                            <button
                              className="h-8 w-8 flex items-center justify-center hover:bg-t-border/50 text-t-text-secondary active:scale-95"
                              onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className="text-xs text-t-text-muted font-semibold">
                              {item.price.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-xs font-extrabold text-t-text-primary tracking-tight mt-0.5">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-t-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => handleDeleteItem(item.id)}
                            aria-label="Xóa dòng"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Group Subtotal info */}
                  <div className="mt-3 flex justify-between items-center text-xs bg-t-bg-hover/20 px-3 py-2 rounded-lg border border-t-border/20">
                    <span className="text-t-text-secondary font-bold">Cộng {catLabel}</span>
                    <span className="font-extrabold text-t-text-primary tracking-tight">
                      {groupSubtotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Area (30%): Summary sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-4 p-5 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm">
            <h3 className="text-sm font-black text-t-text-primary uppercase tracking-wider pb-2 border-b border-t-border/60">
              Tổng quan đơn hàng
            </h3>

            <div className="flex flex-col gap-2.5 text-xs text-t-text-secondary">
              <div className="flex justify-between items-center">
                <span>Số loại nguyên liệu (SKUs)</span>
                <span className="font-bold text-t-text-primary">{totalSkus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tổng số lượng đặt sỉ</span>
                <span className="font-bold text-t-text-primary">{totalQty} đơn vị</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-t-border/40">
                <span>Tạm tính</span>
                <span className="font-bold text-t-text-primary">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Thuế giá trị gia tăng (VAT 10%)</span>
                <span className="font-bold text-t-text-primary">{vat.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-t-text-primary">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Miễn phí sỉ</span>
                  ) : (
                    `${shippingFee.toLocaleString('vi-VN')}đ`
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-t-text-muted mt-1 leading-normal italic">
                  * Mua thêm sỉ để đơn hàng đạt trên 1,000,000đ để được miễn phí vận chuyển.
                </p>
              )}
            </div>

            <div className="pt-3.5 border-t border-t-border flex justify-between items-baseline">
              <span className="text-xs font-black text-t-text-primary uppercase">Tổng cộng sỉ</span>
              <span className="text-2xl font-black text-t-accent tracking-tight">
                {finalTotal.toLocaleString('vi-VN')}đ
              </span>
            </div>

            {/* Note Area */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label htmlFor="order-note" className="text-xs font-bold text-t-text-secondary flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-t-text-muted" /> Ghi chú giao nhận sỉ
              </label>
              <Textarea
                id="order-note"
                placeholder="vd: Giao vào khung giờ sáng, cần hóa đơn VAT cho Hộ kinh doanh..."
                className="min-h-[80px] resize-none text-xs rounded-xl border-t-border hover:border-t-border focus:border-t-accent"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <Button
                className="w-full h-11 bg-t-accent hover:bg-t-accent/95 text-white font-bold rounded-xl gap-2 shadow-sm"
                onClick={handleCheckout}
              >
                <Send className="h-4 w-4" />
                Xác nhận đặt hàng sỉ
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 border-t-border text-t-text-secondary hover:bg-t-bg-hover hover:text-t-text-primary rounded-xl gap-2"
                onClick={handleSaveDraft}
              >
                <Save className="h-4 w-4" />
                Lưu đơn nháp
              </Button>
            </div>

            <div className="mt-2 flex items-center gap-2 justify-center text-[10px] text-t-text-muted/90 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Cam kết chất lượng chuẩn CO/CQ của DigiFNB.
            </div>
          </aside>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-t-border rounded-3xl bg-t-bg-surface text-center min-h-[400px]">
          <ShoppingCart className="h-16 w-16 text-t-text-muted mb-4 opacity-40" />
          <h2 className="text-lg font-bold text-t-text-primary mb-1">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-t-text-muted max-w-sm mb-6 leading-relaxed">
            Xem ngay danh mục nguyên liệu sỉ của chúng tôi để chọn lựa những sản phẩm Toschi, Pomona tốt nhất cho cửa hàng của bạn.
          </p>
          <Link to={ROUTES.CUSTOMER_PORTAL.CATALOG}>
            <Button className="bg-t-accent hover:bg-t-accent/95 text-white font-bold rounded-xl shadow-sm px-6">
              Khám phá nguyên liệu sỉ
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
