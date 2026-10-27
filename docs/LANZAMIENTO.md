# Procedimiento de Lanzamiento a Producción (Fase Futura)

> **ATENCIÓN:** Este documento describe los pasos que se ejecutarán **únicamente cuando el sitio esté completamente desarrollado y revisado en local**, y una vez que se adquiera el dominio definitivo. **No ejecutar durante la Fase 1 de desarrollo local.**

---

## 1. Verificación Previa de Plataforma Cloudflare (Pages vs. Workers Static Assets)

* **Paso Preliminar Obligatorio:** Antes de aprovisionar el despliegue, **verificar en la documentación oficial de Cloudflare** (`developers.cloudflare.com`) si *Cloudflare Pages* sigue siendo el método estándar recomendado para sitios puramente estáticos en Astro, o si la arquitectura ha convergido formalmente en **Cloudflare Workers con Static Assets** (`assets` en `wrangler.toml`).
* **Criterio de Selección:**
  * Si Cloudflare Pages mantiene soporte pleno: utilizar la integración directa con Git (`build output: dist`).
  * Si la recomendación oficial actual es Workers con Static Assets: emplear `wrangler` con configuración `assets = { directory = "./dist" }`, manteniendo siempre costo $0 USD dentro del plan gratuito de Cloudflare.

---

## 2. Adquisición del Dominio y Configuración DNS

1. **Compra del Dominio:**
   * Registrar el dominio seleccionado (ej. en Cloudflare Registrar, Namecheap o Porkbun) para mantener costos al costo de mayorista sin sobreprecios.
2. **Configuración de Zona DNS en Cloudflare:**
   * Apuntar los Nameservers al panel de Cloudflare.
   * Activar DNSSEC con un solo clic en el panel.
   * Forzar HTTPS / SSL en modo *Full (Strict)*.

---

## 3. Despliegue en Cloudflare (Pages o Workers Static Assets)

1. **Vinculación con el Repositorio Git:**
   * Crear proyecto en Cloudflare conectado al repositorio privado en GitHub / GitLab.
2. **Parámetros del Build:**
   * **Framework preset:** `Astro`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Node.js version:** Especificar en variables de entorno `NODE_VERSION = 22` o superior.
3. **Variables de Entorno en Cloudflare:**
   * `PUBLIC_SITE_URL`: `https://[NOMBRE_DEL_DOMINIO]` (con `https://` y sin barra final).
   * `PUBLIC_ALLOW_INDEXING`: `true` (esto desactiva automáticamente el `noindex, nofollow` y permite la indexación por robots de Google y motores de IA).

---

## 4. Verificación Pre-Lanzamiento (Sanity Check en Producción)

1. **Revisión de Cabeceras e Indexabilidad:**
   * Visitar `https://[DOMINIO]/robots.txt` y verificar que muestre:
     ```text
     User-agent: *
     Allow: /
     Sitemap: https://[DOMINIO]/sitemap-index.xml
     ```
   * Inspeccionar el código fuente del `<head>` en `/` y comprobar que `<meta name="robots" content="noindex,nofollow">` haya desaparecido por completo.
   * Comprobar que los enlaces canónicos apunten exactamente a la URL final con HTTPS.
2. **Auditoría de Rendimiento en Vivo:**
   * Ejecutar PageSpeed Insights en móvil sobre la URL pública.
   * Verificar LCP < 2.0s, CLS = 0, INP < 150ms.

---

## 5. Activación en Google Search Console y Motores de IA

1. **Google Search Console:**
   * Dar de alta la propiedad vía verificación por registro DNS (TXT) en Cloudflare.
   * Enviar el sitemap: `https://[DOMINIO]/sitemap-index.xml`.
   * Realizar la "Inspección de URLs" en las páginas clave:
     * Home `/`
     * Hub de Milagros Eucarísticos `/milagros-eucaristicos/`
     * Fátima `/virgen-de-fatima/`
     * Padre Pío `/padre-pio/`
     * Rosario `/rosario/`
   * Solicitar indexación manual de las páginas principales.
2. **Bing Webmaster Tools (indexación para ChatGPT / Copilot):**
   * Importar la propiedad directamente desde Google Search Console.
   * Enviar sitemap para habilitar la citación de contenido en respuestas de IA generativa.

---

## 6. Monitoreo Post-Lanzamiento (Costo 0 USD)

* **Cloudflare Web Analytics:** Activación con 1 clic sin cookies ni violación de privacidad (cumple RGPD sin requerir banner de consentimiento invasivo).
* **Search Console Insights:** Monitorear términos de búsqueda en ascenso (queries de intención devocional y de investigación científica).
