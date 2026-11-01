import React from 'react';
import { CadisLogo, RioBonitoBadge } from './CadisLogo';
import { CADIS_WHATSAPP_NUMBER, CADIS_WHATSAPP_DISPLAY } from '../config/contact';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronUp, 
  ShieldCheck,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <CadisLogo size="md" className="bg-white px-2 py-1 rounded-lg" />
            <p className="text-xs text-slate-400 leading-relaxed pr-6 italic">
              "Conectamos oportunidades inmobiliarias con el futuro de la familia cruceña"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              <strong>CADIS BIENES RAÍCES (Servicios Inmobiliarios)</strong> es la empresa líder en venta de Mini Quintas y terrenos campestres de alta plusvalía en Limoncito (El Torno, Santa Cruz). Seguridad jurídica respaldada con Matrícula DDRR N° 7.0.1.5.01.00022228.
            </p>

            <div className="pt-1">
              <RioBonitoBadge className="bg-teal-950/60 border-teal-500/40 text-teal-300" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=100063539620591"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] flex items-center justify-center text-white transition-transform hover:scale-105"
                aria-label="Página de Facebook Oficial CADIS"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://www.tiktok.com/@carlosiverandiacuellar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-transform hover:scale-105 border border-slate-700"
                aria-label="Perfil de TikTok Oficial CADIS"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-5.46 6.27 6.34 6.34 0 1 0 10.9-4.39v-4.1a8.14 8.14 0 0 0 4.67 1.48v-3.5a4.84 4.84 0 0 1-3.77-.77z"/>
                </svg>
              </a>

              <a
                href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%20Bienes%20Ra%C3%ADces`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center text-white transition-transform hover:scale-105"
                aria-label={`WhatsApp Directo CADIS ${CADIS_WHATSAPP_DISPLAY}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 1. ÁREA PROYECTOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#009698]">
              1. ÁREA PROYECTOS
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#rio-bonito" className="hover:text-white transition-colors">Proyecto Río Bonito (Limoncito)</a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-white transition-colors">Simulador de Crédito (2 o 3 Años)</a>
              </li>
              <li>
                <a href="#propiedades" className="hover:text-white transition-colors">Mapa de Lotes y Precios</a>
              </li>
              <li>Terrenos desde $9,000 USD</li>
              <li>Cuota Inicial del 30% ($2,700 USD desde)</li>
            </ul>
          </div>

          {/* 2. ÁREA NOSOTROS & LEGAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#009698]">
              2. ÁREA NOSOTROS
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#nosotros-legal" className="hover:text-white transition-colors">Seguridad Jurídica & Ficha DDRR</a>
              </li>
              <li>Matrícula DDRR N° 7.0.1.5.01.00022228</li>
              <li>Registro Catastral: 705-105-999-0001</li>
              <li>
                <a href="#vendedores" className="hover:text-white transition-colors">Equipo Vendedores CADIS</a>
              </li>
            </ul>
          </div>

          {/* 3. ÁREA CONTACTO & UBICACIONES */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#009698]">
              3. CONTACTO & UBICACIÓN
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#009698] shrink-0" />
                <a href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {CADIS_WHATSAPP_DISPLAY} (WhatsApp)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#009698] shrink-0" />
                <a href="mailto:carlosandia85@gmail.com" className="hover:text-white">
                  carlosandia85@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="https://maps.app.goo.gl/oG2DXJUqvFcFrsBD6?g_st=awb" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  GPS Río Bonito Limoncito
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#009698] shrink-0" />
                <a href="https://maps.app.goo.gl/AWQYKLcjncdTFzPw8" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Oficina Principal CADIS
                </a>
              </p>

              <div className="pt-3">
                <button
                  onClick={onOpenAdmin}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Acceso Panel Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CADIS BIENES RAÍCES (Servicios Inmobiliarios). Todos los derechos reservados. Proyecto Río Bonito - Limoncito (El Torno, Santa Cruz).</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Volver arriba</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
