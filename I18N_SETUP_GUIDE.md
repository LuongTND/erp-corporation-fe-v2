# Hướng dẫn cấu hình i18n (Đa ngôn ngữ) trong React/Vite

Tài liệu này tổng hợp lại các bước để thiết lập và sử dụng `i18next` cùng `react-i18next` cho dự án `erp-corporation-fe-v2`. Bạn có thể tham khảo lại khi cần setup cho dự án mới hoặc thêm cấu hình tương tự.

## Bước 1: Cài đặt thư viện

Bạn cần cài đặt 2 package chính của i18next để hoạt động với React:
```bash
pnpm add i18next react-i18next
```

## Bước 2: Tạo các file ngôn ngữ (Locales JSON)

Tạo thư mục lưu trữ các file ngôn ngữ chứa các cặp `key: value`, thường được đặt trong thư mục `public/locales/` chia theo từng ngôn ngữ (vd: `vi`, `en`) và theo từng namespace (phân hệ: auth, common, landing, ...).

Ví dụ cấu trúc:
```text
public/
  locales/
    en/
      landing.json
      common.json
    vi/
      landing.json
      common.json
```

Nội dung file JSON mẫu (`public/locales/vi/landing.json`):
```json
{
  "title": "Quản Lý Doanh Nghiệp Hiệu Quả",
  "subtitle": "Nền tảng ERP toàn diện giúp bạn quản lý bán hàng, tồn kho, nhân sự và tài chính tại một nơi"
}
```

## Bước 3: Khởi tạo file cấu hình i18n.ts

Tạo một file cấu hình chính cho i18n, ví dụ: `src/lib/i18n.ts`. File này làm nhiệm vụ import toàn bộ các file json map vào Object resource và cấu hình cho `i18next`.

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 1. Import translation files (JSON)
import viLand from '../../public/locales/vi/landing.json'
import enLand from '../../public/locales/en/landing.json'
// import thêm các file phân hệ khác...

// 2. Map resource cho i18n
const resources = {
  vi: { landing: viLand },
  en: { landing: enLand },
}

// 3. Khởi tạo
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'vi', // Ngôn ngữ dự phòng nếu không tìm thấy key
    lng: 'vi',         // Ngôn ngữ mặc định khởi tạo
    defaultNS: 'common', // Namespace mặc định nếu không truyền 
    ns: ['common', 'landing'], // Đăng ký các namespace
    interpolation: {
      escapeValue: false, // React đã tự escape XSS
    },
    react: {
      useSuspense: false, 
    },
  })
}

export default i18n
```

## Bước 4: Tích hợp cấu hình vào Source code Root

Chỉ cần import import `i18n.ts` vào đỉnh tree của chương trình (ví dụ trong `src/main.tsx` hoặc `src/index.tsx`) để config chạy 1 lần lúc startup app.

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/i18n' // <-- Import file cấu hình i18n
// ... những import khác ...

createRoot(document.getElementById('root')!).render(
  // ... App Component ...
)
```

## Bước 5: Sử dụng trong Component

Trong bất cứ component React nào, bạn có thể gọi hook `useTranslation` để dịch văn bản bằng hàm `t` và chuyển giao diện ngôn ngữ bằng `i18n.changeLanguage()`.

```tsx
import { useTranslation } from 'react-i18next'

export default function MyComponent() {
  // Chỉ định namespace 'landing' nếu file ngôn ngữ là landing.json
  const { t, i18n } = useTranslation('landing') 

  // Hàm đổi ngôn ngữ
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div>
      {/* Nút thao tác chuyển ngôn ngữ */}
      <button onClick={toggleLanguage}>
        {i18n.language === 'vi' ? 'Đổi qua Tiếng Anh' : 'Switch to Vietnamese'}
      </button>

      {/* Hiển thị văn bản (Fallback text nếu key không tồn tại) */}
      <h1>{t('title', 'Tiêu đề mặc định nếu không có key')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  )
}
```

Chúc bạn thành công!
