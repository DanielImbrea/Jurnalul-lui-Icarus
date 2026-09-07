export const blakeFeaturedImages = {
  hero: "/books/blake/08-hero.webp",
  moment: "/books/blake/7.png",
  showcase: "/books/blake/3.png"
} as const;

export const blakeImages = [
  "/books/blake/3.png",
  "/books/blake/7.png",
  "/books/blake/01.png",
  "/books/blake/02.png",
  "/books/blake/03.png",
  "/books/blake/04.png",
  "/books/blake/05.png",
  "/books/blake/06.png",
  "/books/blake/07.png",
  "/books/blake/08.png"
] as const;

export const durereFeaturedImages = {
  hero: "/books/durere/01-hero.webp"
} as const;

export const durereImages = [
  "/books/durere/01.png",
  "/books/durere/02.png",
  "/books/durere/03.png",
  "/books/durere/04.png"
] as const;

export const bundleImages = ["/books/bundle/01.png"] as const;

export function getBookCover(bookId: "blake" | "durere" | "bundle"): string {
  switch (bookId) {
    case "blake":
      return blakeFeaturedImages.showcase;
    case "durere":
      return durereImages[0];
    case "bundle":
      return bundleImages[0];
  }
}

export function getBookGallery(bookId: "blake" | "durere"): readonly string[] {
  return bookId === "blake" ? blakeImages : durereImages;
}
