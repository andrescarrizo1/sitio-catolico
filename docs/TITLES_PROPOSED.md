# Propuesta de Títulos Editoriales (≤ 60 Caracteres)

> **ESTADO: No aplicadas (solo propuestas)**  
> Este documento contiene las propuestas editoriales de títulos nativos de longitud menor o igual a 60 caracteres para las páginas del sitio `razonyasombro.com`.  
> *Nota técnica:* En la Fase 2 se introdujo un filtro preventivo (`knownShortTitles` y truncamiento en `src/components/global/BaseHead.astro`) que garantiza que los elementos `<title>` generados en el HTML de producción midan ≤60 caracteres. No obstante, los títulos originales en la frontmatter de las colecciones y en los layouts fuente aún superan esa cifra (p. ej., la Sábana Santa alcanzaba 103 caracteres y la Tilma 112 al concatenar la marca). Las siguientes propuestas permiten resolver la longitud directamente desde el origen editorial sin depender de truncamiento algorítmico.

---

## 1. Artículos de Investigación y Estudios (Colecciones MDX)

| Ruta / Archivo | Título Actual (Longitud) | Título Propuesto (Longitud) | Claves SEO / Criterio E-E-A-T |
| :--- | :--- | :--- | :--- |
| `/ciencia-y-fe/sabana-santa-de-turin/`<br>`src/content/ciencia-fe/sabana-santa-de-turin.mdx` | `La Sábana Santa de Turín: STURP, carbono 14 y qué dicen los estudios científicos \| Razón y Asombro`<br>*(100 car.)* | `Sábana Santa: Ciencia y Carbono 14 \| Razón y Asombro`<br>*(52 car.)* | Conserva términos clave de búsqueda ("Sábana Santa", "Ciencia", "Carbono 14") y seriedad analítica. |
| `/ciencia-y-fe/virgen-de-guadalupe-tilma/`<br>`src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx` | `La Tilma de Guadalupe: El Ayate Incorrupto, los Pigmentos Inexplicables y el Fenómeno Ocular \| Razón y Asombro`<br>*(112 car.)* | `La Tilma de Guadalupe y la Ciencia \| Razón y Asombro`<br>*(51 car.)* | Elimina adjetivos sensacionalistas ("inexplicables") y enfoca en la investigación documental de la tilma. |
| `/ciencia-y-fe/lourdes-bureau-medical/`<br>`src/content/ciencia-fe/lourdes-bureau-medical.mdx` | `El Bureau Médical de Lourdes: El Tribunal Científico más Riguroso del Mundo y los 7 Criterios Médicos \| Razón y Asombro`<br>*(119 car.)* | `Bureau Médical de Lourdes: Milagros \| Razón y Asombro`<br>*(52 car.)* | Prioriza el término técnico "Bureau Médical de Lourdes" y la temática de curaciones verificadas. |
| `/ciencia-y-fe/criterios-vaticano-apariciones-sobrenaturales/`<br>`src/content/ciencia-fe/criterios-vaticano-apariciones-sobrenaturales.mdx` | `Criterios del Vaticano para Apariciones: Las Normas 2024 y sus 6 Conclusiones \| Razón y Asombro`<br>*(95 car.)* | `Criterios del Vaticano: Apariciones \| Razón y Asombro`<br>*(52 car.)* | Mantiene la referencia institucional a las normas del Dicasterio para la Doctrina de la Fe. |
| `/virgen-de-fatima/milagro-del-sol/`<br>`src/content/fatima/milagro-del-sol.mdx` | `El Milagro del Sol (Fátima, 13 de Octubre de 1917): Historia, Testimonios y Prensa Secular \| Razón y Asombro`<br>*(108 car.)* | `El Milagro del Sol en Fátima: 1917 \| Razón y Asombro`<br>*(51 car.)* | Conserva evento, lugar y año histórico, apto para búsquedas testimoniales y documentales. |
| `/milagros-eucaristicos/buenos-aires/`<br>`src/content/milagros/buenos-aires.mdx` | `El Signo Eucarístico de Buenos Aires (1996): El Análisis Ciego del Cardiólogo Frederic Zugibe \| Razón y Asombro`<br>*(111 car.)* | `Milagro Eucarístico de Buenos Aires \| Razón y Asombro`<br>*(52 car.)* | Término exacto de máxima intención de búsqueda en Argentina y Latinoamérica. |
| `/milagros-eucaristicos/lanciano/`<br>`src/content/milagros/lanciano.mdx` | `El Milagro Eucarístico de Lanciano: Historia y Evidencia Científica \| Razón y Asombro`<br>*(85 car.)* | `Milagro Eucarístico de Lanciano \| Razón y Asombro`<br>*(48 car.)* | Búsqueda cardinal de historia eclesial y peritajes médicos de Linoli. |
| `/milagros-eucaristicos/legnica/`<br>`src/content/milagros/legnica.mdx` | `El Milagro Eucarístico de Legnica (2013): Fibras Miocárdicas en Agonía en Polonia \| Razón y Asombro`<br>*(99 car.)* | `Milagro Eucarístico de Legnica \| Razón y Asombro`<br>*(47 car.)* | Enfoque directo en la localidad polaca y el caso de 2013. |
| `/milagros-eucaristicos/sokolka/`<br>`src/content/milagros/sokolka.mdx` | `El Milagro Eucarístico de Sokółka (2008): La Fusión Microscópica de Pan y Tejido Cardíaco \| Razón y Asombro`<br>*(107 car.)* | `Milagro Eucarístico de Sokółka \| Razón y Asombro`<br>*(47 car.)* | Término exacto para la consulta del signo de 2008. |
| `/santos/carlo-acutis/`<br>`src/content/santos/carlo-acutis.mdx` | `San Carlo Acutis: El Apóstol de la Eucaristía, los Milagros y la Red \| Razón y Asombro`<br>*(86 car.)* | `San Carlo Acutis: Vida y Milagros \| Razón y Asombro`<br>*(50 car.)* | Términos biográficos y de devoción internacional de gran volumen. |
| `/padre-pio/estudios-medicos-y-santo-oficio/`<br>`src/content/santos/estudios-medicos-y-santo-oficio.mdx` | `Padre Pío: Los Peritajes Médicos de sus Estigmas y los Decretos del Santo Oficio \| Razón y Asombro`<br>*(98 car.)* | `Estigmas del Padre Pío: Peritajes \| Razón y Asombro`<br>*(50 car.)* | Combina la figura del santo, el signo físico y la documentación forense/histórica. |
| `/santos/faustina-kowalska/`<br>`src/content/santos/faustina-kowalska.mdx` | `Santa Faustina Kowalska: Las Visiones de Jesús, el Diario y el Retrato de Vilna \| Razón y Asombro`<br>*(97 car.)* | `Santa Faustina y la Misericordia \| Razón y Asombro`<br>*(49 car.)* | Conexión directa entre la mística y la devoción global de la Divina Misericordia. |
| `/jesus/el-buen-samaritano/`<br>`src/content/jesus/el-buen-samaritano.mdx` | `La Parábola del Buen Samaritano: El Amor al Prójimo sin Fronteras \| Razón y Asombro`<br>*(83 car.)* | `Parábola del Buen Samaritano \| Razón y Asombro`<br>*(45 car.)* | Concordancia exacta con consultas bíblicas y catequéticas. |
| `/jesus/parabola-del-hijo-prodigo/`<br>`src/content/jesus/parabola-del-hijo-prodigo.mdx` | `La Parábola del Hijo Pródigo: La Teología del Padre Misericordioso \| Razón y Asombro`<br>*(84 car.)* | `Parábola del Hijo Pródigo: Análisis \| Razón y Asombro`<br>*(52 car.)* | Exégesis bíblica orientada a formación y reflexión. |
| `/jesus/sermon-de-la-montana-bienaventuranzas/`<br>`src/content/jesus/sermon-de-la-montana-bienaventuranzas.mdx` | `El Sermón de la Montaña y las Bienaventuranzas: La Carta Magna del Reino de Dios \| Razón y Asombro`<br>*(98 car.)* | `Sermón de la Montaña: Bienaventuranzas \| Razón y Asombro`<br>*(55 car.)* | Abarca ambas palabras clave críticas de búsqueda sin desbordar el SERP. |

