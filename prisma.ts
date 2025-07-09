import { PrismaClient } from "@prisma/client";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalPrisma.prisma || new PrismaClient();

//? In Prisma, Next.js or Serverless environment, always singleton is used.
if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
