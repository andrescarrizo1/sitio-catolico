# Arquitectura del Sistema y Especificación Técnica

## 1. Visión General y Principios de Diseño
Este proyecto es una plataforma web católica moderna, orientada al Evangelio de Jesucristo, sus enseñanzas, milagros eucarísticos verificados por la ciencia, la Virgen de Fátima, San Pío de Pietrelcina, el Santo Rosario interactivo y la meditación bíblica.

### Principios Fundamentales
1. **0 kB de JS por defecto (Island Architecture):** Solo el Rosario y el Buscador cargan JavaScript en el navegador. El 95% del sitio es HTML + CSS puro y ultraligero.
2. **Content Layer API (Astro 7.x):** Cero contenido hardcodeado en componentes. Todo el contenido reside en archivos tipados en `.mdx` y se define centralizadamente en `src/content.config.ts` mediante loaders `glob()` de `astro/loaders`.
3. **Agnóstico del Dominio:** Construido para operar en local (`http://localhost:4321`) y transicionar a Cloudflare Pages o Cloudflare Workers con Static Assets sin tocar una sola línea de código, usando `PUBLIC_SITE_URL`.
4. **Validación en Build Estricta:** Si una imagen no tiene `alt`, carece de registro en `LICENCIAS.md`, o si un milagro carece de fuentes verificadas, el build de producción **falla automáticamente**.

---

## 2. Estructura de Directorios del Repositorio

