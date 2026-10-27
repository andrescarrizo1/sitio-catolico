export interface ApologeticaResponse {
  tema: string;
  objecion: string;
  confusion: string;
  versiculos: Array<{
    cita: string;
    texto: string;
    explicacion: string;
  }>;
  padresDeLaIglesia: {
    santo: string;
    fecha: string;
    cita: string;
    obra: string;
  };
  respuestaRapidaWhatsApp: string;
  doctrinaMagisterio: string;
}

export const TEMAS_APOLOGETICA = [
  { id: 'virgen-mediadora', label: '¿María Mediadora?', icon: '🕊️', desc: '1 Timoteo 2:5 y la intercesión' },
  { id: 'confesion-sacerdotes', label: '¿Confesarse con Curas?', icon: '✝️', desc: 'Juan 20:21-23 y el perdón de los pecados' },
  { id: 'eucaristia-presencia-real', label: '¿Eucaristía Símbolo?', icon: '🍞', desc: 'Juan 6 y la Presencia Real' },
  { id: 'imagenes-idolatria', label: '¿Imágenes e Ídolos?', icon: '🖼️', desc: 'Éxodo 20 vs. Éxodo 25 (Arca)' },
  { id: 'purgatorio', label: '¿Dónde está el Purgatorio?', icon: '🔥', desc: '1 Cor 3:15 y 2 Macabeos 12' },
  { id: 'pedro-y-el-papa', label: '¿Pedro es la Roca?', icon: '🗝️', desc: 'Mateo 16:18 y las llaves del Reino' },
  { id: 'virgen-hermanos', label: '¿Hermanos de Jesús?', icon: '📜', desc: 'El término hebreo y griego «Adelfos»' },
  { id: 'fe-y-obras', label: '¿Sola Fe o con Obras?', icon: '⚖️', desc: 'Santiago 2:24 frente a la Sola Fide' },
  { id: 'bautismo-infantes', label: '¿Bautizar Niños?', icon: '👶', desc: 'Hechos 16:33 y la Alianza de Gracia' }
];

