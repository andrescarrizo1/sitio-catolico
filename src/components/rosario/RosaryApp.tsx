import { useState, useEffect } from 'preact/hooks';
import RosaryVisualizer, { ROSARY_BEADS, type VisualBead } from './RosaryVisualizer';

// Definición de los 4 juegos de Misterios con meditaciones completas
interface MysteryDetail {
  numeroRomano: string;
  titulo: string;
  pasaje: string;
  fruto: string;
  meditacion: string;
}

interface MysterySet {
  nombre: string;
  diasOrdinarios: string;
  subtitulo: string;
  misterios: MysteryDetail[];
}

const MISTERIOS_DATA: Record<string, MysterySet> = {
  gozosos: {
    nombre: 'Misterios Gozosos',
    diasOrdinarios: 'Lunes y Sábados',
    subtitulo: 'La Encarnación del Verbo y la vida oculta de la Sagrada Familia',
    misterios: [
      {
        numeroRomano: 'I',
        titulo: 'La Anunciación y Encarnación del Hijo de Dios',
        pasaje: 'Lucas 1, 26-38',
        fruto: 'Humildad y disponibilidad total a la voluntad divina',
        meditacion: 'El arcángel San Gabriel es enviado por Dios a Nazaret para anunciar a la Virgen María que concebirá en su seno virginal por obra del Espíritu Santo al Salvador del mundo. María responde con fe y obediencia absoluta: «He aquí la esclava del Señor; hágase en mí según tu palabra». En ese instante sagrado, el Verbo divino se hizo carne y habitó entre nosotros.'
      },
      {
        numeroRomano: 'II',
        titulo: 'La Visitación de Nuestra Señora a su prima Santa Isabel',
        pasaje: 'Lucas 1, 39-56',
        fruto: 'Caridad fraterna y servicio al prójimo',
        meditacion: 'Sabiendo que su prima Isabel espera un hijo en su ancianidad, María parte con prontitud a la montaña de Judea para servirla y acompañarla. Al escuchar Isabel el saludo de María, Juan el Bautista salta de gozo en su vientre, e Isabel, llena del Espíritu Santo, proclama: «¡Bendita tú entre las mujeres y bendito el fruto de tu vientre!». María eleva su alma cantando el Magníficat.'
      },
      {
        numeroRomano: 'III',
        titulo: 'El Nacimiento del Niño Jesús en el portal de Belén',
        pasaje: 'Lucas 2, 1-20',
        fruto: 'Desprendimiento de los bienes terrenales y pobreza de espíritu',
        meditacion: 'No habiendo lugar para ellos en la posada, María da a luz al Salvador del mundo en un humilde establo de Belén, lo envuelve amorosamente en pañales y lo recuesta en un pesebre. Los ángeles del cielo cantan la gloria divina y anuncian la Buena Nueva a los pastores. El Creador del universo se abaja y se hace pequeño por amor a nuestra salvación.'
      },
      {
        numeroRomano: 'IV',
        titulo: 'La Presentación del Niño Jesús en el Templo',
        pasaje: 'Lucas 2, 21-38',
        fruto: 'Pureza de intención y obediencia a la ley divina',
        meditacion: 'Cumpliendo la ley mosaica, María y José llevan al Niño Jesús a Jerusalén para consagrarlo al Señor. El anciano Simeón, movido por el Espíritu Santo, lo toma en sus brazos y alaba a Dios llamándolo «Luz para iluminar a las naciones», mientras profetiza a la Virgen: «Una espada atravesará tu propia alma», anunciando su íntima unión con el sacrificio redentor de su Hijo.'
      },
      {
        numeroRomano: 'V',
        titulo: 'El Niño Jesús perdido y hallado en el Templo',
        pasaje: 'Lucas 2, 41-52',
        fruto: 'Búsqueda constante de Dios y fidelidad a la vocación',
        meditacion: 'A la edad de doce años, tras acudir a la fiesta de la Pascua en Jerusalén, Jesús permanece en la ciudad santa sin que sus padres lo adviertan. Tras tres días de angustiosa búsqueda, María y José lo encuentran en el Templo sentado en medio de los doctores de la ley, escuchándolos y asombrándolos con su sabiduría. Jesús les responde con santa docilidad: «¿No sabíais que debo ocuparme de las cosas de mi Padre?». Luego regresa a Nazaret sumiso a ellos.'
      },
    ],
  },
  dolorosos: {
    nombre: 'Misterios Dolorosos',
    diasOrdinarios: 'Martes y Viernes',
    subtitulo: 'La Pasión redentora y entrega expiatoria de Nuestro Señor Jesucristo',
    misterios: [
      {
        numeroRomano: 'I',
        titulo: 'La Agonía y Oración de Jesús en el Huerto de Getsemaní',
        pasaje: 'Mateo 26, 36-46',
        fruto: 'Contrición sincera de los pecados y conformidad con la voluntad del Padre',
        meditacion: 'En la soledad de la noche en el huerto de Getsemaní, Jesús carga sobre su Corazón el peso abominable de los pecados de toda la humanidad. En una angustia infinita, su sudor se convierte en densas gotas de sangre que caen a tierra. Postrado en tierra, Jesús nos enseña la cumbre de la oración: «Padre mío, si es posible, que pase de mí este cáliz; pero no se haga mi voluntad, sino la tuya».'
      },
      {
        numeroRomano: 'II',
        titulo: 'La Flagelación de Nuestro Señor atado a la columna',
        pasaje: 'Juan 19, 1-3',
        fruto: 'Mortificación de los sentidos y pureza de cuerpo y alma',
        meditacion: 'Para complacer a la multitud hostil, Pilato condena a Jesús a ser azotado. Los soldados romanos despojan de sus vestiduras a Cristo y lo atan a una columna de piedra, descargando brutales latigazos que desgarran su carne inmaculada. Jesús soporta este atroz tormento en manso silencio, ofreciendo cada llaga en expiación por los pecados de impureza y sensualidad de los hombres.'
      },
      {
        numeroRomano: 'III',
        titulo: 'La Coronación de espinas',
        pasaje: 'Mateo 27, 27-31',
        fruto: 'Humildad interior y desprecio de las vanidades mundanas',
        meditacion: 'Los soldados reúnen a toda la tropa militar en torno a Jesús para burlarse de su realeza. Le echan encima un manto de púrpura vieja, trenzan una corona de punzantes espinas y se la clavan en la cabeza; le ponen una caña como cetro y, arrodillándose ante Él con desprecio, le dicen: «¡Salve, Rey de los judíos!», escupiéndole y golpeándole la cabeza con la caña.'
      },
      {
        numeroRomano: 'IV',
        titulo: 'Jesús carga con la Cruz a cuestas camino al Calvario',
        pasaje: 'Lucas 23, 26-32',
        fruto: 'Paciencia heroica y perseverancia en las tribulaciones',
        meditacion: 'Condenado a muerte ignominiosa, Jesús toma sobre sus hombros lacerados el pesado madero de la cruz y emprende la penosa subida hacia el Gólgota. Agotado y ensangrentado, cae varias veces pero se levanta para cumplir la redención, encontrándose en el camino con su Santísima Madre. Jesús nos muestra que seguirle exige abrazar cada día nuestra propia cruz con amor.'
      },
      {
        numeroRomano: 'V',
        titulo: 'La Crucifixión y Muerte de Nuestro Señor Jesucristo',
        pasaje: 'Juan 19, 17-30',
        fruto: 'Amor a los enemigos, espíritu de perdón y salvación eterna',
        meditacion: 'Llegado al Calvario, Jesús es clavado de pies y manos en la cruz entre dos ladrones. Durante tres horas de agonía suprema, perdona a sus verdugos: «Padre, perdónalos porque no saben lo que hacen», abre las puertas del Paraíso al buen ladrón y nos entrega a su propia Madre en la persona de San Juan: «Mujer, ahí tienes a tu hijo... Ahí tienes a tu madre». Tras clamar «Todo está consumado», inclina la cabeza y entrega su espíritu.'
      },
    ],
  },
  gloriosos: {
    nombre: 'Misterios Gloriosos',
    diasOrdinarios: 'Miércoles y Domingos',
    subtitulo: 'El Triunfo sobre el pecado y la muerte, y la glorificación en el Cielo',
    misterios: [
      {
        numeroRomano: 'I',
        titulo: 'La Triunfante Resurrección de Jesucristo',
        pasaje: 'Mateo 28, 1-10',
        fruto: 'Fe viva, gozo pascual y resurrección espiritual',
        meditacion: 'Al amanecer del tercer día, la tierra tiembla y un ángel del Señor desciende del cielo y remueve la gran piedra del sepulcro. Jesús, con majestad y poder soberano, resucita victorioso de entre los muertos con un cuerpo glorioso e inmortal, destruyendo para siempre el imperio de la muerte y del pecado. El ángel anuncia a las santas mujeres: «No temáis; sé que buscáis a Jesús el crucificado. ¡No está aquí: ha resucitado, como lo había dicho!». Cristo vive y reina para siempre.'
      },
      {
        numeroRomano: 'II',
        titulo: 'La Admirable Ascensión de Jesús a los Cielos',
        pasaje: 'Hechos 1, 6-11',
        fruto: 'Firme esperanza y anhelo constante del Cielo',
        meditacion: 'Cuarenta días después de su Resurrección, tras instruir a sus apóstoles y darles el mandato misionero: «Id por todo el mundo y predicad el Evangelio a toda criatura», Jesús los conduce al Monte de los Olivos. Mientras los bendice con amor, se eleva visiblemente al cielo hasta que una nube lo oculta a sus miradas. Cristo entra victorioso en la gloria celestial y se sienta a la derecha del Padre como Mediador universal.'
      },
      {
        numeroRomano: 'III',
        titulo: 'La Venida del Espíritu Santo en Pentecostés',
        pasaje: 'Hechos 2, 1-13',
        fruto: 'Celo apostólico y amor ardiente a la Iglesia de Dios',
        meditacion: 'Estando los apóstoles reunidos en perseverante oración en el Cenáculo junto con María, la Madre de Jesús, sobreviene repentinamente del cielo un ruido como de un viento impetuoso que llena toda la casa. Aparecen lenguas como de fuego que se posan sobre cada uno de ellos. Llenos del Espíritu Santo y desprovistos de todo miedo, reciben los dones sagrados y salen con valentía apostólica a predicar la Verdad a todas las naciones.'
      },
      {
        numeroRomano: 'IV',
        titulo: 'La Asunción de la Santísima Virgen María en cuerpo y alma',
        pasaje: 'Munificentissimus Deus',
        fruto: 'Gracia de una santa muerte y devoción filial a Nuestra Señora',
        meditacion: 'Cumplido el curso de su vida terrenal, la Inmaculada Madre de Dios, que jamás conoció la mancha del pecado original ni la corrupción del sepulcro, es asunta en cuerpo y alma a la gloria eterna del cielo por el poder de Dios, acompañada por los coros angélicos. María es la primicia, signo de consuelo y esperanza cierta para toda la Iglesia peregrina que camina hacia la vida eterna.'
      },
      {
        numeroRomano: 'V',
        titulo: 'La Coronación de María Santísima como Reina universal',
        pasaje: 'Apocalipsis 12, 1',
        fruto: 'Perseverancia final y confianza ilimitada en la intercesión de la Virgen',
        meditacion: 'La Santísima Virgen es coronada solemnemente por la Santísima Trinidad como Reina de los cielos, de la tierra y de todas las criaturas. «Apareció en el cielo una gran señal: una mujer vestida del sol, con la luna bajo sus pies y una corona de doce estrellas sobre su cabeza». Como Madre del Rey de reyes, María es nuestra tierna Abogada que no cesa de interceder por la salvación de cada uno de sus hijos.'
      },
    ],
  },
  luminosos: {
    nombre: 'Misterios Luminosos',
    diasOrdinarios: 'Jueves (San Juan Pablo II, 2002)',
    subtitulo: 'La vida pública y las manifestaciones de la luz de Cristo',
    misterios: [
      {
        numeroRomano: 'I',
        titulo: 'El Bautismo de Jesús en el Río Jordán',
        pasaje: 'Mateo 3, 13-17',
        fruto: 'Fidelidad a las promesas y gracias del Santo Bautismo',
        meditacion: 'Jesús, inocente y libre de todo pecado, se sumerge en las aguas del río Jordán para cumplir toda justicia de parte de Dios. Al salir del agua, los cielos se abren, el Espíritu Santo desciende en forma visible de paloma y resuena la voz del Padre eterno: «Este es mi Hijo amado, en quien me complazco». Es la revelación solemne de la Santísima Trinidad al inicio de su ministerio público.'
      },
      {
        numeroRomano: 'II',
        titulo: 'La Autorrevelación en las Bodas de Caná',
        pasaje: 'Juan 2, 1-11',
        fruto: 'Confianza en la mediación de María y docilidad a las palabras de Cristo',
        meditacion: 'Durante una boda en Caná de Galilea, al advertir la falta de vino, la Santísima Virgen intercede con maternal delicadeza ante Jesús: «No tienen vino». A los servidores les encomienda la pauta perenne del cristiano: «Haced todo lo que Él os diga». Jesús obra su primer signo milagroso transformando tinajas de agua en el vino más selecto, manifestando su gloria y abriendo el corazón de sus discípulos a la fe.'
      },
      {
        numeroRomano: 'III',
        titulo: 'El Anuncio del Reino de Dios y la llamada a la conversión',
        pasaje: 'Marcos 1, 14-15',
        fruto: 'Arrepentimiento sincero de los pecados y acogida del perdón sacramental',
        meditacion: 'Jesús recorre los pueblos de Galilea proclamando el Evangelio de la salvación: «El tiempo se ha cumplido y el Reino de Dios está cerca: convertíos y creed en el Evangelio». Durante su ministerio terrenal perdona los pecados a quienes se acercan con dolor sincero, sana a los enfermos e inaugura el ministerio de la misericordia divina para reconciliar al hombre con Dios.'
      },
      {
        numeroRomano: 'IV',
        titulo: 'La Transfiguración en el Monte Tabor',
        pasaje: 'Lucas 9, 28-36',
        fruto: 'Deseo ardiente de santidad y escucha reverente de la Palabra de Dios',
        meditacion: 'Jesús sube a orar al monte Tabor con Pedro, Santiago y Juan. Mientras oraba, su rostro cambia de aspecto y sus vestiduras resplandecen con un brillo deslumbrante como el sol. Aparecen Moisés y Elías hablando con Él de su Pasión en Jerusalén. Una nube luminosa los cubre y resuena la voz del Padre: «Este es mi Hijo, el Elegido; escuchadle». Esta visión divina preparó a los apóstoles para sobrellevar el escándalo de la Cruz.'
      },
      {
        numeroRomano: 'V',
        titulo: 'La Institución de la Sagrada Eucaristía en la Última Cena',
        pasaje: 'Mateo 26, 26-29',
        fruto: 'Amor ardiente a la Santa Misa y adoración reverente al Sagrario',
        meditacion: 'En la noche de su entrega, reunido en el Cenáculo con los doce apóstoles, Jesús toma pan, lo bendice, lo parte y se lo da diciendo: «Tomad, comed; este es mi Cuerpo que es entregado por vosotros». Luego toma el cáliz con vino: «Bebed todos de él; porque esta es mi Sangre de la Nueva Alianza, derramada por muchos para remisión de los pecados. Haced esto en memoria mía». Instituye el Sacramento de su Presencia Real viva y el Sacerdocio católico.'
      },
    ],
  },
};

