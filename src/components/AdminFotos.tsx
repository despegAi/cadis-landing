import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ImagePlus, LogOut, RotateCcw, Save, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, IMAGES_BUCKET, IMAGES_TABLE } from '../lib/supabase';
import { clearSiteImagesCache } from '../lib/useSiteImages';
import { DEFAULT_FIT, FitState, cropRect, exportFitted, loadImage } from '../lib/imageFit';
import { SITE_IMAGE_SLOTS, SiteImageSlot, getSiteImageUrl } from '../config/siteImages';

const MAX_UPLOAD_MB = 25; // foto de origen; la imagen final se reduce a unos cientos de KB
const publicPathOf = (url: string) => {
  const marker = `/object/public/${IMAGES_BUCKET}/`;
  const i = url.indexOf(marker);
  return i >= 0 ? decodeURIComponent(url.slice(i + marker.length)) : null;
};

/* ---------- Una foto editable: elegir, encuadrar, guardar ---------- */
const SlotEditor: React.FC<{ slot: SiteImageSlot; currentUrl: string; isCustom: boolean; onChanged: () => void }> = ({
  slot,
  currentUrl,
  isCustom,
  onChanged
}) => {
  const cfg = SITE_IMAGE_SLOTS[slot];
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fit, setFit] = useState<FitState>(DEFAULT_FIT);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Vista previa: exactamente lo que se publicara (misma funcion de recorte).
  useEffect(() => {
    const c = canvasRef.current;
    if (!img || !c) return;
    const w = 640;
    const h = Math.round(w / cfg.aspect);
    c.width = w;
    c.height = h;
    const { sx, sy, sw, sh } = cropRect(img.naturalWidth, img.naturalHeight, cfg.aspect, fit);
    c.getContext('2d')?.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }, [img, fit, cfg.aspect]);

  const pick = async (file: File | undefined | null) => {
    setMsg(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) return setMsg({ ok: false, text: 'Ese archivo no es una imagen.' });
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024)
      return setMsg({ ok: false, text: `La foto pesa más de ${MAX_UPLOAD_MB} MB. Elige una más liviana.` });
    try {
      setImg(await loadImage(file));
      setFit(DEFAULT_FIT);
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
  };

  const save = async () => {
    if (!supabase || !img) return;
    setBusy(true);
    setMsg(null);
    try {
      const blob = await exportFitted(img, cfg.aspect, cfg.outputWidth, fit);
      const path = `${slot}-${Date.now()}.webp`;
      const up = await supabase.storage.from(IMAGES_BUCKET).upload(path, blob, { contentType: 'image/webp' });
      if (up.error) throw new Error(`No se pudo subir la foto: ${up.error.message}`);
      const url = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
      const row = await supabase.from(IMAGES_TABLE).upsert({ slot, url, updated_at: new Date().toISOString() });
      if (row.error) throw new Error(`La foto se subió pero no se pudo activar: ${row.error.message}`);
      // Limpieza: borra la foto anterior de este espacio (si era nuestra).
      const old = isCustom ? publicPathOf(currentUrl) : null;
      if (old) await supabase.storage.from(IMAGES_BUCKET).remove([old]);
      clearSiteImagesCache();
      setImg(null);
      setMsg({ ok: true, text: 'Listo. La foto nueva ya se ve en la página (recarga para verla).' });
      onChanged();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const old = publicPathOf(currentUrl);
    const del = await supabase.from(IMAGES_TABLE).delete().eq('slot', slot);
    if (del.error) setMsg({ ok: false, text: `No se pudo restaurar: ${del.error.message}` });
    else {
      if (old) await supabase.storage.from(IMAGES_BUCKET).remove([old]);
      clearSiteImagesCache();
      setMsg({ ok: true, text: 'Se restauró la foto original.' });
      onChanged();
    }
    setBusy(false);
  };

  const slider = (label: string, value: number, min: number, max: number, step: number, set: (v: number) => void) => (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full mt-1 accent-[#009698]"
      />
    </label>
  );

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">{cfg.label}</h2>
        <p className="text-sm text-slate-500">{cfg.hint}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {img ? 'Así quedará' : isCustom ? 'Foto actual' : 'Foto actual (original)'}
          </p>
          {img ? (
            <canvas ref={canvasRef} className="w-full rounded-xl border border-slate-200" style={{ aspectRatio: String(cfg.aspect) }} />
          ) : (
            <img
              src={currentUrl}
              alt={cfg.alt}
              className="w-full rounded-xl border border-slate-200 object-cover"
              style={{ aspectRatio: String(cfg.aspect) }}
            />
          )}
        </div>

        <div className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pick(e.dataTransfer.files?.[0]);
            }}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#009698] hover:bg-teal-50/40 px-4 py-6 text-slate-600 cursor-pointer transition-colors"
          >
            <ImagePlus className="w-7 h-7 text-[#009698]" />
            <span className="font-bold">{img ? 'Elegir otra foto' : 'Elegir o arrastrar una foto'}</span>
            <span className="text-xs text-slate-500">Cualquier tamaño: se ajusta sola al formato.</span>
          </button>

          {img && (
            <div className="space-y-3">
              {slider('Acercar', fit.zoom, 1, 3, 0.05, (zoom) => setFit({ ...fit, zoom }))}
              {fit.zoom > 1 || img.naturalWidth / img.naturalHeight !== cfg.aspect ? (
                <>
                  {slider('Mover a izquierda / derecha', fit.x, -1, 1, 0.02, (x) => setFit({ ...fit, x }))}
                  {slider('Mover arriba / abajo', fit.y, -1, 1, 0.02, (y) => setFit({ ...fit, y }))}
                </>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={save}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#009698] hover:bg-teal-700 disabled:opacity-60 text-white font-black cursor-pointer"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {busy ? 'Subiendo…' : 'Guardar y publicar'}
              </button>
            </div>
          )}

          {isCustom && !img && (
            <button
              type="button"
              disabled={busy}
              onClick={restore}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer disabled:opacity-60"
            >
              <RotateCcw className="w-4 h-4" /> Volver a la foto original
            </button>
          )}

          {msg && (
            <p className={`flex items-start gap-2 text-sm font-semibold ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>
              {msg.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{msg.text}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------- Pantalla del panel: login + lista de fotos ---------- */
export const AdminFotos: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [overrides, setOverrides] = useState<Partial<Record<SiteImageSlot, string>>>({});

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from(IMAGES_TABLE).select('slot,url');
    const out: Partial<Record<SiteImageSlot, string>> = {};
    (data ?? []).forEach((r: { slot: string; url: string }) => {
      out[r.slot as SiteImageSlot] = r.url;
    });
    setOverrides(out);
  }, []);

  useEffect(() => {
    if (session) refresh();
  }, [session, refresh]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoggingIn(true);
    setLoginErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setLoginErr('Correo o contraseña incorrectos.');
    setLoggingIn(false);
  };

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Volver a la página
          </a>
          {session && (
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          )}
        </div>
        <h1 className="text-3xl font-black tracking-tight">Fotos de la página</h1>
        {children}
      </div>
    </div>
  );

  if (!ready) return shell(<p className="text-slate-500">Cargando…</p>);

  if (!supabase)
    return shell(
      <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        El panel todavía no está conectado. Falta configurar <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en esta
        instalación de la página.
      </p>
    );

  if (!session)
    return shell(
      <form onSubmit={login} className="max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <p className="text-sm text-slate-600">Entra con tu correo y contraseña de administrador.</p>
        <label className="block text-sm font-semibold">
          Correo
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-semibold">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        {loginErr && <p className="text-sm font-semibold text-red-700">{loginErr}</p>}
        <button
          type="submit"
          disabled={loggingIn}
          className="w-full px-4 py-2.5 rounded-xl bg-[#009698] hover:bg-teal-700 disabled:opacity-60 text-white font-black cursor-pointer"
        >
          {loggingIn ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    );

  return shell(
    <>
      <p className="text-slate-600">
        Elige una foto de tu computadora o celular. Se recorta sola al formato correcto y se optimiza para que la página cargue rápido.
      </p>
      {(Object.keys(SITE_IMAGE_SLOTS) as SiteImageSlot[]).map((slot) => (
        <SlotEditor
          key={slot}
          slot={slot}
          currentUrl={getSiteImageUrl(slot, overrides)}
          isCustom={Boolean(overrides[slot])}
          onChanged={refresh}
        />
      ))}
    </>
  );
};
