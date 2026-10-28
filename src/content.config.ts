import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Esquema base compartido por todas las entidades doctrinales e históricas
const baseSchema = z.object({
  slug: z.string().optional(),
  titulo: z.string().min(5).max(120),
  resumen: z.string().min(20).max(500),
  imagen: z.object({
    src: z.string(),
    alt: z.string().min(10, "El texto alternativo (alt) es obligatorio y descriptivo"),
    credito: z.string(),
    licencia: z.enum([
      'Dominio Público',
      'CC0',
      'CC BY 2.0',
      'CC BY 3.0',
      'CC BY 4.0',
      'CC BY-SA 2.0',
      'CC BY-SA 3.0',
      'CC BY-SA 4.0',
      'Uso Editorial Justificado'
    ]),
    url_fuente: z.string().url(),
  }),
  estatus_eclesial: z.enum([
    'Aprobado formalmente por la Santa Sede',
    'Aprobado por el Obispo local (Decreto diocesano)',
    'En estudio / Sin pronunciamiento definitivo',
    'Canonizado',
    'No consta aprobación sobrenatural formal'
  ]),
  fuentes: z.array(
    z.object({
      titulo: z.string(),
      autor: z.string().optional(),
      tipo: z.enum(['Documento Eclesiástico', 'Estudio Científico / Médico', 'Libro Histórico', 'Prensa de la Época']),
      url: z.string().url().optional(),
      cita_o_referencia: z.string(),
      nivel_confianza: z.enum(['Primaria (Oficial / Laboratorio)', 'Secundaria Académica', 'Testimonial Documentada'])
    })
  ).min(1, "Debe incluirse al menos una fuente primaria o histórica verificada"),
  autor: z.string().default("Equipo Editorial"),
  revisado_por: z.string().default("Revisión Editorial Interna (Basada en Magisterio y Fuentes Primarias)"),
  fecha_publicacion: z.coerce.date(),
  fecha_revision: z.coerce.date(),
});

// 1. Colección: Milagros Eucarísticos
export const milagros = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/milagros" }),
  schema: baseSchema.extend({
    lugar: z.string(),
    fecha_evento: z.string(),
    tipo_fenomeno: z.string(),
    grupo_sanguineo: z.string().default('AB'),
    investigadores_clave: z.array(z.string()),
    laboratorios_participantes: z.array(z.string()),
    evidencia_cientifica_resumen: z.string(),
    objeciones_y_respuestas: z.array(z.object({
      objecion: z.string(),
      respuesta_documentada: z.string()
    })).optional(),
  }),
});

// 2. Colección: Virgen de Fátima
export const fatima = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/fatima" }),
  schema: baseSchema.extend({
    orden: z.number().int(),
    tema_principal: z.enum(['Apariciones', 'Pastorcitos', 'Mensaje y Reparación', 'Milagro del Sol', 'Consagración']),
    pasajes_memorias_lucia: z.array(z.string()).optional(),
  }),
});

// 3. Colección: Santos y Místicos (San Pío, San Carlo Acutis, Santa Faustina, Santa Bernardita)
export const santos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/santos" }),
  schema: baseSchema.extend({
    orden: z.number().int(),
    santo_nombre: z.string().optional(),
    eje_tematico: z.string(),
    medicos_involucrados: z.array(z.string()).optional(),
  }),
});

// 4. Colección: Ciencia y Fe (Sábana Santa de Turín, Tilma de Guadalupe, Bureau de Lourdes)
export const cienciaFe = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/ciencia-fe" }),
  schema: baseSchema.extend({
    orden: z.number().int().default(1),
    tipo_signo: z.string(),
    fecha_origen: z.string(),
    cientificos_participantes: z.array(z.string()),
    instituciones_laboratorios: z.array(z.string()),
    evidencia_resumen: z.string(),
  }),
});

// 4. Colección: Jesús y sus Enseñanzas
export const jesus = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/jesus" }),
  schema: baseSchema.extend({
    categoria: z.enum(['Parábolas', 'Sermón de la Montaña', 'Milagros', 'Enseñanzas Morales y Teológicas']),
    referencia_evangelica_principal: z.string(),
    texto_biblico_completo: z.string(),
    traduccion_usada: z.string().default("Biblia Torres Amat (1825, Dominio Público)"),
    aplicacion_hoy: z.string(),
    siguiente_paso_sugerido: z.string(),
  }),
});

// 5. Colección: Biblia y Conversión
export const biblia = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/content/biblia" }),
  schema: z.object({
    tema_slug: z.string(),
    tema_titulo: z.string(),
    descripcion_pastoral: z.string(),
    versiculos: z.array(z.object({
      referencia: z.string(),
      texto: z.string(),
      traduccion: z.string().default("Biblia Torres Amat (1825, Dominio Público)"),
      reflexion_corta: z.string().max(500),
      accion_sugerida: z.string()
    })).min(8).max(15),
  }),
});

// 6. Colección: Páginas Institucionales
export const paginas = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/paginas" }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    fecha_actualizacion: z.coerce.date(),
  }),
});

export const collections = {
  milagros,
  fatima,
  santos,
  jesus,
  biblia,
  paginas,
  cienciaFe,
};