---

## 2. Devociones, Salmos y Oraciones

| Ruta / Archivo | Título Actual (Longitud) | Título Propuesto (Longitud) | Claves SEO / Criterio E-E-A-T |
| :--- | :--- | :--- | :--- |
| `/rosario/como-rezar/`<br>`src/pages/rosario/como-rezar.astro` | `Cómo Rezar el Santo Rosario Paso a Paso \| Guía Completa para Principiantes \| Razón y Asombro`<br>*(92 car.)* | `Cómo Rezar el Santo Rosario: Guía \| Razón y Asombro`<br>*(51 car.)* | "Cómo rezar el Rosario", palabra clave devocional dominante. |
| `/rosario/misterios-de-hoy/`<br>`src/pages/rosario/misterios-de-hoy.astro` | `¿Qué Misterios tocan Hoy en el Rosario? \| Asignación Diaria y Rezo Guiado \| Razón y Asombro`<br>*(91 car.)* | `Misterios del Rosario de Hoy: Rezo \| Razón y Asombro`<br>*(51 car.)* | Intención de búsqueda diaria ("Misterios de hoy"). |
| `/rosario/misterios-dolorosos/`<br>`src/pages/rosario/misterios-dolorosos.astro` | `Misterios Dolorosos del Rosario: Meditación y Pasajes Bíblicos \| Razón y Asombro`<br>*(80 car.)* | `Misterios Dolorosos del Rosario \| Razón y Asombro`<br>*(48 car.)* | Búsqueda específica para martes y viernes de rezo. |
| `/rosario/coronilla-divina-misericordia/`<br>`src/pages/rosario/coronilla-divina-misericordia.astro` | `Coronilla de la Divina Misericordia: Guía Paso a Paso y Promesas \| Razón y Asombro`<br>*(86 car.)* | `Coronilla Divina Misericordia: Guía \| Razón y Asombro`<br>*(52 car.)* | Gran demanda de búsqueda devocional paso a paso. |
| `/biblia/salmo-91/`<br>`src/pages/biblia/salmo-91.astro` | `Salmo 91: Oración de Protección y Amparo del Altísimo \| Versículos Bíblicos y Meditación \| Razón y Asombro`<br>*(116 car.)* | `Salmo 91: Oración de Protección \| Razón y Asombro`<br>*(48 car.)* | Búsqueda de altísimo tráfico en salmos bíblicos. |
| `/biblia/salmo-23/`<br>`src/pages/biblia/salmo-23.astro` | `Salmo 23: El Señor es mi Pastor y Nada me Faltará \| Versículos Bíblicos y Meditación \| Razón y Asombro`<br>*(111 car.)* | `Salmo 23: El Señor es mi Pastor \| Razón y Asombro`<br>*(48 car.)* | Versículo identificativo universal y meditación. |
| `/biblia/el-misterio-del-sufrimiento-en-la-biblia/`<br>`src/pages/biblia/el-misterio-del-sufrimiento-en-la-biblia.astro` | `El Misterio del Sufrimiento en la Biblia: De Job y la Cruz a Salvifici Doloris \| Razón y Asombro`<br>*(96 car.)* | `El Sufrimiento en la Biblia \| Razón y Asombro`<br>*(44 car.)* | Término teológico y pastoral claro sin sobrecarga. |

