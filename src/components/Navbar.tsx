import React, { useEffect, useState } from 'react';
import { Phone, MapPin, MessageCircle, Menu, X } from 'lucide-react';
import { CadisLogo } from './CadisLogo';
import { CADIS_WHATSAPP_NUMBER, CADIS_WHATSAPP_DISPLAY } from '../config/contact';

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#rio-bonito', label: 'Río Bonito' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#propiedades', label: 'Mini quintas' },
  { href: '#contacto', label: 'Contacto' }
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Cierra el menú con Escape y bloquea el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const waHref = `https://wa.me/${CADIS_WHATSAPP_NUMBER}`;

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Franja de datos: solo en pantallas medianas en adelante (en el celular va dentro del menú) */}
      <div className="hidden sm:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Limoncito, Santa Cruz, Bolivia
          </span>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            {CADIS_WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      {/* Barra principal: logo / menú / WhatsApp */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-3">
        <a href="#inicio" className="shrink-0" onClick={() => setOpen(false)}>
          <CadisLogo size="md" className="bg-white px-2 py-1 rounded-lg !h-10 sm:!h-12" />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold transition-colors shrink-0"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-slate-100 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú del celular: panel bajo la barra, filas de 52 px fáciles de tocar */}
      <div
        id="menu-movil"
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Menú del celular" className="border-t border-slate-800 px-4 pb-4 pt-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex items-center h-13 px-2 text-base font-semibold text-slate-100 border-b border-slate-800/80 active:text-emerald-400"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center justify-between gap-3 pt-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Limoncito, Santa Cruz
              </span>
              <a
                href={waHref}
                tabIndex={open ? 0 : -1}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-11 text-slate-200"
              >
                <Phone className="w-4 h-4" />
                {CADIS_WHATSAPP_DISPLAY}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
