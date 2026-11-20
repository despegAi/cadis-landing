// Imagenes editables de la landing. Cada "slot" tiene una foto por defecto y una proporcion fija:
// el panel de administracion (/#/admin-fotos) recorta cualquier foto subida a esa proporcion,
// asi nunca se deforma. Para sumar un espacio nuevo, agregarlo aqui y usar <SiteImage slot="..." />.
import { INITIAL_PROPERTIES } from '../data/initialData';
// Fotos reales de Río Bonito: capturas del footage H2H (2026-11-03), elegidas por luz y encuadre,
// recortadas a la proporción de cada espacio y guardadas en WebP.
import fotoHero from '../assets/fotos/rio_bonito_hero.webp';
import fotoGaleria1 from '../assets/fotos/rio_bonito_galeria1.webp';
import fotoGaleria2 from '../assets/fotos/rio_bonito_galeria2.webp';
import fotoGaleria3 from '../assets/fotos/rio_bonito_galeria3.webp';
import fotoGaleria4 from '../assets/fotos/rio_bonito_galeria4.webp';
import fotoGaleria5 from '../assets/fotos/rio_bonito_galeria5.webp';
import fotoGaleria6 from '../assets/fotos/rio_bonito_galeria6.webp';
import fotoProp1 from '../assets/fotos/rio_bonito_prop-1.webp';
import fotoProp2 from '../assets/fotos/rio_bonito_prop-2.webp';
import fotoProp3 from '../assets/fotos/rio_bonito_prop-3.webp';
import fotoProp4 from '../assets/fotos/rio_bonito_prop-4.webp';
import fotoProp5 from '../assets/fotos/rio_bonito_prop-5.webp';
import fotoProp6 from '../assets/fotos/rio_bonito_prop-6.webp';
import fotoProp7 from '../assets/fotos/rio_bonito_prop-7.webp';
import fotoProp8 from '../assets/fotos/rio_bonito_prop-8.webp';

// Foto real por defecto de cada tarjeta de mini quinta (por id de INITIAL_PROPERTIES).
const FOTOS_PROPIEDADES: Record<string, string> = {
  'prop-1': fotoProp1, 'prop-2': fotoProp2, 'prop-3': fotoProp3, 'prop-4': fotoProp4,
  'prop-5': fotoProp5, 'prop-6': fotoProp6, 'prop-7': fotoProp7, 'prop-8': fotoProp8
};

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
  { slot: 'galeria1', label: 'Playa natural y aguas cristalinas', alt: 'Puente colgante sobre el río en Río Bonito', photo: fotoGaleria1 },
  { slot: 'galeria2', label: 'Topografía plana y suelo fértil', alt: 'Pastizal llano con la serranía de fondo', photo: fotoGaleria2 },
  { slot: 'galeria3', label: 'Estilo de vida en casa de campo', alt: 'Terneros descansando en el campo', photo: fotoGaleria3 },
  { slot: 'galeria4', label: 'Atardeceres y microclima de valle', alt: 'Arboleda y cielo del valle de Limoncito', photo: fotoGaleria4 },
  { slot: 'galeria5', label: 'Vegetación y sendero ecológico', alt: 'Sendero entre árboles en Río Bonito', photo: fotoGaleria5 },
  { slot: 'galeria6', label: 'Espacios de descanso familiar', alt: 'Claro verde rodeado de monte', photo: fotoGaleria6 }
];

export const SITE_IMAGE_SLOTS: Record<SiteImageSlot, SiteImageSlotConfig> = {
  heroPhoto: {
    group: GROUP_HERO,
    label: 'Foto del inicio',
    hint: 'Foto principal junto al logotipo. Se recorta a formato 4:3.',
    aspect: 4 / 3,
    outputWidth: 1400,
    // Foto real (loma con la bandera de Santa Cruz y la serranía). Se puede cambiar desde el panel.
    defaultUrl: fotoHero,
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
        defaultUrl: g.photo,
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
        defaultUrl: FOTOS_PROPIEDADES[p.id] ?? p.imagen,
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
