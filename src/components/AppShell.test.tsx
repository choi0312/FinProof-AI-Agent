import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AppShell } from "./AppShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/reviews"
}));

describe("AppShell", () => {
  it("renders Sprint 0 navigation and content shell", () => {
    render(
      <AppShell>
        <main>Review List Content</main>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /Review List/ })).toHaveAttribute("href", "/reviews");
    expect(screen.getByText("Review List Content")).toBeInTheDocument();
    expect(screen.getByText("현재 역할: Reviewer")).toBeInTheDocument();
  });
});
