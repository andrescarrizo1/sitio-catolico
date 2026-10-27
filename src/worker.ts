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

const CONSUELO_SYSTEM_PROMPT = `Eres un sabio confesor y teólogo católico de profunda caridad pastoral y fidelidad estricta al Magisterio de la Iglesia Católica y a la Sagrada Escritura (Biblia Vulgata / Torres Amat).
Tu misión es brindar consuelo al alma afligida que acude a la plataforma «Razón y Asombro» (https://razonyasombro.com).
Prohibido el relativismo moral, la teología modernista, la psicología secular o conceptos de Nueva Era. Habla con la voz cálida, paternal y santa de un confesor sabio.
Adapta tu respuesta de manera ÚNICA Y DIRECTA al dolor específico que escribe el peregrino.

REGLAS DE FORMATO:
- Responde ÚNICAMENTE con un JSON válido, sin bloques de código markdown, sin comentarios.
- JAMÁS uses comillas dobles (") dentro de tus oraciones; usa siempre comillas latinas (« ») o simples (').

Estructura requerida:
{
  "categoria": "Tema breve adaptado a su dolor específico",
  "versiculo": "Cita bíblica textual en español para su situación",
  "referencia": "Libro, capítulo y versículo bíblico exacto",
  "santo": {
    "nombre": "Nombre de un Santo o Doctor de la Iglesia relevante",
    "epoca": "Breve dato histórico o título del Santo",
    "frase": "Cita viva y consoladora de ese Santo para este sufrimiento"
  },
  "reflexion": "Dos párrafos serenos, compasivos y teológicamente certeros consolando su alma, respondiendo directamente a lo que escribió, mostrando el sentido redentor del dolor en unión con Cristo y reavivando la esperanza.",
  "accion": {
    "titulo": "Título de un paso espiritual concreto",
    "descripcion": "Instrucción espiritual inmediata para su caso (ej. Rezar una decena del Rosario, acto de confianza, confesión).",
    "enlace": "/rosario/",
    "textoBoton": "Rezar con Nosotros"
  }
}`;

const APOLOGETICA_SYSTEM_PROMPT = `Eres un eminente apologeta y teólogo católico, maestro en Sagrada Escritura (Vulgata / Torres Amat), Patrística de los siglos I a IV (San Ignacio de Antioquía, San Ireneo, San Justino, San Agustín) y Magisterio de la Iglesia Católica (Santo Tomás de Aquino, Concilio de Trento, Vaticano II).
Tu misión es dotar al fiel católico de argumentos bíblicos e históricos inexpugnables para responder con caridad y firmeza a objeciones protestantes, ateas o de sectas en la plataforma «Razón y Asombro» (https://razonyasombro.com).

REGLAS DE FORMATO:
- Responde ÚNICAMENTE con un JSON válido, sin bloques markdown.
- JAMÁS uses comillas dobles (") dentro de los textos; usa comillas latinas (« ») o simples (').

Estructura requerida:
{
  "tema": "Título de la defensa doctrinal",
  "objecion": "La objeción recibida formulada con claridad",
  "confusion": "Dónde radica el error o falacia hermenéutica de la objeción en 1 o 2 oraciones",
  "versiculos": [
    {
      "cita": "Libro, capítulo y versículo bíblico",
      "texto": "Cita textual bíblica en español",
      "explicacion": "Explicación concisa y demoledora de por qué este versículo respalda la doctrina católica"
    }
  ],
  "padresDeLaIglesia": {
    "santo": "Nombre del Padre de la Iglesia (siglos I a V)",
    "fecha": "Año aprox. d.C. y vínculo apostólico si aplica",
    "obra": "Nombre de la obra patrística",
    "cita": "Cita textual del santo demostrando que los primeros cristianos ya creían esto"
  },
  "respuestaRapidaWhatsApp": "Respuesta respetuosa, caritativa y contundente en 4 renglones (máximo 70 palabras) lista para enviar por chat de WhatsApp",
  "doctrinaMagisterio": "Breve referencia al Catecismo de la Iglesia Católica o Concilio ecuménico"
}`;

/**
 * Parsea el texto del LLM de forma resiliente mediante JSON nativo o extracción tolerante por regex.
 */
