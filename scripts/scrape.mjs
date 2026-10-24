// scripts/scrape.mjs - Best-effort scraper for Indonesian scholarships.
// Fetches from a public aggregator and appends new entries to data/beasiswa.json.
// Run: node scripts/scrape.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'https://indbeasiswa.com/daftar-beasiswa-s1/';
const res = await fetch(SOURCE);
const html = await res.text();

// Extract beasiswa titles (bold lines starting with "Beasiswa")
const titles = [...new Set((html.match(/Beasiswa [A-Za-z0-9 .\-()]+/g) || []))].slice(0, 20);
console.log('found titles:', titles.length);

const data = JSON.parse(readFileSync('./data/beasiswa.json', 'utf8'));
const existing = new Set(data.map((x) => x.id));
let added = 0;

for (const t of titles) {
  const id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) + '-scraped';
  if (existing.has(id)) continue;
  data.push({
    id,
    title: t,
    provider: 'Sumber: indbeasiswa.com',
    level: 'S1',
    category: 'Swasta',
    summary: 'Hasil scraping otomatis. Verifikasi ke sumber resmi sebelum mendaftar.',
    benefit: 'Detail mengikuti sumber.',
    deadline: { status: 'upcoming', label: 'Cek sumber', detail: 'Verifikasi jadwal di sumber resmi.' },
    requirements: ['Verifikasi persyaratan di sumber resmi.', 'Cek jadwal dan tenggat di sumber.', 'Siapkan dokumen sesuai panduan.'],
    officialUrl: SOURCE,
    sources: [SOURCE],
    verifiedAt: new Date().toISOString().slice(0, 10),
    openType: 'Bersyarat',
  });
  existing.add(id);
  added++;
}

writeFileSync('./data/beasiswa.json', JSON.stringify(data, null, 2));
console.log('added', added, 'new entries. total:', data.length);
EOF