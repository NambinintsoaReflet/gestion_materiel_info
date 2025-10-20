// Normalise la réponse API selon différents formats possibles
export default function normalizePublications(resData) {
  // 1) Tableau simple
  if (Array.isArray(resData)) return resData;

  // 2) Pagination Laravel: { data: [...] }
  if (Array.isArray(resData?.data)) return resData.data;

  // 3) Objet custom: { publication: [...] }
  if (Array.isArray(resData?.publication)) return resData.publication;

  // 4) Sinon, vide
  return [];
}
