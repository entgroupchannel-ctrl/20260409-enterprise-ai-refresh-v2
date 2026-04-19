/**
 * Strip the `_DEL_<timestamp>` suffix that gets appended to document numbers
 * when they are soft-deleted. This frees the original number for reuse while
 * preserving the unique constraint, but we want to display the clean number
 * to users in the trash UI.
 */
export function displayDocNumber(num: string | null | undefined): string {
  if (!num) return '';
  const idx = num.indexOf('_DEL_');
  return idx === -1 ? num : num.slice(0, idx);
}

/**
 * Returns true when the document number carries a deletion suffix.
 */
export function isDeletedDocNumber(num: string | null | undefined): boolean {
  return !!num && num.includes('_DEL_');
}
