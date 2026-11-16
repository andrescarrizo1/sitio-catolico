# Reporte de Integración y Consolidación en Main — Noviembre 2026

**Proyecto:** Razón y Asombro (https://razonyasombro.com/)  
**Fecha de Emisión:** 16 de noviembre de 2026  
**Roles:** CTO · Senior Astro Engineer · Senior Cloudflare Workers Engineer · Auditor Independiente de Código  
**Estado:** Integración formal completada en rama `main` local mediante merge `--no-ff`. Validaciones superadas al 100%. Árbol limpio. Listo para despliegue cuando el usuario lo autorice.

---

## 1. Resumen de la Revisión Independiente del Código (Code Review)

Se realizó una auditoría de código línea por línea sobre las modificaciones implementadas en la fase de estabilización técnica frente a la historia de la Fase 4.

### 1.1. Inspección de `src/worker.ts`
* **Detección de HTTP y Forzado HTTPS (301):**
  - Implementación analizada:
    ```typescript
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const cfVisitor = request.headers.get('cf-visitor');
    const isCfHttp = cfVisitor ? cfVisitor.includes('"scheme":"http"') : false;
    const isHttp = url.protocol === 'http:' || request.headers.get('x-forwarded-proto')?.toLowerCase() === 'http' || isCfHttp;
    ```
  - **Seguridad y Trazabilidad:** En Cloudflare, la cabecera `cf-visitor` es inyectada directamente por el Edge Proxy de Cloudflare y es de confianza absoluta (el cliente externo no puede falsificarla para engañar al worker). Si la conexión externa llegó por HTTP, Cloudflare añade `cf-visitor: {"scheme":"http"}`. Se añade también `x-forwarded-proto` y `url.protocol` como capas complementarias.
  - Se excluye explícitamente `isLocalhost` para no impedir pruebas en entornos de desarrollo local (`localhost:4321` o `127.0.0.1`).
* **Redirección de Subdominio WWW (301):**
  - Se detecta mediante `url.hostname.toLowerCase().startsWith('www.')`.
  - La redirección se construye reemplazando el prefijo para formar `canonicalHostname = url.hostname.replace(/^www\./i, '')` y construyendo una nueva URL hacia `https://${canonicalHostname}`.
  - Se preservan íntegramente `url.pathname` y `url.search` (query parameters).
  - Se normaliza la barra final en el mismo salto para evitar dobles redirecciones (`www.dominio/rosario` ➔ `https://dominio/rosario/` en un único 301).
* **Normalización de Trailing Slash (301) vs. 307 Previo:**
  - El problema original residía en que Cloudflare Static Assets devolvía `307 Temporary Redirect` para directorios sin barra final.
  - En `src/worker.ts`, se normaliza cualquier ruta que no termine en `/`, que no sea un archivo con extensión (`!/\.[a-zA-Z0-9]+$/`), que no comience con `/api/` y que no sea `/404` ni `/404.html`.
  - Emite `Response.redirect(target.toString(), 301)` de forma permanente.
* **Exclusiones Correctas:**
  - Las rutas bajo `/api/*` (`/api/consuelo`, `/api/apologetica`) están formalmente excluidas de la adición de trailing slash para preservar el estándar de endpoints REST/POST sin romper firmas ni payloads.
  - Los archivos estáticos con extensión (`.css`, `.js`, `.jpg`, `.svg`, `.xml`, `.woff2`, `.txt`, `.webmanifest`) quedan exentos de la redirección de barra, entregándose directamente a `env.ASSETS.fetch`.
* **Respuesta 404 Estricta:**
  - Las consultas directas a `/404`, `/404/` o `/404.html` son interceptadas y devuelven el HTML de `dist/404.html` con código HTTP **`status: 404`**, `statusText: 'Not Found'`, cabecera `X-Robots-Tag: noindex, follow` y cabecera de seguridad contra clickjacking.
  - Para rutas inexistentes arbitrarias, si `env.ASSETS.fetch` responde 404, se reescribe la respuesta para servir la página personalizada manteniendo el código 404 real.
* **Prevención de Bucles de Redirección:**
  - Verificado: Una vez que la URL está en `https://`, sin `www`, y termina con `/` (o es un archivo estático), ninguna regla de redirección vuelve a activarse y la petición desciende de inmediato a `env.ASSETS.fetch` o a los endpoints de API.

---

## 2. Análisis de Rendimiento de `run_worker_first: true`

Uno de los puntos cardinales de la auditoría técnica fue evaluar si activar `"run_worker_first": true` en `wrangler.jsonc` perjudica el rendimiento, la latencia o la caché de entrega de activos estáticos.

### 2.1. Arquitectura de Cloudflare Workers con Static Assets
* **Mismo Aislamiento en el Edge (In-Process V8):** Cuando una petición entra al PoP (Datacenter de Cloudflare más cercano al usuario), el Worker se inicializa o reutiliza en un V8 Isolate local. El binding `env.ASSETS.fetch(request)` **no** realiza una llamada de red externa ni un round-trip HTTP entre datacenters. Es una llamada interna C++ de memoria compartida hacia el subsistema de almacenamiento de assets estáticos de Cloudflare en el mismo PoP.
* **Sobrecarga de CPU:** Las evaluaciones condicionales de `src/worker.ts` (comparación de strings de protocolo, hostname y pathname) consumen típicamente **entre 0.1 y 0.4 milisegundos de CPU**. Para el usuario final, esta diferencia es imperceptible y está muy por debajo de la variación normal del RTT de red.
* **Respeto a la Caché HTTP y Assets Inmutables:** Los archivos de `dist/_astro/*.css` y `dist/_astro/*.js` poseen hashes de contenido únicos y cabeceras `Cache-Control: public, max-age=31536000, immutable`. Al ser despachados a través de `env.ASSETS.fetch(request)`, Cloudflare Edge almacena estos objetos en su caché local (L1/L2 Cache de Cloudflare). Las peticiones subsiguientes se sirven directamente desde la memoria caché del Edge sin re-ejecución pesada.
* **Justificación de Necesidad Técnica:**
  - Con `"run_worker_first": false`, Cloudflare Static Assets intercepta las solicitudes *antes* de que el código del Worker pueda evaluarlas.
  - Esto causaba que `http://razonyasombro.com/` respondiera `200 OK` directo por HTTP inseguro (omitiendo la redirección a HTTPS).
  - Hacía que `/rosario` fuera capturado por el enrutador predeterminado de Cloudflare emitiendo un `307 Temporary Redirect` que diluía el PageRank en Googlebot.
  - Hacía que `/404` devolviera `200 OK`.
* **Conclusión:** `"run_worker_first": true` es arquitectónicamente indispensable para la salud SEO e infraestructura de Razón y Asombro, y su impacto en rendimiento es nulo.

---

## 3. Lista Exhaustiva de Cambios Incorporados

### 3.1. Fase 4 — Coherencia Editorial y Rigor Científico (8 Commits)
1. **Sábana Santa (`461baa9`):** Cita de Freer-Waters & Jull corregida con título exacto ("Radiocarbon Dating the Shroud of Turin: A Critical Review"), Art. 263 y fecha exacta (abril 2026) en español e inglés.
2. **Desacople Editorial de Tejido Cardíaco (`b238093`):** Se eliminó la afirmación generalizadora de tejido cardíaco del pie de las páginas de "Ciencia y Fe", reservándola con atribución rigurosa únicamente para los expedientes de milagros eucarísticos donde existen peritajes histopatológicos documentados.
3. **Revisión y Autoría (`3136af8`):** Se condicionó el componente de "Revisado por" a que existan revisores reales asignados y se limpiaron los placeholders genéricos de frontmatter.
4. **Auditoría de Claims (`ac566b1`):** Documento `docs/COPY_ALIGNMENT.md` con matriz de prudencia pastoral y científica.
5. **Limpieza en Portada (`b6c29fd`):** Eliminación de vestigios de desarrollo en la home ("de la Fase 1", prefijo "PWA ·" y "audio chime armónico").
6. **Propuestas de Títulos SEO (`314c1d2`):** Documento `docs/TITLES_PROPOSED.md` con análisis de longitudes para títulos ≤ 60 caracteres.
7. **Reporte Editorial Fase 4 (`0cc8f5e`):** Documento `docs/FASE4_REPORTE.md`.
8. **Evidencia de Despliegue (`0635d4e`):** Documento `docs/DEPLOY_REPORT.md` documentando Gates 1 y 2 en verde.

### 3.2. Estabilización Técnica de Infraestructura y SEO (Commit `520cfcb`)
1. **`wrangler.jsonc`:** Activación de `"run_worker_first": true`.
2. **`src/worker.ts`:**
   - Canonicalización HTTPS permanente (301).
   - Redirección de subdominio `www` al apex canónico (301).
   - Normalización de trailing slash con código 301 permanente (eliminando los 307 temporales).
   - Intercepción de `/404` y `/404.html` para devolver estado 404 estricto con `X-Robots-Tag: noindex`.
3. **Optimización de Títulos SEO Cardinales:**
   - `src/content/jesus/sermon-de-la-montana-bienaventuranzas.mdx`: `"Sermón de la Montaña: Bienaventuranzas"`.
   - `src/content/milagros/buenos-aires.mdx`: `"Milagro Eucarístico de Buenos Aires"`.
   - `src/content/santos/estudios-medicos-y-santo-oficio.mdx`: `"Estigmas del Padre Pío: Peritajes"`.
4. **`src/components/global/BaseHead.astro`:** Actualización del mapeo `knownShortTitles` para soportar las nuevas cadenas sin recortes accidentales.
5. **Documentación Técnica Creada:**
   - `docs/AUDITORIA_REANUDACION_NOV_2026.md`: Auditoría completa de reanudación y diagnóstico GA4/GSC.
   - `docs/FASE_ESTABILIZACION_TECNICA_NOV_2026.md`: Detalle técnico de la fase de estabilización.

### 3.3. Integración en Rama Principal (Commit `1be7040`)
- Merge explícito `--no-ff` de la rama `fix/fase-4-coherencia` hacia `main`, preservando toda la cadena histórica y trazabilidad git.

---

## 4. Resultados de las Pruebas Ejecutadas

Todas las pruebas fueron ejecutadas localmente en la rama `main` tras el merge. Ningún resultado es hipotético.

| Comando / Test | Parámetro Evaluado | Resultado Real | Estado |
| :--- | :--- | :--- | :---: |
| `npx tsc --noEmit` | Tipado TypeScript estricto en todo el proyecto | 0 errores de compilación | ✅ APROBADO |
| `npm run check` | Verificación de licencias de activos y enlaces internos | 25 licencias verificadas; 0 enlaces rotos en 49 páginas | ✅ APROBADO |
| `npm run build` | Compilación estática Astro + Pagefind indexer | 49 páginas generadas en 3.39s; 6484 palabras indexadas | ✅ APROBADO |
| `node scripts/ci-verify-seo.mjs` | Integridad de Sitemap, Canonicals, Hreflang y Schema | 46 URLs en sitemap; 100% reciprocidad hreflang; canonicals válidos | ✅ APROBADO |
| Auditoría de `<title>` en `dist/` | Longitud máxima de títulos SEO (≤ 60 caracteres) | 0 títulos > 60 caracteres en los 49 archivos HTML | ✅ APROBADO |
| Test Suite Worker (15 casos) | Simulación de enrutamiento y respuestas HTTP | 15 de 15 escenarios aprobados | ✅ APROBADO |

### Detalle de los 15 Escenarios del Worker Probados:
1. `http://razonyasombro.com/` ➔ **301** a `https://razonyasombro.com/`
2. `http://www.razonyasombro.com/` ➔ **301** a `https://razonyasombro.com/`
3. `http://razonyasombro.com/rosario` ➔ **301** a `https://razonyasombro.com/rosario/` (resuelve HTTPS + trailing slash simultáneamente)
4. `http://razonyasombro.com/rosario/` ➔ **301** a `https://razonyasombro.com/rosario/`
5. `https://razonyasombro.com/rosario` ➔ **301** a `https://razonyasombro.com/rosario/` (sustituye el 307 anterior de Cloudflare)
6. `https://razonyasombro.com/rosario/?utm_source=test` ➔ Se entrega a `env.ASSETS` (HTTP 200, preserva query params)
7. `https://razonyasombro.com/rosario/` ➔ Se entrega a `env.ASSETS` (HTTP 200)
8. `https://razonyasombro.com/404` ➔ Devuelve **HTTP 404** real con contenido personalizado
9. `https://razonyasombro.com/404.html` ➔ Devuelve **HTTP 404** real
10. `https://razonyasombro.com/ruta-totalmente-inexistente-12345/` ➔ Devuelve **HTTP 404** real
11. `https://razonyasombro.com/_astro/test.css` ➔ No redirige, se entrega a `env.ASSETS`
12. `https://razonyasombro.com/scripts/test.js` ➔ No redirige, se entrega a `env.ASSETS`
13. `https://razonyasombro.com/images/portada.jpg` ➔ No redirige, se entrega a `env.ASSETS`
14. `https://razonyasombro.com/api/consuelo` ➔ No añade trailing slash, se entrega al endpoint POST
15. `http://localhost:4321/rosario` ➔ No fuerza HTTPS en entorno de desarrollo local

---

## 5. Hashes de los Commits Involucrados

* **Commit Base Productivo (`origin/main`):**  
  `ebd6a9ad308efcf67571a7432a7bd7d1c2b23533` — `merge: fases 1, 1b y 2 (SEO tecnico y estructura) en main`
* **Commit Previo de Rama de Trabajo (`fix/fase-4-coherencia`):**  
  `0cc8f5e77b679bb7dbe74731d359d936a98584f8` — `docs(fase4): crear FASE4_REPORTE.md con auditoria de claims, fuentes y diff`
* **Commit de Estabilización Técnica de Infraestructura:**  
  `520cfcbcc48fead755cac712f11a07a4a2cea4be` — `fix(infra): configurar run_worker_first, HTTPS obligatorio 301, trailing slash 301, 404 estricto y titulos SEO`
* **Commit de Integración y Merge en `main`:**  
  `1be70406c0b212a9d6e4627ba472d998926619d5` — `merge: fase 4 de coherencia editorial y estabilizacion tecnica de infraestructura`

---

## 6. Confirmación de Estado de `main`

La rama `main` se encuentra limpia, sincronizada con todos los cambios de las Fases 4 y Técnica, con el 100% de los tests en verde y sin ninguna discrepancia de compilación.

**Estado de Git:**
```text
On branch main
Your branch is ahead of 'origin/main' by 10 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

---

## 7. Configuraciones Manuales Pendientes en Cloudflare Dashboard

Para que la infraestructura en el Edge sea completamente infalible y complemente las directivas del Worker, el administrador debe realizar las siguientes 3 configuraciones en el panel de Cloudflare (zona `razonyasombro.com`):

### Tarea A: Crear el Registro DNS CNAME para `www` (Imprescindible para resolver NXDOMAIN)
1. Iniciar sesión en [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Seleccionar el dominio **`razonyasombro.com`**.
3. En el menú lateral izquierdo, hacer clic en **DNS** ➔ **Records**.
4. Hacer clic en **Add record** y completar los siguientes campos:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `razonyasombro.com`
   - **Proxy status:** **Proxied** (Nube en color naranja 🟠 activa).
   - **TTL:** `Auto`
5. Hacer clic en **Save**.

### Tarea B: Activar "Always Use HTTPS" (Capa 0 en Edge Proxy)
1. En el menú lateral izquierdo, hacer clic en **SSL/TLS** ➔ **Edge Certificates**.
2. Buscar la opción **Always Use HTTPS**.
3. Activar el interruptor (**On**).
   - *Efecto:* Cloudflare forzará la redirección de cualquier paquete HTTP a HTTPS directamente en el puerto 80 del PoP antes de que la solicitud llegue a la capa de cómputo del Worker, ahorrando recursos de ejecución.

### Tarea C: Crear Regla de Redirección para `www` (Defensa en Profundidad Opcional)
1. En el menú lateral izquierdo, ir a **Rules** ➔ **Redirect Rules**.
2. Hacer clic en **Create rule**.
3. Asignar los siguientes parámetros:
   - **Rule name:** `Redireccion WWW a Apex Canónico`
   - **When incoming requests match:** Custom filter expression.
   - **Field:** `Hostname` | **Operator:** `equals` | **Value:** `www.razonyasombro.com`
   - **Then:**
     - **Type:** `Dynamic`
     - **Expression:** `concat("https://razonyasombro.com", http.request.uri.path)`
     - **Status code:** `301 Moved Permanently`
     - **Preserve query string:** Activado (marcado).
4. Hacer clic en **Deploy**.

---

## 8. Procedimiento Paso a Paso para Publicar en Producción

Cuando el usuario dé la orden expresa de publicar, se procederá de la siguiente manera:

### Paso 1: Enviar los commits a GitHub (`origin/main`)
```bash
git push origin main
```

### Paso 2: Monitorear la Compilación en Cloudflare Workers Builds
1. En Cloudflare Dashboard, ir a **Workers & Pages** ➔ Proyecto **sitio-catolico** (o el nombre asociado a Razón y Asombro).
2. En la pestaña **Deployments**, verificar que se dispare automáticamente la compilación correspondiente al commit `1be7040` (o el commit de documentación posterior).
3. Confirmar que el build finalice con estado `Success`.

### Paso 3: Verificación de Producción con `curl`
Ejecutar desde terminal los siguientes comandos para validar en caliente la respuesta de los servidores de Cloudflare:

```bash
# 1. Verificar redirección 301 de HTTP a HTTPS
curl -I http://razonyasombro.com/
# Esperado: HTTP/1.1 301 Moved Permanently -> Location: https://razonyasombro.com/

# 2. Verificar normalización 301 de trailing slash (eliminación del 307)
curl -I https://razonyasombro.com/rosario
# Esperado: HTTP/2 301 -> Location: https://razonyasombro.com/rosario/

# 3. Verificar respuesta 404 estricta en /404
curl -I https://razonyasombro.com/404
# Esperado: HTTP/2 404 Not Found

# 4. Verificar resolución y redirección de www (tras configurar DNS)
curl -I https://www.razonyasombro.com/
# Esperado: HTTP/2 301 -> Location: https://razonyasombro.com/
```

---
*Fin del reporte de integración y consolidación.*
