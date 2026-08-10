import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SCRYPT_KEYLEN = 64;

/** Hash a password for storage (scrypt + salt). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${hash}`;
}

/** Constant-time password check against a stored salt:hash value. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  try {
    const computed = scryptSync(password, salt, SCRYPT_KEYLEN);
    const expected = Buffer.from(hash, 'hex');
    if (expected.length !== computed.length) return false;
    return timingSafeEqual(expected, computed);
  } catch {
    return false;
  }
}
