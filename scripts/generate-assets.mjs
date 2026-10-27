import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const assets = [
  { path: 'src/assets/milagros/lanciano-relicario.webp', title: 'Relicario de Lanciano', subtitle: 'Milagro Eucarístico · Siglo VIII', color: '#141e3c' },
  { path: 'src/assets/milagros/sokolka-colegiata.webp', title: 'Colegiata de Sokółka', subtitle: 'Hostia de San Antonio · 2008', color: '#1f2b4d' },
  { path: 'src/assets/milagros/legnica-san-jacek.webp', title: 'Santuario de Legnica', subtitle: 'Parroquia San Jacek · 2013', color: '#141e3c' },
  { path: 'src/assets/fatima/fatima-milagro-del-sol-1917.webp', title: 'Milagro del Sol · 1917', subtitle: 'Cova da Iria · Fotografía de Judah Ruah', color: '#1e3a8a' },
  { path: 'src/assets/fatima/fatima-tres-pastorcitos-1917.webp', title: 'Los Tres Pastorcitos', subtitle: 'Lucía, Francisco y Jacinta Marto · 1917', color: '#1e3a8a' },
  { path: 'src/assets/fatima/fatima-capelinha-apariciones.webp', title: 'Capilla de las Apariciones', subtitle: 'Santuario de Nuestra Señora de Fátima', color: '#141e3c' },
  { path: 'src/assets/padre-pio/padre-pio-celebrando-misa.webp', title: 'San Pío de Pietrelcina', subtitle: 'Celebración de la Santa Misa · Convento Capuchino', color: '#293241' },
  { path: 'src/assets/padre-pio/padre-pio-retrato-mitones.webp', title: 'Padre Pío con Mitones', subtitle: 'San Giovanni Rotondo · Archivo Histórico', color: '#1f2b4d' },
  { path: 'src/assets/padre-pio/santuario-santa-maria-delle-grazie.webp', title: 'Santa Maria delle Grazie', subtitle: 'Santuario de San Giovanni Rotondo', color: '#141e3c' },
  { path: 'src/assets/jesus/sermon-de-la-montana-bloch.webp', title: 'El Sermón de la Montaña', subtitle: 'Carl Bloch (1877) · Las Bienaventuranzas', color: '#141e3c' },
  { path: 'src/assets/jesus/el-buen-samaritano-rembrandt.webp', title: 'El Buen Samaritano', subtitle: 'Rembrandt van Rijn (1638) · Misericordia Activa', color: '#1c2541' },
  { path: 'src/assets/jesus/el-retorno-del-hijo-prodigo-rembrandt.webp', title: 'El Retorno del Hijo Pródigo', subtitle: 'Rembrandt van Rijn (1669) · El Abrazo del Padre', color: '#141e3c' },
  { path: 'src/assets/jesus/cristo-pantocrator-sinai.webp', title: 'Cristo Pantocrátor', subtitle: 'Icono del Monasterio de Santa Catalina · Siglo VI', color: '#0b132b' },
];

async function createAsset(item) {
  const dir = path.dirname(item.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const svg = `
  <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${item.color}" />
        <stop offset="100%" stop-color="#0b132b" />
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#c5a059" />
        <stop offset="50%" stop-color="#dfba73" />
        <stop offset="100%" stop-color="#c5a059" />
      </linearGradient>
    </defs>

    <rect width="1200" height="800" fill="url(#bg)"/>

    <!-- Marco ornamental sutil -->
    <rect x="40" y="40" width="1120" height="720" fill="none" stroke="url(#gold)" stroke-width="2" stroke-opacity="0.4" rx="16"/>
    <rect x="52" y="52" width="1096" height="696" fill="none" stroke="url(#gold)" stroke-width="1" stroke-opacity="0.2" rx="10"/>

    <!-- Cruz de honor superior -->
    <g transform="translate(600, 240)">
      <path d="M0 -50 L0 50 M-30 -15 L30 -15" stroke="url(#gold)" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- Tipografía sacra -->
    <text x="600" y="440" font-family="Cinzel, Georgia, serif" font-size="52" font-weight="bold" fill="#faf8f5" text-anchor="middle" letter-spacing="1">
      ${item.title}
    </text>

    <text x="600" y="500" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="22" fill="#dfba73" text-anchor="middle" letter-spacing="2">
      ${item.subtitle.toUpperCase()}
    </text>

    <text x="600" y="680" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" fill="#a0aec0" text-anchor="middle" opacity="0.8">
      AD VERITATEM &#183; ARCHIVO HISTÓRICO Y SACRO
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(item.path);

  console.log('✓ Generado:', item.path);
}

for (const item of assets) {
  await createAsset(item);
}

console.log('✨ Todos los activos de arte sacro generados con éxito.');