function parseConsueloResponse(raw: string): ConsueloResponse | null {
  let cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 1. Intento nativo
  try {
    const parsed = JSON.parse(cleaned) as ConsueloResponse;
    if (parsed.versiculo && parsed.santo?.nombre && parsed.reflexion) {
      return parsed;
    }
  } catch {}

  // 2. Extracción tolerante campo a campo
  try {
    const getVal = (key: string): string => {
      const regex = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*,\\s*"|\\s*,\\s*\\}|\\s*\\n\\s*"|\\s*\\})`, 'i');
      const m = cleaned.match(regex);
      return m ? m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim() : '';
    };

    const versiculo = getVal('versiculo');
    const reflexion = getVal('reflexion');
    const santoNombre = getVal('nombre');
    const santoFrase = getVal('frase');

    if (versiculo || reflexion || santoNombre) {
      return {
        categoria: getVal('categoria') || 'Consuelo Personalizado',
        versiculo: versiculo || '«Venid a mí todos los que estáis trabajados y cargados, y yo os aliviaré.»',
        referencia: getVal('referencia') || 'San Mateo 11, 28',
        santo: {
          nombre: santoNombre || 'San Pío de Pietrelcina',
          epoca: getVal('epoca') || 'Santo y Místico',
          frase: santoFrase || 'Reza, ten fe y no te preocupes. Dios escucha el clamor de tu corazón.'
        },
        reflexion: reflexion || 'Dios conoce íntimamente la herida que hoy te desgarra. No estás solo en esta prueba.',
        accion: {
          titulo: getVal('titulo') || 'Ofrecimiento y Oración',
          descripcion: getVal('descripcion') || 'Reza una decena del Rosario o haz un acto de abandono en Jesús.',
          enlace: '/rosario/',
          textoBoton: 'Rezar el Rosario'
        }
      };
    }
  } catch {}

  return null;
}

/**
 * Parsea la respuesta de apologética de forma resiliente.
 */
function parseApologeticaResponse(raw: string): ApologeticaResponse | null {
  let cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 1. Intento nativo
  try {
    const parsed = JSON.parse(cleaned) as ApologeticaResponse;
    if (parsed.tema && parsed.versiculos?.length > 0 && parsed.respuestaRapidaWhatsApp) {
      return parsed;
    }
  } catch {}

  // 2. Extracción tolerante
  try {
    const getVal = (key: string): string => {
      const regex = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*,\\s*"|\\s*,\\s*\\}|\\s*\\n\\s*"|\\s*\\})`, 'i');
      const m = cleaned.match(regex);
      return m ? m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim() : '';
    };

    const tema = getVal('tema');
    const confusion = getVal('confusion');
    const respuestaRapida = getVal('respuestaRapidaWhatsApp');
    const citaBiblica = getVal('cita');
    const textoBiblico = getVal('texto');
    const explicacionBiblica = getVal('explicacion');

    if (tema || confusion || respuestaRapida) {
      return {
        tema: tema || 'Defensa Bíblica de la Fe',
        objecion: getVal('objecion') || 'Objeción planteada',
        confusion: confusion || 'Se descontextualiza el pasaje bíblico sin considerar la Tradición Apostólica.',
        versiculos: [
          {
            cita: citaBiblica || '1 Pedro 3, 15',
            texto: textoBiblico || 'Estad siempre preparados para dar respuesta a todo el que os pida razón de vuestra esperanza.',
            explicacion: explicacionBiblica || 'La Sagrada Escritura nos manda a fundamentar nuestra fe en la verdad de Cristo.'
          }
        ],
        padresDeLaIglesia: {
          santo: getVal('santo') || 'San Ignacio de Antioquía',
          fecha: getVal('fecha') || 'Año 110 d.C.',
          obra: getVal('obra') || 'Cartas a las Iglesias',
          cita: getVal('cita') || 'Donde está el obispo, allí esté la comunidad, así como donde está Cristo Jesús, allí está la Iglesia Católica.'
        },
        respuestaRapidaWhatsApp: respuestaRapida || 'La Iglesia Católica fundamenta cada doctrina en la Escritura y en la enseñanza de los primeros cristianos desde el siglo I.',
        doctrinaMagisterio: getVal('doctrinaMagisterio') || 'Catecismo de la Iglesia Católica'
      };
    }
  } catch {}

  return null;
}

/**
 * Ejecuta inferencia en Cloudflare Workers AI probando los modelos modernos disponibles.
 */
async function runWorkersAI(
  ai: any,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 750
): Promise<{ rawContent: string; modelUsed: string }> {
  const candidateModels = [
    '@cf/meta/llama-3.2-3b-instruct',
    '@cf/meta/llama-3.3-70b-instruct',
    '@cf/meta/llama-3-8b-instruct',
    '@cf/meta/llama-3.2-1b-instruct',
  ];

  let lastError: any = null;

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

      const raw = res?.response || res?.choices?.[0]?.message?.content || '';
      if (raw && typeof raw === 'string') {
        return { rawContent: raw, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Fallo al ejecutar modelo ${model}:`, err?.message || err);
    }
  }

  throw lastError || new Error('No se pudo ejecutar ningún modelo de Workers AI');
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
            const promptUser = `El fiel o peregrino expresa la siguiente carga espiritual íntima y personal:\n"${query || categoria}"\n\nPor favor, responde adaptándote exactamente a su dolor personal con el objeto JSON estricto especificado.`;

            const { rawContent, modelUsed } = await runWorkersAI(
              env.AI,
              CONSUELO_SYSTEM_PROMPT,
              promptUser,
              750
            );

            const parsed = parseConsueloResponse(rawContent);

            if (parsed) {
              return new Response(JSON.stringify(parsed), {
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                  'X-AI-Status': 'generated_by_ai',
                  'X-AI-Model': modelUsed,
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

            const { rawContent, modelUsed } = await runWorkersAI(
              env.AI,
              APOLOGETICA_SYSTEM_PROMPT,
              promptUser,
              850
            );

            const parsed = parseApologeticaResponse(rawContent);

            if (parsed) {
              return new Response(JSON.stringify(parsed), {
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                  'X-AI-Status': 'generated_by_ai',
                  'X-AI-Model': modelUsed,
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
