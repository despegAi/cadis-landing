// Estado y superficie de los 27 lotes de la Fase 1 (Manzanas M1 y M2).
// Estados: mapa del spot (estados.json, 2026-10-22), confirmados por el cliente por WhatsApp.
// Superficies: tabla del plano catastral (m2). Para cambiar un estado, editar solo aqui
// (o, a futuro, leerlo de Supabase ventas.v_lotes con la misma forma).
export type LotStatus = 'disponible' | 'reservado' | 'vendido';

export const LOT_PRICE_USD = 9000;

const M1_AREA = [843.88, 841.52, 811.89, 820.2, 828.99, 828.08, 818.74, 820.2, 828.23, 846.75, 856.09];
const M2_AREA = [
  862.98, 883.36, 848.69, 859.58, 856.83, 853.88, 850.93, 847.98,
  845.03, 830.42, 822.86, 818.55, 824.1, 840.97, 857.84, 874.71
];

const SOLD: Record<string, number[]> = { M1: [1, 2, 3, 4, 5, 6, 7, 10, 11], M2: [1, 2, 3, 4, 7, 14] };
const RESERVED: Record<string, number[]> = { M1: [8, 9], M2: [8, 13] };

export interface LotInfo {
  id: string; // ej. 'M1-01'
  manzana: 'M1' | 'M2';
  numero: number;
  estado: LotStatus;
  superficieM2: number;
}

const build = (mz: 'M1' | 'M2', areas: number[]): LotInfo[] =>
  areas.map((superficieM2, i) => {
    const numero = i + 1;
    const estado: LotStatus = SOLD[mz].includes(numero)
      ? 'vendido'
      : RESERVED[mz].includes(numero)
      ? 'reservado'
      : 'disponible';
    return { id: `${mz}-${String(numero).padStart(2, '0')}`, manzana: mz, numero, estado, superficieM2 };
  });

export const LOTS: LotInfo[] = [...build('M1', M1_AREA), ...build('M2', M2_AREA)];
