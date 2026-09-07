import type { ProductId } from "@/lib/products";
import { products } from "@/lib/products";

export const CART_STORAGE_KEY = "icarus-cart";

export interface CartLine {
  productId: ProductId;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
}

export const emptyCart: CartState = { lines: [] };

const productIds = new Set(Object.keys(products));

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && productIds.has(value);
}

export function consolidateLines(lines: CartLine[]): CartLine[] {
  const map = new Map<ProductId, number>();

  for (const line of lines) {
    if (!isProductId(line.productId) || line.quantity < 1) continue;
    map.set(line.productId, (map.get(line.productId) ?? 0) + line.quantity);
  }

  return Array.from(map.entries()).map(([productId, quantity]) => ({
    productId,
    quantity
  }));
}

export function encodeCartLines(lines: CartLine[]): string {
  return consolidateLines(lines)
    .map((line) =>
      line.quantity > 1 ? `${line.productId}:${line.quantity}` : line.productId
    )
    .join(",");
}

export function parseCartLines(raw: string): CartLine[] {
  if (!raw) return [];

  return consolidateLines(
    raw.split(",").flatMap((part) => {
      const trimmed = part.trim();
      if (!trimmed) return [];

      const [id, qty] = trimmed.split(":");
      if (!isProductId(id)) return [];

      const quantity = qty ? Number.parseInt(qty, 10) : 1;
      if (!Number.isFinite(quantity) || quantity < 1) return [];

      return [{ productId: id, quantity }];
    })
  );
}

function migrateLegacyCart(parsed: unknown): CartState {
  if (!parsed || typeof parsed !== "object") return emptyCart;

  const record = parsed as Record<string, unknown>;

  if (Array.isArray(record.lines)) {
    return {
      lines: consolidateLines(
        record.lines.map((line) => {
          const entry = line as Partial<CartLine>;
          return {
            productId: entry.productId,
            quantity: entry.quantity ?? 1
          } as CartLine;
        })
      )
    };
  }

  if (Array.isArray(record.items)) {
    return {
      lines: consolidateLines(
        (record.items as ProductId[]).map((productId) => ({
          productId,
          quantity: 1
        }))
      )
    };
  }

  if (isProductId(record.productId)) {
    return { lines: [{ productId: record.productId, quantity: 1 }] };
  }

  return emptyCart;
}

export function readCart(): CartState {
  if (typeof window === "undefined") return emptyCart;

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyCart;

    return migrateLegacyCart(JSON.parse(raw));
  } catch {
    return emptyCart;
  }
}

export function writeCart(cart: CartState) {
  if (typeof window === "undefined") return;

  const lines = consolidateLines(cart.lines);

  if (lines.length === 0) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({ lines } satisfies CartState)
  );
}

export function getCartItemCount(lines: CartLine[]): number {
  return consolidateLines(lines).reduce((sum, line) => sum + line.quantity, 0);
}

export function getCartSubtotal(lines: CartLine[]): number {
  return consolidateLines(lines).reduce(
    (sum, line) => sum + products[line.productId].priceRon * line.quantity,
    0
  );
}

export function getCartProductTitles(lines: CartLine[]): string {
  return consolidateLines(lines)
    .map((line) => {
      const title = products[line.productId].title;
      return line.quantity > 1 ? `${title} ×${line.quantity}` : title;
    })
    .join(" + ");
}

/** @deprecated Folosește encodeCartLines */
export function encodeProductIds(lines: CartLine[]): string {
  return encodeCartLines(lines);
}

/** @deprecated Folosește parseCartLines */
export function parseProductIds(raw: string): CartLine[] {
  return parseCartLines(raw);
}

export function addQuantity(lines: CartLine[], productId: ProductId): CartLine[] {
  const next = consolidateLines(lines);
  const existing = next.find((line) => line.productId === productId);

  if (existing) {
    existing.quantity += 1;
    return consolidateLines(next);
  }

  return consolidateLines([...next, { productId, quantity: 1 }]);
}

export function decreaseQuantity(
  lines: CartLine[],
  productId: ProductId
): CartLine[] {
  const next = consolidateLines(lines);
  const existing = next.find((line) => line.productId === productId);

  if (!existing) return next;

  if (existing.quantity <= 1) {
    return next.filter((line) => line.productId !== productId);
  }

  existing.quantity -= 1;
  return consolidateLines(next);
}

export function removeProduct(lines: CartLine[], productId: ProductId): CartLine[] {
  return consolidateLines(lines).filter((line) => line.productId !== productId);
}

export function getLineQuantity(lines: CartLine[], productId: ProductId): number {
  return consolidateLines(lines).find((line) => line.productId === productId)
    ?.quantity ?? 0;
}
