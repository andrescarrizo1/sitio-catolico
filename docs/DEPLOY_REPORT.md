# Reporte de Despliegue — razonyasombro.com

- Fecha: 2026-11-03
- Repositorio: `andrescarrizo1/sitio-catolico`
- Entorno de despliegue: Astro estático en Cloudflare Workers con Static Assets (Workers Builds automático sobre rama `main`)
- Ingeniero de despliegue: Antigravity Agent

---

## PASO 0 – RESPALDO

### 1. `git status`
```
On branch seo/fase-2-estructura
nothing to commit, working tree clean
```

### 2. `git fetch --all --prune`
```
Fetching origin
(Exit code 0)
```

### 3. Creación y push del tag de respaldo
```
git tag backup/main-pre-seo-merge origin/main
git push origin backup/main-pre-seo-merge
To https://github.com/andrescarrizo1/sitio-catolico.git
 * [new tag]         backup/main-pre-seo-merge -> backup/main-pre-seo-merge
```

### 4. SHA de origin/main
```
5db7a14450c2d9c3a7f71560ebf558eeec50ae99
Commit: feat(analytics): conectar Google Analytics 4 con id G-H1RZ545XS3
```

---

## PASO 1 – VALIDACIÓN PREVIA (sin tocar main)

### 1a. Creación de rama de prueba y merge
```
git checkout -b tmp/premerge-check origin/main
branch 'tmp/premerge-check' set up to track 'origin/main'.
Switched to a new branch 'tmp/premerge-check'

git merge --no-ff origin/seo/fase-2-estructura -m "test: premerge check"
(Merge limpio sin conflictos, 95 archivos modificados)
```

### 1b. Diagnóstico de clon superficial y comparación dateModified inicial
En el primer build de `shallow-test` (`--depth 1` sobre commit `0448ccb`):
- `dist/index.html`: dateModified NO ENCONTRADO EN JSON-LD (Schema tipo WebSite)
- `dist/ciencia-y-fe/sabana-santa-de-turin/index.html`: `2026-10-28T00:00:00.000Z`
- `dist/santos/carlo-acutis/index.html`: `2026-10-21T00:00:00.000Z`
- `dist/rosario/index.html`: dateModified NO ENCONTRADO EN JSON-LD (Schema tipo SoftwareApplication)

Comparación global de todas las páginas entre full build y shallow build:
- `\biblia\el-misterio-del-sufrimiento-en-la-biblia\index.html`: Full = 2026-11-02T05:42:53-03:00 | Shallow = 2026-11-02T05:45:00-03:00
- `\en\divine-mercy-chaplet\index.html`: Full = 2026-11-02T05:43:21-03:00 | Shallow = 2026-11-02T05:45:00-03:00
- `\en\shroud-of-turin\index.html`: Full = 2026-11-02T01:43:11-03:00 | Shallow = 2026-11-02T05:45:00-03:00
- `\rosario\misterios-dolorosos\index.html`: Full = 2026-11-02T05:42:53-03:00 | Shallow = 2026-11-02T05:45:00-03:00
Total diferencias encontradas: 4 páginas sin fecha editorial explícita tomaron la fecha del commit superficial.

### 1c. Corrección en `src/utils/getGitDate.ts`
Se modificó `src/utils/getGitDate.ts` para detectar si el repositorio es shallow (`git rev-parse --is-shallow-repository === 'true'`). En caso afirmativo, se omite `git log` y se utiliza únicamente `lastReviewed` / `fecha_revision` si existe, o se devuelve `undefined` omitiendo el campo `dateModified` en JSON-LD. Se adaptaron `ArticleLayout.astro`, `FactLayout.astro` y `BaseHead.astro` para manejar de forma segura `dateModified` indefinido.

- Commit en `seo/fase-2-estructura`:
```
git commit -m "fix(seo): omitir git log para dateModified en repositorios clonados superficialmente (shallow clones)"
[seo/fase-2-estructura 6c951dc] fix(seo): omitir git log para dateModified en repositorios clonados superficialmente (shallow clones)
 4 files changed, 46 insertions(+), 13 deletions(-)
```

- Push a origin:
```
git push origin seo/fase-2-estructura
To https://github.com/andrescarrizo1/sitio-catolico.git
   0448ccb..6c951dc  seo/fase-2-estructura -> seo/fase-2-estructura
```

