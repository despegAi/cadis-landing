import React from 'react';

interface CadisLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
}

// The official logo image already contains the "CADIS Bienes Raíces / Servicios
// Inmobiliarios" wordmark, so this component renders the image alone — no
// redundant text label next to it.
export const CadisLogo: React.FC<CadisLogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const heightMap = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
    '2xl': 'h-32',
    // Portada: el logotipo es lo primero que se ve, grande y legible
    hero: 'h-44 sm:h-56 lg:h-64'
  };

  return (
    <img
      src="/assets/cadis_logotipo_tc.png"
      alt="CADIS BIENES RAÍCES Servicios Inmobiliarios"
      className={`${heightMap[size]} w-auto object-contain rounded-md select-none ${className}`}
      id="cadis-official-logo"
      onError={(e) => {
        (e.currentTarget as HTMLElement).style.display = 'none';
      }}
    />
  );
};

export const RioBonitoBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 ${className}`}>
      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
        Proyecto Oficial Río Bonito • Limoncito
      </span>
    </div>
  );
};