// Textos de las Oraciones en Español y Latín
interface PrayerText {
  nombreEs: string;
  nombreLa: string;
  textoEs: string;
  textoLa: string;
}

const ORACIONES: Record<string, PrayerText> = {
  actoContricion: {
    nombreEs: 'Acto de Contrición',
    nombreLa: 'Actus Contritionis',
    textoEs: 'Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser Vos quien sois, Bondad infinita, y porque os amo sobre todas las cosas, me pesa de todo corazón haberos ofendido. También me pesa porque podéis castigarme con las penas del infierno. Ayudado de vuestra divina gracia, propongo firmemente nunca más pecar, confesarme y cumplir la penitencia impuesta. Amén.',
    textoLa: 'Deus meus, ex toto corde me pænitet de ómnibus peccátis meis, eaque detéstor, quia peccándo offéndi Te, summe bonum et dignum qui super ómnia diligáris. Fírmiter propóno, adiuvánte grátia tua, de cétero me non peccatúrum, peccandíque occasiónes próximas fugitúrum. Amen.'
  },
  credo: {
    nombreEs: 'Símbolo de los Apóstoles (Credo)',
    nombreLa: 'Symbolum Apostolorum',
    textoEs: 'Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre Todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.',
    textoLa: 'Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ. Et in Iesum Christum, Fílium eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus, descéndit ad ínferos, tértia die resurréxit a mórtuis, ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis, inde ventúrus est iudicáre vivos et mórtuos. Credo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen.'
  },
  padreNuestro: {
    nombreEs: 'Padre Nuestro',
    nombreLa: 'Pater Noster',
    textoEs: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
    textoLa: 'Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum cotidiánum da nobis hódie, et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen.'
  },
  aveMariaEstandar: {
    nombreEs: 'Ave María',
    nombreLa: 'Ave Maria',
    textoEs: 'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
    textoLa: 'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.'
  },
  aveMariaLlamaAmor: {
    nombreEs: 'Ave María (con la súplica de la Llama de Amor)',
    nombreLa: 'Ave Maria (cum Flamma Amoris)',
    textoEs: 'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, derrama el efecto de gracia de tu Llama de Amor sobre toda la humanidad, ahora y en la hora de nuestra muerte. Amén.',
    textoLa: 'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, effúnde efféctum grátiæ Flammæ Amóris tuæ super totum genus humánum, nunc et in hora mortis nostræ. Amen.'
  },
  gloria: {
    nombreEs: 'Gloria al Padre',
    nombreLa: 'Gloria Patri',
    textoEs: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
    textoLa: 'Glória Patri, et Fílio, et Spíritui Sancto. Sicut erat in princípio, et nunc et semper, et in sæcula sæculórum. Amen.'
  },
  fatima: {
    nombreEs: 'Gloria y Jaculatoria de Fátima',
    nombreLa: 'Gloria Patri & Oratio Fatimae',
    textoEs: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.\n\n«¡Oh Jesús mío, perdónanos nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu divina misericordia!»',
    textoLa: 'Glória Patri, et Fílio, et Spíritui Sancto. Sicut erat in princípio, et nunc et semper, et in sæcula sæculórum. Amen.\n\n«O mi Iesu, dimítte nobis débita nostra, líbera nos ab igne inférni, conduc in cælum omnes ánimas, præsértim illas quæ máxime índigent misericórdia tua.»'
  },
  oracionAngelFatima: {
    nombreEs: 'Oración del Ángel de la Paz de Fátima (1916)',
    nombreLa: 'Oratio Angeli Fatimae',
    textoEs: '«¡Dios mío, yo creo, adoro, espero y te amo! Te pido perdón por los que no creen, no adoran, no esperan y no te aman.»\n\n«Santísima Trinidad, Padre, Hijo y Espíritu Santo, te adoro profundamente y te ofrezco el preciosísimo Cuerpo, Sangre, Alma y Divinidad de Jesucristo, presente en todos los sagrarios de la tierra, en reparación de los ultrajes, sacrilegios e indiferencias con que Él mismo es ofendido. Y por los méritos infinitos de su Sacratísimo Corazón y del Inmaculado Corazón de María, te pido la conversión de los pobres pecadores. Amén.»',
    textoLa: '«Deus meus, ego credo, adóro, spero et amo te. Pétito véniam pro iis qui non credunt, non adórant, non sperant et non amant te.» Amen.'
  },
  salve: {
    nombreEs: 'La Salve Regina',
    nombreLa: 'Salve Regina',
    textoEs: 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.',
    textoLa: 'Salve, Regína, Mater misericórdiæ, vita, dulcédo et spes nostra, salve. Ad te clamámus éxsules fílii Hevæ, ad te suspirámus geméntes et flentes in hac lacrimárum valle. Eia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum, benedíctum fructum ventris tui, nobis post hoc exsílium osténde. O clemens, o pia, o dulcis Virgo María. Ora pro nobis, Sancta Dei Génetrix, ut digni efficiámur promissiónibus Christi. Amen.'
  },
  sanMiguel: {
    nombreEs: 'Oración a San Miguel Arcángel (León XIII)',
    nombreLa: 'Oratio ad Sanctum Michaelem Archangelum',
    textoEs: 'San Miguel Arcángel, defiéndenos en la lucha. Sé nuestro amparo contra la perversidad y las acechanzas del demonio. Que Dios manifieste sobre él su poder, es nuestra humilde súplica; y tú, Príncipe de la Milicia Celestial, con el poder que Dios te ha conferido, arroja al infierno a Satanás y a los demás espíritus malignos que vagan por el mundo para la perdición de las almas. Amén.',
    textoLa: 'Sancte Míchael Archángele, defénde nos in prœ́lio; contra nequítiam et insídias diáboli esto præsídium. Ímperet illi Deus, súpplices deprecámur: tuque, Princeps milítiæ cæléstis, Sátanam aliósque spíritus malígnos, qui ad perditiónem animárum pervagántur in mundo, divína virtúte in inférnum detrúde. Amen.'
  },
  sanJose: {
    nombreEs: 'Oración a San José (Custodio del Redentor)',
    nombreLa: 'Oratio ad Sanctum Ioseph',
    textoEs: 'A ti, bienaventurado San José, acudimos en nuestra tribulación, y después de implorar el socorro de tu Santísima Esposa, solicitamos también confiadamente tu patrocinio. Concédenos defender a la Iglesia santa de Dios de toda adversidad y amparar a cada una de nuestras familias bajo tu perpetua protección. Amén.',
    textoLa: 'Ad te, beáte Ioseph, in tribulatióne nostra confúgimus, atque, imploráto Sponsæ tuæ sanctíssimæ auxílio, patrocínium quoque tuum fidenter exposcímus. Defénde, quæsumus, sanctam Dei Ecclésiam, et nos perpetuo patrocínio custódi. Amen.'
  },
  padreEterno: {
    nombreEs: 'Ofrecimiento del Padre Eterno (Cuenta Grande)',
    nombreLa: 'Pater Ætérne (Coronilla)',
    textoEs: 'Padre Eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, Nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.',
    textoLa: 'Pater Ætérne, óffero tibi Corpus et Sánguinem, ánimam et Divinitátem dilectíssimi Fílii tui, Dómini nostri Iesu Christi, in propitiatióne pro peccátis nostris et totíus mundi.'
  },
  porSuDolorosaPasion: {
    nombreEs: 'Súplica de la Pasión (10 Cuentas Pequeñas)',
    nombreLa: 'Pro dolorósa Eius Passióne',
    textoEs: 'Por su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.',
    textoLa: 'Pro dolorósa Eius Passióne, miserére nobis et totíus mundi.'
  },
  trisagioMisericordia: {
    nombreEs: 'Trisagio y Oración Conclusiva de la Divina Misericordia',
    nombreLa: 'Sanctus Deus & Oratio Conclusiva',
    textoEs: '«Santo Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.» (Se reza 3 veces)\n\n«Oh Dios Eterno, en quien la misericordia es infinita y el tesoro de compasión inagotable, vuelve a nosotros tu mirada bondadosa y aumenta tu misericordia en nosotros, para que en los momentos difíciles no desesperemos ni nos desalentemos, sino que con gran confianza nos sometamos a tu santa voluntad, que es el Amor y la Misericordia mismos. Amén.»\n\n«¡Jesús, en Ti confío!» (3 veces)',
    textoLa: '«Sanctus Deus, Sanctus Fortis, Sanctus Immortális, miserére nobis et totíus mundi.» (ter dicitur)\n\n«Deus Ætérne, in quo misericórdia est infiníta et thesáurus compassiónis inexhaustus, réspice benígnus super nos et multíplica in nobis misericórdiam tuam, ut in moméntis difficílibus non desperémus, sed cum magna confidéntia sanctæ voluntáti tuæ nos submittámus, quæ est ipse Amor et Misericórdia. Amen.»\n\n«Iesu, in Te confído!» (ter)'
  },
  senalCruzCoronilla: {
    nombreEs: 'Señal de la Cruz y Ofrecimiento Inicial',
    nombreLa: 'Signum Crucis & Oblatio',
    textoEs: 'Por la señal de la Santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.\n\n«Espiraste, Jesús, pero la fuente de vida brotó para las almas y el mar de misericordia se abrió para el mundo entero. ¡Oh fuente de vida, insondable Misericordia Divina, abarca al mundo entero y derrámate sobre nosotros!»',
    textoLa: 'Per signum Sanctæ Crucis de inimícis nostris líbera nos, Deus noster. In nómine Patris, et Fílii, et Spíritus Sancti. Amen.\n\n«Exspirásti, Iesu, sed fons vitæ scaturívit pro animábus et oceanus misericórdiæ pro toto mundo apértus est. O Fons Vitæ, inscrutábilis Divína Misericórdia, cómprehende totum mundum et effúnde te super nos!»'
  }
};

