import {
  getReviewCaseById,
  getReviewSummaries,
  getRiskFilteredIssues,
  reviewCases
} from "./reviews";

describe("review sample data", () => {
  it("contains the two Demo MVP cases from the handoff", () => {
    expect(reviewCases).toHaveLength(2);
    expect(getReviewSummaries().map((review) => review.id)).toEqual([
      "rc-demo-deposit-001",
      "rc-demo-loan-001"
    ]);
  });

  it("returns deposit detail with highlighted rate and misleading expression issues", () => {
    const review = getReviewCaseById("rc-demo-deposit-001");

    expect(review?.title).toBe("최고 연 5.0% 적금 홍보물 심의");
    expect(review?.issues.map((issue) => issue.targetText)).toEqual(
      expect.arrayContaining(["최고 연 5.0%", "누구나 최고금리 혜택"])
    );
  });

  it("filters issues by risk level", () => {
    const highIssues = getRiskFilteredIssues("rc-demo-deposit-001", "high");

    expect(highIssues).toHaveLength(2);
    expect(highIssues.every((issue) => issue.riskLevel === "high")).toBe(true);
  });
});
