import {
  getCommunityStats,
  getHomepageReviews,
  toReviewDisplays
} from "@/lib/reviews";
import { getApprovedGalleryPhotos } from "@/lib/gallery";
import ReviewsGrid from "./ReviewsGrid";
import ReaderMomentsVisual from "./ReaderMomentsVisual";
import GoldenSmoke from "@/components/GoldenSmoke";
import Link from "next/link";

const PREVIEW_COUNT = 4;

export default async function FeaturedReviewsSection() {
  const [reviews, photos, stats] = await Promise.all([
    getHomepageReviews(PREVIEW_COUNT),
    getApprovedGalleryPhotos(3),
    getCommunityStats()
  ]);

  const hasCommunityContent =
    stats.totalReviews > 0 || stats.totalPhotos > 0;
  const hasMoreReviews = stats.totalReviews > PREVIEW_COUNT;

  return (
    <section className="relative overflow-hidden border-y border-bone/10 py-24 lg:py-28">
      <GoldenSmoke wisps={6} subtle />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(90,30,42,0.18),transparent_65%)]"
        aria-hidden
      />

      <div className="container-editorial relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-ember">
            Cititorii lui Icarus
          </p>

          <h2 className="mt-5 font-serif text-2xl leading-relaxed text-bone sm:text-3xl lg:text-[2.15rem] lg:leading-[1.55]">
            Unele cărți se termină odată cu ultima pagină.
            <br />
            <span className="italic text-mist">
              Altele continuă să te însoțească și după ce le-ai închis.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-ash">
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

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/lasa-o-recenzie" className="btn-primary">
              Lasă o recenzie
            </Link>
            <Link href="/galeria-cititorilor" className="btn-secondary">
              Galeria cititorilor
            </Link>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-16">
            <ReviewsGrid reviews={toReviewDisplays(reviews)} />
            {hasMoreReviews && (
              <div className="mt-10 text-center">
                <Link href="/recenzii" className="btn-secondary">
                  Vezi toate recenziile ({stats.totalReviews})
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto mt-14 max-w-2xl">
            <ReaderMomentsVisual photos={photos} />
          </div>
        )}
      </div>
    </section>
  );
}
