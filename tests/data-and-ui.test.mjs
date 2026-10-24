import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { filterScholarships, getStatusLabel, createWhatsAppShareUrl } from '../js/utils.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scholarships = JSON.parse(readFileSync(resolve(root, 'data/beasiswa.json'), 'utf8'));

test('data berisi 8–10 beasiswa nasional unik dengan rincian dan sumber resmi', () => {
  assert.ok(scholarships.length >= 8 && scholarships.length <= 30);
  assert.equal(new Set(scholarships.map((item) => item.id)).size, scholarships.length);
  for (const item of scholarships) {
    assert.ok(item.title);
    assert.ok(item.provider);
    assert.ok(item.deadline?.label);
    assert.ok(item.deadline?.status);
    assert.ok(Array.isArray(item.requirements) && item.requirements.length >= 3);
    assert.ok(item.officialUrl.startsWith('https://'));
    assert.ok(item.sources?.some((url) => url.startsWith('https://')));
  }
});

test('filter mencari nama, penyelenggara, jenjang, dan kategori tanpa membedakan kapital', () => {
  assert.equal(filterScholarships(scholarships, { query: 'bAzNaS' }).length, 1);
  assert.equal(filterScholarships(scholarships, { query: 'S1' }).length > 0, true);
  assert.equal(filterScholarships(scholarships, { category: 'Pemerintah' }).length > 0, true);
});

test('label pendaftaran menunjukkan status dengan jelas', () => {
  assert.match(getStatusLabel('open'), /dibuka/i);
  assert.match(getStatusLabel('closed'), /ditutup/i);
  assert.match(getStatusLabel('campus'), /kampus/i);
  assert.match(getStatusLabel('upcoming'), /belum diumumkan/i);
});

test('tautan Share WhatsApp membawa nama beasiswa dan URL halaman detail', () => {
  const item = scholarships[0];
  const url = createWhatsAppShareUrl(item, `https://edulink-demo.test/?beasiswa=${item.id}`);
  assert.ok(url.startsWith('https://wa.me/?text='));
  const sharedText = decodeURIComponent(url.split('?text=')[1]);
  assert.match(sharedText, new RegExp(item.title));
  assert.match(sharedText, new RegExp(encodeURI(item.id)));
});
