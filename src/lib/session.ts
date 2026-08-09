import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/src/lib/auth';

export async function getServerSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}
