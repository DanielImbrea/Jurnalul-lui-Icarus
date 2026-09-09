import { z } from "zod";

export const BOOK_IDS = ["blake", "durere"] as const;
export type BookId = (typeof BOOK_IDS)[number];

export const reviewSubmitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(80),
  email: z.string().trim().email("Adresa de email nu este validă.").max(120),
  bookId: z.enum(BOOK_IDS, { message: "Cartea selectată nu este validă." }),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating-ul minim este 1.")
    .max(5, "Rating-ul maxim este 5."),
  content: z
    .string()
    .trim()
    .min(20, "Recenzia trebuie să aibă cel puțin 20 de caractere.")
    .max(2000),
  socialHandle: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal("")),
  consentGiven: z.literal(true, {
    message: "Trebuie să accepți publicarea recenziei."
  })
});

export const gallerySubmitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(80),
  email: z
    .string()
    .trim()
    .email("Adresa de email nu este validă.")
    .max(120)
    .optional()
    .or(z.literal("")),
  bookId: z.enum(BOOK_IDS, { message: "Cartea selectată nu este validă." }),
  caption: z.string().trim().max(300).optional().or(z.literal("")),
  consentGiven: z.literal(true, {
    message: "Trebuie să accepți publicarea fotografiei."
  })
});

export const communityPostSubmitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(80),
  email: z.string().trim().email("Adresa de email nu este validă.").max(120),
  content: z
    .string()
    .trim()
    .min(15, "Mesajul trebuie să aibă cel puțin 15 caractere.")
    .max(3000),
  parentId: z.string().trim().max(40).optional().or(z.literal("")),
  consentGiven: z.coerce.boolean().refine((value) => value, {
    message: "Trebuie să accepți publicarea mesajului."
  }),
});

export const adminCommunityPostUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  content: z.string().trim().min(2).max(3000).optional(),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN", "REJECTED"]).optional(),
  createdAt: z.coerce
    .date({ message: "Data și ora nu sunt valide." })
    .optional()
});

export const adminCommunityReplySchema = z.object({
  content: z.string().trim().min(2).max(3000)
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Adresa de email nu este validă.").max(120)
});

export const cartLineSchema = z.object({
  productId: z.enum(["blake", "durere", "bundle"]),
  quantity: z.coerce.number().int().min(1).max(20)
});

export const codOrderSchema = z.object({
  lines: z.array(cartLineSchema).min(1, "Coșul este gol."),
  customerName: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(120),
  email: z.string().trim().email("Adresa de email nu este validă.").max(120),
  phone: z
    .string()
    .trim()
    .min(6, "Introdu un număr de telefon valid.")
    .max(20)
    .regex(/^[0-9+\s()-]+$/, "Număr de telefon invalid."),
  addressLine1: z
    .string()
    .trim()
    .min(3, "Adresa este obligatorie.")
    .max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Localitatea este obligatorie.").max(100),
  postalCode: z
    .string()
    .trim()
    .min(4, "Cod poștal invalid.")
    .max(10)
    .regex(/^[0-9]+$/, "Cod poștal invalid.")
});

export const adminReviewUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  bookId: z.enum(BOOK_IDS).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  content: z.string().trim().min(20).max(2000).optional(),
  socialHandle: z.string().trim().max(60).nullable().optional(),
  status: z
    .enum(["PENDING", "APPROVED", "HIDDEN", "REJECTED"])
    .optional(),
  featured: z.boolean().optional(),
  verifiedPurchase: z.boolean().optional(),
  removeImage: z.boolean().optional()
});

export const adminGalleryUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  bookId: z.enum(BOOK_IDS).optional(),
  caption: z.string().trim().max(300).nullable().optional(),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN", "REJECTED"]).optional(),
  featured: z.boolean().optional()
});

export const adminQuoteSchema = z.object({
  bookId: z.enum(BOOK_IDS).nullable().optional(),
  content: z.string().trim().min(5).max(500),
  source: z.string().trim().max(120).nullable().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).optional(),
  sortOrder: z.coerce.number().int().min(0).optional()
});

export const adminEditorialSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug-ul poate conține doar litere mici, cifre și cratime."),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(400).nullable().optional(),
  content: z.string().trim().min(10),
  imageUrl: z.string().url().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).optional()
});

export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/\0/g, "")
    .trim();
}
