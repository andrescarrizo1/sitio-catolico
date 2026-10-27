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

const CONSUELO_SYSTEM_PROMPT = `Eres un sabio director espiritual y teólogo católico de profunda caridad pastoral y fidelidad estricta al Magisterio de la Iglesia Católica y a la Sagrada Escritura (Biblia Vulgata / Torres Amat).
Tu misión es brindar consuelo al alma afligida que acude a la plataforma «Razón y Asombro» (https://razonyasombro.com).
Prohibido el relativismo moral, la teología modernista, la psicología secular o conceptos de Nueva Era. Habla con la voz cálida, paternal y santa de un confesor sabio (como San Pío de Pietrelcina o San Francisco de Sales).
Adapta tu respuesta PERSONALIZADAMENTE al dolor o situación exacta que el usuario describe.

REGLAS DE FORMATO:
- Debes responder ÚNICAMENTE con un JSON válido, sin bloques de código markdown, sin comentarios.
- JAMÁS uses comillas dobles (") dentro del texto; usa siempre comillas latinas (« ») o comillas simples (') para cualquier cita o diálogo, de modo que el JSON nunca se rompa.

Estructura obligatoria:
{
  "categoria": "Nombre breve del tema adaptado a su dolor específico",
  "versiculo": "Cita textual de la Sagrada Escritura en español apropiada para su dolor específico con comillas latinas (« »)",
  "referencia": "Libro, capítulo y versículo bíblico exacto (ej. Filipenses 4, 6-7)",
  "santo": {
    "nombre": "Nombre de un Santo o Doctor de la Iglesia relevante para este dolor",
    "epoca": "Breve dato histórico o título del Santo",
    "frase": "Cita viva y consoladora de ese Santo que ilumina este sufrimiento con comillas latinas (« »)"
  },
  "reflexion": "Dos párrafos serenos, compasivos y teológicamente certeros (máximo 120 palabras en total) consolando su alma, respondiendo directamente a lo que escribió, mostrando el sentido redentor del dolor en unión con Cristo y reavivando la esperanza.",
  "accion": {
    "titulo": "Título de un paso espiritual concreto",
    "descripcion": "Instrucción espiritual inmediata para su caso (ej. Rezar una decena del Rosario, hacer un acto de confianza, acudir a la confesión).",
    "enlace": "/rosario/",
    "textoBoton": "Rezar con Nosotros"
  }
}`;

const APOLOGETICA_SYSTEM_PROMPT = `Eres un eminente apologeta y teólogo católico, maestro en Sagrada Escritura (Vulgata / Torres Amat), Patrística de los siglos I a IV (San Ignacio de Antioquía, San Ireneo, San Justino, San Agustín) y Magisterio de la Iglesia Católica (Santo Tomás de Aquino, Concilio de Trento, Vaticano II).
Tu misión es dotar al fiel católico de argumentos bíblicos e históricos inexpugnables para responder con caridad y firmeza a objeciones protestantes, ateas o de sectas en la plataforma «Razón y Asombro» (https://razonyasombro.com).

REGLAS DE FORMATO:
- Responde ÚNICAMENTE con un JSON válido, sin bloques markdown.
- JAMÁS uses comillas dobles (") dentro del texto; usa comillas latinas (« ») o simples (').

Estructura obligatoria:
{
  "tema": "Título de la defensa doctrinal (ej. La Virgen María y la Mediación de Cristo)",
  "objecion": "La objeción recibida formulada con claridad",
  "confusion": "Dónde radica el error o falacia hermenéutica de la objeción en 1 o 2 oraciones",
  "versiculos": [
    {
      "cita": "Libro, capítulo y versículo bíblico (ej. 1 Timoteo 2, 1-3)",
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
 * Parsea JSON generado por un LLM de forma resiliente contra comillas internas o bloques markdown.
 */
function parseLLMJson<T>(raw: string): T {
  let cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 1. Intento directo
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    // 2. Normalizar comillas internas y saltos de línea
    try {
      const fixedLines = cleaned.replace(/\r\n/g, '\n').replace(/\n/g, '\\n');
      return JSON.parse(fixedLines) as T;
    } catch {}

    // 3. Reemplazar comillas dobles no estructurales
    try {
      // Reemplaza comillas dobles no precedidas por : ni seguidas por , o }
      const softened = cleaned.replace(/([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])"([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])/g, '$1\'$2');
      return JSON.parse(softened) as T;
    } catch {}

    throw err;
  }
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
            const promptUser = `El fiel o peregrino expresa la siguiente carga espiritual íntima:\n"${query || categoria}"\n\nPor favor, responde adaptándote exactamente a su dolor personal con el objeto JSON estricto especificado.`;

            const { rawContent, modelUsed } = await runWorkersAI(
              env.AI,
              CONSUELO_SYSTEM_PROMPT,
              promptUser,
              750
            );

            const parsed = parseLLMJson<ConsueloResponse>(rawContent);

            if (parsed.versiculo && parsed.santo?.nombre && parsed.reflexion) {
              return new Response(JSON.stringify(parsed), {
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                  'X-AI-Status': 'generated_by_ai',
                  'X-AI-Model': modelUsed,
                },
              });
            } else {
              aiDebug = 'json_validation_failed';
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

            const parsed = parseLLMJson<ApologeticaResponse>(rawContent);

            if (parsed.tema && parsed.versiculos?.length > 0 && parsed.respuestaRapidaWhatsApp) {
              return new Response(JSON.stringify(parsed), {
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                  'X-AI-Status': 'generated_by_ai',
                  'X-AI-Model': modelUsed,
                },
              });
            } else {
              aiDebug = 'json_validation_failed';
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
