# Benchmarks de Diseño y Patrones Visuales (2026)

Este documento analiza cinco referencias de vanguardia en diseño editorial y plataformas católicas/culturales modernas, extrayendo los patrones visuales y de interacción que aplicaremos para lograr un producto digno, solemne, ultra-rápido y visualmente memorable.

---

## 1. Análisis de Referentes Seleccionados

### 1. *Word on Fire* (Bishop Robert Barron)
* **URL:** `https://www.wordonfire.org/`
* **Puntos Fuertes:**
  * Uso magistral de la belleza como primer camino de evangelización (*via pulchritudinis*).
  * Tratamiento de obras de arte sacro clásico con encuadres fotográficos de alta resolución, fondos oscuros y tipografías romanas de gran porte.
  * Jerarquía clara entre el contenido audiovisual y el ensayo teológico.
* **Patrones a Adoptar:**
  * Tratamiento de imágenes de arte sacro: marcos sutiles con bordes dorados tenues, fondos marfil en modo claro y azul tinta en modo oscuro, sin elementos distractores alrededor.

### 2. *The Pillar* (Periodismo Católico de Investigación)
* **URL:** `https://www.pillarcatholic.com/`
* **Puntos Fuertes:**
  * Máxima sobriedad tipográfica y ausencia total de adornos superfluos.
  * Enfoque centrado en la credibilidad de la palabra escrita, lectura inmersiva con ancho de columna contenido (~65 caracteres por línea) para evitar fatiga ocular.
  * Citas de documentos y fuentes dispuestas como notas editoriales destacadas al margen o en cajas de texto sobrias.
* **Patrones a Adoptar:**
  * Ancho de lectura editorial (`max-w-prose` o ~68ch) para artículos doctrinales y exégesis bíblica.
  * Cajas de fuentes primarias (`<SourceList />`) con enlaces directos y tipografía mono/sans de alta precisión documental.

### 3. *Hallow* (Aplicación de Oración y Meditación Católica)
* **URL:** `https://hallow.com/`
* **Puntos Fuertes:**
  * Experiencia de modo oscuro excepcional: no utiliza negro puro (`#000000`), sino tonos pizarra y azul medianoche profundo que transmiten serenidad y recogimiento.
  * Micro-interacciones suaves y transiciones calmadas diseñadas para no alterar el estado de oración.
  * Tipografías con serifas humanísticas muy cálidas combinadas con botones táctiles claros y generosos.
* **Patrones a Adoptar:**
  * Interfaz del **Rosario Interactivo**: modo nocturno diseñado para la oración antes de dormir o en capillas en penumbra.
  * Respuesta háptica sutil y progreso visual de las cuentas sin animaciones bruscas.

### 4. *Aeon / Psyche* (Ensayos de Filosofía y Cultura Digital)
* **URL:** `https://aeon.co/`
* **Puntos Fuertes:**
  * Referente mundial en diseño editorial para lectura larga en dispositivos móviles.
  * Tipografía fluida con `clamp()` que ajusta milimétricamente el interlineado y el tamaño de fuente según el ancho de pantalla del dispositivo.
  * Menús discretos que no invaden la lectura.
* **Patrones a Adoptar:**
  * Sistema de escala tipográfica fluida sin saltos abruptos de breakpoint en Tailwind.
  * Cabecera flotante limpia con selector de tema (claro/oscuro) y barra sutil de progreso de lectura.

### 5. *DigiVatLib — Biblioteca Apostólica Vaticana Digital & Archivio Apostolico Vaticano*
* **URLs Verificadas:**
  * Catálogo Digital de Manuscritos Vaticanos: `https://digi.vatlib.it/`
  * Portal del Archivo Apostólico: `https://www.archivioapostolicovaticano.va/`
* **Puntos Fuertes:**
  * Sensación de archivo histórico y autoridad documental inmutable.
  * Fichas de catalogación nítidas: código de fondo, signatura, fecha, sello eclesiástico, transcripción paleográfica.
* **Patrones a Adoptar:**
  * Componente `<FactSheet />` para los Milagros Eucarísticos y Fátima: presentación tipo "Ficha de Archivo Diocesano / Forense", que inspira seriedad inmediata frente a blogs devocionales descuidados.

---

## 2. Paleta de Color y Tokens de Diseño

| Token | Hex / Valor | Uso Principal |
| :--- | :--- | :--- |
| `--color-tinta-950` | `#0B132B` | Fondo en Modo Oscuro / Tipografía principal en Modo Claro |
| `--color-tinta-900` | `#1C2541` | Superficies de tarjetas en Modo Oscuro |
| `--color-marfil-50` | `#FAF8F5` | Fondo general en Modo Claro (cálido, evita el blanco clínico) |
| `--color-marfil-100` | `#F3EFE6` | Tarjetas y bloques en Modo Claro |
| `--color-oro-600` | `#C5A059` | Acentos sobrios, filetes ornamentales sutiles, cuentas del Rosario |
| `--color-oro-400` | `#DFBA73` | Acento brillante en Modo Oscuro |
| `--color-azul-mariano` | `#1D4ED8` | Enlaces, insignias de la Virgen de Fátima y llamados a la acción |
| `--color-carmesí-pasion` | `#991B1B` | Distintivo eucarístico (Sangre de Cristo, sacrificio) |

---

## 3. Tipografía y Jerarquía

* **Titulares (`font-serif`):**
  * Familia: `Cinzel` o `Playfair Display` (autohospedada en WOFF2, con subconjunto optimizado para español).
  * Carácter: Esculpido, clásico, digno de frontispicios de basílicas romanas.
* **Texto de Lectura (`font-body`):**
  * Familia: `Lora` o `Source Serif 4` (autohospedada, excelente rendimiento a 18px en móvil).
  * Altura de línea: `leading-relaxed` (1.75).
* **Interfaz y Metadatos (`font-sans`):**
  * Familia: `Inter` o `Plus Jakarta Sans` para etiquetas, navegación, tablas y badges de estado eclesial.

---

## 4. Anti-Patrones Estrictamente Prohibidos

1. ❌ **Kitsch devocional:** Prohibidos GIFs animados de velas encendidas, palomas doradas flotantes o destellos centelleantes.
2. ❌ **Gradientes neón o estéticas SaaS genéricas:** Nada de morados fluorescentes ni sombras exageradas tipo "startup de Silicon Valley".
3. ❌ **Pop-ups invasivos:** Prohibidos modales de suscripción a newsletter o interrupciones durante la lectura o el rezo.
4. ❌ **Rostros de Jesús, María o Santos generados por IA:** Prohibidos categóricamente. Únicamente arte sacro histórico de dominio público y fotografías reales verificadas en `LICENCIAS.md`.
5. ❌ **Banners de cookies innecesarios:** El sitio no recopila datos de rastreo de terceros; el estado del tema y del Rosario se guarda en el navegador del usuario (`localStorage`). Cero necesidad de carteles legales que bloqueen la vista.
