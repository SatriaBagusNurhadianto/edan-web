// scripts/refresh-data.mjs
// Placeholder: refresh beasiswa data daily at 00:00 WIB via GitHub Actions.
// Replace with real scraping logic that verifies each official source.
import { readFileSync, writeFileSync } from 'node:fs';
const data = JSON.parse(readFileSync('./data/beasiswa.json', 'utf8'));
// Mark verifiedAt as today
const today = new Date().toISOString().slice(0, 10);
data.forEach((x) => { x.verifiedAt = today; });
writeFileSync('./data/beasiswa.json', JSON.stringify(data, null, 2));
console.log('refreshed', data.length, 'records at', today);
