# Reporte de Verificación de Regresiones – Fase 1B

**Fecha:** 2 de Noviembre de 2026  
**Rama:** `seo/fase-1b-correcciones`  
**Objetivo:** Auditar el estado de internacionalización, metadatos, hreflang y enrutamiento del sitio tras la Fase 1 técnica antes de aplicar correcciones.

---

## a) Estado de `<html lang>` y `og:locale` en páginas en inglés

El cambio de `<html lang="es">` y `og:locale="es"` aplicado en la Fase 1 técnica **no pisó el atributo `<html lang="en">`** de las páginas en inglés. 

`BaseLayout.astro` recibe la propiedad `lang` (por defecto `'es'`), y las páginas en inglés le pasan explícitamente `lang="en"`, renderizando `<html lang="en">`.

En cuanto a `og:locale`, en `BaseHead.astro` se encontraba la lógica conditional:
`content={lang === 'en' ? 'en' : 'es'}`.
Por tanto, en las páginas en inglés se estaba emitiendo `og:locale="en"` (en lugar del valor estándar de OpenGraph `en_US`), mientras que en español se emitía `og:locale="es"`.

### Tabla de páginas en inglés y valores actuales en `dist/`

| URL | `<html lang>` | `og:locale` | Estado |
| :--- | :--- | :--- | :--- |
| `/en/` | `en` | `en` | Requiere ajustar `og:locale` a `en_US` |
| `/en/interactive-rosary/` | `en` | `en` | Requiere ajustar `og:locale` a `en_US` |
| `/en/rosary/how-to-pray/` | `en` | `en` | Requiere ajustar `og:locale` a `en_US` |
| `/en/shroud-of-turin/` | `en` | `en` | Requiere ajustar `og:locale` a `en_US` |
| `/en/divine-mercy-chaplet/` | `en` | `en` | Requiere ajustar `og:locale` a `en_US` |
| `/en/rosary/` | *(N/A)* | *(N/A)* | Redirección meta-refresh a `/en/interactive-rosary/` |

---

## b) Verificación de hreflang recíproco y `x-default`

**Resultado: SÍ, sigue presente en todas las duplas bilingües de forma recíproca.**

Se auditaron las 5 duplas bilingües del sitio (10 páginas indexables en total). Todas cuentan con sus etiquetas bidireccionales y `x-default`:

1. **Página Principal (Home)**
   - `/`: `es` -> `https://razonyasombro.com/` | `en` -> `https://razonyasombro.com/en/` | `x-default` -> `https://razonyasombro.com/`
   - `/en/`: `es` -> `https://razonyasombro.com/` | `en` -> `https://razonyasombro.com/en/` | `x-default` -> `https://razonyasombro.com/`
2. **Santo Rosario Interactivo**
   - `/rosario/`: `es` -> `https://razonyasombro.com/rosario/` | `en` -> `https://razonyasombro.com/en/interactive-rosary/` | `x-default` -> `https://razonyasombro.com/rosario/`
   - `/en/interactive-rosary/`: `es` -> `https://razonyasombro.com/rosario/` | `en` -> `https://razonyasombro.com/en/interactive-rosary/` | `x-default` -> `https://razonyasombro.com/rosario/`
3. **Guía Cómo Rezar el Rosario**
   - `/rosario/como-rezar/`: `es` -> `https://razonyasombro.com/rosario/como-rezar/` | `en` -> `https://razonyasombro.com/en/rosary/how-to-pray/` | `x-default` -> `https://razonyasombro.com/rosario/como-rezar/`
   - `/en/rosary/how-to-pray/`: `es` -> `https://razonyasombro.com/rosario/como-rezar/` | `en` -> `https://razonyasombro.com/en/rosary/how-to-pray/` | `x-default` -> `https://razonyasombro.com/rosario/como-rezar/`
4. **Sábana Santa de Turín**
   - `/ciencia-y-fe/sabana-santa-de-turin/`: `es` -> `https://razonyasombro.com/ciencia-y-fe/sabana-santa-de-turin/` | `en` -> `https://razonyasombro.com/en/shroud-of-turin/` | `x-default` -> `https://razonyasombro.com/ciencia-y-fe/sabana-santa-de-turin/`
   - `/en/shroud-of-turin/`: `es` -> `https://razonyasombro.com/ciencia-y-fe/sabana-santa-de-turin/` | `en` -> `https://razonyasombro.com/en/shroud-of-turin/` | `x-default` -> `https://razonyasombro.com/ciencia-y-fe/sabana-santa-de-turin/`
