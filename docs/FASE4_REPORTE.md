# Reporte de Coherencia Editorial y Verificación — Fase 4

**Fecha de ejecución:** 2026-11-03  
**Rama de trabajo:** `fix/fase-4-coherencia`  
**Base de comparación:** `main` (commit `ebd6a9ad308efcf67571a7432a7bd7d1c2b23533`)  
**Autor:** Ingeniero de Despliegue y Control de Calidad  

---

## 1. Salida de `git diff --stat main...HEAD`

```text
 docs/COPY_ALIGNMENT.md                             |  29 +++
 docs/DEPLOY_REPORT.md                              | 223 +++++++++++++++++++++
 docs/TITLES_PROPOSED.md                            |  69 +++++++
 src/components/ui/NextStep.astro                   |  12 +-
 src/content.config.ts                              |   2 +-
 ...iterios-vaticano-apariciones-sobrenaturales.mdx |   4 +-
 src/content/ciencia-fe/lourdes-bureau-medical.mdx  |   2 +-
 src/content/ciencia-fe/sabana-santa-de-turin.mdx   |   8 +-
 .../ciencia-fe/virgen-de-guadalupe-tilma.mdx       |   2 +-
 src/content/fatima/milagro-del-sol.mdx             |   2 +-
 src/content/jesus/el-buen-samaritano.mdx           |   2 +-
 src/content/jesus/parabola-del-hijo-prodigo.mdx    |   2 +-
 .../sermon-de-la-montana-bienaventuranzas.mdx      |   2 +-
 src/content/milagros/buenos-aires.mdx              |   2 +-
 src/content/milagros/lanciano.mdx                  |   2 +-
 src/content/milagros/legnica.mdx                   |   2 +-
 src/content/milagros/sokolka.mdx                   |   2 +-
 src/content/santos/carlo-acutis.mdx                |   2 +-
 .../santos/estudios-medicos-y-santo-oficio.mdx     |   2 +-
 src/content/santos/faustina-kowalska.mdx           |   2 +-
 src/layouts/ArticleLayout.astro                    |  19 +-
 src/layouts/FactLayout.astro                       |  21 +-
 src/pages/ciencia-y-fe/[slug].astro                |   2 +-
 src/pages/en/shroud-of-turin.astro                 |   4 +-
 src/pages/index.astro                              |   8 +-
 25 files changed, 388 insertions(+), 39 deletions(-)
```

---

## 2. Sección 5.1 — Actualización de Cita Científica Freer-Waters & Jull (Sábana Santa)

- **Cita bibliográfica corregida:**
  - *Título exacto del paper:* *"Radiocarbon Dating the Shroud of Turin: A Critical Review of the 1988 Results and the Invisible Reweave Hypothesis"*
  - *Identificador de publicación:* *Radiocarbon*, Cambridge University Press, vol. 68, n. 2, art. 263 (abril de 2026).
  - *DOI:* `https://doi.org/10.1017/RDC.2025.263`
- **Ajustes en textos de ES y EN:**
  - En `src/content/ciencia-fe/sabana-santa-de-turin.mdx`: se sustituyó `"enero de 2026"` por `"abril de 2026"`.
  - En `src/pages/en/shroud-of-turin.astro`: se actualizó la referencia a *"April 2026, art. 263"*.
- > [!IMPORTANT]
  > **Revisión humana requerida:**  
  > La frase *"respaldando la integridad del análisis"* (en el resumen pericial de la datación de 1988) expresa una conclusión epistemológica sobre el debate de la muestra textil que debe ser evaluada y validada expresamente por el equipo editorial teológico-científico para garantizar la neutralidad requerida frente a las diversas escuelas de sindonología.

---

## 3. Sección 5.2 — Desacoplamiento del Pie "Tu Siguiente Paso"

Se creó una variante neutral `variant="ciencia"` en `src/components/ui/NextStep.astro`, desacoplando la afirmación sobre tejido cardíaco vivo en relicarios de aquellas páginas temáticas donde resultaba anacrónica o temáticamente impertinente.

