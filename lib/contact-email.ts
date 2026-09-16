import { CONTACT_EMAIL } from "@/lib/brand";
import { sanitizeText, type ContactTopic } from "@/lib/validation";

const TOPIC_LABELS: Record<ContactTopic, string> = {
  contact: "Contact general",
  feedback: "Feedback și îmbunătățiri",
  problem: "Problemă raportată"
};

export interface ContactEmailInput {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
}

function buildContactEmailHtml(input: ContactEmailInput) {
  const topicLabel = TOPIC_LABELS[input.topic];
  const safeMessage = sanitizeText(input.message).replace(/\n/g, "<br>");

  return `
    <div style="font-family:Georgia,serif;color:#1a1a1a;line-height:1.6">
      <p><strong>${topicLabel}</strong> — formular contact site</p>
      <p>De la: <strong>${sanitizeText(input.name)}</strong><br>
      Email: <a href="mailto:${input.email}">${input.email}</a></p>
      <hr style="border:none;border-top:1px solid #ddd;margin:20px 0">
      <p>${safeMessage}</p>
    </div>
  `;
}

export async function sendContactFormEmail(
  input: ContactEmailInput
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL || CONTACT_EMAIL;

  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY lipsește — mesajul din formularul de contact nu a fost trimis."
    );
    return false;
  }

  const topicLabel = TOPIC_LABELS[input.topic];
  const subject = `[Contact site] ${topicLabel} — ${sanitizeText(input.name)}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `Jurnalul lui Icarus <${from}>`,
        to: CONTACT_EMAIL,
        reply_to: input.email,
        subject,
        html: buildContactEmailHtml(input)
      })
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend contact error:", res.status, body);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Nu am putut trimite mesajul de contact:", error);
    return false;
  }
}

export { TOPIC_LABELS };
