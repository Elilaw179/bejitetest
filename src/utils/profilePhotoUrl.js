/**
 * Profile / avatar image URL resolution against `VITE_API_URL` (backend origin, no trailing slash).
 *
 * @typedef {string | null | undefined} StoredPhoto
 */

import { API_URL } from '../config';

/** Default placeholder served from the Vite public folder */
export const PROFILE_PHOTO_PLACEHOLDER = '/assets/images/eli.jpg';

/**
 * Returns an absolute URL for display, or `undefined` when there is nothing to show.
 * - Empty → `undefined`
 * - Already `http://` or `https://` → unchanged
 * - `blob:` / `data:` → unchanged (local previews)
 * - `/assets/…` or `assets/…` → site-relative public path (no API prefix)
 * - Otherwise → `{API_URL}{path}` with a single slash between origin and path
 *
 * @param {StoredPhoto} stored
 * @returns {string | undefined}
 */
export function profilePhotoUrl(stored) {
  if (stored == null) return undefined;
  const s = String(stored).trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('blob:') || s.startsWith('data:')) return s;
  if (s.startsWith('/assets/')) return s;
  if (s.startsWith('assets/')) return `/${s}`;

  const base = String(API_URL || '').trim().replace(/\/+$/, '');
  if (!base) return undefined;
  const path = s.startsWith('/') ? s : `/${s}`;
  return `${base}${path}`;
}

/**
 * @param {StoredPhoto} stored
 * @param {string} [placeholder]
 * @returns {string}
 */
export function profileAvatarSrc(stored, placeholder = PROFILE_PHOTO_PLACEHOLDER) {
  return profilePhotoUrl(stored) ?? placeholder;
}
