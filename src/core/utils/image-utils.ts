/**
 * Transforma una URL de Google Drive (viewer) a una URL de acceso directo para etiquetas <img>
 * @param url URL original de Google Drive
 * @returns URL transformada o la original si no es de Google Drive
 */

export const transformGoogleDriveUrl = (url: string): string => {
  if (!url || typeof url !== "string") return url;
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([^\/\?]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    const fileId = match[1];
    // Este formato es el más fiable para mostrar imágenes públicas de Drive en el navegador
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  return url;
};
