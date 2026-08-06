# 📁 ERP Corporation - Project Structure Guide

## 🎯 Tổng Quan Cấu Trúc

```
erp-corporation-fe-v2/
├── src/
│   ├── app/                    # Routing & App setup
│   │   └── router.tsx          # React Router config
│   │
│   ├── components/             # Shared & reusable components
│   │   ├── ui/                 # shadcn UI components
│   │   ├── layout/             # Layout wrappers (AppLayout, AuthLayout)
│   │   └── common/             # Common components (Header, Sidebar, etc)
│   │
│   ├── features/               # Feature-based modules
│   │   ├── landing/            # Landing page
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   ├── auth/               # Authentication (Login, Register)
│   │   ├── dashboard/          # Dashboard module
│   │   ├── inventory/          # Inventory management
│   │   ├── crm/                # Customer Relationship
│   │   ├── manufacturing/      # Production management
│   │   ├── accounting/         # Financial management
│   │   └── hr/                 # Human Resources
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-pagination.ts
│   │   ├── use-form.ts         # Form handling
│   │   └── use-api.ts          # API calls wrapper
│   │
│   ├── lib/                    # Utilities & configuration
│   │   ├── axios.ts            # HTTP client config
│   │   ├── query-client.ts     # React Query setup
│   │   └── utils.ts            # Helper functions
│   │
│   ├── services/               # API services
│   │   ├── auth.service.ts     # Auth API calls
│   │   ├── inventory.service.ts
│   │   ├── crm.service.ts
│   │   └── ...
│   │
│   ├── stores/                 # Zustand state management
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts
│   │   └── ...
│   │
│   ├── types/                  # TypeScript types
│   │   ├── api.ts              # API response types
│   │   ├── entities.ts         # Business entities
│   │   └── forms.ts            # Form types
│   │
│   ├── utils/                  # Utility functions
│   │   ├── formatters.ts       # Format data (date, currency)
│   │   ├── validators.ts       # Validation logic
│   │   └── constants.ts        # App constants
│   │
│   ├── assets/                 # Static files (images, fonts)
│   ├── index.css               # Global styles
│   └── main.tsx                # App entry point
│
├── public/                     # Static assets (favicon, etc)
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 📦 Feature Folder Structure (Example: Inventory)

```
features/inventory/
├── pages/
│   ├── InventoryPage.tsx       # Main page component
│   └── ProductDetailPage.tsx   # Detail page
│
├── components/
│   ├── ProductTable.tsx        # Inventory table
│   ├── ProductForm.tsx         # Add/Edit product form
│   ├── CategoryFilter.tsx      # Filter component
│   └── StockChart.tsx          # Charts
│
├── hooks/
│   ├── use-products.ts         # Fetch products data
│   └── use-inventory-form.ts   # Form logic
│
├── types/
│   └── inventory.types.ts      # Inventory TS types
│
└── services/
    └── inventory.service.ts    # Inventory API calls
```

---

## 🔄 Data Flow Pattern

```
Page Component
    ↓
useQuery() / useMutation() (React Query)
    ↓
Service Layer (API calls)
    ↓
Axios Instance
    ↓
Backend API
```

### Example: Fetching Products

```typescript
// 1. Custom Hook (hooks/use-products.ts)
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => inventoryService.getProducts(),
  })
}

// 2. Service (services/inventory.service.ts)
export const inventoryService = {
  getProducts: () => axios.get('/api/products'),
  createProduct: (data) => axios.post('/api/products', data),
}

// 3. Component (features/inventory/components/ProductTable.tsx)
export function ProductTable() {
  const { data: products } = useProducts()
  return <Table data={products} />
}
```

---

## 🎨 Component Best Practices

### UI Components (shadcn)
```typescript
// components/ui/button.tsx
export { Button }

// Usage in feature components
import { Button } from '@/components/ui/button'
```

### Feature Components
```typescript
// features/inventory/components/ProductForm.tsx
interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: Product) => void
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const form = useForm<Product>()
  // ...
}
```

---

## 🔐 Authentication Flow

```
Landing Page (Public)
    ↓