### A. Páginas Limpiadas (No Cardíacas)
En estas páginas se sustituyó el llamado cardíaco por la invitación general al método riguroso y examen documental (`variant="ciencia"`):
1. **Sábana Santa de Turín** (`/ciencia-y-fe/sabana-santa-de-turin/`) — *Lienzo fúnebre y análisis físico-químico STURP/C14.*
2. **La Tilma de Guadalupe** (`/ciencia-y-fe/virgen-de-guadalupe-tilma/`) — *Ayate vegetal, reflectografía infrarroja y fenómeno ocular.*
3. **Bureau Médical de Lourdes** (`/ciencia-y-fe/lourdes-bureau-medical/`) — *Curaciones orgánicas y criterios clínicos de Lambertini.*
4. **Criterios del Vaticano para Apariciones** (`/ciencia-y-fe/criterios-vaticano-apariciones-sobrenaturales/`) — *Normas DDF 2024.*
5. **El Milagro del Sol** (`/virgen-de-fatima/milagro-del-sol/`) — *Fenómeno solar y testimonios históricos en Fátima.*
6. **Padre Pío: Peritajes Médicos y Santo Oficio** (`/padre-pio/estudios-medicos-y-santo-oficio/`) — *Estigmas y actas vaticanas.*

### B. Páginas Eucarísticas que Conservan el Texto Cardíaco
Las siguientes páginas corresponden estrictamente a signos eucarísticos con peritajes anatomo-patológicos de miocardio, por lo que conservan el componente `NextStep` con `variant="eucaristico"`:
1. **Signo Eucarístico de Buenos Aires (1996)** (`/milagros-eucaristicos/buenos-aires/`) — *Análisis histopatológico ciego del Dr. Frederic Zugibe.*
2. **Milagro Eucarístico de Lanciano (siglo VIII / 1970)** (`/milagros-eucaristicos/lanciano/`) — *Peritaje histológico del Prof. Odoardo Linoli.*
3. **Milagro Eucarístico de Legnica (2013)** (`/milagros-eucaristicos/legnica/`) — *Departamento de Medicina Forense de Szczecin.*
4. **Milagro Eucarístico de Sokółka (2008)** (`/milagros-eucaristicos/sokolka/`) — *Universidad Médica de Białystok (Prof. Sobaniec-Łotowska y Prof. Sulkowski).*

---

## 4. Sección 5.3 — Condición de "Revisado por" y Vaciado de Frontmatter

- Se condicionó el bloque visual y el metadato Schema.org de `"Revisado por"` en `src/layouts/ArticleLayout.astro` y `src/layouts/FactLayout.astro` mediante la función `isConcreteReviewer(val)`. Solo se renderiza cuando `reviewedBy` designa una persona o institución concreta e identificable.
- Se vació la cadena genérica `"Revisión Editorial Interna (Basada en Magisterio y Fuentes Primarias)"` de la frontmatter de los 15 archivos `.mdx` de contenido.
- Se conserva en todos ellos el valor editorial real de `lastReviewed` (o `fecha_revision`), manteniendo visible y rastreable la fecha de última auditoría editorial.

---

## 5. Sección 5.4 — Auditoría de Afirmaciones (COPY_ALIGNMENT.md)

Se generó el archivo `docs/COPY_ALIGNMENT.md` conteniendo una matriz detallada que audita las frases de la página de inicio (`src/pages/index.astro`) y de los hubs temáticos frente al contenido pericial de los artículos vinculados:
- *Infrarrojo de la NASA* frente a *Callahan & Smith (CARA, 1981)* -> MÁS FUERTE QUE EL CUERPO. Propuesta redactada sin aplicar.
- *Coincidencia biométrica 1:1* frente a *Estudios morfológicos comparativos* -> MÁS FUERTE QUE EL CUERPO. Propuesta redactada sin aplicar.
- *WAXS 2024* frente a *De Caro et al. (2022)* -> CONTRADICE. Propuesta redactada sin aplicar.
- *Refuta bacteria Serratia* frente a *Bialystok (2009)* -> OK / PRECISA. Propuesta de matiz pericial sin aplicar.
- *Regeneración ósea probada* frente a *Bureau de Lourdes (Caso Micheli)* -> MÁS FUERTE QUE EL CUERPO. Propuesta redactada sin aplicar.
- *Santidad Comprobada* frente a *Procesos de Canonización* -> MÁS FUERTE QUE EL CUERPO. Propuesta redactada sin aplicar.
- *Datos Validados* frente a *Metodología Editorial* -> OK.

---

## 6. Sección 5.5 — Limpieza de Textos Residuales en la Portada