5. **Divina Misericordia / Santa Faustina**
   - `/santos/faustina-kowalska/`: `es` -> `https://razonyasombro.com/santos/faustina-kowalska/` | `en` -> `https://razonyasombro.com/en/divine-mercy-chaplet/` | `x-default` -> `https://razonyasombro.com/santos/faustina-kowalska/`
   - `/en/divine-mercy-chaplet/`: `es` -> `https://razonyasombro.com/santos/faustina-kowalska/` | `en` -> `https://razonyasombro.com/en/divine-mercy-chaplet/` | `x-default` -> `https://razonyasombro.com/santos/faustina-kowalska/`

---

## c) Presencia de `&amp;` en títulos en inglés

**Resultado: DETECTADO EN 1 PÁGINA.**
- En la página `/en/`, el `<title>` generado en HTML es:
  `<title>Catholic Faith &amp; Science | Razón y Asombro</title>`
- **Causa:** El título configurado en `src/components/global/BaseHead.astro` para esta página contenía el carácter `&` (`Catholic Faith & Science`). Al interpolarse en la plantilla JSX/Astro `<title>{fullTitle}</title>`, el motor de plantillas escapó automáticamente el ampersand a su entidad HTML `&amp;`.
- **Corrección requerida:** Cambiar el título por texto sin ampersand (por ejemplo `Catholic Faith and Science`), lo cual evita el escape automático y produce un texto plano limpio para los motores de búsqueda.
- En las demás páginas en inglés (`/en/interactive-rosary/`, `/en/rosary/how-to-pray/`, `/en/shroud-of-turin/`, `/en/divine-mercy-chaplet/`), no hay presencia de `&amp;` en sus títulos.

---

## d) Archivo `docs/seo_metadata.csv` y diagnóstico de metadatos

El archivo ha sido generado a partir del análisis automatizado de los 38 archivos HTML de `dist/` mediante el script `generate_seo_metadata_csv.mjs` y guardado en `docs/seo_metadata.csv`.

### Resultados de la auditoría:
- **Total de URLs analizadas:** 38 (36 páginas estáticas indexables + 2 páginas de redirección).
- **Títulos truncados a mitad de palabra:** 0. Todos los títulos tienen cierre semántico completo y no superan los 60 caracteres (longitudes entre 33 y 49 caracteres en páginas indexables).
- **Meta descripciones fuera del rango 120–155 caracteres:** 0 en páginas indexables. Todas las 36 descripciones están entre 133 y 155 caracteres. Las únicas 2 entradas sin descripción corresponden a las páginas auxiliares de redirección meta-refresh (`/en/rosary/` y `/santos/estudios-medicos-y-santo-oficio/`).

---

## e) Cómo se enrutan hoy las páginas en inglés

1. **Estructura de directorios y prefijo:**
   - Todas las páginas en inglés residen físicamente en `src/pages/en/`.
   - Astro asigna rutas basadas en archivos (file-based routing), por lo que el prefijo `/en/` queda determinado naturalmente por la carpeta física.
   - Rutas generadas:
     - `src/pages/en/index.astro` &rarr; `https://razonyasombro.com/en/`
     - `src/pages/en/interactive-rosary.astro` &rarr; `https://razonyasombro.com/en/interactive-rosary/`
     - `src/pages/en/rosary/how-to-pray.astro` &rarr; `https://razonyasombro.com/en/rosary/how-to-pray/`
     - `src/pages/en/shroud-of-turin.astro` &rarr; `https://razonyasombro.com/en/shroud-of-turin/`
     - `src/pages/en/divine-mercy-chaplet.astro` &rarr; `https://razonyasombro.com/en/divine-mercy-chaplet/`
2. **Redirecciones de legado en inglés:**
   - En `astro.config.mjs` está declarada la redirección:
     `'/en/rosary': '/en/interactive-rosary/'`
3. **Mecanismo de generación de hreflang:**
   - No se utiliza actualmente el módulo nativo de i18n de Astro para generar los hreflang.
   - En su lugar, cada página declara un array explícito en su bloque de frontmatter:
     ```ts
     const alternateLinks = [
       { hreflang: 'es', href: `${siteUrl}/...` },
       { hreflang: 'en', href: `${siteUrl}/en/...` },
       { hreflang: 'x-default', href: `${siteUrl}/...` },
     ];
     ```
   - Este array se pasa como prop a `BaseLayout.astro` y luego a `BaseHead.astro`, el cual itera sobre el array generando las etiquetas `<link rel="alternate" hreflang="..." href="..." />`.
