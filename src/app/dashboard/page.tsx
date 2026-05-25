import Link from "next/link";
import { getIssueCounts, reviewCases } from "@/domain/reviews";
import { ReviewTable } from "@/components/ReviewTable";

export default function DashboardPage() {
  const totalIssues = reviewCases.reduce((sum, review) => sum + review.issues.length, 0);
  const rejectRecommended = reviewCases.reduce(
    (sum, review) => sum + getIssueCounts(review).reject_recommended,
    0
  );

  return (
    <>
      <section className="dashboard-grid" aria-label="Review metrics">
        <div className="metric">
          <span>심의 건</span>
          <strong>{reviewCases.length}</strong>
        </div>
        <div className="metric">
          <span>AI 탐지 이슈</span>
          <strong>{totalIssues}</strong>
        </div>
        <div className="metric">
          <span>반려 권고</span>
          <strong>{rejectRecommended}</strong>
        </div>
      </section>
      <ReviewTable />
      <p className="empty-route" style={{ marginTop: 16 }}>
        <Link className="button" href="/reviews/rc-demo-deposit-001">
          예금/적금 Demo 열기
        </Link>
      </p>
    </>
  );
}
