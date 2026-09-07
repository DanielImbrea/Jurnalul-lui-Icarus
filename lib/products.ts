// Modelul central de produse. Nu hardcodăm prețuri în componente —
// totul pornește de aici, ca ulterior să putem adăuga volume noi,
// ediții speciale sau coduri promoționale fără să reconstruim UI-ul.

export type ProductId = "blake" | "durere" | "bundle";

export interface Product {
  id: ProductId;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  shortDescription: string;
  priceRon: number;
  // Se completează cu Price ID-urile reale din Stripe Dashboard.
  // Fiecare produs din Stripe trebuie creat manual sau prin API înainte de lansare.
  stripePriceId: string;
  meta: {
    author: string;
    publisher: string;
    year: number;
    pages?: number;
    isbn?: string;
  };
}

export const AUTHOR_NAME = "Daniel Imbrea";

export const products: Record<ProductId, Product> = {
  blake: {
    id: "blake",
    slug: "sub-umbrele-lui-blake",
    title: "Sub umbrele lui Blake",
    subtitle: "Întunericul nu este pentru oricine",
    badge: "Ficțiune • Dark romance • 18+",
    shortDescription:
      "O poveste despre iubire, tentație și limitele pe care le încălcăm ca să ne găsim liniștea.",
    priceRon: 59,
    stripePriceId: "price_REPLACE_WITH_BLAKE_PRICE_ID",
    meta: {
      author: "Daniel Imbrea",
      publisher: "Sedcom Libris",
      year: 2024,
      pages: 144,
      isbn: "9789736706578"
    }
  },
  durere: {
    id: "durere",
    slug: "imbratisarea-durerii-si-avantajele-ei",
    title: "Îmbrățișarea durerii și avantajele ei",
    subtitle: "Granițele dintre lacrimi și succes într-un echilibru perfect",
    badge: "Reflecție • Transformare • Viață",
    shortDescription:
      "Despre durerea care nu ne distruge, ci ne așază — și despre ce rămâne după ea.",
    priceRon: 59,
    stripePriceId: "price_REPLACE_WITH_DURERE_PRICE_ID",
    meta: {
      author: "Daniel Imbrea",
      publisher: "",
      year: 2023
    }
  },
  bundle: {
    id: "bundle",
    slug: "pachet-complet",
    title: "Amândouă cărțile",
    subtitle: "Sub umbrele lui Blake + Îmbrățișarea durerii și avantajele ei",
    badge: "Pachet complet",
    shortDescription: "Universul complet al lui Daniel Imbrea — ambele cărți, la un preț mai bun.",
    priceRon: 98,
    stripePriceId: "price_REPLACE_WITH_BUNDLE_PRICE_ID",
    meta: {
      author: "Daniel Imbrea",
      publisher: "Sedcom Libris",
      year: 2024
    }
  }
};

export const productList = Object.values(products);

export function getProduct(id: ProductId): Product {
  return products[id];
}

const STRIPE_PRICE_ENV: Record<ProductId, string | undefined> = {
  blake: process.env.STRIPE_PRICE_BLAKE,
  durere: process.env.STRIPE_PRICE_DURERE,
  bundle: process.env.STRIPE_PRICE_BUNDLE
};

/** Price ID-ul activ — din .env sau fallback din catalog. */
export function resolveStripePriceId(productId: ProductId): string {
  return STRIPE_PRICE_ENV[productId] ?? products[productId].stripePriceId;
}

export function isStripePriceConfigured(productId: ProductId): boolean {
  const priceId = resolveStripePriceId(productId);
  return Boolean(priceId && !priceId.includes("REPLACE"));
}
