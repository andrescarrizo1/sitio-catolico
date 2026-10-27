import { useState, useRef } from 'preact/hooks';
import { CATEGORIAS_CONSUELO, findMatchingConsuelo, type ConsueloResponse } from '../../data/consueloData';

export default function BuscadorConsuelo() {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsueloResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleBuscar = async (textToSearch?: string, catId?: string) => {
    const q = (textToSearch !== undefined ? textToSearch : query).trim();
    const cat = catId !== undefined ? catId : selectedCat;

    if (!q && !cat) {
      setErrorMsg('Por favor, cuéntanos brevemente qué te aflige o selecciona uno de los temas abajo.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      // Intentamos llamar a la API Worker (Workers AI)
      const res = await fetch('/api/consuelo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, categoria: cat }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Si el endpoint no responde (ej. en desarrollo local estático o cuota)
        const fallback = findMatchingConsuelo(q, cat || undefined);
        setResult(fallback);
      }
    } catch {
      // Fallback seguro client-side si hay fallo de red
      const fallback = findMatchingConsuelo(q, cat || undefined);
      setResult(fallback);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleSelectCat = (catId: string) => {
    setSelectedCat(catId);
    handleBuscar(query, catId);
  };

  const formatQuote = (text: string) => {
    if (!text) return '';
    const clean = text.replace(/^[«"'\s]+|[»"'\s]+$/g, '').trim();
    return `«${clean}»`;
  };

  const handleCopiar = () => {
    if (!result) return;
    const texto = `🕊️ PALABRA DE DIOS:\n${formatQuote(result.versiculo)} (${result.referencia})\n\n✨ VOZ DE LOS SANTOS:\n${formatQuote(result.santo.frase)} — ${result.santo.nombre}\n\n🌿 CONSUELO ESPIRITUAL:\n${result.reflexion}\n\n📿 PASO ESPIRITUAL:\n${result.accion.titulo}: ${result.accion.descripcion}\n\nRazón y Asombro | https://razonyasombro.com/consuelo/`;
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsAppUrl = () => {
    if (!result) return '#';
    const msg = `*Palabra de Dios para el corazón herido:*\n${formatQuote(result.versiculo)}\n_(${result.referencia})_\n\n*${result.santo.nombre}:*\n${formatQuote(result.santo.frase)}\n\nEncuentra paz y consuelo católico en:\nhttps://razonyasombro.com/consuelo/`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
    setSelectedCat(null);
    setErrorMsg(null);
  };

  return (
    <div class="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Caja de Búsqueda y Diálogo */}
      <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-10">
        
        {/* Adorno sutil de fondo */}
        <div class="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div class="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-amber-600/5 blur-3xl pointer-events-none" />

        <div class="relative space-y-6">
          
          <div class="text-center max-w-2xl mx-auto space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-600/20">
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              Luz Doctrinal y Consuelo Bíblico
            </span>
            <h2 class="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-stone-100">
              ¿Qué carga pesa hoy sobre tu alma?
            </h2>
            <p class="text-sm sm:text-base text-stone-600 dark:text-stone-300">
              Escribe con confianza tu dolor, miedo o duda. La fe de la Iglesia no es una teoría fría: es un Refugio vivo en la Palabra de Cristo y los Santos.
            </p>
          </div>

          {/* Temas Rápidos / Pills */}
          <div class="space-y-2.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center">
              O elige una situación frecuente:
            </label>
            <div class="flex flex-wrap justify-center gap-2">
              {CATEGORIAS_CONSUELO.map((cat) => {
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCat(cat.id)}
                    class={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/40 ring-offset-2 dark:ring-offset-slate-900'
                        : 'bg-stone-100 dark:bg-slate-800/80 text-stone-700 dark:text-stone-300 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:text-amber-400 border border-stone-200/60 dark:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de Entrada de Texto */}
          <div class="space-y-3">
            <div class="relative">
              <textarea
                value={query}
                onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)}
                placeholder="Ejemplo: «Perdí a mi madre y siento un vacío que me ahoga», «Tengo mucha ansiedad por no encontrar empleo», «Siento vergüenza de volver a confesar el mismo pecado»..."
                rows={4}
                maxLength={600}
                class="w-full px-4 py-3.5 text-sm sm:text-base rounded-2xl bg-stone-50/70 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all resize-none"
              />
              <span class="absolute bottom-3 right-3 text-[11px] text-stone-400 dark:text-stone-500 pointer-events-none">
                {query.length}/600
              </span>
            </div>

            {errorMsg && (
              <p class="text-xs text-rose-600 dark:text-rose-400 text-center font-medium">
                {errorMsg}
              </p>
            )}

            {/* Botón Principal */}
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span class="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
                🔒 Confidencial &middot; Consulta anónima &middot; $0 Costo
              </span>
              
              <button
                type="button"
                disabled={loading}
                onClick={() => handleBuscar()}
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-600/20"
              >
                {loading ? (
                  <>
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando Luz en la Palabra...
                  </>
                ) : (
                  <>
                    <span>Pedir Consuelo y Guía</span>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Resultados Espirituales */}
      {result && (
        <div ref={resultsRef} class="space-y-6 pt-4 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Tema: <strong class="text-stone-800 dark:text-stone-200">{result.categoria}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              class="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Nueva Consulta &rarr;
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Tarjeta 1: Sagrada Escritura */}
            <div class="relative p-6 sm:p-7 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 shadow-sm flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    📖 La Palabra que Sana
                  </span>
                  <span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-600/20">
                    Sagrada Escritura
                  </span>
                </div>
                <blockquote class="font-serif text-lg sm:text-xl italic text-slate-900 dark:text-amber-100/90 leading-relaxed pt-1">
                  {formatQuote(result.versiculo)}
                </blockquote>
              </div>
              <p class="text-xs font-bold text-amber-800 dark:text-amber-300 mt-4 text-right">
                — {result.referencia}
              </p>
            </div>

            {/* Tarjeta 2: Sabiduría de los Santos */}
            <div class="relative p-6 sm:p-7 rounded-3xl bg-stone-50 dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    🕊️ La Voz de los Santos
                  </span>
                  {result.santo.epoca && (
                    <span class="text-[11px] text-stone-500 dark:text-stone-400">
                      {result.santo.epoca}
                    </span>
                  )}
                </div>
                <blockquote class="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed italic pt-1">
                  {formatQuote(result.santo.frase)}
                </blockquote>
              </div>
              <p class="text-xs font-bold text-amber-700 dark:text-amber-400 mt-4 text-right">
                — {result.santo.nombre}
              </p>
            </div>

          </div>

          {/* Tarjeta 3: Bálsamo y Reflexión Pastoral */}
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              🌿 Bálsamo Espiritual para tu Corazón
            </span>
            <div class="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {result.reflexion}
            </div>
          </div>

          {/* Tarjeta 4: Paso Espiritual Inmediato */}
          <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-amber-950/30 text-white border border-slate-800 dark:border-amber-600/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center sm:text-left">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400">
                📿 Tu Paso de Fe Inmediato
              </span>
              <h3 class="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                {result.accion.titulo}
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 max-w-xl">
                {result.accion.descripcion}
              </p>
            </div>
            <a
              href={result.accion.enlace}
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shrink-0"
            >
              <span>{result.accion.textoBoton}</span>
              <span>&rarr;</span>
            </a>
          </div>

          {/* Barra de Acciones y Compartir */}
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div class="flex flex-wrap items-center gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <span>📲 Compartir por WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={handleCopiar}
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 transition-colors"
              >
                <span>{copied ? '✓ Copiado al Portapapeles' : '📋 Copiar Consejos'}</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <a
                href="/contacto/"
                class="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
              >
                Dejar tu intención para el Rosario &rarr;
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
