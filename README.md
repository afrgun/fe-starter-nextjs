# fe-starter-nextjs

Starter Next.js (App Router) yang sudah memakai paket guideline `fe-guideline` (folder `guideline/`) dan berisi satu fitur contoh lengkap: **top up** (pilih bank → isi nominal → instruksi pembayaran), berjalan tanpa backend memakai adapter mock.

Stack: Next.js 16 · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Vitest + Testing Library · ESLint + `eslint-plugin-boundaries`. Detail versi dan konvensi: `guideline/stack-profile.md`.

## Menjalankan

```bash
npm install                 # bila npm 10 gagal "edgesOut", pakai: npx npm@11 install
cp .env.example .env.local  # NEXT_PUBLIC_USE_MOCK=true → tanpa backend
npm run dev                 # http://localhost:3000/topup
```

| Perintah | Fungsi |
|---|---|
| `npm run lint` | ESLint + aturan layer (boundaries) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (domain, mapper, adapter, use case, komponen) |
| `npm run build` | Build production |
| `npm run skills:sync` / `skills:check` | Salin skill dari `guideline/skills/` ke `.claude/skills` & `.agents/skills` / cek drift |

## Struktur

```
src/
├── app/                      # route (composition root): page.tsx tipis
├── core/
│   ├── di/server-ports.ts    # pilih adapter mock/HTTP per request
│   └── http/                 # server-http (server-only), api-endpoints, to-app-error
├── shared/
│   ├── kernel/               # Result, AppError
│   ├── lib/                  # formatOrDash, message map, cn
│   └── ui/                   # atom shadcn + EmptyState/ErrorState
└── features/topup/
    ├── domain/               # Bank, selectableBanks, validateAmount
    ├── application/          # port + use case createTopup
    ├── infrastructure/       # mapper, adapter HTTP (server/), adapter mock, kode bisnis
    └── presentation/         # server/ (RSC), client/ (form), actions.ts (Server Action)
```

Setiap folder layer punya `AGENTS.md` singkat. Aturan lengkap ada di skill `guideline/skills/`; cara kerja dengan agent: `guideline/PROMPTS.md`.

## Memakai template ini untuk project baru

Jangan mengembangkan project langsung di repo ini — buat repo baru dari template agar histori bersih dan template tetap utuh.

### 1. Buat project (pilih salah satu)

| Cara | Langkah |
|---|---|
| **GitHub template** (disarankan) | Klik **"Use this template" → "Create a new repository"** di halaman repo ini, lalu clone repo baru itu. (Pemilik repo: aktifkan sekali lewat *Settings → Template repository*.) |
| `create-next-app` | `npx create-next-app@latest nama-project --example "https://github.com/afrgun/fe-starter-nextjs"` — bila npm 10 gagal `edgesOut`, tambahkan `--skip-install` lalu jalankan `npx npm@11 install` |
| Clone manual | `git clone https://github.com/afrgun/fe-starter-nextjs.git nama-project`, hapus folder `.git`, lalu `git init` |

### 2. Ubah template menjadi project

1. Ganti `name` di `package.json` dan judul `README.md`.
2. Isi ulang `guideline/stack-profile.md` (versi, git/tiket, atom yang tersedia).
3. Ganti fitur contoh `topup` dengan fitur sungguhan: hapus `src/features/topup`, `src/app/topup`, entri di `src/core/di/server-ports.ts` dan `src/core/http/api-endpoints.ts`, `guideline/api-contracts/topup.md`, serta baris di `guideline/page-map.md`. Bangun fitur baru lewat skill `bp-feature-lifecycle` (contoh prompt: `guideline/PROMPTS.md`).
4. Salin `.env.example` → `.env.local` dan sesuaikan.
5. Jalankan `npm run skills:sync`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