export const APOLOGETICA_CATALOGO: Record<string, ApologeticaResponse> = {
  'virgen-mediadora': {
    tema: 'La Virgen María y la Mediación de Cristo',
    objecion: '«La Biblia dice en 1 Timoteo 2:5 que hay un solo mediador entre Dios y los hombres, Jesucristo. Por tanto, rezarle a la Virgen o a los santos es idolatría y pecado.»',
    confusion: 'Confunden la Mediación Redentora única de Cristo con la Intercesión Subordinada de los miembros de su Cuerpo Místico. Pedirle a María que ruegue por nosotros no anula a Cristo; al contrario, acudimos a Él a través de la súplica fraterna.',
    versiculos: [
      {
        cita: '1 Timoteo 2, 1-3',
        texto: '«Ante todo recomiendo que se hagan plegarias, oraciones, súplicas y acciones de gracias por todos los hombres... Esto es bueno y agradable a Dios nuestro Salvador.»',
        explicacion: 'San Pablo, justo dos versículos antes de decir que Cristo es el único mediador, nos manda a ser intercesores unos por otros. Si pedir la intercesión de un hermano fuera pecado, San Pablo estaría mandando a pecar.'
      },
      {
        cita: 'San Juan 2, 1-11 (Bodas de Caná)',
        texto: '«Y como faltase el vino, la madre de Jesús le dijo: No tienen vino... Dijo su madre a los sirvientes: Haced lo que Él os dijere.»',
        explicacion: 'Jesús adelantó su hora e hizo su primer milagro a petición expresa de su Madre. María no hace el milagro por su propia cuenta; intercede ante su Hijo y manda a obedecerlo («Haced lo que Él os diga»).'
      },
      {
        cita: 'Santiago 5, 16',
        texto: '«La oración eficaz del justo puede mucho.»',
        explicacion: 'Si la oración de un justo en la tierra puede mucho, ¿cuánto más podrá la oración de los justos y santos que ya están plenamente vivos ante el Trono de Dios en el Cielo (Apocalipsis 5, 8)?'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Ireneo de Lyon',
      fecha: 'Año 180 d.C. (Discípulo de San Policarpo, discípulo del Apóstol San Juan)',
      obra: 'Contra las Herejías (Adversus Haereses III, 22, 4)',
      cita: '«Así como Eva, desobedeciendo, fue causa de muerte para sí y para todo el género humano, así María, obedeciendo, fue causa de salvación para sí y para todo el género humano... El nudo de la desobediencia de Eva fue desatado por la obediencia de María.»'
    },
    respuestaRapidaWhatsApp: 'Jesús es el ÚNICO mediador que nos redime con su Sangre (1 Tim 2,5). Pero en 1 Tim 2,1 la Biblia nos manda orar e interceder unos por otros. Así como le pides a un amigo en la tierra que ore por ti, nosotros le pedimos a María que ore por nosotros ante su Hijo, tal como lo hizo en las Bodas de Caná (Jn 2,1-11). Quien está en el Cielo está más vivo en Cristo que nosotros (Lc 20,38).',
    doctrinaMagisterio: 'El Catecismo de la Iglesia Católica (n. 969-970) enseña con claridad: la función maternal de María de ninguna manera disminuye o hace sombra a la única mediación de Cristo; al contrario, manifiesta su infinita eficacia. Ninguna criatura puede compararse jamás con el Redentor encarnado.'
  },

  'confesion-sacerdotes': {
    tema: 'El Sacramento de la Reconciliación (La Confesión)',
    objecion: '«¿Por qué confesarme con un cura pecador si puedo pedirle perdón directo a Dios en mi cuarto?»',
    confusion: 'Se ignora que fue el mismo Jesucristo quien instituyó formalmente el ministerio del perdón humano en la tarde de su Resurrección, delegando su propia autoridad judicial a hombres de carne y hueso.',
    versiculos: [
      {
        cita: 'San Juan 20, 21-23',
        texto: '«Jesús les dijo otra vez: Paz a vosotros. Como me envió el Padre, así también yo os envío. Y habiendo dicho esto, sopló, y les dijo: Recibid el Espíritu Santo. A quienes perdonareis los pecados, les quedan perdonados; y a quienes se los retuviereis, les quedan retenidos.»',
        explicacion: 'Cristo da a los Apóstoles la autoridad explícita de «perdonar» o «retener». ¿Cómo podría un sacerdote saber si debe perdonar o retener un pecado si el penitente no se lo confiesa de viva voz?'
      },
      {
        cita: '2 Corintios 5, 18-20',
        texto: '«Y todo esto proviene de Dios, que nos reconcilió consigo mismo por Cristo, y nos dio el ministerio de la reconciliación... Así que, somos embajadores en nombre de Cristo.»',
        explicacion: 'San Pablo enseña que Dios instituyó un «ministerio de reconciliación» ejercido por embajadores humanos.'
      },
      {
        cita: 'Santiago 5, 14-16',
        texto: '«¿Está alguno enfermo entre vosotros? Llame a los presbíteros de la iglesia... y si hubiere cometido pecados, le serán perdonados. Confesaos vuestras ofensas unos a otros.»',
        explicacion: 'La Escritura conecta el perdón de los pecados con la intervención de los presbíteros (sacerdotes).'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Basilio Magno',
      fecha: 'Año 370 d.C.',
      obra: 'Reglas Mayores, 288',
      cita: '«Es necesario confesar los pecados a aquellos a quienes se les ha confiado la administración de los misterios de Dios; porque así también aquellos que se arrepentían en tiempos de los Apóstoles los confesaban a ellos.»'
    },
    respuestaRapidaWhatsApp: 'Dios ciertamente tiene el poder de perdonar directo, pero Jesús quiso dejarnos la certeza sensible de su perdón. En Juan 20, 21-23, Cristo resucitado sopló sobre los apóstoles y les dijo: «A quienes perdonéis los pecados, les quedan perdonados; a quienes se los retengáis, les quedan retenidos». Si el perdón fuera solo íntimo y sin sacerdote, las palabras de Jesús en la Biblia no tendrían ningún sentido.',
    doctrinaMagisterio: 'El Concilio de Trento definió solemnemente que la confesión sacramental de los pecados mortales cometidos tras el Bautismo fue instituida por derecho divino y no es una invención humana de la Iglesia.'
  },

  'eucaristia-presencia-real': {
    tema: 'La Eucaristía: Presencia Real vs. Mero Símbolo',
    objecion: '«Jesús sólo hablaba en sentido metafórico o simbólico cuando dijo "esto es mi cuerpo". La cena del Señor es sólo un recuerdo o memorial simbólico.»',
    confusion: 'Pasan por alto que en Juan 6 Jesús usó el verbo griego «trogein» (masticar/comer físicamente) y dejó que muchos discípulos lo abandonaran antes que rebajar sus palabras a una simple metáfora.',
    versiculos: [
      {
        cita: 'San Juan 6, 51-56',
        texto: '«El pan que yo daré es mi carne por la vida del mundo... Mi carne es verdadera comida, y mi sangre es verdadera bebida. El que come mi carne y bebe mi sangre, en mí permanece, y yo en él.»',
        explicacion: 'Cuando los judíos se escandalizaron («¿Cómo puede este darnos a comer su carne?»), Jesús no dijo: «calma, es una metáfora». Al contrario, reforzó la afirmación con juramento («En verdad, en verdad os digo»).'
      },
      {
        cita: '1 Corintios 11, 27-29',
        texto: '«De manera que cualquiera que comiere este pan o bebiere esta copa del Señor indignamente, será culpado del cuerpo y de la sangre del Señor... porque el que come y bebe indignamente, come y bebe condenación para sí, no discerniendo el cuerpo del Señor.»',
        explicacion: 'Nadie se hace reo de «la muerte y cuerpo del Señor» ni se condena por comer un simple pedazo de pan simbólico. La advertencia de San Pablo sólo tiene sentido si Cristo está realmente presente en cuerpo, sangre, alma y divinidad.'
      },
      {
        cita: 'San Mateo 26, 26-28',
        texto: '«Tomad, comed; esto ES mi cuerpo... Bebed de ella todos; porque esto ES mi sangre.»',
        explicacion: 'Jesús no dijo «esto representa» o «esto simboliza mi cuerpo». Dijo taxativamente: «Esto ES mi cuerpo».'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Ignacio de Antioquía',
      fecha: 'Año 107 d.C. (Obispo y mártir, discípulo de San Juan Apóstol)',
      obra: 'Carta a los Esmirniotas, 7, 1',
      cita: '«Se abstienen de la Eucaristía y de la oración, porque no confiesan que la Eucaristía es la carne de nuestro Salvador Jesucristo, la misma que padeció por nuestros pecados y que el Padre resucitó por su bondad.»'
    },
    respuestaRapidaWhatsApp: 'En Juan 6, 55 Jesús dice textualmente: «Mi carne es VERDADERA comida y mi sangre es VERDADERA bebida». En 1 Corintios 11, 29 San Pablo advierte que quien come la Eucaristía indignamente peca «contra el Cuerpo y la Sangre del Señor» y se condena. Si fuera un simple símbolo o galleta conmemorativa, profanarla no traería condenación sobre el alma. Desde el año 100 d.C., los cristianos ya creían en la Presencia Real.',
    doctrinaMagisterio: 'La transustanciación es el dogma de fe proclamado por la Iglesia Católica: por las palabras de la consagración, toda la sustancia del pan se convierte en el Cuerpo de Cristo y toda la sustancia del vino en su Sangre, permaneciendo intactos los accidentes sensibles.'
  },

  'imagenes-idolatria': {
    tema: 'Imágenes Sagradas frente a los Ídolos Paganos',
    objecion: '«En Éxodo 20:4 Dios prohíbe taxativamente hacerse imágenes de lo que hay arriba en el cielo o abajo en la tierra. La Iglesia Católica desobedece la Biblia al tener estatuas y cuadros.»',
    confusion: 'Confunden la prohibición de «fabricar ídolos para adorarlos como dioses falsos» (pesel / idolatría) con el uso religioso, pedagógico y conmemorativo de imágenes de seres santos.',
    versiculos: [
      {
        cita: 'Éxodo 25, 18-20',
        texto: '«Harás también dos querubines de oro; labrados a martillo los harás en los dos extremos del propiciatorio.»',
        explicacion: 'Solo cinco capítulos después de Éxodo 20, el mismo Dios MANDA a construir estatuas de dos ángeles (querubines con alas) sobre el objeto más sagrado de Israel: el Arca de la Alianza.'
      },
      {
        cita: 'Números 21, 8-9',
        texto: '«Y Yahveh dijo a Moisés: Hazte una serpiente ardiente, y ponla sobre una asta; y cualquiera que fuere mordido y mirare a ella, vivirá. Y Moisés hizo una serpiente de bronce.»',
        explicacion: 'Dios manda esculpir una serpiente de bronce para sanar al pueblo. Dios no se contradice: lo prohibido es adorar la imagen como un dios, no hacer una imagen que apunte a la gloria de Dios.'
      },
      {
        cita: '1 Reyes 6, 23-35',
        texto: '«Hizo también en el santuario dos querubines de madera de olivo... y esculpió en todas las paredes de la casa alrededor figuras de querubines, palmeras y flores abiertas.»',
        explicacion: 'El Templo de Salomón, bendecido solemnemente por la gloria de Dios, estaba repleto de esculturas de ángeles y plantas.'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Juan Damasceno',
      fecha: 'Año 730 d.C.',
      obra: 'Apología contra los que rechazan las Sagradas Imágenes',
      cita: '«Antiguamente Dios, al no tener cuerpo ni forma, no podía ser representado en imágenes. Pero ahora que Dios se ha manifestado en la carne y ha habitado entre los hombres, represento lo que se ha hecho visible de Dios... No adoro la materia, sino al Creador de la materia que por mí se hizo materia.»'
    },
    respuestaRapidaWhatsApp: 'La Biblia prohíbe los ÍDOLOS (dioses falsos que sustituyen a Dios, Ex 20,4), no las imágenes sagradas. Si Dios prohibiera toda imagen, se habría contradicho en Éxodo 25,18 cuando mandó fabricar dos esculturas de ángeles (querubines de oro) sobre el Arca, o en Números 21,8 cuando mandó hacer la serpiente de bronce. Los católicos no adoramos el yeso ni la madera; honramos la memoria de la persona representada, igual que guardas la foto de tu madre.',
    doctrinaMagisterio: 'El II Concilio de Nicea (año 787 d.C.) y el Concilio de Trento definieron que el honor tributado a la imagen sagrada se dirige y transfiere al prototipo (la persona representada: Cristo, la Virgen o los santos), distinguiendo claramente la adoración (latría, debida solo a Dios) de la veneración (dulía).'
  },

  'purgatorio': {
    tema: 'El Purgatorio y la Purificación Post-mortem',
    objecion: '«La palabra "purgatorio" no aparece en ninguna parte de la Biblia. Es un invento de la Iglesia Católica para lucrar con misas de difuntos.»',
    confusion: 'Creen falsamente que porque una palabra teológica no esté literal en el texto, el concepto no existe. Tampoco la palabra «Trinidad» ni «Encarnación» están en la Biblia, y sin embargo son verdades bíblicas indiscutibles.',
    versiculos: [
      {
        cita: '1 Corintios 3, 12-15',
        texto: '«La obra de cada uno se hará manifiesta; porque el día la declarará, pues por el fuego será revelada... Si la obra de alguno se quemare, él sufrirá pérdida, si bien él mismo será salvo, aunque así como a través del fuego.»',
        explicacion: 'San Pablo describe un estado donde el alma sufre una pérdida purificadora («como a través del fuego»), pero finalmente «se salvará». No es el Infierno (de donde nadie se salva) ni es el Cielo (donde no hay pérdida ni fuego). Es la purificación del Purgatorio.'
      },
      {
        cita: '2 Macabeos 12, 43-46',
        texto: '«Y habiendo hecho una colecta... mandó a Jerusalén a ofrecer sacrificio por el pecado... Es, pues, un santo y piadoso pensamiento orar por los difuntos, para que sean libres de sus pecados.»',
        explicacion: 'La Escritura declara que orar por los muertos es una obra santa para que queden limpios de sus culpas.'
      },
      {
        cita: 'San Mateo 12, 32',
        texto: '«A cualquiera que dijere alguna palabra contra el Espíritu Santo, no le será perdonado, ni en este siglo ni en el venidero.»',
        explicacion: 'Jesucristo mismo enseña que existen ciertos pecados que sí pueden ser perdonados en «el siglo venidero» (después de la muerte).'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Agustín de Hipona',
      fecha: 'Año 420 d.C.',
      obra: 'Confesiones, Libro IX, cap. 13',
      cita: '«Mi madre Santa Mónica antes de morir solo me pidió una cosa: "Enterrad este cuerpo dondequiera; solo os pido que os acordéis de mí ante el altar del Señor dondequiera que estéis". La Iglesia universal observa la tradición recibida de los Padres de orar por los difuntos.»'
    },
    respuestaRapidaWhatsApp: 'La palabra «Trinidad» tampoco está en la Biblia y todos los cristianos la creemos. Lo importante es el concepto: en Apocalipsis 21, 27 dice que «nada manchado entrará en el Cielo». Si alguien muere en gracia de Dios pero con apegos o faltas veniales, no va al infierno (porque es salvo), pero necesita purificarse antes de ver a Dios cara a cara. San Pablo lo explica en 1 Corintios 3, 15: «él mismo se salvará, pero como a través del fuego».',
    doctrinaMagisterio: 'El Catecismo (n. 1030-1031) define el Purgatorio como la purificación final de los elegidos, enteramente distinta del castigo de los condenados en el Infierno.'
  },

  'pedro-y-el-papa': {
    tema: 'El Primado de San Pedro y el Papado',
    objecion: '«Jesús no fundó el Papado. Cuando dijo "sobre esta piedra edificaré mi iglesia" se refería a sí mismo o a la fe de Pedro, no a la persona de Simón.»',
    confusion: 'Ignoran el trasfondo arameo original en el que habló Jesús (Kepha / Kepha) y el paralelismo profético con Isaías 22, 22 donde se entregan las llaves del mayordomo real.',
    versiculos: [
      {
        cita: 'San Mateo 16, 18-19',
        texto: '«Y yo también te digo, que tú eres Pedro (Kepha), y sobre esta roca (Kepha) edificaré mi iglesia; y las puertas del Hades no prevalecerán contra ella. Y a ti te daré las llaves del reino de los cielos; y todo lo que atares en la tierra será atado en los cielos.»',
        explicacion: 'Jesús le cambia el nombre a Simón por «Roca» (Pedro). En la Biblia, cuando Dios cambia el nombre a un hombre (Abram -> Abraham; Jacob -> Israel), le confiere una misión fundacional e histórica.'
      },
      {
        cita: 'San Juan 21, 15-17',
        texto: '«Jesús dijo a Simón Pedro: Simón, hijo de Jonás, ¿me amas más que estos?... Apacienta mis corderos... Pastorea mis ovejas... Apacienta mis ovejas.»',
        explicacion: 'Jesús confía el pastoreo de TODO su rebaño a Pedro de forma singular y suprema.'
      },
      {
        cita: 'San Lucas 22, 31-32',
        texto: '«Simón, Simón, he aquí Satanás os ha pedido para zarandearos como a trigo; pero yo he rogado por ti, que tu fe no falte; y tú, una vez vuelto, confirma a tus hermanos.»',
        explicacion: 'Cristo reza por Pedro específicamente para que ejerza el ministerio de confirmar en la fe al resto de los Apóstoles.'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Cipriano de Cartago',
      fecha: 'Año 250 d.C.',
      obra: 'La Unidad de la Iglesia Católica, 4',
      cita: '«Sobre uno solo edifica su Iglesia, y aunque a todos los apóstoles confiere igual potestad, sin embargo, para manifestar la unidad, dispuso un origen para esa misma unidad que empieza en uno solo: Pedro tiene el primado para que se muestre una sola Iglesia de Cristo.»'
    },
    respuestaRapidaWhatsApp: 'En Mateo 16, 18 Jesús le cambia solemnemente el nombre a Simón: «Tú eres Pedro (Roca) y sobre esta Roca edificaré mi Iglesia». En arameo, Jesús usó la misma palabra: «Tú eres Kepha y sobre este Kepha edificaré». Además, le entrega las «llaves del Reino», una cita directa de Isaías 22, 22 donde el Rey nombra al primer ministro con autoridad sucesiva de atar y desatar. El obispo de Roma es el legítimo sucesor de Pedro.',
    doctrinaMagisterio: 'El Concilio Vaticano I definió el dogma del primado pontificio y la infalibilidad papal cuando el Sucesor de Pedro define solemnemente «ex cathedra» doctrinas en materia de fe o de moral para toda la Iglesia universal.'
  },

  'virgen-hermanos': {
    tema: 'La Virginidad Perpetua y los "Hermanos de Jesús"',
    objecion: '«En la Biblia se habla de los "hermanos y hermanas" de Jesús (Santiago, José, Simón y Judas). Por tanto, María tuvo más hijos después de Jesús y no fue siempre virgen.»',
    confusion: 'Desconocen que en las lenguas semíticas (hebreo y arameo) no existía una palabra separada para «primo», «tío» o «sobrino»; todos se llamaban «hermanos» (aj / ajot), y la traducción griega (adelfos) preservó ese uso bíblico.',
    versiculos: [
      {
        cita: 'Génesis 13, 8 y Génesis 14, 14',
        texto: '«Dijo Abram a Lot: No haya altercado entre nosotros, porque somos hermanos... Al oír Abram que su hermano estaba prisionero...»',
        explicacion: 'La Biblia llama a Lot «hermano» de Abraham, a pesar de que Génesis 11, 27 aclara expresamente que Lot era su SOBRINO (hijo de su hermano Harán).'
      },
      {
        cita: 'San Mateo 27, 56 y San Juan 19, 25',
        texto: '«Entre las cuales estaban María Magdalena, María la madre de Santiago y de José... Estaban junto a la cruz de Jesús su madre, y la hermana de su madre, María mujer de Cleofás...»',
        explicacion: 'El Santiago y José llamados «hermanos de Jesús» en Mateo 13, 55 eran en realidad hijos de OTRA María, mujer de Cleofás y parienta de la Virgen María.'
      },
      {
        cita: 'San Juan 19, 26-27',
        texto: '«Cuando vio Jesús a su madre, y al discípulo a quien él amaba presente, dijo a su madre: Mujer, he ahí tu hijo. Después dijo al discípulo: He ahí tu madre. Y desde aquella hora el discípulo la recibió en su casa.»',
        explicacion: 'Si Jesús hubiera tenido hermanos de sangre, por ley judía y deber moral le correspondía a ellos cuidar a María. Haber entregado a su Madre al apóstol Juan (que no era de la familia) habría sido una ofensa gravísima e inexplicable en el Israel bíblico.'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Jerónimo',
      fecha: 'Año 383 d.C. (Traductor oficial de la Biblia Vulgata)',
      obra: 'La Perpetua Virginidad de la Bienaventurada María',
      cita: '«Tú dices que María no permaneció virgen; yo reclamo aún más: que el mismo José fue virgen a través de María, para que un hijo virgen naciera de un matrimonio virgen... La Escritura llama hermanos a los parientes cercanos según la costumbre hebrea.»'
    },
    respuestaRapidaWhatsApp: 'En la Biblia en hebreo y arameo la palabra «hermano» abarca a primos y sobrinos. Por ejemplo, en Génesis 13, 8 se llama «hermano» a Lot respecto a Abraham, cuando en realidad era su sobrino. Además, Mateo 27, 56 demuestra que Santiago y José eran hijos de otra María (esposa de Cleofás). Y en la Cruz (Jn 19, 26), Jesús encomendó el cuidado de su Madre al apóstol Juan; si María hubiera tenido más hijos, habría sido un delito moral e ilegal dejarla a cargo de un extraño.',
    doctrinaMagisterio: 'La Iglesia profesa como dogma desde el Concilio de Constantinopla II (año 553 d.C.) que María es «siempre Virgen» (antes del parto, en el parto y perpetuamente después del parto).'
  },

  'fe-y-obras': {
    tema: 'La Justificación: Fe y Obras frente a la Sola Fide',
    objecion: '«Nos salvamos únicamente por la fe (Sola Fide), no por obras, para que nadie se gloríe (Efesios 2:8-9). Decir que las obras salvan es negar la gracia de Cristo.»',
    confusion: 'Confunden las «obras de la Ley mosaica judía» (circuncisión, dietas de Levítico, de las que habla Pablo en Romanos) con las «obras de amor y caridad nacidas de la gracia viva» de las que habla Santiago y Jesús en Mateo 25.',
    versiculos: [
      {
        cita: 'Santiago 2, 24-26',
        texto: '«Vosotros veis, pues, que el hombre es justificado por las obras, y no solamente por la fe... Porque como el cuerpo sin espíritu está muerto, así también la fe sin obras está muerta.»',
        explicacion: 'Es el ÚNICO lugar en toda la Biblia donde aparecen juntas las palabras «fe solamente», ¡y es para decir que el hombre NO es justificado por la sola fe!'
      },
      {
        cita: 'Gálatas 5, 6',
        texto: '«Porque en Cristo Jesús ni la circuncisión vale algo, ni la incircuncisión, sino la fe que obra por el amor.»',
        explicacion: 'San Pablo define la verdadera fe salvífica: aquella que «obra por la caridad».'
      },
      {
        cita: 'San Mateo 25, 31-46 (El Juicio Final)',
        texto: '«Venid, benditos de mi Padre, heredad el reino... Porque tuve hambre, y me disteis de comer; tuve sed, y me disteis de beber... Apartaos de mí, malditos... porque tuve hambre y no me disteis de comer.»',
        explicacion: 'Jesucristo mismo revela el examen final de la salvación: no seremos juzgados por haber tenido una creencia abstracta, sino por el amor real y las obras de misericordia hechas a los más pequeños.'
      }
    ],
    padresDeLaIglesia: {
      santo: 'San Agustín de Hipona',
      fecha: 'Año 412 d.C.',
      obra: 'De Fide et Operibus (Sobre la fe y las obras), 14, 21',
      cita: '«Quienes dicen que basta la sola fe para salvarse y descuidan las buenas obras, ignoran lo que enseña el Apóstol Santiago: los demonios también creen y tiemblan. La fe que salva es la que no puede ser ociosa, sino que arde en caridad viva.»'
    },
    respuestaRapidaWhatsApp: 'La gracia de Dios es un don 100% gratuito que no podemos comprar (Ef 2, 8). Pero esa fe, para estar viva, debe dar fruto en caridad. El ÚNICO versículo en toda la Biblia donde aparecen juntas las palabras «sola fe» es Santiago 2, 24: «El hombre es justificado por las obras y NO SOLAMENTE POR LA FE». En Mateo 25, Jesús juzga la salvación eterna de cada persona según sus obras de misericordia con los hambrientos, sedientos y enfermos.',
    doctrinaMagisterio: 'El Concilio de Trento aclaró que la justificación no es un simple decreto externo donde Dios cubre el pecado, sino una verdadera renovación y santificación interior del alma cooperando con la gracia divina.'
  },

  'bautismo-infantes': {
    tema: 'El Bautismo de Niños e Infantes',
    objecion: '«Jesús se bautizó de adulto en el río Jordán. Los bebés no tienen pecado personal ni pueden confesar su fe, por lo que su bautismo es antibíblico e inválido.»',
    confusion: 'Ignoran que el Bautismo reemplazó a la Circuncisión como sello de la Alianza con Dios (Colosenses 2, 11-12), y que la circuncisión se hacía exactamente a los 8 días de nacido sin que el bebé diera su consentimiento intelectual.',
    versiculos: [
      {
        cita: 'Hechos 16, 31-33',
        texto: '«Cree en el Señor Jesucristo, y serás salvo, tú y tu casa... y se bautizó él con todos los suyos.»',
        explicacion: 'Los Apóstoles bautizaban «familias enteras» («con todos los suyos», «oikos»), lo cual en el mundo greco-romano incluía necesariamente a los niños y siervos del hogar.'
      },
      {
        cita: 'Colosenses 2, 11-12',
        texto: '«En él también fuisteis circuncidados con circuncisión no hecha a mano... sepultados con él en el bautismo.»',
        explicacion: 'San Pablo llama al Bautismo la «circuncisión de Cristo». Si los niños judíos entraban en la Antigua Alianza al octavo día de nacidos, ¿cómo va a ser la Nueva Alianza de Cristo más restrictiva y excluyente con los niños?'
      },
      {
        cita: 'San Mateo 19, 14',
        texto: '«Pero Jesús dijo: Dejad a los niños venir a mí, y no se lo impidáis; porque de los tales es el reino de los cielos.»',
        explicacion: 'Negar el sacramento de la gracia que lava el pecado original y hace hijos de Dios a los pequeños contradice el mandato directo de Cristo: «no se lo impidáis».'
      }
    ],
    padresDeLaIglesia: {
      santo: 'Orígenes de Alejandría',
      fecha: 'Año 248 d.C.',
      obra: 'Comentario a la Epístola a los Romanos, V, 9',
      cita: '«La Iglesia ha recibido de los Apóstoles la tradición de administrar el bautismo incluso a los párvulos. Porque aquellos a quienes fueron encomendados los secretos de los misterios divinos sabían que en todos existen las manchas del pecado original.»'
    },
    respuestaRapidaWhatsApp: 'Jesús dijo: «Dejad que los niños vengan a mí y no se lo impidáis» (Mt 19, 14). En el Antiguo Testamento los niños ingresaban al pueblo de Dios por la circuncisión a los 8 días de nacidos; en el Nuevo Testamento, San Pablo enseña que el Bautismo es la nueva circuncisión en Cristo (Col 2, 11-12). En los Hechos de los Apóstoles (Hch 16, 33) se bautizaban «familias enteras con todos los suyos». No prives a un hijo del regalo de ser hijo de Dios.',
    doctrinaMagisterio: 'El Código de Derecho Canónico (canon 867) y el Catecismo (n. 1250-1252) recuerdan que los niños, al nacer con una naturaleza humana caída por el pecado original, tienen necesidad de la gracia santificante que solo el Bautismo confiere para integrarse al Cuerpo Místico de Cristo.'
  }
};

/**
 * Busca la objeción apologética más cercana a una consulta o slug.
 */
export function findMatchingApologetica(query: string, temaId?: string): ApologeticaResponse {
  if (temaId && APOLOGETICA_CATALOGO[temaId]) {
    return APOLOGETICA_CATALOGO[temaId];
  }

  const q = (query || '').toLowerCase();

  // Virgen María mediadora / rezar a los santos
  if (/mediador|idolatr|rezar a maria|rezarle a los santos|santos|interces/i.test(q)) {
    return APOLOGETICA_CATALOGO['virgen-mediadora'];
  }
  // Confesión sacerdotes
  if (/confes|cura|sacerdote|perdon directo|padre pecador|hombre pecador/i.test(q)) {
    return APOLOGETICA_CATALOGO['confesion-sacerdotes'];
  }
  // Eucaristía presencia real
  if (/eucaristi|hostia|simbolo|carne y sangre|transustanci|cena del senor/i.test(q)) {
    return APOLOGETICA_CATALOGO['eucaristia-presencia-real'];
  }
  // Imágenes e ídolos
  if (/imagen|idolo|estatua|yeso|exodo 20|adorar imagenes/i.test(q)) {
    return APOLOGETICA_CATALOGO['imagenes-idolatria'];
  }
  // Purgatorio
  if (/purgatorio|fuego|difunto|almas|limbo/i.test(q)) {
    return APOLOGETICA_CATALOGO['purgatorio'];
  }
  // Pedro y el Papa
  if (/pedro|papa|roca|piedra|mateo 16|llaves|vaticano/i.test(q)) {
    return APOLOGETICA_CATALOGO['pedro-y-el-papa'];
  }
  // Hermanos de Jesús / Virginidad
  if (/hermano|maria virgen|perpetua virginidad|adelfos|primo/i.test(q)) {
    return APOLOGETICA_CATALOGO['virgen-hermanos'];
  }
  // Fe y Obras / Sola Fide
  if (/fe sola|sola fide|obras|justificac|salvacion por fe/i.test(q)) {
    return APOLOGETICA_CATALOGO['fe-y-obras'];
  }
  // Bautismo de niños
  if (/bautiz|bebe|nino|infante|jordan|adulto/i.test(q)) {
    return APOLOGETICA_CATALOGO['bautismo-infantes'];
  }

  return APOLOGETICA_CATALOGO['virgen-mediadora'];
}
