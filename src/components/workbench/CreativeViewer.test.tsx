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
  description: "",
  suggestedCopy: "",
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
});
