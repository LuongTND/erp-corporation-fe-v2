import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/config/routes'
import {
  ArrowRight,
  Users,
  BookOpen,
  MessageSquare,
  Trophy,
  CheckSquare,
  Zap,
  Activity,
} from 'lucide-react'

// ─── Data ──────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Users,
    title: 'Quản trị Nhân sự (HRM)',
    desc: 'Quản lý thông tin nhân viên, chấm công định vị GPS, tính toán bảng lương và đánh giá KPI tự động hàng tháng.',
    iconBg: 'bg-[#e8f0fb]',
    iconColor: 'text-[#1e40af]',
  },
  {
    icon: BookOpen,
    title: 'Đào tạo Nội bộ (LMS)',
    desc: 'Số hóa bài học, tạo khóa học nội bộ, tổ chức thi trắc nghiệm và theo dõi lộ trình thăng tiến của nhân viên chuỗi.',
    iconBg: 'bg-[#ece8f5]',
    iconColor: 'text-[#8b5cf6]',
  },
  {
    icon: CheckSquare,
    title: 'Quản lý Công việc (Task)',
    desc: 'Giao việc trực quan, quản lý tiến độ dự án bằng Kanban Board, thảo luận trực tiếp và đính kèm tài liệu.',
    iconBg: 'bg-[#faf3e8]',
    iconColor: 'text-[#e8a55a]',
  },
  {
    icon: MessageSquare,
    title: 'Trò chuyện Nội bộ (Chat)',
    desc: 'Kênh chat nội bộ real-time, phân loại theo kênh công việc (channels) và nhắn tin trực tiếp bảo mật.',
    iconBg: 'bg-[#e8f4f1]',
    iconColor: 'text-[#5db8a6]',
  },
  {
    icon: Trophy,
    title: 'Quản trị Hiệu suất',
    desc: 'Phân tích điểm số hiệu quả làm việc tổng hợp của nhân sự dựa trên KPI bán hàng, tickets hỗ trợ và các khóa học.',
    iconBg: 'bg-[#f5ede8]',
    iconColor: 'text-[#cc785c]',
  },
  {
    icon: Zap,
    title: 'Đồng bộ & Tự động',
    desc: 'Dữ liệu được cập nhật tức thì giữa các phân hệ quản trị. Đồng nhất thông tin, giảm thiểu công việc thủ công.',
    iconBg: 'bg-[#e8f3ea]',
    iconColor: 'text-[#5db872]',
  },
]

const stats = [
  { value: '500+', label: 'Doanh nghiệp tin dùng' },
  { value: '99,9%', label: 'Uptime hệ thống' },
  { value: '30%', label: 'Giảm chi phí vận hành' },
  { value: '15k+', label: 'Người dùng hoạt động' },
]

const steps = [
  {
    num: '01',
    title: 'Đăng ký & Khởi tạo',
    desc: 'Thiết lập tài khoản doanh nghiệp, sơ đồ tổ chức phòng ban và mời nhân sự tham gia hệ thống chỉ trong 5 phút.',
  },
  {
    num: '02',
    title: 'Phân quyền & Gán lộ trình',
    desc: 'Phân quyền bảo mật theo vai trò, gán tài liệu đào tạo nội bộ (LMS) và thiết lập chỉ tiêu KPI cho từng nhân sự.',
  },
  {
    num: '03',
    title: 'Vận hành & Theo dõi',
    desc: 'Theo dõi báo cáo nhân sự, tiến độ công việc, hoạt động đào tạo và các chỉ số vận hành doanh nghiệp theo thời gian thực.',
  },
]

// ─── ERPMockup Component ─────────────────────────────────────────────────────

