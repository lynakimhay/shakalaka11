// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Use a global variable to prevent creating multiple instances in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;