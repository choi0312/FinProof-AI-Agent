import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueueTable } from "./QueueTable";
import type { ReviewSummary } from "@/domain/types";

const baseRow: ReviewSummary = {
  id: "RC-2026-001",
  title: "최고 연 5.0% 적금 홍보물 심의",
  affiliate: "광주은행",
  productType: "deposit",
  plannedPublishDate: "2026-06-10",
  status: "analysis_waiting",
  highestRiskLevel: "info",
  requester: "김요청",
  reviewer: "박심의"
};

describe("QueueTable", () => {
  it("renders header and rows", () => {
    render(
      <QueueTable
        rows={[baseRow]}
        activeRole="reviewer"
        activeAnalysisId={null}
        onStartAnalysis={() => undefined}
        onOpenReview={() => undefined}
      />
    );
    expect(screen.getByText("심의 ID")).toBeInTheDocument();
    expect(screen.getByText("RC-2026-001")).toBeInTheDocument();
  });

  it("fires onStartAnalysis when reviewer clicks start button on analysis_waiting row", async () => {
    const onStart = vi.fn();
    render(
      <QueueTable
        rows={[baseRow]}
        activeRole="reviewer"
        activeAnalysisId={null}
        onStartAnalysis={onStart}
        onOpenReview={() => undefined}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /AI 분석 시작/ }));
    expect(onStart).toHaveBeenCalledWith(baseRow);
  });

  it("navigates via row click when case is openable", async () => {
    const onOpen = vi.fn();
    render(
      <QueueTable
        rows={[{ ...baseRow, status: "analysis_complete" }]}
        activeRole="reviewer"
        activeAnalysisId={null}
        onStartAnalysis={() => undefined}
        onOpenReview={onOpen}
      />
    );
    await userEvent.click(screen.getByRole("row", { name: /최고 연 5.0%/ }));
    expect(onOpen).toHaveBeenCalledWith("RC-2026-001");
  });
});
