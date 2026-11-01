import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { CADIS_WHATSAPP_NUMBER } from '../config/contact';
import { 
  Building2, 
  MapPin, 
  Maximize2, 
  Droplets, 
  Zap, 
  Trees, 
  Check,
  Calculator, 
  SlidersHorizontal,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Search,
  X,
  Clock,
  MessageCircle,
  PhoneCall,
  ChevronRight,
  FileDown,
  Loader2
} from 'lucide-react';
import { generatePropertyPdfBrochure } from '../utils/pdfBrochureGenerator';
import { SiteImage } from './SiteImage';

interface PropertiesGalleryProps {
  properties: Property[];
  onSelectPropertyForSimulation: (property: Property) => void;
}

export const PropertiesGallery: React.FC<PropertiesGalleryProps> = ({
  properties,
  onSelectPropertyForSimulation
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'disponible' | 'reservado' | 'vendido'>('all');
  const [filterMinMetraje, setFilterMinMetraje] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'cards' | 'masterplan'>('cards');
  const [activeModalProperty, setActiveModalProperty] = useState<Property | null>(null);
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [pdfSuccessNotification, setPdfSuccessNotification] = useState<string | null>(null);

  // Close the property detail modal on Escape for keyboard/screen-reader users
  useEffect(() => {
    if (!activeModalProperty) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalProperty(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeModalProperty]);

  const handleDownloadPdf = async (property: Property) => {
    try {
      setDownloadingPdfId(property.id);
      await generatePropertyPdfBrochure(property);
      setPdfSuccessNotification(`¡Folleto PDF de ${property.loteNumero} generado y descargado!`);
      setTimeout(() => {
        setPdfSuccessNotification(null);
      }, 4500);
    } catch (err) {
      console.error('Error al generar folleto PDF:', err);
      alert('Hubo un problema al generar el folleto PDF. Por favor intente nuevamente.');
    } finally {
      setDownloadingPdfId(null);
    }
  };

  // Filtered properties based on search query (lot code / id / name) and facet filters
  const filteredProperties = properties.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchLote = p.loteNumero.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchTitulo = p.titulo.toLowerCase().includes(q);
      
      // Numeric matching: if user searches "1" or "01", match "RB-01"
      const digitsOnly = q.replace(/\D/g, '');
      const propDigits = p.loteNumero.replace(/\D/g, '');
      const matchDigits = digitsOnly.length > 0 && propDigits.includes(digitsOnly);

      if (!matchLote && !matchId && !matchTitulo && !matchDigits) {
        return false;
      }
    }
    if (filterAvailability !== 'all' && p.estado !== filterAvailability) {
      return false;
    }
    if (p.metraje < filterMinMetraje) {
      return false;
    }
    return true;
  });

  return (
    <section id="propiedades" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Catálogo Oficial de Terrenos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mini Quintas en <span className="text-emerald-700">Limoncito (Río Bonito)</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Explora nuestros lotes campestres con entrega inmediata, servicios de agua y energía eléctrica, y financiamiento directo garantizado.
            </p>
          </div>

          {/* View Toggle: Cards vs Masterplan Grid */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vista Tarjetas ({filteredProperties.length})</span>
            </button>
            <button
              onClick={() => setViewMode('masterplan')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'masterplan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Plano / Loteo Interactivo</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8 space-y-5">
          {/* Quick Search Bar by Lot Code / Identification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="lot-search-input" className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Búsqueda Rápida por Código o Número de Lote</span>
              </label>
              {searchQuery && (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'lote encontrado' : 'lotes encontrados'}
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="lot-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe el código o número (ej: RB-01, RB-04, 02 o Manantial)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick lot code suggestion chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Lotes directos:</span>
              {['RB-01', 'RB-02', 'RB-03', 'RB-04', 'RB-05', 'RB-06', 'RB-07', 'RB-08'].map((code) => {
                const isActive = searchQuery.toUpperCase() === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSearchQuery(isActive ? '' : code)}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline ml-1 cursor-pointer"
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filtros Adicionales</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Disponibilidad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Estado de Disponibilidad
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setFilterAvailability('all')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterAvailability === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterAvailability('disponible')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterAvailability === 'disponible'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Disponibles
                  </button>
                  <button
                    onClick={() => setFilterAvailability('reservado')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterAvailability === 'reservado'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Reservados
                  </button>
                </div>
              </div>

              {/* Metraje Mínimo */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Superficie Mínima:
                  </label>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {filterMinMetraje === 0 ? 'Cualquiera' : `Desde ${filterMinMetraje} m²`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0, 500, 750, 1000].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFilterMinMetraje(m)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        filterMinMetraje === m
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {m === 0 ? 'Todos' : `${m}m²`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Masterplan Interactive Grid View */}
        {viewMode === 'masterplan' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-12 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  Mapeo y Plano de Manzanos • Proyecto Río Bonito
                </h3>
                <p className="text-xs text-slate-500">
                  Haz clic en cualquier lote para previsualizar sus especificaciones y simular el financiamiento.
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-slate-700">Reservado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-slate-500">Vendido</span>
                </div>
              </div>
            </div>

            {/* Visual Schematic Loteo Grid */}
            <div className="mt-6 p-4 sm:p-6 bg-slate-900 rounded-xl overflow-x-auto relative">
              <div className="min-w-[650px] space-y-4">
                {/* River Representation on top */}
                <div className="w-full h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 text-xs font-bold tracking-widest uppercase">
                  🌊 RÍO BONITO - ACCESO NATURAL Y PLAYA
                </div>

                {/* Road */}
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">
                  Av. Costanera Ribereña (Vía Ripiada de 12m)
                </div>

                {/* Lots Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {filteredProperties.map((prop) => {
                    const isAvailable = prop.estado === 'disponible';
                    const isReserved = prop.estado === 'reservado';
                    const isSold = prop.estado === 'vendido';

                    return (
                      <button
                        key={prop.id}
                        type="button"
                        onClick={() => {
                          if (isAvailable) {
                            onSelectPropertyForSimulation(prop);
                          } else {
                            setActiveModalProperty(prop);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative group ${
                          isAvailable
                            ? 'bg-emerald-950/40 border-emerald-500 hover:bg-emerald-900/60 hover:scale-[1.02] shadow-md'
                            : isReserved
                            ? 'bg-amber-950/30 border-amber-500/60 hover:bg-amber-900/40'
                            : 'bg-slate-800/50 border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-white px-2 py-0.5 rounded bg-slate-900/80">
                            {prop.loteNumero}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              isAvailable
                                ? 'bg-emerald-500 text-slate-950'
                                : isReserved
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {prop.estado}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-slate-100 truncate">{prop.titulo}</p>
                        <p className="text-xs text-slate-400">{prop.metraje} m² • {prop.dimensiones}</p>
                        <div className="mt-2 text-emerald-400 font-black text-sm">
                          ${prop.precio.toLocaleString()} USD
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-1 pt-1.5 border-t border-slate-700/60">
                          {isAvailable ? (
                            <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 group-hover:underline">
                              <Calculator className="w-3 h-3" />
                              <span>Simular</span>
                            </div>
                          ) : (
                            <div className="text-[11px] font-bold text-slate-400">Ver Ficha</div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPdf(prop);
                            }}
                            disabled={downloadingPdfId === prop.id}
                            className="p-1 px-2 rounded-md bg-emerald-950/90 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title={`Descargar Folleto PDF de ${prop.loteNumero}`}
                          >
                            {downloadingPdfId === prop.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                            ) : (
                              <FileDown className="w-3 h-3 text-emerald-400" />
                            )}
                            <span>PDF</span>
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Main Road at bottom */}
                <div className="w-full py-2 rounded-lg bg-slate-800 border border-slate-700 text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Carretera Principal Limoncito • Acceso Vehicular Permanente
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((prop) => {
            const cuotaInicial = prop.precio * 0.30;
            const cuotaMensual10Anios = (prop.precio * 0.70) / 120;
            const cuotaMensual5Anios = (prop.precio * 0.70) / 60;
            const isAvailable = prop.estado === 'disponible';

            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group scroll-mt-24"
                id={`property-card-${prop.id}`}
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <SiteImage
                    slot={prop.id}
                    fallback={prop.imagen}
                    alt={prop.titulo}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Top lot and status badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/85 text-white text-xs font-black backdrop-blur-xs">
                      {prop.loteNumero}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase shadow-sm ${
                        prop.estado === 'disponible'
                          ? 'bg-emerald-500 text-slate-950'
                          : prop.estado === 'reservado'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {prop.estado}
                    </span>
                  </div>

                  {/* Bottom Metraje & Dimension inside image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      {prop.metraje} m² ({prop.dimensiones})
                    </span>
                    <span className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      Limoncito
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
                      {prop.proyecto}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {prop.titulo}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{prop.ubicacion}</span>
                    </p>

                    {/* Services Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {prop.servicios.map((srv, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Monthly simulation breakdown */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Precio Total</span>
                        <div className="text-2xl font-black text-slate-900">
                          ${prop.precio.toLocaleString()} <span className="text-xs font-bold text-slate-500">USD</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700 uppercase">Cuota Inicial (30%)</span>
                        <div className="text-base font-extrabold text-emerald-700">
                          ${cuotaInicial.toLocaleString()} USD
                        </div>
                        <span className="text-[10px] text-slate-500 block font-medium">o 3 cuotas de ${(cuotaInicial / 3).toFixed(2)} USD</span>
                      </div>
                    </div>

                    {/* Monthly quota indicator */}
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-900">Cuota Directa a 5 Años:</span>
                        <p className="text-base font-black text-emerald-700">
                          ${cuotaMensual5Anios.toFixed(2)} <span className="text-xs font-semibold text-slate-600">USD/mes</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-slate-600">A 10 Años:</span>
                        <p className="text-sm font-bold text-slate-800">
                          ${cuotaMensual10Anios.toFixed(2)} USD/mes
                        </p>
                      </div>
                    </div>

                    {/* Action buttons row */}
                    <div className="flex items-center gap-2">
                      {prop.estado === 'disponible' ? (
                        <button
                          type="button"
                          onClick={() => onSelectPropertyForSimulation(prop)}
                          className="flex-1 py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-900 hover:bg-emerald-600 text-white shadow-xs group-hover:shadow-md"
                          id={`btn-simulate-${prop.id}`}
                        >
                          <Calculator className="w-4 h-4 text-emerald-400 group-hover:text-white shrink-0" />
                          <span className="truncate">Simular Crédito</span>
                        </button>
                      ) : prop.estado === 'reservado' ? (
                        <button
                          type="button"
                          onClick={() => setActiveModalProperty(prop)}
                          className="flex-1 py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-amber-600 hover:bg-amber-500 text-white shadow-xs group-hover:shadow-md"
                          id={`btn-reserved-${prop.id}`}
                        >
                          <Clock className="w-4 h-4 text-amber-200 shrink-0" />
                          <span className="truncate">Lista de Espera</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveModalProperty(prop)}
                          className="flex-1 py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-200 shadow-xs group-hover:shadow-md"
                          id={`btn-sold-${prop.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">Ver Similares</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPdf(prop);
                        }}
                        disabled={downloadingPdfId === prop.id}
                        className="py-3 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs disabled:opacity-60 shrink-0"
                        title="Descargar Folleto Oficial en PDF con Ficha Técnica y Financiamiento"
                        aria-label={`Descargar Folleto PDF de ${prop.loteNumero}`}
                        id={`btn-pdf-${prop.id}`}
                      >
                        {downloadingPdfId === prop.id ? (
                          <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
                        ) : (
                          <FileDown className="w-4 h-4 text-emerald-700" />
                        )}
                        <span className="font-bold">Folleto PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if filters return 0 */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-600 font-bold">
              {searchQuery
                ? `No se encontró ningún lote con el código o identificación "${searchQuery}".`
                : 'No se encontraron lotes con los filtros seleccionados.'}
            </p>
            <p className="text-xs text-slate-400">
              Prueba buscando por códigos como <span className="font-mono font-bold text-slate-600">RB-01</span>, <span className="font-mono font-bold text-slate-600">RB-04</span>, o números como <span className="font-mono font-bold text-slate-600">02</span>.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterAvailability('all');
                setFilterMinMetraje(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Restablecer Búsqueda y Filtros
            </button>
          </div>
        )}

        {/* Modal for Lot Details / Waitlist / Consultation */}
        {activeModalProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setActiveModalProperty(null)}
          >
            <div
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image with Badges */}
              <div className="relative h-48 sm:h-56">
                <SiteImage
                  slot={activeModalProperty.id}
                  fallback={activeModalProperty.imagen}
                  alt={activeModalProperty.titulo}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                <button
                  onClick={() => setActiveModalProperty(null)}
                  className="absolute top-3 right-3 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-600 text-white">
                      {activeModalProperty.loteNumero}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {activeModalProperty.titulo}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      activeModalProperty.estado === 'disponible'
                        ? 'bg-emerald-500 text-slate-950'
                        : activeModalProperty.estado === 'reservado'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-500 text-white'
                    }`}
                  >
                    {activeModalProperty.estado}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Notice based on status */}
                {activeModalProperty.estado === 'reservado' && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-extrabold flex items-center gap-1.5 text-amber-800">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Lote con Reserva Activa</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-900/90">
                      Este lote se encuentra actualmente reservado por un comprador. Puedes ingresar a la lista de espera preferencial por WhatsApp para recibir notificación prioritaria si el lote vuelve a estar disponible, o conocer opciones similares contiguas.
                    </p>
                  </div>
                )}

                {activeModalProperty.estado === 'vendido' && (
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <p className="font-extrabold flex items-center gap-1.5 text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>Lote Vendido y Titulado</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Esta mini quinta ya ha sido adquirida. Contamos con lotes colindantes de metraje y topografía similar listos para entrega inmediata con crédito directo CADIS.
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Precio Terreno</span>
                    <span className="text-lg font-black text-slate-900">
                      ${activeModalProperty.precio.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-700 font-bold block text-[10px] uppercase">Inicial 30% (3 meses)</span>
                    <span className="text-lg font-black text-emerald-700">
                      ${(activeModalProperty.precio * 0.3).toLocaleString()} USD
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Superficie</span>
                    <span className="text-sm font-black text-slate-800">
                      {activeModalProperty.metraje} m² ({activeModalProperty.dimensiones})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Ubicación</span>
                    <span className="text-sm font-black text-slate-800 line-clamp-1">
                      {activeModalProperty.ubicacion}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  {activeModalProperty.estado === 'disponible' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPropertyForSimulation(activeModalProperty);
                          setActiveModalProperty(null);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <Calculator className="w-4 h-4" />
                        <span>Simular Crédito de esta Mini Quinta</span>
                      </button>

                      <a
                        href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hola CADIS, me interesa reservar o recibir asesoría técnica sobre el lote ${activeModalProperty.loteNumero} (${activeModalProperty.titulo}) por $${activeModalProperty.precio} USD.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-950" />
                        <span>Consultar por WhatsApp</span>
                      </a>
                    </>
                  ) : activeModalProperty.estado === 'reservado' ? (
                    <>
                      <a
                        href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hola CADIS, vi que el lote ${activeModalProperty.loteNumero} está reservado. Quisiera anotarme en lista de espera preferencial o conocer lotes similares disponibles en Río Bonito.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-950" />
                        <span>Anotarme en Lista de Espera por WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setFilterAvailability('disponible');
                          setActiveModalProperty(null);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Ver Solo Lotes Disponibles</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hola CADIS, vi que el lote ${activeModalProperty.loteNumero} ya fue vendido. Quisiera información de lotes disponibles similares en el Proyecto Río Bonito.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-950" />
                        <span>Consultar Opciones Similares por WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setFilterAvailability('disponible');
                          setActiveModalProperty(null);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Ver Lotes Disponibles en Río Bonito</span>
                      </button>
                    </>
                  )}

                  {/* Universal PDF Brochure Download Button in Modal */}
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(activeModalProperty)}
                    disabled={downloadingPdfId === activeModalProperty.id}
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
                    id={`btn-modal-pdf-${activeModalProperty.id}`}
                  >
                    {downloadingPdfId === activeModalProperty.id ? (
                      <>
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span>Generando Folleto PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-emerald-400" />
                        <span>Descargar Folleto PDF Oficial (Ficha Técnica y Financiamiento)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Download Success Toast */}
        {pdfSuccessNotification && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/60 flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-white">{pdfSuccessNotification}</p>
              <p className="text-[11px] text-slate-400">Incluye especificaciones, plano esquemático, tabla de amortización y contacto oficial CADIS.</p>
            </div>
            <button
              type="button"
              onClick={() => setPdfSuccessNotification(null)}
              className="p-3.5 text-slate-400 hover:text-white cursor-pointer ml-1"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