En `src/pages/index.astro` se removieron los siguientes textos de carácter interno o técnico:
1. Se eliminó la mención interna `"de la Fase 1"` de los pilares de la publicación.
2. Se eliminó el prefijo redundante `"PWA ·"` del enlace y descripción del Santo Rosario interactivo.
3. Se eliminó la frase `"audio chime armónico"` en favor de una descripción centrada en la experiencia de oración guiada y pacífica.

---

## 7. Sección 5.6 — Auditoría de `og:image` y `twitter:image`

- **Verificación en dist/:**
  - Se analizaron los 49 archivos HTML generados en `dist/`.
  - Se localizaron 17 URLs únicas de imagen en las etiquetas `<meta property="og:image">` y `<meta name="twitter:image">`.
  - **Resultado:** 100% de las imágenes referenciadas existen físicamente en disco dentro de `dist/` y corresponden a assets procesados y versionados por Astro (directorio `_astro/`) o a imágenes estáticas globales (`og-default.jpg`, `rosario-manos-devocion.jpg`).
  - **Rutas `/assets/*.jpg` inexistentes:** 0.
  - **Errores 404 en la verificación 4b:** 0. Las consultas remotas a `https://razonyasombro.com/og-default.jpg`, `.../sabana-santa-completa.B28Uu7fz.jpg` y `.../virgen-de-guadalupe-tilma.Dquan-0r.jpg` devolvieron HTTP 200 de forma unánime.

---

## 8. Sección 5.7 — Propuesta de Títulos (TITLES_PROPOSED.md)

Se generó el documento `docs/TITLES_PROPOSED.md` con propuestas editoriales (≤ 60 caracteres) para todas las páginas cuyos títulos nativos en colecciones o páginas estáticas excedían el límite recomendado. Las propuestas preservan las palabras clave cardinales de búsqueda orgánica y los principios E-E-A-T, permaneciendo en estado de propuesta sin aplicar en el código productivo.

---

## 9. Sección 5.8 — Auditoría de Epistémica y Fuentes

### A. Listado Grep de Términos Epistémicos en `src/content/` y `src/pages/`
*(Términos auditados: comprueba, comprobad, refuta, refutación, probad, inexplicable, irrefutable, NASA, descarta)*

1. `src/content/ciencia-fe/criterios-vaticano-apariciones-sobrenaturales.mdx:110`  
   `[irrefutable]` — *"Se dicta cuando existen pruebas periciales objetivas e irrefutables de falsedad..."*
2. `src/content/ciencia-fe/lourdes-bureau-medical.mdx:3`  
   `[inexplicable]` — *"resumen: 'El Bureau des Constatations Médicales de Lourdes: el protocolo clínico más riguroso del mundo para certificar curaciones inexplicables para la ciencia.'"*
3. `src/content/ciencia-fe/lourdes-bureau-medical.mdx:12`  
   `[inexplicable]` — *"tipo_signo: 'Curaciones orgánicas instantáneas médicamente inexplicables e incorrupción corporal'"*
4. `src/content/ciencia-fe/lourdes-bureau-medical.mdx:73`  
   `[inexplicable]` — *"Para que el Bureau y el Comité Médico Internacional de Lourdes (CMIL) califiquen una curación como médicamente inexplicable..."*
5. `src/content/ciencia-fe/lourdes-bureau-medical.mdx:85`  
   `[comprobad]` — *"│ 3. Naturaleza Orgánica comprobada: Se excluyen de plano patologías │"*
6. `src/content/ciencia-fe/lourdes-bureau-medical.mdx:98`  
   `[descarta]` — *"│ controles clínicos anuales durante 5 a 15 años para descartar recidivas │"*
7. `src/content/ciencia-fe/lourdes-bureau-medical.mdx:102`  
   `[inexplicable]` — *"«Curación cierta, completa, duradera y médicamente inexplicable según los conocimientos actuales de la ciencia»..."*
8. `src/content/ciencia-fe/sabana-santa-de-turin.mdx:90`  
   `[NASA]` — *"En octubre de 1978, un equipo multidisciplinario de 33 científicos estadounidenses (muchos vinculados a la NASA, el Laboratorio Nacional de Los Álamos...)"*
9. `src/content/ciencia-fe/sabana-santa-de-turin.mdx:94`  
   `[NASA]` — *"3. Propiedad Tridimensional (VP-8): Al procesar la imagen con el analizador digital VP-8 (desarrollado por la NASA para mapear el relieve topográfico de la Luna)..."*
