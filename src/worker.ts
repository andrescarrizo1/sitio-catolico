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

Debes responder ÚNICAMENTE con un JSON válido (sin comentarios, sin texto antes ni después, sin bloques markdown) con exactamente esta estructura:
{
  "categoria": "Nombre breve del tema (ej. Duelo, Ansiedad, Culpa, Duda, Soledad, etc.)",
  "versiculo": "Cita textual de la Sagrada Escritura en español apropiada para este dolor",
  "referencia": "Libro, capítulo y versículo bíblico exacto (ej. Filipenses 4, 6-7)",
  "santo": {
    "nombre": "Nombre de un Santo o Doctor de la Iglesia relevante",
    "epoca": "Breve dato histórico o título del Santo",
    "frase": "Cita viva y consoladora de ese Santo que ilumina este sufrimiento"
  },
  "reflexion": "Dos párrafos serenos, compasivos y teológicamente certeros (máximo 130 palabras en total) consolando el alma, mostrando el sentido redentor del dolor en unión con Cristo y reavivando la esperanza.",
  "accion": {
    "titulo": "Título de un paso espiritual concreto",
    "descripcion": "Instrucción espiritual inmediata (ej. Rezar una decena del Rosario, hacer un acto de confianza, acudir a la confesión).",
    "enlace": "/rosario/",
    "textoBoton": "Rezar con Nosotros"
  }
}`;

const APOLOGETICA_SYSTEM_PROMPT = `Eres un eminente apologeta y teólogo católico, maestro en Sagrada Escritura (Vulgata / Torres Amat), Patrística de los siglos I a IV (San Ignacio de Antioquía, San Ireneo, San Justino, San Agustín) y Magisterio de la Iglesia Católica (Santo Tomás de Aquino, Concilio de Trento, Vaticano II).
Tu misión es dotar al fiel católico de argumentos bíblicos e históricos inexpugnables para responder con caridad y firmeza a objeciones protestantes, ateas o de sectas en la plataforma «Razón y Asombro» (https://razonyasombro.com).

Debes responder ÚNICAMENTE con un JSON válido (sin comentarios, sin texto antes ni después, sin bloques de código markdown) con exactamente esta estructura:
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
        if (!env.AI) {
          aiDebug = 'env_ai_undefined';
        } else if (typeof env.AI.run !== 'function') {
          aiDebug = 'env_ai_run_not_function';
        } else {
          aiDebug = 'env_ai_present';
        }

        if (env.AI && typeof env.AI.run === 'function') {
          try {
            const promptUser = `El fiel expresa la siguiente carga espiritual:\n"${query || categoria}"\n\nResponde con el JSON estricto.`;

            const aiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [
                { role: 'system', content: CONSUELO_SYSTEM_PROMPT },
                { role: 'user', content: promptUser },
              ],
              max_tokens: 700,
              temperature: 0.5,
            });

            const rawContent = aiResult?.response || aiResult?.choices?.[0]?.message?.content || '';
            const cleaned = rawContent
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();

            const parsed = JSON.parse(cleaned) as ConsueloResponse;

            if (parsed.versiculo && parsed.santo?.nombre && parsed.reflexion) {
              return new Response(JSON.stringify(parsed), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-AI-Status': 'generated_by_ai' },
              });
            } else {
              aiDebug = 'json_validation_failed';
            }
          } catch (aiError) {
            aiDebug = `error: ${aiError instanceof Error ? aiError.message : String(aiError)}`;
            console.error('Error en Workers AI (consuelo):', aiError);
          }
        }

        const fallback = findMatchingConsuelo(query, categoria);
        return new Response(JSON.stringify(fallback), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-AI-Status': 'fallback', 'X-AI-Debug': aiDebug },
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

        // Si Workers AI está disponible
        if (env.AI && typeof env.AI.run === 'function') {
          try {
            const promptUser = `El usuario plantea la siguiente objeción o duda sobre la fe católica:\n"${query || temaId}"\n\nPor favor, responde con el JSON estricto estructurado en: tema, objecion, confusion, versiculos (con cita, texto y explicacion), padresDeLaIglesia (santo, fecha, obra, cita), respuestaRapidaWhatsApp y doctrinaMagisterio.`;

            const aiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [
                { role: 'system', content: APOLOGETICA_SYSTEM_PROMPT },
                { role: 'user', content: promptUser },
              ],
              max_tokens: 850,
              temperature: 0.4,
            });

            const rawContent = aiResult?.response || aiResult?.choices?.[0]?.message?.content || '';
            const cleaned = rawContent
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();

            const parsed = JSON.parse(cleaned) as ApologeticaResponse;

            if (parsed.tema && parsed.versiculos?.length > 0 && parsed.respuestaRapidaWhatsApp) {
              return new Response(JSON.stringify(parsed), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          } catch (aiError) {
            console.error('Error en Workers AI (apologetica):', aiError);
          }
        }

        // Fallback al catálogo verificado
        const fallback = findMatchingApologetica(query, temaId);
        return new Response(JSON.stringify(fallback), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
