import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: El directorio dist/ no existe. Ejecuta "npm run build" antes de verificar.');
  process.exit(1);
}

function getAllHtmlFiles(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      res = res.concat(getAllHtmlFiles(full));
    } else if (item.name.endsWith('.html')) {
      res.push(full);
    }
  }
  return res;
}

function urlToDistPath(urlStr) {
  try {
    const url = new URL(urlStr, 'https://razonyasombro.com');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    } else if (!path.extname(pathname)) {
      pathname += '/index.html';
    }
    return path.join(distDir, pathname);
  } catch {
    return null;
  }
}

function assetUrlToDistPath(urlStr) {
  try {
    const url = new URL(urlStr, 'https://razonyasombro.com');
    let pathname = decodeURIComponent(url.pathname);
    return path.join(distDir, pathname);
  } catch {
    return null;
  }
}

const errors = [];

console.log('🔍 Iniciando verificación integral de integridad SEO en dist/...\n');

// ==========================================
// 1. VERIFICACIÓN DE SITEMAP Y NOINDEX
// ==========================================
console.log('--- 1. Verificando Sitemap y exclusión de páginas noindex ---');
const sitemapFiles = fs.readdirSync(distDir).filter(f => f.startsWith('sitemap') && f.endsWith('.xml') && f !== 'sitemap-index.xml');

if (sitemapFiles.length === 0) {
  errors.push('No se encontraron archivos sitemap*.xml en dist/');
} else {
  for (const sf of sitemapFiles) {
    const sitemapPath = path.join(distDir, sf);
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const locs = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    console.log(`  Sitemap "${sf}" contiene ${locs.length} URLs.`);

    for (const loc of locs) {
      const filePath = urlToDistPath(loc);
      if (!filePath || !fs.existsSync(filePath)) {
        errors.push(`URL en sitemap no existe en dist: ${loc}`);
        continue;
      }

      const html = fs.readFileSync(filePath, 'utf8');
      const hasNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']/i.test(html) ||
                         /<meta\s+content=["'][^"']*noindex[^"']*["']\s+name=["']robots["']/i.test(html);
      if (hasNoindex) {
        errors.push(`PÁGINA NOINDEX EN SITEMAP: ${loc} está en ${sf} pero tiene meta robots noindex`);
      }
    }
  }
}

// ==========================================
// 2. VERIFICACIÓN DE CANONICALS, ALTERNATES Y HREFLANG RECÍPROCO
// ==========================================
console.log('\n--- 2. Verificando Canonicals, Alternates y Hreflang recíproco ---');
const htmlFiles = getAllHtmlFiles(distDir);
console.log(`  Analizando ${htmlFiles.length} archivos HTML...`);

