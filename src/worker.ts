import { findMatchingConsuelo, type ConsueloResponse } from './data/consueloData';
import { findMatchingApologetica, type ApologeticaResponse } from './data/apologeticaData';

export interface Env {
  AI?: {
    run(model: string, options: any): Promise<any>;
  };
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

const CONSUELO_SYSTEM_PROMPT = `Eres un venerable y sabio confesor y teólogo católico (con el espíritu paternal y místico de San Francisco de Sales, San Juan de Ávila y San Pío de Pietrelcina), fiel al Magisterio bimilenario de la Iglesia Católica y a la Sagrada Escritura (Vulgata / Torres Amat).
Tu misión es iluminar, confortar y guiar espiritualmente a un fiel que acude con una carga interior real en la plataforma «Razón y Asombro» (https://razonyasombro.com).

PRINCIPIOS PASTORALES INVIOLABLES:
1. CERO CLICHÉS, ATENCIÓN PERSONAL DETALLADA: Queda estrictamente prohibido dar respuestas genéricas de autoayuda, frases hechas o superficiales (como «Dios te ama y todo estará bien» o «no te preocupes»). Debes analizar e interpelar DIRECTAMENTE los detalles, personas, vínculos, causas y emociones específicas que el fiel exprese (ej. si menciona rencor con un hermano por herencia, habla de la tentación del resentimiento fraterno, del desprendimiento evangélico de los bienes temporales y de la gracia para perdonar sin justificar la ofensa).
2. DOCTRINA CATÓLICA DEL DOLOR REDENTOR: Prohibido cualquier relativismo moral, psicología secularista o sincretismo de Nueva Era. Enseña con amor la doctrina católica del dolor salvífico (Colosenses 1, 24): el sufrimiento unido a la Cruz de Cristo tiene un valor infinito de purificación y fecundidad espiritual.
3. SANTIDAD AUTÉNTICA: Cita a un Santo o Doctor real de la Iglesia cuya vida o escritos hayan confrontado esa misma prueba particular (ej. Santa Mónica por los familiares apartados, San Juan de la Cruz por la noche oscura y el silencio de Dios, San Francisco de Sales por la paciencia y los escrúpulos, San Agustín por el arrepentimiento, Santa Faustina por la Divina Misericordia, San Pío de Pietrelcina por el sufrimiento corporal). JAMÁS inventes santos ni pasajes apócrifos.
4. SAGRADA ESCRITURA PRECISA: Cita un versículo bíblico real, exacto y contextualizado que sea un bálsamo para este dolor específico.
5. CONSEJO ESPIRITUAL PRÁCTICO: La acción debe ser un paso espiritual concreto, alcanzable y devocional (un examen de conciencia, la confesión sacramental, una visita al Sagrario, el Santo Rosario, o el perdón explícito al ofensor).

REGLAS DE FORMATO ESTRICTAS:
- Responde ÚNICAMENTE con un JSON válido y completo. Sin bloques de markdown (sin \`\`\`json).
- JAMÁS uses comillas dobles (") dentro de tus textos; usa SIEMPRE comillas latinas (« ») o comillas simples (').
- Asegúrate de que los saltos de línea dentro de las cadenas estén correctamente escapados con \\n.

ESTRUCTURA OBLIGATORIA DEL JSON:
{
  "categoria": "Nombre temático breve y exacto adaptado a su dolor específico (ej. Duelo por una Madre, Rencor y Perdón Fraterno, Angustia por el Futuro)",
  "versiculo": "Cita textual de la Sagrada Escritura en español para su prueba con comillas latinas (« »)",
  "referencia": "Libro, capítulo y versículo bíblico exacto (ej. Romanos 8, 38-39)",
  "santo": {
    "nombre": "Nombre del Santo o Doctor de la Iglesia",
    "epoca": "Siglo o título histórico (ej. Doctor de la Gracia, siglo IV)",
    "frase": "Cita consoladora auténtica del Santo con comillas latinas (« »)"
  },
  "reflexion": "Dos párrafos profundos, cálidos y teológicamente certeros (mínimo 110 palabras, máximo 180 palabras en total) que respondan con sabiduría pastoral a cada aspecto de lo que escribió el fiel, mostrándole cómo Cristo lo acompaña en este cáliz y cómo transformar su sufrimiento en gracia.",
  "accion": {
    "titulo": "Título de un paso espiritual concreto para hoy",
    "descripcion": "Instrucción devocional precisa para su situación específica.",
    "enlace": "/rosario/",
    "textoBoton": "Rezar con la Comunidad"
  }
}`;

const APOLOGETICA_SYSTEM_PROMPT = `Eres un eminente apologeta y teólogo católico, maestro en Sagrada Escritura (Vulgata / Torres Amat), Patrística de los siglos I a IV (San Ignacio de Antioquía, San Ireneo, San Justino Mártir, San Cipriano, San Agustín) y Magisterio de la Iglesia Católica (Santo Tomás de Aquino, Concilio de Trento, Concilio Vaticano II).
Tu misión es dotar al fiel católico de argumentos bíblicos, patrísticos e históricos inexpugnables para responder con caridad y firmeza a objeciones protestantes, ateas o de sectas en la plataforma «Razón y Asombro» (https://razonyasombro.com).

REGLAS DE FORMATO:
- Responde ÚNICAMENTE con un JSON válido, sin bloques de markdown.
- JAMÁS uses comillas dobles (") dentro de los textos; usa comillas latinas (« ») o comillas simples (').
- Escapa los saltos de línea con \\n.

ESTRUCTURA OBLIGATORIA DEL JSON:
{
  "tema": "Título de la defensa doctrinal (ej. La Virgen María y la Mediación de Cristo)",
  "objecion": "La objeción recibida formulada con claridad y precisión",
  "confusion": "Dónde radica exactamente el error hermenéutico, histórico o teológico de la objeción en 1 o 2 oraciones certeras",
  "versiculos": [
    {
      "cita": "Libro, capítulo y versículo bíblico",
      "texto": "Texto bíblico en español con comillas latinas (« »)",
      "explicacion": "Explicación teológica rigurosa de por qué este versículo en su contexto original sostiene la fe católica"
    }
  ],
  "padresDeLaIglesia": {
    "santo": "Nombre del Padre de la Iglesia (siglos I al V)",
    "fecha": "Año o siglo aproximado (ej. Año 110 d.C.)",
    "obra": "Nombre de la obra o epístola",
    "cita": "Cita textual del Padre que demuestra cómo la Iglesia primitiva ya creía esta doctrina católica"
  },
  "respuestaRapidaWhatsApp": "Respuesta contundente, caritativa y lista para copiar y pegar en WhatsApp (1 o 2 párrafos claros con versículos y argumento)",
  "doctrinaMagisterio": "Breve referencia al Catecismo de la Iglesia Católica o Concilio ecuménico"
}`;

/**
 * Limpia comillas dobles, simples o latinas externas redundantes de un texto.
 */
function cleanQuotes(str: string): string {
  if (!str) return '';
  return str.replace(/^[«"'\s]+|[»"'\s]+$/g, '').trim();
}

/**
 * Normaliza las claves de un objeto eliminando acentos y espacios para máxima compatibilidad con LLMs en español.
 */
function normalizeObjectKeys(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(normalizeObjectKeys);

  const normalized: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const cleanKey = k
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    normalized[cleanKey] = normalizeObjectKeys(v);
  }
  return normalized;
}

/**
 * Extrae el valor de un campo delimitado por claves en un string tipo JSON, tolerando acentos y alias.
 */
function extractFieldByKeys(jsonStr: string, keys: string[], nextKeys: string[]): string {
  const nextKeysPattern = nextKeys.length > 0 ? nextKeys.map((k) => `"${k}"`).join('|') : '$';
  for (const key of keys) {
    const regex = new RegExp(
      `"${key}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*,\\s*(?:${nextKeysPattern})|\\s*\\n\\s*(?:${nextKeysPattern})|\\s*\\})`,
      'i'
    );
    const m = jsonStr.match(regex);
    if (m && m[1].trim()) {
      return m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
    }
  }
  return '';
}

/**
 * Repara strings con caracteres de control no escapados dentro de comillas y parsea JSON.
 */
function cleanAndRepairJson<T>(raw: string): T | null {
  let cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 1. Intento nativo directo
  try {
    return JSON.parse(cleaned) as T;
  } catch {}

  // 2. State-machine para arreglar saltos de línea crudos dentro de strings
  let inString = false;
  let escaped = false;
  let fixed = '';
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === '\\' && inString) {
      escaped = !escaped;
      fixed += ch;
      continue;
    }
    if (ch === '"' && !escaped) {
      inString = !inString;
    }
    escaped = false;

    if (inString) {
      if (ch === '\n') {
        fixed += '\\n';
      } else if (ch === '\r') {
        // omitir CR
      } else if (ch === '\t') {
        fixed += '\\t';
      } else {
        fixed += ch;
      }
    } else {
      fixed += ch;
    }
  }