10. `src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx:2`  
    `[inexplicable]` — *"titulo: 'La Tilma de Guadalupe: El Ayate Incorrupto, los Pigmentos Inexplicables y el Fenómeno Ocular'"*
11. `src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx:69`  
    `[NASA]` — *"En mayo de 1979, el biofísico Dr. Philip Serna Callahan (... consultor científico independiente que había colaborado en proyectos de teledetección con la NASA)..."*
12. `src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx:71`  
    `[NASA]` — *"Aclaración institucional: Este estudio fue un proyecto de investigación independiente (...). No fue un proyecto oficial ni una publicación institucional de la agencia espacial estadounidense NASA."*
13. `src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx:133`  
    `[NASA]` — *"sin necesidad de atribuir a instituciones como la NASA afirmaciones que nunca realizaron."*
14. `src/content/fatima/milagro-del-sol.mdx:72`  
    `[descarta]` — *"descartando de plano la hipótesis de una 'alucinación colectiva' circunscrita exclusivamente al gentío reunido en el valle."*
15. `src/content/milagros/buenos-aires.mdx:87`  
    `[irrefutable]` — *"Esto es una prueba forense irrefutable de que el corazón estaba vivo y palpitando al momento de obtenerse la muestra..."*
16. `src/content/milagros/lanciano.mdx:65`  
    `[descarta]` — *"Los análisis químicos y toxicológicos descartaron de forma concluyente la presencia de sales, bálsamos..."*
17. `src/content/milagros/legnica.mdx:56`  
    `[descarta]` — *"solicitó análisis histopatológicos avanzados para descartar cualquier tipo de contaminación."*
18. `src/content/milagros/legnica.mdx:67`  
    `[descarta]` — *"Los peritajes microbiológicos de Szczecin descartaron categóricamente esta hipótesis..."*
19. `src/content/milagros/sokolka.mdx:77`  
    `[NASA]` — *"> «Incluso los científicos de la NASA con la nanotecnología más avanzada serían incapaces de entrelazar artificialmente tejido vivo de miocardio humano...»"*
20. `src/content/milagros/sokolka.mdx:88`  
    `[refuta / refutación / descarta]` — *"* **Refutación pericial:** Las pruebas microbiológicas descartaron de plano cualquier presencia de colonias de *Serratia*..."*
21. `src/content/milagros/sokolka.mdx:91`  
    `[descarta]` — *"La manipulación humana queda descartada por la penetración mutua entre las fibras musculares y el trigo."*
22. `src/content/santos/carlo-acutis.mdx:24`  
    `[inexplicable]` — *"- titulo: 'Historia clínica pericial de la curación inexplicable de Valeria Valverde'"*
23. `src/pages/biblia/el-misterio-del-sufrimiento-en-la-biblia.astro:50`  
    `[refuta]` — *"El libro de Job refuta definitivamente la idea de que todo dolor es un castigo por pecados individuales."*
24. `src/pages/biblia/el-misterio-del-sufrimiento-en-la-biblia.astro:53`  
    `[refuta]` — *"question: '¿Qué error refutan el libro de Job y las palabras de Jesús sobre la enfermedad?'"*
25. `src/pages/biblia/el-misterio-del-sufrimiento-en-la-biblia.astro:54`  
    `[refuta]` — *"answer: 'Refutan la llamada teología de la retribución mecánica...' "*
26. `src/pages/biblia/index.astro:76`  
    `[refuta / refutación]` — *"la refutación de la retribución mecánica y la teología paulina de la redención."*
27. `src/pages/en/shroud-of-turin.astro:119`  
    `[NASA]` — *"including specialists from Los Alamos National Laboratory, NASA's Jet Propulsion Laboratory..."*
28. `src/pages/index.astro:30`  
    `[comprobad]` — *"badge: 'Santidad Comprobada'"*
29. `src/pages/index.astro:221`  
    `[NASA]` — *"490 años sin descomposición de agave, examen infrarrojo de la NASA y 13 figuras en la córnea."*
30. `src/pages/index.astro:247`  
    `[probad]` — *"Regeneración ósea probada (Vittorio Micheli) e incorrupción de Santa Bernardita Soubirous."*
31. `src/pages/index.astro:260`  
    `[refuta]` — *"Microscopía electrónica de la Universidad Médica de Białystok que refuta la bacteria Serratia."*
