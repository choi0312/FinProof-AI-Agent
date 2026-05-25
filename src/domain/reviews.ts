import sampleReviewCases from "@/data/sample-review-cases.json";
import type { ReviewCase, ReviewIssue, ReviewSummary, RiskLevel, RoleId } from "./types";

export const reviewCases = sampleReviewCases as ReviewCase[];

export const roles: Array<{ id: RoleId; label: string; description: string }> = [
  {
    id: "reviewer",
    label: "Reviewer",
    description: "AI 분석 결과 검토"
  },
  {
    id: "requester",
    label: "Requester",
    description: "심의 요청 생성"
  },
  {
    id: "compliance_admin",
    label: "Admin",
    description: "기준과 사례 관리"
  }
];

export const riskLabels: Record<RiskLevel, string> = {
  info: "참고",
  caution: "주의",
  high: "위험",
  reject_recommended: "반려 권고"
};

export const statusLabels: Record<ReviewCase["status"], string> = {
  draft: "초안",
  submitted: "제출됨",
  parsing: "자료 분석",
  analysis_in_progress: "AI 분석 중",
  analysis_complete: "AI 분석 완료",
  under_review: "심의 중",
  change_requested: "수정 요청",
  rejected: "반려",
  approved: "승인",
  on_hold: "보류",
  archived: "보관"
};

export function getReviewSummaries(): ReviewSummary[] {
  return reviewCases.map(
    ({
      id,
      title,
      affiliate,
      productType,
      plannedPublishDate,
      status,
      highestRiskLevel,
      requester,
      reviewer
    }) => ({
      id,
      title,
      affiliate,
      productType,
      plannedPublishDate,
      status,
      highestRiskLevel,
      requester,
      reviewer
    })
  );
}

export function getReviewCaseById(id: string): ReviewCase | undefined {
  return reviewCases.find((review) => review.id === id);
}

export function getRiskFilteredIssues(id: string, riskLevel: RiskLevel): ReviewIssue[] {
  return getReviewCaseById(id)?.issues.filter((issue) => issue.riskLevel === riskLevel) ?? [];
}

export function getIssueCounts(review: ReviewCase): Record<RiskLevel, number> {
  return review.issues.reduce<Record<RiskLevel, number>>(
    (counts, issue) => ({
      ...counts,
      [issue.riskLevel]: counts[issue.riskLevel] + 1
    }),
    {
      info: 0,
      caution: 0,
      high: 0,
      reject_recommended: 0
    }
  );
}
