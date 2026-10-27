export interface ConsueloResponse {
  categoria: string;
  versiculo: string;
  referencia: string;
  santo: {
    nombre: string;
    epoca?: string;
    frase: string;
  };
  reflexion: string;
  accion: {
    titulo: string;
    descripcion: string;
    enlace: string;
    textoBoton: string;
  };
}

export const CATEGORIAS_CONSUELO = [
  { id: 'duelo', label: 'Duelo y Pérdida', icon: '🥀', desc: 'Muerte de un ser querido, luto o vacío' },
  { id: 'ansiedad', label: 'Ansiedad y Miedo', icon: '⚡', desc: 'Incertidumbre, angustia o falta de paz' },
  { id: 'culpa', label: 'Culpa y Caída', icon: '🌧️', desc: 'Reincidencia en pecado, vergüenza o perdón' },
  { id: 'duda', label: 'Duda y Sequedad', icon: '🕊️', desc: 'Noche oscura, silencio de Dios o tibieza' },
  { id: 'enfermedad', label: 'Enfermedad y Dolor', icon: '🩹', desc: 'Sufrimiento corporal o diagnóstico difícil' },
  { id: 'soledad', label: 'Soledad y Abandono', icon: '🕯️', desc: 'Incomprensión, aislamiento o desamparo' },
  { id: 'familia', label: 'Crisis Familiar', icon: '💔', desc: 'Matrimonio, pleitos o hijos apartados' },
];

