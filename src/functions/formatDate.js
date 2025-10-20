/** Nettoie un ISO avec microsecondes (…000000Z) -> Z, pour éviter les soucis de parsing */
function normalizeIso(iso) {
  return iso?.replace(/\.\d+Z$/, "Z");
}

/** Construit une **chaîne lisible** à partir d'un ISO complet OU d'un couple (dateStr, timeStr) */

export default function formatDate(dateStr, timeStr) {
  if (!dateStr) return "Date inconnue";

  try {
    // ISO complet ?
    if (dateStr.includes("T")) {
      const clean = normalizeIso(dateStr);
      const d = new Date(clean);
      if (isNaN(d)) return "Date inconnue";
      return d.toLocaleString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Sinon fabrique "YYYY-MM-DDTHH:mm:ss"
    const full = timeStr ? `${dateStr}T${timeStr}` : dateStr;
    const d = new Date(full);
    if (isNaN(d)) return "Date inconnue";
    return d.toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(timeStr ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
  } catch {
    return "Date inconnue";
  }
}
