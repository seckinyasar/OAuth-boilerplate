import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, NeonConfig } from "@neondatabase/serverless";

import ws from "ws";
neonConfig.webSocketConstructor = ws;

//? to work in edge environments (cloudflare workers, vercel, etc.) enable querying over fetch.
// neonConfig.poolQueryViaFetch = true;

//? Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
//#region //? Old Prisma Client
// const globalPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma = globalPrisma.prisma || new PrismaClient();

// //? In Prisma, Next.js or Serverless environment, always singleton is used.
// if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
//#endregion
