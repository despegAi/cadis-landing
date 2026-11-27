import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, ShieldCheck } from 'lucide-react';

// Chat "Trabaja con nosotros": habla con VictoriA (IA) en modo reclutamiento.
// Usa la misma función /api/chat que el chat de ventas, con modo 'reclutamiento'.

interface Msg {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const toHtml = (s: string) =>
  escapeHtml(s).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');

// 8 dígitos de Bolivia (6xxxxxxx o 7xxxxxxx) llevan el 591; si no, 10 a 15 dígitos.
const normalizeWhatsapp = (raw: string): string | null => {
  const d = raw.replace(/\D/g, '');
  if (/^[67]\d{7}$/.test(d)) return `591${d}`;
  return d.length >= 10 && d.length <= 15 ? d : null;
};

const store = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k) || '';
    } catch {
      return '';
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      /* sin almacenamiento: no se guarda */
    }
  }
};

const sessionId = (): string => {
  const saved = store.get('cadis_rec_sid');
  if (saved) return saved;
  const raw = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random().toString(36).slice(2)}`;
  const id = raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  store.set('cadis_rec_sid', id);
  return id;
};

const SUGERENCIAS = ['¿Cómo gano comisiones?', '¿Necesito experiencia?', 'Quiero postularme'];

export const RecruitmentChat: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 'hola',
      sender: 'bot',
      text:
        '¡Hola! Soy VictoriA, la asistente virtual (IA) de CADIS. Te cuento cómo trabajan nuestros asesores y, si te interesa, te registro para que la Lic. Verónica Alderete se comunique contigo. ¿Qué quieres saber?'
    }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [nombre, setNombre] = useState(() => store.get('cadis_rec_nombre'));
  const [whatsapp, setWhatsapp] = useState(() => store.get('cadis_rec_wa'));
  const endRef = useRef<HTMLDivElement | null>(null);

  const waOk = whatsapp.trim() === '' ? null : normalizeWhatsapp(whatsapp);
  const waMal = whatsapp.trim() !== '' && !waOk;

  useEffect(() => {
    store.set('cadis_rec_nombre', nombre);
    store.set('cadis_rec_wa', whatsapp);
  }, [nombre, whatsapp]);

  useEffect(() => {
    const box = endRef.current?.parentElement;
    if (box) box.scrollTop = box.scrollHeight;
  }, [msgs, busy]);

  const enviar = async (texto: string) => {
    const message = texto.trim();
    if (!message || busy) return;
    setInput('');
    setMsgs((p) => [...p, { id: `u-${Date.now()}`, sender: 'user', text: message }]);
    setBusy(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 40000);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId(),
          message: message.slice(0, 500),
          nombre: nombre.trim().slice(0, 60) || undefined,
          whatsapp: waOk || undefined,
          modo: 'reclutamiento'
        }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { reply?: string };
      const reply = (data.reply || '').trim();
      if (!reply) throw new Error('vacía');
      setMsgs((p) => [...p, { id: `b-${Date.now()}`, sender: 'bot', text: reply }]);
    } catch {
      setMsgs((p) => [
        ...p,
        {
          id: `e-${Date.now()}`,
          sender: 'bot',
          text: 'Ahora mismo no puedo responder desde aquí. Escríbenos por WhatsApp y te atendemos.'
        }
      ]);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden flex flex-col">
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Bot className="w-5 h-5 text-emerald-200 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-tight truncate">Trabaja con nosotros</p>
            <p className="text-xs text-emerald-100 leading-tight truncate">VictoriA · asistente virtual (IA)</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-emerald-800/80 border border-emerald-500/40 rounded-full px-2.5 py-1 shrink-0">
          Postulación abierta
        </span>
      </div>

      <div className="px-4 pt-3 pb-3 bg-emerald-50 border-b border-emerald-100 space-y-1.5">
        <p className="text-xs font-semibold text-emerald-900">Tus datos (para que podamos contactarte):</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={60}
            autoComplete="name"
            aria-label="Tu nombre"
            placeholder="Tu nombre"
            className="tap px-3 py-2 text-sm rounded-lg bg-white border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
          <input
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            maxLength={20}
            autoComplete="tel"
            aria-label="Tu WhatsApp"
            aria-invalid={waMal}
            placeholder="Tu WhatsApp"
            className={`tap px-3 py-2 text-sm rounded-lg bg-white border focus:outline-none focus:ring-2 text-slate-800 ${
              waMal ? 'border-red-400 focus:ring-red-400' : 'border-emerald-200 focus:ring-emerald-500'
            }`}
          />
        </div>
        {waMal && (
          <p className="text-xs text-red-700">Revisa tu número: 8 dígitos (ej. 71234567) o con código de país.</p>
        )}
      </div>

      <div
        className="bg-[#E5DDD5] px-4 py-3 space-y-3 overflow-y-auto h-[320px] sm:h-[360px]"
        role="log"
        aria-live="polite"
        aria-label="Conversación con VictoriA"
      >
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`max-w-[88%] rounded-2xl p-3 shadow-xs text-sm leading-relaxed ${
              m.sender === 'user'
                ? 'ml-auto bg-[#DCF8C6] text-slate-900 rounded-tr-sm'
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
            }`}
          >
            {m.sender === 'bot' && (
              <p className="text-xs font-extrabold text-emerald-800 mb-1 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                VictoriA
                <span className="ml-1 text-[11px] font-bold uppercase text-sky-700 bg-sky-50 border border-sky-200 rounded px-1.5">
                  IA
                </span>
              </p>
            )}
            <div dangerouslySetInnerHTML={{ __html: toHtml(m.text) }} />
          </div>
        ))}
        {busy && (
          <div className="max-w-[70%] bg-white rounded-2xl rounded-tl-sm p-3 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
            </span>
            VictoriA está escribiendo...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 pt-2.5 flex flex-wrap gap-1.5 bg-white border-t border-slate-100">
        {SUGERENCIAS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy}
            onClick={() => enviar(s)}
            className="tap px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 text-slate-700 cursor-pointer disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="p-3 bg-white flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          enviar(input);
        }}
      >
        <label htmlFor="recruit-chat-input" className="sr-only">
          Escribe tu mensaje para VictoriA
        </label>
        <input
          id="recruit-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={busy}
          placeholder="Escribe tu mensaje..."
          className="tap flex-1 px-3 py-2 text-sm rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:bg-white text-slate-800"
        />
        <button
          type="submit"
          disabled={busy || input.trim() === ''}
          aria-label="Enviar mensaje a VictoriA"
          className="tap p-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <p className="px-4 pb-3 bg-white text-xs text-slate-500 flex items-start gap-1.5 leading-snug">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        VictoriA es una asistente virtual (IA). Una persona de CADIS revisa tu postulación y se comunica contigo.
      </p>
    </div>
  );
};
