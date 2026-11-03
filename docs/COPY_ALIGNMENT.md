# Tabla de Alineación Editorial y Coherencia de Claims (Copy Alignment)

Documento elaborado conforme al requerimiento 5.4 de la Fase 4.
Analiza la correspondencia entre las afirmaciones de portada (Home) y hubs temáticos frente al cuerpo desarrollado de cada artículo enlazado.

> [!IMPORTANT]
> **Estado:** Documento de análisis y propuesta editorial. Conforme a las instrucciones del PASO 5.4, ninguna propuesta de redacción aquí consignada ha sido aplicada en los archivos de la aplicación.

---

## Tabla de Análisis de Claims

| Afirmación / Frase | Ubicación | Contexto en Home / Hub | Realidad en el Cuerpo del Artículo | Calificación | Redacción Propuesta (Igual o más prudente) |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **"infrarrojo de la NASA"** | `src/pages/index.astro:221` (Card Tilma) | *"490 años sin descomposición de agave, examen infrarrojo de la NASA y 13 figuras en la córnea."* | El estudio infrarrojo de 1979 fue realizado a título personal por el Dr. Philip Serna Callahan y el Prof. Jody Brant Smith. Callahan era biofísico y consultor privado; la NASA como agencia aeroespacial federal estadounidense **jamás patrocinó, financió ni avaló institucionalmente** un examen de la Tilma. | **CONTRADICE** | *"análisis fotográfico infrarrojo (Callahan y Smith, 1979) y examen microscópico de la córnea (Tonsmann)"* |
| **"coincidencia biométrica 1:1"** | `src/pages/index.astro:208` (Card Faustina) | *"El cuadro original de Kazimirowski, coincidencia biométrica 1:1 con la Síndone y la Coronilla."* | La superposición visual entre la Síndone y el cuadro de Vilna de Kazimirowski es una comparación gráfica devocional/documental (difundida por el P. Serafin Michalenko). No existe peritaje biométrico forense computarizado con validez matemática "1:1" indexado en la literatura científica. | **MÁS FUERTE QUE EL CUERPO** | *"el lienzo original de Kazimirowski (Vilna 1934), su correlación fisonómica visual con la Síndone y el origen de la Coronilla"* |
| **"WAXS 2024"** | `src/pages/index.astro:22` (Pilar Ciencia y Fe) | *"El Santo Sudario de Turín (rayos X WAXS 2024), el ayate de Guadalupe..."* | El estudio de Difracción de Rayos X de Gran Angular (WAXS) del Dr. Liberato De Caro et al. fue publicado formalmente en la revista académica *Heritage* en **2022** (*Heritage 2022, 5(2), 860-870*). En 2024 ocurrió únicamente una cobertura mediática secundaria en prensa digital. | **CONTRADICE** | *"El Santo Sudario de Turín (perfil estructural de celulosa por rayos X WAXS), el ayate de Guadalupe..."* |
| **"refuta Serratia"** | `src/pages/index.astro:260` (Card Sokółka) | *"Microscopía electrónica de la Universidad Médica de Białystok que refuta la bacteria Serratia."* | Los profesores Sobaniec-Łotowska y Sulkowski descartaron *Serratia marcescens* porque las muestras presentaban arquitectura celular estriada de miocardio entrelazada con el pan, y no mera pigmentación microbiana roja prodigiosina. No hubo un protocolo de refutación genómica publicado en revistas internacionales. | **MÁS FUERTE QUE EL CUERPO** | *"examen histopatológico en Białystok que descarta pigmentación bacteriana por presencia de fibras miocárdicas"* |
| **"probada"** | `src/pages/index.astro:247` (Card Lourdes) | *"Regeneración ósea probada (Vittorio Micheli) e incorrupción de Santa Bernardita Soubirous."* | El *Bureau Médical* de Lourdes y el CMIL concluyeron que la reconstrucción articular de la pelvis de Vittorio Micheli era **inexplicable para los conocimientos médicos**. La Iglesia luego reconoció el milagro en 1976. La ciencia constata la ausencia de explicación médica, no "prueba" el milagro en términos positivistas. | **MÁS FUERTE QUE EL CUERPO** | *"Regeneración ósea declarada clínicamente inexplicable (caso Vittorio Micheli) e historia de Santa Bernardita"* |
| **"Santidad Comprobada"** | `src/pages/index.astro:30` (Badge Pilar Santos) | `badge: 'Santidad Comprobada'` | La santidad es una proclamación eclesial canónica fruto del discernimiento del Magisterio y las virtudes heroicas asistidas por la gracia de Dios; no es un fenómeno material susceptible de "comprobación" de laboratorio. | **MÁS FUERTE QUE EL CUERPO** | `badge: 'Vidas de Gracia'` o `badge: 'Signos y Virtudes'` |
| **"datos validados"** | `src/pages/index.astro:168` (Intro Sec. 2) | *"Textos redactados con nuestra voz editorial, citas primarias contrastadas y datos validados:"* | "Datos validados" insinúa una homologación o certificación oficial por terceros sobre la totalidad de los datos, cuando en realidad se trata de verificación documental interna de fuentes primarias. | **MÁS FUERTE QUE EL CUERPO** | *"Textos redactados con nuestra voz editorial, citas primarias contrastadas y fuentes documentales verificadas:"* |

---

## Criterios de Evaluación y Clasificación

1. **CONTRADICE:** La afirmación de portada asevera un hecho cronológico, institucional o técnico que el propio texto del artículo desmiente o refuta explícitamente (ej. atribuir el estudio a la institución NASA cuando el cuerpo aclara que fue un biofísico individual; datar en 2024 una publicación académica formal de 2022).
2. **MÁS FUERTE QUE EL CUERPO:** El titular o badge utiliza términos categóricos ("1:1", "probada", "refuta", "validada") para describir hallazgos que el cuerpo expone con matices metodológicos prudentes (ej. correlación visual, inexplicabilidad clínica temporal, ausencia de morfología bacteriana).
3. **OK:** Afirmación equilibrada cuya formulación en el titular coincide con el rigor, el alcance y las reservas expresadas en el desarrollo monográfico.
