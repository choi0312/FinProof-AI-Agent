import { createMockReviewStore } from "./mock-review-store";
import type { ReviewStore } from "./review-store";

const defaultReviewStoreKey = Symbol.for("finproof.defaultReviewStore");

type GlobalWithReviewStore = typeof globalThis & {
  [defaultReviewStoreKey]?: ReviewStore;
};

function getGlobalReviewStoreSlot() {
  return globalThis as GlobalWithReviewStore;
}

export function getReviewStore() {
  const slot = getGlobalReviewStoreSlot();

  slot[defaultReviewStoreKey] ??= createMockReviewStore();

  return slot[defaultReviewStoreKey];
}

export function resetDefaultReviewStoreForTests() {
  getGlobalReviewStoreSlot()[defaultReviewStoreKey] = createMockReviewStore();
}

export type {
  AnalysisResult,
  CreateReviewCaseResult,
  ListIssuesOptions,
  ReviewStore,
  SaveIssueDecisionInput
} from "./review-store";
export { createMockReviewStore };
