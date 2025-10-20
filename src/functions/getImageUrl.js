/** Récupère une URL d'image à partir de différents formats (string | string[] | null) */
export default function getImageUrl(images) {
  if (!images) return "";
  if (typeof images === "string") return images;
  if (Array.isArray(images) && images.length > 0) return images[0];
  return "";
}