function ERPMockup() {
  return (
    <Card className="w-full overflow-hidden border-[#2a2825] bg-[#0d0c0a] shadow-2xl rounded-xl">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b border-[#2a2825] px-4 py-3 bg-[#131210]">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-[11px] text-[#8a8880] select-none font-medium">
            DigiERP — Nền tảng quản trị tổng thể
          </span>
        </div>

        {/* HRM & Task Overview */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <Card className="border-[#252320] bg-[#1a1916] shadow-none">
            <CardContent className="p-3">
              <div className="mb-2 text-[10px] text-[#8a8880] uppercase font-bold tracking-wider">Nhân sự (HRM)</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-[#6c6a64]">Đi làm hôm nay</div>
                  <div className="text-xl font-bold text-[#faf9f5]">42 / 45</div>
                </div>
                <div className="text-[10px] text-[#5db872]">+93% đúng giờ</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#252320] bg-[#1a1916] shadow-none">
            <CardContent className="p-3">
              <div className="mb-2 text-[10px] text-[#8a8880] uppercase font-bold tracking-wider">Công việc (Tasks)</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-[#6c6a64]">Đang thực hiện</div>
                  <div className="text-xl font-bold text-[#faf9f5]">18 việc</div>
                </div>
                <div className="text-[10px] text-[#e8a55a]">5 việc sắp hạn</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mini LMS list */}
        <div className="px-4 pb-4">
          <Card className="border-[#252320] bg-[#1a1916] shadow-none">
            <CardContent className="p-3">
              <div className="mb-3 text-[10px] text-[#8a8880] uppercase font-bold tracking-wider">Đào tạo (LMS)</div>
              <div className="space-y-2">
                {[
                  { course: 'Quy trình phục vụ bàn chuẩn', progress: 85 },
                  { course: 'An toàn vệ sinh thực phẩm F&B', progress: 100 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-[#a09d96] truncate max-w-[180px]">{item.course}</span>
                    <span className={`font-semibold ${item.progress === 100 ? 'text-[#5db872]' : 'text-[#3b82f6]'}`}>
                      {item.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413] transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-[#f2ece4] to-[#faf9f5]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center">
            {/* Left — text info */}
            <div className="w-full max-w-2xl lg:w-1/2">
              <Badge variant="outline" className="inline-flex items-center gap-2 border-[#cc785c]/30 bg-[#cc785c]/10 px-3 py-1.5 text-xs font-semibold text-[#cc785c] rounded-full shadow-none hover:bg-[#cc785c]/15">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                Nền tảng quản trị All-In-One mới
              </Badge>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#141413] sm:text-5xl lg:text-6xl font-display leading-[1.1]">
                Nền tảng quản trị <br />
                <span className="text-[#cc785c]">Doanh nghiệp F&B</span> toàn diện
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#6c6a64]">
                Đồng bộ Nhân sự (HRM), Đào tạo (LMS), Chăm sóc khách hàng (CRM), Dự án (Task) và Chat nội bộ trên một hệ thống duy nhất. Tự động hóa vận hành, gắn kết đội ngũ, bứt phá năng suất.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button asChild className="h-11 px-6 border-0 bg-[#cc785c] text-white hover:bg-[#b05f43] shadow-md cursor-pointer text-sm font-semibold rounded-lg">
                  <Link to={ROUTES.LOGIN}>
                    Trải nghiệm ngay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-11 px-6 border-[#d0ccc8] hover:bg-[#efe9de] text-[#141413] cursor-pointer text-sm font-semibold rounded-lg">
                  <a href="#tinh-nang">
                    Tìm hiểu tính năng
                  </a>
                </Button>
              </div>
            </div>

            {/* Right — mockups */}
            <div className="w-full max-w-lg flex-shrink-0 lg:w-[460px]">
              <ERPMockup />
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-[#e6dfd8]" />

      {/* Stats Bar */}
      <section className="bg-[#efe9de]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="text-center flex flex-col justify-center items-center relative"
              >
                <div className="text-2xl font-bold text-[#141413] sm:text-3xl font-display">{s.value}</div>
                <div className="mt-1 text-xs text-[#8e8b82] uppercase tracking-wider">{s.label}</div>
                {i < stats.length - 1 && (
                  <Separator orientation="vertical" className="hidden lg:block absolute right-0 h-8 bg-[#ddd6cc]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-[#e6dfd8]" />

      {/* Features Section */}
      <section id="tinh-nang" className="bg-[#faf9f5] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="text-xs font-bold tracking-widest text-[#cc785c] uppercase border-[#cc785c]/20 px-3 py-1 rounded-full bg-white select-none hover:bg-transparent">
              Giải pháp toàn diện
            </Badge>
            <h2 className="mt-4 text-3xl font-bold text-[#141413] sm:text-4xl font-display">
              Vận hành trơn tru mọi hoạt động doanh nghiệp
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#6c6a64]">
              Không còn các phần mềm rời rạc làm mất mát dữ liệu và cản trở luồng công việc. Mọi module phối hợp nhịp nhàng trên một cơ sở dữ liệu đồng nhất.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card
                  key={f.title}
                  className="group cursor-pointer border-[#e6dfd8] bg-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#cc785c]/30 hover:shadow-md rounded-xl"
                >
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg} ${f.iconColor}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 font-bold text-sm text-[#141413]">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-[#6c6a64]">{f.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#181715] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="text-xs font-bold tracking-widest text-[#e8a55a] uppercase border-[#e8a55a]/20 px-3 py-1 rounded-full bg-white/5 select-none hover:bg-transparent text-[#e8a55a]">
              Quy trình triển khai
            </Badge>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl font-display">
              Dễ dàng thiết lập hệ thống quản trị
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[#8a8880]">
              Tối giản hóa quá trình chuyển đổi số cho mô hình F&B của bạn chỉ với 3 bước đơn giản.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.num} className="relative bg-[#252320] border-white/5 shadow-none rounded-xl">
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4 text-4xl font-extrabold text-[#cc785c]/25 select-none font-display">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 mt-4">{step.title}</h3>
                  <p className="text-xs text-[#a09d96] leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="mx-6 sm:mx-12 my-16 text-center bg-[#cc785c] border-0 rounded-2xl py-14 px-6 text-white shadow-lg">
        <CardContent className="p-0">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Bắt đầu chuyển đổi số doanh nghiệp F&B của bạn
          </h2>
          <p className="text-sm text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Tối ưu chi phí nhân sự, nâng cao chất lượng dịch vụ và quản trị dòng công việc hiệu quả cùng DigiERP ngay hôm nay.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild className="h-10 px-6 border-0 bg-white text-[#cc785c] hover:bg-[#faf9f5] cursor-pointer text-sm font-semibold rounded-lg shadow-sm">
              <Link to={ROUTES.LOGIN}>
                Bắt đầu miễn phí
              </Link>
            </Button>
            <Button variant="link" asChild className="text-white hover:text-white/80 text-sm font-semibold cursor-pointer">
              <Link to={ROUTES.PORTAL}>
                Khám phá Portal →
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-auto bg-white py-8 px-12 border-t border-[#e6dfd8]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-sm text-[#141413]">
            <span className="text-[#cc785c]">Digi</span>ERP
          </span>
          <div className="flex gap-6 text-xs text-[#6c6a64]">
            <Link to="#" className="hover:text-[#141413]">Chính sách bảo mật</Link>
            <Link to="#" className="hover:text-[#141413]">Điều khoản sử dụng</Link>
            <Link to="#" className="hover:text-[#141413]">Liên hệ</Link>
          </div>
          <span className="text-xs text-[#8e8b82]">© 2026 DigiFNB. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
