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
 * Extrae el valor de un campo delimitado por claves en un string tipo JSON.
 */
function extractFieldByKey(jsonStr: string, key: string, nextKeys: string[]): string {
  const nextKeysPattern = nextKeys.length > 0 ? nextKeys.map((k) => `"${k}"`).join('|') : '$';
  const regex = new RegExp(
    `"${key}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*,\\s*(?:${nextKeysPattern})|\\s*\\n\\s*(?:${nextKeysPattern})|\\s*\\})`,
    'i'
  );
  const m = jsonStr.match(regex);
  if (m) {
    return m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
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
 * Parsea el texto del LLM de forma resiliente mediante JSON nativo o extracción tolerante por claves.
 */
function parseConsueloResponse(raw: string): ConsueloResponse | null {
  // 1. Intento con repair JSON
  const parsed = cleanAndRepairJson<ConsueloResponse>(raw);
  if (parsed && parsed.versiculo && parsed.reflexion && parsed.santo?.nombre) {
    if (parsed.accion) {
      parsed.accion.enlace = sanitizeEnlace(parsed.accion.enlace, `${parsed.accion.titulo} ${parsed.accion.descripcion}`);
      if (!parsed.accion.textoBoton) {
        parsed.accion.textoBoton = 'Rezar con la Comunidad';
      }
    }
    return parsed;
  }

  // 2. Extracción tolerante campo a campo
  try {
    let cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const categoria = extractFieldByKey(cleaned, 'categoria', ['versiculo', 'referencia', 'santo', 'reflexion']);
    const versiculo = extractFieldByKey(cleaned, 'versiculo', ['referencia', 'santo', 'reflexion']);
    const referencia = extractFieldByKey(cleaned, 'referencia', ['santo', 'reflexion', 'accion']);
    const santoNombre = extractFieldByKey(cleaned, 'nombre', ['epoca', 'frase', 'reflexion']);
    const santoEpoca = extractFieldByKey(cleaned, 'epoca', ['frase', 'reflexion']);
    const santoFrase = extractFieldByKey(cleaned, 'frase', ['reflexion', 'accion']);
    const reflexion = extractFieldByKey(cleaned, 'reflexion', ['accion']);
    const accionTitulo = extractFieldByKey(cleaned, 'titulo', ['descripcion', 'enlace', 'textoBoton']);
    const accionDesc = extractFieldByKey(cleaned, 'descripcion', ['enlace', 'textoBoton']);
    const accionEnlace = extractFieldByKey(cleaned, 'enlace', ['textoBoton']);
    const accionBoton = extractFieldByKey(cleaned, 'textoBoton', []);

    if (reflexion || versiculo || santoNombre) {
      return {
        categoria: categoria || 'Consuelo y Paz en la Prueba',
        versiculo:
          versiculo ||
          '«Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. Llevad mi yugo sobre vosotros y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.»',
        referencia: referencia || 'San Mateo 11, 28-29',
        santo: {
          nombre: santoNombre || 'San Francisco de Sales',
          epoca: santoEpoca || 'Doctor de la Iglesia y Maestro Espiritual',
          frase:
            santoFrase ||
            '«No temas lo que te pueda suceder mañana; el mismo Padre celestial que hoy cuida de ti, cuidará de ti mañana y todos los días. O bien te librará del sufrimiento, o bien te dará una fuerza invencible para soportarlo.»',
        },
        reflexion:
          reflexion ||
          'Hijo mío en Cristo: en los momentos en que la prueba arrecia y el alma parece sumergirse en la confusión o en el abatimiento, recuerda que el Señor no está ausente de tu barca. El silencio de Dios no es abandono, sino una invitación a purificar tu esperanza y a fundar tu paz, no en las circunstancias mudables del mundo, sino en la fidelidad inquebrantable de Su amor divino.\\n\\nUne en este instante tu aflicción al Corazón traspasado de Jesús en el Calvario. Ninguna lágrima ofrecida con fe se pierde jamás; en el plan de la Redención, el dolor abrazado con Cristo se transforma en fuente inagotable de gracia, santificación y vida eterna para ti y para aquellos por quienes intercedes.',
        accion: {
          titulo: accionTitulo || 'Oración de Abandono y Sagrario',
          descripcion:
            accionDesc ||
            'Haz una pausa en silencio y repite lentamente: «Jesús, en Ti confío, me entrego a Ti, haz Tú de mí según Tu santa voluntad». Te invitamos a acompañar tu paz rezando con nosotros el Santo Rosario.',
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
  const parsed = cleanAndRepairJson<ApologeticaResponse>(raw);
  if (parsed && parsed.tema && parsed.versiculos?.length > 0 && parsed.respuestaRapidaWhatsApp) {
    return parsed;
  }

  try {
    let cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const tema = extractFieldByKey(cleaned, 'tema', ['objecion', 'confusion', 'versiculos']);
    const objecion = extractFieldByKey(cleaned, 'objecion', ['confusion', 'versiculos']);
    const confusion = extractFieldByKey(cleaned, 'confusion', ['versiculos', 'padresDeLaIglesia']);
    const respuestaRapida = extractFieldByKey(cleaned, 'respuestaRapidaWhatsApp', ['doctrinaMagisterio']);
    const doctrinaMagisterio = extractFieldByKey(cleaned, 'doctrinaMagisterio', []);
    const citaBiblica = extractFieldByKey(cleaned, 'cita', ['texto', 'explicacion']);
    const textoBiblico = extractFieldByKey(cleaned, 'texto', ['explicacion']);
    const explicacionBiblica = extractFieldByKey(cleaned, 'explicacion', ['padresDeLaIglesia']);
    const santoPadre = extractFieldByKey(cleaned, 'santo', ['fecha', 'obra', 'cita']);
    const fechaPadre = extractFieldByKey(cleaned, 'fecha', ['obra', 'cita']);
    const obraPadre = extractFieldByKey(cleaned, 'obra', ['cita']);
    const citaPadre = extractFieldByKey(cleaned, 'cita', ['respuestaRapidaWhatsApp']);

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