32. `src/pages/metodologia.astro:43`  
    `[comprobad]` — *"proceden de ediciones históricas en Dominio Público comprobado..."*
33. `src/pages/santos/index.astro:21`  
    `[comprobad]` — *"badge='Santidad · Mística · Milagros Comprobados'"*

---

### B. Auditoría de Fuentes (`sources[]` / `fuentes[]`)

#### 1. Páginas con "Fuentes Primarias" en el cuerpo sin array `sources[]`
Estas páginas son de naturaleza metodológica o editorial general; exponen su compromiso con fuentes primarias en el texto explicativo pero no definen una colección de fuentes bibliográficas estructuradas en frontmatter:
- `src/content/paginas/metodologia.mdx`
- `src/pages/metodologia.astro`
- `src/pages/autor.astro`
- `src/pages/index.astro`

#### 2. Páginas con elementos en `sources[]` / `fuentes[]` que carecen de DOI o enlace URL directo
Los siguientes artículos cuentan con fuentes bibliográficas históricas o eclesiales (citadas por volumen, acta o editorial en `cita_o_referencia`) pero carecen de enlace hipertextual o identificador digital permanente (DOI):
- `src/content/ciencia-fe/lourdes-bureau-medical.mdx`: 4 de 4 fuentes sin URL/DOI (Actas del Bureau, obras de Lambertini, archivos de Lourdes).
- `src/content/ciencia-fe/sabana-santa-de-turin.mdx`: 2 de 6 fuentes sin URL/DOI (Libros de Baima Bollone y actas de STURP 1978). *(Las restantes 4 sí disponen de DOI, incluyendo Nature 1989 y Radiocarbon 2026)*.
- `src/content/ciencia-fe/virgen-de-guadalupe-tilma.mdx`: 3 de 3 fuentes sin URL/DOI (Monografía de Callahan CARA 1981, libros de Aste Tonsmann y actas de la Basílica).
- `src/content/fatima/milagro-del-sol.mdx`: 4 de 4 fuentes sin URL/DOI (Documentación Crítica de Fátima, testimonios de O Século e Ilustração Portugueza).
- `src/content/jesus/el-buen-samaritano.mdx`: 3 de 3 fuentes sin URL/DOI (Evangelio según San Lucas, comentarios patrísticos de San Agustín y Benedicto XVI *Jesús de Nazaret*).
- `src/content/jesus/parabola-del-hijo-prodigo.mdx`: 4 de 4 fuentes sin URL/DOI (San Lucas, San Jerónimo, San Juan Crisóstomo, Exhortación Reconciliatio et Paenitentia).
- `src/content/jesus/sermon-de-la-montana-bienaventuranzas.mdx`: 5 de 5 fuentes sin URL/DOI (San Mateo, Catecismo de la Iglesia Católica, encíclica Veritatis Splendor).
- `src/content/milagros/buenos-aires.mdx`: 3 de 3 fuentes sin URL/DOI (Peritaje clínico de Zugibe, informe Castañón Gómez, archivo arquidiocesano).
- `src/content/milagros/lanciano.mdx`: 2 de 3 fuentes sin URL/DOI (Actas notariales históricas de Lanciano y dictamen franciscano; el estudio médico de Linoli en *Quaderni Sclavo* sí incluye referencia formal).
- `src/content/milagros/legnica.mdx`: 3 de 3 fuentes sin URL/DOI (Comunicado de la Diócesis de Legnica, informe del Departamento de Szczecin).
- `src/content/milagros/sokolka.mdx`: 3 de 3 fuentes sin URL/DOI (Informe pericial de Białystok, comunicado del Arzobispado de Białystok).
- `src/content/santos/carlo-acutis.mdx`: 2 de 3 fuentes sin URL/DOI (Historia clínica de Valeria Valverde y decreto de virtudes de la Causa de los Santos).
- `src/content/santos/estudios-medicos-y-santo-oficio.mdx`: 4 de 4 fuentes sin URL/DOI (Peritajes de Romanelli, Festa y Bignami; decretos históricos del Santo Oficio en actas de San Giovanni Rotondo).
- `src/content/santos/faustina-kowalska.mdx`: 2 de 3 fuentes sin URL/DOI (Diario de Santa Faustina *La Divina Misericordia en mi alma*, Archivo de la Congregación).
