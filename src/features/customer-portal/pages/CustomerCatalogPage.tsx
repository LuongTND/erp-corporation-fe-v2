import { useState, useEffect } from 'react'
import { Search, ShoppingCart, SlidersHorizontal, ChevronRight, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Mock categories B2B F&B Horeca
const CATEGORIES = [
  { id: 'all', label: 'Tất cả nguyên liệu' },
  { id: 'siro', label: 'Siro (Syrup)' },
  { id: 'sot', label: 'Sốt (Sauce)' },
  { id: 'mut', label: 'Mứt trái cây (Puree)' },
  { id: 'tra-cafe', label: 'Trà & Cà phê' },
  { id: 'bot', label: 'Bột pha chế' },
  { id: 'topping', label: 'Topping & Thạch' },
  { id: 'kem', label: 'Kem & Béo' },
]

// Mock 12 real products in Horeca VN
const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Siro Toschi Caramel 1000ml',
    brand: 'Toschi (Ý)',
    category: 'siro',
    price: 285000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Bán chạy',
    badgeType: 'high', // maps to t-priority-high
  },
  {
    id: 'p2',
    name: 'Siro Pomona Đào Nhật Bản 1000ml',
    brand: 'Pomona (Hàn Quốc)',
    category: 'siro',
    price: 260000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1589733901241-5e39127b53e8?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Mới',
    badgeType: 'low', // maps to t-priority-low
  },
  {
    id: 'p3',
    name: 'Bột Trà Xanh Uji Matcha Nhật Bản 500g',
    brand: 'Marukyu Koyamaen',
    category: 'bot',
    price: 320000,
    unit: 'Gói',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Đặc sản',
    badgeType: 'med', // maps to t-priority-med
  },
  {
    id: 'p4',
    name: 'Sốt Master Chocolate Đậm Đặc 2L',
    brand: 'Master (Đài Loan)',
    category: 'sot',
    price: 210000,
    unit: 'Can',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Bán chạy',
    badgeType: 'high',
  },
  {
    id: 'p5',
    name: 'Mứt Dâu Tây Tây Nguyên Puree 1L',
    brand: 'Ezmix (Việt Nam)',
    category: 'mut',
    price: 135000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&h=400&q=80',
    badge: null,
    badgeType: null,
  },
  {
    id: 'p6',
    name: 'Trân Châu Hoàng Kim Ezmix 3kg',
    brand: 'Ezmix (Việt Nam)',
    category: 'topping',
    price: 85000,
    unit: 'Bao',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Bán chạy',
    badgeType: 'high',
  },
  {
    id: 'p7',
    name: 'Siro Bạc Hà Trắng Toschi 1000ml',
    brand: 'Toschi (Ý)',
    category: 'siro',
    price: 275000,
    unit: 'Chai',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&h=400&q=80',
    badge: null,
    badgeType: null,
  },
  {
    id: 'p8',
    name: 'Bột Sữa Thực Vật Master 1kg',
    brand: 'Master (Đài Loan)',
    category: 'bot',
    price: 95000,
    unit: 'Gói',
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Giá sỉ tốt',
    badgeType: 'low',
  },
  {
    id: 'p9',
    name: 'Thạch Dừa Hạt Lựu Master 3.2kg',
    brand: 'Master (Đài Loan)',
    category: 'topping',
    price: 110000,
    unit: 'Hộp',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=400&q=80',
    badge: null,
    badgeType: null,
  },
  {
    id: 'p10',
    name: 'Trà Đen Cổ Điển Số 9 Lộc Phát 1kg',
    brand: 'Lộc Phát (Việt Nam)',
    category: 'tra-cafe',
    price: 120000,
    unit: 'Gói',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Mới',
    badgeType: 'low',
  },
  {
    id: 'p11',
    name: 'Sốt Pomona Socola Trắng Lỏng 2kg',
    brand: 'Pomona (Hàn Quốc)',
    price: 295000,
    unit: 'Chai',
    category: 'sot',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&h=400&q=80',
    badge: null,
    badgeType: null,
  },
  {
    id: 'p12',
    name: 'Đường Nước Trắng Hàn Quốc Daesang 25kg',
    brand: 'Daesang (Hàn Quốc)',
    price: 450000,
    unit: 'Thùng',
    category: 'kem',
    image: 'https://images.unsplash.com/photo-1581798459219-318e76ae1ba7?auto=format&fit=crop&w=400&h=400&q=80',
    badge: 'Sản lượng cao',
    badgeType: 'med',
  },
]

