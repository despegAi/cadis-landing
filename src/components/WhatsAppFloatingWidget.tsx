import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  CheckCheck, 
  ChevronRight, 
  ShieldCheck,
  Bot,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  HelpCircle,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Property, ChatInteractionLog } from '../types';
import { CADIS_WHATSAPP_NUMBER, CADIS_WHATSAPP_DISPLAY } from '../config/contact';
import { SiteImage } from './SiteImage';

export type UserIntentType =
  | 'lot_inquiry'
  | 'credit_simulation'
  | 'weekend_tour'
  | 'vendor_agent'
  | 'general_inquiry';

// Intents that go through the 2-question qualifying flow before the WhatsApp handoff
const QUALIFYING_INTENTS: UserIntentType[] = ['lot_inquiry', 'credit_simulation', 'weekend_tour'];

export interface WhatsAppFloatingWidgetProps {
  selectedLotNumber?: string;
  selectedLotPrice?: number;
  selectedProperty?: Property | null;
  defaultIntent?: UserIntentType;
  onLogChatInteraction: (data: Omit<ChatInteractionLog, 'id' | 'fecha' | 'estado'>) => void;
}

interface QuickOption {
  id: string;
  title: string;
  text: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isAutomated?: boolean;
}

export const WhatsAppFloatingWidget: React.FC<WhatsAppFloatingWidgetProps> = ({
  selectedLotNumber = 'Lote RB-01',
  selectedLotPrice = 9000,
  selectedProperty = null,
  defaultIntent,
  onLogChatInteraction
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIntent, setActiveIntent] = useState<UserIntentType>(
    defaultIntent || (selectedLotNumber ? 'lot_inquiry' : 'general_inquiry')
  );
  const [customMessage, setCustomMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sentActionNotice, setSentActionNotice] = useState<string | null>(null);

  // Guided qualifying flow (NOT AI): 0 = idle, 1 = asking down-payment readiness, 2 = asking bank-credit status
  const [qualifierStep, setQualifierStep] = useState<0 | 1 | 2>(0);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [presupuestoConfirmado, setPresupuestoConfirmado] = useState<'si' | 'diferido_3m' | 'no_seguro' | null>(null);
  const [tieneCreditoPropio, setTieneCreditoPropio] = useState<'si' | 'no' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Single official CADIS WhatsApp number (Santa Cruz, Bolivia) — see src/config/contact.ts
  const WHATSAPP_PHONE = CADIS_WHATSAPP_NUMBER;
  const WHATSAPP_PHONE_DISPLAY = CADIS_WHATSAPP_DISPLAY;

  // Keep intent in sync when selectedLotNumber changes
  useEffect(() => {
    if (selectedLotNumber) {
      setActiveIntent('lot_inquiry');
    }
  }, [selectedLotNumber, selectedLotPrice]);

  // Global event listener so any card or button can trigger the widget with specific intent
  useEffect(() => {
    const handleCustomOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ intent?: UserIntentType }>;
      if (customEvent.detail?.intent) {
        setActiveIntent(customEvent.detail.intent);
      }
      setIsOpen(true);
    };

    window.addEventListener('cadis:open_whatsapp', handleCustomOpen);
    return () => {
      window.removeEventListener('cadis:open_whatsapp', handleCustomOpen);
    };
  }, []);

  // Predefined Automated Welcome Messages by Intent
  const getPredefinedWelcomeMessage = (intent: UserIntentType): string => {
    const lotName = selectedProperty?.loteNumero || selectedLotNumber || 'Lote RB-01';
    const price = selectedProperty?.precio || selectedLotPrice || 9000;
    const initialDeposit = (price * 0.3).toLocaleString();
    const deferredMonthly = (price * 0.3 / 3).toFixed(0);

    switch (intent) {
      case 'lot_inquiry':
        if (selectedProperty?.estado === 'reservado') {
          return `¡Hola! 👋 Detectamos tu interés en el **${lotName}** ($${price.toLocaleString()} USD). Actualmente tiene una reserva activa, pero podemos registrarte con prioridad en la lista de espera o mostrarte terrenos colindantes similares. ¿Deseas recibir la lista?`;
        }
        if (selectedProperty?.estado === 'vendido') {
          return `¡Hola! 👋 El **${lotName}** ya fue titulado y vendido, pero contamos con lotes vecinos de dimensiones idénticas en Río Bonito listos para entrega. ¿Te gustaría consultar las opciones disponibles?`;
        }
        return `¡Hola! 👋 Veo que estás consultando sobre el **${lotName}** ($${price.toLocaleString()} USD en Proyecto Río Bonito). Te tengo listos los planos, medidas (${selectedProperty?.metraje || 500} m²) y el plan de cuota inicial en 3 meses ($${deferredMonthly} USD/mes). ¿Te gustaría agendar una visita o recibir la información oficial?`;

      case 'credit_simulation':
        return `¡Hola! 💰 Has ingresado al canal de **Crédito Directo CADIS**. Te financiamos tu terreno campestre en Limoncito sin banco, sin garantes y con entrega inmediata pagando solo el 30% inicial en 3 cuotas. ¿Qué plazo de financiamiento (2 o 3 años) se acomoda a ti?`;

      case 'weekend_tour':
        return `¡Hola! 🚐 Organizamos **visitas guiadas gratuitas todos los Sábados y Domingos** rumbo a Limoncito (Proyecto Río Bonito). Contamos con transporte ida y vuelta y refrigerio para ti y tu familia. ¿Para qué día te gustaría asegurar cupos?`;

      case 'vendor_agent':
        return `¡Hola! 💼 Te damos la bienvenida al canal de **Asesores y Vendedores Independientes de CADIS**. Ofrecemos altas comisiones (hasta 8% por lote), material publicitario y capacitaciones continuas. ¿En qué ciudad resides para enviarte el kit comercial?`;

      case 'general_inquiry':
      default:
        return `¡Hola! 👋 Te damos la bienvenida a **CADIS Servicios Inmobiliarios**. Estamos listos para asesorarte en la adquisición de tu Mini Quinta campestre en Limoncito (Proyecto Río Bonito). ¿En qué podemos orientarte hoy?`;
    }
  };

  // Predefined Quick Response Prompts by Intent
  const currentQuickOptions = useMemo<QuickOption[]>(() => {
    const lotName = selectedProperty?.loteNumero || selectedLotNumber || 'Lote RB-01';
    const price = selectedProperty?.precio || selectedLotPrice || 9000;
    const initial3m = (price * 0.3 / 3).toFixed(0);

    switch (activeIntent) {
      case 'lot_inquiry':
        return [
          {
            id: 'lot-1',
            title: `Plan de pago inicial 3 meses ($${initial3m} USD/m)`,
            text: `¡Hola CADIS! Deseo información para pagar la cuota inicial diferida en 3 meses para el ${lotName} ($${price.toLocaleString()} USD).`
          },
          {
            id: 'lot-2',
            title: `Agendar visita presencial para ${lotName}`,
            text: `Hola, deseo agendar una visita guiada para ir a ver presencialmente el ${lotName} en Limoncito con mi familia este fin de semana.`
          },
          {
            id: 'lot-3',
            title: `Consultar cuota mensual a 3 años`,
            text: `Buenas tardes, quisiera saber cuál sería la cuota mensual a 3 años financiada para el saldo del ${lotName}.`
          },
          {
            id: 'lot-4',
            title: `Ubicación GPS exacta y plano`,
            text: `Hola, me gustaría recibir la ubicación en Google Maps y el plano de delimitación del ${lotName}.`
          }
        ];

      case 'credit_simulation':
        return [
          {
            id: 'cred-1',
            title: 'Pagar 30% inicial en 3 meses',
            text: '¡Hola CADIS! Deseo información sobre cómo acceder al crédito directo pagando el 30% de cuota inicial en 3 meses sin intereses.'
          },
          {
            id: 'cred-2',
            title: 'Tabla de cuotas a 2 y 3 años',
            text: 'Hola, quisiera conocer la tabla de cuotas mensuales para financiar un terreno a 2 o 3 años sin intermediación bancaria.'
          },
          {
            id: 'cred-3',
            title: 'Requisitos para extranjeros / independientes',
            text: 'Buenas tardes, resido en el extranjero o trabajo independiente. ¿Qué documentos necesito para calificar al crédito directo?'
          }
        ];

      case 'weekend_tour':
        return [
          {
            id: 'tour-1',
            title: 'Reservar cupos para este Sábado',
            text: '¡Hola CADIS! Quiero reservar 2 cupos para la visita guiada a Limoncito de este Sábado en la mañana.'
          },
          {
            id: 'tour-2',
            title: 'Reservar cupos para este Domingo',
            text: '¡Hola CADIS! Deseo reservar cupos para la salida del Domingo con mi familia a conocer el Proyecto Río Bonito.'
          },
          {
            id: 'tour-3',
            title: 'Punto de partida y horarios',
            text: 'Hola, ¿a qué hora y desde qué lugar de Santa Cruz de la Sierra sale el transporte para la visita guiada?'
          }
        ];

      case 'vendor_agent':
        return [
          {
            id: 'vend-1',
            title: 'Conocer tabla de comisiones (hasta 8%)',
            text: '¡Hola! Me gustaría conocer el esquema de comisiones y beneficios para asesores inmobiliarios independientes de CADIS.'
          },
          {
            id: 'vend-2',
            title: 'Solicitar reunión informativa',
            text: 'Hola, quisiera agendar una breve reunión para conocer el proceso de incorporación de nuevos asesores comerciales.'
          },
          {
            id: 'vend-3',
            title: 'Material digital y capacitaciones',
            text: 'Buenas tardes, deseo saber qué material publicitario y apoyo entrega CADIS para vender los terrenos de Río Bonito.'
          }
        ];

      case 'general_inquiry':
      default:
        return [
          {
            id: 'gen-1',
            title: 'Mini Quintas de $9,000 USD en Limoncito',
            text: '¡Hola CADIS! Me gustaría recibir información detallada sobre las Mini Quintas de $9,000 USD en el Proyecto Río Bonito.'
          },
          {
            id: 'gen-2',
            title: 'Servicios de agua, luz y accesos',
            text: 'Hola, quisiera consultar sobre el estado de los servicios básicos (agua, electricidad y caminos) en Río Bonito.'
          },
          {
            id: 'gen-3',
            title: 'Hablar con un asesor comercial ahora',
            text: 'Hola, necesito que un asesor de ventas de CADIS me atienda directamente por WhatsApp para resolver mis consultas.'
          }
        ];
    }
  }, [activeIntent, selectedProperty, selectedLotNumber, selectedLotPrice]);

  // Automated trigger: whenever widget opens or activeIntent changes, trigger the automated response
  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      // Reset any in-progress qualifying flow when the intent changes
      setQualifierStep(0);
      setPendingMessage(null);
      setPresupuestoConfirmado(null);
      setTieneCreditoPropio(null);

      const timer = setTimeout(() => {
        setIsTyping(false);
        const welcomeText = getPredefinedWelcomeMessage(activeIntent);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages([
          {
            id: `bot-welcome-${Date.now()}`,
            sender: 'bot',
            text: welcomeText,
            time: now,
            isAutomated: true
          }
        ]);
      }, 420);

      return () => clearTimeout(timer);
    }
  }, [isOpen, activeIntent, selectedLotNumber, selectedLotPrice]);

  // Scroll to bottom when messages or typing updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, isOpen]);

  // Builds the final WhatsApp message (with qualifying answers, if any), logs the interaction
  // for the admin mini-CRM, and opens the WhatsApp handoff link.
  const dispatchToWhatsApp = (
    rawMessage: string,
    presupuesto?: 'si' | 'diferido_3m' | 'no_seguro' | null,
    creditoPropio?: 'si' | 'no' | null
  ) => {
    // Show automated dispatch notice
    setSentActionNotice('Redirigiendo a WhatsApp oficial con tu asesor asignado...');
    setTimeout(() => setSentActionNotice(null), 3500);

    // Format WhatsApp text with context prefix
    const contextTag = activeIntent === 'lot_inquiry'
      ? `[CADIS WEB - ${selectedProperty?.loteNumero || selectedLotNumber}]`
      : activeIntent === 'credit_simulation'
      ? '[CADIS WEB - CRÉDITO DIRECTO]'
      : activeIntent === 'weekend_tour'
      ? '[CADIS WEB - VISITA GUIADA]'
      : activeIntent === 'vendor_agent'
      ? '[CADIS WEB - ASESOR INMOBILIARIO]'
      : '[CADIS WEB - CONSULTA]';

    const qualifierSuffix = presupuesto || creditoPropio
      ? ` | Cuota inicial: ${
          presupuesto === 'si' ? 'lista al contado' : presupuesto === 'diferido_3m' ? 'prefiere pagarla en 3 meses' : 'no está seguro/a'
        } | Crédito bancario propio: ${creditoPropio === 'si' ? 'Sí' : 'No, busca el Crédito Directo CADIS'}`
      : '';

    const fullMessage = `${contextTag} ${rawMessage}${qualifierSuffix}`;
    const encoded = encodeURIComponent(fullMessage);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;

    onLogChatInteraction({
      intent: activeIntent,
      loteNumero: activeIntent === 'lot_inquiry' ? (selectedProperty?.loteNumero || selectedLotNumber) : undefined,
      presupuestoConfirmado: presupuesto || undefined,
      tieneCreditoPropio: creditoPropio || undefined,
      resumenMensaje: rawMessage
    });

    setTimeout(() => {
      try {
        const opened = window.open(url, '_blank', 'noopener,noreferrer');
        if (!opened) {
          window.location.href = url;
        }
      } catch {
        window.location.href = url;
      }
    }, 400);
  };

  // Format and dispatch WhatsApp Message — routes through a 2-question guided
  // qualifying flow first for lot/credit/tour intents (no AI, just predefined chips).
  const handleSend = (textToSend?: string) => {
    const rawMessage = textToSend || customMessage.trim();
    if (!rawMessage) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to local chat
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawMessage,
      time: now
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setCustomMessage('');

    if (QUALIFYING_INTENTS.includes(activeIntent) && qualifierStep === 0) {
      setPendingMessage(rawMessage);
      setQualifierStep(1);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          {
            id: `bot-qualifier-1-${Date.now()}`,
            sender: 'bot',
            text: '¿Ya tienes lista tu cuota inicial del 30%, o prefieres pagarla en 3 meses?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAutomated: true
          }
        ]);
      }, 500);
      return;
    }

    dispatchToWhatsApp(rawMessage, presupuestoConfirmado, tieneCreditoPropio);
  };

  // Step 1 of the qualifying flow: down-payment readiness
  const handleQualifierStep1 = (value: 'si' | 'diferido_3m' | 'no_seguro', label: string) => {
    setPresupuestoConfirmado(value);
    setChatMessages((prev) => [
      ...prev,
      { id: `user-q1-${Date.now()}`, sender: 'user', text: label, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setQualifierStep(2);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-qualifier-2-${Date.now()}`,
          sender: 'bot',
          text: '¿Cuentas con crédito bancario propio, o buscas el Crédito Directo de CADIS?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAutomated: true
        }
      ]);
    }, 500);
  };

  // Step 2 of the qualifying flow: bank credit status — then dispatches to WhatsApp
  const handleQualifierStep2 = (value: 'si' | 'no', label: string) => {
    setTieneCreditoPropio(value);
    setChatMessages((prev) => [
      ...prev,
      { id: `user-q2-${Date.now()}`, sender: 'user', text: label, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const finalMessage = pendingMessage || '';
    dispatchToWhatsApp(finalMessage, presupuestoConfirmado, value);
    setQualifierStep(0);
    setPendingMessage(null);
  };

  const intentTabs: Array<{
    id: UserIntentType;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'lot_inquiry',
      label: selectedProperty?.loteNumero || selectedLotNumber || 'Lote',
      icon: <MapPin className="w-3 h-3" />
    },
    {
      id: 'credit_simulation',
      label: 'Crédito 30%',
      icon: <DollarSign className="w-3 h-3" />
    },
    {
      id: 'weekend_tour',
      label: 'Visita Sáb/Dom',
      icon: <Calendar className="w-3 h-3" />
    },
    {
      id: 'vendor_agent',
      label: 'Ser Asesor',
      icon: <Briefcase className="w-3 h-3" />
    },
    {
      id: 'general_inquiry',
      label: 'General',
      icon: <HelpCircle className="w-3 h-3" />
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* WhatsApp Chat Popover Window */}
      {isOpen && (
        <div 
          className="mb-4 w-[calc(100vw-2rem)] max-w-[390px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 flex flex-col"
          style={{ maxHeight: 'min(640px, 86vh)' }}
        >
          {/* Header styled like WhatsApp Business */}
          <div className="bg-[#075E54] text-white p-3.5 sm:p-4 relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Agent Avatar with Verified Badge */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-emerald-800 border-2 border-white flex items-center justify-center font-black text-sm text-white shadow-sm overflow-hidden">
                    <SiteImage
                      slot="asesoraFoto"
                      alt="Asesora CADIS"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm leading-tight text-white">CADIS Inmobiliaria</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    En línea • Proyecto Río Bonito
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar chat de WhatsApp"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Automated Intent Bar */}
            <div className="mt-3 pt-2 border-t border-emerald-600/60 flex items-center justify-between text-[11px] text-emerald-100">
              <div className="flex items-center gap-1.5 truncate">
                <Bot className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="font-semibold truncate">
                  Asistente Guiado CADIS
                </span>
              </div>
              <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full border border-emerald-500/40 shrink-0 font-bold">
                Flujo Guiado
              </span>
            </div>
          </div>

          {/* Context Intent Selector Bar */}
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1.5 min-w-max">
              <span className="text-[9px] uppercase font-black text-slate-500 mr-1">
                Contexto:
              </span>
              {intentTabs.map((tab) => {
                const isActive = activeIntent === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveIntent(tab.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Context Preview Pill */}
          {activeIntent === 'lot_inquiry' && (
            <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-900 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-extrabold truncate">
                  {selectedProperty?.loteNumero || selectedLotNumber}
                </span>
                <span className="text-slate-500 text-[10px]">
                  • ${selectedProperty?.precio?.toLocaleString() || selectedLotPrice?.toLocaleString()} USD
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                {selectedProperty?.estado || 'Disponible'}
              </span>
            </div>
          )}

          {/* Chat Body (WhatsApp chat mockup) */}
          <div className="bg-[#E5DDD5] p-3.5 overflow-y-auto space-y-3 relative flex-1 min-h-[220px]">
            {/* Background subtle pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Simulated Typing Indicator */}
            {isTyping && (
              <div className="relative z-10 max-w-[70%] bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs border border-slate-200 text-slate-600 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  Escribiendo...
                </span>
              </div>
            )}

            {/* Chat Messages */}
            {!isTyping && chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`relative z-10 max-w-[88%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#DCF8C6] rounded-2xl rounded-tr-xs text-slate-900'
                    : 'bg-white rounded-2xl rounded-tl-xs text-slate-800 border border-slate-200'
                } p-3 shadow-xs space-y-1.5 animate-in fade-in duration-200`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1">
                    <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
                      <Bot className="w-3 h-3 text-emerald-600" />
                      Asistente CADIS
                    </span>
                    {msg.isAutomated && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Mensaje Predefinido
                      </span>
                    )}
                  </div>
                )}

                <div 
                  className="text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />

                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium pt-0.5">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                  ) : (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
              </div>
            ))}

            {/* Action dispatch notification toast */}
            {sentActionNotice && (
              <div className="relative z-10 p-2.5 rounded-xl bg-emerald-900 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="leading-tight">{sentActionNotice}</span>
              </div>
            )}

            {/* Guided qualifying questions (step 1: down-payment readiness) */}
            {!isTyping && qualifierStep === 1 && (
              <div className="relative z-10 space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 px-1">
                  Elige una opción:
                </span>
                <div className="space-y-1.5">
                  <button type="button" onClick={() => handleQualifierStep1('si', 'Ya tengo lista mi cuota inicial del 30%')} className="w-full text-left p-2.5 rounded-xl bg-white/95 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer">
                    Ya la tengo lista
                  </button>
                  <button type="button" onClick={() => handleQualifierStep1('diferido_3m', 'Prefiero pagar la cuota inicial en 3 meses')} className="w-full text-left p-2.5 rounded-xl bg-white/95 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer">
                    Prefiero pagarla en 3 meses
                  </button>
                  <button type="button" onClick={() => handleQualifierStep1('no_seguro', 'Todavía no estoy seguro/a')} className="w-full text-left p-2.5 rounded-xl bg-white/95 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer">
                    Aún no estoy seguro/a
                  </button>
                </div>
              </div>
            )}

            {/* Guided qualifying questions (step 2: bank credit status) */}
            {!isTyping && qualifierStep === 2 && (
              <div className="relative z-10 space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 px-1">
                  Elige una opción:
                </span>
                <div className="space-y-1.5">
                  <button type="button" onClick={() => handleQualifierStep2('si', 'Sí, tengo crédito bancario propio')} className="w-full text-left p-2.5 rounded-xl bg-white/95 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer">
                    Sí, tengo crédito bancario propio
                  </button>
                  <button type="button" onClick={() => handleQualifierStep2('no', 'No, busco el Crédito Directo de CADIS')} className="w-full text-left p-2.5 rounded-xl bg-white/95 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer">
                    No, busco el Crédito Directo CADIS
                  </button>
                </div>
              </div>
            )}

            {/* Predefined Quick Consultation Buttons based on detected intent */}
            {!isTyping && qualifierStep === 0 && (
              <div className="relative z-10 space-y-2 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-600">
                    Respuestas rápidas sugeridas:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 300);
                    }}
                    className="text-[10px] text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
                    title="Actualizar opciones"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Actualizar</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {currentQuickOptions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleSend(q.text)}
                      className="w-full text-left p-2.5 rounded-xl bg-white/95 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-800 text-xs font-semibold flex items-center justify-between group transition-all shadow-2xs cursor-pointer"
                    >
                      <span className="line-clamp-1">{q.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Footer */}
          <div className="p-2.5 sm:p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
            <label htmlFor="whatsapp-widget-message" className="sr-only">Mensaje de WhatsApp</label>
            <input
              id="whatsapp-widget-message"
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                activeIntent === 'lot_inquiry'
                  ? `Preguntar sobre ${selectedProperty?.loteNumero || selectedLotNumber}...`
                  : activeIntent === 'credit_simulation'
                  ? 'Consultar sobre tu plan de cuotas...'
                  : activeIntent === 'weekend_tour'
                  ? 'Consultar cupos para la visita...'
                  : 'Escribe tu mensaje por WhatsApp...'
              }
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:bg-white text-slate-800"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="p-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Abrir en WhatsApp oficial"
              aria-label="Enviar mensaje a WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Support footer info */}
          <div className="bg-slate-50 px-3 py-2 text-[10px] text-center text-slate-500 border-t border-slate-100 shrink-0">
            Atención oficial directa al <strong className="text-slate-700">{WHATSAPP_PHONE_DISPLAY}</strong>
          </div>
        </div>
      )}

      {/* Main Floating WhatsApp Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer group border-2 border-white relative"
        aria-label="Abrir chat interactivo de WhatsApp"
        id="btn-floating-whatsapp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
        </div>
        <div className="hidden sm:block text-left pr-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-950 leading-none">
            {selectedLotNumber ? `Lote: ${selectedLotNumber}` : '¿Consultas?'}
          </p>
          <p className="text-sm font-black text-white leading-tight">
            Chat WhatsApp
          </p>
        </div>
      </button>
    </div>
  );
};
