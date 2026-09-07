import { getFeaturedReviews, getCommunityStats } from "@/lib/reviews";
import { getApprovedGalleryPhotos } from "@/lib/gallery";
import ReviewCard from "./ReviewCard";
import ReaderMomentsVisual from "./ReaderMomentsVisual";
import GoldenSmoke from "@/components/GoldenSmoke";
import Link from "next/link";

export default async function FeaturedReviewsSection() {
  const [reviews, photos, stats] = await Promise.all([
    getFeaturedReviews(2),
    getApprovedGalleryPhotos(3),
    getCommunityStats()
  ]);

  const hasCommunityContent =
    stats.totalReviews > 0 || stats.totalPhotos > 0;

  return (
    <section className="relative overflow-hidden border-y border-bone/10 py-24 lg:py-28">
      <GoldenSmoke wisps={6} subtle />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_50%,rgba(90,30,42,0.18),transparent_65%)]"
        aria-hidden
      />

      <div className="container-editorial relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-ember">
              Cititorii lui Icarus
            </p>

            <div className="mt-5 border-l-2 border-ember/35 pl-6">
              <h2 className="font-serif text-2xl leading-relaxed text-bone sm:text-3xl lg:text-[2.15rem] lg:leading-[1.55]">
                Unele cărți se termină odată cu ultima pagină.
                <br />
                <span className="italic text-mist">
                  Altele continuă să te însoțească și după ce le-ai închis.
                </span>
              </h2>
            </div>

            <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ash">
              Fiecare carte pleacă din mâinile autorului și își găsește, în cele
              din urmă, propriul loc în mâinile unui cititor.
            </p>

            {hasCommunityContent ? (
              <p className="mt-5 font-sans text-[12px] text-mist/70">
                {stats.totalReviews > 0 && (
                  <span>
                    {stats.totalReviews}{" "}
                    {stats.totalReviews === 1 ? "recenzie" : "recenzii"}
                  </span>
                )}
                {stats.totalReviews > 0 && stats.totalPhotos > 0 && (
                  <span className="mx-2 text-bone/20">·</span>
                )}
                {stats.totalPhotos > 0 && (
                  <span>
                    {stats.totalPhotos}{" "}
                    {stats.totalPhotos === 1 ? "fotografie" : "fotografii"} din comunitate
                  </span>
                )}
              </p>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/lasa-o-recenzie" className="btn-primary">
                Lasă o recenzie
              </Link>
              <Link href="/galeria-cititorilor" className="btn-secondary">
                Galeria cititorilor
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            {reviews.length > 0 ? (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} variant="featured" />
                ))}
                <Link
                  href="/galeria-cititorilor"
                  className="inline-block font-sans text-[12px] text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:text-ember hover:decoration-ember"
                >
                  Vezi toate recenziile și fotografiile →
                </Link>
              </div>
            ) : (
              <ReaderMomentsVisual photos={photos} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
