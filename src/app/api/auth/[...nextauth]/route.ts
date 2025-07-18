import { handlers } from "../../../../../auth";

export const { GET, POST } = handlers;

// PrismaClient'ın Node.js runtime'da çalışması için
export const runtime = "nodejs";
