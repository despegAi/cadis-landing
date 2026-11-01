import React from 'react';
import { Calculator, Compass } from 'lucide-react';
import { Property } from '../types';
import { CadisLogo } from './CadisLogo';

interface HeroProps {
  properties: Property[];
  onGoToSimulator: () => void;
  onGoToProperties: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGoToSimulator, onGoToProperties }) => {
  return (
    <section id="inicio" className="relative scroll-mt-28 pt-8 pb-16 md:pt-10 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Logotipo oficial CADIS con presencia de marca imponente en la parte superior del Hero */}
        <div className="flex justify-center mb-8 md:mb-10">
          <CadisLogo size="hero" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Copy Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Tu Mini Quinta en <br className="hidden sm:inline" />
              <span className="text-[#009698]">Limoncito, Santa Cruz</span>
            </h1>

            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              $9,000 USD
              <span className="block sm:inline sm:ml-2 text-base sm:text-lg font-bold text-slate-600">
                Cuota inicial 30% = $2,700 USD
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onGoToSimulator}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#009698] to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-700/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                id="hero-simulator-cta-btn"
              >
                <Calculator className="w-5 h-5 text-teal-200" />
                <span>Simular Crédito</span>
              </button>

              <button
                onClick={onGoToProperties}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all cursor-pointer"
                id="hero-properties-cta-btn"
              >
                <Compass className="w-5 h-5 text-slate-600" />
                <span>Ver Loteamiento</span>
              </button>
            </div>
          </div>

          {/* Reference Image Gallery Column: 4 high-res reference cards (nature, river, lots, lifestyle) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* TODO: Reemplazar con imagen real en Git */}
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80"
                alt="Entorno natural y vegetación nativa en Río Bonito"
                className="w-full h-40 sm:h-52 object-cover rounded-2xl shadow-lg border border-slate-100"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />

              {/* TODO: Reemplazar con imagen real en Git */}
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80"
                alt="Río y playa natural del Proyecto Río Bonito"
                className="w-full h-40 sm:h-52 object-cover rounded-2xl shadow-lg border border-slate-100"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />

              {/* TODO: Reemplazar con imagen real en Git */}
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80"
                alt="Lotes campestres y mini quintas en Limoncito"
                className="w-full h-40 sm:h-52 object-cover rounded-2xl shadow-lg border border-slate-100"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />

              {/* TODO: Reemplazar con imagen real en Git */}
              <img
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=700&q=80"
                alt="Estilo de vida campestre en casa de campo"
                className="w-full h-40 sm:h-52 object-cover rounded-2xl shadow-lg border border-slate-100"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