const pageCanonicalMap = new Map(); // distFilePath -> canonicalUrl
const pageAlternatesMap = new Map(); // canonicalUrl -> { [hreflang]: targetUrl }
const urlToDistMap = new Map(); // canonicalUrl -> distFilePath

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const relPath = path.relative(distDir, f).replace(/\\/g, '/');

  // Canonical
  const canMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (canMatch) {
    const canUrl = canMatch[1];
    const canPath = urlToDistPath(canUrl);
    if (!canPath || !fs.existsSync(canPath)) {
      errors.push(`Canonical roto en ${relPath}: apunta a "${canUrl}" que no existe en dist/`);
    } else {
      pageCanonicalMap.set(f, canUrl);
      urlToDistMap.set(canUrl, f);
    }
  }

  // Alternates
  const altRegex = /<link\s+rel=["']alternate["']\s+(?:hreflang=["']([^"']+)["']\s+)?href=["']([^"']+)["']/gi;
  const altRegex2 = /<link\s+(?:hreflang=["']([^"']+)["']\s+)?rel=["']alternate["']\s+href=["']([^"']+)["']/gi;
  const altMatches = [...content.matchAll(altRegex), ...content.matchAll(altRegex2)];

  const alts = {};
  for (const m of altMatches) {
    const lang = m[1];
    const altUrl = m[2];
    const altPath = urlToDistPath(altUrl);
    if (!altPath || !fs.existsSync(altPath)) {
      errors.push(`Alternate roto en ${relPath}: hreflang="${lang || 'none'}" apunta a "${altUrl}" que no existe en dist/`);
    } else if (lang) {
      alts[lang] = altUrl;
    }
  }

  if (canMatch && Object.keys(alts).length > 0) {
    pageAlternatesMap.set(canMatch[1], alts);
  }
}

// Comprobación de reciprocidad hreflang
for (const [sourceUrl, alts] of pageAlternatesMap.entries()) {
  for (const [lang, targetUrl] of Object.entries(alts)) {
    if (lang === 'x-default') continue;
    if (targetUrl === sourceUrl) continue; // auto-referencia OK

    const targetAlts = pageAlternatesMap.get(targetUrl);
    if (!targetAlts) {
      errors.push(`Hreflang NO recíproco: "${sourceUrl}" apunta a "${targetUrl}" (hreflang="${lang}"), pero la página de destino no define alternates.`);
      continue;
    }

    // Comprobar que la página de destino tiene un alternate que apunta de vuelta a sourceUrl
    const pointsBack = Object.values(targetAlts).some(u => u === sourceUrl);
    if (!pointsBack) {
      errors.push(`Hreflang NO recíproco: "${sourceUrl}" apunta a "${targetUrl}" (hreflang="${lang}"), pero "${targetUrl}" no apunta de vuelta a "${sourceUrl}".`);
    }
  }
}

// ==========================================
// 3. VERIFICACIÓN DE OG:IMAGE Y SCHEMA IMAGES EN DIST
// ==========================================
console.log('\n--- 3. Verificando existencia de og:image y Schema images en dist/ ---');

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const relPath = path.relative(distDir, f).replace(/\\/g, '/');

  // og:image
  const ogImgRegex = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/gi;
  const ogImgRegex2 = /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/gi;
  const ogMatches = [...content.matchAll(ogImgRegex), ...content.matchAll(ogImgRegex2)];

  for (const m of ogMatches) {
    const imgUrl = m[1];
    const imgPath = assetUrlToDistPath(imgUrl);
    if (!imgPath || !fs.existsSync(imgPath)) {
      errors.push(`og:image inexistente en ${relPath}: "${imgUrl}"`);
    }
  }

  // Schema LD+JSON images
  const ldJsonRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const jsonMatches = [...content.matchAll(ldJsonRegex)];

  for (const jm of jsonMatches) {
    try {
      const data = JSON.parse(jm[1]);
      
      const inspectSchemaObject = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        
        // image
        if (obj.image) {
          const imgs = Array.isArray(obj.image) ? obj.image : [obj.image];
          for (const item of imgs) {
            const u = typeof item === 'string' ? item : item?.url;
            if (u && !u.startsWith('http://localhost') && !u.startsWith('https://schema.org')) {
              const imgP = assetUrlToDistPath(u);
              if (!imgP || !fs.existsSync(imgP)) {
                errors.push(`Imagen de Schema inexistente en ${relPath}: "${u}"`);
              }
            }
          }
        }

        // logo
        if (obj.logo) {
          const u = typeof obj.logo === 'string' ? obj.logo : obj.logo?.url;
          if (u && !u.startsWith('http://localhost')) {
            const imgP = assetUrlToDistPath(u);
            if (!imgP || !fs.existsSync(imgP)) {
              errors.push(`Logo de Schema inexistente en ${relPath}: "${u}"`);
            }
          }
        }

        for (const val of Object.values(obj)) {
          if (typeof val === 'object') inspectSchemaObject(val);
        }
      };

      inspectSchemaObject(data);
    } catch (e) {
      errors.push(`Error parseando JSON-LD en ${relPath}: ${e.message}`);
    }
  }
}

// ==========================================
// RESULTADO FINAL
// ==========================================
console.log('\n==========================================');
if (errors.length > 0) {
  console.error(`❌ SE ENCONTRARON ${errors.length} FALLOS DE INTEGRIDAD SEO:\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.log('==========================================\n');
  process.exit(1);
} else {
  console.log('✅ TODAS LAS VERIFICACIONES SEO PASARON CON ÉXITO:');
  console.log('  ✓ Hreflang 100% recíproco en todas las páginas bilingües.');
  console.log('  ✓ Todos los alternates y canonicals apuntan a URLs válidas existentes en dist/.');
  console.log('  ✓ Ninguna URL con meta noindex está presente en el sitemap.');
  console.log('  ✓ Todos los og:image y recursos de imagen de Schema existen físicamente en dist/.');
  console.log('==========================================\n');
  process.exit(0);
}
