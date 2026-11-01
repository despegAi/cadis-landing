import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  User, 
  Building2, 
  ShieldCheck,
  CreditCard,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ClientPaymentPlan, PaymentScheduleQuota, AccountingEntry, UserRole } from '../types';
import { generatePaymentReceiptPdf } from '../utils/paymentReceiptPdfGenerator';

interface AdminPaymentScheduleTabProps {
  plans: ClientPaymentPlan[];
  userRole: UserRole;
  currentUsername: string;
  onUpdatePlan: (updatedPlan: ClientPaymentPlan) => void;
  onAddPlan: (newPlan: ClientPaymentPlan) => void;
  onAddAccountingEntry: (entry: AccountingEntry) => void;
}

export const AdminPaymentScheduleTab: React.FC<AdminPaymentScheduleTabProps> = ({
  plans,
  userRole,
  currentUsername,
  onUpdatePlan,
  onAddPlan,
  onAddAccountingEntry
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Payment Registration Modal State
  const [selectedQuota, setSelectedQuota] = useState<{ plan: ClientPaymentPlan; quota: PaymentScheduleQuota } | null>(null);
  const [payMetodo, setPayMetodo] = useState<'transferencia' | 'efectivo' | 'qr' | 'deposito'>('transferencia');
  const [payComprobante, setPayComprobante] = useState('');

  // Printable Receipt Preview Modal State
  const [printableReceipt, setPrintableReceipt] = useState<{ plan: ClientPaymentPlan; quota: PaymentScheduleQuota } | null>(null);

  // New Plan Creation Modal State
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newClienteNombre, setNewClienteNombre] = useState('');
  const [newCI, setNewCI] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLoteNumero, setNewLoteNumero] = useState('Lote RB-01');
  const [newPrecioTotal, setNewPrecioTotal] = useState<number>(8000);
  const [newCuotaInicial, setNewCuotaInicial] = useState<number>(2000);
  const [newPlazoAnios, setNewPlazoAnios] = useState<number>(5);

  const canEdit = userRole === 'admin' || userRole === 'developer' || userRole === 'editor';

  // Active plan selection
  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  // Filter plans list by client name or lot number
  const filteredPlans = plans.filter((p) => 
    p.clienteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.loteNumero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ci.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to handle marking quota as paid
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuota) return;

    const { plan, quota } = selectedQuota;
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedCronograma = plan.cronogramaCuotas.map((q) => {
      if (q.numeroCuota === quota.numeroCuota) {
        return {
          ...q,
          estado: 'pagado' as const,
          fechaPagoReal: todayStr,
          comprobante: payComprobante.trim() || `REC-${Date.now().toString().slice(-6)}`,
          metodoPago: payMetodo,
          registradoPor: currentUsername
        };
      }
      return q;
    });

    const updatedPlan: ClientPaymentPlan = {
      ...plan,
      cronogramaCuotas: updatedCronograma
    };

    onUpdatePlan(updatedPlan);

    // Automatically register matching income entry in Cash Ledger ("Control de Ingresos y Egresos")
    const newAccountingEntry: AccountingEntry = {
      id: `acc-cuota-${Date.now()}`,
      fecha: todayStr,
      tipo: 'ingreso_cuota_mensual',
      concepto: `Cobro Cuota N° ${quota.numeroCuota} - ${plan.loteNumero} (${plan.clienteNombre})`,
      loteReferencia: plan.loteNumero,
      clienteReferencia: plan.clienteNombre,
      montoUSD: quota.montoCuotaUSD,
      metodoPago: payMetodo,
      comprobante: payComprobante.trim() || `REC-${Date.now().toString().slice(-6)}`,
      registradoPor: currentUsername,
      origen: 'manual'
    };

    onAddAccountingEntry(newAccountingEntry);

    // Open receipt preview
    setPrintableReceipt({
      plan: updatedPlan,
      quota: updatedCronograma.find(q => q.numeroCuota === quota.numeroCuota)!
    });

    setSelectedQuota(null);
    setPayComprobante('');
  };

  // Helper to create a new client payment plan
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClienteNombre.trim() || !newCI.trim()) return;

    const saldoFinanciar = Math.max(0, newPrecioTotal - newCuotaInicial);
    const tasaAnual = 0.10;
    const tasaMensual = tasaAnual / 12;
    const totalMeses = newPlazoAnios * 12;

    const factorInteres = Math.pow(1 + tasaMensual, totalMeses);
    const cuotaMensualCalculada = saldoFinanciar > 0 
      ? (saldoFinanciar * (tasaMensual * factorInteres)) / (factorInteres - 1)
      : 0;

    // Generate monthly quota schedule table
    let saldoCorrido = saldoFinanciar;
    const cronograma: PaymentScheduleQuota[] = [];
    const fechaInicio = new Date();

    for (let i = 1; i <= totalMeses; i++) {
      const fechaVenc = new Date(fechaInicio);
      fechaVenc.setMonth(fechaVenc.getMonth() + i);
      const fechaStr = fechaVenc.toISOString().split('T')[0];

      const interesCuota = saldoCorrido * tasaMensual;
      const capitalCuota = cuotaMensualCalculada - interesCuota;
      saldoCorrido = Math.max(0, saldoCorrido - capitalCuota);

      cronograma.push({
        numeroCuota: i,
        fechaVencimiento: fechaStr,
        montoCuotaUSD: Number(cuotaMensualCalculada.toFixed(2)),
        interesUSD: Number(interesCuota.toFixed(2)),
        capitalUSD: Number(capitalCuota.toFixed(2)),
        saldoRestanteUSD: Number(saldoCorrido.toFixed(2)),
        estado: i === 1 && newCuotaInicial > 0 ? 'pendiente' : 'pendiente'
      });
    }

    const createdPlan: ClientPaymentPlan = {
      id: `plan-${Date.now()}`,
      clienteNombre: newClienteNombre.trim(),
      ci: newCI.trim(),
      telefono: newTelefono.trim(),
      email: newEmail.trim() || undefined,
      loteNumero: newLoteNumero,
      precioTotalUSD: newPrecioTotal,
      cuotaInicialUSD: newCuotaInicial,
      saldoFinanciarUSD: saldoFinanciar,
      plazoAnios: newPlazoAnios,
      tasaInteresAnual: 10,
      cuotaMensualUSD: Number(cuotaMensualCalculada.toFixed(2)),
      fechaInicioContractual: new Date().toISOString().split('T')[0],
      cronogramaCuotas: cronograma
    };

    onAddPlan(createdPlan);
    setSelectedPlanId(createdPlan.id);
    setShowNewPlanModal(false);

    // Reset form
    setNewClienteNombre('');
    setNewCI('');
    setNewTelefono('');
    setNewEmail('');
  };

  // Stats for active plan
  const totalCuotas = activePlan?.cronogramaCuotas.length || 0;
  const cuotasPagadas = activePlan?.cronogramaCuotas.filter(q => q.estado === 'pagado').length || 0;
  const cuotasPendientes = totalCuotas - cuotasPagadas;
  const totalRecaudado = activePlan?.cronogramaCuotas.filter(q => q.estado === 'pagado').reduce((acc, q) => acc + q.montoCuotaUSD, 0) || 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-teal-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#009698]/20 text-teal-300 text-xs font-bold border border-teal-500/40 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#009698]" />
            <span>Módulo de Control Financiero CADIS</span>
          </div>
          <h2 className="text-2xl font-black">
            Plan de Pagos y Centralización de Cuotas
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Gestión de cronogramas de amortización mensual (1 a 8 años), registro de cuotas canceladas y emisión de recibos oficiales en PDF.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#009698] hover:bg-teal-600 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Plan de Adjudicación</span>
          </button>
        )}
      </div>

      {/* Main Grid: Plan List & Schedule Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Client Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Clientes & Lotes Financiados ({plans.length})
            </h3>
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente, CI o lote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#009698]"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPlans.map((plan) => {
              const isSelected = plan.id === activePlan?.id;
              const pagadas = plan.cronogramaCuotas.filter(q => q.estado === 'pagado').length;
              const total = plan.cronogramaCuotas.length;
              const pct = Math.round((pagadas / total) * 100);

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/80 border-[#009698] shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{plan.clienteNombre}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white font-mono">
                      {plan.loteNumero}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>CI: {plan.ci}</span>
                    <span className="font-bold text-[#009698]">${plan.cuotaMensualUSD.toFixed(2)}/mes</span>
                  </div>

                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Progreso de Pagos:</span>
                      <span>{pagadas}/{total} cuotas ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009698] transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Plan Cronograma Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          {activePlan ? (
            <>
              {/* Client & Lot Summary Bar */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{activePlan.clienteNombre}</h3>
                    <span className="px-2.5 py-0.5 rounded bg-[#009698] text-white text-xs font-black">
                      {activePlan.loteNumero}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    CI: <strong>{activePlan.ci}</strong> • Teléfono: <strong>{activePlan.telefono}</strong> • Plazo: <strong>{activePlan.plazoAnios} Años ({activePlan.plazoAnios * 12} cuotas al 10% anual)</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 sm:border-l border-slate-700 pt-2 sm:pt-0 sm:pl-4">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Precio Lote:</span>
                    <strong className="text-white">${activePlan.precioTotalUSD.toLocaleString()} USD</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cuota Mensual:</span>
                    <strong className="text-teal-400 text-sm font-black">${activePlan.cuotaMensualUSD.toFixed(2)} USD</strong>
                  </div>
                </div>
              </div>

              {/* Progress & Financial Overview Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cuotas Totales</span>
                  <strong className="text-base font-black text-slate-900">{totalCuotas} Meses</strong>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Cuotas Canceladas</span>
                  <strong className="text-base font-black text-emerald-700">{cuotasPagadas} Pagadas</strong>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Pendientes de Cobro</span>
                  <strong className="text-base font-black text-amber-700">{cuotasPendientes} Cuotas</strong>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">Total Recaudado</span>
                  <strong className="text-base font-black text-[#009698]">${totalRecaudado.toFixed(2)} USD</strong>
                </div>
              </div>

              {/* Cronograma Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#009698]" />
                    Cronograma de Amortización Mensual (10% Interés Anual)
                  </h4>
                  <span className="text-xs text-slate-500 font-semibold">Tasa fija cuota constante</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-black border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">N° Cuota</th>
                        <th className="py-2.5 px-3">Vencimiento</th>
                        <th className="py-2.5 px-3">Cuota ($)</th>
                        <th className="py-2.5 px-3">Interés ($)</th>
                        <th className="py-2.5 px-3">Capital ($)</th>
                        <th className="py-2.5 px-3">Saldo Restante</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {activePlan.cronogramaCuotas.map((q) => {
                        const isPagado = q.estado === 'pagado';

                        return (
                          <tr key={q.numeroCuota} className={isPagado ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}>
                            <td className="py-2.5 px-3 font-bold font-mono">Cuota #{q.numeroCuota}</td>
                            <td className="py-2.5 px-3">{q.fechaVencimiento}</td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900">${q.montoCuotaUSD.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-slate-500">${q.interesUSD.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-teal-700">${q.capitalUSD.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-slate-600 font-mono">${q.saldoRestanteUSD.toFixed(2)}</td>
                            <td className="py-2.5 px-3">
                              {isPagado ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  PAGADO
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  PENDIENTE
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right space-x-1">
                              {isPagado ? (
                                <>
                                  <button
                                    onClick={() => setPrintableReceipt({ plan: activePlan, quota: q })}
                                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                    title="Ver recibo imprimible"
                                  >
                                    <Printer className="w-3 h-3 text-teal-300" />
                                    <span>Recibo</span>
                                  </button>

                                  <button
                                    onClick={() => generatePaymentReceiptPdf(activePlan, q)}
                                    className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-[#009698] border border-teal-200 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                    title="Descargar PDF"
                                  >
                                    <Download className="w-3 h-3 text-[#009698]" />
                                    <span>PDF</span>
                                  </button>
                                </>
                              ) : (
                                canEdit && (
                                  <button
                                    onClick={() => setSelectedQuota({ plan: activePlan, quota: q })}
                                    className="px-2.5 py-1 rounded bg-[#009698] hover:bg-teal-600 text-white text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    <span>Registrar Pago</span>
                                  </button>
                                )
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              No hay planes de pago seleccionados. Haz clic en "Nuevo Plan de Adjudicación" para registrar uno.
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: Payment Registration Modal */}
      {selectedQuota && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#009698]" />
                Registrar Pago de Cuota #{selectedQuota.quota.numeroCuota}
              </h3>
              <button onClick={() => setSelectedQuota(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong className="text-slate-600">Cliente:</strong> {selectedQuota.plan.clienteNombre}</p>
              <p><strong className="text-slate-600">Lote:</strong> {selectedQuota.plan.loteNumero}</p>
              <p><strong className="text-slate-600">Monto de la Cuota:</strong> <span className="text-base font-black text-[#009698]">${selectedQuota.quota.montoCuotaUSD.toFixed(2)} USD</span></p>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Método de Pago *
                </label>
                <select
                  value={payMetodo}
                  onChange={(e) => setPayMetodo(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#009698]"
                >
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="efectivo">Efectivo en Caja</option>
                  <option value="qr">Pago por QR</option>
                  <option value="deposito">Depósito Bancario Directo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  N° de Comprobante / Referencia Bancaria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: TRF-BNB-998214"
                  value={payComprobante}
                  onChange={(e) => setPayComprobante(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#009698]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuota(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#009698] hover:bg-teal-600 text-white text-xs font-extrabold shadow-md cursor-pointer"
                >
                  Confirmar y Emitir Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Receipt Preview Modal */}
      {printableReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            
            {/* Printable Receipt Paper */}
            <div id="printable-receipt-area" className="p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4 text-slate-900 text-xs">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#009698] pb-3">
                <div className="flex items-center gap-2">
                  <img src="/assets/cadis_logotipo_tc.png" alt="CADIS Logo" className="h-10 w-auto" />
                  <div>
                    <h3 className="font-black text-sm text-[#009698]">CADIS BIENES RAÍCES</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Servicios Inmobiliarios • Proyecto Río Bonito</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">RECIBO DE PAGO</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">N° REC-{printableReceipt.quota.numeroCuota.toString().padStart(3, '0')}</span>
                </div>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Adjudicatario / Cliente:</span>
                  <strong className="text-slate-900">{printableReceipt.plan.clienteNombre}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">C.I. / DNI:</span>
                  <strong className="text-slate-900">{printableReceipt.plan.ci}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Lote / Inmueble:</span>
                  <strong className="text-teal-700">{printableReceipt.plan.loteNumero}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Fecha de Pago:</span>
                  <strong className="text-slate-900">{printableReceipt.quota.fechaPagoReal || new Date().toISOString().split('T')[0]}</strong>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold flex justify-between text-[10px] border-b border-slate-200">
                  <span>CONCEPTO DE PAGO</span>
                  <span>MONTO TOTAL</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">Cuota Mensual N° {printableReceipt.quota.numeroCuota} de {printableReceipt.plan.plazoAnios * 12}</p>
                    <p className="text-[10px] text-slate-500">Capital: ${printableReceipt.quota.capitalUSD.toFixed(2)} | Interés (10%): ${printableReceipt.quota.interesUSD.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500">Comprobante Ref: {printableReceipt.quota.comprobante}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#009698]">${printableReceipt.quota.montoCuotaUSD.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              {/* Footer signatures */}
              <div className="pt-8 flex justify-between text-[10px] font-bold text-slate-600 text-center">
                <div className="w-2/5 border-t border-slate-400 pt-1">
                  <span>Firma Autorizada CADIS</span>
                </div>
                <div className="w-2/5 border-t border-slate-400 pt-1">
                  <span>Firma Adjudicatario</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setPrintableReceipt(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cerrar
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-1/3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4 text-teal-300" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={() => generatePaymentReceiptPdf(printableReceipt.plan, printableReceipt.quota)}
                className="w-1/3 py-2.5 rounded-xl bg-[#009698] hover:bg-teal-600 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: New Plan Creation Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#009698]" />
                Crear Nuevo Plan de Adjudicación
              </h3>
              <button onClick={() => setShowNewPlanModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Marcelo Saucedo"
                    value={newClienteNombre}
                    onChange={(e) => setNewClienteNombre(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">C.I. / DNI *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 7891234 SC"
                    value={newCI}
                    onChange={(e) => setNewCI(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+591 71234567"
                    value={newTelefono}
                    onChange={(e) => setNewTelefono(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lote Adjudicado</label>
                  <input
                    type="text"
                    required
                    placeholder="Lote RB-01"
                    value={newLoteNumero}
                    onChange={(e) => setNewLoteNumero(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Total (USD)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={newPrecioTotal}
                    onChange={(e) => setNewPrecioTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cuota Inicial (USD)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCuotaInicial}
                    onChange={(e) => setNewCuotaInicial(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Plazo de Financiamiento (1 a 8 Años)</label>
                <select
                  value={newPlazoAnios}
                  onChange={(e) => setNewPlazoAnios(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#009698]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((yr) => (
                    <option key={yr} value={yr}>{yr} {yr === 1 ? 'Año' : 'Años'} ({yr * 12} Meses)</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#009698] hover:bg-teal-600 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Generar Cronograma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
