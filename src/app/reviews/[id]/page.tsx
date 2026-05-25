import { notFound } from "next/navigation";
import { ReviewDetailWorkspace } from "@/components/ReviewDetailWorkspace";
import { getReviewCaseById, reviewCases } from "@/domain/reviews";

export function generateStaticParams() {
  return reviewCases.map((review) => ({ id: review.id }));
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = getReviewCaseById(id);

  if (!review) {
    notFound();
  }

  return <ReviewDetailWorkspace review={review} />;
}