```text
/
├── .env.example               # Variables de entorno por defecto (PUBLIC_SITE_URL, PUBLIC_ALLOW_INDEXING)
├── .env                       # Configuración local
├── .gitignore
├── astro.config.mjs           # Configuración de Astro 7.x, Tailwind, MDX, Preact, Sitemap
├── package.json               # Dependencias y scripts
├── tsconfig.json              # TypeScript en modo estricto
├── tailwind.config.mjs        # Tokens de diseño (paleta mariana/tinta/dorado, tipografías)
├── LICENCIAS.md               # Registro obligatorio de licencias de imágenes y textos
├── PENDIENTES.md              # Registro de hechos sin fuente primaria suficiente y tareas editoriales
│
├── docs/                      # Documentación y arquitectura viva
│   ├── ARQUITECTURA.md        # Este documento
│   ├── DECISIONES.md          # Registro de decisiones de arquitectura (ADR)
│   ├── VOZ-EDITORIAL.md       # Criterios estilísticos, dogmáticos y pastorales obligatorios
│   ├── LANZAMIENTO.md         # Procedimiento para migración futura a Cloudflare
│   └── research/              # Entregables de la Fase 0 de investigación
│       ├── serp-analysis.md
│       ├── content-gaps.md
│       ├── keyword-map.md
│       └── design-benchmarks.md
│
├── public/                    # Assets estáticos directos
│   ├── favicon.svg
│   ├── robots.txt             # Dinámico o estático según PUBLIC_ALLOW_INDEXING
│   ├── sw-rosario.js          # Service Worker con scope exclusivo /rosario/
│   └── manifest.json          # PWA Manifest para el Rosario
│
├── scripts/                   # Scripts de validación en tiempo de build/pre-commit
│   ├── check-links.mjs        # Verificador de enlaces rotos internos
│   ├── check-licenses.mjs     # Comprueba que cada imagen en src/assets esté en LICENCIAS.md
│   └── lighthouse-runner.mjs  # Auditoría automatizada con lighthouse CLI
│
└── src/
    ├── content.config.ts      # Content Layer API con loaders glob() y esquemas Zod
    │
    ├── assets/                # Imágenes maestras locales optimizadas por astro:assets
    │   ├── fatima/
    │   ├── milagros/
    │   ├── padre-pio/
    │   ├── jesus/
    │   └── ui/
    │
    ├── content/               # Contenido estructurado en Markdown / MDX
    │   ├── biblia/            # Entradas de versículos temáticos
    │   ├── fatima/            # Subpáginas del pilar Fátima
    │   ├── jesus/             # Enseñanzas de Jesús
    │   ├── milagros/          # Fichas de milagros eucarísticos
    │   ├── paginas/           # Páginas institucionales (acerca, metodologia, autor)
    │   └── santos/            # Páginas sobre San Pío de Pietrelcina
    │
    ├── components/            # Componentes Astro reutilizables
    │   ├── global/
    │   │   ├── BaseHead.astro
    │   │   ├── Header.astro
    │   │   ├── Footer.astro
    │   │   ├── Breadcrumbs.astro
    │   │   └── ThemeToggle.astro
    │   ├── ui/
    │   │   ├── Hero.astro
    │   │   ├── PillarCard.astro
    │   │   ├── Verse.astro
    │   │   ├── FactSheet.astro
    │   │   ├── SourceList.astro
    │   │   └── NextStep.astro
    │   ├── rosario/           # Componentes e islas del Rosario
    │   │   ├── RosaryApp.tsx  # Isla Preact interactiva (modo rezo + offline)
    │   │   └── RosaryBead.tsx # Cuentas y misterios visuales
    │   └── search/
    │       └── SearchBar.astro # Integración con Pagefind
    │
    ├── layouts/               # Plantillas estructurales
    │   ├── BaseLayout.astro   # HTML esqueleto, cabecera SEO, Open Graph, Dark Mode script
    │   ├── ArticleLayout.astro# Layout editorial para lecturas y enseñanzas
    │   ├── FactLayout.astro   # Layout para fichas con tabla resumen y fuentes (Milagros/Fátima/Santos)
    │   └── PillarLayout.astro # Hub principal de cada pilar
    │
    ├── styles/                # CSS global y tokens
    │   └── global.css         # Reset, variables CSS (tokens), tipografía fluida clamp()
    │
    ├── types/                 # Definiciones TypeScript compartidas
    │   └── site.ts
    │
    └── pages/                 # Enrutamiento estático basado en archivos
        ├── index.astro
        ├── 404.astro
        ├── acerca.astro
        ├── autor.astro
        ├── metodologia.astro
        ├── search.json.ts
        ├── biblia/
        │   ├── index.astro
        │   └── [tema].astro
        ├── jesus/
        │   ├── index.astro
        │   └── [slug].astro
        ├── milagros-eucaristicos/
        │   ├── index.astro
        │   └── [slug].astro
        ├── padre-pio/
        │   ├── index.astro
        │   └── [slug].astro
        ├── rosario/
        │   ├── index.astro
        │   ├── como-rezar.astro
        │   └── misterios-de-hoy.astro
        └── virgen-de-fatima/
            ├── index.astro
            └── [slug].astro
```

---

## 3. Esquemas de Contenido con Content Layer API (`src/content.config.ts`)

Astro 7.x utiliza el Content Layer API centralizado en `src/content.config.ts`. Cada colección se configura utilizando la función `glob()` de `astro/loaders` y esquemas Zod estrictos.

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Esquema base compartido por todas las entidades editoriales
const baseSchema = z.object({
  slug: z.string().optional(),
  titulo: z.string().min(5).max(120),
  resumen: z.string().min(20).max(300),
  imagen: z.object({
    src: z.string(),
    alt: z.string().min(10, "El texto alternativo (alt) es obligatorio y descriptivo"),
    credito: z.string(),
    licencia: z.enum([
      'Dominio Público',
      'CC0',
      'CC BY 2.0',
      'CC BY 3.0',
      'CC BY 4.0',
      'CC BY-SA 2.0',
      'CC BY-SA 3.0',
      'CC BY-SA 4.0',
      'Uso Editorial Justificado'
    ]),
    url_fuente: z.string().url(),
  }),
  estatus_eclesial: z.enum([
    'Aprobado formalmente por la Santa Sede',
    'Aprobado por el Obispo local (Decreto diocesano)',
    'En estudio / Sin pronunciamiento definitivo',
    'Canonizado',
    'No consta aprobación sobrenatural formal'
  ]),
  fuentes: z.array(
    z.object({
      titulo: z.string(),
      autor: z.string().optional(),
      tipo: z.enum(['Documento Eclesiástico', 'Estudio Científico / Médico', 'Libro Histórico', 'Prensa de la Época']),
      url: z.string().url().optional(),
      cita_o_referencia: z.string(),
      nivel_confianza: z.enum(['Primaria (Oficial / Laboratorio)', 'Secundaria Académica', 'Testimonial Documentada'])
    })
  ).min(1, "Debe incluirse al menos una fuente primaria o histórica verificada"),
  autor: z.string().default("Equipo Editorial"),
  revisado_por: z.string().default("Revisión Teológica y Científica Interna"),
  fecha_publicacion: z.date(),
  fecha_revision: z.date(),
});

