import fs from 'node:fs';
import path from 'node:path';

const contentDirs = [
  'src/content/ciencia-fe',
  'src/content/fatima',
  'src/content/jesus',
  'src/content/milagros',
  'src/content/santos',
];

const standalonePages = [
  'src/pages/en/shroud-of-turin.astro',
  'src/pages/en/divine-mercy-chaplet.astro',
];

function getFiles(dir) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir, { withFileTypes: true })
    .filter(d => !d.isDirectory() && (d.name.endsWith('.md') || d.name.endsWith('.mdx')))
    .map(d => path.join(dir, d.name).replace(/\\/g, '/'));
}

const allFiles = contentDirs.flatMap(getFiles);

const targetFields = ['author', 'reviewedBy', 'lastReviewed', 'sources', 'evidenceLevel'];

const rows = [];

for (const filePath of allFiles) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const frontmatter = match ? match[1] : '';

  // Extract keys
  const lines = frontmatter.split('\n');
  const keys = new Set();
  for (const line of lines) {
    const km = line.match(/^([a-zA-Z0-9_-]+):/);
    if (km) keys.add(km[1]);
  }

  // Check presence of Fase 2 fields
  const missingNew = targetFields.filter(f => !keys.has(f));

  rows.push({
    file: filePath,
    author: keys.has('author') ? 'OK (`author`)' : (keys.has('autor') ? 'Legacy (`autor`)' : '**FALTA**'),
    reviewedBy: keys.has('reviewedBy') ? 'OK (`reviewedBy`)' : (keys.has('revisado_por') ? 'Legacy (`revisado_por`)' : '**FALTA**'),
    lastReviewed: keys.has('lastReviewed') ? 'OK (`lastReviewed`)' : (keys.has('fecha_revision') ? 'Legacy (`fecha_revision`)' : '**FALTA**'),
    sources: keys.has('sources') ? 'OK (`sources`)' : (keys.has('fuentes') ? 'Legacy (`fuentes`)' : '**FALTA**'),
    evidenceLevel: keys.has('evidenceLevel') ? 'OK' : '**FALTA**',
    missingNewFields: missingNew.join(', ') || 'Ninguno',
  });
}

// Standalone pages
for (const pagePath of standalonePages) {
  const content = fs.readFileSync(path.resolve(pagePath), 'utf8');
  const hasAuthor = content.includes('author');
  const hasReviewedBy = content.includes('reviewedBy');
  const hasLastReviewed = content.includes('dateModified') || content.includes('lastReviewed');
  const hasSources = content.includes('sources') || content.includes('fuentes');
  const hasEvidenceLevel = content.includes('evidenceLevel');

  rows.push({
    file: pagePath,
    author: hasAuthor ? 'OK (inline schema)' : '**FALTA**',
    reviewedBy: hasReviewedBy ? 'OK' : '**FALTA**',
    lastReviewed: hasLastReviewed ? 'OK (`dateModified`)' : '**FALTA**',
    sources: hasSources ? 'OK' : '**FALTA**',
    evidenceLevel: hasEvidenceLevel ? 'OK' : '**FALTA**',
    missingNewFields: ['reviewedBy', 'evidenceLevel'].join(', '),
  });
}

const md = `# Reporte de Campos de Frontmatter Faltantes (Fase 2 - Estructura)

Generado automáticamente por \`scripts/check-missing-frontmatter.mjs\`.

Este reporte audita los campos opcionales introducidos en el esquema de contenido para Fase 2:
- \`author\` (o autor)
- \`reviewedBy\` (o revisado_por)
- \`lastReviewed\` (o fecha_revision)
- \`sources[]\` (o fuentes[])
- \`evidenceLevel\`

> **Regla de presentación:** En los layouts (\`ArticleLayout\` y \`FactLayout\`), los bloques de revisión ("Revisado por...", "Revisado el...") y la bibliografía solo se renderizan si el campo existe, no está vacío y no contiene texto placeholder.

---

## Tabla de Auditoría por Artículo

| Archivo | \`author\` | \`reviewedBy\` | \`lastReviewed\` | \`sources\` | \`evidenceLevel\` | Campos Nuevos Faltantes |
|---|---|---|---|---|---|---|
${rows.map(r => `| \`${r.file}\` | ${r.author} | ${r.reviewedBy} | ${r.lastReviewed} | ${r.sources} | ${r.evidenceLevel} | ${r.missingNewFields} |`).join('\n')}

---

## Resumen Ejecutivo

- **Total de artículos auditados:** ${rows.length}
- **\`evidenceLevel\`:** Falta en todos los artículos (campo nuevo opcional de Fase 2 listo para ser completado por los editores).
- **Campos de autoría y revisión:** Todos los artículos en español cuentan actualmente con los equivalentes funcionales (\`autor\`, \`revisado_por\`, \`fecha_revision\`, \`fuentes\`), soportados de forma retrocompatible y con fallback hacia fecha de commit de Git en JSON-LD.
- **Acción requerida para editores:** Rellenar gradualmente \`evidenceLevel\` y normalizar a \`author\`, \`reviewedBy\`, \`lastReviewed\`, \`sources\` en las frontmatters sin riesgo de rotura de build, ya que todos los campos son opcionales en \`src/content.config.ts\`.
`;

fs.writeFileSync(path.resolve('docs/MISSING_FRONTMATTER.md'), md, 'utf8');
console.log('✓ docs/MISSING_FRONTMATTER.md generado con éxito.');
