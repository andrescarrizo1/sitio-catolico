# Registro de Decisiones de Arquitectura y Técnicas (ADR)

Este documento registra todas las decisiones clave, asunciones iniciales y justificaciones técnicas del proyecto, priorizando la máxima simplicidad, costo cero de infraestructura ($0 USD), alto rendimiento y separación estricta entre contenido y presentación.

---

## 1. Stack Tecnológico Base: Astro (Última versión estable 7.x) + Content Layer API + TypeScript + Tailwind CSS

* **Decisión:** Usar **Astro 7.x** (verificado en registro npm como última versión estable) con TypeScript en modo estricto (`strict: true`), Tailwind CSS y el moderno **Content Layer API** (`src/content.config.ts`) con loaders `glob()` de `astro/loaders`.
* **Justificación:**
  * Generación estática pura (SSG) por defecto: 0 kB de JavaScript en el cliente para el 95% del sitio (hubs, lecturas, fichas de milagros, Fátima, Padre Pío, Biblia).
  * El nuevo Content Layer API (`src/content.config.ts`) desacopla las colecciones del directorio físico rígido anterior, permitiendo loaders declarativos eficientes y validación estricta en tiempo de compilación con Zod.
  * Compatibilidad directa con Cloudflare Pages y Cloudflare Workers con Static Assets.
  * `astro:assets` optimiza imágenes automáticamente a formatos modernos (WebP/AVIF), calculando dimensiones `width`/`height` intrínsecas para evitar CLS (Cumulative Layout Shift = 0).
* **Estructura:** Archivo de configuración en `src/content.config.ts`, no el formato legacy `src/content/config.ts`.

---

## 2. Estrategia de Islas Interactivas: Preact para Componentes Dinámicos

* **Decisión:** Usar **Preact** únicamente en dos puntos específicos:
  1. El **Rosario Interactivo** (`/rosario/`, modo rezo, cuentas, selección de misterios).
  2. La barra de búsqueda con **Pagefind**.
* **Justificación:**
  * Preact pesa solo ~3-4 kB gzipped frente a los 40+ kB de React tradicional.
  * Sintaxis JSX idéntica a React, permitiendo mantener una base de código uniforme y legible.
  * Estado local sencillo mediante `localStorage` (sin dependencias externas tipo Redux/Zustand).
* **Regla:** El resto de la web no cargará ningún bundle de JS en el cliente (`client:only` o `client:visible` estrictamente acotado a estas islas).

---

## 3. Buscador del Sitio: Pagefind (Estático y Local)

* **Decisión:** Implementar **Pagefind** como motor de búsqueda indexado en tiempo de compilación (`postbuild`).
* **Justificación:**
  * Cero servidores, cero costos de base de datos o APIs externas (como Algolia).
  * Genera índices estáticos comprimidos que se consultan en el cliente con un peso de red minúsculo (< 50 kB).
  * Privacidad total: las búsquedas de los usuarios nunca salen del dispositivo.

---

## 4. Gestión de Dominio y Entorno Local Agnóstico

* **Decisión:** Toda URL absoluta, canonical, sitemap y metadato Open Graph se derivará de la variable de entorno `PUBLIC_SITE_URL`.
* **Configuración:**
  * Por defecto en `.env`: `PUBLIC_SITE_URL=http://localhost:4321`.
  * En build de producción: Cloudflare inyectará la variable con el dominio definitivo (ej. `https://midominio.com`).
  * Cero URLs hardcodeadas en plantillas o componentes.

---

## 5. Bloqueo de Indexación por Defecto (Fase Local y Staging)

* **Decisión:** Implementar la variable `PUBLIC_ALLOW_INDEXING=false` por defecto en `.env`.
* **Efecto técnico:**
  1. Componente `<BaseHead />` inyecta automáticamente `<meta name="robots" content="noindex, nofollow">` en todas las páginas si `PUBLIC_ALLOW_INDEXING !== 'true'`.
  2. Generador de `robots.txt` escribe `User-agent: *\nDisallow: /` cuando está desactivado.
  3. Previene cualquier riesgo de indexación prematura de staging o previews en Cloudflare antes de la fecha oficial de lanzamiento.

---

## 6. Offline y PWA Específica para el Rosario con Scope Acotado

* **Decisión:** Registrar un Service Worker (`/sw-rosario.js`) cuyo alcance (scope) se limite estrictamente a `/rosario/`.
* **Estrategia de Caché e Invalidación:**
  * Nombre de caché: `rosario-v1.0.0`.
  * Solo intercepta solicitudes bajo `/rosario/*` y sus componentes visuales asociados.
  * Al activarse el service worker (`activate`), purga automáticamente cualquier caché con nombre obsoleto.
  * **Aislamiento total:** Ningún artículo doctrinal, ficha de milagro, estudio histórico ni página institucional pasa por el Service Worker; siempre se descargan frescos de la red.
* **Asignación temporal de misterios:**
  * Se asignan automáticamente por el **día de la semana en hora local del cliente** (`new Date().getDay()`).
  * Lunes y sábado: Gozosos. Martes y viernes: Dolorosos. Miércoles y domingo: Gloriosos. Jueves: Luminosos (*Rosarium Virginis Mariae*, San Juan Pablo II, 2002, n. 38).
  * Variante tradicional (bula *Consueverunt Romani Pontifices*, San Pío V, 1569: domingos de Adviento Gozosos, domingos de Cuaresma Dolorosos) disponible como opción conmutadora con cita de ambas fuentes.
  * Selector manual de los 4 juegos de misterios siempre visible y conmutable con un solo clic.

---

## 7. Traducción Bíblica: Edición Histórica Exacta de Torres Amat

* **Decisión:**
  * Utilizar únicamente el texto de la edición histórica original de **1825** de la *Biblia traducida de la Vulgata Latina al español* por el Ilmo. Sr. D. **Félix Torres Amat** (Madrid, Imprenta de D. Miguel de Burgos, 1825).
  * Fuente digital verificada: Google Books / Biblioteca Digital Hispánica (BNE) / transcripción sin modificaciones de Dominio Público en Wikisource (edición Montaner y Simón 1884, fiel al original de 1825).
  * Prohibido terminantemente el uso de revisiones críticas modernas de Torres Amat que contengan derechos de autor vigentes de editoriales comerciales.
  * Registrar la ficha bibliográfica exacta en `LICENCIAS.md`.

---

## 8. Veracidad de Hechos y Separación Editorial Tripartita

* **Decisión:** Cada ficha de milagro o hecho sobrenatural se estructurará rígidamente en 3 bloques visuales y conceptuales diferenciados:
  1. **Hecho Histórico Documentado:** Fecha, lugar, circunstancias, testigos oculares, actas eclesiásticas y notariales.
  2. **Estudios Médicos y Científicos:** Investigadores (con cargos e instituciones reales), técnicas histopatológicas utilizadas, resultados objetivos de laboratorio y limitaciones metodológicas reconocidas.
  3. **Interpretación y Significado Teológico:** Lo que la Iglesia concluye, estatus eclesial formal, invitación a la fe sin sensacionalismos.
* **Componente `<NextStep />`:**
  * Cada artículo y ficha cierra obligatoriamente con el componente `<NextStep />`, que llama a una acción espiritual concreta: rezar el misterio de hoy, acudir al Sacramento de la Confesión, asistir a Misa/Adoración, o leer un pasaje del Evangelio.