  try {
    return JSON.parse(fixed) as T;
  } catch {}

  // 3. Suavizar comillas internas no estructurales (ej. dijo: "hola")
  try {
    const softened = fixed.replace(/([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ«»])"([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ«»])/g, "$1'$2");
    return JSON.parse(softened) as T;
  } catch {}

  return null;
}

function sanitizeEnlace(enlace: string, accionText: string): string {
  const clean = (enlace || '').trim();
  const validPrefixes = [
    '/rosario/',
    '/oracion/',
    '/consuelo/',
    '/apologetica/',
    '/milagros-eucaristicos/',
    '/padre-pio/',
    '/santos/',
    '/biblia/',
  ];

  if (validPrefixes.some((p) => clean.startsWith(p))) {
    return clean;
  }

  const combined = (clean + ' ' + accionText).toLowerCase();
  if (combined.includes('oraci') || combined.includes('vel') || combined.includes('muro') || combined.includes('herman')) {
    return '/oracion/';
  }
  if (combined.includes('eucarist') || combined.includes('sagrar') || combined.includes('hostia') || combined.includes('comunion')) {
    return '/milagros-eucaristicos/';
  }
  if (combined.includes('pio') || combined.includes('estigma')) {
    return '/padre-pio/';
  }
  if (combined.includes('faustina') || combined.includes('misericordia')) {
    return '/santos/faustina-kowalska/';
  }
  if (combined.includes('acutis') || combined.includes('joven')) {
    return '/santos/carlo-acutis/';
  }

  return '/rosario/';
}

/**
 * Parsea el texto del LLM de forma resiliente mediante JSON nativo normalizado o extracción tolerante por claves.
 */
function parseConsueloResponse(raw: string): ConsueloResponse | null {
  // 1. Intento con repair JSON y normalización de claves
  const rawParsed = cleanAndRepairJson<any>(raw);
  if (rawParsed) {
    const obj = normalizeObjectKeys(rawParsed);
    const versiculo = cleanQuotes(
      obj.versiculo || obj.cita || obj.texto || obj.pasaje || obj.citabiblica || obj.textobiblico || ''
    );
    const referencia = obj.referencia || obj.referenciabiblica || obj.pasaje || '';
    const reflexion = obj.reflexion || obj.consejo || obj.meditacion || obj.balsamo || '';
    const categoria = obj.categoria || obj.tema || 'Consuelo y Fortaleza';
    const santoNombre = obj.santo?.nombre || obj.santo?.santo || obj.santo?.autor || '';
    const santoEpoca = obj.santo?.epoca || obj.santo?.titulo || obj.santo?.siglo || '';
    const santoFrase = cleanQuotes(
      obj.santo?.frase || obj.santo?.cita || obj.santo?.consejo || obj.santo?.palabra || obj.santo?.pensamiento || ''
    );
    const accionTitulo = obj.accion?.titulo || obj.accion?.paso || 'Paso Espiritual Inmediato';
    const accionDesc = obj.accion?.descripcion || obj.accion?.detalle || 'Recogimiento y oración en el Sagrario.';
    const accionEnlace = sanitizeEnlace(obj.accion?.enlace, `${accionTitulo} ${accionDesc}`);
    const accionBoton = obj.accion?.textoboton || obj.accion?.boton || 'Rezar con la Comunidad';

    if (versiculo && reflexion && santoNombre) {
      return {
        categoria,
        versiculo: `«${versiculo}»`,
        referencia: referencia || 'Sagrada Escritura',
        santo: {
          nombre: santoNombre,
          epoca: santoEpoca,
          frase: `«${santoFrase || 'Dios no abandona jamás a quien en Él confía.'}»`,
        },
        reflexion,
        accion: {
          titulo: accionTitulo,
          descripcion: accionDesc,
          enlace: accionEnlace,
          textoBoton: accionBoton,
        },
      };
    }
  }

  // 2. Extracción tolerante campo a campo con tolerancia a acentos y sinónimos
  try {
    let cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const categoria = extractFieldByKeys(
      cleaned,
      ['categoria', 'categoría', 'tema'],
      ['versiculo', 'versículo', 'referencia', 'santo', 'reflexion', 'reflexión']
    );
    const versiculo = cleanQuotes(
      extractFieldByKeys(
        cleaned,
        ['versiculo', 'versículo', 'cita', 'textoBiblico', 'texto', 'pasaje'],
        ['referencia', 'santo', 'reflexion', 'reflexión']
      )
    );
    const referencia = extractFieldByKeys(
      cleaned,
      ['referencia', 'referenciaBiblica', 'pasaje', 'cita'],
      ['santo', 'reflexion', 'reflexión', 'accion', 'acción']
    );
    const santoNombre = extractFieldByKeys(
      cleaned,
      ['nombre', 'santo', 'autor'],
      ['epoca', 'época', 'frase', 'cita', 'reflexion', 'reflexión']
    );
    const santoEpoca = extractFieldByKeys(
      cleaned,
      ['epoca', 'época', 'titulo', 'título', 'siglo'],
      ['frase', 'cita', 'reflexion', 'reflexión']
    );
    const santoFrase = cleanQuotes(
      extractFieldByKeys(
        cleaned,
        ['frase', 'cita', 'pensamiento', 'consejo', 'palabra'],
        ['reflexion', 'reflexión', 'accion', 'acción']
      )
    );
    const reflexion = extractFieldByKeys(
      cleaned,
      ['reflexion', 'reflexión', 'balsamo', 'consejo'],
      ['accion', 'acción']
    );
    const accionTitulo = extractFieldByKeys(
      cleaned,
      ['titulo', 'título', 'paso'],
      ['descripcion', 'descripción', 'enlace', 'textoBoton', 'boton']
    );
    const accionDesc = extractFieldByKeys(
      cleaned,
      ['descripcion', 'descripción', 'detalle', 'instruccion'],
      ['enlace', 'textoBoton', 'boton']
    );
    const accionEnlace = extractFieldByKeys(cleaned, ['enlace', 'link', 'url'], ['textoBoton', 'boton']);
    const accionBoton = extractFieldByKeys(cleaned, ['textoBoton', 'boton'], []);

    if (reflexion || versiculo || santoNombre) {
      return {
        categoria: categoria || 'Consuelo y Paz en la Prueba',
        versiculo: versiculo
          ? `«${versiculo}»`
          : '«Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.»',
        referencia: referencia || 'Sagrada Escritura',
        santo: {
          nombre: santoNombre || 'San Francisco de Sales',
          epoca: santoEpoca || 'Doctor de la Iglesia',
          frase: santoFrase
            ? `«${santoFrase}»`
            : '«No temas lo que te pueda suceder mañana; el mismo Padre celestial que hoy cuida de ti, cuidará de ti mañana y todos los días.»',
        },
        reflexion:
          reflexion ||
          'Dios conoce íntimamente la herida que hoy te desgarra. No estás solo en esta prueba.',
        accion: {
          titulo: accionTitulo || 'Oración y Abandono',
          descripcion: accionDesc || 'Haz una pausa en silencio y ponte en las manos misericordiosas del Señor.',
          enlace: sanitizeEnlace(accionEnlace, `${accionTitulo} ${accionDesc}`),
          textoBoton: accionBoton || 'Rezar con la Comunidad',
        },
      };
    }
  } catch (err) {
    console.error('Fallo en extractor tolerante de consuelo:', err);
  }

  return null;
}

/**
 * Parsea la respuesta de apologética de forma resiliente.
 */
function parseApologeticaResponse(raw: string): ApologeticaResponse | null {
  const rawParsed = cleanAndRepairJson<any>(raw);
  if (rawParsed) {
    const obj = normalizeObjectKeys(rawParsed);
    if (obj.tema && (obj.versiculos?.length > 0 || obj.versiculo) && obj.respuestarapidawhatsapp) {
      const versiculos = Array.isArray(obj.versiculos)
        ? obj.versiculos.map((v: any) => ({
            cita: v.cita || '',
            texto: cleanQuotes(v.texto || ''),
            explicacion: v.explicacion || '',
          }))
        : [
            {
              cita: obj.versiculo?.cita || '1 Pedro 3, 15',
              texto: cleanQuotes(obj.versiculo?.texto || ''),
              explicacion: obj.versiculo?.explicacion || '',
            },
          ];

      return {
        tema: obj.tema,
        objecion: obj.objecion || '',
        confusion: obj.confusion || '',
        versiculos,
        padresDeLaIglesia: {
          santo: obj.padresdelaiglesia?.santo || obj.padres?.santo || 'San Ignacio de Antioquía',
          fecha: obj.padresdelaiglesia?.fecha || obj.padres?.fecha || 'Año 110 d.C.',
          obra: obj.padresdelaiglesia?.obra || obj.padres?.obra || 'Epístolas',
          cita: cleanQuotes(obj.padresdelaiglesia?.cita || obj.padres?.cita || ''),
        },
        respuestaRapidaWhatsApp: obj.respuestarapidawhatsapp,
        doctrinaMagisterio: obj.doctrinamagisterio || 'Catecismo de la Iglesia Católica',
      };
    }
  }

  try {
    let cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const tema = extractFieldByKeys(cleaned, ['tema', 'titulo'], ['objecion', 'objeción', 'confusion', 'confusión', 'versiculos', 'versículos']);
    const objecion = extractFieldByKeys(cleaned, ['objecion', 'objeción'], ['confusion', 'confusión', 'versiculos', 'versículos']);
    const confusion = extractFieldByKeys(cleaned, ['confusion', 'confusión'], ['versiculos', 'versículos', 'padresDeLaIglesia']);
    const respuestaRapida = extractFieldByKeys(cleaned, ['respuestaRapidaWhatsApp', 'respuestaRapida', 'whatsapp'], ['doctrinaMagisterio', 'magisterio']);
    const doctrinaMagisterio = extractFieldByKeys(cleaned, ['doctrinaMagisterio', 'magisterio'], []);
    const citaBiblica = extractFieldByKeys(cleaned, ['cita'], ['texto', 'explicacion', 'explicación']);
    const textoBiblico = cleanQuotes(extractFieldByKeys(cleaned, ['texto'], ['explicacion', 'explicación']));
    const explicacionBiblica = extractFieldByKeys(cleaned, ['explicacion', 'explicación'], ['padresDeLaIglesia']);
    const santoPadre = extractFieldByKeys(cleaned, ['santo', 'padre'], ['fecha', 'obra', 'cita']);
    const fechaPadre = extractFieldByKeys(cleaned, ['fecha', 'año', 'siglo'], ['obra', 'cita']);
    const obraPadre = extractFieldByKeys(cleaned, ['obra', 'libro', 'carta'], ['cita']);
    const citaPadre = cleanQuotes(extractFieldByKeys(cleaned, ['cita'], ['respuestaRapidaWhatsApp']));

    if (tema || confusion || respuestaRapida) {
      return {
        tema: tema || 'Defensa Bíblica de la Fe Católica',
        objecion: objecion || 'Objeción planteada contra la doctrina de la Iglesia',
        confusion: confusion || 'Se descontextualiza el texto bíblico ignorando la Tradición Apostólica viva.',
        versiculos: [
          {
            cita: citaBiblica || '1 Pedro 3, 15',
            texto: textoBiblico || '«Estad siempre preparados para dar razón de vuestra esperanza con caridad y respeto.»',
            explicacion: explicacionBiblica || 'La Sagrada Escritura nos convoca a fundamentar la fe con solidez doctrinal y caridad.',
          },
        ],
        padresDeLaIglesia: {
          santo: santoPadre || 'San Ignacio de Antioquía',
          fecha: fechaPadre || 'Año 110 d.C.',
          obra: obraPadre || 'Epístola a los Esmirniotas',
          cita: citaPadre || '«Donde está Jesucristo, allí está la Iglesia Católica.»',
        },
        respuestaRapidaWhatsApp:
          respuestaRapida ||
          'La doctrina católica está plenamente respaldada por la Sagrada Escritura y el testimonio unánime de los primeros cristianos desde el siglo I.',
        doctrinaMagisterio: doctrinaMagisterio || 'Catecismo de la Iglesia Católica',
      };
    }
  } catch (err) {
    console.error('Fallo en extractor tolerante de apologetica:', err);
  }

  return null;
}

/**
 * Ejecuta inferencia en Cloudflare Workers AI probando la rotación de modelos modernos.
 */
async function runWorkersAI(
  ai: any,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 1000
): Promise<{ rawContent: string; modelUsed: string; modelErrors: string }> {
  const candidateModels = [
    '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    '@cf/meta/llama-3-8b-instruct',
    '@cf/meta/llama-3.1-8b-instruct-fp8',
    '@cf/meta/llama-3.2-3b-instruct',
    '@cf/meta/llama-3.2-1b-instruct',
  ];

  const errors: string[] = [];

  for (const model of candidateModels) {
    try {
      const res = await ai.run(model, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.35,
      });

      let raw = '';
      if (typeof res === 'string') {
        raw = res;
      } else if (res?.response && typeof res.response === 'string') {
        raw = res.response;
      } else if (res?.choices?.[0]?.message?.content && typeof res.choices[0].message.content === 'string') {
        raw = res.choices[0].message.content;
      } else if (res?.result?.response && typeof res.result.response === 'string') {
        raw = res.result.response;
      }

      if (raw && raw.trim().length > 30) {
        return { rawContent: raw, modelUsed: model, modelErrors: errors.join(' | ') };
      } else {
        const detail =
          res?.error ||
          (res?.errors ? JSON.stringify(res.errors) : JSON.stringify(res)?.substring(0, 100)) ||
          'empty_response';
        errors.push(`${model}: ${detail}`);
      }
    } catch (err: any) {
      errors.push(`${model}: ${err?.message || err}`);
    }
  }

