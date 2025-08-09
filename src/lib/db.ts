import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in development hot-reload
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = global as any;

export const prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
