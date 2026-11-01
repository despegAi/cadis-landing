// Recorte automatico de una foto a la proporcion de un espacio de la landing.
export interface FitState {
  zoom: number; // 1 = la foto cubre justo el marco; >1 acerca
  x: number; // desplazamiento horizontal, -1 (izquierda) a 1 (derecha)
  y: number; // desplazamiento vertical, -1 (arriba) a 1 (abajo)
}

export const DEFAULT_FIT: FitState = { zoom: 1, x: 0, y: 0 };

export const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen. Prueba con otra foto (JPG, PNG o WebP).'));
    };
    img.src = objectUrl;
  });

/** Region de la foto original (en px) que entra en el marco, segun zoom y desplazamiento. */
export const cropRect = (imgW: number, imgH: number, aspect: number, fit: FitState) => {
  // Marco "cover": el mayor rectangulo con la proporcion pedida que cabe en la foto.
  let w = imgW;
  let h = imgW / aspect;
  if (h > imgH) {
    h = imgH;
    w = imgH * aspect;
  }
  w /= fit.zoom;
  h /= fit.zoom;
  const sx = (imgW - w) / 2 + (fit.x * (imgW - w)) / 2;
  const sy = (imgH - h) / 2 + (fit.y * (imgH - h)) / 2;
  return { sx, sy, sw: w, sh: h };
};

/** Recorta y reduce la foto a `outputWidth` px de ancho con la proporcion exacta, en WebP. */
export const exportFitted = async (
  img: HTMLImageElement,
  aspect: number,
  outputWidth: number,
  fit: FitState
): Promise<Blob> => {
  const { sx, sy, sw, sh } = cropRect(img.naturalWidth, img.naturalHeight, aspect, fit);
  const width = Math.min(outputWidth, Math.round(sw));
  const height = Math.round(width / aspect);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tu navegador no pudo procesar la imagen.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('No se pudo optimizar la imagen.'))),
      'image/webp',
      0.85
    )
  );
};
