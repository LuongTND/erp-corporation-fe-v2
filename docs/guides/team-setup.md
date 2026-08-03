# 🚀 Team Setup Guide - DigiFnb ERP

Hướng dẫn setup project để team members có thể format code chung nhất quán.

## 1️⃣ Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

```bash
# Check versions
node --version
pnpm --version
```

## 2️⃣ Clone & Install Dependencies

```bash
# Clone repository
git clone <repo-url>
cd erp-corporation-fe-v2

# Install dependencies
pnpm install
```

## 3️⃣ VSCode Setup (Critical for Team Consistency)

### Option A: Auto Setup (Recommended)

Khi mở project, VSCode sẽ tự động suggest cài các extensions:

1. Nhấp "Install All" → Cài xong toàn bộ
2. Reload VSCode

### Option B: Manual Setup

Cài từng extension:

1. **Prettier** - `esbenp.prettier-vscode`
2. **ESLint** - `dbaeumer.vscode-eslint`
3. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`

VSCode Settings sẽ tự động apply từ `.vscode/settings.json`

## 4️⃣ Verify Setup

### ✅ Check Prettier

```bash
pnpm prettier --version
# Output: 3.x.x hoặc cao hơn
```

### ✅ Check ESLint

```bash
pnpm eslint --version
# Output: 9.x.x hoặc cao hơn
```

### ✅ Test Formatting

Tạo file test `test.tsx`:

```tsx
const   msg  =    "hello"
```

Save file → Prettier sẽ auto-format thành:

```tsx
const msg = 'hello'
```

## 5️⃣ Daily Workflow

### Format Code

```bash
# Format tất cả files
pnpm format

# Format specific file
pnpm prettier --write src/App.tsx

# Check mà không change
pnpm prettier --check "src/**/*.{ts,tsx}"
```

### Lint Code

```bash
# Check lỗi
pnpm lint

# Fix lỗi tự động
pnpm lint:fix

# Fix + Format
pnpm lint:fix && pnpm format
```

### Type Check

```bash
pnpm type-check
```

## 6️⃣ Pre-commit Hooks (Husky)

Tự động format & lint khi commit:

```bash
git add .
git commit -m "feat: add new feature"
# Husky sẽ auto-run ESLint + Prettier
```

Nếu có lỗi → fix → commit lại

## 7️⃣ Code Style Rules

| Rule            | Value       | Notes                                |
| --------------- | ----------- | ------------------------------------ |
| Semi colons     | ❌ No       | `const x = 1` (không `const x = 1;`) |
| Quotes          | Single `'`  | `'string'` (không `"string"`)        |
| JSX Quotes      | Double `"`  | `<Button text="hello" />`            |
| Indent          | 2 spaces    | Không dùng tabs                      |
| Line Width      | 100 chars   | Auto wrap ở 100 ký tự                |
| Trailing Comma  | ES5         | Objects & arrays cuối có comma       |
| Arrow Functions | Parentheses | `(x) => x` (không `x => x`)          |
| Line Endings    | LF          | Unix style (Mac/Linux)               |

## 8️⃣ Troubleshooting

### Format không tự động?

1. **Restart VSCode** - `Ctrl+Shift+P` → "Developer: Reload Window"
2. Check Prettier extension enabled
3. Kiểm tra file không bị ignore (`.prettierignore`)

### ESLint warnings?

```bash
pnpm lint:fix   # Auto-fix
```

### Line ending issues (LF vs CRLF)?

VSCode bottom right → Select "LF"

### Conflict between team member formats?

Chạy:

```bash
pnpm format  # Fix tất cả
git add .
git commit -m "style: reformat code"
```

## 🎯 Checklist Trước Khi Push

- [ ] Code được format (`pnpm format`)
- [ ] No linting errors (`pnpm lint`)
- [ ] TypeScript compile pass (`pnpm type-check`)
- [ ] Commit message rõ ràng
- [ ] Không có console.log() debug code
- [ ] Import/Export được organize đúng

## 📝 Commands Summary

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build production
pnpm preview          # Preview build locally

# Quality Assurance
pnpm lint             # Check ESLint
pnpm lint:fix         # Auto-fix ESLint
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript check
pnpm test             # Run tests

# Combined
pnpm lint:fix && pnpm format && pnpm type-check
```

## 🤔 FAQ

**Q: Prettier vs ESLint?**

- ESLint = Kiểm tra logic errors
- Prettier = Format code style

**Q: Tại sao trailing comma?**

- Dễ xem diff trên Git
- Tránh lỗi syntax missing comma

**Q: Có thể dùng formatter khác không?**

- **KHÔNG**, phải dùng Prettier để team nhất quán

**Q: Husky không chạy?**

```bash
pnpm husky install
```

---

## 📚 References

- [Prettier Docs](https://prettier.io)
- [ESLint Docs](https://eslint.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Best Practices](https://react.dev)

---

**Mọi câu hỏi → liên hệ Tech Lead hoặc check `CODE_FORMAT_GUIDE.md`**
