import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminPassword
} from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`admin-login:${ip}`, { windowMs: 300_000, max: 10 });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Prea multe încercări de autentificare." },
      { status: 429 }
    );
  }

  try {
    const { password } = (await req.json()) as { password?: string };

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Parolă incorectă." },
        { status: 401 }
      );
    }

    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Eroare autentificare admin:", error);
    return NextResponse.json(
      { error: "Autentificarea nu este configurată." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
