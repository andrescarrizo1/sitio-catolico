import { findMatchingConsuelo, type ConsueloResponse } from './data/consueloData';

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

const SYSTEM_PROMPT = `Eres un sabio director espiritual y teólogo católico de profunda caridad pastoral y fidelidad estricta al Magisterio de la Iglesia Católica y a la Sagrada Escritura (Biblia Vulgata / Torres Amat).
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

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Endpoint de Consuelo Espiritual
    if (url.pathname === '/api/consuelo') {
      // Manejo de CORS
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

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

        // Si tenemos Workers AI configurado en Cloudflare
        if (env.AI && typeof env.AI.run === 'function') {
          try {
            const promptUser = `El fiel o peregrino expresa la siguiente carga espiritual o sufrimiento interior:\n"${query || categoria}"\n\nPor favor, responde con el JSON estricto con Sagrada Escritura, cita de un Santo, reflexión pastoral católica y paso inmediato.`;

            const aiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
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

            // Validación mínima del objeto retornado
            if (parsed.versiculo && parsed.santo?.nombre && parsed.reflexion) {
              return new Response(JSON.stringify(parsed), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          } catch (aiError) {
            console.error('Error en Workers AI, recurriendo al catálogo doctrinal:', aiError);
          }
        }

        // Si Workers AI no está disponible o falló, recurrimos al catálogo doctrinal verificado
        const fallback = findMatchingConsuelo(query, categoria);
        return new Response(JSON.stringify(fallback), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Error procesando solicitud de consuelo:', err);
        const fallback = findMatchingConsuelo('', 'general');
        return new Response(JSON.stringify(fallback), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Servir archivos estáticos del directorio dist por defecto
    return env.ASSETS.fetch(request);
  },
};
