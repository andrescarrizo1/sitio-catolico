import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

console.log('🔍 [CHECK-LINKS] Verificando enlaces internos en dist/...');

if (!fs.existsSync(distDir)) {
  console.log('⚠️ Aviso: La carpeta dist/ no existe todavía. Ejecuta npm run build primero.');
  process.exit(0);
}

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getHtmlFiles(res) : res;
  });
  return files.filter(f => f.endsWith('.html'));
}

const htmlFiles = getHtmlFiles(distDir);
let brokenLinks = [];

const hrefRegex = /href=["']([^"']+)["']/g;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    
    // Ignorar URLs externas, anclas, mails o javascript:
    if (/^(https?:\/\/|mailto:|tel:|javascript:|#)/.test(href)) {
      continue;
    }
    
    // Extraer ruta limpia sin hash o query
    const cleanPath = href.split('#')[0].split('?')[0];
    if (!cleanPath) continue;

    // Resolver en dist
    let targetFile;
    if (cleanPath.endsWith('/')) {
      targetFile = path.join(distDir, cleanPath, 'index.html');
    } else if (cleanPath.endsWith('.html')) {
      targetFile = path.join(distDir, cleanPath);
    } else {
      // Probar si existe como archivo directo o directorio index.html
      const asFile = path.join(distDir, cleanPath);
      const asDirIndex = path.join(distDir, cleanPath, 'index.html');
      targetFile = fs.existsSync(asFile) ? asFile : asDirIndex;
    }

    if (!fs.existsSync(targetFile)) {
      brokenLinks.push({
        source: path.relative(distDir, file),
        target: href
      });
    }
  }
}

if (brokenLinks.length > 0) {
  console.error(`❌ Error: Se encontraron ${brokenLinks.length} enlace(s) rotos:`);
  for (const b of brokenLinks) {
    console.error(`   - Desde: ${b.source} -> Destino no encontrado: ${b.target}`);
  }
  process.exit(1);
}

console.log(`✅ [CHECK-LINKS] Éxito: 0 enlaces rotos detectados en ${htmlFiles.length} página(s) HTML.`);
