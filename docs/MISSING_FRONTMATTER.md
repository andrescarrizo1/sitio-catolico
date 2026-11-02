# Reporte de Campos de Frontmatter Faltantes (Fase 2 - Estructura)

Generado automáticamente por `scripts/check-missing-frontmatter.mjs`.

Este reporte audita los campos opcionales introducidos en el esquema de contenido para Fase 2:
- `author` (o autor)
- `reviewedBy` (o revisado_por)
- `lastReviewed` (o fecha_revision)
- `sources[]` (o fuentes[])
- `evidenceLevel`

> **Regla de presentación:** En los layouts (`ArticleLayout` y `FactLayout`), los bloques de revisión ("Revisado por...", "Revisado el...") y la bibliografía solo se renderizan si el campo existe, no está vacío y no contiene texto placeholder.

---

## Tabla de Auditoría por Artículo

| Archivo | `author` | `reviewedBy` | `lastReviewed` | `sources` | `evidenceLevel` | Campos Nuevos Faltantes |
|---|---|---|---|---|---|---|
| `src/content/ciencia-fe/lourdes-bureau-medical.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/ciencia-fe/sabana-santa-de-turin.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/fatima/milagro-del-sol.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/jesus/el-buen-samaritano.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/milagros/buenos-aires.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/milagros/lanciano.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/milagros/sokolka.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/santos/carlo-acutis.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/santos/estudios-medicos-y-santo-oficio.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/content/santos/faustina-kowalska.mdx` | Legacy (`autor`) | Legacy (`revisado_por`) | Legacy (`fecha_revision`) | Legacy (`fuentes`) | **FALTA** | author, reviewedBy, lastReviewed, sources, evidenceLevel |
| `src/pages/en/shroud-of-turin.astro` | OK (inline schema) | **FALTA** | OK (`dateModified`) | **FALTA** | **FALTA** | reviewedBy, evidenceLevel |
| `src/pages/en/divine-mercy-chaplet.astro` | OK (inline schema) | **FALTA** | OK (`dateModified`) | **FALTA** | **FALTA** | reviewedBy, evidenceLevel |

---

## Resumen Ejecutivo

- **Total de artículos auditados:** 13
- **`evidenceLevel`:** Falta en todos los artículos (campo nuevo opcional de Fase 2 listo para ser completado por los editores).
- **Campos de autoría y revisión:** Todos los artículos en español cuentan actualmente con los equivalentes funcionales (`autor`, `revisado_por`, `fecha_revision`, `fuentes`), soportados de forma retrocompatible y con fallback hacia fecha de commit de Git en JSON-LD.
- **Acción requerida para editores:** Rellenar gradualmente `evidenceLevel` y normalizar a `author`, `reviewedBy`, `lastReviewed`, `sources` en las frontmatters sin riesgo de rotura de build, ya que todos los campos son opcionales en `src/content.config.ts`.
