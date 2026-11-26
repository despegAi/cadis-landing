// Función de Vercel: puente entre el chat de la landing y VictoriA (n8n).
// - La URL del webhook de n8n vive solo aquí (variable N8N_CHAT_WEBHOOK_URL), nunca en el navegador.
// - Valida el mensaje y limita el uso por visitante para que nadie gaste el cupo de IA.
// - No guarda mensajes ni datos personales.

interface Req {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}
interface Res {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

// El agente puede tardar 6 a 12 s (consulta herramientas y arma la respuesta)
export const config = { maxDuration: 30 };

const SESSION_RE = /^[A-Za-z0-9_-]{8,40}$/;
const MAX_MESSAGE = 500;

// Límite por IP: 20 mensajes cada 10 minutos (por instancia; frena el abuso sin base de datos).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

const clientIp = (req: Req): string => {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || 'desconocida';
};

const tooMany = (ip: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });

  const webhook = process.env.N8N_CHAT_WEBHOOK_URL;
  if (!webhook) return res.status(503).json({ error: 'chat_no_configurado' });

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as
    | { sessionId?: unknown; message?: unknown }
    | undefined;
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!SESSION_RE.test(sessionId) || message.length < 1 || message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: 'solicitud_invalida' });
  }

  if (tooMany(clientIp(req))) return res.status(429).json({ error: 'demasiados_mensajes' });

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message }),
      signal: AbortSignal.timeout(28000)
    });
    if (!r.ok) return res.status(502).json({ error: 'victoria_no_disponible' });
    const data = (await r.json()) as { reply?: unknown };
    const reply = typeof data.reply === 'string' ? data.reply.trim().slice(0, 2000) : '';
    if (!reply) return res.status(502).json({ error: 'respuesta_vacia' });
    return res.status(200).json({ reply });
  } catch {
    return res.status(504).json({ error: 'tiempo_agotado' });
  }
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
