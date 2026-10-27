import { useState, useRef } from 'preact/hooks';
import { TEMAS_APOLOGETICA, findMatchingApologetica, type ApologeticaResponse } from '../../data/apologeticaData';

export default function EscudoApologetica() {
  const [query, setQuery] = useState('');
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApologeticaResponse | null>(null);
  const [copiedQuick, setCopiedQuick] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleBuscar = async (textToSearch?: string, temaId?: string) => {
    const q = (textToSearch !== undefined ? textToSearch : query).trim();
    const tId = temaId !== undefined ? temaId : selectedTema;

    if (!q && !tId) {
      setErrorMsg('Por favor, escribe una objeción que te hayan hecho o selecciona un tema arriba.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/apologetica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, temaId: tId }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const fallback = findMatchingApologetica(q, tId || undefined);
        setResult(fallback);
      }
    } catch {
      const fallback = findMatchingApologetica(q, tId || undefined);
      setResult(fallback);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleSelectTema = (tId: string) => {
    setSelectedTema(tId);
    handleBuscar(query, tId);
  };

  const handleCopiarQuick = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.respuestaRapidaWhatsApp);
    setCopiedQuick(true);
    setTimeout(() => setCopiedQuick(false), 2500);
  };

  const handleCopiarFull = () => {
    if (!result) return;
    const versiculosStr = result.versiculos
      .map((v) => `• ${v.cita}: «${v.texto}»\n  Explicación: ${v.explicacion}`)
      .join('\n\n');

    const textoCompleto = `🛡️ DEFENSA DE LA FE CATÓLICA: ${result.tema}\n\n❓ OBJECIÓN: «${result.objecion}»\n\n🔍 LA CONFUSIÓN DE FONDO:\n${result.confusion}\n\n📖 FUNDAMENTO BÍBLICO:\n${versiculosStr}\n\n🏛️ LOS PRIMEROS CRISTIANOS (${result.padresDeLaIglesia.fecha}):\n«${result.padresDeLaIglesia.cita}» — ${result.padresDeLaIglesia.santo} (${result.padresDeLaIglesia.obra})\n\n💬 RESPUESTA RÁPIDA:\n${result.respuestaRapidaWhatsApp}\n\nRazón y Asombro | https://razonyasombro.com/apologetica/`;

    navigator.clipboard.writeText(textoCompleto);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const getWhatsAppUrl = () => {
    if (!result) return '#';
    const msg = `*🛡️ Respuesta Católica a la Objeción:*\n_«${result.objecion}»_\n\n${result.respuestaRapidaWhatsApp}\n\n👉 *Lee el análisis bíblico y de los primeros cristianos:* https://razonyasombro.com/apologetica/`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
    setSelectedTema(null);
    setErrorMsg(null);
  };

  return (
    <div class="w-full max-w-4xl mx-auto space-y-8">

      {/* Caja de Búsqueda y Diálogo */}
      <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-10">
        
        {/* Adorno sutil */}
        <div class="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div class="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

        <div class="relative space-y-6">
          
          <div class="text-center max-w-2xl mx-auto space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 border border-indigo-600/20">
              <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
              Apologética Bíblica y Patrística
            </span>
            <h2 class="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-stone-100">
              El Escudo de la Fe
            </h2>
            <p class="text-sm sm:text-base text-stone-600 dark:text-stone-300">
              «Estad siempre preparados para dar respuesta a todo el que os pida razón de vuestra esperanza, pero hacedlo con mansedumbre y respeto» (1 Pedro 3, 15).
            </p>
          </div>

          {/* Temas Frecuentes / Pills */}
          <div class="space-y-2.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center">
              Toca una objeción común para obtener respuesta inmediata:
            </label>
            <div class="flex flex-wrap justify-center gap-2">
              {TEMAS_APOLOGETICA.map((t) => {
                const isSelected = selectedTema === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTema(t.id)}
                    class={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/40 ring-offset-2 dark:ring-offset-slate-900'
                        : 'bg-stone-100 dark:bg-slate-800/80 text-stone-700 dark:text-stone-300 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:text-amber-400 border border-stone-200/60 dark:border-slate-700'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de Entrada Libre */}
          <div class="space-y-3">
            <div class="relative">
              <textarea
                value={query}
                onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)}
                placeholder="O escribe la duda que te plantearon: «¿Por qué rezar el rosario si Mateo 6 prohíbe vanas repeticiones?», «¿Por qué llaman Padre al cura si Mateo 23 dice a nadie llaméis padre?», «¿Jesús es el arcángel Miguel?»..."
                rows={3}
                maxLength={500}
                class="w-full px-4 py-3.5 text-sm sm:text-base rounded-2xl bg-stone-50/70 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all resize-none"
              />
              <span class="absolute bottom-3 right-3 text-[11px] text-stone-400 dark:text-stone-500 pointer-events-none">
                {query.length}/500
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
                🛡️ Fuentes Bíblicas &middot; Patrística Siglos I-IV &middot; Magisterio
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
                    Consultando Escritura y Santos...
                  </>
                ) : (
                  <>
                    <span>Armar Defensa Bíblica</span>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Resultados de la Defensa */}
      {result && (
        <div ref={resultsRef} class="space-y-6 pt-4 animate-fade-in">
          
          {/* Cabecera del Resultado */}
          <div class="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
            <div class="space-y-0.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Tema Doctrinal
              </span>
              <h3 class="font-serif text-lg sm:text-xl font-bold text-slate-950 dark:text-stone-100">
                {result.tema}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              class="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Nueva Objeción &rarr;
            </button>
          </div>

          {/* Objeción Planteada */}
          <div class="p-5 rounded-2xl bg-stone-100/80 dark:bg-slate-900/80 border border-stone-200 dark:border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
              Objeción Común Planteada:
            </span>
            <p class="font-serif italic text-sm sm:text-base text-stone-800 dark:text-stone-200">
              «{result.objecion}»
            </p>
          </div>

          {/* Tarjeta 1: La Confusión de Fondo */}
          <div class="p-6 sm:p-7 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              <span>🔍</span> La Confusión de Fondo
            </div>
            <p class="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-reading">
              {result.confusion}
            </p>
          </div>

          {/* Tarjeta 2: Fundamento Bíblico Inapelable */}
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <span class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                <span>📖</span> Los Versículos Bíblicos Clave
              </span>
              <span class="text-[11px] text-stone-500 dark:text-stone-400">
                Texto en contexto real
              </span>
            </div>

            <div class="space-y-5">
              {result.versiculos.map((v, idx) => (
                <div key={idx} class="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-slate-950/70 border border-stone-200/80 dark:border-slate-800 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-serif font-bold text-sm sm:text-base text-amber-700 dark:text-amber-400">
                      {v.cita}
                    </span>
                    <span class="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-stone-300">
                      Escritura
                    </span>
                  </div>
                  <blockquote class="font-serif italic text-sm text-slate-900 dark:text-stone-100 pl-3 border-l-2 border-amber-500">
                    {v.texto}
                  </blockquote>
                  <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-reading leading-relaxed pt-1">
                    <strong>Por qué refuta la objeción:</strong> {v.explicacion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta 3: Los Primeros Cristianos (Patrística) */}
          <div class="p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                <span>🏛️</span> El Testimonio de los Primeros Cristianos (Patrística)
              </span>
              <span class="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                {result.padresDeLaIglesia.fecha}
              </span>
            </div>
            
            <blockquote class="font-serif italic text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed border-l-2 border-stone-400 pl-4">
              «{result.padresDeLaIglesia.cita}»
            </blockquote>

            <p class="text-xs text-right font-medium text-stone-500 dark:text-stone-400">
              — <strong class="text-stone-700 dark:text-stone-300">{result.padresDeLaIglesia.santo}</strong>, <em>{result.padresDeLaIglesia.obra}</em>
            </p>
          </div>

          {/* Tarjeta 4: Respuesta Rápida para WhatsApp y Redes */}
          <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-stone-900 text-white border border-slate-800 shadow-xl space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <span>💬</span> Respuesta Rápida y Respetuosa para Chats
              </span>
              <span class="text-[11px] text-stone-400">
                Lista para copiar y pegar en un debate
              </span>
            </div>

            <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-reading text-sm sm:text-base leading-relaxed text-stone-200 select-all">
              {result.respuestaRapidaWhatsApp}
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div class="flex flex-wrap items-center gap-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                >
                  <span>📲 Enviar por WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopiarQuick}
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all"
                >
                  <span>{copiedQuick ? '✓ Texto Copiado' : '📋 Copiar Mensaje Corto'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopiarFull}
                class="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-amber-400 transition-colors"
              >
                <span>{copiedFull ? '✓ Argumento Completo Copiado' : 'Copiar Estudio Completo con Citas'}</span>
              </button>
            </div>
          </div>

          {/* Magisterio de la Iglesia */}
          {result.doctrinaMagisterio && (
            <p class="text-xs text-stone-500 dark:text-stone-400 text-center italic">
              Doctrina definida: {result.doctrinaMagisterio}
            </p>
          )}

        </div>
      )}

    </div>
  );
}
