# Guía de Voz Editorial y Manual de Estilo (VOZ-EDITORIAL.md)

Este documento fija la identidad verbal, el tono doctrinal y pastoral, los criterios de redacción y los límites infranqueables para todo el contenido publicado en el proyecto.

---

## 1. Identidad de la Voz: Confesional, Firme y Cálida

Nuestra voz no es la de un observador neutral ni la de un blog secular de historia de las religiones. Es la voz de la **fe católica viva**:
* **Confesional:** Hablamos desde el corazón de la Iglesia, en comunión con su Magisterio dos veces milenario y arraigados en la Sagrada Escritura. No relativizamos el Evangelio: Jesucristo es el único Salvador del mundo, verdadero Dios y verdadero Hombre.
* **Firme:** No dudamos ni usamos fórmulas de tibieza del tipo *"para quienes elijan creer esto"* o *"todas las espiritualidades conducen al mismo punto"*. Afirmamos la verdad revelada con serenidad, claridad y convicción inamovible.
* **Cálida:** La firmeza nunca es aspereza ni condena. Hablamos con la ternura de quien ha sido rescatado por la misericordia de Dios. Acogemos al lector que llega cargado de dudas, dolor, cansancio o heridas del alma, ofreciéndole la luz del Evangelio sin altivez intelectual.
* **Veracidad sobre retórica:** La persuasión no proviene de adjetivos rimbombantes ni de apasionamiento artificial, sino de **hechos documentados con precisión**. Separamos con total transparencia:
  1. El hecho histórico o suceso documentado.
  2. Los resultados objetivos de peritajes científicos o médicos (con sus límites metodológicos).
  3. La interpretación sobrenatural y teológica según la Iglesia.

---

## 2. Tres Párrafos de Ejemplo de Voz y Tono

### Ejemplo 1: Pilar *Jesús y sus Enseñanzas* (El Mandato del Perdón)
> «Cuando Cristo manda perdonar "hasta setenta veces siete", no propone un ejercicio de debilidad psicológica ni pide tolerar la injusticia pasivamente. En la cruz, cargando con la mezquindad de sus verdugos, Jesús reveló que el rencor es una celda cuyo carcelero es la propia víctima. Perdonar no significa decir que el mal cometido no importó; significa arrancar el derecho a la venganza de nuestras manos y entregárselo a la justicia de Dios, permitiendo que la gracia sane lo que humanamente es irreparable. El perdón cristiano no nace de nuestras fuerzas gastadas, sino de una verdad previa: hemos sido perdonados primero y a un precio infinito.»

### Ejemplo 2: Pilar *Milagros Eucarísticos y Ciencia* (Ficha de Lanciano)
> «En el siglo VIII, en la iglesia de los Santos Legonziano y Domiciano, un sacerdote basilio dudó de la presencia sustancial de Cristo en el pan consagrado; el relato tradicional sostiene que la forma tomó apariencia de carne y el vino de sangre. Doce siglos después, en 1970, el profesor Odoardo Linoli —docente de anatomía e histología patológica— examinó directamente las reliquias bajo microscopía óptica y determinó que la muestra corresponde a tejido miocárdico humano del ventrículo izquierdo, con sangre del grupo AB. La Iglesia no presenta estos análisis como una "demostración matemática" que obligue a la fe, pues el misterio eucarístico pertenece al orden sobrenatural; los presenta como un signo misericordioso que desafía las leyes naturales de la putrefacción orgánica y recuerda al creyente que la Eucaristía no es un símbolo vacío, sino un Corazón vivo que sigue latiendo por la humanidad.»

### Ejemplo 3: Pilar *Santos y Signos* (Padre Pío y las Pruebas del Santo Oficio)
> «El camino a los altares del fraile de Pietrelcina no fue un paseo triunfal exento de sombras. Durante las décadas de 1920 y 1930, el Santo Oficio —guiado por el deber primordial de proteger al pueblo de Dios de la sugestión y el engaño— impuso severas restricciones al Padre Pío tras informes desfavorables de consultores como el padre Agostino Gemelli. Lejos de rebelarse o buscar el amparo del aplauso popular, el santo capuchino respondió con una obediencia heroica y silenciosa en su celda. Esa misma prudencia con la que la Iglesia investigó durante más de ochenta años cada herida, cada carta y cada testimonio es hoy la mayor garantía de su santidad: su canonización no fue el fruto de un fervor precipitado, sino de la verdad acrisolada en la prueba.»

---

## 3. Tres Ejemplos del Bloque `<NextStep />` ("Tu siguiente paso")

