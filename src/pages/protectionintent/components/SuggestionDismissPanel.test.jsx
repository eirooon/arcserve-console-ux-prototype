import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SuggestionDismissPanel from "./SuggestionDismissPanel";

function setup() {
  const user = userEvent.setup();
  const onCancel = vi.fn();
  const onConfirm = vi.fn();
  render(<SuggestionDismissPanel source="sample_machine_05" onCancel={onCancel} onConfirm={onConfirm} />);
  return { user, onCancel, onConfirm };
}

describe("SuggestionDismissPanel", () => {
  it("moves focus to the first reason radio on open", () => {
    setup();
    expect(screen.getByRole("radio", { name: "Intentional, this source is fine as is" })).toHaveFocus();
  });

  it("confirms with no reason selected (reason is optional) and null note", async () => {
    const { user, onConfirm } = setup();

    await user.click(screen.getByRole("button", { name: "Dismiss suggestion" }));

    expect(onConfirm).toHaveBeenCalledWith({ reason: null, note: null });
  });

  it("confirms with the chosen reason and typed note", async () => {
    const { user, onConfirm } = setup();

    await user.click(screen.getByRole("radio", { name: "The suggested plan is wrong" }));
    await user.type(screen.getByLabelText("Note for the audit trail (optional)"), "Dev box, rebuilt from image");
    await user.click(screen.getByRole("button", { name: "Dismiss suggestion" }));

    expect(onConfirm).toHaveBeenCalledWith({
      reason: "wrong-plan",
      note: "Dev box, rebuilt from image",
    });
  });

  it("shows ArcGenie's won't-repeat helper text for this source", () => {
    setup();
    expect(
      screen.getByText(
        "ArcGenie won't suggest this again for sample_machine_05 unless its recovery points fall further behind.",
      ),
    ).toBeInTheDocument();
  });

  it("cancel discards input and calls onCancel without confirming", async () => {
    const { user, onCancel, onConfirm } = setup();

    await user.click(screen.getByRole("radio", { name: "Other" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
