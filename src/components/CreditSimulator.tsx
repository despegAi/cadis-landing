import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Send, 
  Clock,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { CreditSimulation } from '../types';

interface CreditSimulatorProps {
  onSaveSimulation: (simulation: Omit<CreditSimulation, 'id' | 'fecha' | 'estado'>) => void;
  selectedLotPrice?: number;
  selectedLotNumber?: string;
}

export const CreditSimulator: React.FC<CreditSimulatorProps> = ({
  onSaveSimulation,
  selectedLotPrice,
  selectedLotNumber
}) => {
  // 1. Land price: fixed at $9,000 USD for every mini-quinta in the project (no variable pricing)
  const precioTerreno = 9000;

  // 2. Initial payment mode (amount is always derived from precioTerreno, see cuotaInicialMonto below)
  const [modalidadInicial, setModalidadInicial] = useState<'contado' | 'diferido_3m'>('diferido_3m');

  // 3. Financing term: 1 to 8 years (12 to 96 months)
  const [plazoAnios, setPlazoAnios] = useState<number>(3);

  // 4. Lead Form States
  const [clienteNombre, setClienteNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [notas, setNotas] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Financial Calculations with 10% Annual Interest Amortization Rate
  const tasaAnual = 0.10; // 10% anual
  const tasaMensual = tasaAnual / 12; // ~0.0083333
  // Cuota inicial obligatoria: siempre 30% del precio del terreno (regla de negocio fija, ver CLAUDE.md)
  const cuotaInicialMonto = Math.round(precioTerreno * 0.30);
  const saldoRestante = Math.max(0, precioTerreno - cuotaInicialMonto);
  const cuotaInicialMensual = modalidadInicial === 'diferido_3m' ? cuotaInicialMonto / 3 : cuotaInicialMonto;

  const plazoMeses = plazoAnios * 12;
  
  // Formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
  const factorInteres = Math.pow(1 + tasaMensual, plazoMeses);
  const cuotaMensual = saldoRestante > 0 
    ? (saldoRestante * (tasaMensual * factorInteres)) / (factorInteres - 1)
    : 0;

  const totalPagadoFinanciamiento = cuotaMensual * plazoMeses;
  const totalInteresesUSD = Math.max(0, totalPagadoFinanciamiento - saldoRestante);

  // Form submit handler
  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!clienteNombre.trim() || !telefono.trim()) {
      return;
    }

    setSubmitting(true);

    const simulationData = {
      clienteNombre: clienteNombre.trim(),
      telefono: telefono.trim(),
      email: email.trim() || undefined,
      montoTerreno: precioTerreno,
      cuotaInicialPorcentaje: Math.round((cuotaInicialMonto / precioTerreno) * 100),
      cuotaInicialMonto,
      modalidadInicial,
      cuotaInicialMensual,
      saldoRestante,
      plazoAnios,
      plazoMeses,
      tasaInteresAnual: 10,
      cuotaMensual: Number(cuotaMensual.toFixed(2)),
      totalFinanciadoUSD: Number(totalPagadoFinanciamiento.toFixed(2)),
      propiedadLote: selectedLotNumber || 'Mini Quinta Limoncito',
      notas: notas.trim() || undefined
    };

    // Save into state / admin store
    onSaveSimulation(simulationData);

    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
    }, 400);
  };

  const getWhatsAppMessageUrl = () => {
    const text = `*SIMULACIÓN DE CRÉDITO DIRECTO - CADIS BIENES RAÍCES*%0A` +
      `---------------------------------------%0A` +
      `*Cliente:* ${encodeURIComponent(clienteNombre || 'Interesado')}%0A` +
      `*Teléfono:* ${encodeURIComponent(telefono)}%0A` +
      `*Proyecto:* Río Bonito (Limoncito)%0A` +
      `*Lote de Interés:* ${encodeURIComponent(selectedLotNumber || 'Mini Quinta Standard')}%0A` +
      `*Precio del Terreno:* $${precioTerreno.toLocaleString()} USD%0A` +
      `*Cuota Inicial:* $${cuotaInicialMonto.toLocaleString()} USD%0A` +
      `*Modalidad Inicial:* ${modalidadInicial === 'diferido_3m' ? 'Diferido en 3 cuotas de $' + cuotaInicialMensual.toFixed(2) + ' USD/mes' : 'Pago al Contado'}%0A` +
      `*Saldo a Financiar:* $${saldoRestante.toLocaleString()} USD%0A` +
      `*Plazo Elegido:* ${plazoAnios} años (${plazoMeses} meses al 10% anual)%0A` +
      `*Cuota Mensual Resultante:* $${cuotaMensual.toFixed(2)} USD/mes%0A` +
      `---------------------------------------%0A` +
      `Hola CADIS, he generado esta simulación y deseo solicitar la reserva o agendar mi visita técnica.`;
    return `https://wa.me/59163560078?text=${text}`;
  };

  return (
    <section id="simulador" className="py-20 scroll-mt-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Simulador de Crédito Directo en Tiempo Real</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Calcula tu Crédito Directo en <span className="text-emerald-400">Río Bonito</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Aprobación directa sin trámites bancarios. Elige cómo pagar tu cuota inicial y selecciona el plazo a tu medida.
          </p>
          {selectedLotNumber && (
            <div className="inline-block mt-2 px-4 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm font-semibold">
              Calculando para lote seleccionado: <strong className="text-white">{selectedLotNumber}</strong> (${precioTerreno.toLocaleString()} USD)
            </div>
          )}
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-8">
            
            {/* 1. Precio Fijo del Terreno */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  1. Precio de la Mini Quinta
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900 rounded-xl border border-slate-600 px-4 py-3.5">
                <span className="text-2xl font-extrabold text-white">${precioTerreno.toLocaleString()} <span className="text-xs font-bold text-slate-400 uppercase">USD</span></span>
                <span className="text-xs font-bold text-emerald-400 uppercase text-right">Precio Único<br/>Todos los Lotes</span>
              </div>
              <p className="text-xs text-slate-400">
                Todas las mini-quintas del Proyecto Río Bonito tienen el mismo precio fijo.
              </p>
            </div>

            {/* 2 & 3. Cuota Inicial (30% Obligatoria) y Modalidad */}
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  2. Cuota Inicial Obligatoria (30%)
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">
                    ${cuotaInicialMonto.toLocaleString()} <span className="text-xs font-bold text-slate-300">USD</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                El 30% es el aporte inicial para la reserva formal y adjudicación del terreno.
              </p>

              {/* 3. Modalidad de Cuota Inicial */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  3. Modalidad de Pago de la Cuota Inicial:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Opción 1: Diferido en 3 meses */}
                  <button
                    type="button"
                    onClick={() => setModalidadInicial('diferido_3m')}
                    className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer relative ${
                      modalidadInicial === 'diferido_3m'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        Diferido en 3 Meses
                      </span>
                      <span className="text-[10px] uppercase font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                        MÁS ELEGIDO
                      </span>
                    </div>
                    <p className="text-2xl font-black text-emerald-400">
                      ${cuotaInicialMensual.toFixed(2)} <span className="text-xs font-semibold text-slate-400">USD / mes</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Pagas 3 cuotas mensuales de ${cuotaInicialMensual.toFixed(2)} USD para completar la inicial.
                    </p>
                  </button>

                  {/* Opción 2: Pago Contado */}
                  <button
                    type="button"
                    onClick={() => setModalidadInicial('contado')}
                    className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
                      modalidadInicial === 'contado'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Pago Contado
                      </span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      ${cuotaInicialMonto.toLocaleString()} <span className="text-xs font-semibold text-slate-400">USD único</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Cancelas la inicial completa en un solo desembolso y pasas directo a financiar el saldo.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Plazo de Financiamiento del Saldo (2 o 3 Años con 10% de Interés Anual) */}
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  4. Plazo de Financiamiento (2 o 3 Años • Tasa 10% Anual)
                </label>
                <span className="text-xs font-bold text-teal-400">Saldo: ${saldoRestante.toLocaleString()} USD</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[2, 3].map((anios) => {
                  const meses = anios * 12;
                  const fInteres = Math.pow(1 + tasaMensual, meses);
                  const cuota = saldoRestante > 0 ? (saldoRestante * (tasaMensual * fInteres)) / (fInteres - 1) : 0;
                  const isSelected = plazoAnios === anios;

                  return (
                    <button
                      key={anios}
                      type="button"
                      onClick={() => setPlazoAnios(anios)}
                      className={`p-3 rounded-xl text-center border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#009698]/30 border-[#009698] text-white shadow-lg shadow-teal-950/40 ring-1 ring-[#009698]'
                          : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {anios === 3 && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                          RECOMENDADO
                        </span>
                      )}
                      <p className="text-[11px] font-bold uppercase text-slate-400">{anios} {anios === 1 ? 'Año' : 'Años'} ({meses} m)</p>
                      <p className="text-lg font-black text-teal-300 mt-0.5">
                        ${cuota.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400">USD / mes</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cost Breakdown Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 via-slate-800 to-sky-900/40 border border-emerald-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-emerald-300 uppercase tracking-wide">
                  Resumen de tu Cálculo CADIS:
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Con la cuota calculada de <strong className="text-white">${cuotaMensual.toFixed(2)} USD/mes</strong>, el costo diario es de apenas <strong>${(cuotaMensual / 30).toFixed(2)} USD/día</strong>. Representa menos que un almuerzo promedio en Santa Cruz, asegurando un patrimonio inmobiliario de alta plusvalía en el Proyecto Río Bonito.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Summary & Lead Capture Form Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Result Summary Card */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  RESUMEN DE FINANCIAMIENTO DIRECTO
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Sin Bancos
                </span>
              </div>

              {/* Main Big Quota */}
              <div className="py-5 text-center bg-slate-950/60 rounded-xl my-4 border border-slate-700/60">
                <span className="text-xs font-bold text-slate-400 uppercase">Cuota Mensual del Saldo</span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 my-1">
                  ${cuotaMensual.toFixed(2)}
                  <span className="text-base font-bold text-slate-400 ml-1.5">USD</span>
                </div>
                <p className="text-xs text-slate-300">
                  a un plazo de <strong className="text-white">{plazoAnios} años ({plazoMeses} cuotas fijas)</strong>
                </p>
              </div>

              {/* Line item breakdown */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-700/50">
                  <span>Precio Total del Terreno:</span>
                  <span className="font-bold text-white">${precioTerreno.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/50">
                  <span>Cuota Inicial (30%):</span>
                  <span className="font-bold text-emerald-400">${cuotaInicialMonto.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/50">
                  <span>Modalidad de Cuota Inicial:</span>
                  <span className="font-bold text-slate-200">
                    {modalidadInicial === 'diferido_3m' 
                      ? `3 pagos de $${cuotaInicialMensual.toFixed(2)} USD/mes` 
                      : 'Contado ($' + cuotaInicialMonto.toLocaleString() + ' USD)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/50">
                  <span>Saldo a Financiar (70%):</span>
                  <span className="font-bold text-white">${saldoRestante.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Requisitos:</span>
                  <span className="font-bold text-emerald-400">Solo C.I. (Sin buró crediticio)</span>
                </div>
              </div>
            </div>

            {/* Action / Lead Form */}
            <div className="bg-slate-800/95 rounded-2xl p-6 border border-slate-700 shadow-xl">
              {!formSubmitted ? (
                <form onSubmit={handleSubmitLead} className="space-y-4" id="credit-simulation-lead-form">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-400" />
                      5. Reserva o Envía tu Simulación
                    </h3>
                    <p className="text-xs text-slate-300">
                      Un asesor de CADIS te contactará para formalizar tu reserva y enviarte el contrato y plano del lote.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="lead-name" className="block text-xs font-bold text-slate-300 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      aria-invalid={submitAttempted && !clienteNombre.trim()}
                      placeholder="Ej: Marcelo Saucedo"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-sm focus:outline-none placeholder-slate-500 ${
                        submitAttempted && !clienteNombre.trim() ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-emerald-400'
                      }`}
                    />
                    {submitAttempted && !clienteNombre.trim() && (
                      <p className="text-[11px] font-semibold text-red-400 mt-1">Ingresa tu nombre completo.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-300 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      aria-invalid={submitAttempted && !telefono.trim()}
                      placeholder="Ej: +591 71234567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-sm focus:outline-none placeholder-slate-500 ${
                        submitAttempted && !telefono.trim() ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-emerald-400'
                      }`}
                    />
                    {submitAttempted && !telefono.trim() && (
                      <p className="text-[11px] font-semibold text-red-400 mt-1">Ingresa tu teléfono o WhatsApp.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-bold text-slate-300 mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:border-emerald-400 focus:outline-none placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-notes" className="block text-xs font-bold text-slate-300 mb-1">
                      Comentario o Pregunta (Opcional)
                    </label>
                    <input
                      id="lead-notes"
                      type="text"
                      placeholder="Ej: Quisiera visitar el terreno el sábado"
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:border-emerald-400 focus:outline-none placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    id="submit-simulation-lead-btn"
                  >
                    {submitting ? (
                      <span>Procesando...</span>
                    ) : (
                      <>
                        <span>Guardar y Enviar Simulación</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Tus datos se almacenan de forma segura y solo se usan para que un asesor de CADIS te contacte por esta simulación.
                  </p>
                </form>
              ) : (
                <div className="space-y-4 text-center py-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-white">¡Simulación Registrada Exitosamente!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Estimado/a <strong>{clienteNombre}</strong>, tu propuesta ha sido enviada al equipo comercial de CADIS y registrada en nuestro sistema.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-left text-xs space-y-1">
                    <p><strong className="text-slate-400">Terreno:</strong> ${precioTerreno.toLocaleString()} USD</p>
                    <p><strong className="text-slate-400">Cuota Inicial:</strong> ${cuotaInicialMonto.toLocaleString()} USD ({modalidadInicial === 'diferido_3m' ? 'Diferida en 3 meses' : 'Contado'})</p>
                    <p><strong className="text-slate-400">Cuota Mensual:</strong> ${cuotaMensual.toFixed(2)} USD/mes a {plazoAnios} años</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={getWhatsAppMessageUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-slate-950" />
                      <span>Abrir WhatsApp con esta Simulación</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setSubmitAttempted(false);
                        setClienteNombre('');
                        setTelefono('');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer py-1"
                    >
                      Calcular otra simulación
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
