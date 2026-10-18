import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const assetsDir = path.join(process.cwd(), 'dist', 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('dist/assets directory does not exist.');
  process.exit(0);
}

const files = fs.readdirSync(assetsDir);
let compressedCount = 0;

for (const file of files) {
  if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
    const filePath = path.join(assetsDir, file);
    const content = fs.readFileSync(filePath);

    // Gzip compression (Level 9 - maximum compression)
    const gz = zlib.gzipSync(content, { level: 9 });
    fs.writeFileSync(`${filePath}.gz`, gz);

    // Brotli compression (Quality 11 - maximum compression)
    const br = zlib.brotliCompressSync(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    fs.writeFileSync(`${filePath}.br`, br);

    compressedCount++;
    const rawKb = (content.length / 1024).toFixed(1);
    const gzKb = (gz.length / 1024).toFixed(1);
    const brKb = (br.length / 1024).toFixed(1);
    console.log(`✓ Compressed ${file.padEnd(36)} raw: ${rawKb.padStart(7)} KB │ gz: ${gzKb.padStart(6)} KB │ br: ${brKb.padStart(6)} KB`);
  }
}

console.log(`Successfully generated Gzip and Brotli compressed bundles for ${compressedCount} assets.`);