### Repetición 1a (con commit de corrección 6c951dc)
- Build con Node v22.23.2:
```
astro check: 0 errors
astro build: 49 page(s) built in 3.30s
Pagefind: 49 pages indexed (es, en)
Exit code: 0
```
- Verificación SEO (`npm run verify:seo`):
```
✅ TODAS LAS VERIFICACIONES SEO PASARON CON ÉXITO:
  ✓ Hreflang 100% recíproco en todas las páginas bilingües.
  ✓ Todos los alternates y canonicals apuntan a URLs válidas existentes en dist/.
  ✓ Ninguna URL con meta noindex está presente en el sitemap.
  ✓ Todos los og:image y recursos de imagen de Schema existen físicamente en dist/.
Exit code: 0
```

### Repetición 1b (en shallow clone)
- `git fetch origin seo/fase-2-estructura --depth 1 && git reset --hard origin/seo/fase-2-estructura`
- `git rev-parse --is-shallow-repository`: `true`
- Build exitoso (Exit code: 0)
- Valores dateModified en clon superficial:
  - `dist/index.html`: NO PRESENTE (WebSite)
  - `dist/ciencia-y-fe/sabana-santa-de-turin/index.html`: `2026-10-28T00:00:00.000Z`
  - `dist/santos/carlo-acutis/index.html`: `2026-10-21T00:00:00.000Z`
  - `dist/rosario/index.html`: NO PRESENTE (SoftwareApplication)
  - Distribución total en shallow: 12 páginas con 2026-10-21, 2 con 2026-10-28, 1 con 2026-10-31; el resto omite `dateModified` limpiamente sin generar marcas de tiempo idénticas de git.

### 1d. Dictamen
**GATE 1: VERDE**

---

## PASO 2 – MERGE A MAIN

### 1. `git pull --ff-only origin main`
```
From https://github.com/andrescarrizo1/sitio-catolico
 * branch            main       -> FETCH_HEAD
Already up to date.
```

### 2. `git merge --no-ff origin/seo/fase-2-estructura`
```
git merge --no-ff origin/seo/fase-2-estructura -m "merge: fases 1, 1b y 2 (SEO tecnico y estructura) en main"
95 files changed, 7029 insertions(+), 268 deletions(-)
```

### 3. Datos del Commit de Merge
- **SHA:** `ebd6a9ad308efcf67571a7432a7bd7d1c2b23533`
- **Hora:** `2026-11-03T04:22:15-03:00`
- **Autor:** Andres Carrizo
- **Mensaje:** `merge: fases 1, 1b y 2 (SEO tecnico y estructura) en main`

### 4. `git push origin main`
```
To https://github.com/andrescarrizo1/sitio-catolico.git
   5db7a14..ebd6a9a  main -> main
```

---

## PASO 3 – ESPERA DEL DEPLOY

- **URL consultada:** `https://razonyasombro.com/?nc=1793690627`
- **Hora de verificación:** `2026-11-03T04:23:47-03:00`
- **Etiqueta detectada:** `<meta property="og:locale" content="es_LA">`
- **Resultado:** Despliegue en producción completado exitosamente y visible en Cloudflare Workers (tiempo de propagación: ~1 minuto).

---

## PASO 4 – VERIFICACIÓN EN PRODUCCIÓN

### 4a. Auditoría exhaustiva de sitemaps
- **Sitemap Index:** `https://razonyasombro.com/sitemap-index.xml` (HTTP 200)
- **Sitemaps hijos:** `https://razonyasombro.com/sitemap-0.xml` (HTTP 200)
- **Total URLs en sitemap:** 46
- **Resultados:**
  - Código HTTP 200: 46/46 (100%)
  - Código 404/5xx: 0
  - Canonical idéntico a la propia URL: 46/46 (100%)
  - Páginas con meta robots noindex en sitemap: 0
  - Longitud de `<title>`: 46/46 entre 26 y 53 caracteres (0 páginas superan 60 caracteres)
- **Tabla de fallos duros:** 0 fallos.

### 4b. Checks puntuales en producción
1. **og:locale:**
   - Home (`https://razonyasombro.com/`): `es_LA` (Esperado: `es_LA`) ✓
   - EN (`https://razonyasombro.com/en/`): `en_US` (Esperado: `en_US`) ✓
2. **H1 de la home:**
   - Literal: `"Rosario interactivo, milagros eucarísticos y fe con fuentes documentadas"` (Esperado exacto) ✓
