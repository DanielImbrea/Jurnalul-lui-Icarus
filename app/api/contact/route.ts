import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/contact-email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { contactSubmitSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`contact:${ip}`, { windowMs: 60_000, max: 5 });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou peste câteva minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = contactSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const sent = await sendContactFormEmail({
      name: sanitizeText(data.name),
      email: data.email.toLowerCase(),
      topic: data.topic,
      message: sanitizeText(data.message)
    });

    if (!sent) {
      return NextResponse.json(
        {
          error:
            "Nu am putut trimite mesajul acum. Scrie direct pe email sau încearcă din nou peste câteva minute."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mulțumesc — am primit mesajul. Îți răspund cât de curând pot."
    });
  } catch (error) {
    console.error("Eroare formular contact:", error);
    return NextResponse.json(
      { error: "Nu am putut procesa mesajul." },
      { status: 500 }
    );
  }
}