// 1. Colección: Milagros Eucarísticos
export const milagros = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/milagros" }),
  schema: baseSchema.extend({
    lugar: z.string(),
    fecha_evento: z.string(),
    tipo_fenomeno: z.string(),
    grupo_sanguineo: z.string().default('AB'),
    investigadores_clave: z.array(z.string()),
    laboratorios_participantes: z.array(z.string()),
    evidencia_cientifica_resumen: z.string(),
    objeciones_y_respuestas: z.array(z.object({
      objecion: z.string(),
      respuesta_documentada: z.string()
    })).optional(),
  }),
});

// 2. Colección: Virgen de Fátima
export const fatima = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/fatima" }),
  schema: baseSchema.extend({
    orden: z.number().int(),
    tema_principal: z.enum(['Apariciones', 'Pastorcitos', 'Mensaje y Reparación', 'Milagro del Sol', 'Consagración']),
    pasajes_memorias_lucia: z.array(z.string()).optional(),
  }),
});

// 3. Colección: San Pío de Pietrelcina
export const santos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/santos" }),
  schema: baseSchema.extend({
    orden: z.number().int(),
    eje_tematico: z.enum(['Vida y Vocación', 'Los Estigmas', 'Estudios Médicos y Santo Oficio', 'Espiritualidad y Confesión']),
    medicos_involucrados: z.array(z.string()).optional(),
  }),
});

// 4. Colección: Jesús y sus Enseñanzas
export const jesus = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/jesus" }),
  schema: baseSchema.extend({
    categoria: z.enum(['Parábolas', 'Sermón de la Montaña', 'Milagros', 'Enseñanzas Morales y Teológicas']),
    referencia_evangelica_principal: z.string(),
    texto_biblico_completo: z.string(),
    traduccion_usada: z.string().default("Biblia Torres Amat (1825, Dominio Público)"),
    aplicacion_hoy: z.string(),
    siguiente_paso_sugerido: z.string(),
  }),
});

// 5. Colección: Biblia y Conversión
export const biblia = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/biblia" }),
  schema: z.object({
    tema_slug: z.string(),
    tema_titulo: z.string(),
    descripcion_pastoral: z.string(),
    versiculos: z.array(z.object({
      referencia: z.string(),
      texto: z.string(),
      traduccion: z.string().default("Biblia Torres Amat (1825, Dominio Público)"),
      reflexion_corta: z.string().max(400),
      accion_sugerida: z.string()
    })).min(8).max(15),
  }),
});

// 6. Colección: Páginas Institucionales
export const paginas = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/paginas" }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    fecha_actualizacion: z.date(),
  }),
});

