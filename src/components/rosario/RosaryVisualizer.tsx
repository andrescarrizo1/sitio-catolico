// Coordenadas y renderizado SVG del Santo Rosario Interactivo
// Representa físicamente la cruz, cuentas iniciales, medalla central y las 5 decenas.

export interface VisualBead {
  id: string;
  cx: number;
  cy: number;
  r: number;
  tipo: 'cruz' | 'medalla' | 'pater' | 'ave';
  decena?: number; // 0..4
  cuenta?: number; // 0..10
  etiqueta: string;
}

// Cálculo matemático precalculado para un lienzo SVG de 460 x 580
function generarCuentasRosario(): VisualBead[] {
  const beads: VisualBead[] = [];

  // 1. Cuentas del cordal inicial (línea vertical inferior bajo la medalla)
  // Centro X = 230
  // Crucifijo en el extremo inferior
  beads.push({
    id: 'bead-cruz',
    cx: 230,
    cy: 530,
    r: 14,
    tipo: 'cruz',
    etiqueta: 'Crucifijo: Señal de la Cruz y Credo de los Apóstoles'
  });

  // Padre Nuestro inicial (cuenta gruesa)
  beads.push({
    id: 'bead-intro-pater',
    cx: 230,
    cy: 468,
    r: 7.5,
    tipo: 'pater',
    etiqueta: 'Padre Nuestro inicial'
  });

  // Tres Avemarías (Fe, Esperanza, Caridad)
  beads.push({
    id: 'bead-intro-ave-1',
    cx: 230,
    cy: 438,
    r: 5.5,
    tipo: 'ave',
    etiqueta: '1ª Avemaría inicial (Por el aumento de la Fe)'
  });
  beads.push({
    id: 'bead-intro-ave-2',
    cx: 230,
    cy: 416,
    r: 5.5,
    tipo: 'ave',
    etiqueta: '2ª Avemaría inicial (Por el aumento de la Esperanza)'
  });
  beads.push({
    id: 'bead-intro-ave-3',
    cx: 230,
    cy: 394,
    r: 5.5,
    tipo: 'ave',
    etiqueta: '3ª Avemaría inicial (Por el aumento de la Caridad)'
  });

  // Medalla Central (conector en el vértice inferior de la elipse)
  beads.push({
    id: 'bead-medalla',
    cx: 230,
    cy: 348,
    r: 10,
    tipo: 'medalla',
    etiqueta: 'Medalla Central de Nuestra Señora'
  });

  // 2. Cuentas de las 5 Decenas en la elipse superior
  // Centro de la elipse: cx = 230, cy = 185, rx = 155, ry = 135
  const cx = 230;
  const cy = 185;
  const rx = 155;
  const ry = 135;

  // Cada decena ocupa un sector angular del anillo (5 decenas = 5 tramos)
  // El anillo empieza desde la izquierda de la medalla y gira en sentido horario:
  // Decena 1: Cuadrante inferior-izquierdo a medio-izquierdo (~108° a 164°)
  // Decena 2: Cuadrante medio-izquierdo a superior-izquierdo (~176° a 236°)
  // Decena 3: Cuadrante superior (~248° a 308°)
  // Decena 4: Cuadrante superior-derecho a medio-derecho (~320° a 20°)
  // Decena 5: Cuadrante medio-derecho a inferior-derecho (~32° a 82°)

  const rangosDecenas = [
    { dec: 0, startPater: 106, startAve: 112, endAve: 164 },
    { dec: 1, startPater: 178, startAve: 184, endAve: 236 },
    { dec: 2, startPater: 250, startAve: 256, endAve: 308 },
    { dec: 3, startPater: 322, startAve: 328, endAve: 380 }, // 380 = 20°
    { dec: 4, startPater: 394, startAve: 400, endAve: 450 }, // 450 = 90° - 18°
  ];

  rangosDecenas.forEach(({ dec, startPater, startAve, endAve }) => {
    // Padre Nuestro de la decena (cuenta mayor)
    const radPater = (startPater * Math.PI) / 180;
    const px = Math.round(cx + rx * Math.cos(radPater));
    const py = Math.round(cy + ry * Math.sin(radPater));

    beads.push({
      id: `bead-d${dec}-pater`,
      cx: px,
      cy: py,
      r: 8,
      tipo: 'pater',
      decena: dec,
      cuenta: 0,
      etiqueta: `Decena ${dec + 1}: Misterio y Padre Nuestro`
    });

    // 10 Avemarías de la decena
    for (let a = 1; a <= 10; a++) {
      const t = (a - 1) / 9;
      const angle = startAve + t * (endAve - startAve);
      const rad = (angle * Math.PI) / 180;
      const bx = Math.round(cx + rx * Math.cos(rad));
      const by = Math.round(cy + ry * Math.sin(rad));

      beads.push({
        id: `bead-d${dec}-a${a}`,
        cx: bx,
        cy: by,
        r: 5.5,
        tipo: 'ave',
        decena: dec,
        cuenta: a,
        etiqueta: `Decena ${dec + 1} &middot; Avemaría ${a} de 10`
      });
    }
  });

  return beads;
}

