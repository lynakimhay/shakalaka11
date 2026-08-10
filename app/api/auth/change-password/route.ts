import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/src/lib/session';
import { adminService } from '@/src/services/admin.service';

/**
 * POST /api/auth/change-password
 * Body: { currentPassword, newPassword }
 * Requires an active admin session.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const currentPassword =
      typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword =
      typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'currentPassword and newPassword are required' },
        { status: 400 }
      );
    }

    const result = await adminService.changePassword(
      session.email,
      currentPassword,
      newPassword
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/auth/change-password error:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