export const collections = {
  milagros,
  fatima,
  santos,
  jesus,
  biblia,
  paginas,
};
```

---

## 4. Rosario Interactivo: Lógica Temporal y Service Worker Restringido

### A. Asignación de Misterios por Día de la Semana (Hora Local)
Los misterios se determinan estrictamente según el **día de la semana en la hora local del cliente** (`new Date().getDay()`):
* **Lunes y Sábado:** Misterios Gozosos (La Anunciación, La Visitación, La Natividad, La Purificación, El Niño hallado en el Templo).
* **Martes y Viernes:** Misterios Dolorosos (La Oración en el Huerto, La Flagelación, La Coronación de Espinas, La Cruz a Cuestas, La Crucifixión).
* **Miércoles y Domingo:** Misterios Gloriosos (La Resurrección, La Ascensión, La Venida del Espíritu Santo, La Asunción, La Coronación de la Virgen).
* **Jueves:** Misterios Luminosos (El Bautismo en el Jordán, Las Bodas de Caná, El Anuncio del Reino, La Transfiguración, La Institución de la Eucaristía — *Rosarium Virginis Mariae*, San Juan Pablo II, 2002, n. 38).

#### Variante Tradicional de Domingos (Opcional):
* En la tradición previa a 2002 (bula *Consueverunt Romani Pontifices*, San Pío V, 1569), se rezaban los Misterios Gozosos en los domingos de Adviento y los Misterios Dolorosos en los domingos de Cuaresma.
* **Implementación:** La aplicación mostrará un conmutador discreto: *"Alternar a variante tradicional para domingos de Adviento / Cuaresma"* con referencia a las dos fuentes magisteriales citadas. En cualquier caso, el **selector manual de misterios permanecerá siempre disponible e interactivo**.

### B. Service Worker con Scope Restringido (`/rosario/`)
Para garantizar que el modo offline del Rosario jamás sirva contenido desactualizado o en caché del resto de la web:
* **Scope exclusivo:** Se registra únicamente desde la ruta del rosario:
  ```javascript
  if ('serviceWorker' in navigator && window.location.pathname.startsWith('/rosario')) {
    navigator.serviceWorker.register('/sw-rosario.js', { scope: '/rosario/' });
  }
  ```
* **Estrategia de Caché e Invalidación:**
  * Nombre de caché versionada: `const CACHE_NAME = 'rosario-v1.0.0';`
  * Precache exclusivo: `/rosario/`, `/rosario/como-rezar/`, `/rosario/misterios-de-hoy/`, y únicamente los assets propios de la isla del Rosario.
  * En el evento `activate`, el Service Worker itera sobre `caches.keys()` y elimina de inmediato cualquier caché que no coincida exactamente con la versión activa.
  * Ninguna petición a `/jesus/`, `/milagros-eucaristicos/`, `/virgen-de-fatima/` ni `/padre-pio/` pasa por el Service Worker.

---

## 5. Diseño y Tokens Visuales (Tailwind)

* **Paleta Cromática (Luz y Penumbra Sacra):**
  * `tinta-950`: `#0B132B` (fondo modo oscuro / texto modo claro).
  * `tinta-900`: `#1C2541` (superficies modo oscuro).
  * `marfil-50`: `#FAF8F5` (fondo modo claro cálido).
  * `marfil-100`: `#F3EFE6` (tarjetas modo claro).
  * `oro-cálido`: `#C5A059` / `#DFBA73` (acentos, cuentas del rosario, filetes).
  * `azul-mariano`: `#1D4ED8` (vínculos, botones de llamada, tema Fátima).
  * `carmesí-pasion`: `#991B1B` (acentos de la Preciosísima Sangre y Eucaristía).
* **Tipografía Editorial:**
  * Titulares: Serif de alta legibilidad (`Cinzel` / `Playfair Display` self-hosted WOFF2).
  * Lectura y Cuerpo: Serif de texto humanística (`Lora` o `Source Serif 4`).
  * Interfaz y Metadatos: Sans moderna (`Plus Jakarta Sans` o `Inter`).
* **Accesibilidad:** Contraste WCAG AA (≥ 4.5:1), foco visible en todos los botones y enlaces, tipografía escalada con `clamp()`.