Login Page (AuthLayout)
    ↓
Auth Service (JWT token)
    ↓
Protected Routes (ProtectedRoute guard)
    ↓
Dashboard (AppLayout with sidebar)
    ↓
Feature Modules
```

---

## 📋 State Management (Zustand)

```typescript
// stores/auth.store.ts
export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (credentials) => {/* ... */},
  logout: () => set({ isAuthenticated: false, user: null }),
}))

// Usage in components
const { isAuthenticated } = useAuthStore()
```

---

## 🚀 Module Development Checklist

Khi tạo feature module mới (ví dụ: Suppliers):

- [ ] Create folder `features/suppliers`
- [ ] Create `pages/SuppliersPage.tsx`
- [ ] Create `components/` (SupplierTable, SupplierForm, etc)
- [ ] Create `types/suppliers.types.ts`
- [ ] Create `services/suppliers.service.ts`
- [ ] Create `hooks/use-suppliers.ts`
- [ ] Add route in `router.tsx`
- [ ] Add menu item in sidebar

---

## 🔌 API Integration

### Service Pattern
```typescript
// services/suppliers.service.ts
const API_BASE = '/api/suppliers'

export const suppliersService = {
  getAll: (params?: QueryParams) => 
    axios.get(API_BASE, { params }),
  
  getById: (id: string) => 
    axios.get(`${API_BASE}/${id}`),
  
  create: (data: Supplier) => 
    axios.post(API_BASE, data),
  
  update: (id: string, data: Supplier) => 
    axios.put(`${API_BASE}/${id}`, data),
  
  delete: (id: string) => 
    axios.delete(`${API_BASE}/${id}`),
}
```

---

## 🛠️ Common Hooks

### Data Fetching
```typescript
// hooks/use-api.ts
export function useApi<T>(url: string) {
  return useQuery({
    queryKey: [url],
    queryFn: () => axios.get(url).then(res => res.data),
  })
}
```

### Form Handling
```typescript
// hooks/use-form.ts
export function useForm<T>(onSubmit: (data: T) => void) {
  return useFormHook<T>({
    mode: 'onChange',
    onSubmit,
  })
}
```

### Pagination
```typescript
// hooks/use-pagination.ts
export function usePagination(pageSize = 10) {
  const [page, setPage] = useState(1)
  return { page, pageSize, setPage }
}
```

---

## 📱 Responsive Design

Sử dụng Tailwind breakpoints:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 🎯 Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=DigiFnb ERP
```

Usage:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

---

## 🧪 Testing Structure (Future)

```
features/inventory/
├── __tests__/
│   ├── ProductTable.test.tsx
│   ├── use-products.test.ts
│   └── inventory.service.test.ts
```

---

## 📝 Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `ProductTable.tsx` |
| Hook | `use*` | `useProducts.ts` |
| Service | `*.service.ts` | `inventory.service.ts` |
| Type | `*.types.ts` | `inventory.types.ts` |
| Store | `*.store.ts` | `auth.store.ts` |
| Utility | `*.utils.ts` | `format.utils.ts` |

---

## 🚀 Getting Started

1. **New Feature Module**
   ```bash
   mkdir -p src/features/module-name/{pages,components,hooks,services,types}
   ```

2. **Add Route**
   - Update `src/app/router.tsx`

3. **Create API Service**
   - Create `src/services/module-name.service.ts`

4. **Create Components**
   - Start with pages, then components

5. **Add Types**
   - Define in `src/types/` or feature `types/`

---

## 🔗 Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm type-check       # Check TypeScript
pnpm lint             # Run ESLint
pnpm format           # Format code

# Build
pnpm build            # Build for production
pnpm preview          # Preview build

# shadcn UI
pnpm dlx shadcn@latest add [component-name]
```

---

## 📚 Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **React Query** - Server state
- **Zustand** - Client state
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Vite** - Build tool
- **Zod** - Schema validation
