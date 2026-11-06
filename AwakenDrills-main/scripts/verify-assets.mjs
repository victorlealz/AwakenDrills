import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const required = [
  'public/index.html',
  'public/css/app.css',
  'public/js/app.mjs',
  'public/js/engine.mjs',
  'public/sw.js',
  'public/manifest.webmanifest',
  'public/assets/logo.png',
  'public/assets/logo-awaken.png',
  'public/assets/favicon-32.png',
  'public/assets/favicon.ico',
  'public/assets/icon-192.png',
  'public/assets/icon-512.png',
  'public/assets/apple-touch-icon.png',
  'public/assets/audio/ORIGINAL_SOURCES.txt'
];

const missing = required.filter(file => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error(`Arquivos ausentes:\n${missing.join('\n')}`);
  process.exit(1);
}

for (const file of required.filter(file => /\.(png|webp|jpg|jpeg)$/i.test(file))) {
  const size = fs.statSync(path.resolve(file)).size;
  if (size < 100) {
    console.error(`Asset de imagem inválido ou vazio: ${file}`);
    process.exit(1);
  }
}

const expectedLogoSha256 = '5980e83a2b834d153c03928df475ae02689e3aaa4f5199518a37ec25fb2005d0';
for (const file of ['public/assets/logo.png', 'public/assets/logo-awaken.png']) {
  const bytes = fs.readFileSync(path.resolve(file));
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== expectedLogoSha256) {
    console.error(`Logo canônica alterada: ${file}`);
    process.exit(1);
  }
}

const pngDimensions = file => {
  const b = fs.readFileSync(path.resolve(file));
  const signature = b.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') throw new Error(`PNG inválido: ${file}`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

const expectedDimensions = new Map([
  ['public/assets/favicon-32.png', [32, 32]],
  ['public/assets/apple-touch-icon.png', [180, 180]],
  ['public/assets/icon-192.png', [192, 192]],
  ['public/assets/icon-512.png', [512, 512]]
]);
for (const [file, expected] of expectedDimensions) {
  const actual = pngDimensions(file);
  if (actual[0] !== expected[0] || actual[1] !== expected[1]) {
    console.error(`Dimensão incorreta em ${file}: ${actual.join('x')}`);
    process.exit(1);
  }
}

console.log(`Assets essenciais verificados: ${required.length}; logo canônica preservada.`);
