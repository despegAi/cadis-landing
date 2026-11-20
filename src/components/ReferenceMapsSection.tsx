import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Compass, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Info,
  PhoneCall
} from 'lucide-react';
import { CADIS_WHATSAPP_NUMBER } from '../config/contact';
import fotoMapaRutas from '../assets/fotos/rio_bonito_llegar_mapa_rutas.webp';
import fotoValleRio from '../assets/fotos/rio_bonito_llegar_valle_rio.webp';
import fotoLotes from '../assets/fotos/rio_bonito_llegar_lotes.webp';
import fotoMicroclima from '../assets/fotos/rio_bonito_llegar_microclima.webp';

// ============================================================================
// CONFIGURACIÓN DE MAPAS DE REFERENCIA (FÁCILMENTE REEMPLAZABLES POR REALES)
// ============================================================================
// INSTRUCCIONES PARA REEMPLAZAR POR EL MAPA OFICIAL DE GOOGLE MAPS:
// 1. Abre Google Maps y busca la ubicación de Limoncito / Proyecto Río Bonito.
// 2. Haz clic en "Compartir" -> "Insertar un mapa" y copia la URL dentro de `src="..."`.
// 3. Sustituye la constante `REAL_GOOGLE_MAPS_EMBED_URL` con tu enlace real.
// ============================================================================
export const REFERENCE_MAP_CONFIG = {
  projectName: 'Proyecto Río Bonito - Limoncito',
  coordinates: {
    lat: -17.9825,
    lng: -63.3850,
    display: "17°58'57.0\"S 63°23'06.0\"W"
  },
  // URL de mapa interactivo de referencia (Google Maps Search / OpenStreetMap embed)
  // Reemplazar este enlace por el iframe definitivo de Google Maps cuando esté listo:
  embedUrl: 'https://maps.google.com/maps?q=-17.9825,-63.3850&hl=es&z=14&output=embed',
  // Enlace directo para abrir la app de Google Maps en móviles
  googleMapsAppUrl: 'https://www.google.com/maps/search/?api=1&query=-17.9825,-63.3850',
  // Enlace directo para abrir la app de Waze en móviles
  wazeAppUrl: 'https://waze.com/ul?ll=-17.9825,-63.3850&navigate=yes',
  // WhatsApp para pedir ubicación en tiempo real
  whatsappShareUrl: `https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%2C%20por%20favor%20env%C3%ADenme%20la%20ubicaci%C3%B3n%20en%20tiempo%20real%20por%20WhatsApp%20del%20Proyecto%20R%C3%ADo%20Bonito%20en%20Limoncito.`
};

