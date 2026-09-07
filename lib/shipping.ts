/** Transport fix — suma afișată pe site și trimisă la Stripe Checkout. */
export const SHIPPING_RON = 19;

/**
 * Opțiuni de livrare pentru Stripe Checkout.
 * Poți folosi fie un Shipping Rate creat în Dashboard (STRIPE_SHIPPING_RATE_ID),
 * fie tariful generat automat aici (19 RON fix).
 */
export function getStripeShippingOptions(): Array<
  | { shipping_rate: string }
  | {
      shipping_rate_data: {
        type: "fixed_amount";
        fixed_amount: { amount: number; currency: "ron" };
        display_name: string;
      };
    }
> {
  const rateId = process.env.STRIPE_SHIPPING_RATE_ID;

  if (rateId) {
    return [{ shipping_rate: rateId }];
  }

  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: SHIPPING_RON * 100,
          currency: "ron"
        },
        display_name: "Livrare în România"
      }
    }
  ];
}

export function formatTotalWithShipping(bookPriceRon: number): number {
  return bookPriceRon + SHIPPING_RON;
}