export const CONSUELO_CATALOGO: Record<string, ConsueloResponse> = {
  duelo: {
    categoria: 'Duelo y Pérdida',
    versiculo: '«Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá. Y todo aquel que vive y cree en mí, no morirá eternamente.»',
    referencia: 'San Juan 11, 25-26',
    santo: {
      nombre: 'San Agustín de Hipona',
      epoca: 'Doctor de la Iglesia (354-430 d.C.)',
      frase: '«No se pierde a los que se ama en Aquel a quien nunca se puede perder. Quien parte al Señor sigue vivo en la comunión de los santos; nuestra oración es el puente invisible que los alcanza.»'
    },
    reflexion: 'El dolor que sientes por la partida de tu ser querido no es signo de falta de fe, sino la medida del amor que Dios sembró en tu corazón. El mismo Cristo lloró conmovido ante el sepulcro de su amigo Lázaro. En la fe católica, la muerte no tiene la última palabra: ha sido vencida en la Cruz.\n\nTu ser querido no ha desaparecido en la nada: ha cruzado el umbral hacia la eternidad de Dios. Tu mayor acto de amor hacia él o ella ya no es el desconsuelo, sino el sufragio: encomendar su alma en la Santa Misa y en el Santo Rosario para que pronto contemple el Rostro de Dios en el Paraíso.',
    accion: {
      titulo: 'Ofrece una decena del Rosario por su descanso',
      descripcion: 'Reza hoy con nosotros los Misterios Dolorosos o Gloriosos ofreciendo cada Avemaría por el alma de quien tanto amas.',
      enlace: '/rosario/',
      textoBoton: 'Rezar Rosario por su Alma'
    }
  },
  ansiedad: {
    categoria: 'Ansiedad, Miedo y Angustia',
    versiculo: '«Por nada os inquietéis; antes bien, en toda ocasión, mediante la oración y la súplica con acción de gracias, sean presentadas vuestras peticiones a Dios. Y la paz de Dios, que sobrepuja a todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.»',
    referencia: 'Filipenses 4, 6-7',
    santo: {
      nombre: 'San Pío de Pietrelcina',
      epoca: 'Místico y Sacerdote Capuchino (1887-1968)',
      frase: '«Reza, ten fe y no te preocupes. La preocupación es inútil. Dios es misericordioso y escuchará tu oración. Abandónate con confianza filial en los brazos de Jesús.»'
    },
    reflexion: 'La angustia humana nace a menudo de querer cargar sobre nuestros hombros un futuro que solo le pertenece a la Providencia divina. Dios no te promete ausencia de dificultades, pero te asegura que su gracia te basta para cada minuto del día de hoy.\n\nCuando sientas que la opresión en el pecho nubla tu juicio, respira hondo y entrega el control. Jesús no es un espectador lejano; camina en tu misma barca en medio de la tempestad. Él sabe lo que necesitas antes de que se lo pidas; sólo espera que le abras la puerta de tu confianza.',
    accion: {
      titulo: 'Acto de Abandono en Jesús',
      descripcion: 'Repite lentamente con el corazón: «Jesús, me entrego a Ti, ocúpate Tú». Puedes también acompañar tu oración con el ritmo suave del Rosario.',
      enlace: '/rosario/',
      textoBoton: 'Entrar en Oración y Paz'
    }
  },
  culpa: {
    categoria: 'Culpa, Caída y Arrepentimiento',
    versiculo: '«Si confesamos nuestros pecados, Él es fiel y justo para perdonarnos y limpiarnos de toda iniquidad. Aunque vuestros pecados fueren como la grana, como la nieve serán emblanquecidos.»',
    referencia: '1 Juan 1, 9 e Isaías 1, 18',
    santo: {
      nombre: 'Santa Faustina Kowalska',
      epoca: 'Apóstol de la Divina Misericordia (1905-1938)',
      frase: '«Jesús me dijo: "Hija mía, no temas a tu Salvador. No vengo a condenarte sino a abrirte las fuentes de Mi Misericordia. Cuanto más grande es el pecador, tanto mayor derecho tiene a Mi perdón".»'
    },
    reflexion: 'El demonio tienta antes de pecar quitando la vergüenza, y después de pecar multiplicando la culpa para hacerte creer que Dios te ha rechazado. Ese desánimo no viene del Espíritu Santo: el Espíritu Santo convence de pecado para levantarte y sanarte, jamás para hundirte en la desesperanza.\n\nNo midas el perdón de Dios con la pequeñez de tu propia capacidad humana. La Sangre de Cristo derramada en la Cruz tiene un poder redentor infinitamente superior a todas tus faltas reunidas. Cada caída es una invitación urgente a buscar el abrazo del Padre.',
    accion: {
      titulo: 'El Abrazo del Sacramento de la Confesión',
      descripcion: 'Haz un sincero examen de conciencia y acude lo antes posible a un sacerdote para recibir la absolución sacramental. Reza mientras tanto la Coronilla de la Divina Misericordia.',
      enlace: '/rosario/',
      textoBoton: 'Rezar Coronilla de la Misericordia'
    }
  },
  duda: {
    categoria: 'Duda de Fe y Noche Oscura',
    versiculo: '«Inmediatamente el padre del muchacho exclamó con lágrimas: Creo, Señor; ayuda mi poca fe.»',
    referencia: 'San Marcos 9, 24',
    santo: {
      nombre: 'San Juan de la Cruz',
      epoca: 'Doctor Místico de la Iglesia (1542-1591)',
      frase: '«La noche oscura del espíritu no viene a apagar la fe, sino a purificarla. Cuando Dios retira los consuelos sensibles, no es que te haya abandonado: te está enseñando a amarlo por quien es Él, y no por lo que te hace sentir.»'
    },
    reflexion: 'Sentir la ausencia sensible de Dios o experimentar dudas intelectuales no significa que hayas perdido la fe. La fe no es una emoción pasajera ni una certeza matemática; es un acto de confianza de la voluntad en la Persona de Jesucristo. Los más grandes santos —desde Santa Teresa de Calcuta hasta San Juan de la Cruz— atravesaron años de profundo silencio interior.\n\nEl silencio divino no es desinterés, sino el crisol donde se forja la fidelidad pura. Dios está trabajando en lo más hondo de tu ser, allí donde los sentidos no llegan. Mantente firme en la oración aunque no "sientas" nada: esa perseverancia a oscuras es de un valor inestimable a los ojos del Señor.',
    accion: {
      titulo: 'Cinco minutos de Adoración en Silencio',
      descripcion: 'Ponte de rodillas o con el corazón recogido, fija la mirada en el Sagrario o una Cruz y reza el Credo de los Apóstoles pidiendo el don de la fortaleza.',
      enlace: '/milagros-eucaristicos/',
      textoBoton: 'Ver la Evidencia de la Eucaristía'
    }
  },
  enfermedad: {
    categoria: 'Enfermedad y Sufrimiento Físico',
    versiculo: '«Y me ha dicho: Te basta mi gracia; porque mi fuerza se perfecciona en la flaqueza. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que habite en mí el poder de Cristo.»',
    referencia: '2 Corintios 12, 9',
    santo: {
      nombre: 'San Carlo Acutis',
      epoca: 'Santo de la Eucaristía (1991-2006)',
      frase: '«Ofrezco todo este dolor que debo sufrir por el Señor, por el Papa y por la Iglesia, para no ir al Purgatorio e ir directo al Paraíso. La Eucaristía es mi autopista hacia el Cielo.»'
    },
    reflexion: 'La enfermedad corporal es una de las pruebas más duras para la naturaleza humana. Sin embargo, en el cristianismo el dolor no es una fatalidad absurda: cuando se ofrece en unión con la Pasión de Cristo en la Cruz, se convierte en un manantial de gracias para tu propia alma y para la salvación de muchos.\n\nJesucristo conoce íntimamente la sed, el dolor punzante, la fiebre y la debilidad extrema; Él los padeció en su carne santísima. En tu lecho de dolor o en tus citas médicas, Él está arrodillado a tu lado dándote la fuerza sobrenatural para llevar la cruz un día a la vez.',
    accion: {
      titulo: 'Ofrecimiento del Dolor y Unción Sacramental',
      descripcion: 'Solicita al párroco el Sacramento de la Unción de los Enfermos (sacramento de fortaleza y salud espiritual) y contempla las llagas de Cristo en la Pasión.',
      enlace: '/jesus/',
      textoBoton: 'Meditar las Enseñanzas de Jesús'
    }
  },
  soledad: {
    categoria: 'Soledad y Sentimiento de Abandono',
    versiculo: '«¿Acaso olvidará una madre a su criatura, para no compadecerse del fruto de sus entrañas? Pues aunque ella se olvidara, yo jamás me olvidaré de ti. He aquí que en las palmas de mis manos te llevo esculpido.»',
    referencia: 'Isaías 49, 15-16',
    santo: {
      nombre: 'San Rafael Arnaiz Barón',
      epoca: 'Trapense y Místico (1911-1938)',
      frase: '«¡Qué bien se está con Dios en la soledad del alma! En el mundo todo son ruidos pasajeros y desilusiones; pero en el Sagrario encontramos un Amigo que jamás decepciona y que escucha cada latido de nuestro corazón.»'
    },
    reflexion: 'La soledad que a veces nos desgarra es una señal de que nuestro corazón fue creado para un amor infinito que ninguna criatura terrenal puede colmar del todo. Las personas pueden fallar, alejarse o no comprendernos, pero el Corazón de Jesús nunca se distrae de ti.\n\nEn el Sagrario de cualquier iglesia católica de tu ciudad, Jesús está sacramentalmente vivo y presente esperando que vayas a hacerle compañía. Transforma tu soledad en un encuentro: habla con Él como con el amigo más leal que jamás te dejará solo.',
    accion: {
      titulo: 'Visita al Santísimo Sacramento',
      descripcion: 'Acércate a una capilla con Sagrario o haz una pausa de contemplación espiritual rezando un Padre Nuestro con recogimiento interior.',
      enlace: '/contacto/',
      textoBoton: 'Dejar tu Intención para el Rosario'
    }
  },
  familia: {
    categoria: 'Crisis Familiar y Preocupación por Seres Queridos',
    versiculo: '«Revestíos, pues, como elegidos de Dios, santos y amados, de entrañable misericordia, de benignidad, de humildad, de mansedumbre, de paciencia; soportándoos unos a otros, y perdonándoos unos a otros si alguno tuviere queja contra otro.»',
    referencia: 'Colosenses 3, 12-13',
    santo: {
      nombre: 'Santa Mónica',
      epoca: 'Madre de San Agustín (332-387 d.C.)',
      frase: '«Un hijo de tantas lágrimas no puede perecer. Persevera en la oración incesante y con mansedumbre, pues donde terminan las fuerzas de las palabras humanas comienzan a actuar las gracias de Dios.»'
    },
    reflexion: 'Ver sufrir a una familia o presenciar cómo un hijo o cónyuge se aparta de la fe y de las buenas sendas puede romper el alma de dolor. Santa Mónica lloró y oró durante más de diecisiete años por la conversión de su hijo Agustín antes de verlo convertirse en uno de los más grandes santos de la Iglesia.\n\nNo desistas jamás. Las oraciones hechas con amor materno, paterno o conyugal tienen una eficacia misteriosa y poderosa ante el Trono de Dios. Cuando tus palabras no sean escuchadas por ellos, habla más con Dios acerca de ellos que con ellos acerca de Dios.',
    accion: {
      titulo: 'Consagración de la Familia a la Sagrada Familia',
      descripcion: 'Pon las personas en conflicto bajo el manto de la Virgen María y San José. Reza el Santo Rosario en familia o en silencio por su conversión.',
      enlace: '/rosario/',
      textoBoton: 'Rezar Rosario por la Familia'
    }
  },
  general: {
    categoria: 'Paz y Consuelo del Señor',
    versiculo: '«Venid a mí todos los que estáis trabajados y cargados, que yo os aliviaré. Llevad mi yugo sobre vosotros, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.»',
    referencia: 'San Mateo 11, 28-29',
    santo: {
      nombre: 'Santa Teresa de Jesús',
      epoca: 'Doctora de la Iglesia (1515-1582)',
      frase: '«Nada te turbe, nada te espante, todo se pasa, Dios no se muda; la paciencia todo lo alcanza; quien a Dios tiene nada le falta: Sólo Dios basta.»'
    },
    reflexion: 'Cualquiera que sea la tormenta que hoy sacude tu interior, recuerda que no estás desamparado. Dios no es ajeno a tus lágrimas ni sordo a tus silencios. En cada herida de tu vida terrenal, Cristo desea verter el óleo de su gracia y darte una fuerza superior a tus propias flaquezas.\n\nHaz una pausa en este día agitado. Respira hondo en la presencia de Dios. Él te ama con amor eterno y tiene trazado un camino de esperanza y salvación para tu alma.',
    accion: {
      titulo: 'Encuentro Diario con la Gracia',
      descripcion: 'Entra en el Santo Rosario diario o sumérgete en los peritajes de la Eucaristía para renovar la certeza de que Dios vive y actúa.',
      enlace: '/rosario/',
      textoBoton: 'Rezar el Rosario de Hoy'
    }
  }
};

