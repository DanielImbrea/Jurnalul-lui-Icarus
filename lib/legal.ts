import { BRAND_NAME, CONTACT_EMAIL } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { SHIPPING_RON } from "@/lib/shipping";

export const OPERATOR_NAME = "Daniel Imbrea";
export const LEGAL_LAST_UPDATED = "9 septembrie 2026";

export const legalInfo = {
  operatorName: OPERATOR_NAME,
  brandName: BRAND_NAME,
  siteUrl: SITE_URL,
  contactEmail: CONTACT_EMAIL,
  shippingRon: SHIPPING_RON,
  shippingZone: "România",
  deliveryEstimate: "2–3 zile lucrătoare",
  couriers: "Fan Courier, Cargus sau SameDay",
  dataRetentionYears: 5
} as const;
