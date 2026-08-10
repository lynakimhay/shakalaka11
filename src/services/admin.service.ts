import prisma from '@/src/lib/prisma';
import { hashPassword, verifyPassword } from '@/src/lib/password';

/** Default admin created once when the AdminUser table is empty (no env credentials). */
export const DEFAULT_ADMIN_EMAIL = 'admin@shakalaka.com';
export const DEFAULT_ADMIN_PASSWORD = 'shakalaka@123';

export const adminService = {
  /** Ensure at least one admin exists so /login works without env vars. */
  async ensureDefaultAdmin() {
    const count = await prisma.adminUser.count();
    if (count > 0) return null;

    return prisma.adminUser.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
        role: 'admin',
      },
    });
  },

  async findAdminByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return prisma.adminUser.findFirst({
      where: {
        email: normalized,
        role: 'admin',
      },
    });
  },

  /**
   * Validate email/password against AdminUser rows only.
   * Returns the admin DTO on success, otherwise null.
   */
  async authenticate(email: string, password: string) {
    await this.ensureDefaultAdmin();

    const admin = await this.findAdminByEmail(email);
    if (!admin) return null;
    if (admin.role !== 'admin') return null;
    if (!verifyPassword(password, admin.passwordHash)) return null;

    return {
      id: admin.id,
      email: admin.email,
      role: 'admin' as const,
    };
  },

  async changePassword(email: string, currentPassword: string, newPassword: string) {
    const admin = await this.findAdminByEmail(email);
    if (!admin) return { ok: false as const, error: 'Admin not found' };
    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return { ok: false as const, error: 'Current password is incorrect' };
    }
    if (newPassword.length < 8) {
      return { ok: false as const, error: 'New password must be at least 8 characters' };
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    return { ok: true as const };
  },
};
