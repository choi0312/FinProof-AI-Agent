import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntakeStepper } from "./IntakeStepper";

describe("IntakeStepper", () => {
  it("marks meta done and upload active when a title exists but no files are selected", () => {
    render(<IntakeStepper hasTitle hasFiles={false} hasUploadResult={false} />);

    const items = screen.getAllByRole("listitem");

    expect(items[0]).toHaveAttribute("data-status", "done");
    expect(items[1]).toHaveAttribute("data-status", "active");
    expect(items[2]).toHaveAttribute("data-status", "pending");
    expect(items[3]).toHaveAttribute("data-status", "pending");
  });

  it("marks every step done after the review request is submitted", () => {
    render(<IntakeStepper hasTitle hasFiles hasUploadResult />);

    expect(
      screen.getAllByRole("listitem").every((item) => item.getAttribute("data-status") === "done")
    ).toBe(true);
  });
});
