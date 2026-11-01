import React from 'react';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { CadisLogo } from './CadisLogo';
import { CADIS_WHATSAPP_NUMBER, CADIS_WHATSAPP_DISPLAY } from '../config/contact';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Utility strip: phone + location */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-end sm:justify-between text-[11px] text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Limoncito, Santa Cruz, Bolivia
          </span>
          <a
            href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            {CADIS_WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      {/* Main bar: logo / menu / WhatsApp CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <a href="#inicio" className="shrink-0">
          {/* Tamaño corporativo estándar (h-12) para no ocupar demasiado espacio al hacer scroll */}
          <CadisLogo size="md" className="bg-white px-2 py-1 rounded-lg" />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
          <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
          <a href="#rio-bonito" className="hover:text-white transition-colors">Río Bonito</a>
          <a href="#simulador" className="hover:text-white transition-colors">Simulador</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </nav>

        <a
          href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </header>
  );
};
