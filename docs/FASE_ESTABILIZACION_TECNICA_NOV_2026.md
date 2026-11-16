# Reporte de Estabilización Técnica y Preparación de Producción — Noviembre 2026

**Proyecto:** Razón y Asombro (https://razonyasombro.com/)  
**Fecha de Ejecución:** 16 de noviembre de 2026  
**Roles:** CTO · Senior Cloudflare Workers Engineer · Especialista en SEO Técnico  
**Rama de Trabajo:** `fix/fase-4-coherencia`  
**Base de Comparación:** `main` (commit `ebd6a9ad308efcf67571a7432a7bd7d1c2b23533`)  
**Commit Inicial de Rama:** `0cc8f5e77b679bb7dbe74731d359d936a98584f8`  
**Estado:** Cambios preparados, probados y validados localmente sin merge, sin push y sin despliegue.

---

## 1. Estado de los Ocho Commits Originales de la Fase 4

Se auditó de forma exhaustiva la historia de git respecto a `main`. Se confirmaron intactos y libres de modificaciones accidentales los 8 commits que integran la Fase 4:

1. `0635d4e` — `docs(deploy): agregar DEPLOY_REPORT.md con evidencia de despliegue y gates 1 y 2 en verde`
2. `461baa9` — `fix(shroud): actualizar cita Freer-Waters & Jull con titulo exacto, art 263 y fecha abril 2026 en ES y EN`
3. `b238093` — `fix(copy): desacoplar pie de tejido cardiaco de paginas de ciencia y fe conservandolo solo en milagros eucaristicos`
4. `3136af8` — `fix(review): condicionar 'Revisado por' a revisores concretos y vaciar placeholder editorial de frontmatter`
5. `ac566b1` — `docs(claims): crear COPY_ALIGNMENT.md con tabla de auditoria y propuestas de prudencia en portada y hubs`
6. `b6c29fd` — `fix(home): eliminar texto de 'de la Fase 1', prefijo 'PWA ·' y 'audio chime armónico'`
7. `314c1d2` — `docs(seo): crear TITLES_PROPOSED.md con propuestas de titulos <= 60 caracteres`
8. `0cc8f5e` — `docs(fase4): crear FASE4_REPORTE.md con auditoria de claims, fuentes y diff`

Ningún trabajo previo fue sobrescrito ni descartado. El árbol de trabajo conserva plenamente la integridad de estas correcciones.

---

## 2. Problemas Corregidos y Explicación de las Soluciones

### 2.1. FASE B — HTTPS Obligatorio (Redirección Canónica 301)
* **Diagnóstico previo:** `http://razonyasombro.com` respondía `HTTP/1.1 200 OK` directo porque en `wrangler.jsonc` la configuración tenía `assets.run_worker_first: false`, haciendo que el router estático de Cloudflare sirviera `dist/index.html` sin invocar jamás el Worker.
* **Solución aplicada:**
  1. En `wrangler.jsonc`, se cambió `"run_worker_first": true`, garantizando que toda petición (incluyendo assets y páginas raíz) sea procesada por el handler `fetch` de `src/worker.ts`.
  2. En `src/worker.ts`, se implementó la detección de peticiones inseguras mediante `url.protocol === 'http:'`, `x-forwarded-proto === 'http'` y la cabecera interna de Cloudflare `cf-visitor: {"scheme":"http"}`.
  3. Si la solicitud no proviene de `localhost` o `127.0.0.1` y llega por HTTP, se emite una **redirección permanente HTTP 301** hacia `https://razonyasombro.com`, preservando estrictamente la ruta y los parámetros de consulta (`url.search`), y normalizando la barra final en el mismo salto para evitar cadenas de redirección.

### 2.2. FASE C — Subdominio WWW hacia Apex Canónico (Redirección 301)
* **Diagnóstico previo:** `www.razonyasombro.com` fallaba por completo a nivel DNS (`curl: (6) Could not resolve host`).
* **Solución aplicada en el Worker:**
  1. En `src/worker.ts`, se incorporó la detección de subdominio `url.hostname.toLowerCase().startsWith('www.')`.
  2. Se redirige con código **HTTP 301** al dominio canónico raíz sin www (`https://${canonicalHostname}`), manteniendo la ruta intacta, los query parameters y asegurando la barra final en caso de corresponder.
* **Acción requerida en Cloudflare Dashboard:** Dado que el Worker solo se ejecuta una vez que la consulta DNS alcanza la red de Cloudflare, se documentan las instrucciones para dar de alta el registro DNS CNAME correspondiente.

### 2.3. FASE D — Normalización de Trailing Slash con HTTP 301 (Eliminación de 307)
* **Diagnóstico previo:** Una petición a `/rosario` devolvía un código `307 Temporary Redirect` hacia `/rosario/`. Este comportamiento era originado por el enrutador de Cloudflare Static Assets al detectar que la carpeta física contenía un `index.html`.
* **Solución aplicada:**
  1. Al ejecutarse el Worker en primer lugar (`run_worker_first: true`), el middleware intercepta cualquier ruta que no termine en `/`, que no pertenezca a `/api/*`, que no posea extensión de archivo estático (p. ej. `.css`, `.js`, `.jpg`, `.svg`, `.xml`, `.woff2`) y que no sea `/404`.
  2. Emite de forma inmediata un **`Response.redirect(url.pathname + '/' + url.search, 301)`**.
  3. Cuando el navegador solicita la URL con barra final (`/rosario/`), el Worker la entrega directamente a `env.ASSETS.fetch(request)`, el cual responde `HTTP 200 OK` de inmediato.
  4. De este modo se erradican los códigos 307 temporales y se consolida la autoridad canónica para los motores de búsqueda.

### 2.4. FASE E — Respuesta 404 Estricta para `/404` y Rutas Inexistentes
* **Diagnóstico previo:** Si bien las rutas inexistentes aleatorias devolvían 404, la consulta directa a `/404` y `/404.html` entregaba `HTTP/1.1 200 OK` porque existía el archivo estático `dist/404.html`.
* **Solución aplicada:**
  1. En `src/worker.ts`, se intercepta explícitamente `url.pathname === '/404' || url.pathname === '/404/' || url.pathname === '/404.html'`.
  2. Se lee el contenido de `/404.html` mediante `env.ASSETS.fetch` y se retorna con código de estado **`status: 404`**, `statusText: 'Not Found'`, cabecera `X-Robots-Tag: noindex, follow` y cabeceras de seguridad CSP.
  3. Se mantiene el fallback para rutas inexistentes arbitrarias (`response.status === 404`), devolviendo siempre HTTP 404 real.

### 2.5. FASE F — Optimización de Títulos SEO Cardinales (≤ 60 Caracteres)
Se aplicaron las modificaciones de títulos indispensables para recuperar visibilidad en Google Search Console sin alterar páginas con buen rendimiento consolidado:
1. **Sermón de la Montaña y Bienaventuranzas (Posición GSC 35,56):**
   - Archivo fuente: `src/content/jesus/sermon-de-la-montana-bienaventuranzas.mdx`
   - Título nuevo: `"Sermón de la Montaña: Bienaventuranzas"`
   - Título final generado en HTML: `<title>Sermón de la Montaña: Bienaventuranzas | Razón y Asombro</title>` (56 caracteres).
   - *Impacto:* Incorpora la palabra clave cardinal "Bienaventuranzas" que había sido eliminada por truncamiento algorítmico previo.
2. **Milagro Eucarístico de Buenos Aires (Posición GSC 5,12):**
   - Archivo fuente: `src/content/milagros/buenos-aires.mdx`
   - Título nuevo: `"Milagro Eucarístico de Buenos Aires"`
   - Título final generado en HTML: `<title>Milagro Eucarístico de Buenos Aires | Razón y Asombro</title>` (53 caracteres).
   - *Impacto:* Refuerza la concordancia exacta de búsqueda y la intención transaccional catequética.
3. **Padre Pío (Posición GSC 5,60):**
   - Archivo fuente: `src/content/santos/estudios-medicos-y-santo-oficio.mdx`
   - Título nuevo: `"Estigmas del Padre Pío: Peritajes"`
   - Título final generado en HTML: `<title>Estigmas del Padre Pío: Peritajes | Razón y Asombro</title>` (51 caracteres).
   - *Impacto:* Alinea la promesa de búsqueda con los peritajes clínicos documentados.
4. **Soporte en `BaseHead.astro`:**
   - Se actualizaron las claves del diccionario `knownShortTitles` en `src/components/global/BaseHead.astro` para mapear limpiamente tanto los nuevos títulos como las cadenas históricas, garantizando que ninguna de ellas sea objeto de recorte accidental.

---

## 3. Archivos Modificados

| Archivo Modificado | Tipo de Cambio | Justificación Técnica |
| :--- | :--- | :--- |
| `wrangler.jsonc` | Configuración Cloudflare | Se activó `"run_worker_first": true` para delegar el control de enrutamiento y redirecciones al Worker antes de servir activos estáticos. |
| `src/worker.ts` | Código Backend (Worker) | Implementación de redirección 301 para HTTP -> HTTPS, WWW -> no-WWW, normalización de trailing slash con 301 y respuesta 404 estricta para `/404`. |
| `src/content/jesus/sermon-de-la-montana-bienaventuranzas.mdx` | Frontmatter editorial | Ajuste de `titulo` a `"Sermón de la Montaña: Bienaventuranzas"` (recupera keyword crítica). |
| `src/content/milagros/buenos-aires.mdx` | Frontmatter editorial | Ajuste de `titulo` a `"Milagro Eucarístico de Buenos Aires"` (concordancia exacta). |
| `src/content/santos/estudios-medicos-y-santo-oficio.mdx` | Frontmatter editorial | Ajuste de `titulo` a `"Estigmas del Padre Pío: Peritajes"` (conforme a `TITLES_PROPOSED.md`). |
| `src/components/global/BaseHead.astro` | Componente global | Actualización de `knownShortTitles` para soportar las nuevas cadenas de título sin truncamiento. |

*Total de archivos modificados en la aplicación:* **6 archivos**.

---

## 4. Pruebas Realizadas y Resultados Reales

### 4.1. Verificación de Licencias y Enlaces (`npm run check`)
```text
> sitio-catolico-cristiano@1.0.0 check
> node scripts/check-licenses.mjs && node scripts/check-links.mjs

🔍 [CHECK-LICENSES] Verificando registro de licencias de activos...
✅ [CHECK-LICENSES] Éxito: 25 imagen(es) verificada(s) correctamente en LICENCIAS.md.
🔍 [CHECK-LINKS] Verificando enlaces internos en dist/...
✅ [CHECK-LINKS] Éxito: 0 enlaces rotos detectados en 49 página(s) HTML.
Exit code: 0
```

### 4.2. Compilación e Indexación Estática (`npm run build`)
```text
> astro check && astro build && pagefind --site dist

02:46:35 [check] Getting diagnostics for Astro files...
Result (84 files): 0 errors, 0 warnings, 14 hints (deprecaciones menores de zod string url).
02:50:47 [build] 49 page(s) built in 4.87s
Running Pagefind v1.5.2 (Extended)
Indexed 2 languages (es, en)
Indexed 49 pages
Indexed 6484 words
Exit code: 0
```

### 4.3. Verificación Integral de Integridad SEO (`node scripts/ci-verify-seo.mjs`)
```text
🔍 Iniciando verificación integral de integridad SEO en dist/...

--- 1. Verificando Sitemap y exclusión de páginas noindex ---
  Sitemap "sitemap-0.xml" contiene 46 URLs.

--- 2. Verificando Canonicals, Alternates y Hreflang recíproco ---
  Analizando 49 archivos HTML...

--- 3. Verificando existencia de og:image y Schema images en dist/ ---

==========================================
✅ TODAS LAS VERIFICACIONES SEO PASARON CON ÉXITO:
  ✓ Hreflang 100% recíproco en todas las páginas bilingües.
  ✓ Todos los alternates y canonicals apuntan a URLs válidas existentes en dist/.
  ✓ Ninguna URL con meta noindex está presente en el sitemap.
  ✓ Todos los og:image y recursos de imagen de Schema existen físicamente en dist/.
==========================================
Exit code: 0
```

### 4.4. Longitud de Títulos en Todo el Directorio `dist/`
Se analizó el 100% de los 49 archivos HTML generados en `dist/`:
- **Archivos con `<title>` mayor a 60 caracteres:** **0**.
- **Títulos específicos verificados:**
  - `dist/jesus/sermon-de-la-montana-bienaventuranzas/index.html`: `Sermón de la Montaña: Bienaventuranzas | Razón y Asombro` (56 car.) ✓
  - `dist/milagros-eucaristicos/buenos-aires/index.html`: `Milagro Eucarístico de Buenos Aires | Razón y Asombro` (53 car.) ✓
  - `dist/padre-pio/estudios-medicos-y-santo-oficio/index.html`: `Estigmas del Padre Pío: Peritajes | Razón y Asombro` (51 car.) ✓

### 4.5. Pruebas Unitarias de Enrutamiento del Worker
Se ejecutó una suite de 13 pruebas de simulación de solicitudes contra el algoritmo de enrutamiento implementado en `src/worker.ts`:
1. `http://razonyasombro.com/` ➔ **301** a `https://razonyasombro.com/` ✓
2. `http://www.razonyasombro.com/` ➔ **301** a `https://razonyasombro.com/` ✓
3. `http://razonyasombro.com/rosario` ➔ **301** a `https://razonyasombro.com/rosario/` (resuelve HTTPS + trailing slash en 1 solo salto) ✓
4. `https://www.razonyasombro.com/rosario?foo=bar` ➔ **301** a `https://razonyasombro.com/rosario/?foo=bar` (conserva query params) ✓
5. `https://razonyasombro.com/rosario` ➔ **301** a `https://razonyasombro.com/rosario/` (sustituye el 307 previo) ✓
6. `https://razonyasombro.com/rosario/` ➔ Se entrega a `env.ASSETS.fetch` (HTTP 200) ✓
7. `https://razonyasombro.com/404` ➔ Devuelve **HTTP 404** real con página personalizada ✓
8. `https://razonyasombro.com/404.html` ➔ Devuelve **HTTP 404** real ✓
9. `https://razonyasombro.com/_astro/style.css` ➔ No redirige, se entrega a `env.ASSETS` ✓
10. `https://razonyasombro.com/api/consuelo` ➔ No redirige, se entrega al endpoint de API ✓
11. `https://razonyasombro.com/santos/estudios-medicos-y-santo-oficio` ➔ **301** a `/padre-pio/estudios-medicos-y-santo-oficio/` ✓
12. `http://localhost:4321/rosario` ➔ No fuerza HTTPS en local, **301** a `http://localhost:4321/rosario/` ✓
13. `https://razonyasombro.com/` con cabecera `cf-visitor: {"scheme":"http"}` ➔ **301** a `https://razonyasombro.com/` ✓

**Resultado:** 13 de 13 pruebas aprobadas.

---

## 5. Configuraciones Pendientes en Cloudflare Dashboard

Para que la infraestructura en el Edge sea completamente inexpugnable, el administrador del proyecto debe realizar las siguientes 3 acciones manuales en el panel de Cloudflare (zona `razonyasombro.com`):

### 1. Activar "Always Use HTTPS" (Capa 0 de Redirección)
- **Ruta:** Cloudflare Dashboard ➔ Zona `razonyasombro.com` ➔ **SSL/TLS** ➔ **Edge Certificates**.
- **Acción:** Activar el interruptor **"Always Use HTTPS"**.
- **Beneficio:** Redirige peticiones HTTP a HTTPS a nivel de red antes de consumir tiempo de CPU del Worker.

### 2. Crear Registro DNS CNAME para `www`
- **Ruta:** Cloudflare Dashboard ➔ Zona `razonyasombro.com` ➔ **DNS** ➔ **Records**.
- **Acción:**
  - **Type:** `CNAME`
  - **Name:** `www`
  - **Target:** `razonyasombro.com`
  - **Proxy status:** Proxied (Nube naranja activada 🟠).
- **TTL:** Auto.

### 3. Crear Regla de Redirección de `www` a Raíz (Opcional como Defensa en Profundidad)
- **Ruta:** Cloudflare Dashboard ➔ Zona `razonyasombro.com` ➔ **Rules** ➔ **Redirect Rules**.
- **Acción:**
  - **Rule name:** `Redirect WWW to Root`
  - **Field:** `Hostname` | **Operator:** `equals` | **Value:** `www.razonyasombro.com`
  - **Type:** Dynamic
  - **Expression:** `concat("https://razonyasombro.com", http.request.uri.path)`
  - **Status code:** `301 Moved Permanently`.

---

## 6. Riesgos o Problemas Abiertos

1. **Tiempo de Propagación DNS para `www`:** Hasta que el registro CNAME no sea añadido manualmente en Cloudflare, cualquier petición a `www.razonyasombro.com` seguirá devolviendo NXDOMAIN a nivel de resolución de nombres.
2. **Re-inspección de URLs en Google Search Console:** Una vez desplegado el Worker en producción, las 41 URLs excluidas en GSC bajo "Página alternativa con etiqueta canónica adecuada" comenzarán a recibir el 301 permanente. El rastreo de Googlebot no es instantáneo y tomará entre 7 y 21 días para reflejar la reducción de páginas no indexadas.
3. **Google Consent Mode v2 y Banner de Privacidad:** Permanece pendiente la adecuación del footer o la implementación formal de Consent Mode v2 para Google Analytics 4, catalogada como prioridad P2.

---

## 7. Procedimiento Recomendado para Integrar a `main`

Una vez recibida la autorización formal, el protocolo de integración limpio comprende:

1. **Commit de Estabilización en `fix/fase-4-coherencia`:**
   ```bash
   git add wrangler.jsonc src/worker.ts src/components/global/BaseHead.astro \
           src/content/jesus/sermon-de-la-montana-bienaventuranzas.mdx \
           src/content/milagros/buenos-aires.mdx \
           src/content/santos/estudios-medicos-y-santo-oficio.mdx \
           docs/AUDITORIA_REANUDACION_NOV_2026.md \
           docs/FASE_ESTABILIZACION_TECNICA_NOV_2026.md
   git commit -m "fix(infra): configurar run_worker_first, HTTPS obligatorio 301, trailing slash 301, 404 estricto y titulos SEO"
   ```
2. **Merge limpio hacia `main` (sin rebase, conservando árbol de trazabilidad):**
   ```bash
   git checkout main
   git pull --ff-only origin main
   git merge --no-ff fix/fase-4-coherencia -m "merge: fase 4 de coherencia editorial y estabilizacion tecnica de infraestructura"
   ```
3. **Verificación local de Gate previo al push:**
   ```bash
   npm run check
   npm run build
   node scripts/ci-verify-seo.mjs
   ```
4. **Push a `origin/main` y monitorización de Cloudflare Workers Builds:**
   ```bash
   git push origin main
   ```
5. **Verificación en producción con `curl`:**
   - Comprobar que `http://razonyasombro.com` emite 301.
   - Comprobar que `/rosario` emite 301 hacia `/rosario/`.
   - Comprobar que `/404` emite 404.
   - Validar que los nuevos títulos se reflejen en el HTML en vivo.

---
*Fin del reporte de estabilización técnica.*
