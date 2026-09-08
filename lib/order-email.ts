import {
  consolidateLines,
  encodeCartLines,
  getCartProductTitles,
  getCartSubtotal,
  type CartLine
} from "@/lib/cart";
import { products } from "@/lib/products";
import { SHIPPING_RON } from "@/lib/shipping";

interface OrderEmailInput {
  to: string;
  customerName?: string | null;
  lines: CartLine[];
  totalRon: number;
  paymentMethod: "card" | "cod";
  orderId?: string;
}

function buildOrderEmailHtml(input: OrderEmailInput) {
  const lines = consolidateLines(input.lines);
  const itemsHtml = lines
    .map((line) => {
      const product = products[line.productId];
      const lineTotal = product.priceRon * line.quantity;
      return `<li style="margin:0 0 8px">${product.title}${
        line.quantity > 1 ? ` × ${line.quantity}` : ""
      } — ${lineTotal} lei</li>`;
    })
    .join("");

  const paymentLabel =
    input.paymentMethod === "cod"
      ? "Ramburs la curier (numerar la livrare)"
      : "Card bancar (Stripe)";

  return `
    <div style="font-family:Georgia,serif;color:#1a1a1a;line-height:1.6">
      <p>Bună${input.customerName ? ` ${input.customerName}` : ""},</p>
      <p>Comanda ta pe <strong>Jurnalul lui Icarus</strong> a fost înregistrată.</p>
      <ul style="padding-left:18px">${itemsHtml}</ul>
      <p>Transport: ${SHIPPING_RON} lei<br>
      Total: <strong>${input.totalRon} lei</strong><br>
      Plată: ${paymentLabel}</p>
      ${
        input.paymentMethod === "cod"
          ? "<p>Vei plăti numerar curierului când primești coletul.</p>"
          : "<p>Plata a fost procesată prin Stripe.</p>"
      }
      <p style="color:#666;font-size:14px">Comanda va fi expediată în 2–3 zile lucrătoare.</p>
      ${
        input.orderId
          ? `<p style="color:#888;font-size:12px">Referință comandă: ${input.orderId}</p>`
          : ""
      }
    </div>
  `;
}

export async function sendOrderConfirmationEmail(
  input: OrderEmailInput
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.ORDER_FROM_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "onboarding@resend.dev";

  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY lipsește — emailul de confirmare comandă nu a fost trimis."
    );
    return false;
  }

  const lines = consolidateLines(input.lines);
  const subject = `Comanda ta — ${getCartProductTitles(lines)}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `Jurnalul lui Icarus <${from}>`,
        to: input.to,
        subject,
        html: buildOrderEmailHtml(input)
      })
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Nu am putut trimite emailul de confirmare:", error);
    return false;
  }
}

export function getOrderTotalFromLines(lines: CartLine[]): number {
  return getCartSubtotal(lines) + SHIPPING_RON;
}
