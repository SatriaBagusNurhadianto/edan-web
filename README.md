# EDULINK.id — Jelajah Beasiswa Indonesia

Prototype React + Vite untuk ditinjau sebelum deployment.

## Struktur

- `index.html` — shell Vite dan React mount point.
- `css/styles.css` — stylesheet responsif, tema pink/cyan/lilac.
- `js/main.jsx`, `js/App.jsx` — entry point dan UI React.
- `js/utils.js` — fungsi pencarian/filter/status/Share WhatsApp.
- `data/beasiswa.json` — 10 program beasiswa dengan deadline, syarat, dan tautan sumber.
- `tests/data-and-ui.test.mjs` — tes kontrak data dan fungsi utama.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka alamat lokal yang dicetak Vite. Pemeriksaan sebelum review:

```bash
npm test
npm run build
npm run preview
```

## Catatan isi

Data adalah kurasi manual dari tautan penyelenggara/pemerintah yang tercantum di setiap objek `sources`. Status dan tanggal diperiksa pada **21 Oktober 2026**. Tenggat yang sudah lewat tetap ditampilkan sebagai arsip; program yang jadwalnya ditentukan kampus ditandai demikian. Khusus Djarum, tanggal periode 2026/2027 belum diumumkan pada sumber yang diperiksa; tanggal periode 2025/2026 hanya dicatat sebagai siklus sebelumnya, bukan tenggat aktif.

EDULINK bukan penyelenggara beasiswa. Sebelum mendaftar, pengguna perlu membuka sumber resmi karena persyaratan, kuota, jadwal, dan tautan pendaftaran dapat berubah.

## Vercel

Konfigurasi build Vite disiapkan di `vercel.json`; **belum dideploy**. Setelah review dan persetujuan, hubungkan repo/folder ini ke Vercel atau jalankan deploy dari CLI.
