// Imagenes editables de la landing. Cada "slot" tiene una foto por defecto y una proporcion fija:
// el panel de administracion recorta cualquier foto subida a esa proporcion, asi nunca se deforma.
export type SiteImageSlot = 'heroPhoto';

export interface SiteImageSlotConfig {
  label: string;
  hint: string;
  aspect: number; // ancho / alto
  outputWidth: number; // px de la imagen final (ya optimizada)
  defaultUrl: string;
  alt: string;
}

export const SITE_IMAGE_SLOTS: Record<SiteImageSlot, SiteImageSlotConfig> = {
  heroPhoto: {
    label: 'Foto del inicio',
    hint: 'Foto principal junto al logotipo. Se recorta a formato 4:3.',
    aspect: 4 / 3,
    outputWidth: 1400,
    // Foto provisional de stock: reemplazar subiendo una real desde el panel.
    defaultUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
    alt: 'Terrenos campestres y mini quintas en Limoncito, Santa Cruz'
  }
};

export const getSiteImageUrl = (slot: SiteImageSlot, overrides?: Partial<Record<SiteImageSlot, string>>) =>
  overrides?.[slot] || SITE_IMAGE_SLOTS[slot].defaultUrl;
