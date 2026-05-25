# Component Preview Decision

Date: 2026-05-25

## Decision

Do not add Storybook in Sprint 0. Use the running Next.js routes as the component preview surface and Vitest component tests for behavior.

## Rationale

Sprint 0 needs a small local app skeleton, not a separate design-system workflow. Storybook can be added when shared components become numerous enough to need isolated visual review.