/**
 * Busca el consuelo más afín según palabras clave o categoría seleccionada.
 */
export function findMatchingConsuelo(query: string, catId?: string): ConsueloResponse {
  if (catId && CONSUELO_CATALOGO[catId]) {
    return CONSUELO_CATALOGO[catId];
  }

  const q = (query || '').toLowerCase();

  // Duelo
  if (/muert|falleci|luto|duelo|perdi|padre|madre|mama|papa|hijo|abuel|cementerio|entierro|velori/i.test(q)) {
    return CONSUELO_CATALOGO.duelo;
  }
  // Ansiedad / Miedo
  if (/ansied|mied|angust|panico|futuro|trabajo|desemple|deuda|dinero|estres|ahogo|pesadilla|desesper/i.test(q)) {
    return CONSUELO_CATALOGO.ansiedad;
  }
  // Culpa / Pecado
  if (/pecad|culpa|perdon|verg|caid|lujuri|porno|ira|odio|vicio|reincid|arrepent|manch/i.test(q)) {
    return CONSUELO_CATALOGO.culpa;
  }
  // Duda / Noche oscura
  if (/duda|fe|sequedad|creer|ateo|silencio|no sient|abandon|incredul|confund/i.test(q)) {
    return CONSUELO_CATALOGO.duda;
  }
  // Enfermedad / Dolor físico
  if (/enferm|dolor|cancer|hospital|operac|medico|fisic|cuerpo|agon|salud|cura|sanidad/i.test(q)) {
    return CONSUELO_CATALOGO.enfermedad;
  }
  // Soledad / Desamparo
  if (/sol|aislad|nadie|incomprend|rechaz|amigo|vaci|triste|depres/i.test(q)) {
    return CONSUELO_CATALOGO.soledad;
  }
  // Familia / Matrimonio
  if (/famili|espos|marid|matrimon|divorc|hijo|pelea|discusion|hermano|separac|hogar/i.test(q)) {
    return CONSUELO_CATALOGO.familia;
  }

  return CONSUELO_CATALOGO.general;
}
