import React, { useMemo, useState } from 'react';
import { Property, LotReservationRequest } from '../types';
import { CADIS_WHATSAPP_NUMBER } from '../config/contact';
import { LOT_POLYGONS, MAP_SIZE } from '../data/lotPolygons';
import { LOTS, LOT_PRICE_USD, LotInfo, LotStatus } from '../data/lotStates';
import { Layers, CalendarCheck, ShoppingBag, BookmarkPlus, X, MousePointerClick } from 'lucide-react';

interface RioBonitoVisualMapProps {
  properties: Property[];
  onScrollToProperty: (propertyId: string) => void;
  onSaveReservation: (data: Omit<LotReservationRequest, 'id' | 'fecha' | 'estado'>) => void;
}

type LotAction = 'reservar' | 'comprar' | 'agendar_visita';

const STATUS_STYLE: Record<LotStatus, { fill: string; stroke: string; label: string; dot: string }> = {
  disponible: { fill: 'rgba(34,197,94,0.55)', stroke: '#bbf7d0', label: 'Disponible', dot: 'bg-emerald-500' },
  reservado: { fill: 'rgba(251,146,60,0.65)', stroke: '#fed7aa', label: 'Reservado', dot: 'bg-orange-400' },
  vendido: { fill: 'rgba(56,189,248,0.55)', stroke: '#bae6fd', label: 'Vendido', dot: 'bg-sky-400' }
};

// Centro aproximado de cada lote (promedio de sus vertices) para colocar el numero.
const centroid = (pts: [number, number][]): [number, number] => {
  const n = pts.length;
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
};

const lotLabel = (lot: LotInfo) => `${lot.manzana}-${String(lot.numero).padStart(2, '0')}`;

// Los poligonos estan indexados sin cero a la izquierda ('M1-1'), el id del lote lo lleva ('M1-01').
const polygonKey = (lot: LotInfo) => `${lot.manzana}-${lot.numero}`;

