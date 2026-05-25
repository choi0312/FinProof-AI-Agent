import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getReviewCaseById } from "@/domain/reviews";
import { ReviewDetailWorkspace } from "./ReviewDetailWorkspace";

describe("ReviewDetailWorkspace", () => {
  it("does not show sample RAG answers when an uploaded case has no selected issue", () => {
    const uploadReview = {
      ...getReviewCaseById("rc-demo-deposit-001")!,
      id: "rc-upload-001",
      title: "실제 업로드 적금 홍보물",
      status: "analysis_complete" as const,
      highestRiskLevel: "info" as const,
      issues: [],
      promotionalCopy: "실제 업로드 자료 분석 대기",
      disclosure: "실제 업로드 건은 OCR/RAG 분석 전이므로 근거 부족 상태로 표시됩니다.",
      expectedDraft:
        "deposit 상품 실제 업로드 자료는 접수되었습니다. 현재 Demo MVP에서는 OCR/RAG 분석 전이므로 파일 분류와 누락 자료 확인 결과를 기준으로 추가 확인이 필요합니다.",
      analysisNotice: "실제 업로드 건은 OCR/RAG 분석 전이므로 근거 부족 상태로 표시됩니다."
    };

    render(<ReviewDetailWorkspace review={uploadReview} />);

    expect(screen.getByText("추가 확인 필요")).toBeInTheDocument();
    expect(screen.getAllByText(/OCR\/RAG 분석 전/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "질문 보내기" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "의견 초안에 반영" })).toBeDisabled();
    expect(screen.queryByText(/조건부 혜택임을/)).not.toBeInTheDocument();
  });

  it("runs selected issue chat, guards missing evidence, and saves reviewer decision", async () => {
    const user = userEvent.setup();
    render(<ReviewDetailWorkspace review={getReviewCaseById("rc-demo-deposit-001")!} />);

    await user.clear(screen.getByLabelText("RAG question"));
    await user.type(
      screen.getByLabelText("RAG question"),
      "약관에만 있는 중도해지 조건도 단정해도 되나요?"
    );
    await user.click(screen.getByRole("button", { name: "질문 보내기" }));

    expect(screen.getByText(/추가 확인 필요/)).toBeInTheDocument();

    await user.clear(screen.getByLabelText("RAG question"));
    await user.type(
      screen.getByLabelText("RAG question"),
      "우대금리 조건을 어느 수준까지 표시해야 하나요?"
    );
    await user.click(screen.getByRole("button", { name: "질문 보내기" }));
    await user.click(screen.getByRole("button", { name: "의견 초안에 반영" }));
    await user.click(screen.getByRole("button", { name: "수정 요청 의견 초안 생성" }));

    expect((screen.getByLabelText("Opinion draft") as HTMLTextAreaElement).value).toContain(
      "채팅 반영"
    );

    await user.selectOptions(screen.getByLabelText("Reviewer risk level"), "reject_recommended");
    await user.type(screen.getByLabelText("Reviewer comment"), "우대 조건 병기 필요");
    await user.click(screen.getByRole("button", { name: "판단 저장" }));

    expect(screen.getByText("저장된 판단: 반려 권고").closest(".saved-decision")).toHaveTextContent(
      "우대 조건 병기 필요"
    );
  });
});
