import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from '@/src/lib/auth';
import { adminService } from '@/src/services/admin.service';

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Only AdminUser rows with role=admin can sign in.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email.trim() || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await adminService.authenticate(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(admin.email);
    const res = NextResponse.json({
      success: true,
      role: admin.role,
      email: admin.email,
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return res;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    const message = error instanceof Error ? error.message : String(error);
    const missingDb = !process.env.DATABASE_URL;
    return NextResponse.json(
      {
        error: missingDb
          ? 'DATABASE_URL is not set on this deployment'
          : 'Login failed',
        hint: missingDb
          ? 'Add DATABASE_URL in Vercel → Environment Variables, then Redeploy'
          : message.includes("Can't reach database") || message.includes('P1001')
            ? 'Database unreachable — check DATABASE_URL / Neon project'
            : undefined,
      },
      { status: 500 }
    );
  }
}