export const RioBonitoVisualMap: React.FC<RioBonitoVisualMapProps> = ({ onSaveReservation }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const centers = useMemo(() => {
    const out: Record<string, [number, number]> = {};
    Object.entries(LOT_POLYGONS).forEach(([id, pts]) => {
      out[id] = centroid(pts);
    });
    return out;
  }, []);

  const counts = useMemo(
    () => ({
      disponible: LOTS.filter((l) => l.estado === 'disponible').length,
      reservado: LOTS.filter((l) => l.estado === 'reservado').length,
      vendido: LOTS.filter((l) => l.estado === 'vendido').length
    }),
    []
  );

  const selected = LOTS.find((l) => l.id === selectedId) || null;
  const inicial = LOT_PRICE_USD * 0.3;

  const handleAction = (lot: LotInfo, accion: LotAction) => {
    const verbo =
      accion === 'reservar'
        ? 'quiero *reservar*'
        : accion === 'comprar'
        ? 'quiero *comprar*'
        : 'quiero *agendar una visita* a';
    const message = `Hola CADIS, vi el mapa interactivo de Río Bonito y ${verbo} el lote ${lotLabel(lot)} (${lot.superficieM2.toLocaleString('es-BO')} m², $${LOT_PRICE_USD.toLocaleString()} USD).`;
    onSaveReservation({ loteNumero: lotLabel(lot), accion, origen: 'mapa_interactivo' });
    window.open(`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Encabezado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Mapa de lotes · Fase 1</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Elige tu lote y resérvalo</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl flex items-start gap-1.5">
            <MousePointerClick className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            <span>
              Toca un lote <strong className="text-emerald-400">verde</strong> para ver su precio y reservarlo por WhatsApp.
            </span>
          </p>
        </div>

        {/* Leyenda con conteo */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shrink-0">
          {(Object.keys(STATUS_STYLE) as LotStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${STATUS_STYLE[s].dot}`} />
              <span className="text-slate-200 font-semibold">
                {STATUS_STYLE[s].label} <span className="text-slate-400 font-normal">({counts[s]})</span>
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3">
            <span className="w-3 h-3 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
            <span className="text-slate-200 font-semibold">
              Muy pronto <span className="text-slate-400 font-normal">(M3-M7)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Mapa */}
        <div className="lg:col-span-2 relative rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
          <svg
            viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Mapa interactivo de los lotes del Proyecto Río Bonito"
          >
            <image href="/assets/mapa_rio_bonito_base.jpg" width={MAP_SIZE.width} height={MAP_SIZE.height} />

            {LOTS.map((lot) => {
              const pts = LOT_POLYGONS[polygonKey(lot)];
              if (!pts) return null;
              const st = STATUS_STYLE[lot.estado];
              const isSel = selectedId === lot.id;
              const isHover = hoveredId === lot.id;
              const [cx, cy] = centers[polygonKey(lot)];
              return (
                <g
                  key={lot.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(isSel ? null : lot.id)}
                  onMouseEnter={() => setHoveredId(lot.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Lote ${lotLabel(lot)}, ${st.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(isSel ? null : lot.id);
                    }
                  }}
                >
                  <polygon
                    points={pts.map((p) => p.join(',')).join(' ')}
                    fill={st.fill}
                    stroke={isSel ? '#ffffff' : st.stroke}
                    strokeWidth={isSel ? 5 : isHover ? 4 : 2}
                    strokeLinejoin="round"
                    style={{ filter: isSel || isHover ? 'brightness(1.25)' : undefined, transition: 'all .15s' }}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={26}
                    fontWeight={800}
                    fill="#fff"
                    stroke="rgba(0,0,0,0.65)"
                    strokeWidth={5}
                    paintOrder="stroke"
                    pointerEvents="none"
                  >
                    {lot.numero}
                  </text>
                </g>
              );
            })}

            {/* Etiquetas de manzana */}
            <text x={640} y={230} fontSize={44} fontWeight={900} fill="#fff" stroke="rgba(0,0,0,0.7)" strokeWidth={7} paintOrder="stroke" pointerEvents="none" opacity={0.9}>M2</text>
            <text x={250} y={780} fontSize={44} fontWeight={900} fill="#fff" stroke="rgba(0,0,0,0.7)" strokeWidth={7} paintOrder="stroke" pointerEvents="none" opacity={0.9}>M1</text>
          </svg>
          <p className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm rounded-xl bg-slate-950/85 border border-slate-700 px-3 py-2 text-xs text-slate-200 backdrop-blur-sm">
            <strong className="text-white">Manzanas M3 a M7 · Muy pronto.</strong> Las siguientes fases aún no están a la venta; consúltanos para enterarte cuando salgan.
          </p>
        </div>

        {/* Panel del lote */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Lote</p>
                  <p className="text-3xl font-black font-mono">{lotLabel(selected)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase px-2.5 py-1 rounded ${
                      selected.estado === 'disponible'
                        ? 'bg-emerald-500 text-slate-950'
                        : selected.estado === 'reservado'
                        ? 'bg-orange-400 text-slate-950'
                        : 'bg-sky-400 text-slate-950'
                    }`}
                  >
                    {STATUS_STYLE[selected.estado].label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Cerrar"
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Superficie</dt>
                  <dd className="font-bold">{selected.superficieM2.toLocaleString('es-BO')} m²</dd>
                </div>
                {selected.estado === 'disponible' && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Precio</dt>
                      <dd className="font-black text-emerald-400">${LOT_PRICE_USD.toLocaleString()} USD</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Inicial (30%)</dt>
                      <dd className="font-bold">${inicial.toLocaleString()} USD</dd>
                    </div>
                  </>
                )}
              </dl>

              {selected.estado === 'disponible' ? (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction(selected, 'reservar')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black cursor-pointer transition-colors"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Reservar este lote</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAction(selected, 'comprar')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Comprar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(selected, 'agendar_visita')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Agendar visita</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <p className="text-sm text-slate-400">
                    Este lote está {selected.estado}. Mira los lotes verdes del mapa o consulta por otras opciones.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAction(selected, 'agendar_visita')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Agendar visita al proyecto</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="m-auto text-center space-y-2 py-8">
              <MousePointerClick className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="font-bold">Toca un lote en el mapa</p>
              <p className="text-sm text-slate-400">
                Verás su superficie, precio ${LOT_PRICE_USD.toLocaleString()} USD y podrás reservarlo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
