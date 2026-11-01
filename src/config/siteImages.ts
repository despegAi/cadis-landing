// Imagenes editables de la landing. Cada "slot" tiene una foto por defecto y una proporcion fija:
// el panel de administracion (/#/admin-fotos) recorta cualquier foto subida a esa proporcion,
// asi nunca se deforma. Para sumar un espacio nuevo, agregarlo aqui y usar <SiteImage slot="..." />.
import { INITIAL_PROPERTIES } from '../data/initialData';

export type SiteImageSlot = string;

export interface SiteImageSlotConfig {
  group: string;
  label: string;
  hint: string;
  aspect: number; // ancho / alto
  outputWidth: number; // px de ancho de la imagen final (ya optimizada)
  defaultUrl: string;
  alt: string;
}

const unsplash = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const GROUP_HERO = 'Inicio';
const GROUP_GALLERY = 'Galería de Río Bonito';
const GROUP_PROPERTIES = 'Mini quintas (tarjetas de propiedades)';
const GROUP_CHAT = 'Chat de WhatsApp';
export const SLOT_GROUPS = [GROUP_HERO, GROUP_GALLERY, GROUP_PROPERTIES, GROUP_CHAT];

// Tarjetas de la galeria y de propiedades: se ven en un marco ancho (~16:10).
const CARD_ASPECT = 16 / 10;
const CARD_WIDTH = 1000;

const GALLERY: { slot: string; label: string; alt: string; photo: string }[] = [
  { slot: 'galeria1', label: 'Playa natural y aguas cristalinas', alt: 'Playa Natural y Aguas Cristalinas', photo: 'photo-1507525428034-b723cf961d3e' },
  { slot: 'galeria2', label: 'Topografía plana y suelo fértil', alt: 'Topografía Plana y Suelo Fértil', photo: 'photo-1500382017468-9049fed747ef' },
  { slot: 'galeria3', label: 'Estilo de vida en casa de campo', alt: 'Estilo de Vida en Casa de Campo', photo: 'photo-1518780664697-55e3ad937233' },
  { slot: 'galeria4', label: 'Atardeceres y microclima de valle', alt: 'Atardeceres y Microclima de Valle', photo: 'photo-1506744038136-46273834b3fb' },
  { slot: 'galeria5', label: 'Vegetación y sendero ecológico', alt: 'Vegetación y Sendero Ecológico', photo: 'photo-1448375240586-882707db888b' },
  { slot: 'galeria6', label: 'Espacios de descanso familiar', alt: 'Espacios de Descanso Familiar', photo: 'photo-1542314831-068cd1dbfeeb' }
];

export const SITE_IMAGE_SLOTS: Record<SiteImageSlot, SiteImageSlotConfig> = {
  heroPhoto: {
    group: GROUP_HERO,
    label: 'Foto del inicio',
    hint: 'Foto principal junto al logotipo. Se recorta a formato 4:3.',
    aspect: 4 / 3,
    outputWidth: 1400,
    // Foto provisional de stock: reemplazar subiendo una real desde el panel.
    defaultUrl: unsplash('photo-1500382017468-9049fed747ef', 1400),
    alt: 'Terrenos campestres y mini quintas en Limoncito, Santa Cruz'
  },

  ...Object.fromEntries(
    GALLERY.map((g) => [
      g.slot,
      {
        group: GROUP_GALLERY,
        label: g.label,
        hint: 'Foto de la galería de la sección Río Bonito. Se recorta a formato 16:10.',
        aspect: CARD_ASPECT,
        outputWidth: CARD_WIDTH,
        defaultUrl: unsplash(g.photo, CARD_WIDTH),
        alt: g.alt
      } satisfies SiteImageSlotConfig
    ])
  ),

  // Una por cada mini quinta de ejemplo (prop-1 ... prop-8). Las que se agreguen luego desde el
  // panel viejo conservan la URL que tengan; para darles slot, agregarlas aqui.
  ...Object.fromEntries(
    INITIAL_PROPERTIES.map((p) => [
      p.id,
      {
        group: GROUP_PROPERTIES,
        label: `${p.loteNumero} · ${p.titulo}`,
        hint: 'Foto de la tarjeta y de la ventana de detalle de esta mini quinta. Se recorta a formato 16:10.',
        aspect: CARD_ASPECT,
        outputWidth: CARD_WIDTH,
        defaultUrl: p.imagen,
        alt: p.titulo
      } satisfies SiteImageSlotConfig
    ])
  ),

  asesoraFoto: {
    group: GROUP_CHAT,
    label: 'Foto de la asesora',
    hint: 'Foto redonda que aparece en el chat flotante de WhatsApp. Se recorta cuadrada (1:1).',
    aspect: 1,
    outputWidth: 400,
    defaultUrl: unsplash('photo-1573496359142-b8d87734a5a2', 400),
    alt: 'Asesora CADIS'
  }
};

export const getSiteImageUrl = (slot: SiteImageSlot, overrides?: Record<string, string>) =>
  overrides?.[slot] || SITE_IMAGE_SLOTS[slot]?.defaultUrl || '';
