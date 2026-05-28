// @vitest-environment node

import { execFileSync } from "node:child_process";
import { createKnowledgeDocumentChunks, extractKnowledgeDocumentText } from "./knowledge-ingestion";

function pdftotextAvailable(): boolean {
  try {
    execFileSync("which", ["pdftotext"], { stdio: "ignore" });

    return true;
  } catch {
    return false;
  }
}

function minimalPdfWithText(text: string): Uint8Array {
  const stream = `BT /F1 24 Tf 100 700 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf, "ascii"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "ascii");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

describe("knowledge document ingestion", () => {
  it("extracts text bodies and creates embedded chunks for vector search", async () => {
    const body = new TextEncoder().encode(
      "최고 금리 표현은 우대 조건과 한도를 같은 화면에 표시해야 합니다.\n\n" +
        "가입 대상, 기간, 한도, 중도해지 이율은 소비자가 오인하지 않도록 명확히 고지합니다."
    );
    const text = await extractKnowledgeDocumentText({
      fileName: "deposit-policy.txt",
      contentType: "text/plain",
      body
    });
    const embed = vi.fn(async (texts: string[]) =>
      texts.map((_, index) => [index + 0.1, index + 0.2, index + 0.3])
    );

    const chunks = await createKnowledgeDocumentChunks({
      tenantId: "tenant-demo",
      documentId: "knowledge-001",
      text,
      embeddingProvider: {
        model: "fixture-embedding",
        embed
      }
    });

    expect(text).toContain("최고 금리 표현");
    expect(embed).toHaveBeenCalledWith([expect.stringContaining("가입 대상, 기간, 한도")]);
    expect(chunks).toEqual([
      expect.objectContaining({
        id: "chunk-knowledge-001-001",
        tenantId: "tenant-demo",
        knowledgeDocumentId: "knowledge-001",
        chunkText: expect.stringContaining("중도해지 이율"),
        chunkSummary: expect.stringContaining("최고 금리 표현"),
        embeddingModel: "fixture-embedding",
        embeddingId: "embedding-knowledge-001-001",
        metadata: expect.objectContaining({
          source: "knowledge_document",
          chunkIndex: 0,
          embeddingVector: [0.1, 0.2, 0.3]
        })
      })
    ]);
  });

  it.runIf(pdftotextAvailable())("extracts text from PDF attachments", async () => {
    const text = await extractKnowledgeDocumentText({
      fileName: "financial-ad-guideline.pdf",
      contentType: "application/pdf",
      body: minimalPdfWithText("maximum rate display conditions")
    });

    expect(text).toContain("maximum rate display conditions");
    expect(text).not.toContain("메타데이터 기반");
  });
});
