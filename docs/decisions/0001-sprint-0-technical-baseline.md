# Sprint 0 Technical Baseline

Date: 2026-05-25

## Decision

Use Next.js App Router, TypeScript, React, Vitest, Testing Library, ESLint, and Prettier for Sprint 0.

## Rationale

The Development Handoff assumes a Next.js frontend and prioritizes a local Demo MVP that can show the dashboard, review list, review detail workspace, mock roles, and sample data before real OCR/RAG integrations are connected.

## Deferred Choices

- Backend framework: keep API contracts in docs first; defer FastAPI versus NestJS until Sprint 2.
- Vector DB: use PostgreSQL with pgvector as the first candidate, matching the handoff preference for PostgreSQL and pgvector.
- OCR: use deterministic text fixtures in Demo MVP; keep OCR behind an adapter for later cloud OCR or PaddleOCR/Tesseract evaluation.