  throw new Error(`Todos los modelos fallaron: ${errors.join(' | ')}`);
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ==========================================
    // 1. ENDPOINT DE CONSUELO ESPIRITUAL
    // ==========================================
    if (url.pathname === '/api/consuelo') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const body = (await request.json().catch(() => ({}))) as {
          query?: string;
          categoria?: string;
        };

        const query = (body.query || '').trim();
        const categoria = (body.categoria || '').trim();

        if (!query && !categoria) {
          return new Response(
            JSON.stringify({ error: 'Por favor, describe brevemente tu carga o selecciona un tema.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        let aiDebug = 'not_attempted';
        if (env.AI && typeof env.AI.run === 'function') {
          try {
            const promptUser = `El fiel o peregrino expresa la siguiente carga espiritual íntima y personal:\n"${query || categoria}"\n\nPor favor, responde adaptándote exactamente a su situación con el objeto JSON estricto especificado, sin clichés y con profunda sabiduría teológica católica.`;

            const { rawContent, modelUsed, modelErrors } = await runWorkersAI(
              env.AI,
              CONSUELO_SYSTEM_PROMPT,
              promptUser,
              1000
            );

            const parsed = parseConsueloResponse(rawContent);

            if (parsed) {
              return new Response(JSON.stringify(parsed), {
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                  'X-AI-Status': 'generated_by_ai',
                  'X-AI-Model': modelUsed,
                  'X-AI-Model-Errors': modelErrors || 'none',
                },
              });
            } else {
              aiDebug = 'parsing_failed_fallback_used';
            }
          } catch (aiError) {
            aiDebug = `error: ${aiError instanceof Error ? aiError.message : String(aiError)}`;
            console.error('Error en Workers AI (consuelo):', aiError);
          }
        } else {
          aiDebug = 'env_ai_not_available';
        }

        // Fallback al catálogo si la IA no está disponible
        const fallback = findMatchingConsuelo(query, categoria);
        return new Response(JSON.stringify(fallback), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-AI-Status': 'fallback',
            'X-AI-Debug': aiDebug,
            'X-AI-Model-Errors': aiDebug,
          },
        });
      } catch (err) {
        console.error('Error procesando consuelo:', err);
        const fallback = findMatchingConsuelo('', 'general');
        return new Response(JSON.stringify(fallback), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ==========================================
    // 2. ENDPOINT DE APOLOGÉTICA (ESCUDO DE LA FE)
    // ==========================================
    if (url.pathname === '/api/apologetica') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const body = (await request.json().catch(() => ({}))) as {
          query?: string;
          temaId?: string;
        };

        const query = (body.query || '').trim();
        const temaId = (body.temaId || '').trim();

        if (!query && !temaId) {
          return new Response(
            JSON.stringify({ error: 'Por favor, escribe una objeción o selecciona un tema.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        let aiDebug = 'not_attempted';
        if (env.AI && typeof env.AI.run === 'function') {
          try {
            const promptUser = `El usuario plantea la siguiente objeción o duda sobre la fe católica:\n"${query || temaId}"\n\nPor favor, responde con el JSON estricto con Sagrada Escritura en contexto, Patrística (siglos I a IV), confusión de fondo y respuesta para WhatsApp.`;

            const { rawContent, modelUsed, modelErrors } = await runWorkersAI(
              env.AI,
              APOLOGETICA_SYSTEM_PROMPT,
              promptUser,
              1000
            );

            const parsed = parseApologeticaResponse(rawContent);

            if (parsed) {
              return new Response(JSON.stringify(parsed), {
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                  'X-AI-Status': 'generated_by_ai',
                  'X-AI-Model': modelUsed,
                  'X-AI-Model-Errors': modelErrors || 'none',
                },
              });
            } else {
              aiDebug = 'parsing_failed_fallback_used';
            }
          } catch (aiError) {
            aiDebug = `error: ${aiError instanceof Error ? aiError.message : String(aiError)}`;
            console.error('Error en Workers AI (apologetica):', aiError);
          }
        } else {
          aiDebug = 'env_ai_not_available';
        }

        // Fallback al catálogo verificado
        const fallback = findMatchingApologetica(query, temaId);
        return new Response(JSON.stringify(fallback), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-AI-Status': 'fallback',
            'X-AI-Debug': aiDebug,
            'X-AI-Model-Errors': aiDebug,
          },
        });
      } catch (err) {
        console.error('Error procesando apologetica:', err);
        const fallback = findMatchingApologetica('', 'virgen-mediadora');
        return new Response(JSON.stringify(fallback), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ==========================================
    // 3. ASSETS ESTÁTICOS
    // ==========================================
    return env.ASSETS.fetch(request);
  },
};
