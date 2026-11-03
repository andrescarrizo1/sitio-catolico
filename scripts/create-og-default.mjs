import sharp from 'sharp';
import fs from 'fs';

const svgBanner = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#142145" />
      <stop offset="60%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#060A17" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3DC9B" />
      <stop offset="100%" stop-color="#C59A45" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGlow)" />

  <!-- Subtle border -->
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#DFBA73" stroke-width="1.5" stroke-opacity="0.25" />

  <!-- Center Emblem (from favicon.svg) -->
  <g transform="translate(536, 110)" filter="url(#shadow)">
    <rect width="128" height="128" rx="28" fill="#0e1b38" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M64 20V108M40 48H88" stroke="url(#goldGrad)" stroke-width="9" stroke-linecap="round" />
  </g>

  <!-- Brand Name -->
  <text x="600" y="320" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="54" font-weight="700" fill="#FDFBF7" letter-spacing="2">
    Razón y Asombro
  </text>

  <!-- Divider line -->
  <path d="M450 355 H750" stroke="url(#goldGrad)" stroke-width="2" stroke-linecap="round" stroke-opacity="0.7"/>

  <!-- Subtitle -->
  <text x="600" y="405" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="24" font-weight="500" fill="#DFBA73" letter-spacing="1">
    Fe Católica · Rigor Histórico y Científico
  </text>

  <!-- Mission statement snippet -->
  <text x="600" y="460" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="18" font-style="italic" fill="#94A3B8">
    Investigaciones documentadas · Santo Rosario · Magisterio de la Iglesia
  </text>

  <!-- Website domain badge at bottom -->
  <g transform="translate(480, 510)">
    <rect width="240" height="38" rx="19" fill="#142145" stroke="#DFBA73" stroke-width="1" stroke-opacity="0.4"/>
    <text x="120" y="25" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="600" fill="#FDFBF7" letter-spacing="1">
      razonyasombro.com
    </text>
  </g>
</svg>
`;

async function generateOgDefault() {
  const buffer = Buffer.from(svgBanner);
  await sharp(buffer)
    .resize(1200, 630)
    .jpeg({ quality: 85, chromaSubsampling: '4:4:4' })
    .toFile('./public/og-default.jpg');

  const stat = fs.statSync('./public/og-default.jpg');
  console.log(`Generated public/og-default.jpg: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);
}

generateOgDefault().catch(console.error);
