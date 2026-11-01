import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  DollarSign, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Send, 
  Briefcase, 
  PhoneCall,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VendorApplication } from '../types';
import { CADIS_WHATSAPP_NUMBER } from '../config/contact';

interface VendorRecruitmentProps {
  onRegisterVendor: (vendor: Omit<VendorApplication, 'id' | 'estado' | 'fecha'>) => void;
}

export const VendorRecruitment: React.FC<VendorRecruitmentProps> = ({ onRegisterVendor }) => {
  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [nivelExperiencia, setNivelExperiencia] = useState<'sin_experiencia' | 'intermedio' | 'experimentado'>('intermedio');
  const [mensaje, setMensaje] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!nombre.trim() || !ci.trim() || !telefono.trim() || !email.trim() || !experiencia.trim()) {
      return;
    }

    setSubmitting(true);

    onRegisterVendor({
      nombre: nombre.trim(),
      ci: ci.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      experiencia: experiencia.trim(),
      nivelExperiencia,
      mensaje: mensaje.trim() || undefined
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <section id="vendedores" className="py-20 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Benefits */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-emerald-400 text-xs font-bold">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Red de Asesores Inmobiliarios CADIS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Regístrate como <br />
              <span className="text-emerald-700">Vendedor / Agente CADIS</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Únete a una de las empresas de mayor crecimiento inmobiliario en Santa Cruz. Comercializa el exitoso <strong>Proyecto Río Bonito en Limoncito</strong> y accede a las comisiones más altas y puntuales del mercado.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Comisiones Altas y Pagos Inmediatos</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Gana atractivas comisiones en dólares americanos por cada lote reservado y consolidado, con liquidación ágil sin trabas administrativas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-800 shrink-0 mt-0.5">
                  <TrendingUp className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Cierre de Ventas Fácil con Crédito Directo</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Nuestros terrenos desde $9,000 USD y cuota inicial en 3 meses garantizan un cierre de ventas acelerado para tus clientes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Award className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Material Digital, Planos y Salidas Guiadas</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Te proporcionamos catálogos en PDF, videos en alta definición para tus redes sociales y transporte para llevar a tus clientes a Limoncito.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recruitment Form */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-xl relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-600 text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-full shadow-md">
                Postulación Abierta
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4" id="vendor-registration-form">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Formulario de Postulación de Asesor
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completa tus datos y la gerencia comercial de CADIS evaluará tu perfil para habilitar tus credenciales.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="vendor-name" className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        id="vendor-name"
                        type="text"
                        required
                        aria-invalid={submitAttempted && !nombre.trim()}
                        placeholder="Ej: Patricia Vaca"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-sm focus:ring-1 focus:outline-none placeholder-slate-400 ${
                          submitAttempted && !nombre.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                        }`}
                      />
                      {submitAttempted && !nombre.trim() && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">Ingresa tu nombre completo.</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vendor-ci" className="block text-xs font-bold text-slate-700 mb-1">
                        C.I. / DNI *
                      </label>
                      <input
                        id="vendor-ci"
                        type="text"
                        required
                        aria-invalid={submitAttempted && !ci.trim()}
                        placeholder="Ej: 5849302 SC"
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-sm focus:ring-1 focus:outline-none placeholder-slate-400 ${
                          submitAttempted && !ci.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                        }`}
                      />
                      {submitAttempted && !ci.trim() && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">Ingresa tu C.I.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="vendor-phone" className="block text-xs font-bold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        id="vendor-phone"
                        type="tel"
                        required
                        aria-invalid={submitAttempted && !telefono.trim()}
                        placeholder="Ej: +591 72198765"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-sm focus:ring-1 focus:outline-none placeholder-slate-400 ${
                          submitAttempted && !telefono.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                        }`}
                      />
                      {submitAttempted && !telefono.trim() && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">Ingresa tu teléfono o WhatsApp.</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vendor-email" className="block text-xs font-bold text-slate-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        id="vendor-email"
                        type="email"
                        required
                        aria-invalid={submitAttempted && !email.trim()}
                        placeholder="agente@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-sm focus:ring-1 focus:outline-none placeholder-slate-400 ${
                          submitAttempted && !email.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                        }`}
                      />
                      {submitAttempted && !email.trim() && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">Ingresa tu correo electrónico.</p>
                      )}
                    </div>
                  </div>

                  {/* Nivel de Experiencia Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nivel de Experiencia en Ventas Inmobiliarias
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNivelExperiencia('sin_experiencia')}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          nivelExperiencia === 'sin_experiencia'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Iniciante (Con ganas)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNivelExperiencia('intermedio')}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          nivelExperiencia === 'intermedio'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        1 a 3 años
                      </button>
                      <button
                        type="button"
                        onClick={() => setNivelExperiencia('experimentado')}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          nivelExperiencia === 'experimentado'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Más de 3 años
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="vendor-exp" className="block text-xs font-bold text-slate-700 mb-1">
                      Detalle de tu Experiencia Previa *
                    </label>
                    <textarea
                      id="vendor-exp"
                      required
                      rows={2}
                      aria-invalid={submitAttempted && !experiencia.trim()}
                      placeholder="Describe brevemente tus ventas previas en bienes raíces, corretaje o rubros afines..."
                      value={experiencia}
                      onChange={(e) => setExperiencia(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-sm focus:ring-1 focus:outline-none placeholder-slate-400 ${
                        submitAttempted && !experiencia.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                      }`}
                    />
                    {submitAttempted && !experiencia.trim() && (
                      <p className="text-[11px] font-semibold text-red-600 mt-1">Cuéntanos brevemente tu experiencia.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="vendor-msg" className="block text-xs font-bold text-slate-700 mb-1">
                      ¿Por qué deseas unirte a CADIS? (Opcional)
                    </label>
                    <input
                      id="vendor-msg"
                      type="text"
                      placeholder="Ej: Me interesa comercializar lotes con crédito directo para mi cartera"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none placeholder-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-slate-900 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                    id="submit-vendor-btn"
                  >
                    {submitting ? (
                      <span>Enviando postulación...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-emerald-400" />
                        <span>Enviar Solicitud de Vendedor</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    Tus datos se almacenan de forma segura para evaluación en el panel administrativo de CADIS.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">¡Postulación Enviada con Éxito!</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Gracias <strong>{nombre}</strong>. Tu perfil ha sido registrado en el Panel de Vendedores de CADIS con estado <strong>"Pendiente de Aprobación"</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                    <p><strong className="text-slate-500">C.I.:</strong> {ci}</p>
                    <p><strong className="text-slate-500">Teléfono:</strong> {telefono}</p>
                    <p><strong className="text-slate-500">Correo:</strong> {email}</p>
                    <p><strong className="text-slate-500">Nivel:</strong> {nivelExperiencia}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={`https://wa.me/${CADIS_WHATSAPP_NUMBER}?text=Hola%20CADIS%2C%20acabo%20de%20postular%20como%20agente%20vendedor%20(${encodeURIComponent(nombre)}%2C%20CI%3A%20${encodeURIComponent(ci)}).%20Quisiera%20coordinar%20mi%20entrevista.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Escribir por WhatsApp a Recursos Humanos</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSubmitAttempted(false);
                        setNombre('');
                        setCi('');
                        setTelefono('');
                        setEmail('');
                        setExperiencia('');
                        setMensaje('');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Registrar otra postulación
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
