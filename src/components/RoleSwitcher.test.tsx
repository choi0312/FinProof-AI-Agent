import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoleSwitcher } from "./RoleSwitcher";

describe("RoleSwitcher", () => {
  it("switches the active mock user role", async () => {
    const user = userEvent.setup();
    render(<RoleSwitcher />);

    expect(screen.getByRole("button", { name: "Reviewer" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Requester" }));

    expect(screen.getByRole("button", { name: "Requester" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("현재 역할: Requester")).toBeInTheDocument();
  });
});