const CORONILLA_INTENCIONES = [
  {
    numeroRomano: 'I',
    titulo: 'Por la Santa Iglesia Católica, el Papa y los Sacerdotes',
    pasaje: 'Diario de Santa Faustina, 1088',
    fruto: 'Fidelidad sacerdotal y santidad ministerial',
    meditacion: 'Jesús dijo a Santa Faustina: «Hija mía, ruega especialmente por los sacerdotes; a través de ellos mi misericordia se derrama sobre las almas». Ofrecemos esta primera decena por la fidelidad inquebrantable de los ministros del altar y el fortalecimiento de la Iglesia.',
  },
  {
    numeroRomano: 'II',
    titulo: 'Por la Conversión de los Pecadores y el Mundo Entero',
    pasaje: 'Diario de Santa Faustina, 1146',
    fruto: 'Arrepentimiento sincero y retorno a los sacramentos',
    meditacion: '«Deseo que el mundo entero conozca mi misericordia; quien no quiera pasar por la puerta de mi misericordia, tendrá que pasar por la puerta de mi justicia». Oramos por las almas más endurecidas en el mal, para que reciban la gracia del perdón.',
  },
  {
    numeroRomano: 'III',
    titulo: 'Por los Moribundos y Agonizantes en este Día',
    pasaje: 'Diario de Santa Faustina, 1541',
    fruto: 'Salvación eterna y confianza en la hora de la muerte',
    meditacion: '«Cuando recen esta coronilla junto a los moribundos, me pondré entre mi Padre y el alma agonizante, no como Juez justo, sino como Salvador misericordioso». Encomendamos a todos los que hoy partirán de esta vida terrena.',
  },
  {
    numeroRomano: 'IV',
    titulo: 'Por las Almas del Purgatorio y las más Olvidadas',
    pasaje: 'Diario de Santa Faustina, 1226',
    fruto: 'Alivio del sufrimiento purificador y entrada a la gloria',
    meditacion: '«Trae hoy a mi Corazón a las almas retenidas en el Purgatorio y sumérgelas en el abismo de mi misericordia; que los torrentes de mi Sangre apaguen sus llamas devoradoras». Oramos por el descanso eterno de los fieles difuntos.',
  },
  {
    numeroRomano: 'V',
    titulo: 'Por la Paz del Mundo y la Plena Confianza en Cristo',
    pasaje: 'Diario de Santa Faustina, 48',
    fruto: 'Paz interior, cese de las guerras y abandono en la Divina Providencia',
    meditacion: '«La humanidad no encontrará la paz hasta que no se dirija con confianza a mi Divina Misericordia». Concluimos pidiendo el cese de los conflictos, la concordia en las familias y la fortaleza para exclamar: ¡Jesús, en Ti confío!',
  },
];

