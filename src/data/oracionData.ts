export interface IntencionOracion {
  id: string;
  nombre: string;
  pais: string;
  categoria: 'salud' | 'difuntos' | 'familia' | 'conversion' | 'agradecimiento';
  peticion: string;
  velas: number;
  fecha: string;
}

export const INTENCIONES_INICIALES: IntencionOracion[] = [
  {
    id: 'int-1',
    nombre: 'María Elena',
    pais: 'Argentina 🇦🇷',
    categoria: 'salud',
    peticion: 'Por la pronta recuperación de mi madre internada por un cuadro respiratorio. Que la Virgen de Luján la cubra con su manto.',
    velas: 48,
    fecha: 'Hace unas horas'
  },
  {
    id: 'int-2',
    nombre: 'Santiago M.',
    pais: 'Colombia 🇨🇴',
    categoria: 'familia',
    peticion: 'Por la paz y reconciliación en mi matrimonio. Que el Señor sane las heridas y aleje toda división de nuestro hogar.',
    velas: 35,
    fecha: 'Hoy'
  },
  {
    id: 'int-3',
    nombre: 'Familia Navarro',
    pais: 'México 🇲🇽',
    categoria: 'difuntos',
    peticion: 'Por el eterno descanso del alma de nuestro padre Don Fernando, en el primer mes de su partida a la Casa del Padre.',
    velas: 62,
    fecha: 'Hoy'
  },
  {
    id: 'int-4',
    nombre: 'Lucía B.',
    pais: 'España 🇪🇸',
    categoria: 'conversion',
    peticion: 'Por la fe de mis dos hijos jóvenes que se han alejado de los Sacramentos. Santa Mónica, ruega por ellos.',
    velas: 29,
    fecha: 'Ayer'
  },
  {
    id: 'int-5',
    nombre: 'Andrés C.',
    pais: 'Chile 🇨🇱',
    categoria: 'agradecimiento',
    peticion: 'En acción de gracias a San José por la bendición de un trabajo digno tras nueve meses de angustiosa búsqueda.',
    velas: 51,
    fecha: 'Ayer'
  }
];
