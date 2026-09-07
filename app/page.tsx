import Hero from "@/components/Hero";
import BookShowcase from "@/components/BookShowcase";
import FeaturedReviewsSection from "@/components/reviews/FeaturedReviewsSection";
import QuotesSection from "@/components/QuotesSection";
import TrustSection from "@/components/TrustSection";
import AuthorSection from "@/components/AuthorSection";
import BundleCTA from "@/components/BundleCTA";
import IcarusSection from "@/components/IcarusSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BookShowcase />
      <FeaturedReviewsSection />
      <QuotesSection />
      <TrustSection />
      <AuthorSection />
      <BundleCTA />
      <IcarusSection />
    </>
  );
}
