import { useState, useEffect } from 'preact/hooks';

interface Props {
  initialMode?: 'interactive' | 'reading';
}

interface DecenaIntencion {
  numero: string;
  titulo: string;
  meditacion: string;
}

const INTENCIONES_CORONILLA: DecenaIntencion[] = [
  {
    numero: 'I',
    titulo: 'Por toda la humanidad y los pecadores',
    meditacion: 'Ofrecemos la dolorosa Pasión de Cristo implorando la gracia del arrepentimiento para quienes viven lejos de Dios o en la desesperación.'
  },
  {
    numero: 'II',
    titulo: 'Por las almas de los sacerdotes y religiosos',
    meditacion: 'Pedimos fidelidad, celo apostólico y pureza para los ministros del altar y las personas consagradas en la Iglesia universal.'
  },
  {
    numero: 'III',
    titulo: 'Por las almas devotas y fieles',
    meditacion: 'Rogamos por los cristianos que procuran vivir con fidelidad el Evangelio en medio de las pruebas, el cansancio y la incomprensión.'
  },
  {
    numero: 'IV',
    titulo: 'Por los que aún no conocen a Cristo',
    meditacion: 'Suplicamos la luz del Espíritu Santo para aquellos que nunca han escuchado la Buena Nueva o han sido heridos por malos testimonios.'
  },
  {
    numero: 'V',
    titulo: 'Por los agonizantes y las almas del Purgatorio',
    meditacion: 'Invocamos el abrazo salvífico de Jesús en el momento supremo de la muerte y el pronto descanso eterno para las almas santas que esperan la gloria.'
  }
];

