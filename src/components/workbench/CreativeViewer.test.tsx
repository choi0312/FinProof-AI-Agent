import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreativeViewer } from "./CreativeViewer";
import type { ReviewIssue } from "@/domain/types";

const issue: ReviewIssue = {
  id: "issue-1",
  issueType: "claim",
  riskLevel: "high",
  title: "title",
  targetText: "text",
  targetBbox: [10, 10, 20, 8],
  sourceAgents: [],
  suggestedAction: "change_request",
  status: "open",
  description: "문제 원인 설명",
  suggestedCopy: "수정 방향 설명",
  evidence: []
};

describe("CreativeViewer", () => {
  it("fires onSelectIssue when a highlight box is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <CreativeViewer
        copy="카피"
        disclosure="공시"
        issues={[issue]}
        selectedIssueId="issue-1"
        onSelectIssue={onSelect}
      />
    );
    await userEvent.click(screen.getByTitle("title"));
    expect(onSelect).toHaveBeenCalledWith("issue-1");
  });

  it("renders a cause tooltip for a highlighted problem area", () => {
    render(
      <CreativeViewer
        copy="카피"
        disclosure="공시"
        issues={[issue]}
        selectedIssueId="issue-1"
        onSelectIssue={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /문제 영역 1: title/ })).toHaveAttribute(
      "aria-describedby",
      "highlight-tooltip-issue-1"
    );
    expect(screen.getByText("문제 원인")).toBeInTheDocument();
    expect(screen.getByText("문제 원인 설명")).toBeInTheDocument();
    expect(screen.getByText("수정 방향 설명")).toBeInTheDocument();
  });

  it("uses a visible fallback highlight when an uploaded issue has no bbox", () => {
    render(
      <CreativeViewer
        copy="해외 결제 5% 캐시백"
        disclosure="필수 고지 문구"
        issues={[{ ...issue, targetBbox: [0, 0, 0, 0], targetText: "해외 결제 5% 캐시백" }]}
        selectedIssueId="issue-1"
        onSelectIssue={vi.fn()}
      />
    );

    const highlight = screen.getByRole("button", { name: /문제 영역 1: title/ });

    expect(highlight).toHaveStyle({ width: "82%", height: "11%" });
  });
});
