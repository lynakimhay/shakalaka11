/**
 * Client-safe media helpers for poster URLs (Cloudinary or other).
 * Upload/delete stay in cloudinary.ts (server-only).
 */

export function getPosterUrl(
  posterUrl?: string | null,
  poster?: string | null
): string | null {
  const url = (posterUrl || poster || '').trim();
  return url.length > 0 ? url : null;
}

export function isCloudinaryUrl(url: string): boolean {
  return /res\.cloudinary\.com\//i.test(url);
}
