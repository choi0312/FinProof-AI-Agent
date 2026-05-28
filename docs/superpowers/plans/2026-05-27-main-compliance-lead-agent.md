# Main Compliance Lead Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the conditional conflict-resolution agent with a senior `main_compliance` lead agent that reviews sub-agent outputs and makes the final risk judgment.

**Architecture:** Domain agents continue to find specialized issue candidates. Conditional evidence and case-history agents can enrich those candidates. A final `main_compliance` agent then receives all prior findings and returns the consolidated final findings used for issue generation. Model routing forces `main_compliance` onto the escalation text model so it is above the default sub-agent tier.

**Tech Stack:** TypeScript, Vitest, existing `ModelProvider`, `ModelRouter`, `ReviewAnalysisPipeline`.

---

### Task 1: Tests

- [x] Update analysis pipeline tests to expect `main_compliance` instead of `conflict_resolution`.
- [x] Add a test that `main_compliance` receives `priorFindings` and its returned risk level becomes the final `agentFindings` risk.
- [x] Update model-router tests so `main_compliance` routes to `escalation_text`.

### Task 2: Orchestrator

- [x] Remove `conflict_resolution` from `ReviewSubAgentId`.
- [x] Add `main` to `ReviewSubAgentId`.
- [x] Add a `mainComplianceAgent` definition with id `main` and task `main_compliance`.
- [x] Run domain agents, optional `evidence_verification`, optional `case_search`, then always run `main_compliance` when there are prior findings.
- [x] Return `main` findings from `main_compliance` as the final finding set when non-empty.

### Task 3: Model Routing

- [x] Route `main_compliance` to `escalation_text` by default.
- [x] Route sensitive `main_compliance` calls to `highest_precision_text`.

### Task 4: Diagram

- [x] Update/create final agent diagram and copy PNG/SVG to Downloads.

### Task 5: Verification

- [x] Run focused tests.
- [x] Run lint.
- [x] Run build.
