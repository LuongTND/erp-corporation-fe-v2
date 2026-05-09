import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Users, Zap } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DigiFnb ERP</h1>
          <Button onClick={() => navigate('/login')} variant="default">
            Đăng Nhập
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Quản Lý Doanh Nghiệp{' '}
              <span className="text-primary">Hiệu Quả</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nền tảng ERP toàn diện giúp bạn quản lý bán hàng, tồn kho, nhân sự và 
              tài chính tại một nơi
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/login')}>
              Bắt Đầu Ngay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Xem Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Các Tính Năng Chính</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-8 rounded-lg border">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Dashboard & Báo Cáo</h4>
              <p className="text-muted-foreground">
                Theo dõi KPI, doanh thu và chi phí với biểu đồ trực quan, cập nhật 
                real-time
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-8 rounded-lg border">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Quản Lý Nhân Sự</h4>
              <p className="text-muted-foreground">
                Quản lý hồ sơ nhân viên, lương, chấm công, phép và đánh giá hiệu suất
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-8 rounded-lg border">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Tối Ưu Hóa Tồn Kho</h4>
              <p className="text-muted-foreground">
                Quản lý kho hàng thông minh, dự báo nhu cầu và tối ưu chuỗi cung ứng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Các Module</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Bán Hàng', desc: 'Quản lý đơn hàng, khách hàng' },
              { name: 'Tồn Kho', desc: 'Quản lý hàng hoá, nhập xuất kho' },
              { name: 'CRM', desc: 'Quản lý khách hàng, cơ hội bán' },
              { name: 'Sản Xuất', desc: 'Quy hoạch sản xuất, công đoạn' },
              { name: 'Kế Toán', desc: 'Sổ cái, hóa đơn, báo cáo tài chính' },
              { name: 'Nhân Sự', desc: 'Lương, phép, đánh giá nhân viên' },
            ].map((module) => (
              <div key={module.name} className="bg-card p-6 rounded-lg border hover:shadow-lg transition">
                <h4 className="font-semibold text-lg mb-2">{module.name}</h4>
                <p className="text-muted-foreground text-sm">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2026 DigiFnb ERP. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  )
}