---

## 3. Hubs Temáticos y Secciones Institucionales

| Ruta / Archivo | Título Actual (Longitud) | Título Propuesto (Longitud) | Claves SEO / Criterio E-E-A-T |
| :--- | :--- | :--- | :--- |
| `/ciencia-y-fe/`<br>`src/pages/ciencia-y-fe/index.astro` | `Ciencia y Fe Católica: Evidencia Empírica y Forense \| Razón y Asombro`<br>*(69 car.)* | `Ciencia y Fe Católica: Estudios \| Razón y Asombro`<br>*(48 car.)* | Hub temático principal sobre compatibilidad racional y científica. |
| `/milagros-eucaristicos/`<br>`src/pages/milagros-eucaristicos/index.astro` | `Milagros Eucarísticos y Ciencia \| Peritajes Médicos e Históricos`<br>*(64 car.)* | `Milagros Eucarísticos y Ciencia \| Razón y Asombro`<br>*(48 car.)* | Incorpora la marca respetando los 60 caracteres exactos. |
| `/apologetica/`<br>`src/pages/apologetica/index.astro` | `El Escudo de la Fe \| Respuestas Bíblicas a Objeciones Católicas \| Razón y Asombro`<br>*(81 car.)* | `Respuestas a Objeciones Católicas \| Razón y Asombro`<br>*(51 car.)* | Claridad doctrinal para apologética bíblica. |
| `/padre-pio/`<br>`src/pages/padre-pio/index.astro` | `San Pío de Pietrelcina: Vida, Estigmas y Espiritualidad \| Razón y Asombro`<br>*(73 car.)* | `Padre Pío: Vida, Estigmas y Fe \| Razón y Asombro`<br>*(47 car.)* | Mantiene los términos más buscados en torno al santo capuchino. |
| `/virgen-de-fatima/`<br>`src/pages/virgen-de-fatima/index.astro` | `Virgen de Fátima: Historia, Mensaje y Milagro del Sol \| Razón y Asombro`<br>*(71 car.)* | `Virgen de Fátima: Mensaje y Sol \| Razón y Asombro`<br>*(48 car.)* | Hub de apariciones de Fátima y el Milagro del Sol. |
| `/santos/`<br>`src/pages/santos/index.astro` | `Santos y Místicos de la Iglesia Católica: Fe, Ciencia y Caridad \| Razón y Asombro`<br>*(81 car.)* | `Santos y Místicos de la Iglesia \| Razón y Asombro`<br>*(48 car.)* | Hub general del santoral católico. |
| `/jesus/`<br>`src/pages/jesus/index.astro` | `Jesús y sus Enseñanzas: Evangelio y Parábolas \| Razón y Asombro`<br>*(63 car.)* | `Jesús en los Evangelios: Parábolas \| Razón y Asombro`<br>*(51 car.)* | Hub de cristología y parábolas evangélicas. |
| `/biblia/`<br>`src/pages/biblia/index.astro` | `Biblia y Conversión: Versículos por Temas Espirituales \| Razón y Asombro`<br>*(72 car.)* | `Biblia Católica: Temas y Pasajes \| Razón y Asombro`<br>*(49 car.)* | Hub de lecturas y salmos bíblicos. |
| `/consuelo/`<br>`src/pages/consuelo/index.astro` | `Consuelo Espiritual y Paz para el Alma \| Razón y Asombro`<br>*(56 car.)* | `Consuelo Espiritual y Paz Interior \| Razón y Asombro`<br>*(51 car.)* | Acompañamiento pastoral y oración en aflicción. |
| `/rosario/`<br>`src/pages/rosario/index.astro` | `Santo Rosario Interactivo con Visor Visual de Cuentas \| Razón y Asombro`<br>*(71 car.)* | `Santo Rosario Interactivo Online \| Razón y Asombro`<br>*(49 car.)* | Herramienta PWA interactiva de rezo. |

