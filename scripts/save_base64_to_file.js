import fs from 'fs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const base64Path = path.join(__dirname, 'base64.txt');
if (!fs.existsSync(base64Path)) {
  console.error('base64.txt not found in scripts/ — please add it with the data URI or base64 payload');
  process.exit(1);
}
const base64 = fs.readFileSync(base64Path, 'utf8').trim();
if (!base64 || base64.length < 100) {
  console.error('Base64 string looks too short or is missing.');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'public', 'uploads');
fs.mkdirSync(outDir, { recursive: true });
const filename = `uploaded-from-base64-${Date.now()}.jpg`;
const outPath = path.join(outDir, filename);
// strip data: prefix if present
const clean = base64.includes(',') ? base64.split(',')[1] : base64;
const buffer = Buffer.from(clean, 'base64');
fs.writeFileSync(outPath, buffer);
console.log('WROTE_FILE_PATH=' + outPath);
console.log('PUBLIC_URL=' + '/uploads/' + filename);
