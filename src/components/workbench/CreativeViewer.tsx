"use client";

import type { JSX } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import type { ReviewIssue } from "@/domain/types";

export type CreativeViewerProps = {
  copy: string;
  disclosure: string;
  issues: ReviewIssue[];
  selectedIssueId?: string;
  onSelectIssue: (issueId: string) => void;
};

export function CreativeViewer({
  copy,
  disclosure,
  issues,
  selectedIssueId,
  onSelectIssue
}: CreativeViewerProps): JSX.Element {
  return (
    <section className="creative-viewer">
      <div className="viewer-toolbar" aria-label="문서 보기 도구">
        <button className="icon-button icon-button--small" type="button" aria-label="축소">
          <Minus size={15} aria-hidden="true" />
        </button>
        <span>100%</span>
        <button className="icon-button icon-button--small" type="button" aria-label="확대">
          <Plus size={15} aria-hidden="true" />
        </button>
        <span>1 / 1</span>
        <button className="icon-button icon-button--small" type="button" aria-label="전체 화면">
          <Maximize2 size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="poster">
        <strong className="poster__brand">FinProof Bank</strong>
        <div className="poster__copy">{copy}</div>
        <p>{disclosure}</p>
        {issues.map((issue, index) => {
          const [left, top, width, height] = issue.targetBbox;
          return (
            <button
              key={issue.id}
              className="highlight-box"
              data-risk={issue.riskLevel}
              data-active={selectedIssueId === issue.id}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`
              }}
              type="button"
              title={issue.title}
              onClick={() => onSelectIssue(issue.id)}
            >
              <span>{index + 1}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
