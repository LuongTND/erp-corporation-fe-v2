# 🎨 Code Formatting & Style Guide

## Editor Setup (VSCode)

### 1. Install Extensions
- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)

### 2. VSCode Settings (`.vscode/settings.json`)

Tạo file `.vscode/settings.json` trong project root:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "prettier.prettierPath": "./node_modules/prettier",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true
}
```

## Formatting Rules

### Prettier Config (`.prettierrc`)

```json
{
  "semi": false,                    // Không có dấu chấm phẩy ở cuối dòng
  "singleQuote": true,             // Dùng single quote ('') cho strings
  "tabWidth": 2,                   // Indent 2 spaces
  "useTabs": false,                // Dùng spaces, không tabs
  "trailingComma": "es5",          // Trailing comma trong objects/arrays
  "printWidth": 100,               // Giới hạn 100 ký tự/dòng
  "bracketSpacing": true,          // { foo } không {foo}
  "arrowParens": "always",         // (x) => x, không x => x
  "endOfLine": "lf",               // Line endings: LF (Unix)
  "jsxSingleQuote": false,         // Dùng double quote cho JSX attributes
  "jsxBracketSameLine": false,     // Closing JSX tag trên dòng mới
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js"
}
```

## Format Commands

### Format All Files
```bash
pnpm format
```

### Format Specific File
```bash
pnpm prettier --write src/App.tsx
```

### Check Formatting (No Changes)
```bash
pnpm prettier --check "src/**/*.{ts,tsx}"
```

## Pre-commit Hooks (Husky + lint-staged)

Prettier được tích hợp trong pre-commit hooks via `lint-staged`:

**package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

Khi commit, các files sẽ tự động được format & lint.

## Tailwind CSS Class Ordering

Plugin `prettier-plugin-tailwindcss` tự động sort Tailwind classes:

**Before:**
```jsx
<div className="px-2 text-lg font-bold text-center md:px-4 bg-blue-500">
```

**After:**
```jsx
<div className="bg-blue-500 px-2 text-center font-bold text-lg md:px-4">
```

## ESLint Integration

ESLint & Prettier không xung đột nhờ `.eslintrc.cjs` được cấu hình:
- ESLint kiểm tra lỗi logic
- Prettier xử lý formatting

## Team Guidelines

### DO ✅
- Lưu file để auto-format
- Chạy `pnpm format` trước commit
- Tuân theo `.prettierrc` config
- Dùng `prettier --check` trong CI/CD

### DON'T ❌
- Không dùng manual formatting (let Prettier handle it)
- Không commit code chưa format
- Không override Prettier config cá nhân
- Không dùng khác formatter (ESlint formatter, etc)

## Troubleshooting

### Prettier không format tự động?
1. Restart VSCode
2. Check extension "Prettier" là enabled
3. Check file có trong `.prettierignore` không?
4. Run: `pnpm format`

### Conflict giữa ESLint & Prettier?
- Có thể do ESLint rule xung đột
- Check `.eslintrc.cjs` extends `prettier`
- Run: `pnpm lint:fix && pnpm format`

### Line endings khác nhau (LF vs CRLF)?
- VSCode bottom right corner: chọn "LF"
- `.prettierrc` đã set `"endOfLine": "lf"`
- Git config: `git config core.autocrlf false`

## CI/CD Check

```bash
# Check mà không auto-fix
pnpm prettier --check "src/**/*.{ts,tsx,css,md}"

# Nếu failed: format tất cả
pnpm format
```

---

## Keyboard Shortcuts (VSCode)

- **Format Document:** `Shift + Alt + F`
- **Format Selection:** `Ctrl + K Ctrl + F`
- **Quick Fix (ESLint):** `Ctrl + .`

---

## File Structure Support

Prettier hỗ trợ các file types:
- TypeScript: `.ts`, `.tsx`
- CSS/Tailwind: `.css`
- JSON: `.json`, `.prettierrc`
- Markdown: `.md`
- YAML: `.yml`, `.yaml`

---

## References
- [Prettier Docs](https://prettier.io/docs/en/index.html)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [ESLint + Prettier Integration](https://github.com/prettier/eslint-config-prettier)