export default function CoronillaInteractiveApp({ initialMode = 'interactive' }: Props) {
  const [mode, setMode] = useState<'interactive' | 'reading'>(initialMode);
  const [stage, setStage] = useState<'intro' | 'decena' | 'conclusion'>('intro');
  const [currentIntroStep, setCurrentIntroStep] = useState<number>(0);
  const [currentDecade, setCurrentDecade] = useState<number>(0); // 0..4
  const [currentBead, setCurrentBead] = useState<number>(0); // 0 = Padre Eterno, 1..10 = Invocaciones
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [hasTrackedStart, setHasTrackedStart] = useState<boolean>(false);

  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && typeof (window as any).trackGAEvent === 'function') {
      (window as any).trackGAEvent(eventName, params);
    }
  };

  // Inicializar estado desde localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedMode = localStorage.getItem('coronilla_mode');
      if (savedMode === 'interactive' || savedMode === 'reading') setMode(savedMode);

      const savedSound = localStorage.getItem('coronilla_sound');
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');

      const savedVibrate = localStorage.getItem('coronilla_vibrate');
      if (savedVibrate !== null) setVibrateEnabled(savedVibrate === 'true');

      const savedDecade = localStorage.getItem('coronilla_decade');
      const savedBead = localStorage.getItem('coronilla_bead');
      const savedStage = localStorage.getItem('coronilla_stage');
      if (savedStage && (savedStage === 'intro' || savedStage === 'decena' || savedStage === 'conclusion')) {
        setStage(savedStage);
        if (savedDecade) setCurrentDecade(parseInt(savedDecade, 10) || 0);
        if (savedBead) setCurrentBead(parseInt(savedBead, 10) || 0);
      }
    } catch {
      // ignore localStorage errors
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        advanceBead();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        retreatBead();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, currentIntroStep, currentDecade, currentBead, soundEnabled, vibrateEnabled]);

  const persist = (st: 'intro' | 'decena' | 'conclusion', dec: number, bd: number) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('coronilla_stage', st);
      localStorage.setItem('coronilla_decade', dec.toString());
      localStorage.setItem('coronilla_bead', bd.toString());
    } catch {
      // ignore
    }
  };

  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Armónico de paz 528 Hz
      osc.frequency.exponentialRampToValueAtTime(264, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext fallback
    }
  };

  const triggerFeedback = () => {
    playChime();
    if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const advanceBead = () => {
    triggerFeedback();

    if (!hasTrackedStart) {
      setHasTrackedStart(true);
      trackEvent('chaplet_start', { mode });
    }

    if (stage === 'intro') {
      if (currentIntroStep < 3) {
        const next = currentIntroStep + 1;
        setCurrentIntroStep(next);
        persist('intro', 0, next);
      } else {
        setStage('decena');
        setCurrentDecade(0);
        setCurrentBead(0);
        persist('decena', 0, 0);
      }
      return;
    }

    if (stage === 'decena') {
      if (currentBead < 10) {
        const nextBead = currentBead + 1;
        setCurrentBead(nextBead);
        persist('decena', currentDecade, nextBead);
      } else {
        // Fin de la decena
        if (currentDecade < 4) {
          const nextDec = currentDecade + 1;
          setCurrentDecade(nextDec);
          setCurrentBead(0);
          persist('decena', nextDec, 0);
        } else {
          setStage('conclusion');
          persist('conclusion', 4, 10);
          trackEvent('chaplet_complete', { mode });
        }
      }
      return;
    }

    if (stage === 'conclusion') {
      // Reiniciar
      resetPrayer(false);
    }
  };

  const retreatBead = () => {
    triggerFeedback();

    if (stage === 'conclusion') {
      setStage('decena');
      setCurrentDecade(4);
      setCurrentBead(10);
      persist('decena', 4, 10);
      return;
    }

    if (stage === 'decena') {
      if (currentBead > 0) {
        const prevBead = currentBead - 1;
        setCurrentBead(prevBead);
        persist('decena', currentDecade, prevBead);
      } else {
        if (currentDecade > 0) {
          const prevDec = currentDecade - 1;
          setCurrentDecade(prevDec);
          setCurrentBead(10);
          persist('decena', prevDec, 10);
        } else {
          setStage('intro');
          setCurrentIntroStep(3);
          persist('intro', 0, 3);
        }
      }
      return;
    }

    if (stage === 'intro' && currentIntroStep > 0) {
      const prev = currentIntroStep - 1;
      setCurrentIntroStep(prev);
      persist('intro', 0, prev);
    }
  };

  const resetPrayer = (confirmPrompt = true) => {
    if (confirmPrompt && !confirm('¿Deseas reiniciar el rezo de la Coronilla al principio?')) {
      return;
    }
    setStage('intro');
    setCurrentIntroStep(0);
    setCurrentDecade(0);
    setCurrentBead(0);
    persist('intro', 0, 0);
  };

  // Cálculo del progreso
  let progressPercentage = 0;
  if (stage === 'intro') {
    progressPercentage = Math.round(((currentIntroStep + 1) / 58) * 100);
  } else if (stage === 'decena') {
    const totalDone = 4 + (currentDecade * 11) + currentBead;
    progressPercentage = Math.min(100, Math.round((totalDone / 58) * 100));
  } else {
    progressPercentage = 100;
  }

  // Contenido de la oración según el paso activo
  let prayerBadge = '';
  let prayerTitle = '';
  let prayerText = '';
  let prayerInstruction = '';

  if (stage === 'intro') {
    if (currentIntroStep === 0) {
      prayerBadge = 'Inicio · Crucifijo';
      prayerTitle = 'Señal de la Santa Cruz';
      prayerText = 'Por la señal de la Santa Cruz, de nuestros enemigos líbranos, Señor Dios nuestro.\nEn el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.';
      prayerInstruction = 'Sostén el crucifijo de tu rosario con reverencia y santíguate.';
    } else if (currentIntroStep === 1) {
      prayerBadge = 'Cuentas Iniciales · 1ª Cuenta Grande';
      prayerTitle = 'Padre Nuestro';
      prayerText = 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad en la tierra como en el cielo.\nDanos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.';
      prayerInstruction = 'Reza el Padre Nuestro pidiendo la gracia de confiar en la Misericordia del Padre.';
    } else if (currentIntroStep === 2) {
      prayerBadge = 'Cuentas Iniciales · 1ª Cuenta Pequeña';
      prayerTitle = 'Ave María';
      prayerText = 'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús.\nSanta María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.';
      prayerInstruction = 'Pide la intercesión de la Virgen María, Madre de la Misericordia.';
    } else {
      prayerBadge = 'Cuentas Iniciales · 2ª Cuenta Pequeña';
      prayerTitle = 'Credo de los Apóstoles';
      prayerText = 'Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre Todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos.\nCreo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.';
      prayerInstruction = 'Proclama con firmeza la fe de la Iglesia católica.';
    }
  } else if (stage === 'decena') {
    const intencion = INTENCIONES_CORONILLA[currentDecade];
    if (currentBead === 0) {
      prayerBadge = `Decena ${currentDecade + 1} de 5 · Cuenta Grande del Padre Nuestro`;
      prayerTitle = 'Ofrecimiento al Padre Eterno';
      prayerText = 'Padre Eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.';
      prayerInstruction = `Decena ${intencion.numero}: ${intencion.titulo}. ${intencion.meditacion}`;
    } else {
      prayerBadge = `Decena ${currentDecade + 1} de 5 · Invocación ${currentBead} de 10`;
      prayerTitle = 'Súplica por la Dolorosa Pasión';
      prayerText = 'Por su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.';
      prayerInstruction = `Repite contemplando las llagas de Cristo. Invocación ${currentBead} de 10.`;
    }
  } else {
    prayerBadge = 'Conclusión de la Coronilla';
    prayerTitle = 'Trisagio Santo Inmortal (Rezar 3 Veces)';
    prayerText = 'Santo Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.\n\nSanto Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.\n\nSanto Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.';
    prayerInstruction = 'Para concluir, puedes añadir la jaculatoria: «Oh Sangre y Agua que brotaste del Corazón de Jesús como una fuente de misericordia para nosotros, en Ti confío» (x3).';
  }

  return (
    <section class="my-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 shadow-xl overflow-hidden transition-all" aria-label="Aplicación Interactiva de la Coronilla">
      
      {/* Cabecera de la Aplicación y Selector de Modos */}
      <div class="p-4 sm:p-6 bg-stone-100/80 dark:bg-slate-950/80 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-lg border border-amber-500/30">
            ✝
          </div>
          <div>
            <span class="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold block">
              Devoción de las 15:00 h &middot; Hora de la Misericordia
            </span>
            <h2 class="font-serif text-lg sm:text-xl font-bold text-slate-950 dark:text-stone-100 m-0">
              Coronilla de la Divina Misericordia Guiada
            </h2>
          </div>
        </div>

        {/* Pestañas de Modo: Interactivo vs Lectura */}
        <div class="flex items-center p-1 rounded-xl bg-stone-200/60 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('interactive'); localStorage.setItem('coronilla_mode', 'interactive'); }}
            class={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'interactive'
                ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            📿 Modo Interactivo
          </button>
          <button
            type="button"
            onClick={() => { setMode('reading'); localStorage.setItem('coronilla_mode', 'reading'); }}
            class={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'reading'
                ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            📖 Modo Lectura Contemplativa
          </button>
        </div>
      </div>

      {mode === 'interactive' ? (
        /* MODO INTERACTIVO CUENTA POR CUENTA */
        <div class="p-6 sm:p-8 space-y-6">

          {/* Barra de Progreso y Metadatos */}
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
              <span class="font-semibold text-amber-800 dark:text-amber-400">
                {prayerBadge}
              </span>
              <div class="flex items-center gap-3">
                <span class="font-mono">{progressPercentage}% completado</span>
                <button
                  type="button"
                  onClick={() => resetPrayer(true)}
                  class="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline text-[11px]"
                  title="Reiniciar rezo"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            <div class="w-full h-2.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Selector Rápido de las 5 Decenas */}
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-print">
            <button
              type="button"
              onClick={() => { setStage('intro'); setCurrentIntroStep(0); persist('intro', 0, 0); }}
              class={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                stage === 'intro'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              Cuentas Iniciales
            </button>
            {[0, 1, 2, 3, 4].map((decIdx) => (
              <button
                type="button"
                key={decIdx}
                onClick={() => {
                  setStage('decena');
                  setCurrentDecade(decIdx);
                  setCurrentBead(0);
                  persist('decena', decIdx, 0);
                }}
                class={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  stage === 'decena' && currentDecade === decIdx
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                Decena {decIdx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setStage('conclusion'); persist('conclusion', 4, 10); }}
              class={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                stage === 'conclusion'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              Trisagio Final
            </button>
          </div>

          {/* Indicador Visual de las 10 Cuentas de la Decena Activa */}
          {stage === 'decena' && (
            <div class="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 space-y-2">
              <div class="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span class="font-bold text-amber-800 dark:text-amber-400">
                  {currentBead === 0 ? 'Cuenta Grande: Padre Eterno' : `Cuenta Pequeña ${currentBead} de 10: Invocación`}
                </span>
                <span class="text-[11px] font-mono">
                  {currentBead === 0 ? '1 Ofrecimiento' : `${currentBead}/10 Invocaciones`}
                </span>
              </div>

              <div class="grid grid-cols-11 gap-1 sm:gap-2">
                <div
                  onClick={() => { setCurrentBead(0); persist('decena', currentDecade, 0); }}
                  class={`h-3.5 rounded-full cursor-pointer transition-all ${
                    currentBead === 0
                      ? 'bg-amber-600 dark:bg-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-sm'
                      : 'bg-amber-500/30 dark:bg-amber-500/20'
                  }`}
                  title="Padre Eterno (Cuenta Grande)"
                />
                {Array.from({ length: 10 }, (_, i) => {
                  const beadNum = i + 1;
                  const isCurrent = beadNum === currentBead;
                  const isPast = beadNum < currentBead;
                  return (
                    <div
                      key={beadNum}
                      onClick={() => { setCurrentBead(beadNum); persist('decena', currentDecade, beadNum); }}
                      class={`h-3.5 rounded-full cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-amber-600 dark:bg-amber-400 shadow-sm ring-2 ring-amber-400/50 scale-105'
                          : isPast
                          ? 'bg-amber-500/60 dark:bg-amber-500/40'
                          : 'bg-stone-200 dark:bg-slate-800'
                      }`}
                      title={`Invocación ${beadNum} de 10`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Tarjeta Principal de Oración */}
          <div
            class="p-6 sm:p-8 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 space-y-4"
            aria-live="polite"
          >
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <span class="font-serif text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                {prayerTitle}
              </span>

              {/* Controles de Accesibilidad: Fuente y Audio */}
              <div class="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                  class="px-2 py-1 rounded bg-stone-200/60 dark:bg-slate-800 text-stone-700 dark:text-stone-300 font-bold"
                  title="Cambiar tamaño de fuente"
                >
                  {fontSize === 'normal' ? 'A+' : 'A-'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    localStorage.setItem('coronilla_sound', next.toString());
                  }}
                  class={`px-2.5 py-1 rounded transition-colors ${
                    soundEnabled
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold'
                      : 'bg-stone-200/60 dark:bg-slate-800 text-stone-400'
                  }`}
                  title="Sonido de campana litúrgica"
                >
                  🔔 {soundEnabled ? 'Sonido activado' : 'Silencio'}
                </button>
              </div>
            </div>

            {/* Texto de la Oración */}
            <blockquote
              class={`font-reading text-slate-900 dark:text-stone-100 leading-relaxed italic m-0 whitespace-pre-line ${
                fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              }`}
            >
              &laquo;{prayerText}&raquo;
            </blockquote>

            {/* Indicación Pastoral */}
            <p class="text-xs text-stone-500 dark:text-stone-400 m-0 pt-2 border-t border-stone-200/50 dark:border-slate-800 font-reading">
              <strong>Guía:</strong> {prayerInstruction}
            </p>
          </div>

          {/* Botones de Control Ergonómicos Mobile-First */}
          <div class="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={retreatBead}
              disabled={stage === 'intro' && currentIntroStep === 0}
              class="px-4 py-3 sm:py-3.5 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-colors"
            >
              &larr; Anterior
            </button>

            <span class="hidden sm:inline text-xs text-stone-400 font-mono">
              [Usa la barra espaciadora para avanzar]
            </span>

            <button
              type="button"
              onClick={advanceBead}
              class="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-base shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{stage === 'conclusion' ? 'Concluir y Reiniciar' : 'Siguiente cuenta'}</span>
              <span>&rarr;</span>
            </button>
          </div>

        </div>
      ) : (
        /* MODO LECTURA CONTEMPLATIVA Y ORACIÓN CONTINUA */
        <div class="p-6 sm:p-10 space-y-8 font-reading">
          
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-2">
            <p class="m-0 font-bold text-amber-800 dark:text-amber-400 font-serif">
              Modo de Lectura Continua para la Oración Personal o Comunitaria
            </p>
            <p class="m-0 leading-relaxed">
              Lee y contempla estas oraciones pausadamente a las 15:00 horas o ante el Sagrario. También puedes utilizar el botón de impresión para obtener una copia física limpia en papel o PDF.
            </p>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <h3 class="font-serif text-lg font-bold text-amber-800 dark:text-amber-400">
                1. Oraciones Iniciales (En el crucifijo y primeras cuentas)
              </h3>
              <p class="text-sm italic">
                «En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.»
              </p>
              <p class="text-sm">
                <strong>Padre Nuestro:</strong> Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.
              </p>
              <p class="text-sm">
                <strong>Ave María:</strong> Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.
              </p>
              <p class="text-sm">
                <strong>Credo de los Apóstoles:</strong> Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra...
              </p>
            </div>

            <div class="space-y-4 pt-4 border-t border-stone-200 dark:border-slate-800">
              <h3 class="font-serif text-lg font-bold text-amber-800 dark:text-amber-400">
                2. Las Cinco Decenas
              </h3>
              <p class="text-sm text-stone-600 dark:text-stone-400">
                En cada una de las 5 decenas del rosario ordinario, se reza:
              </p>
              <div class="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 space-y-2">
                <p class="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 m-0">En la cuenta grande:</p>
                <blockquote class="italic text-base text-slate-900 dark:text-stone-100 m-0">
                  «Padre Eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.»
                </blockquote>
              </div>
              <div class="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 space-y-2">
                <p class="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 m-0">En cada una de las 10 cuentas pequeñas:</p>
                <blockquote class="italic text-base text-slate-900 dark:text-stone-100 m-0">
                  «Por su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.»
                </blockquote>
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-stone-200 dark:border-slate-800">
              <h3 class="font-serif text-lg font-bold text-amber-800 dark:text-amber-400">
                3. Oración Conclusiva (Al terminar las 5 decenas)
              </h3>
              <p class="text-sm text-stone-600 dark:text-stone-400">
                Se reza tres veces consecutivas:
              </p>
              <blockquote class="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 italic text-base text-slate-900 dark:text-stone-100 m-0">
                «Santo Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.» (x3)
              </blockquote>
              <p class="text-sm text-stone-600 dark:text-stone-400 pt-2">
                Jaculatoria de confianza:
              </p>
              <blockquote class="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 italic text-sm text-slate-900 dark:text-stone-100 m-0">
                «Oh Sangre y Agua que brotaste del Corazón de Jesús como una fuente de misericordia para nosotros, en Ti confío.» (x3)
              </blockquote>
            </div>
          </div>

          {/* Botón de Impresión en Modo Lectura */}
          <div class="pt-4 flex justify-end no-print">
            <button
              type="button"
              onClick={() => window.print()}
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-slate-800 hover:bg-stone-300 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors"
            >
              <span>🖨️ Imprimir Guía / Guardar en PDF</span>
            </button>
          </div>

        </div>
      )}

    </section>
  );
}
