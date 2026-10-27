import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const licenciasPath = path.join(projectRoot, 'LICENCIAS.md');
const assetsDir = path.join(projectRoot, 'src', 'assets');

console.log('🔍 [CHECK-LICENSES] Verificando registro de licencias de activos...');

if (!fs.existsSync(licenciasPath)) {
  console.error('❌ Error: LICENCIAS.md no existe.');
  process.exit(1);
}

const licenciasContent = fs.readFileSync(licenciasPath, 'utf8');

// Obtener todas las imágenes en src/assets recursivamente
function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFiles(res) : res;
  });
  return files.filter(f => /\.(png|jpe?g|webp|avif|svg)$/i.test(f));
}

const assetFiles = getFiles(assetsDir);
let missingInRegistry = [];

for (const file of assetFiles) {
  const relativePath = path.relative(projectRoot, file).replace(/\\/g, '/');
  const fileName = path.basename(file);
  
  // Debe figurar la ruta relativa o el nombre de archivo en LICENCIAS.md
  if (!licenciasContent.includes(relativePath) && !licenciasContent.includes(fileName)) {
    missingInRegistry.push(relativePath);
  }
}

if (missingInRegistry.length > 0) {
  console.error('❌ Error: Las siguientes imágenes no están registradas en LICENCIAS.md:');
  for (const m of missingInRegistry) {
    console.error(`   - ${m}`);
  }
  process.exit(1);
}

console.log(`✅ [CHECK-LICENSES] Éxito: ${assetFiles.length} imagen(es) verificada(s) correctamente en LICENCIAS.md.`);
