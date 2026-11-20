import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { LOTS, LotInfo, LotStatus } from '../data/lotStates';

const VALIDOS: LotStatus[] = ['disponible', 'reservado', 'vendido'];

/**
 * Estados de las mini quintas de la Fase 1.
 * Arranca con la lista fija de `lotStates.ts` y, si hay credenciales de Supabase
 * (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY), la actualiza con la función
 * pública `mini_quintas_publico()`. Si la consulta falla, el mapa sigue con la lista fija.
 */
export function useLotStates(): { lots: LotInfo[]; enVivo: boolean } {
  const [lots, setLots] = useState<LotInfo[]>(LOTS);
  const [enVivo, setEnVivo] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let cancelado = false;
    supabase.rpc('mini_quintas_publico').then(({ data, error }) => {
      if (cancelado || error || !Array.isArray(data)) return;
      const estados = new Map<string, LotStatus>();
      for (const fila of data as { lote_numero: string; estado: string }[]) {
        if (VALIDOS.includes(fila.estado as LotStatus)) estados.set(fila.lote_numero, fila.estado as LotStatus);
      }
      if (estados.size === 0) return;
      setLots(LOTS.map((l) => ({ ...l, estado: estados.get(l.id) ?? l.estado })));
      setEnVivo(true);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  return { lots, enVivo };
}
