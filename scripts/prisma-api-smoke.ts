import "dotenv/config";
import assert from "node:assert/strict";

const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or TEST_DATABASE_URL is required for Prisma API smoke");
}

process.env.DATABASE_URL = databaseUrl;
process.env.FINPROOF_REVIEW_STORE = "prisma";
process.env.FINPROOF_ENABLE_SAMPLE_DATA = "true";

function jsonRequest(path: string, body: unknown, method = "POST", role = "reviewer") {
  return new Request(`http://localhost${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      "x-finproof-role": role
    },
    body: JSON.stringify(body)
  });
}

function roleRequest(path: string, role: string, method = "GET") {
  return new Request(`http://localhost${path}`, {
    method,
    headers: { "x-finproof-role": role }
  });
}

function params<T extends Record<string, string>>(value: T) {
  return { params: Promise.resolve(value) };
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

async function main() {
  const [
    { resetDefaultReviewStoreForTests },
    { GET: listReviewCases, POST: createReviewCase },
    { GET: listAuditEvents }
  ] = await Promise.all([
    import("../src/server/reviews"),
    import("../src/app/api/v1/review-cases/route"),
    import("../src/app/api/v1/review-cases/[caseId]/audit-events/route")
  ]);

  resetDefaultReviewStoreForTests();

  const createResponse = await createReviewCase(
    jsonRequest("/api/v1/review-cases", { samplePackageId: "rc-demo-deposit-001" }, "POST")
  );
  assert.equal(createResponse.status, 201);
  const createBody = await readJson(createResponse);
  const createdReviewCase = createBody.reviewCase as Record<string, unknown>;
  const reviewCaseId = String(createdReviewCase.id);

  const requesterListResponse = await listReviewCases(
    roleRequest("/api/v1/review-cases", "requester")
  );
  assert.equal(requesterListResponse.status, 200);
  const requesterListBody = await readJson(requesterListResponse);
  const requesterCase = (requesterListBody.reviewCases as Array<Record<string, unknown>>).find(
    (reviewCase) => reviewCase.id === reviewCaseId
  );
  assert.deepEqual(requesterCase?.availableActions, []);

  const reviewerListResponse = await listReviewCases(
    roleRequest("/api/v1/review-cases", "reviewer")
  );
  assert.equal(reviewerListResponse.status, 200);
  const reviewerListBody = await readJson(reviewerListResponse);
  const reviewerCase = (reviewerListBody.reviewCases as Array<Record<string, unknown>>).find(
    (reviewCase) => reviewCase.id === reviewCaseId
  );
  assert.deepEqual(reviewerCase?.availableActions, ["start_analysis"]);

  const auditResponse = await listAuditEvents(
    roleRequest(`/api/v1/review-cases/${reviewCaseId}/audit-events`, "reviewer"),
    params({ caseId: reviewCaseId })
  );
  assert.equal(auditResponse.status, 200);
  const auditBody = await readJson(auditResponse);
  const auditEvents = auditBody.auditEvents as Array<Record<string, unknown>>;
  assert.ok(auditEvents.some((event) => event.action === "review_case.create_from_sample"));

  console.log(
    JSON.stringify(
      {
        ok: true,
        reviewCaseId,
        auditEvents: auditEvents.length
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
