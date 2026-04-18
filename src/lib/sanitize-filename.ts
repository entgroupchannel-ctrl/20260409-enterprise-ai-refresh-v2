/**
 * Sanitize a filename for use as a Supabase Storage object key.
 * Supabase rejects keys containing non-ASCII (e.g. Thai), spaces, or
 * many special characters with "Invalid key".
 *
 * Strategy:
 *  - Split off the extension and lowercase it
 *  - Transliterate the basename to ASCII-safe chars; replace anything else with "-"
 *  - Collapse repeated dashes, trim, and cap length
 *  - If basename becomes empty (e.g. all-Thai filename) → fall back to "file"
 */
export function sanitizeFilename(name: string, maxLen = 80): string {
  if (!name) return "file";
  const lastDot = name.lastIndexOf(".");
  const rawBase = lastDot > 0 ? name.slice(0, lastDot) : name;
  const rawExt = lastDot > 0 ? name.slice(lastDot + 1) : "";

  const cleanBase = rawBase
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-") // anything not [A-Za-z0-9_.-] → "-"
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, maxLen);

  const cleanExt = rawExt.replace(/[^A-Za-z0-9]/g, "").toLowerCase().slice(0, 10);

  const base = cleanBase || "file";
  return cleanExt ? `${base}.${cleanExt}` : base;
}
