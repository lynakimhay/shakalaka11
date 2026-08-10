import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/lib/session';
import { adminService } from '@/src/services/admin.service';

/**
 * GET /api/auth/me
 * Returns the current admin session, or 401 if not signed in.
 */
export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Confirm the admin still exists in the DB (revoked users can't stay "logged in").
  const admin = await adminService.findAdminByEmail(session.email);
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: 'admin',
    email: admin.email,
  });
}
