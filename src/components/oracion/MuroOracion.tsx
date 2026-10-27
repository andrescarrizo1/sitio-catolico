import { useState, useEffect } from 'preact/hooks';
import { INTENCIONES_INICIALES, type IntencionOracion } from '../../data/oracionData';

export default function MuroOracion() {
  const [intenciones, setIntenciones] = useState<IntencionOracion[]>(INTENCIONES_INICIALES);
  const [velasEncendidas, setVelasEncendidas] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [hermanosEnVivo, setHermanosEnVivo] = useState(38);

  // Formulario nueva intención
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [categoria, setCategoria] = useState<IntencionOracion['categoria']>('salud');
  const [peticion, setPeticion] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Cargar velas guardadas
    const saved = localStorage.getItem('muro_velas_encendidas');
    if (saved) {
      try {
        setVelasEncendidas(JSON.parse(saved));
      } catch {}
    }

    // Cargar intenciones locales añadidas
    const custom = localStorage.getItem('muro_intenciones_usuario');
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed)) {
          setIntenciones([...parsed, ...INTENCIONES_INICIALES]);
        }
      } catch {}
    }

    // Variación natural de hermanos en oración
    const interval = setInterval(() => {
      setHermanosEnVivo((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 25 ? 32 : next > 65 ? 45 : next;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleEncenderVela = (id: string) => {
    if (velasEncendidas[id]) return;

    const nuevasVelas = { ...velasEncendidas, [id]: true };
    setVelasEncendidas(nuevasVelas);
    localStorage.setItem('muro_velas_encendidas', JSON.stringify(nuevasVelas));

    setIntenciones((prev) =>
      prev.map((item) => (item.id === id ? { ...item, velas: item.velas + 1 } : item))
    );
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!peticion.trim()) {
      setErrorMsg('Por favor escribe el motivo de tu petición.');
      return;
    }

    setErrorMsg(null);
    const nueva: IntencionOracion = {
      id: `usr-${Date.now()}`,
      nombre: nombre.trim() || 'Anónimo',
      pais: pais.trim() || 'Hispanoamérica',
      categoria,
      peticion: peticion.trim(),
      velas: 1,
      fecha: 'Hace un momento',
    };

    const actualizadas = [nueva, ...intenciones];
    setIntenciones(actualizadas);

    // Guardar en local
    const misPeticiones = JSON.parse(localStorage.getItem('muro_intenciones_usuario') || '[]');
    misPeticiones.unshift(nueva);
    localStorage.setItem('muro_intenciones_usuario', JSON.stringify(misPeticiones));

    // Resetear form
    setNombre('');
    setPais('');
    setPeticion('');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
  };

  const filtradas = intenciones.filter((item) =>
    activeFilter === 'todos' ? true : item.categoria === activeFilter
  );

  return (
    <div class="w-full max-w-4xl mx-auto space-y-10">

      {/* Indicador de Comunión en Tiempo Real */}
      <div class="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 gap-4">
        <div class="flex items-center gap-3">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
          </span>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>🕊️ Comunión de los Santos en Vivo:</span>
              <span class="text-amber-700 dark:text-amber-400">{hermanosEnVivo} fieles en oración</span>
            </h4>
            <p class="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
              «Donde dos o tres están congregados en mi nombre, allí estoy yo en medio de ellos» (Mt 18, 20).
            </p>
          </div>
        </div>

        <a
          href="/rosario/"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 shadow-sm"
        >
          <span>Unirme al Rosario de Hoy</span>
          <span>&rarr;</span>
        </a>
      </div>

      {/* Formulario para Dejar una Petición */}
      <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-md space-y-5">
        <div class="space-y-1 text-center sm:text-left">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Muro de Oración Comunitaria
          </span>
          <h3 class="font-serif text-xl sm:text-2xl font-bold text-slate-950 dark:text-stone-100">
            Deja tu intención para el Santo Rosario
          </h3>
          <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Nuestra comunidad ofrece diariamente las decenas del Rosario por cada una de estas intenciones.
          </p>
        </div>

        {enviado ? (
          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium text-center">
            ✓ Tu petición ha sido colocada en el altar del Muro de Oración. Que el Señor escuche nuestra súplica común.
          </div>
        ) : (
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Tu Nombre (o «Anónimo»)
                </label>
                <input
                  type="text"
                  value={nombre}
                  onInput={(e) => setNombre((e.target as HTMLInputElement).value)}
                  placeholder="Ej: Andrés / María"
                  class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  País o Ciudad
                </label>
                <input
                  type="text"
                  value={pais}
                  onInput={(e) => setPais((e.target as HTMLInputElement).value)}
                  placeholder="Ej: Argentina, México, España..."
                  class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Motivo de la Petición
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria((e.target as HTMLSelectElement).value as any)}
                  class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="salud">🩹 Salud y Enfermos</option>
                  <option value="familia">💔 Familia y Matrimonio</option>
                  <option value="difuntos">🕊️ Descanso de Difuntos</option>
                  <option value="conversion">✝️ Conversión de Hijos/Seres queridos</option>
                  <option value="agradecimiento">✨ Acción de Gracias</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Escribe tu súplica o agradecimiento
              </label>
              <textarea
                value={peticion}
                onInput={(e) => setPeticion((e.target as HTMLTextAreaElement).value)}
                rows={3}
                maxLength={400}
                required
                placeholder="Ejemplo: «Pido una decena del Rosario por la operación de corazón de mi hermano mañana a las 8 AM»..."
                class="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-reading"
              />
            </div>

            {errorMsg && (
              <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              Publicar Petición en el Muro
            </button>
          </form>
        )}
      </div>

      {/* Filtros de Peticiones */}
      <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
        {[
          { id: 'todos', label: 'Todas las Intenciones' },
          { id: 'salud', label: '🩹 Salud' },
          { id: 'familia', label: '💔 Familia' },
          { id: 'difuntos', label: '🕊️ Difuntos' },
          { id: 'conversion', label: '✝️ Conversión' },
          { id: 'agradecimiento', label: '✨ Gracias' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            class={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilter === f.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de Intenciones con Botón de Encender Vela */}
      <div class="space-y-4">
        {filtradas.map((item) => {
          const yaEncendio = !!velasEncendidas[item.id];

          return (
            <div
              key={item.id}
              class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              <div class="space-y-2 max-w-xl">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900 dark:text-stone-100">
                    {item.nombre}
                  </span>
                  <span class="text-[11px] text-stone-400 dark:text-stone-500">
                    &middot; {item.pais}
                  </span>
                  <span class="text-[11px] text-stone-400 dark:text-stone-500">
                    &middot; {item.fecha}
                  </span>
                </div>

                <p class="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-reading leading-relaxed">
                  «{item.peticion}»
                </p>
              </div>

              {/* Botón de Encender Vela / Rezar */}
              <button
                type="button"
                onClick={() => handleEncenderVela(item.id)}
                class={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  yaEncendio
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500/15 hover:text-amber-800 dark:hover:text-amber-400 border border-stone-200 dark:border-slate-700'
                }`}
              >
                <span class={yaEncendio ? 'animate-bounce text-base' : 'text-base'}>
                  {yaEncendio ? '🕯️' : '🕯️'}
                </span>
                <span>
                  {yaEncendio ? 'Vela Encendida' : 'Rezo por ti'} ({item.velas})
                </span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
