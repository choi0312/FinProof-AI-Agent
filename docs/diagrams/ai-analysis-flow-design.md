# AI Analysis Flow Diagram Design Notes

## System Cartography

This diagram uses a product-architecture style rather than a decorative poster style. The visual language is intentionally restrained: three vertical lanes, clear directional flow, and color used only to distinguish infrastructure, analysis logic, AI model work, and persisted outputs.

The composition is built around the actual FinProof Agent code path: upload intake, analysis execution, persistence, and post-analysis assistant flows. The core pipeline is placed in the center so the viewer can read the system from left to right without needing explanatory paragraphs.

Labels are kept short and operational. API routes, storage, model tasks, and database writes are surfaced as compact annotations because these are the objects engineers need to verify quickly. The final file should read as a precise engineering artifact, not as a marketing diagram.

