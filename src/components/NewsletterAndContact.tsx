import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Share2,
  ExternalLink
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';
import { ContactMessage } from '../types';
import { CADIS_WHATSAPP_NUMBER } from '../config/contact';

interface NewsletterAndContactProps {
  onSubscribeNewsletter: (email: string) => void;
  onSendContactMessage: (msg: Omit<ContactMessage, 'id' | 'fecha'>) => void;
}

export const NewsletterAndContact: React.FC<NewsletterAndContactProps> = ({
  onSubscribeNewsletter,
  onSendContactMessage
}) => {
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  // Contact form state
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('Consulta sobre Proyecto Río Bonito');
  const [mensaje, setMensaje] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactAttempted, setContactAttempted] = useState(false);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterError('Ingresa tu correo electrónico para suscribirte.');
      return;
    }
    setNewsletterError(null);
    onSubscribeNewsletter(newsletterEmail.trim());
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactAttempted(true);
    if (!nombre.trim() || !telefono.trim() || !mensaje.trim()) return;

    onSendContactMessage({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      asunto,
      mensaje: mensaje.trim()
    });

    setContactSuccess(true);
    setContactAttempted(false);
    setNombre('');
    setTelefono('');
    setEmail('');
    setMensaje('');
    setTimeout(() => setContactSuccess(false), 6000);
  };

  return (
    <section id="contacto" className="py-20 scroll-mt-28 bg-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden text-white">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/20 px-3 py-1 rounded-md border border-emerald-500/30 inline-block">
                Boletín Informativo CADIS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Entérate de Nuevas Manzanas y Promociones Exclusivas
              </h3>
              <p className="text-slate-300 text-sm">
                Recibe en tu correo antes que nadie las aperturas de nuevas fases de Río Bonito y descuentos por pago de inicial.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      aria-invalid={!!newsletterError}
                      placeholder="Ingresa tu correo electrónico..."
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterError) setNewsletterError(null);
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border text-white text-sm focus:outline-none placeholder-slate-400 ${
                        newsletterError ? 'border-red-500 focus:border-red-400' : 'border-slate-600 focus:border-emerald-400'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                    id="btn-subscribe-newsletter"
                  >
                    <span>Suscribirme</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {newsletterError && (
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5 bg-red-950/60 p-2 rounded-lg border border-red-500/40">
                    <span>{newsletterError}</span>
                  </div>
                )}

                {newsletterSuccess && (
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>¡Gracias por suscribirte! Ya estás registrado en nuestro boletín.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Contact & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                Atención Personalizada
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Ponte en Contacto con CADIS
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Visítanos en nuestras oficinas corporativas o agenda un recorrido técnico hacia el Proyecto Río Bonito en Limoncito.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Oficina Central & Google Maps */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-teal-50 text-[#009698] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">Oficina Principal CADIS</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Santa Cruz de la Sierra, Bolivia.
                  </p>
                  <a
                    href="https://maps.app.goo.gl/AWQYKLcjncdTFzPw8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#009698] hover:underline"
                  >
                    <span>Ver Ubicación en Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card 2: Proyecto Río Bonito Limoncito Google Maps */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">Proyecto Río Bonito</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mini Quintas en Limoncito (Municipio El Torno).
                  </p>
                  <a
                    href="https://maps.app.goo.gl/oG2DXJUqvFcFrsBD6?g_st=awb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <span>Abrir Ruta GPS del Proyecto</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card 3: Email Corporativo */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">Correo Electrónico</h4>
                  <a
                    href="mailto:carlosandia85@gmail.com"
                    className="text-xs font-bold text-slate-800 hover:text-[#009698] mt-0.5 block"
                  >
                    carlosandia85@gmail.com
                  </a>
                </div>
              </div>

              {/* Card 4: WhatsApp Oficial 63560078 */}
              <div className="p-4 rounded-xl bg-teal-50 border-2 border-[#009698]/40 shadow-xs flex items-start gap-3 relative overflow-hidden">
                <div className="p-2.5 rounded-lg bg-[#25D366] text-white shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase">WhatsApp Oficial CADIS</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 font-bold">
                    +591 63560078
                  </p>
                  <a
                    href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%20Bienes%20Ra%C3%ADces%2C%20quisiera%20agendar%20una%20visita%20a%20R%C3%ADo%20Bonito%20y%20recibir%20el%20cat%C3%A1logo%20de%20lotes`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold shadow-sm transition-transform hover:scale-102 cursor-pointer"
                  >
                    <span>Chat Directo WhatsApp (63560078)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Redes Sociales Oficiales: Facebook & TikTok */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#009698] uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  REDES SOCIALES OFICIALES DE CADIS
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Sigue nuestras páginas oficiales para ver testimonios, videos aéreos en vivo y actualizaciones de las Mini Quintas.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=100063539620591"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-102"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Página Oficial de Facebook</span>
                </a>

                <a
                  href="https://www.tiktok.com/@carlosiverandiacuellar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md border border-slate-600 cursor-pointer transition-transform hover:scale-102"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-5.46 6.27 6.34 6.34 0 1 0 10.9-4.39v-4.1a8.14 8.14 0 0 0 4.67 1.48v-3.5a4.84 4.84 0 0 1-3.77-.77z"/>
                  </svg>
                  <span>Perfil Oficial de TikTok</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Quick Triggers Banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl border border-emerald-600/40 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <h4 className="text-sm font-extrabold">¿Prefieres atención inmediata por WhatsApp en lugar de formulario?</h4>
                </div>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700">
                  En Línea
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Haz clic en cualquiera de estos temas y chatea directamente con nuestros asesores sin esperar:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: '💰 Lotes de $9,000 USD', msg: 'Hola, me interesa conocer la disponibilidad de los lotes de $9,000 USD' },
                  { label: '🚌 Visitas de Fin de Semana', msg: 'Hola CADIS, quiero reservar lugar para la visita guiada a Limoncito' },
                  { label: '📄 Crédito Directo en 3 meses', msg: 'Hola, quisiera información sobre el plan de cuota inicial en 3 meses' },
                  { label: '📍 Ubicación GPS en tiempo real', msg: 'Hola, me gustaría que me envíen la ubicación GPS de Río Bonito por WhatsApp' }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(item.msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#25D366] text-white hover:text-slate-950 text-xs font-bold border border-white/20 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">
                  O si prefieres, déjanos tu mensaje por correo
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">Formulario Web</span>
              </div>

              {contactSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Mensaje enviado con éxito! Un asesor se comunicará contigo a la brevedad.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4" id="general-contact-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      aria-invalid={contactAttempted && !nombre.trim()}
                      placeholder="Ej: Laura Morales"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:bg-white focus:outline-none ${
                        contactAttempted && !nombre.trim() ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-emerald-600'
                      }`}
                    />
                    {contactAttempted && !nombre.trim() && (
                      <p className="text-[11px] font-semibold text-red-600 mt-1">Ingresa tu nombre.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      aria-invalid={contactAttempted && !telefono.trim()}
                      placeholder="+591 70000000"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:bg-white focus:outline-none ${
                        contactAttempted && !telefono.trim() ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-emerald-600'
                      }`}
                    />
                    {contactAttempted && !telefono.trim() && (
                      <p className="text-[11px] font-semibold text-red-600 mt-1">Ingresa tu teléfono o WhatsApp.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                      Asunto de Interés
                    </label>
                    <select
                      id="contact-subject"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Consulta sobre Proyecto Río Bonito">Consulta sobre Proyecto Río Bonito</option>
                      <option value="Agendar Visita de Fin de Semana">Agendar Visita de Fin de Semana</option>
                      <option value="Dudas sobre Crédito Directo y Contrato">Dudas sobre Crédito Directo y Contrato</option>
                      <option value="Consulta de Inversionista por Bloque de Lotes">Consulta de Inversionista por Bloque de Lotes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                    Mensaje o Consulta Específica *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={3}
                    aria-invalid={contactAttempted && !mensaje.trim()}
                    placeholder="Escribe aquí tu consulta..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:bg-white focus:outline-none ${
                      contactAttempted && !mensaje.trim() ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-emerald-600'
                    }`}
                  />
                  {contactAttempted && !mensaje.trim() && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1">Escribe tu consulta antes de enviar.</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-submit-contact"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Enviar Mensaje a Asesoría CADIS</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: FAQ Accordion (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">
                Preguntas Frecuentes
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Todo sobre Río Bonito
              </h3>
              <p className="text-slate-600 text-xs mt-1">
                Conoce las respuestas a las dudas más comunes de nuestros compradores e inversionistas.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        {item.pregunta}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {item.respuesta}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Weekend Tour Banner */}
            <div className="p-5 rounded-2xl bg-emerald-900 text-white space-y-2.5 shadow-md">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                Tour Guiado Gratuito
              </span>
              <h4 className="text-base font-black">
                ¿Quieres conocer Río Bonito este sábado o domingo?
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Salimos desde el 2do Anillo en Santa Cruz en vans climatizadas con refrigerio y recorrido guiado por los manzanos y playa del río.
              </p>
              <a
                href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%2C%20quisiera%20reservar%202%20cupos%20para%20el%20recorrido%20de%20fin%20de%20semana%20a%20R%C3%ADo%20Bonito`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-xs transition-colors"
              >
                <span>Reservar Cupo para la Visita</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