El bloque `<NextStep />` se ubica obligatoriamente al cierre de cada pieza para transformar la lectura intelectual en una acción espiritual inmediata y concreta.

### Ejemplo A: Variante para Artículos de Jesús / Conversión
```html
<NextStep variant="jesus">
  <h3>Tu siguiente paso</h3>
  <p>El Evangelio no fue escrito para ser admirado como una bella obra literaria, sino para ser vivido hoy. Si estas palabras han interpelado tu corazón, no dejes que el ruido cotidiano apague la llamada:</p>
  <ul>
    <li><strong>Un examen sincero:</strong> Tómate diez minutos esta noche en silencio para poner nombre a los rencores que todavía cargas.</li>
    <li><strong>El sacramento de la paz:</strong> Acércate esta semana a una parroquia y busca el Sacramento de la Reconciliación. No hay pecado, por pesado que parezca, que supere la ternura de la absolución de Cristo.</li>
  </ul>
</NextStep>
```

### Ejemplo B: Variante para Fichas de Milagros Eucarísticos
```html
<NextStep variant="milagros">
  <h3>Tu siguiente paso</h3>
  <p>La ciencia puede constatar la presencia de tejido cardíaco en un relicario, pero solo la fe te permite encontrar al Señor resucitado esperándote en el Sagrario de tu barrio:</p>
  <ul>
    <li><strong>Visita al Sagrario:</strong> Haz una pausa hoy de camino a casa y entra cinco minutos en la iglesia más cercana. Arrodíllate ante el Sagrario y dile en voz baja: <em>"Señor, creo, pero aumenta mi fe"</em>.</li>
    <li><strong>Misa dominical:</strong> Participa este domingo del banquete de la Eucaristía en estado de gracia. En cada consagración ordinaria sucede exactamente el mismo misterio que en Lanciano o Buenos Aires.</li>
  </ul>
</NextStep>
```

### Ejemplo C: Variante para Fátima y el Santo Rosario
```html
<NextStep variant="fatima">
  <h3>Tu siguiente paso</h3>
  <p>El mensaje que la Virgen confió a los tres pastorcitos en 1917 es tan urgente hoy como hace un siglo: oración perseverante por la paz y conversión personal:</p>
  <ul>
    <li><strong>Reza los misterios de hoy:</strong> No postergues tu encuentro con María. Abre nuestro <a href="/rosario/">Rosario Interactivo</a> y dedica 15 minutos a contemplar los misterios de este día.</li>
    <li><strong>Primeros Sábados:</strong> Organízate para vivir el próximo primer sábado de mes con Confesión, Comunión reparadora y un cuarto de hora de meditación en su compañía.</li>
  </ul>
</NextStep>
```

---

## 4. Lista Estricta de Prácticas y Contenidos Prohibidos

1. ❌ **Miedo Coercitivo y Apocalipticismo Sensacionalista:**
   * Prohibido utilizar amenazas de condenación para forzar la oración, cadenas de mensajes (*"si no rezas esto te irá mal"*) o especulaciones morbosas sobre el fin de los tiempos no avaladas por el Catecismo de la Iglesia Católica.
2. ❌ **Promesas Mágicas de Curación o Prosperidad:**
   * Prohibido terminantemente asegurar resultados materiales o milagros médicos por rezar determinadas oraciones (*"rezá esta oración y te curás garantizado"*). La oración cristiana es súplica filial y abandono en la voluntad divina, nunca un contrato mágico.
3. ❌ **Consejos Médicos o Desaliento de Tratamientos:**
   * Prohibido dar pautas clínicas, sustituir el diagnóstico médico por prácticas devocionales o inducir al lector a abandonar terapias de salud. Dios actúa a través de la medicina y la ciencia ordinaria.
4. ❌ **Sensacionalismo y Lenguaje de "Prueba Irrefutable":**
   * Prohibido afirmar que la ciencia ha *"demostrado a Dios de forma irrefutable"* o que un milagro convierte la fe en una certeza de laboratorio forzada. La evidencia científica se describe con sobriedad y prudencia forense.
5. ❌ **Condena Personal o Juicios hacia Terceros:**
   * Condenamos el pecado y la mentira doctrinal conforme al Magisterio, pero jamás juzgamos el destino eterno ni la conciencia interior de ninguna persona concreta.
6. ❌ **Rostros o Representaciones de Seres Sagrados con Inteligencia Artificial:**
   * Prohibido sin excepciones generar imágenes sintéticas de Cristo, la Virgen María o los Santos.