3. **Ocurrencias de "Leer estudio" en la home:** 9 (Procedentes del componente `src/components/ui/PillarCard.astro` en la sección "Los Pilares de Razón y Asombro")
4. **Enlaces href a PayPal:** 0 en la home (ausente) ✓
5. **Enlace a `/licencia/` en el footer:** Presente (`href="/licencia/"`) y responde HTTP 200 ✓
6. **Referencias a Google Fonts:** 0 en el HTML de la home y 0 en `/rosario/` (fuentes auto-hospedadas WOFF2 en `/fonts/`) ✓
7. **Redirección `/en/rosary?x=1`:**
   - Status: HTTP 301
   - Location: `/en/interactive-rosary/?x=1` (conserva query param) ✓
8. **Redirección `/santos/estudios-medicos-y-santo-oficio`:**
   - Status: HTTP 301
   - Location: `/padre-pio/estudios-medicos-y-santo-oficio/` ✓
9. **Cabeceras `/embed/rosario/` vs `/`:**
   - `/embed/rosario/`: HTTP 200, `noindex, nofollow`, sin `X-Frame-Options` (permite enmarcado en iframes de diócesis y colegios) ✓
   - `/`: HTTP 200, indexable, servido por Cloudflare Static Assets.
10. **`/parroquias/`:** HTTP 200, `<meta name="robots" content="noindex, follow">` ✓
11. **`/jesus/`:** HTTP 200, indexable y presente en sitemap (restaurado en Fase 2 tras alcanzar 3 artículos hijos y >300 palabras de exégesis).
12. **og:image de la home:** `https://razonyasombro.com/og-default.jpg` -> HTTP 200 ✓
13. **og:image Shroud y Guadalupe:**
   - Shroud: `https://razonyasombro.com/_astro/sabana-santa-completa.B28Uu7fz.jpg` -> HTTP 200 ✓
   - Guadalupe: `https://razonyasombro.com/_astro/virgen-de-guadalupe-tilma.Dquan-0r.jpg` -> HTTP 200 ✓

### 4c. dateModified del JSON-LD en 4 páginas en producción
- Home (`https://razonyasombro.com/`): NO_PRESENTE (Schema tipo WebSite/Organization sin dateModified)
- Sábana Santa (`/ciencia-y-fe/sabana-santa-de-turin/`): `2026-10-28T00:00:00.000Z`
- San Carlo Acutis (`/santos/carlo-acutis/`): `2026-10-21T00:00:00.000Z`
- Rosario (`/rosario/`): NO_PRESENTE (Schema tipo WebPage/SoftwareApplication)
- **¿Son distintos entre sí los artículos?:** SÍ (`true`). Cada artículo refleja su fecha de revisión editorial genuina sin compartir marcas de tiempo idénticas de build ni de git clone superficial.

### 4d. Reporte de Google Analytics 4 y Privacidad
1. **HTML de producción:**
   - Carga de `googletagmanager.com`: `true`
   - Presencia de ID `G-H1RZ545XS3`: `true`
2. **Inyección en el repositorio:**
   - `src/components/global/BaseHead.astro:228`: Invocación del componente `<GoogleAnalytics />`.
   - `src/components/global/GoogleAnalytics.astro:6`: Definición de ID `G-H1RZ545XS3`.
   - `src/components/global/GoogleAnalytics.astro:44`: Inyección dinámica del script `https://www.googletagmanager.com/gtag/js?id=${gaId}` con escucha diferida de interacción.
3. **Frases visibles en el sitio sobre privacidad / cookies:**
   - `src/components/global/Footer.astro:112`: `"Sin rastreadores ni cookies de terceros"` (ES) / `"No third-party trackers or cookies"` (EN).
   - `src/pages/acerca.astro:31`: `"sin rastreadores invasivos de privacidad"`.
   - `src/pages/apoyar.astro:36`: `"sin publicidad invasiva ni tácticas comerciales"`.
   - `docs/LANZAMIENTO.md:79`: Nota sobre Cloudflare Web Analytics sin cookies.

### 4e. Dictamen GATE 2
- Home responde 200: SÍ.
- URLs del sitemap con 404/5xx: 0.
- `/rosario/` responde 200: SÍ.
- Fallos duros: 0.
- Fallos blandos documentados: 9 ocurrencias de "Leer estudio" en `PillarCard.astro` de la home; `/jesus/` indexable en sitemap tras sumar 3 hijas; script de GA4 activo mientras el footer declara "sin cookies de terceros".

**GATE 2: VERDE**
