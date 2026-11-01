import { useEffect, useState } from 'react';
import { supabase, IMAGES_TABLE } from './supabase';
import { SiteImageSlot, getSiteImageUrl } from '../config/siteImages';

type Overrides = Record<string, string>;

// Se pide una sola vez por visita y se comparte entre todos los componentes.
let cache: Overrides | null = null;
let pending: Promise<Overrides> | null = null;

const load = (): Promise<Overrides> => {
  if (cache) return Promise.resolve(cache);
  if (!supabase) return Promise.resolve({});
  pending ??= Promise.resolve(supabase.from(IMAGES_TABLE).select('slot,url'))
    .then(({ data }) => {
      const out: Overrides = {};
      (data ?? []).forEach((r: { slot: string; url: string }) => {
        out[r.slot] = r.url;
      });
      cache = out;
      return out;
    })
    .catch(() => ({} as Overrides));
  return pending;
};

export const clearSiteImagesCache = () => {
  cache = null;
  pending = null;
};

/**
 * URL de la foto de un espacio: la subida desde el panel; si no hay (o falla la red), `fallback`
 * o la foto por defecto del espacio.
 */
export const useSiteImage = (slot: SiteImageSlot, fallback?: string): string => {
  const base = fallback || getSiteImageUrl(slot);
  const [override, setOverride] = useState<string | undefined>(cache?.[slot]);
  useEffect(() => {
    let alive = true;
    load().then((o) => {
      if (alive) setOverride(o[slot]);
    });
    return () => {
      alive = false;
    };
  }, [slot]);
  return override || base;
};
