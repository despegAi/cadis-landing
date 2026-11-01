import React, { useState, useEffect } from 'react';
import { CadisLogo } from './CadisLogo';
import { CADIS_WHATSAPP_NUMBER, CADIS_WHATSAPP_DISPLAY } from '../config/contact';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  PhoneCall, 
  Calculator, 
  Building2, 
  Users, 
  MessageSquare,
  Sparkles,
  MessageCircle,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  adminLeadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, adminLeadsCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/90 backdrop-blur-xs border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('inicio');
            }}
            className="flex items-center gap-2 group focus:outline-none"
            id="brand-logo-link"
          >
            <CadisLogo size="md" className="bg-white px-2 py-1 rounded-lg" />
          </a>

          {/* Desktop Navigation organized into 3 Main Functional Areas */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {/* Area 1: Proyectos */}
            <div className="relative group">
              <button
                onClick={() => scrollToSection('rio-bonito')}
                className="px-3.5 py-2 text-sm font-extrabold text-[#009698] hover:bg-teal-50 transition-colors rounded-lg flex items-center gap-1.5 cursor-pointer"
                id="nav-area-proyectos"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#009698] animate-pulse inline-block" />
                <span>1. Proyectos</span>
              </button>
            </div>

            {/* Area 2: Nosotros & Seguridad Jurídica */}
            <div className="relative group">
              <button
                onClick={() => scrollToSection('nosotros-legal')}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#009698] transition-colors rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                id="nav-area-nosotros"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>2. Nosotros</span>
              </button>
            </div>

            {/* Area 3: Contacto, Ubicaciones & Redes */}
            <div className="relative group">
              <button
                onClick={() => scrollToSection('contacto')}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#009698] transition-colors rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                id="nav-area-contacto"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>3. Contacto & Ubicación</span>
              </button>
            </div>

            {/* Quick Access CTAs */}
            <button
              onClick={() => scrollToSection('simulador')}
              className="px-3 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors rounded-lg flex items-center gap-1 cursor-pointer border border-teal-200/80 ml-2"
              id="nav-simulador-btn"
            >
              <Calculator className="w-3.5 h-3.5 text-[#009698]" />
              <span>Simulador de Crédito</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Direct with the single official CADIS number */}
            <a
              href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%20Bienes%20Ra%C3%ADces%2C%20quisiera%20recibir%20informaci%C3%B3n%20y%20asesor%C3%ADa%20sobre%20el%20Proyecto%20R%C3%ADo%20Bonito%20en%20Limoncito`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-sm hover:shadow transition-all rounded-lg"
              id="header-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span className="hidden lg:inline">WhatsApp {CADIS_WHATSAPP_DISPLAY.replace('+591 ', '')}</span>
            </a>

            {/* Admin Dashboard entry: kept low-visual-weight — it's a staff affordance, not part of the visitor pitch */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              id="header-admin-btn"
              aria-label="Panel de Administración"
              title="Panel de Administración"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden 2xl:inline">Panel Admin</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenAdmin}
              className="inline-flex sm:hidden items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg"
              id="mobile-admin-btn"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              id="mobile-menu-toggle-btn"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 pb-4 space-y-1 bg-white rounded-xl shadow-lg p-4 animate-in fade-in duration-200">
            <div className="text-[11px] font-black uppercase text-[#009698] px-3 pt-1">1. ÁREA PROYECTOS</div>
            <button
              onClick={() => scrollToSection('rio-bonito')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#009698]" />
              Proyecto Río Bonito (Limoncito)
            </button>
            <button
              onClick={() => scrollToSection('simulador')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#009698]" />
              Simulador de Crédito Directo
            </button>
            <button
              onClick={() => scrollToSection('propiedades')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              Mapa de Disponibilidad & Lotes
            </button>

            <div className="text-[11px] font-black uppercase text-[#009698] px-3 pt-3 border-t border-slate-100 mt-2">2. ÁREA NOSOTROS</div>
            <button
              onClick={() => scrollToSection('nosotros-legal')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Seguridad Jurídica & Ficha DDRR
            </button>
            <button
              onClick={() => scrollToSection('vendedores')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-slate-600" />
              Únete como Vendedor CADIS
            </button>

            <div className="text-[11px] font-black uppercase text-[#009698] px-3 pt-3 border-t border-slate-100 mt-2">3. ÁREA CONTACTO & REDES</div>
            <button
              onClick={() => scrollToSection('contacto')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              Formulario de Contacto & Ubicaciones
            </button>

            <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 px-4 rounded-lg text-slate-400 hover:text-slate-700 font-semibold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panel de Administración</span>
              </button>
              <a
                href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%2C%20quisiera%20informaci%C3%B3n%20sobre%20R%C3%ADo%20Bonito`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-black text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>WhatsApp Directo {CADIS_WHATSAPP_DISPLAY.replace('+591 ', '')}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
