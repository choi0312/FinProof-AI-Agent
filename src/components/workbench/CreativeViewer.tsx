"use client";

import type { JSX } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { riskLabels } from "@/domain/reviews";
import type { ReviewIssue } from "@/domain/types";

export type CreativeViewerProps = {
  copy: string;
  disclosure: string;
  issues: ReviewIssue[];
  selectedIssueId?: string;
  onSelectIssue: (issueId: string) => void;
};

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function visibleBbox(issue: ReviewIssue): boolean {
  const [, , width, height] = issue.targetBbox;

  return width > 0 && height > 0;
}

function textMatchScore(issue: ReviewIssue, line: string): number {
  const target = normalizeText(issue.targetText).toLowerCase();
  const title = normalizeText(issue.title).toLowerCase();
  const candidate = normalizeText(line).toLowerCase();

  if (!candidate) {
    return 0;
  }

  if (target && (candidate.includes(target) || target.includes(candidate))) {
    return 4;
  }

  const terms = [...target.split(/\s+/), ...title.split(/\s+/)].filter((term) => term.length >= 2);
  const matches = terms.filter((term) => candidate.includes(term)).length;

  return terms.length > 0 ? matches / terms.length : 0;
}

function inferFallbackBbox(
  issue: ReviewIssue,
  index: number,
  issueCount: number,
  copy: string,
  disclosure: string
): [number, number, number, number] {
  const copyLines = copy
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const matchedLineIndex = copyLines.reduce(
    (best, line, lineIndex) => {
      const score = textMatchScore(issue, line);

      return score > best.score ? { lineIndex, score } : best;
    },
    { lineIndex: -1, score: 0 }
  );
  const target = `${issue.title} ${issue.targetText} ${issue.description}`.toLowerCase();
  const disclosureText = normalizeText(disclosure).toLowerCase();
  const isDisclosureIssue =
    disclosureText.includes(normalizeText(issue.targetText).toLowerCase()) ||
    /고지|경고|필수|누락|미표시|제한|주의|하단/.test(target);

  if (matchedLineIndex.lineIndex >= 0 && matchedLineIndex.score >= 0.28) {
    const lineTop = 27 + Math.min(matchedLineIndex.lineIndex, 4) * 11;
    const isHeadline = matchedLineIndex.lineIndex <= 1;

    return [9, lineTop, 82, isHeadline ? 11 : 8];
  }

  if (isDisclosureIssue) {
    return [7, 78, 86, 10];
  }

  const safeIssueCount = Math.max(1, issueCount);
  const step = Math.min(10, 48 / safeIssueCount);
  const top = Math.min(73, 30 + index * step);

  return [10, top, 80, Math.max(7, step - 1)];
}

function highlightBbox(
  issue: ReviewIssue,
  index: number,
  issueCount: number,
  copy: string,
  disclosure: string
): [number, number, number, number] {
  return visibleBbox(issue)
    ? issue.targetBbox
    : inferFallbackBbox(issue, index, issueCount, copy, disclosure);
}

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
        {issues.length > 0 ? (
          <div className="poster__analysis-note" aria-hidden="true">
            AI가 감지한 위험 영역 {issues.length}곳
          </div>
        ) : null}
        <strong className="poster__brand">FinProof Bank</strong>
        <div className="poster__copy">{copy}</div>
        <p>{disclosure}</p>
        {issues.map((issue, index) => {
          const [left, top, width, height] = highlightBbox(
            issue,
            index,
            issues.length,
            copy,
            disclosure
          );
          const tooltipId = `highlight-tooltip-${issue.id}`;
          const tooltipAlign = left > 52 ? "right" : "left";
          const reason = issue.description.trim() || "AI 분석 결과 추가 검토가 필요한 표현입니다.";
          return (
            <button
              key={issue.id}
              className="highlight-box"
              data-risk={issue.riskLevel}
              data-active={selectedIssueId === issue.id}
              data-tooltip-align={tooltipAlign}
              aria-describedby={tooltipId}
              aria-label={`문제 영역 ${index + 1}: ${issue.title}. 원인: ${reason}`}
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
              <span className="highlight-box__marker">{index + 1}</span>
              <span className="highlight-box__label">{issue.targetText}</span>
              <span id={tooltipId} className="highlight-box__tooltip" role="tooltip">
                <span className="highlight-box__tooltip-top">
                  <strong>{issue.title}</strong>
                  <em>{riskLabels[issue.riskLevel]}</em>
                </span>
                <span className="highlight-box__tooltip-section">
                  <b>문제 원인</b>
                  <span>{reason}</span>
                </span>
                {issue.suggestedCopy.trim().length > 0 ? (
                  <span className="highlight-box__tooltip-section">
                    <b>수정 방향</b>
                    <span>{issue.suggestedCopy}</span>
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
