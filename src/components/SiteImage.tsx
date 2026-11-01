import React from 'react';
import { SITE_IMAGE_SLOTS, SiteImageSlot } from '../config/siteImages';
import { useSiteImage } from '../lib/useSiteImages';

interface SiteImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  slot: SiteImageSlot;
  /** Foto a usar si el espacio no tiene una subida desde el panel (por defecto, la del espacio). */
  fallback?: string;
}

/** <img> cuya foto se puede cambiar desde el panel de administracion (/#/admin-fotos). */
export const SiteImage: React.FC<SiteImageProps> = ({ slot, fallback, alt, ...rest }) => {
  const src = useSiteImage(slot, fallback);
  return <img src={src} alt={alt ?? SITE_IMAGE_SLOTS[slot]?.alt ?? ''} referrerPolicy="no-referrer" {...rest} />;
};
