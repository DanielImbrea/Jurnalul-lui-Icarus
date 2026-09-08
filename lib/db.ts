import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

globalForPrisma.prisma = prisma;

export function getPrismaErrorCode(error: unknown): string | null {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code: string }).code);
  }
  return null;
}

export function isDbConnectionError(error: unknown): boolean {
  const code = getPrismaErrorCode(error);
  if (code === "P1001" || code === "P1000" || code === "P1017") return true;

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message: string }).message)
        : "";

  return /Can't reach database server|Connection terminated|ECONNREFUSED/i.test(
    message
  );
}

/** Evită crash la build/runtime dacă DB e temporar indisponibil. */
export async function withDbFallback<T>(
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error("[db]", error);
    return fallback;
  }
}
