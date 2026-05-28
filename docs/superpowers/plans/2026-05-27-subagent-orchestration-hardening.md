# Subagent Orchestration Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the AI analysis pipeline from three parallel finding generators into a cost-aware domain-agent flow with conditional verification, case search, and conflict resolution.

**Architecture:** Keep retrieval, OCR, and issue persistence boundaries unchanged. Expand `review-subagents.ts` so domain agents run first, then conditional agents run only when their inputs justify the extra model call. Preserve the existing `AgentFinding` output contract so downstream issue generation remains stable.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, existing `ModelProvider`, `ModelRouter`, `ReviewAnalysisPipeline`.

---

### Task 1: Add tests for the recommended analysis-agent flow

**Files:**
- Modify: `src/server/analysis/review-analysis-pipeline.test.ts`

- [ ] Add a test proving `creative_review`, `product_terms`, `regulation_agent`, and `internal_policy_agent` run as the default domain-agent set.
- [ ] Add a test proving `evidence_verification`, `case_search`, and `conflict_resolution` run only when domain findings make them necessary.
- [ ] Run `npm run test -- src/server/analysis/review-analysis-pipeline.test.ts` and confirm the new tests fail before implementation.

### Task 2: Harden `review-subagents.ts`

**Files:**
- Modify: `src/server/analysis/review-subagents.ts`

- [ ] Expand `ReviewSubAgentId` to include `regulation_agent`, `internal_policy_agent`, `case_search`, and `conflict_resolution`.
- [ ] Split agents into default domain agents and conditional quality agents.
- [ ] Run domain agents first.
- [ ] Run `evidence_verification` only when there are findings and at least one finding is high-risk, reject-recommended, low-confidence, or weakly evidenced.
- [ ] Run `case_search` only when there are findings and retrieved evidence includes `case_history` candidates.
- [ ] Run `conflict_resolution` only when findings show materially different risk levels, multiple domain agents disagree, or reject-recommended output appears.
- [ ] Pass route context flags that match existing `ModelRouter` escalation behavior.

### Task 3: Preserve issue generation compatibility

**Files:**
- Modify if needed: `src/server/analysis/issue-generation.ts`
- Test: `src/server/analysis/issue-generation.test.ts`

- [ ] Keep `AgentFinding` shape compatible with downstream `buildAnalysisIssues`.
- [ ] Ensure new agent IDs become `sourceAgents` without schema changes.
- [ ] Run focused tests for analysis and issue generation.

### Task 4: Generate final flow diagram

**Files:**
- Create: `docs/diagrams/subagent-orchestration-flow-design.md`
- Create: `docs/diagrams/finproof-subagent-orchestration-flow.svg`
- Create: `docs/diagrams/finproof-subagent-orchestration-flow.png`
- Copy: `/Users/jiwon/Downloads/finproof-subagent-orchestration-flow.png`
- Copy: `/Users/jiwon/Downloads/finproof-subagent-orchestration-flow.svg`

- [ ] Draw the final recommended agent set and conditional flow.
- [ ] Verify image dimensions and file existence.

### Task 5: Verification

**Commands:**
- `npm run test -- src/server/analysis/review-analysis-pipeline.test.ts src/server/analysis/issue-generation.test.ts src/server/ai/model-router.test.ts`
- `npm run lint`

- [ ] Report exact verification status and any remaining gaps.
