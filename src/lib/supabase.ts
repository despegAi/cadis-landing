import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL y clave PUBLICABLE (anon) del proyecto de Supabase. Son publicas por diseno: la proteccion
// real son las politicas RLS (ver docs/supabase/20261101130000_landing_imagenes.sql).
// Nunca poner aqui la clave service_role.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const IMAGES_BUCKET = 'cadis-landing';
export const IMAGES_TABLE = 'cadis_landing_imagenes';
