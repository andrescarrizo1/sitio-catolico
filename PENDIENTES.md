# Registro de Asuntos Pendientes y Control de Calidad (PENDIENTES.md)

Este documento centraliza los hechos, afirmaciones teológicas o científicas y tareas editoriales que **no disponen aún de una fuente primaria verificable** suficiente o que requieren revisión de un experto antes de su inclusión en el sitio público.

> **Regla de Oro:** Si una afirmación no cuenta con una referencia primaria fehaciente (acta eclesiástica, paper científico o crónica de la época), **permanece en este archivo y no se publica en la web**.

---

## 1. Afirmaciones y Temas Bloqueados para V1 (Sin Fuente Primaria)

| Tema / Afirmación Popular | Estado Actual | Motivo del Bloqueo / Acción Requerida |
| :--- | :--- | :--- |
| **Supuesto informe científico de la UNESCO sobre Lanciano (1973)** | 🔴 **Bloqueado** | No existe registro formal ni número de acta de dicho peritaje en los archivos públicos de la UNESCO. Se cita con frecuencia en blogs pero sin signatura de archivo. *Acción: Se omite por completo en la ficha de Lanciano. Solo se cita el estudio del Dr. Odoardo Linoli (1971 y 1981).* |
| **Detalles no confirmados sobre los 10 secretos de Medjugorje** | 🔴 **Bloqueado** | El fenómeno de Medjugorje cuenta con la reciente nota del Dicasterio para la Doctrina de la Fe (*Reina de la Paz*, 2024) que otorga *nihil obstat* pastoral a las peregrinaciones, pero sin pronunciarse sobre la sobrenaturalidad de las apariciones ni autenticar videntes. *Acción: Fuera del alcance de la V1.* |
| **Citas devocionales atribuidas al Padre Pío en redes sociales** | 🔴 **Bloqueado** | Frases como *"La oración es la mejor arma que tenemos; es la llave al corazón de Dios"* están documentadas, pero muchas otras populares son de autoayuda moderna. *Acción: Solo se admiten citas con referencia de tomo y carta del Epistolario oficial de San Giovanni Rotondo.* |

---

## 2. Revisor Teológico y Científico (Placeholders)

* **Revisión Teológica e Histórica:**
  * Estado: *En proceso de definición de revisor externo con credenciales canónicas*.
  * Mientras tanto, el campo `revisado_por` en las colecciones de contenido se declara como: `"Revisión Editorial Interna (Basada en Magisterio y Fuentes Primarias)"`.
* **Revisión Médica y Científica:**
  * Estado: *Contraste directo con los libros y estudios del Dr. Franco Serafini (Cardiólogo) y Dr. Odoardo Linoli (Patólogo)*.

---

## 3. Tareas Técnicas Diferidas para Post-Lanzamiento (No V1)

- [ ] Implementación de pasarela de donaciones (Stripe / Mercado Pago / PayPal) — Diferido hasta alcanzar volumen de tráfico orgánico sostenido.
- [ ] Creación de cuentas de usuario o perfiles devocionales — Diferido para mantener arquitectura 100% estática a costo $0 USD.
- [ ] Soporte multi-idioma (`lang="en"`, `lang="pt"`) — Diferido; el foco de V1 es la excelencia y posicionamiento en idioma español neutro.
- [ ] Sistema de comentarios en artículos — Omitido deliberadamente para evitar spam, costos de base de datos y moderación en proyecto solo-dev.