export const ROSARY_BEADS = generarCuentasRosario();

interface RosaryVisualizerProps {
  activeBeadId: string;
  completedBeadIds: Set<string>;
  onSelectBead: (bead: VisualBead) => void;
  mysteryName?: string;
  currentDecade: number;
}

export default function RosaryVisualizer({
  activeBeadId,
  completedBeadIds,
  onSelectBead,
  mysteryName,
  currentDecade
}: RosaryVisualizerProps) {
  return (
    <div class="relative w-full max-w-[420px] mx-auto select-none bg-stone-50/60 dark:bg-slate-950/60 rounded-3xl p-4 sm:p-5 border border-stone-200/80 dark:border-slate-800 shadow-inner flex flex-col items-center">
      
      {/* Encabezado del visor */}
      <div class="w-full flex items-center justify-between pb-2 mb-1 border-b border-stone-200/50 dark:border-slate-800 text-xs">
        <div class="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
          <svg
            width="16"
            height="16"
            style="width: 16px; height: 16px; min-width: 16px; min-height: 16px; max-width: 16px; max-height: 16px; display: inline-block;"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="uppercase tracking-wider text-[11px]">Rosario Interactivo</span>
        </div>
        <span class="text-[11px] text-stone-500 dark:text-stone-400">
          Toca cualquier cuenta
        </span>
      </div>

      {/* Lienzo SVG responsivo */}
      <div class="w-full relative aspect-[460/580] max-h-[520px]">
        <svg
          viewBox="0 0 460 580"
          class="w-full h-full drop-shadow-sm overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Diagrama visual e interactivo del Santo Rosario católico"
          role="img"
        >
          <defs>
            {/* Gradiente de oro pulido para cuentas del Padre Nuestro */}
            <linearGradient id="goldBead" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fde047" />
              <stop offset="50%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>

            {/* Gradiente de perla marfil para Avemarías */}
            <radialGradient id="pearlBead" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="45%" stop-color="#f3efe6" />
              <stop offset="85%" stop-color="#d8d0bf" />
              <stop offset="100%" stop-color="#a8a29e" />
            </radialGradient>

            {/* Gradiente para cuentas rezadas (oro suave completado) */}
            <radialGradient id="completedBead" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="60%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#854d0e" />
            </radialGradient>

            {/* Gradiente para cuenta activa (aura divina resplandeciente) */}
            <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
              <stop offset="40%" stop-color="#2563eb" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.2" />
            </radialGradient>

            {/* Filtro de resplandor para la cuenta activa */}
            <filter id="haloGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cordel / Cadena del Rosario (Líneas vectoriales conectoras) */}
          <g stroke="currentColor" class="text-stone-300 dark:text-stone-700" stroke-width="1.8" fill="none" opacity="0.8">
            {/* Elipse principal de las 5 decenas */}
            <ellipse cx="230" cy="185" rx="155" ry="135" stroke-dasharray="3,3" />
            
            {/* Cordal colgante desde la medalla al crucifijo */}
            <line x1="230" y1="348" x2="230" y2="520" stroke-width="2" />
          </g>

          {/* Marcas de Decenas alrededor del anillo */}
          {[
            { label: 'I', x: 75, y: 285, dec: 0 },
            { label: 'II', x: 50, y: 130, dec: 1 },
            { label: 'III', x: 230, y: 35, dec: 2 },
            { label: 'IV', x: 410, y: 130, dec: 3 },
            { label: 'V', x: 385, y: 285, dec: 4 },
          ].map((m) => {
            const isCurrentDecade = currentDecade === m.dec;
            return (
              <text
                key={m.label}
                x={m.x}
                y={m.y}
                text-anchor="middle"
                dominant-baseline="middle"
                class={`font-serif text-[11px] font-bold transition-colors ${
                  isCurrentDecade
                    ? 'fill-amber-600 dark:fill-amber-400 scale-110'
                    : 'fill-stone-400 dark:fill-stone-600'
                }`}
              >
                Decena {m.label}
              </text>
            );
          })}

          {/* Centro del Rosario: Monograma Mariano y Guía Rápida */}
          <g class="transition-opacity duration-300">
            <circle cx="230" cy="185" r="54" fill="none" stroke="currentColor" class="text-amber-500/20" stroke-width="1" />
            <text
              x="230"
              y="170"
              text-anchor="middle"
              class="font-serif text-2xl font-bold fill-amber-700/60 dark:fill-amber-400/40 tracking-wider"
            >
              ☧
            </text>
            <text
              x="230"
              y="192"
              text-anchor="middle"
              class="font-sans text-[10px] font-semibold uppercase tracking-widest fill-stone-500 dark:fill-stone-400"
            >
              Decena {currentDecade + 1} de 5
            </text>
            <text
              x="230"
              y="206"
              text-anchor="middle"
              class="font-serif text-[10px] italic fill-stone-400 dark:fill-stone-500 max-w-[100px]"
            >
              {mysteryName ? mysteryName.split(' ')[0] : 'Meditación'}
            </text>
          </g>

          {/* Renderizado de Todas las Cuentas del Rosario */}
          {ROSARY_BEADS.map((bead) => {
            const isActive = activeBeadId === bead.id;
            const isCompleted = completedBeadIds.has(bead.id);

            // 1. Renderizado Especial del Crucifijo
            if (bead.tipo === 'cruz') {
              return (
                <g
                  key={bead.id}
                  onClick={() => onSelectBead(bead)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectBead(bead);
                    }
                  }}
                  class="cursor-pointer group focus:outline-none focus-visible:outline-2 focus-visible:outline-amber-500"
                  role="button"
                  tabIndex={0}
                  aria-label={bead.etiqueta}
                >
                  {/* Halo activo en el Crucifijo */}
                  {isActive && (
                    <circle
                      cx={bead.cx}
                      cy={bead.cy}
                      r={24}
                      fill="none"
                      stroke="#d97706"
                      stroke-width="3"
                      class="animate-ping opacity-75"
                    />
                  )}

                  {/* Silueta de la Cruz de madera con filigrana dorada */}
                  <rect
                    x={bead.cx - 5}
                    y={bead.cy - 22}
                    width={10}
                    height={38}
                    rx={2}
                    fill={isActive ? '#d97706' : isCompleted ? '#b45309' : '#78350f'}
                    stroke="#fde047"
                    stroke-width="1.2"
                    class="transition-all duration-300 group-hover:scale-105"
                  />
                  <rect
                    x={bead.cx - 15}
                    y={bead.cy - 12}
                    width={30}
                    height={8}
                    rx={2}
                    fill={isActive ? '#d97706' : isCompleted ? '#b45309' : '#78350f'}
                    stroke="#fde047"
                    stroke-width="1.2"
                    class="transition-all duration-300 group-hover:scale-105"
                  />
                  {/* Cuerpo / Corpus estilizado */}
                  <circle cx={bead.cx} cy={bead.cy - 6} r={2.8} fill="#fef08a" />
                  <line x1={bead.cx} y1={bead.cy - 4} x2={bead.cx} y2={bead.cy + 6} stroke="#fef08a" stroke-width="1.5" />
                  <line x1={bead.cx - 8} y1={bead.cy - 7} x2={bead.cx + 8} y2={bead.cy - 7} stroke="#fef08a" stroke-width="1.2" />
                </g>
              );
            }

            // 2. Renderizado Especial de la Medalla Central
            if (bead.tipo === 'medalla') {
              return (
                <g
                  key={bead.id}
                  onClick={() => onSelectBead(bead)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectBead(bead);
                    }
                  }}
                  class="cursor-pointer group focus:outline-none focus-visible:outline-2 focus-visible:outline-amber-500"
                  role="button"
                  tabIndex={0}
                  aria-label={bead.etiqueta}
                >
                  {isActive && (
                    <circle
                      cx={bead.cx}
                      cy={bead.cy}
                      r={18}
                      fill="none"
                      stroke="#2563eb"
                      stroke-width="2.5"
                      class="animate-ping opacity-60"
                    />
                  )}
                  {/* Medalla ovalada milagrosa */}
                  <ellipse
                    cx={bead.cx}
                    cy={bead.cy}
                    rx={12}
                    ry={14}
                    fill={isActive ? 'url(#goldBead)' : isCompleted ? 'url(#completedBead)' : '#ca8a04'}
                    stroke="#fef08a"
                    stroke-width="1.5"
                    class="transition-transform duration-200 group-hover:scale-110 shadow-sm"
                  />
                  <text
                    x={bead.cx}
                    y={bead.cy + 3}
                    text-anchor="middle"
                    class="font-serif text-[10px] font-bold fill-stone-900 pointer-events-none"
                  >
                    M
                  </text>
                </g>
              );
            }

            // 3. Renderizado de Cuentas (Padre Nuestro y Avemaría)
            const isPater = bead.tipo === 'pater';

            return (
              <g
                key={bead.id}
                onClick={() => onSelectBead(bead)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectBead(bead);
                  }
                }}
                class="cursor-pointer group focus:outline-none focus-visible:outline-2 focus-visible:outline-amber-500"
                role="button"
                tabIndex={0}
                aria-label={bead.etiqueta}
              >
                {/* Aura resplandeciente cuando la cuenta está activa */}
                {isActive && (
                  <>
                    <circle
                      cx={bead.cx}
                      cy={bead.cy}
                      r={bead.r + 9}
                      fill="none"
                      stroke="#d97706"
                      stroke-width="2.5"
                      class="animate-ping opacity-75"
                    />
                    <circle
                      cx={bead.cx}
                      cy={bead.cy}
                      r={bead.r + 5}
                      fill="#f59e0b"
                      opacity="0.35"
                    />
                  </>
                )}

                {/* Cuenta principal con sombreado tridimensional */}
                <circle
                  cx={bead.cx}
                  cy={bead.cy}
                  r={isActive ? bead.r + 2 : bead.r}
                  fill={
                    isActive
                      ? 'url(#goldBead)'
                      : isCompleted
                      ? 'url(#completedBead)'
                      : isPater
                      ? 'url(#goldBead)'
                      : 'url(#pearlBead)'
                  }
                  stroke={
                    isActive
                      ? '#ffffff'
                      : isCompleted
                      ? '#78350f'
                      : isPater
                      ? '#b45309'
                      : '#a8a29e'
                  }
                  stroke-width={isActive ? 2 : 1}
                  class={`transition-all duration-300 group-hover:scale-125 ${
                    isActive ? 'filter drop-shadow-md' : ''
                  }`}
                />

                {/* Punto brillante de luz (highlight especular) */}
                <circle
                  cx={bead.cx - (bead.r * 0.3)}
                  cy={bead.cy - (bead.r * 0.3)}
                  r={Math.max(1.2, bead.r * 0.25)}
                  fill="#ffffff"
                  opacity={isActive ? 0.9 : 0.65}
                  class="pointer-events-none"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda visual al pie */}
      <div class="w-full mt-3 pt-2.5 border-t border-stone-200/50 dark:border-slate-800 flex flex-wrap items-center justify-around gap-2 text-[11px] text-stone-600 dark:text-stone-400">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
          <span>Padre Nuestro</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-500 shadow-sm"></span>
          <span>Ave María</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/60 animate-pulse"></span>
          <span class="font-medium text-amber-700 dark:text-amber-400">Cuenta Actual</span>
        </div>
      </div>

    </div>
  );
}
