import { useEffect, useState } from 'react';
import { supabase, IMAGES_TABLE } from './supabase';
import { SiteImageSlot, getSiteImageUrl } from '../config/siteImages';

type Overrides = Partial<Record<SiteImageSlot, string>>;

// Se pide una sola vez por visita y se comparte entre componentes.
let cache: Overrides | null = null;
let pending: Promise<Overrides> | null = null;

const load = (): Promise<Overrides> => {
  if (cache) return Promise.resolve(cache);
  if (!supabase) return Promise.resolve({});
  pending ??= Promise.resolve(supabase.from(IMAGES_TABLE).select('slot,url'))
    .then(({ data }) => {
      const out: Overrides = {};
      (data ?? []).forEach((r: { slot: string; url: string }) => {
        out[r.slot as SiteImageSlot] = r.url;
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

/** URL de la foto de un espacio: la subida desde el panel, o la foto por defecto si no hay (o si falla la red). */
export const useSiteImage = (slot: SiteImageSlot): string => {
  const [url, setUrl] = useState(getSiteImageUrl(slot));
  useEffect(() => {
    let alive = true;
    load().then((o) => {
      if (alive) setUrl(getSiteImageUrl(slot, o));
    });
    return () => {
      alive = false;
    };
  }, [slot]);
  return url;
};
