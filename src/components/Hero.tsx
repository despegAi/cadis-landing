import React from 'react';
import { Calculator, Compass } from 'lucide-react';
import { Property } from '../types';
import { CadisLogo } from './CadisLogo';
import { SITE_IMAGE_SLOTS } from '../config/siteImages';
import { useSiteImage } from '../lib/useSiteImages';

interface HeroProps {
  properties: Property[];
  onGoToSimulator: () => void;
  onGoToProperties: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGoToSimulator, onGoToProperties }) => {
  const heroPhoto = useSiteImage('heroPhoto');
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

          {/* Una sola foto principal (4:3). Editable desde el panel de administracion (ver config/siteImages.ts). */}
          <div className="lg:col-span-5">
            <img
              src={heroPhoto}
              alt={SITE_IMAGE_SLOTS.heroPhoto.alt}
              className="w-full aspect-[4/3] object-cover rounded-3xl shadow-xl border border-slate-100"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
