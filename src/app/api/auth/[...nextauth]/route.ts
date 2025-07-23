import { handlers } from "../../../../../auth";

//? to get prisma client to work in nodejs runtime
export const runtime = "nodejs";

export const { GET, POST } = handlers;