// Determinar el misterio recomendado según el día local
function getDailyMysteryKey(): string {
  const day = new Date().getDay();
  switch (day) {
    case 1: // Lunes
    case 6: // Sábado
      return 'gozosos';
    case 2: // Martes
    case 5: // Viernes
      return 'dolorosos';
    case 4: // Jueves
      return 'luminosos';
    case 3: // Miércoles
    case 0: // Domingo
    default:
      return 'gloriosos';
  }
}

// Reproducción de campanilla armónica con Web Audio API
function playSacredChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(739.99, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  } catch (e) {
    // Silencio seguro
  }
}

export default function RosaryApp() {
  const [prayerType, setPrayerType] = useState<'rosario' | 'coronilla'>('rosario');
  const [activeKey, setActiveKey] = useState<string>('gloriosos');
  const [isPrayerStarted, setIsPrayerStarted] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Opciones de devociones añadidas (para el Santo Rosario)
  const [includeFlameOfLove, setIncludeFlameOfLove] = useState<boolean>(false);
  const [includeAngelPrayer, setIncludeAngelPrayer] = useState<boolean>(true);
  const [includeActOfContrition, setIncludeActOfContrition] = useState<boolean>(true);
  const [includeSanMiguel, setIncludeSanMiguel] = useState<boolean>(true);
  const [includeSanJose, setIncludeSanJose] = useState<boolean>(false);

  const [stage, setStage] = useState<'intro' | 'decena' | 'salve'>('intro');
  const [currentDecade, setCurrentDecade] = useState<number>(0); // 0 a 4
  const [currentBead, setCurrentBead] = useState<number>(0);
  const [language, setLanguage] = useState<'es' | 'la'>('es');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    // En entorno local (localhost), desregistrar service worker para evitar colisiones de caché con CSS
    if ('serviceWorker' in navigator) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (const reg of regs) reg.unregister();
        });
        if ('caches' in window) {
          caches.keys().then((keys) => {
            for (const key of keys) caches.delete(key);
          });
        }
      } else if (window.location.pathname.startsWith('/rosario')) {
        navigator.serviceWorker.register('/sw-rosario.js', { scope: '/rosario/' }).catch(() => {});
      }
    }

    const savedPrayerType = localStorage.getItem('rosary_prayer_type') as 'rosario' | 'coronilla' | null;
    if (savedPrayerType === 'coronilla' || savedPrayerType === 'rosario') {
      setPrayerType(savedPrayerType);
    }

    const savedKey = localStorage.getItem('rosary_active_set');
    if (savedKey && MISTERIOS_DATA[savedKey]) {
      setActiveKey(savedKey);
    } else {
      setActiveKey(getDailyMysteryKey());
    }

    const savedFlame = localStorage.getItem('rosary_flame');
    if (savedFlame !== null) setIncludeFlameOfLove(savedFlame === 'true');

    const savedAngel = localStorage.getItem('rosary_angel');
    if (savedAngel !== null) setIncludeAngelPrayer(savedAngel === 'true');

    const savedContrition = localStorage.getItem('rosary_contrition');
    if (savedContrition !== null) setIncludeActOfContrition(savedContrition === 'true');

    const savedSanMiguel = localStorage.getItem('rosary_san_miguel');
    if (savedSanMiguel !== null) setIncludeSanMiguel(savedSanMiguel === 'true');

    const savedSanJose = localStorage.getItem('rosary_san_jose');
    if (savedSanJose !== null) setIncludeSanJose(savedSanJose === 'true');

    const savedLang = localStorage.getItem('rosary_lang') as 'es' | 'la' | null;
    if (savedLang) setLanguage(savedLang);

    const savedSound = localStorage.getItem('rosary_sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    // Manejador de teclado accesible
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        nextBead();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevBead();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, currentDecade, currentBead, soundEnabled, vibrateEnabled, isPrayerStarted, prayerType]);

  const persistState = (newStage: 'intro' | 'decena' | 'salve', newDecade: number, newBead: number) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rosary_decade', newDecade.toString());
    localStorage.setItem('rosary_bead', newBead.toString());
  };

  const switchPrayerType = (type: 'rosario' | 'coronilla') => {
    setPrayerType(type);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rosary_prayer_type', type);
    }
    setStage('intro');
    setCurrentDecade(0);
    setCurrentBead(0);
  };

  const selectMystery = (key: string) => {
    setActiveKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rosary_active_set', key);
    }
  };

  const startRosary = () => {
    if (prayerType === 'coronilla') {
      setStage('intro');
    } else {
      setStage(includeActOfContrition ? 'intro' : 'decena');
    }
    setCurrentDecade(0);
    setCurrentBead(0);
    setIsPrayerStarted(true);
    setShowConfigModal(false);
  };

  const triggerFeedback = () => {
    if (soundEnabled) playSacredChime();
    if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  const nextBead = () => {
    if (!isPrayerStarted) {
      startRosary();
      return;
    }

    triggerFeedback();

    if (stage === 'intro') {
      if (prayerType === 'coronilla') {
        if (currentBead < 3) {
          setCurrentBead(currentBead + 1);
        } else {
          setStage('decena');
          setCurrentDecade(0);
          setCurrentBead(0);
          persistState('decena', 0, 0);
        }
        return;
      }

      const maxIntro = includeActOfContrition ? 5 : 4;
      if (currentBead < maxIntro) {
        setCurrentBead(currentBead + 1);
      } else {
        setStage('decena');
        setCurrentDecade(0);
        setCurrentBead(0);
        persistState('decena', 0, 0);
      }
      return;
    }

    if (stage === 'decena') {
      if (currentBead < 11) {
        const next = currentBead + 1;
        setCurrentBead(next);
        persistState('decena', currentDecade, next);
      } else {
        if (currentDecade < 4) {
          const nextDec = currentDecade + 1;
          setCurrentDecade(nextDec);
          setCurrentBead(0);
          persistState('decena', nextDec, 0);
        } else {
          setStage('salve');
          setCurrentBead(0);
          persistState('salve', 4, 11);
        }
      }
      return;
    }

    if (stage === 'salve') {
      resetCounter(false);
    }
  };

  const prevBead = () => {
    if (stage === 'salve') {
      setStage('decena');
      setCurrentDecade(4);
      setCurrentBead(11);
      persistState('decena', 4, 11);
      return;
    }

    if (stage === 'decena') {
      if (currentBead > 0) {
        const prev = currentBead - 1;
        setCurrentBead(prev);
        persistState('decena', currentDecade, prev);
      } else if (currentDecade > 0) {
        const prevDec = currentDecade - 1;
        setCurrentDecade(prevDec);
        setCurrentBead(11);
        persistState('decena', prevDec, 11);
      } else {
        setStage('intro');
        if (prayerType === 'coronilla') {
          setCurrentBead(3);
        } else {
          setCurrentBead(includeActOfContrition ? 5 : 4);
        }
      }
      return;
    }

    if (stage === 'intro' && currentBead > 0) {
      setCurrentBead(currentBead - 1);
    }
  };

  const jumpToDecade = (decIndex: number) => {
    setIsPrayerStarted(true);
    setStage('decena');
    setCurrentDecade(decIndex);
    setCurrentBead(0);
    persistState('decena', decIndex, 0);
  };

  const resetCounter = (askConfirmation = true) => {
    if (!askConfirmation || confirm('¿Deseas reiniciar el rezo a la primera cuenta?')) {
      setStage('intro');
      setCurrentDecade(0);
      setCurrentBead(0);
      persistState('intro', 0, 0);
    }
  };

  const handleSelectSvgBead = (bead: VisualBead) => {
    setIsPrayerStarted(true);
    triggerFeedback();

    if (bead.tipo === 'cruz') {
      setStage('intro');
      setCurrentBead(0);
      return;
    }
    if (bead.id === 'bead-intro-pater') {
      setStage('intro');
      setCurrentBead(prayerType === 'coronilla' ? 1 : (includeActOfContrition ? 2 : 1));
      return;
    }
    if (bead.id === 'bead-intro-ave-1') {
      setStage('intro');
      setCurrentBead(prayerType === 'coronilla' ? 2 : (includeActOfContrition ? 3 : 2));
      return;
    }
    if (bead.id === 'bead-intro-ave-2') {
      setStage('intro');
      setCurrentBead(prayerType === 'coronilla' ? 3 : (includeActOfContrition ? 4 : 3));
      return;
    }
    if (bead.id === 'bead-intro-ave-3') {
      setStage('intro');
      setCurrentBead(prayerType === 'coronilla' ? 3 : (includeActOfContrition ? 5 : 4));
      return;
    }
    if (bead.tipo === 'medalla') {
      setStage('salve');
      return;
    }
    if (bead.decena !== undefined && bead.cuenta !== undefined) {
      setStage('decena');
      setCurrentDecade(bead.decena);
      setCurrentBead(bead.cuenta);
      persistState('decena', bead.decena, bead.cuenta);
    }
  };

  // Cuenta activa en SVG
  let activeSvgBeadId = 'bead-cruz';
  if (stage === 'intro') {
    if (prayerType === 'coronilla') {
      if (currentBead === 0) activeSvgBeadId = 'bead-cruz';
      else if (currentBead === 1) activeSvgBeadId = 'bead-intro-pater';
      else if (currentBead === 2) activeSvgBeadId = 'bead-intro-ave-1';
      else if (currentBead === 3) activeSvgBeadId = 'bead-intro-ave-2';
    } else {
      const offset = includeActOfContrition ? 1 : 0;
      if (currentBead <= offset) activeSvgBeadId = 'bead-cruz';
      else if (currentBead === 1 + offset) activeSvgBeadId = 'bead-intro-pater';
      else if (currentBead === 2 + offset) activeSvgBeadId = 'bead-intro-ave-1';
      else if (currentBead === 3 + offset) activeSvgBeadId = 'bead-intro-ave-2';
      else if (currentBead === 4 + offset) activeSvgBeadId = 'bead-intro-ave-3';
    }
  } else if (stage === 'decena') {
    if (currentBead === 0) activeSvgBeadId = `bead-d${currentDecade}-pater`;
    else if (currentBead >= 1 && currentBead <= 10) activeSvgBeadId = `bead-d${currentDecade}-a${currentBead}`;
    else activeSvgBeadId = `bead-d${currentDecade}-a10`;
  } else if (stage === 'salve') {
    activeSvgBeadId = 'bead-medalla';
  }

  // Cuentas completadas
  const completedBeadIds = new Set<string>();
  if (stage === 'decena' || stage === 'salve') {
    completedBeadIds.add('bead-cruz');
    completedBeadIds.add('bead-intro-pater');
    completedBeadIds.add('bead-intro-ave-1');
    completedBeadIds.add('bead-intro-ave-2');
    completedBeadIds.add('bead-intro-ave-3');

    for (let d = 0; d < currentDecade; d++) {
      completedBeadIds.add(`bead-d${d}-pater`);
      for (let a = 1; a <= 10; a++) completedBeadIds.add(`bead-d${d}-a${a}`);
    }

    if (stage === 'decena') {
      if (currentBead > 0) completedBeadIds.add(`bead-d${currentDecade}-pater`);
      for (let a = 1; a < currentBead && a <= 10; a++) completedBeadIds.add(`bead-d${currentDecade}-a${a}`);
    } else if (stage === 'salve') {
      for (let a = 1; a <= 10; a++) completedBeadIds.add(`bead-d4-a${a}`);
      completedBeadIds.add('bead-medalla');
    }
  }

  const currentSet = MISTERIOS_DATA[activeKey] || MISTERIOS_DATA.gloriosos;
  const mystery = currentSet.misterios[currentDecade];
  const coronillaItem = CORONILLA_INTENCIONES[currentDecade];
  const dailyKey = getDailyMysteryKey();

  const aveMariaRef = includeFlameOfLove ? ORACIONES.aveMariaLlamaAmor : ORACIONES.aveMariaEstandar;

  // Cálculos de oración activa
  let prayerTitle = '';
  let prayerText = '';
  let prayerBadge = '';

  if (prayerType === 'coronilla') {
    if (stage === 'intro') {
      if (currentBead === 0) {
        prayerBadge = 'Señal de la Cruz & Ofrecimiento';
        prayerTitle = language === 'la' ? ORACIONES.senalCruzCoronilla.nombreLa : ORACIONES.senalCruzCoronilla.nombreEs;
        prayerText = language === 'la' ? ORACIONES.senalCruzCoronilla.textoLa : ORACIONES.senalCruzCoronilla.textoEs;
      } else if (currentBead === 1) {
        prayerBadge = 'Preparación Inicial 1/3 · Padre Nuestro';
        prayerTitle = language === 'la' ? ORACIONES.padreNuestro.nombreLa : ORACIONES.padreNuestro.nombreEs;
        prayerText = language === 'la' ? ORACIONES.padreNuestro.textoLa : ORACIONES.padreNuestro.textoEs;
      } else if (currentBead === 2) {
        prayerBadge = 'Preparación Inicial 2/3 · Ave María';
        prayerTitle = language === 'la' ? ORACIONES.aveMariaEstandar.nombreLa : ORACIONES.aveMariaEstandar.nombreEs;
        prayerText = language === 'la' ? ORACIONES.aveMariaEstandar.textoLa : ORACIONES.aveMariaEstandar.textoEs;
      } else {
        prayerBadge = 'Preparación Inicial 3/3 · Símbolo de los Apóstoles';
        prayerTitle = language === 'la' ? ORACIONES.credo.nombreLa : ORACIONES.credo.nombreEs;
        prayerText = language === 'la' ? ORACIONES.credo.textoLa : ORACIONES.credo.textoEs;
      }
    } else if (stage === 'decena') {
      if (currentBead === 0) {
        prayerBadge = `Decena ${currentDecade + 1} de 5 · Cuenta Grande`;
        prayerTitle = language === 'la' ? ORACIONES.padreEterno.nombreLa : ORACIONES.padreEterno.nombreEs;
        prayerText = language === 'la' ? ORACIONES.padreEterno.textoLa : ORACIONES.padreEterno.textoEs;
      } else if (currentBead >= 1 && currentBead <= 10) {
        prayerBadge = `Decena ${currentDecade + 1} · Invocación ${currentBead} de 10`;
        prayerTitle = language === 'la' ? ORACIONES.porSuDolorosaPasion.nombreLa : ORACIONES.porSuDolorosaPasion.nombreEs;
        prayerText = language === 'la' ? ORACIONES.porSuDolorosaPasion.textoLa : ORACIONES.porSuDolorosaPasion.textoEs;
      } else {
        prayerBadge = `Cierre de la Decena ${currentDecade + 1}`;
        prayerTitle = language === 'la' ? ORACIONES.gloria.nombreLa : ORACIONES.gloria.nombreEs;
        prayerText = language === 'la' ? ORACIONES.gloria.textoLa : ORACIONES.gloria.textoEs;
      }
    } else if (stage === 'salve') {
      prayerBadge = 'Conclusión de la Coronilla · Trisagio y Confianza';
      prayerTitle = language === 'la' ? ORACIONES.trisagioMisericordia.nombreLa : ORACIONES.trisagioMisericordia.nombreEs;
      prayerText = language === 'la' ? ORACIONES.trisagioMisericordia.textoLa : ORACIONES.trisagioMisericordia.textoEs;
    }
  } else {
    // Modo Santo Rosario
    if (stage === 'intro') {
      if (includeActOfContrition && currentBead === 0) {
        prayerBadge = 'Preparación Inicial';
        prayerTitle = language === 'la' ? ORACIONES.actoContricion.nombreLa : ORACIONES.actoContricion.nombreEs;
        prayerText = language === 'la' ? ORACIONES.actoContricion.textoLa : ORACIONES.actoContricion.textoEs;
      } else if ((includeActOfContrition && currentBead === 1) || (!includeActOfContrition && currentBead === 0)) {
        prayerBadge = 'Inicio en el Crucifijo';
        prayerTitle = language === 'la' ? ORACIONES.credo.nombreLa : ORACIONES.credo.nombreEs;
        prayerText = language === 'la' ? ORACIONES.credo.textoLa : ORACIONES.credo.textoEs;
      } else if ((includeActOfContrition && currentBead === 2) || (!includeActOfContrition && currentBead === 1)) {
        prayerBadge = 'Cordal Inicial';
        prayerTitle = language === 'la' ? ORACIONES.padreNuestro.nombreLa : ORACIONES.padreNuestro.nombreEs;
        prayerText = language === 'la' ? ORACIONES.padreNuestro.textoLa : ORACIONES.padreNuestro.textoEs;
      } else {
        const offset = includeActOfContrition ? 3 : 2;
        const virtudes = ['la virtud de la Fe', 'la virtud de la Esperanza', 'la virtud de la Caridad'];
        prayerBadge = `Avemaría Inicial (${virtudes[currentBead - offset]})`;
        prayerTitle = language === 'la' ? aveMariaRef.nombreLa : aveMariaRef.nombreEs;
        prayerText = language === 'la' ? aveMariaRef.textoLa : aveMariaRef.textoEs;
      }
    } else if (stage === 'decena') {
      if (currentBead === 0) {
        prayerBadge = `Decena ${currentDecade + 1} de 5 · Misterio y Padre Nuestro`;
        prayerTitle = language === 'la' ? ORACIONES.padreNuestro.nombreLa : ORACIONES.padreNuestro.nombreEs;
        prayerText = language === 'la' ? ORACIONES.padreNuestro.textoLa : ORACIONES.padreNuestro.textoEs;
      } else if (currentBead >= 1 && currentBead <= 10) {
        prayerBadge = `Decena ${currentDecade + 1} · Avemaría ${currentBead} de 10`;
        prayerTitle = language === 'la' ? aveMariaRef.nombreLa : aveMariaRef.nombreEs;
        prayerText = language === 'la' ? aveMariaRef.textoLa : aveMariaRef.textoEs;
      } else {
        prayerBadge = `Cierre de la Decena ${currentDecade + 1}`;
        prayerTitle = language === 'la' ? ORACIONES.fatima.nombreLa : ORACIONES.fatima.nombreEs;
        prayerText = language === 'la' ? ORACIONES.fatima.textoLa : ORACIONES.fatima.textoEs;

        if (includeAngelPrayer) {
          prayerText += '\n\n' + (language === 'la' ? ORACIONES.oracionAngelFatima.textoLa : ORACIONES.oracionAngelFatima.textoEs);
        }
      }
    } else if (stage === 'salve') {
      prayerBadge = 'Conclusión del Santo Rosario';
      prayerTitle = language === 'la' ? ORACIONES.salve.nombreLa : ORACIONES.salve.nombreEs;
      prayerText = language === 'la' ? ORACIONES.salve.textoLa : ORACIONES.salve.textoEs;

      if (includeSanMiguel) {
        prayerText += '\n\n' + (language === 'la' ? ORACIONES.sanMiguel.nombreLa : ORACIONES.sanMiguel.nombreEs) + ':\n' + (language === 'la' ? ORACIONES.sanMiguel.textoLa : ORACIONES.sanMiguel.textoEs);
      }
      if (includeSanJose) {
        prayerText += '\n\n' + (language === 'la' ? ORACIONES.sanJose.nombreLa : ORACIONES.sanJose.nombreEs) + ':\n' + (language === 'la' ? ORACIONES.sanJose.textoLa : ORACIONES.sanJose.textoEs);
      }
    }
  }

  // Progreso
  let progressPercent = 0;
  if (stage === 'intro') {
    progressPercent = Math.round(((currentBead + 1) / 60) * 100);
  } else if (stage === 'decena') {
    const totalDone = 5 + (currentDecade * 11) + currentBead;
    progressPercent = Math.min(100, Math.round((totalDone / 60) * 100));
  } else if (stage === 'salve') {
    progressPercent = 100;
  }

  return (
    <div class="max-w-6xl mx-auto space-y-6">

      {/* PANTALLA PREVIA: Selector de Modo de Oración (Rosario vs. Coronilla) y Configuración */}
      {(!isPrayerStarted || showConfigModal) && (
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/40 shadow-xl space-y-8 animate-fadeIn">
          
          {/* Selector de Modo Superior */}
          <div class="flex items-center justify-center p-1 rounded-2xl bg-stone-100 dark:bg-slate-800 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => switchPrayerType('rosario')}
              class={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                prayerType === 'rosario'
                  ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-sm border border-stone-200 dark:border-slate-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              📿 Santo Rosario
            </button>
            <button
              type="button"
              onClick={() => switchPrayerType('coronilla')}
              class={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                prayerType === 'coronilla'
                  ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-sm border border-stone-200 dark:border-slate-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              ✝️ Coronilla Misericordia
            </button>
          </div>

          {prayerType === 'rosario' ? (
            /* CONFIGURACIÓN DEL SANTO ROSARIO */
            <div class="space-y-8">
              <div class="text-center max-w-2xl mx-auto space-y-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-600/30">
                  Santo Rosario &middot; Misterios Marianos
                </span>
                <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-stone-100">
                  ¿Qué misterios deseas rezar hoy?
                </h2>
                <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-reading">
                  Elige los misterios para tu jornada o selecciona cualquiera libremente. Cada misterio incluye su lectura bíblica explicativa para contemplar cada decena.
                </p>
              </div>

              {/* Grilla de los 4 Juegos de Misterios */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(MISTERIOS_DATA).map(([key, data]) => {
                  const isSelected = activeKey === key;
                  const isToday = dailyKey === key;

                  return (
                    <div
                      key={key}
                      onClick={() => selectMystery(key)}
                      class={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-amber-600 bg-amber-500/10 dark:border-amber-400 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/20'
                          : 'border-stone-200 dark:border-slate-800 hover:border-amber-400/60 bg-stone-50/60 dark:bg-slate-950/60'
                      }`}
                    >
                      {isToday && (
                        <span class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 uppercase tracking-wide">
                          Misterios de Hoy
                        </span>
                      )}

                      <div class="space-y-2">
                        <span class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          {data.diasOrdinarios}
                        </span>
                        <h3 class="font-serif text-lg font-bold text-slate-950 dark:text-stone-100 m-0">
                          {data.nombre}
                        </h3>
                        <p class="text-xs text-stone-600 dark:text-stone-400 m-0 leading-relaxed">
                          {data.subtitulo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel de Oraciones Devocionales Adicionales Aprobadas */}
              <div class="p-5 sm:p-6 rounded-2xl bg-stone-100/80 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800 space-y-4">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-serif font-bold text-xs flex items-center justify-center border border-amber-600/30">
                    +
                  </span>
                  <h4 class="font-serif text-base font-bold text-slate-950 dark:text-stone-100 m-0">
                    Oraciones solicitadas en apariciones y devociones añadidas
                  </h4>
                </div>
                
                <p class="text-xs text-stone-600 dark:text-stone-400 font-reading m-0">
                  Personaliza el rosario sumando súplicas tradicionales transmitidas por la Virgen María y los Santos Pontífices:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  
                  <label class="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeFlameOfLove}
                      onChange={(e) => {
                        const val = (e.target as HTMLInputElement).checked;
                        setIncludeFlameOfLove(val);
                        localStorage.setItem('rosary_flame', val.toString());
                      }}
                      class="mt-1 accent-amber-600 rounded"
                    />
                    <div class="text-xs space-y-1">
                      <span class="font-bold text-slate-900 dark:text-stone-100 block">
                        Jaculatoria de la Llama de Amor
                      </span>
                      <span class="text-stone-500 dark:text-stone-400 block leading-tight">
                        Añade a cada Avemaría: <em>«derrama el efecto de gracia de tu Llama de Amor sobre toda la humanidad...»</em>.
                      </span>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeAngelPrayer}
                      onChange={(e) => {
                        const val = (e.target as HTMLInputElement).checked;
                        setIncludeAngelPrayer(val);
                        localStorage.setItem('rosary_angel', val.toString());
                      }}
                      class="mt-1 accent-amber-600 rounded"
                    />
                    <div class="text-xs space-y-1">
                      <span class="font-bold text-slate-900 dark:text-stone-100 block">
                        Oración del Ángel de la Paz (Fátima 1916)
                      </span>
                      <span class="text-stone-500 dark:text-stone-400 block leading-tight">
                        Suma la súplica de desagravio: <em>«¡Dios mío, yo creo, adoro, espero y te amo!...»</em> al cierre de cada decena.
                      </span>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeActOfContrition}
                      onChange={(e) => {
                        const val = (e.target as HTMLInputElement).checked;
                        setIncludeActOfContrition(val);
                        localStorage.setItem('rosary_contrition', val.toString());
                      }}
                      class="mt-1 accent-amber-600 rounded"
                    />
                    <div class="text-xs space-y-1">
                      <span class="font-bold text-slate-900 dark:text-stone-100 block">
                        Acto de Contrición Inicial
                      </span>
                      <span class="text-stone-500 dark:text-stone-400 block leading-tight">
                        Inicia el rezo pidiendo perdón a Dios por las culpas cometidas antes de profesar el Credo.
                      </span>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeSanMiguel}
                      onChange={(e) => {
                        const val = (e.target as HTMLInputElement).checked;
                        setIncludeSanMiguel(val);
                        localStorage.setItem('rosary_san_miguel', val.toString());
                      }}
                      class="mt-1 accent-amber-600 rounded"
                    />
                    <div class="text-xs space-y-1">
                      <span class="font-bold text-slate-900 dark:text-stone-100 block">
                        San Miguel Arcángel (León XIII)
                      </span>
                      <span class="text-stone-500 dark:text-stone-400 block leading-tight">
                        Oración de protección espiritual tras la Salve Regina.
                      </span>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors md:col-span-2">
                    <input
                      type="checkbox"
                      checked={includeSanJose}
                      onChange={(e) => {
                        const val = (e.target as HTMLInputElement).checked;
                        setIncludeSanJose(val);
                        localStorage.setItem('rosary_san_jose', val.toString());
                      }}
                      class="mt-1 accent-amber-600 rounded"
                    />
                    <div class="text-xs space-y-1">
                      <span class="font-bold text-slate-900 dark:text-stone-100 block">
                        Oración a San José (Patrono de la Iglesia Universal)
                      </span>
                      <span class="text-stone-500 dark:text-stone-400 block leading-tight">
                        Reza la plegaria tradicional para encomendar las familias y la Iglesia al Santo Patriarca.
                      </span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Botón de Inicio */}
              <div class="text-center pt-2">
                <button
                  type="button"
                  onClick={startRosary}
                  class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-base shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Comenzar el Santo Rosario ({currentSet.nombre}) &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* CONFIGURACIÓN DE LA CORONILLA DE LA DIVINA MISERICORDIA */
            <div class="space-y-6">
              <div class="text-center max-w-2xl mx-auto space-y-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-600/30">
                  Vilna 1935 &middot; Santa Faustina Kowalska
                </span>
                <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-stone-100">
                  Coronilla de la Divina Misericordia
                </h2>
                <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-reading">
                  Devoción dictada por Nuestro Señor a Santa Faustina. Se reza utilizando las mismas 5 decenas del rosario tradicional, especialmente a las <strong>3:00 PM (la Hora de la Gran Misericordia)</strong> en memoria de la muerte redentora de Cristo en la Cruz.
                </p>
              </div>

              {/* Promesas de Cristo a Santa Faustina */}
              <div class="p-5 sm:p-6 rounded-2xl bg-stone-100/80 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800 space-y-4">
                <h4 class="font-serif text-base font-bold text-slate-950 dark:text-stone-100 m-0">
                  Grandes Promesas de Nuestro Señor Jesucristo (Diario de Santa Faustina)
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-1">
                    <span class="font-bold text-rose-700 dark:text-rose-400 block">Amparo a la Hora de la Muerte</span>
                    <p class="text-stone-600 dark:text-stone-400 m-0 leading-relaxed italic">
                      «A quienes recen esta coronilla, mi misericordia los envolverá en la vida y para siempre en la hora de la muerte» (Diario, 754).
                    </p>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-1">
                    <span class="font-bold text-rose-700 dark:text-rose-400 block">Paz para los Pecadores</span>
                    <p class="text-stone-600 dark:text-stone-400 m-0 leading-relaxed italic">
                      «Hasta el pecador más empedernido, si reza esta coronilla una sola vez, recibirá la gracia de mi misericordia infinita» (Diario, 687).
                    </p>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-1">
                    <span class="font-bold text-rose-700 dark:text-rose-400 block">Eficacia de la Oración</span>
                    <p class="text-stone-600 dark:text-stone-400 m-0 leading-relaxed italic">
                      «Por medio de esta coronilla obtendrás todo, si lo que pides está conforme con mi divina voluntad» (Diario, 1731).
                    </p>
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between">
                  <a
                    href="/santos/faustina-kowalska/"
                    class="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Conocer la biografía de Santa Faustina y el cuadro original de Vilna</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Botón de Inicio de la Coronilla */}
              <div class="text-center pt-2">
                <button
                  type="button"
                  onClick={startRosary}
                  class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-base shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Comenzar la Coronilla de la Divina Misericordia &rarr;
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODO REZO ACTIVO CON EL ROSARIO VISUAL Y CONTADOR */}
      {isPrayerStarted && !showConfigModal && (
        <div class="space-y-6">

          {/* Barra Superior con botón para volver a cambiar misterio */}
          <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-stone-100/90 dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 shadow-sm text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span class="font-serif font-bold text-slate-900 dark:text-stone-100">
                {prayerType === 'coronilla' ? 'Coronilla de la Divina Misericordia' : currentSet.nombre}
              </span>
              <span class="text-stone-500 dark:text-stone-400 hidden sm:inline">
                &middot; {prayerType === 'coronilla' ? 'Revelada a Santa Faustina Kowalska' : currentSet.diasOrdinarios}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:border-amber-500 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>⚙️</span>
              <span>Cambiar Rezo u Opciones</span>
            </button>
          </div>

          {/* Barra de Navegación por Decenas */}
          <div class="flex items-center justify-between overflow-x-auto pb-1 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => { setStage('intro'); setCurrentBead(0); }}
              class={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                stage === 'intro'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700'
                  : 'bg-stone-100 dark:bg-slate-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800'
              }`}
            >
              Cruz e Inicio
            </button>

            {[0, 1, 2, 3, 4].map((decIdx) => {
              const isDecActive = stage === 'decena' && currentDecade === decIdx;
              return (
                <button
                  type="button"
                  key={decIdx}
                  onClick={() => jumpToDecade(decIdx)}
                  class={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isDecActive
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700 shadow-sm'
                      : 'bg-stone-100 dark:bg-slate-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800'
                  }`}
                >
                  Decena {decIdx + 1}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => { setStage('salve'); setCurrentBead(0); }}
              class={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                stage === 'salve'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700'
                  : 'bg-stone-100 dark:bg-slate-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800'
              }`}
            >
              {prayerType === 'coronilla' ? 'Trisagio y Cierre' : 'Salve Regina'}
            </button>
          </div>

          {/* Disposición a Dos Columnas */}
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Columna Izquierda: El Rosario Visual Interactivo Y LA LISTA DE LOS 5 MISTERIOS O INTENCIONES */}
            <div class="lg:col-span-5 space-y-4">
              
              <RosaryVisualizer
                activeBeadId={activeSvgBeadId}
                completedBeadIds={completedBeadIds}
                onSelectBead={handleSelectSvgBead}
                mysteryName={prayerType === 'coronilla' ? coronillaItem?.titulo : mystery?.titulo}
                currentDecade={currentDecade}
              />

              {/* Barra de Progreso */}
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-2">
                <div class="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400">
                  <span>Progreso de la Oración</span>
                  <span class="font-bold text-amber-700 dark:text-amber-400">{progressPercent}%</span>
                </div>
                <div class="w-full h-2.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* LISTA DE LOS 5 MISTERIOS O INTENCIONES AL LADO DEL ROSARIO */}
              <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-3">
                <div class="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-2">
                  <span class="font-serif text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {prayerType === 'coronilla' ? 'Las 5 Intenciones de la Coronilla' : 'Los 5 Misterios del Día'}
                  </span>
                  <span class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    {prayerType === 'coronilla' ? 'Vilna 1935' : currentSet.nombre}
                  </span>
                </div>

                <div class="space-y-2">
                  {(prayerType === 'coronilla' ? CORONILLA_INTENCIONES : currentSet.misterios).map((m, idx) => {
                    const isCurrent = stage === 'decena' && currentDecade === idx;
                    const isPast = stage === 'salve' || (stage === 'decena' && currentDecade > idx);

                    return (
                      <div
                        key={idx}
                        onClick={() => jumpToDecade(idx)}
                        class={`p-3 rounded-xl border transition-all cursor-pointer text-xs space-y-1 ${
                          isCurrent
                            ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 ring-1 ring-amber-500/40 shadow-sm'
                            : isPast
                            ? 'border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-950/40 text-stone-500'
                            : 'border-stone-200/70 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div class="flex items-center justify-between font-semibold">
                          <span class={`flex items-center gap-1.5 ${isCurrent ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-slate-800 dark:text-stone-200'}`}>
                            <span class="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-400 text-[10px] flex items-center justify-center font-bold">
                              {m.numeroRomano}
                            </span>
                            <span>{m.titulo}</span>
                          </span>

                          {isCurrent && (
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shrink-0">
                              Meditando
                            </span>
                          )}
                          {isPast && (
                            <span class="text-amber-600 dark:text-amber-400 text-xs shrink-0">
                              ✓
                            </span>
                          )}
                        </div>

                        <div class="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between pl-5">
                          <span>{m.pasaje}</span>
                          <span class="italic text-[10px]">{m.fruto}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p class="text-[11px] text-stone-400 dark:text-stone-500 italic text-center m-0 pt-1">
                  Haz clic sobre cualquiera de las decenas para saltar a ella.
                </p>
              </div>

            </div>

            {/* Columna Derecha: Tarjeta de Meditación y Rezo */}
            <div class="lg:col-span-7 space-y-5">
              
              <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-md space-y-6">
                
                {/* Cabecera de la Tarjeta con Controles */}
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800 pb-4">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span class="font-serif text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold">
                      {prayerBadge}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        const next = language === 'es' ? 'la' : 'es';
                        setLanguage(next);
                        localStorage.setItem('rosary_lang', next);
                      }}
                      class="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-semibold transition-colors"
                    >
                      {language === 'es' ? '🇪🇸 Español' : '🇻🇦 Latín'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                      class="px-2 py-1 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-bold transition-colors"
                    >
                      {fontSize === 'normal' ? 'A+' : 'A-'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !soundEnabled;
                        setSoundEnabled(next);
                        localStorage.setItem('rosary_sound', next.toString());
                      }}
                      class={`px-2.5 py-1 rounded-lg transition-colors ${
                        soundEnabled
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-semibold'
                          : 'bg-stone-100 dark:bg-slate-800 text-stone-400'
                      }`}
                    >
                      🔔 {soundEnabled ? 'Sonido' : 'Mudo'}
                    </button>
                  </div>
                </div>

                {/* BLOQUE DE LA MEDITACIÓN ACTIVA */}
                {stage === 'decena' && (
                  <div class="space-y-4 bg-amber-50/60 dark:bg-amber-950/20 p-5 sm:p-6 rounded-2xl border border-amber-200/70 dark:border-amber-900/40">
                    <div class="flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 font-medium">
                      <span>{prayerType === 'coronilla' ? 'Coronilla de la Misericordia' : currentSet.nombre} &middot; Decena {currentDecade + 1} de 5</span>
                      <span>{prayerType === 'coronilla' ? 'Vilna 1935' : currentSet.diasOrdinarios}</span>
                    </div>

                    <div class="space-y-1">
                      <span class="text-xs font-serif font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Decena {prayerType === 'coronilla' ? coronillaItem.numeroRomano : mystery.numeroRomano}
                      </span>
                      <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-950 dark:text-stone-100 leading-snug m-0">
                        {prayerType === 'coronilla' ? coronillaItem.titulo : mystery.titulo}
                      </h2>
                    </div>

                    {/* Texto Narrativo Completo de la Meditación */}
                    <div class="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/40 dark:border-amber-900/30 space-y-2">
                      <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                        {prayerType === 'coronilla' ? 'Intención dictada a Santa Faustina' : 'Meditación para la contemplación'}
                      </span>
                      <p class="font-reading text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed m-0 italic">
                        {prayerType === 'coronilla' ? coronillaItem.meditacion : mystery.meditacion}
                      </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-300 pt-1">
                      <span><strong>Referencia:</strong> {prayerType === 'coronilla' ? coronillaItem.pasaje : mystery.pasaje}</span>
                      <span>&middot;</span>
                      <span><strong>Fruto Espiritual:</strong> {prayerType === 'coronilla' ? coronillaItem.fruto : mystery.fruto}</span>
                    </div>
                  </div>
                )}

                {/* Caja de Oración Principal */}
                <div class="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200/70 dark:border-slate-800 space-y-3">
                  <span class="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                    {prayerTitle}
                  </span>

                  <p
                    class={`font-reading text-slate-900 dark:text-stone-100 leading-relaxed italic m-0 whitespace-pre-line ${
                      fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                    }`}
                  >
                    &laquo;{prayerText}&raquo;
                  </p>
                </div>

                {/* Indicador Lineal de Cuentas de la Decena */}
                {stage === 'decena' && (
                  <div class="space-y-2 pt-1">
                    <div class="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span>
                        {currentBead === 0
                          ? (prayerType === 'coronilla' ? 'Padre Eterno (Cuenta Grande)' : 'Cuenta del Padre Nuestro')
                          : currentBead <= 10
                          ? (prayerType === 'coronilla' ? `Por su dolorosa Pasión (${currentBead} de 10)` : `Avemaría ${currentBead} de 10`)
                          : 'Gloria y Cierre'}
                      </span>
                      <span>{prayerType === 'coronilla' ? '1 Padre Eterno → 10 Súplicas de la Pasión' : '1 Padre Nuestro → 10 Avemarías → Gloria'}</span>
                    </div>

                    <div class="grid grid-cols-12 gap-1.5 sm:gap-2">
                      <div
                        onClick={() => { setCurrentBead(0); persistState('decena', currentDecade, 0); }}
                        class={`h-3 rounded-full cursor-pointer transition-all ${
                          currentBead === 0
                            ? 'bg-amber-600 dark:bg-amber-400 ring-2 ring-amber-400/50 scale-105'
                            : 'bg-amber-500/40'
                        }`}
                        title={prayerType === 'coronilla' ? 'Padre Eterno' : 'Padre Nuestro'}
                      />

                      {Array.from({ length: 10 }, (_, i) => {
                        const beadNum = i + 1;
                        const isPast = beadNum < currentBead;
                        const isCurrent = beadNum === currentBead;
                        return (
                          <div
                            key={beadNum}
                            onClick={() => { setCurrentBead(beadNum); persistState('decena', currentDecade, beadNum); }}
                            class={`h-3 rounded-full cursor-pointer transition-all ${
                              isCurrent
                                ? 'bg-amber-600 dark:bg-amber-400 shadow-md ring-2 ring-amber-400/50 scale-105'
                                : isPast
                                ? 'bg-amber-500/60 dark:bg-amber-500/40'
                                : 'bg-stone-200 dark:bg-slate-800'
                            }`}
                            title={prayerType === 'coronilla' ? `Invocación ${beadNum}` : `Avemaría ${beadNum}`}
                          />
                        );
                      })}

                      <div
                        onClick={() => { setCurrentBead(11); persistState('decena', currentDecade, 11); }}
                        class={`h-3 rounded-full cursor-pointer transition-all ${
                          currentBead === 11
                            ? 'bg-amber-600 dark:bg-amber-400 ring-2 ring-amber-400/50 scale-105'
                            : currentBead > 10
                            ? 'bg-amber-500/40'
                            : 'bg-stone-200 dark:bg-slate-800'
                        }`}
                        title="Gloria y Jaculatoria"
                      />
                    </div>
                  </div>
                )}

                {/* Conclusión: Salve Regina o Trisagio de la Coronilla */}
                {stage === 'salve' && (
                  <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/30 text-xs text-stone-700 dark:text-stone-300 space-y-3">
                    <div class="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400">
                      <span>✨ ¡Has completado las cinco decenas de {prayerType === 'coronilla' ? 'la Coronilla de la Divina Misericordia' : 'el Santo Rosario'}!</span>
                    </div>
                    <p class="m-0 leading-relaxed">
                      Que la misericordia de Nuestro Señor Jesucristo y la protección de la Santísima Virgen María te acompañen en todo momento. Puedes concluir persignándote con devoción.
                    </p>
                    {prayerType === 'rosario' && (
                      <details class="cursor-pointer pt-1">
                        <summary class="font-semibold text-amber-700 dark:text-amber-400 hover:underline">
                          Ver las Letanías Lauretanas (opcional)
                        </summary>
                        <div class="pt-3 font-reading text-xs text-stone-600 dark:text-stone-400 space-y-1.5 pl-3 border-l-2 border-amber-500/40 mt-2">
                          <p class="m-0">Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad.</p>
                          <p class="m-0">Santa María, <em>ruega por nosotros.</em></p>
                          <p class="m-0">Santa Madre de Dios, <em>ruega por nosotros.</em></p>
                          <p class="m-0">Madre de la divina gracia, <em>ruega por nosotros.</em></p>
                          <p class="m-0">Madre purísima, Madre castísima, <em>ruega por nosotros.</em></p>
                          <p class="m-0">Espejo de justicia, Trono de la sabiduría, Causa de nuestra alegría, <em>ruega por nosotros.</em></p>
                          <p class="m-0">Rosa mística, Torre de David, Torre de marfil, Casa de oro, Arca de la alianza, <em>ruega por nosotros.</em></p>
                          <p class="m-0">Reina de los Ángeles, Reina de la paz, <em>ruega por nosotros.</em></p>
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {/* Controles Táctiles */}
                <div class="pt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevBead}
                    disabled={stage === 'intro' && currentBead === 0}
                    class="px-4 py-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                  >
                    &larr; Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() => resetCounter(true)}
                    class="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 underline"
                  >
                    Reiniciar
                  </button>

                  <button
                    type="button"
                    onClick={nextBead}
                    class="px-6 py-3.5 rounded-xl bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold text-base shadow-md hover:bg-amber-700 dark:hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>{stage === 'salve' ? 'Finalizar Rezo' : 'Siguiente Cuenta'}</span>
                    <span>&rarr;</span>
                  </button>
                </div>

              </div>

              {/* Nota Doctrinal */}
              <div class="p-4 rounded-xl bg-stone-100/50 dark:bg-slate-900/40 text-xs text-stone-500 dark:text-stone-400 leading-relaxed border border-stone-200/50 dark:border-slate-800/50 space-y-1.5">
                <p class="m-0">
                  <strong>Magisterio eclesial:</strong> {prayerType === 'coronilla' ? 'Coronilla aprobada canónicamente por la Santa Sede e impulsada por San Juan Pablo II con indulgencias plenarias.' : 'La estructura y misterios siguen las cartas apostólicas Rosarium Virginis Mariae (San Juan Pablo II) y Consueverunt Romani Pontifices (San Pío V).'}
                </p>
                <p class="m-0">
                  <strong>Navegación por teclado:</strong> Pulsa la <strong>Barra Espaciadora</strong> o <strong>Flecha Derecha</strong> para avanzar cuenta; <strong>Flecha Izquierda</strong> para retroceder.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
