import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IssueList } from "./IssueList";
import type { ReviewIssue } from "@/domain/types";

const issues: ReviewIssue[] = [
  {
    id: "issue-1",
    issueType: "claim",
    riskLevel: "high",
    title: "최고 연 5.0% 조건 표시 부족",
    targetText: "최고 연 5.0% 적금!",
    targetBbox: [10, 10, 30, 8],
    sourceAgents: [],
    suggestedAction: "change_request",
    status: "open",
    description: "...",
    suggestedCopy: "...",
    evidence: []
  }
];

describe("IssueList", () => {
  it("renders issues with risk filter", async () => {
    const onSelect = vi.fn();
    render(<IssueList issues={issues} selectedIssueId="issue-1" onSelectIssue={onSelect} />);
    expect(screen.getByText("최고 연 5.0% 조건 표시 부족")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /최고 연 5.0%/ }));
    expect(onSelect).toHaveBeenCalledWith("issue-1");
  });

  it("filters by risk level chip", async () => {
    const issuesMix: ReviewIssue[] = [
      { ...issues[0], id: "h", riskLevel: "high", title: "High issue" },
      { ...issues[0], id: "i", riskLevel: "info", title: "Info issue" }
    ];
    render(<IssueList issues={issuesMix} selectedIssueId="h" onSelectIssue={() => undefined} />);
    await userEvent.click(screen.getByRole("button", { name: "위험" }));
    expect(screen.getByText("High issue")).toBeInTheDocument();
    expect(screen.queryByText("Info issue")).not.toBeInTheDocument();
  });
});
