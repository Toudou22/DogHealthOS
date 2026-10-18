const fs = require('fs');
const path = require('path');

// Extract breed names directly from src/breeds.ts
const breedsFilePath = path.join(__dirname, '..', 'src', 'breeds.ts');
const breedsContent = fs.readFileSync(breedsFilePath, 'utf-8');

const nameMatches = [];
const nameRegex = /name:\s*"([^"]+)"/g;
let match;
while ((match = nameRegex.exec(breedsContent)) !== null) {
  nameMatches.push(match[1]);
}

const uniqueBreeds = Array.from(new Set(nameMatches)).sort();

console.log(`Found ${uniqueBreeds.length} unique dog breeds for sitemap generation.`);

const baseUrl = 'https://app.doghealthos.com';
const lastMod = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
xml += `        xmlns:xsi="http://www.w3.org/2000/svg"\n`;
xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

// Core App Pages
const corePages = [
  { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
  { url: `${baseUrl}/?view=calculator`, priority: '0.9', changefreq: 'daily' },
  { url: `${baseUrl}/?view=faqs`, priority: '0.9', changefreq: 'weekly' },
  { url: `${baseUrl}/?view=breeder-suite`, priority: '0.8', changefreq: 'weekly' },
  { url: `${baseUrl}/?view=vet-suite`, priority: '0.8', changefreq: 'weekly' },
  { url: `${baseUrl}/?view=affiliates`, priority: '0.7', changefreq: 'monthly' }
];

corePages.forEach(page => {
  xml += `  <url>\n`;
  xml += `    <loc>${page.url}</loc>\n`;
  xml += `    <lastmod>${lastMod}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>\n`;
  xml += `  </url>\n`;
});

// Top FAQs Anchors for Rich Snippet Indexing
const faqAnchors = [
  'boas-breathing-risk-mitigation',
  'bcs-weight-caloric-math',
  'waltham-pediatric-growth-curves',
  'spoken-audio-passports-dvm',
  'genetic-clearance-vault-ofa',
  'grooming-hygiene-cadence-matrix'
];

faqAnchors.forEach(anchor => {
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/?view=faqs#${anchor}</loc>\n`;
  xml += `    <lastmod>${lastMod}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
});

// Breed Profiles Indexing (e.g., /?breed=French%20Bulldog)
uniqueBreeds.forEach(breed => {
  const encodedBreed = encodeURIComponent(breed);
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/?breed=${encodedBreed}</loc>\n`;
  xml += `    <lastmod>${lastMod}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>\n`;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf-8');

console.log(`Successfully generated public/sitemap.xml with ${corePages.length + faqAnchors.length + uniqueBreeds.length} URLs!`);
