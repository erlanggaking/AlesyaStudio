# Alesya Studio

Internal management platform untuk Shopee Live affiliators.

> **Status:** MVP demo build. Aplikasi berjalan dalam mode internal (data demo + Supabase optional). Cocok untuk dijadikan trial account submission ke Shopee Open Platform.

---

## Fitur

| Modul | Fungsi |
|---|---|
| **Dashboard** | Ringkasan KPI (GMV, komisi, live aktif, top hosts/products), trend chart 7 hari |
| **Riset Produk** | Katalog produk Shopee dengan filter: penjualan/bulan, rating, jumlah review, harga, estimasi komisi, kategori, brand. Tag winning product. Import via paste URL Shopee. |
| **Live Management** | Monitor host yang sedang live, kelola Keranjang Oren (pin/unpin/add/remove produk), stop live, audit log command, tab Live / Scheduled / Ended |
| **Analytics** | KPI mendalam, GMV per host bar chart, history table semua live ended dengan conversion rate |
| **Hosts** | Manajemen talent + statistik per host |
| **Studios** | Manajemen studio + assignment host per studio |
| **Settings** | Profil studio, integrasi Shopee API, WhatsApp gateway, system status |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** TailwindCSS + shadcn/ui (Radix primitives) + Lucide icons
- **Charts:** Recharts
- **Auth & DB:** Supabase (Postgres + RLS) — optional, app berjalan dengan in-memory mock data secara default
- **Notif:** Sonner (toast) + Fonnte (WhatsApp gateway, optional)
- **Deploy:** Vercel + Supabase

---

## Quick Start (Demo Mode)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Buka http://localhost:3000 → otomatis redirect ke `/dashboard`.

**Demo credentials** (untuk login page):
- Email: `admin@alesyastudio.id`
- Password: `demo1234`

Aplikasi langsung populated dengan ~25 produk, 100+ host, 6 studio, dan 40 live session (ended/live/scheduled).

---

## Setup Supabase (Optional, untuk persistence real)

### 1. Bikin project Supabase
- Daftar di https://supabase.com → New Project (region Singapore untuk latency Indonesia)
- Catat `Project URL`, `anon key`, `service_role key`

### 2. Run migration
- Copy isi `supabase/migrations/0001_init.sql`
- Paste di Supabase Dashboard → SQL Editor → Run

### 3. Set env
```bash
cp .env.local.example .env.local
# Edit .env.local dengan credentials Supabase Anda
```

### 4. Aktifkan auth gating
Edit `middleware.ts`, uncomment baris di dalam fungsi `middleware`:
```ts
const { updateSession } = await import("@/lib/supabase/middleware");
return updateSession(_request);
```

### 5. Swap data layer ke Supabase
Edit `lib/data/queries.ts` untuk menggunakan client Supabase (`@/lib/supabase/server`) di tiap fungsi query. Schema sudah sama persis dengan tipe TS.

---

## Deploy ke Vercel

```bash
# 1. Push ke GitHub
git init && git add . && git commit -m "init"
gh repo create alesya-studio --private --source=. --push

# 2. Connect ke Vercel
# - Vercel Dashboard → New Project → Import dari GitHub
# - Set environment variables (sama dengan .env.local)
# - Deploy
```

---

## Soal Verifikasi Shopee Open Platform

Issue waktu daftar di https://open.shopee.com/console:
> "Your business product has to be live, with existing e-commerce integrations that are identifiable via a provided trial account."

**Strategi resubmit:**

1. **Deploy aplikasi ini ke production** (Vercel + custom domain misal `app.alesyastudio.id`)
2. **Bikin trial account** untuk reviewer Shopee:
   - Email: `shopee-reviewer@alesyastudio.id`
   - Password: kasih credentials yang aman
   - Pre-loaded dengan demo data lengkap (sudah otomatis via seed)
3. **Submit ulang** dengan informasi:
   - URL aplikasi live
   - Trial account credentials
   - Screenshot dashboard, riset produk, live management, analytics
   - Penjelasan use case: "Internal studio management tool untuk 100+ host Shopee Live affiliator. Butuh akses Shopee Open Platform API untuk: (a) sync produk dari shop partner, (b) lacak performance live via Marketing Affiliate API, (c) automasi cart command."

**Realita penting yang harus diketahui:**

| Fitur | API Shopee | Workaround |
|---|---|---|
| Tarik produk winning | ❌ No public endpoint | Manual paste URL → server fetch metadata, atau pakai 3rd party (Compas/Sellercount) |
| Push to Keranjang Oren | ❌ No Live Studio API | Kirim WhatsApp command ke host via Fonnte (sudah disiapkan di Settings) |
| Stop Live dari app | ❌ No Live API | Sama, signal via WA + audit log internal |
| Affiliate link & komisi | ✅ Affiliate Marketing API | Daftar di https://affiliate.shopee.co.id/open_api setelah produk live |

Aplikasi ini didesain supaya tetap valuable & functional bahkan sebelum API approved, karena workflow inti (riset, schedule, monitor, analytics) ga butuh API Shopee.

---

## Struktur Folder

```
alesya-studio/
├── app/
│   ├── (app)/                  # authenticated routes
│   │   ├── layout.tsx          # sidebar + topbar shell
│   │   ├── dashboard/
│   │   ├── research/           # riset produk dengan filter
│   │   ├── live/               # live management + cart oren
│   │   ├── analytics/
│   │   ├── hosts/
│   │   ├── studios/
│   │   └── settings/
│   ├── login/
│   ├── layout.tsx              # root layout
│   └── globals.css
├── components/
│   ├── app/                    # sidebar, topbar
│   ├── charts/                 # recharts wrappers
│   └── ui/                     # shadcn primitives
├── lib/
│   ├── data/
│   │   ├── seed.ts             # demo dataset
│   │   └── queries.ts          # query layer (mock for now)
│   ├── supabase/               # browser/server/middleware clients
│   ├── types.ts                # domain types (mirror schema)
│   └── utils.ts                # cn, formatIDR, dll
├── supabase/migrations/
│   └── 0001_init.sql           # full DDL + RLS + triggers
└── middleware.ts
```

---

## Roadmap

### Phase 1 — current (demo / Shopee submission)
- [x] Full UI module (dashboard, research, live, analytics, hosts, studios, settings)
- [x] Demo data + seamless trial account
- [x] Supabase schema ready

### Phase 2 — Production internal
- [ ] Aktifkan Supabase auth + RLS
- [ ] Real product import via server-side Shopee URL fetcher
- [ ] Fonnte WhatsApp integration (cart commands → host WA)
- [ ] Manual live performance log entry form
- [ ] Schedule live + auto-reminder

### Phase 3 — After Shopee API approved
- [ ] Sync product catalog via Shopee Open Platform
- [ ] Affiliate link generator + commission tracking via Affiliate Marketing API
- [ ] Real-time live performance via webhook/polling

### Phase 4 — Scale
- [ ] Multi-tenant SaaS (kalau mau dijual ke studio lain)
- [ ] Mobile companion app untuk host
- [ ] AI-powered product winning predictor

---

## License

Proprietary — Internal use only.
