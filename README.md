This repository contains the e-permit Next.js application (frontend + API) and Prisma schema/migrations.

**Tujuan dokumen**: Instruksi lengkap untuk men-setup lingkungan development, menjalankan migrasi, men-seed database, dan akun tes.

**Prasyarat**

- Node.js 18+ dan npm/pnpm/yarn
- PostgreSQL (lokal atau via Docker)
- Git (opsional)

**Variabel environment yang wajib**
Buat file `.env` di root proyek berisi paling tidak:

- `DATABASE_URL` — connection string Postgres, format:
  `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- `AUTH_SECRET` — secret untuk menandatangani JWT (contoh: 64 hex chars)

Variabel opsional untuk menyesuaikan kata sandi akun seed:

- `SEED_ADMIN_PASSWORD` — (default: `admin1234`)
- `SEED_USER_PASSWORD` — (default: `user1234`)

Contoh `.env` minimal:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/e_permit
AUTH_SECRET=your_generated_secret_here
SEED_ADMIN_PASSWORD=admin1234
SEED_USER_PASSWORD=user1234
NODE_ENV=development
```

**Instal dependency**

1. Install dependency:

```bash
npm install
# atau pnpm install
# atau yarn
```

2. Generate Prisma Client (wajib sebelum seed dan sebelum menjalankan aplikasi karena client di-output ke `app/generated/prisma`):

```bash
npx prisma generate
```

**Menerapkan migrasi (database sudah kosong / ada file migrasi di repo)**

Jika Anda hanya ingin menerapkan migrasi yang sudah ada di folder `prisma/migrations`:

```bash
npx prisma migrate deploy
```

Untuk pengembangan (menghapus semua data, menjalankan migrasi ulang dan seed) gunakan:

```bash
npx prisma migrate reset --force
```

Catatan: `migrate reset` akan menghapus seluruh data pada database. Gunakan hanya di lingkungan development.

**Menjalankan seeding (menambahkan akun tes)**

Seed project sudah dikonfigurasi di `package.json` dan `prisma.config.ts`. Untuk menjalankan seed:

```bash
npx prisma db seed
```

Seed akan membuat dua akun default (jika belum ada):

- Admin: `admin@gmail.com` (password default `admin1234` atau sesuai `SEED_ADMIN_PASSWORD`)
- User: `user@gmail.com` (password default `user1234` atau sesuai `SEED_USER_PASSWORD`)

Jika Anda ingin mengubah password akun seed, set `SEED_ADMIN_PASSWORD` dan/atau `SEED_USER_PASSWORD` di `.env` sebelum menjalankan `npx prisma db seed`.

**Menjalankan aplikasi (development)**

```bash
npm run dev
# lalu buka http://localhost:3000
```

**Build dan jalankan production (opsional)**

```bash
npm run build
npm start
```

**Ringkasan perintah umum**

- Install deps: `npm install`
- Generate Prisma client: `npx prisma generate`
- Terapkan migrasi (prod): `npx prisma migrate deploy`
- Reset DB & seed (dev): `npx prisma migrate reset --force`
- Jalankan seed: `npx prisma db seed`
- Jalankan dev server: `npm run dev`

**Akun Tes (default)**

- Admin: email `admin@gmail.com` — password `admin1234` (atau isi `SEED_ADMIN_PASSWORD` di `.env`)
- User: email `user@gmail.com` — password `user1234` (atau isi `SEED_USER_PASSWORD` di `.env`)

**Masalah umum & solusi singkat**

- Error: `AUTH_SECRET is required` → pastikan `AUTH_SECRET` di `.env` dan restart server.
- Error: koneksi database → periksa `DATABASE_URL`, pastikan Postgres berjalan dan port/creds benar.
- Jika Prisma client tidak ditemukan → jalankan `npx prisma generate`.