---

## 4. Edición Internacional en Inglés (`/en/`)

| Ruta / Archivo | Título Actual (Longitud) | Título Propuesto (Longitud) | Claves SEO / Criterio E-E-A-T |
| :--- | :--- | :--- | :--- |
| `/en/shroud-of-turin/`<br>`src/pages/en/shroud-of-turin.astro` | `The Shroud of Turin: STURP, Carbon-14, and Modern Scientific Studies \| Reason & Wonder`<br>*(86 car.)* | `Shroud of Turin: Science & Carbon-14 \| Reason & Wonder`<br>*(53 car.)* | Enfoque científico riguroso para SERP en idioma inglés. |
| `/en/interactive-rosary/`<br>`src/pages/en/interactive-rosary.astro` | `Interactive Catholic Rosary & Bead Visualizer \| Reason & Wonder`<br>*(63 car.)* | `Interactive Catholic Rosary \| Reason & Wonder`<br>*(45 car.)* | Herramienta devocional en inglés. |
| `/en/rosary/how-to-pray/`<br>`src/pages/en/rosary/how-to-pray.astro` | `How to Pray the Rosary Step by Step: Complete Beginner Guide \| Reason & Wonder`<br>*(78 car.)* | `How to Pray the Rosary: Guide \| Reason & Wonder`<br>*(47 car.)* | Guía para principiantes de alto volumen en EE. UU. |
| `/en/divine-mercy-chaplet/`<br>`src/pages/en/divine-mercy-chaplet.astro` | `The Chaplet of Divine Mercy: Prayers, Promises & History \| Reason & Wonder`<br>*(74 car.)* | `Divine Mercy Chaplet: Guide \| Reason & Wonder`<br>*(45 car.)* | Oración y promesas de Santa Faustina en inglés. |
