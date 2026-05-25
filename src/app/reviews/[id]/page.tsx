import { notFound } from "next/navigation";
import { ReviewDetailWorkspace } from "@/components/ReviewDetailWorkspace";
import { reviewCases } from "@/domain/reviews";
import { getReviewStore } from "@/server/reviews";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return reviewCases.map((review) => ({ id: review.id }));
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReviewStore().getReviewCase(id);

  if (!review) {
    notFound();
  }

  return <ReviewDetailWorkspace review={review} />;
}