export default function CustomerCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('popular')
  const [brandFilter, setBrandFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [currentPage, setCurrentPage] = useState(1)

  // Brands list from products
  const brands = ['all', ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand)))]

  // Simulation of loading skeleton
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedCategory, searchTerm, sortOption, brandFilter])

  // Filter & sort logic
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter
    return matchesCategory && matchesSearch && matchesBrand
  }).sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price
    if (sortOption === 'price-desc') return b.price - a.price
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name)
    // popular default sort
    return b.badge ? 1 : -1
  })

  const handleAddToCart = (productName: string) => {
    toast.success(`Đã thêm ${productName} vào giỏ hàng thành công!`)
  }

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex min-h-[calc(100vh-140px)] gap-6">
      {/* Sidebar Trái (240px, dark) */}
      <aside className="hidden md:block w-[240px] shrink-0 bg-t-sidebar-bg rounded-2xl p-4 text-t-sidebar-text shadow-sm border border-t-sidebar-border">
        <div className="mb-4 px-2">
          <p className="text-xs font-bold uppercase tracking-wider text-t-sidebar-hover/60">Danh Mục Sỉ</p>
        </div>
        <nav className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setCurrentPage(1)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-left',
                  isActive
                    ? 'bg-t-sidebar-active-bg text-t-accent'
                    : 'hover:bg-t-sidebar-active-bg/30 hover:text-t-sidebar-hover'
                )}
              >
                <span>{cat.label}</span>
                <ChevronRight className={cn('h-3.5 w-3.5 opacity-60 transition-transform', isActive && 'rotate-90 text-t-accent')} />
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Filter bar */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm">
          {/* Mobile Categories dropdown */}
          <div className="md:hidden">
            <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-muted" />
              <Input
                type="text"
                placeholder="Tìm nguyên liệu, thương hiệu..."
                className="pl-10 border-t-border hover:border-t-accent/50 focus:border-t-accent transition-colors"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Sorting & Brand Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={brandFilter} onValueChange={(val) => { setBrandFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px] shrink-0">
                  <SelectValue placeholder="Thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hãng</SelectItem>
                  {brands.filter(b => b !== 'all').map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[160px] shrink-0">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Nổi bật / Bán chạy</SelectItem>
                  <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                  <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                  <SelectItem value="name-asc">Tên từ A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 border border-t-border bg-t-bg-surface rounded-2xl animate-pulse">
                <div className="aspect-square w-full bg-t-bg-hover rounded-xl" />
                <div className="h-4 w-2/3 bg-t-bg-hover rounded" />
                <div className="h-3 w-1/3 bg-t-bg-hover rounded" />
                <div className="flex justify-between items-center mt-2">
                  <div className="h-5 w-1/2 bg-t-bg-hover rounded" />
                  <div className="h-8 w-8 bg-t-bg-hover rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => {
              // Priority badge colors based on mapping variables
              const isHigh = product.badgeType === 'high'
              const isMed = product.badgeType === 'med'
              return (
                <div
                  key={product.id}
                  className="flex flex-col justify-between p-4 border border-t-border/60 bg-t-bg-surface rounded-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-t-bg-hover mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {product.badge && (
                      <span
                        className="absolute left-2.5 top-2.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm"
                        style={{
                          backgroundColor: isHigh
                            ? 'var(--t-priority-high-bg)'
                            : isMed
                            ? 'var(--t-priority-med-bg)'
                            : 'var(--t-priority-low-bg)',
                          color: isHigh
                            ? 'var(--t-priority-high-text)'
                            : isMed
                            ? 'var(--t-priority-med-text)'
                            : 'var(--t-priority-low-text)',
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-t-text-secondary/70 font-semibold uppercase tracking-wider mb-0.5">
                      {product.brand}
                    </p>
                    <h4 className="text-sm font-bold text-t-text-primary group-hover:text-t-accent transition-colors duration-200 line-clamp-2 h-10 mb-2 leading-snug">
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <span className="text-base font-black text-t-accent tracking-tight">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-[10px] text-t-text-secondary/80 font-bold ml-1">
                        / {product.unit}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 border-t-accent/20 text-t-accent hover:bg-t-accent hover:text-white rounded-xl transition-all active:scale-90"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product.name)
                      }}
                      aria-label="Thêm vào đơn hàng"
                    >
                      <ShoppingCart className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-t-border rounded-2xl bg-t-bg-surface text-center">
            <ShoppingCart className="h-12 w-12 text-t-text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-t-text-primary mb-1">Không tìm thấy nguyên liệu</h3>
            <p className="text-sm text-t-text-muted max-w-sm">
              Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc danh mục.
            </p>
          </div>
        )}

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-t-border hover:bg-t-bg-hover"
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1
              const isActive = currentPage === pageNum
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'h-8 w-8 p-0 rounded-xl transition-all',
                    isActive 
                      ? 'bg-t-accent hover:bg-t-accent/90 text-white font-bold' 
                      : 'border border-t-border hover:bg-t-bg-hover'
                  )}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-t-border hover:bg-t-bg-hover"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
