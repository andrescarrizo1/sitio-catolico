# SISTEMA INTEGRAL DE ANALÍTICA DIGITAL, SEARCH CONSOLE Y GROWTH
**Publicación:** [Razón y Asombro](https://razonyasombro.com)  
**Rol:** Director de Analítica Digital y Crecimiento (Growth)  
**Estado de Conexión:**
- **Google Analytics 4 (GA4):** ✅ Código de medición configurado e inyectado (`G-H1RZ545XS3`) con capa de privacidad estricta y auto-tracking de eventos.
- **Google Search Console (GSC):** ⚠️ Pendiente de verificación de propiedad en el panel de Google (vía registro DNS TXT o meta tag `google-site-verification`).

---

## 1. Arquitectura de Medición en Google Analytics 4 (GA4)

### A. Id de Medición y Protección de Privacidad
- **Measurement ID:** `G-H1RZ545XS3` (configurable también por variable de entorno `PUBLIC_GA_MEASUREMENT_ID`).
- **Filtrado de Desarrollo:** Se bloquea la transmisión en entornos `localhost` y `127.0.0.1` para no contaminar los datos reales con pruebas técnicas.
- **Sanitización Estricta Libre de PII (Personally Identifiable Information):**
  - La función global `window.trackGAEvent(name, params)` analiza todos los parámetros y elimina automáticamente cualquier texto con formato de correo electrónico (`[REDACTED_PII]`) o cadenas de consulta que contengan nombres personales.
- **Configuración de Privacidad Cristiana:**
  ```javascript
  gtag('config', gaId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    restricted_data_processing: true,
    send_page_view: true
  });
  ```

---

### B. Taxonomía de Eventos Implementados

| Evento GA4 | Dónde se Dispara | Parámetros Enviados | Control de Duplicación |
| :--- | :--- | :--- | :--- |
| `page_view` | Automático en cada carga de URL | `page_location`, `page_title`, `language` | 1 por carga estática |
| `scroll` | Al desplazarse por artículos largos | `percent_scrolled: 50` y `percent_scrolled: 90` | Banderas booleanas en memoria; máximo 1 de cada una por página |
| `rosary_start` | Al avanzar la primera cuenta en el Rosario interactivo | `prayer_type: 'rosario'`, `mystery_key`, `language` | Flag `hasTrackedStart`; solo 1 por sesión de rezo |
| `rosary_complete` | Al terminar el 5º misterio y entrar en la Salve / Letanías | `prayer_type: 'rosario'`, `mystery_key`, `language` | Solo al completar las 5 decenas |
| `chaplet_start` | Al iniciar la Coronilla de la Divina Misericordia | `mode: 'interactive' \| 'reading'` | Flag `hasTrackedStart`; solo 1 por rezo |
| `chaplet_complete`| Al terminar las 5 decenas y el triple *Santo Dios* | `mode: 'interactive' \| 'reading'` | Solo al alcanzar la pantalla conclusiva |
| `share` | Al pulsar Compartir en WhatsApp, Telegram, Copiar Enlace o Web Share | `method: 'whatsapp' \| 'telegram' \| 'copy_link' \| 'web_share'`, `content_type: 'article'`, `item_id` | Al hacer clic consciente |
| `file_download` | Al pulsar «Imprimir / Guardar en PDF» en Salmos o Estudios | `file_name`, `file_extension: 'pdf'` | Al disparar la acción de impresión |
| `donation_click` | Al pulsar en enlaces de Monedita, Cafecito, BMC, Ko-fi o PayPal | `provider: 'monedita_mercadopago' \| 'paypal' \| ...`, `link_url` | Delegación de eventos en elementos con `data-analytics-donation` |

---

## 2. Google Search Console: Diagnóstico Técnico y Verificación

### A. Estado de Conexión Real
> **Aviso de Integridad Analítica:**  
> Al tratarse de un entorno de código estático local sin credenciales de API de Google Search Console conectadas, no se fabrican métricas simuladas de impresiones o clics diarios. La auditoría se realiza sobre los requisitos técnicos de indexabilidad del sitio.

### B. Elementos Auditados y Verificados
1. **Sitemap XML Canónico:**
   - Ubicación: `https://razonyasombro.com/sitemap-index.xml`
   - Archivo secundario: `https://razonyasombro.com/sitemap-0.xml`
   - Contenido: **46 URLs canónicas indexables** (excluye correctamente la página de error `404.html`, la vista de embed y las redirecciones).
2. **Directiva Robots.txt:**
   - Servida en `https://razonyasombro.com/robots.txt`
   - Permite el rastreo total (`User-agent: * Allow: /`) en producción y enlaza el sitemap.
3. **Verificación de Propiedad:**
   - **Opción recomendada (Nivel Dominio en Cloudflare DNS):** Añadir un registro `TXT` en Cloudflare con el valor provisto por Search Console (`google-site-verification=...`).
   - **Opción alternativa (Meta Tag en HTML):** El archivo `BaseHead.astro` ya incluye el soporte nativo para la variable de entorno `PUBLIC_GSC_VERIFICATION`.

---

## 3. Cuadro de Mando Operativo (Dashboard Visual)

A continuación se define la estructura del cuadro de mando mensual para Razón y Asombro:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   RAZÓN Y ASOMBRO · DASHBOARD DE CRECIMIENTO            │
│  Período: Últimos 30 días       Estado GSC: [Pendiente de Conexión]    │
├───────────────────┬────────────────────┬─────────────────┬─────────────┤
│ 1. Sesiones       │ 2. Usuarios        │ 3. Duración Med │ 4. Scroll90 │
│    [Dato GA4]     │    [Dato GA4]      │    [Dato GA4]   │    [%]      │
├───────────────────┴────────────────────┴─────────────────┴─────────────┤
│ 5. Rendimiento de Herramientas de Oración                              │
│    - Rosario Interactivo Iniciado (rosary_start):    [Conteo GA4]      │
│    - Rosario Completado (rosary_complete):           [Conteo GA4]      │
│    - Ratio de Finalización del Rosario:              [% Conversión]    │
│    - Coronilla de la Misericordia Iniciada:          [Conteo GA4]      │
│    - Coronilla Completada:                           [Conteo GA4]      │
├────────────────────────────────────────────────────────────────────────┤
│ 6. Artículos y Expedientes Más Consultados                             │
│    1. /santos/carlo-acutis/                          [Vistas / Tiempo] │
│    2. /ciencia-y-fe/sabana-santa-de-turin/           [Vistas / Tiempo] │
│    3. /biblia/salmo-91-oracion-de-proteccion/        [Vistas / Tiempo] │
│    4. /milagros-eucaristicos/buenos-aires/           [Vistas / Tiempo] │
│    5. /rosario/misterios-dolorosos/                  [Vistas / Tiempo] │
├────────────────────────────────────────────────────────────────────────┤
│ 7. Búsquedas Orgánicas Principales (Google Search Console)             │
│    - Consultas Top:        [Requiere vincular Search Console]          │
│    - Impresiones Totales:  [Requiere vincular Search Console]          │
│    - Clics Totales:        [Requiere vincular Search Console]          │
│    - CTR Promedio:         [Requiere vincular Search Console]          │
├────────────────────────────────────────────────────────────────────────┤
│ 8. Difusión y Conversiones Fraternales                                 │
│    - Veces Compartido (WhatsApp / Telegram / Link):  [Conteo GA4]      │
│    - Descargas / Impresión de Salmos en PDF:         [Conteo GA4]      │
│    - Clics en Ofrenda Voluntaria (donation_click):   [Conteo GA4]      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Protocolo Semanal de Decisiones Editoriales Basadas en Datos

Para evitar cambios apresurados basados en fluctuaciones de un solo día, el equipo editorial sigue una **revisión cíclica de 14 a 28 días**:

### Las 6 Preguntas Rectoras de la Reunión Semanal:

1. **¿Qué creció?**
   - Identificar qué artículos han recibido un incremento de impresiones de más del 15%.
   - *Acción:* Revisar si los enlaces internos hacia oraciones o devociones relacionadas están optimizados.
2. **¿Qué cayó?**
   - Detectar si algún artículo clave perdió posiciones medias en Google Search Console.
   - *Acción:* Comprobar si Google actualizó sus SERPs con nuevas fuentes o si la competencia publicó contenidos más exhaustivos.
3. **¿Qué artículos funcionan como "anclas"?**
   - Son páginas con alto tiempo medio de lectura ($\ge 3$ minutos) y scroll del 90%.
   - *Acción:* Mantener su integridad y utilizarlos para enlazar a contenidos nuevos de la misma temática.
4. **¿Qué oportunidades de "Fruta Madura" (*Low-Hanging Fruits*) aparecen?**
   - Términos en Search Console con alta cantidad de impresiones pero posición entre 8 y 15 con CTR $< 3\%$.
   - *Acción:* Optimizar el `title` y la `meta description` para hacerlos más atractivos y responder con mayor precisión a la intención de búsqueda.
5. **¿Qué contenido requiere actualización bibliográfica?**
   - Artículos con caídas de retención o donde surgieron nuevos peritajes o documentos eclesiales (ej. nuevas normas de apariciones 2024).
6. **¿Qué nuevo artículo del calendario conviene redactar a continuación?**
   - Seleccionar el siguiente tema del ranking de palabras clave de alta demanda (ej. Salmo 121, Letanías Lauretanas, o Milagro de Siena).