export const ReferenceMapsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'route' | 'satellite' | 'embed'>('route');

  const routeMilestones = [
    {
      step: 1,
      name: 'Salida de Santa Cruz de la Sierra',
      detail: '4to Anillo y Doble Vía a La Guardia',
      time: '0 min',
      distance: 'Km 0',
      status: 'Autopista asfaltada de alta velocidad'
    },
    {
      step: 2,
      name: 'Municipio de La Guardia',
      detail: 'Paso por zona urbana y comercio de víveres',
      time: '20 min',
      distance: 'Km 20',
      status: 'Tráfico fluido y surtidores de combustible'
    },
    {
      step: 3,
      name: 'El Torno',
      detail: 'Ingreso al corredor de valles y microclima fresco',
      time: '32 min',
      distance: 'Km 32',
      status: 'Paisaje verde y vistas a colinas'
    },
    {
      step: 4,
      name: 'Cruce a Limoncito',
      detail: 'Desvío señalizado con letreros oficiales CADIS',
      time: '40 min',
      distance: 'Km 42',
      status: 'Camino ripiado consolidado transitable todo el año'
    },
    {
      step: 5,
      name: 'Entrada Proyecto "Río Bonito"',
      detail: 'Portón de ingreso CADIS y playa sobre el río',
      time: '45-50 min',
      distance: 'Km 46',
      status: 'Destino final • Mini Quintas campestres'
    }
  ];

  return (
    <section id="ubicacion-mapas" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mapas de Referencia y Accesibilidad</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              ¿Cómo llegar a <span className="text-emerald-400">Río Bonito en Limoncito</span>?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Ubicado a tan solo <strong>45 a 50 minutos</strong> de la ciudad de Santa Cruz. Consulta nuestros mapas esquemáticos de referencia, rutas vehiculares y coordenadas GPS exactas.
            </p>
          </div>

          {/* Tab Switcher: Route vs Satellite vs Google Maps Embed */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('route')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'route'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Ruta Santa Cruz</span>
            </button>
            <button
              onClick={() => setActiveTab('satellite')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Vista Satelital Ref.</span>
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'embed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps Interactivo</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: RUTA Y MAPA ESQUEMÁTICO DE CARRETERA (SANTA CRUZ -> LIMONCITO)
           ========================================================================= */}
        {activeTab === 'route' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            
            {/* Visual Route Diagram Card (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Compass className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Itinerario y Hitos de Conectividad</h3>
                    <p className="text-xs text-slate-400">Distancia total aproximada: 46 kilómetros</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  ~45 minutos
                </span>
              </div>

              {/* Vertical Stepper with Visual Road Connection */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-400 before:to-sky-500">
                {routeMilestones.map((item, idx) => (
                  <div key={item.step} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-6 sm:-left-8 top-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-300 shadow-md">
                      {item.step}
                    </div>

                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 hover:border-emerald-500/60 transition-colors space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="text-slate-400">{item.distance}</span>
                          <span className="text-emerald-400 font-bold">• {item.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{item.detail}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Travel Advice Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  <strong>Recomendación de Visita:</strong> Salidas de transporte gratuito organizadas por CADIS todos los fines de semana a las 09:00 AM desde el 4to Anillo de Santa Cruz. Confirmación previa por WhatsApp.
                </p>
              </div>
            </div>

            {/* Quick Actions & Mobile Apps Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Reference Map Visual Preview */}
              <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
                <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-700/80 group">
                  <img
                    src={fotoMapaRutas}
                    alt="Ruta desde Santa Cruz hasta Río Bonito (Google Earth)"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Limoncito, Santa Cruz</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Coordenadas GPS de Referencia
                    </p>
                    <p className="text-sm font-mono font-bold text-white">
                      {REFERENCE_MAP_CONFIG.coordinates.display}
                    </p>
                  </div>
                </div>

                {/* External App Launchers */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={REFERENCE_MAP_CONFIG.googleMapsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span>Abrir Ruta en Google Maps</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </a>

                  <a
                    href={REFERENCE_MAP_CONFIG.wazeAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      <span>Navegar con Waze GPS</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </a>

                  <a
                    href={REFERENCE_MAP_CONFIG.whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <PhoneCall className="w-4 h-4 text-slate-950" />
                    <span>Pedir Ubicación Exacta por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Distances to Key Points */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Conexión con Puntos Clave
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 font-medium">Santa Cruz Centro</p>
                    <p className="text-base font-black text-white mt-0.5">45 min</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 font-medium">Hospital El Torno</p>
                    <p className="text-base font-black text-white mt-0.5">15 min</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 font-medium">Mercado La Guardia</p>
                    <p className="text-base font-black text-white mt-0.5">25 min</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 font-medium">Playa del Río</p>
                    <p className="text-base font-black text-emerald-400 mt-0.5">Acceso directo</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: VISTA SATELITAL / TOPOGRÁFICA DE REFERENCIA CON IMÁGENES
           ========================================================================= */}
        {activeTab === 'satellite' && (
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Mosaico Fotográfico y Referencia Satelital
                </h3>
                <p className="text-xs text-slate-400">
                  Inspección visual del terreno campestre, ribera del río y vegetación nativa en Limoncito.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
                GPS: {REFERENCE_MAP_CONFIG.coordinates.lat}, {REFERENCE_MAP_CONFIG.coordinates.lng}
              </span>
            </div>

            {/* Visual satellite composite grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo 1 */}
              <div className="group relative rounded-2xl overflow-hidden h-72 border border-slate-800">
                <img
                  src={fotoValleRio}
                  alt="Vista aérea del valle y el río Piraí (Google Earth)"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded">
                    Ribera y Balneario
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">Meandro del Río Bonito</h4>
                  <p className="text-xs text-slate-300">Playas de arena natural de uso privado para copropietarios.</p>
                </div>
              </div>

              {/* Photo 2 */}
              <div className="group relative rounded-2xl overflow-hidden h-72 border border-slate-800">
                <img
                  src={fotoLotes}
                  alt="Lotes planos con vegetación"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded">
                    Topografía
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">Lotes 100% Planos</h4>
                  <p className="text-xs text-slate-300">Suelo firme y fértil listo para construir tu casa de campo.</p>
                </div>
              </div>

              {/* Photo 3 */}
              <div className="group relative rounded-2xl overflow-hidden h-72 border border-slate-800">
                <img
                  src={fotoMicroclima}
                  alt="Microclima y reserva ecológica"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded">
                    Microclima
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">Brisa y Aire Puro</h4>
                  <p className="text-xs text-slate-300">Temperatura promedio de 22°C a 27°C todo el año.</p>
                </div>
              </div>
            </div>

            {/* Developer Notice for Swapping Real Images */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>📌 <strong>Nota de Referencia:</strong> Estas imágenes e infografías satelitales son representativas del área de Limoncito y pueden ser sustituidas fácilmente por ortofotos con dron oficiales.</span>
              <a
                href={REFERENCE_MAP_CONFIG.googleMapsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-bold shrink-0 ml-4 inline-flex items-center gap-1"
              >
                <span>Ver Satélite en Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: GOOGLE MAPS INTERACTIVO EMBED (CONFIGURABLE Y REEMPLAZABLE)
           ========================================================================= */}
        {activeTab === 'embed' && (
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Mapa Interactivo Google Maps (Limoncito, Santa Cruz)
                </h3>
                <p className="text-xs text-slate-400">
                  Navega, acerca y aleja el mapa interactivo directamente desde tu navegador.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={REFERENCE_MAP_CONFIG.googleMapsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Abrir en Pantalla Completa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Embedded Iframe Container */}
            <div className="relative w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-inner">
              <iframe
                title="Mapa de Ubicación de Referencia - Limoncito Santa Cruz"
                src={REFERENCE_MAP_CONFIG.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Developer instructions card for swapping real maps */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>¿Cómo reemplazar este mapa por tu enlace real de Google Maps?</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                En el archivo <code className="text-emerald-300 font-mono">src/components/ReferenceMapsSection.tsx</code>, simplemente actualiza la variable <code className="text-emerald-300 font-mono">embedUrl</code> dentro de <code className="text-emerald-300 font-mono">REFERENCE_MAP_CONFIG</code> con el enlace que te proporciona Google Maps al hacer clic en <em>Compartir &gt; Insertar un mapa</em>.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
