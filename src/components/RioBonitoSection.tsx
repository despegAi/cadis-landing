import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Trees, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  Compass, 
  Calculator, 
  Sun, 
  Waves, 
  Mountain,
  Camera,
  Eye,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { RioBonitoBadge } from './CadisLogo';
import { RioBonitoVisualMap } from './RioBonitoVisualMap';
import { SiteImage } from './SiteImage';
import { Property, LotReservationRequest } from '../types';
import { CADIS_WHATSAPP_NUMBER } from '../config/contact';

interface RioBonitoSectionProps {
  properties: Property[];
  onScrollToProperty: (propertyId: string) => void;
  onGoToSimulator: () => void;
  onSaveReservation: (data: Omit<LotReservationRequest, 'id' | 'fecha' | 'estado'>) => void;
}

export const RioBonitoSection: React.FC<RioBonitoSectionProps> = ({
  properties,
  onScrollToProperty,
  onGoToSimulator,
  onSaveReservation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'rio' | 'terrenos' | 'casas'>('todos');

  const galleryImages = [
    {
      id: 'img1',
      title: 'Playa Natural y Aguas Cristalinas',
      category: 'rio',
      tag: 'Balneario Privado',
      slot: 'galeria1',
      description: 'Acceso directo a la orilla del Río Bonito con arena suave, ideal para nadar y acampar en familia.'
    },
    {
      id: 'img2',
      title: 'Topografía Plana y Suelo Fértil',
      category: 'terrenos',
      tag: '500m² a 1,500m²',
      slot: 'galeria2',
      description: 'Lotes delimitados con estacas, listos para construir y sembrar árboles frutales o huerto propio.'
    },
    {
      id: 'img3',
      title: 'Estilo de Vida en Casa de Campo',
      category: 'casas',
      tag: 'Cabañas y Quincho',
      slot: 'galeria3',
      description: 'Diseño campestre con galerías ventiladas, piscina y fogonero bajo el cielo estrellado de los valles.'
    },
    {
      id: 'img4',
      title: 'Atardeceres y Microclima de Valle',
      category: 'rio',
      tag: 'Brisa Fresca',
      slot: 'galeria4',
      description: 'Clima templado a 500 metros sobre el nivel del mar con temperatura promedio anual de 24°C.'
    },
    {
      id: 'img5',
      title: 'Vegetación y Sendero Ecológico',
      category: 'terrenos',
      tag: 'Arborización Nativa',
      slot: 'galeria5',
      description: 'Rodeado de toborochis, tajibos y palmeras nativas con aire puro libre de contaminación.'
    },
    {
      id: 'img6',
      title: 'Espacios de Descanso Familiar',
      category: 'casas',
      tag: 'Convivencia',
      slot: 'galeria6',
      description: 'Tu propio refugio de fin de semana para desconectar del estrés urbano a solo 45 min de Santa Cruz.'
    }
  ];

  const filteredGallery = selectedCategory === 'todos' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);
  return (
    <section id="rio-bonito" className="py-20 scroll-mt-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <RioBonitoBadge />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Proyecto Estrella: <br className="hidden sm:inline" />
            <span className="text-emerald-700">Mini Quintas en Limoncito</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Un santuario natural diseñado para tu casa de campo, descanso familiar e inversión de alta plusvalía a minutos de la ciudad.
          </p>
        </div>

        {/* 3 Key Pillars of Río Bonito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-emerald-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Mountain className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Ubicación Privilegiada</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Limoncito se sitúa en una zona de transición de valles con microclima fresco, brisa constante y aire puro. Acceso transitable los 365 días del año.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-semibold pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                A 45 minutos de la mancha urbana
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Carretera principal afirmada
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-emerald-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Waves className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Acceso Directo al Río</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Disfruta de playas naturales de arena limpia y aguas cristalinas aptas para baño, pesca recreativa y esparcimiento de toda la familia en un entorno seguro.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-semibold pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Balneario natural privado
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Senderos ecológicos arborizados
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-teal-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#009698] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#009698]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Seguridad Jurídica y Ficha Catastral</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              En CADIS BIENES RAÍCES garantizamos documentación 100% verificable ante Derechos Reales, plano de mensura aprobado y registro catastral.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-semibold pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#009698]" />
                Matrícula DDRR N° 7.0.1.5.01.00022228
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#009698]" />
                Registro Catastral: 705-105-999-0001
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Energía Eléctrica (En proyecto / Próximamente)
              </li>
            </ul>
          </div>
        </div>

        {/* 2. ÁREA NOSOTROS & FICHA CATASTRAL OFICIAL (artevld.jpg) */}
        <div id="nosotros-legal" className="pt-8 border-t border-slate-200 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#009698] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Área 2 • Nosotros & Respaldo Legal
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Plano de Mensura y Ficha Catastral Oficial Río Bonito
            </h3>
            <p className="text-slate-600 text-sm">
              Documentación técnica y delimitación catastral verificada en la zona de Limoncito (Municipio El Torno), al margen del Río Piraí.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            {/* Blueprint Blueprint Photo Display */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-2xl bg-slate-950">
                <img
                  src="/assets/artevld.jpg"
                  alt="Plano de Mensura y Croquis de Ubicación Mini Quintas Río Bonito"
                  loading="lazy"
                  className="w-full h-auto object-contain max-h-[500px] hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/90 text-[#009698] text-xs font-black rounded-lg border border-teal-500/30">
                  Documento Oficial CADIS
                </div>
              </div>
            </div>

            {/* Official Legal & Catastral Specifications */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3">
                <h4 className="text-sm font-extrabold text-[#009698] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  DATOS CATASTRALES Y REGISTRO
                </h4>
                
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Departamento:</span>
                    <strong className="text-white">Santa Cruz</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Provincia:</span>
                    <strong className="text-white">Andrés Ibáñez</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Municipio:</span>
                    <strong className="text-white">El Torno</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Ubicación:</span>
                    <strong className="text-white">Limoncito (Com. Santo Rosario)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">N° de Registro:</span>
                    <strong className="text-teal-400 font-mono">705 - 105 - 999 - 0001</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Código Catastral:</span>
                    <strong className="text-teal-400 font-mono">705 - 105 - 999 - 0001</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Matrícula DDRR:</span>
                    <strong className="text-emerald-400 font-mono">N° 7.0.1.5.01.00022228</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Fecha Inscripción:</span>
                    <strong className="text-white">17/09/2007</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block mb-1">Propietarios Titulares:</span>
                    <p className="text-white font-bold bg-slate-900 p-2 rounded border border-slate-700">
                      ROLLER TOLEDO SAAVEDRA Y CARLOS IVER ANDIA CUÉLLAR
                    </p>
                  </div>
                </div>
              </div>

              {/* Manzanas & Loteamiento Breakdown */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 space-y-2">
                <h5 className="font-extrabold text-teal-300 text-xs uppercase">Resumen de Manzanos Aprobados:</h5>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-700">
                    <span className="text-slate-400 block">MANZANA N° 1</span>
                    <strong className="text-white">11 Lotes (9.144,56 m²)</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-700">
                    <span className="text-slate-400 block">MANZANA N° 2</span>
                    <strong className="text-white">16 Lotes (13.578,70 m²)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Static Visual Map Component with SVG Markers */}
        <RioBonitoVisualMap
          properties={properties}
          onScrollToProperty={onScrollToProperty}
          onSaveReservation={onSaveReservation}
        />

        {/* Visual Showcase with Interactive Stats */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-md">
                ¿Por qué invertir en Limoncito hoy?
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                La plusvalía campestre más sólida de Santa Cruz
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Históricamente, los proyectos con salida al río y servicios instalados duplican su valorización en los primeros 36 meses. Al adquirir tu Mini Quinta a precio de preventa desde <strong>$9,000 USD</strong>, aseguras tu patrimonio familiar con rentabilidad proyectada del 15% al 20% anual.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-emerald-500 pl-4">
                  <p className="text-2xl font-black text-white">500 a 1,500 m²</p>
                  <p className="text-xs text-slate-400">Espacio de libertad</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-xs text-slate-400">Crédito Directo CADIS</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onGoToSimulator}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Simular Financiamiento de Lote</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden h-44 sm:h-52">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
                    alt="Terreno verde en Limoncito"
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-xl overflow-hidden h-44 sm:h-52">
                  <img
                    src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80"
                    alt="Río y naturaleza"
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-xl overflow-hidden h-44 sm:h-52">
                  <img
                    src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
                    alt="Bosque nativo"
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-xl overflow-hidden h-44 sm:h-52">
                  <img
                    src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80"
                    alt="Casa de campo"
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Visual Photographic Experience Gallery */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md mb-2">
                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                <span>Galería de Referencia Visual</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                El Entorno Natural que Encontrarás en Río Bonito
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Imágenes de referencia que ilustran el tipo de paisaje, ribera y vegetación de la zona. Pide fotos y videos reales y actuales del lote específico por WhatsApp.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'todos', label: 'Todas' },
                { id: 'rio', label: 'Río y Playa' },
                { id: 'terrenos', label: 'Terrenos' },
                { id: 'casas', label: 'Casas de Campo' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <SiteImage
                    slot={item.slot}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                    {item.tag}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Imagen de referencia</span>
                    <a
                      href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola CADIS, me gustó la foto de referencia "${item.title}". ¿Tienen fotos y videos reales y actuales del lote?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-[#25D366] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                      <span>Pedir más fotos</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video & Drone Request Banner */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">¿Quieres ver videos tomados con dron de los lotes?</h4>
                <p className="text-xs text-slate-600">Te enviamos al instante los videos aéreos del río y los accesos por WhatsApp.</p>
              </div>
            </div>

            <a
              href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%2C%20quisiera%20recibir%20los%20videos%20con%20dron%20y%20el%20recorrido%20virtual%20de%20R%C3%ADo%20Bonito`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-sm transition-transform hover:scale-102 cursor-pointer shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Solicitar Videos por WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
