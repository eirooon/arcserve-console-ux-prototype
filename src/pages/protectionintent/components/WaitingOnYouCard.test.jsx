import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import WaitingOnYouCard from "./WaitingOnYouCard";
import { useExclusiveDisclosure } from "../../../hooks/useExclusiveDisclosure";

const APPROVAL_ITEM = {
  id: "approval-1",
  type: "approval",
  category: "Auto-Protect",
  title: "New source found",
  timestamp: "Just now",
  description: "desc",
  source: "sample_machine_01",
  sourceType: "Windows (Agent)",
  currentPlan: "No plan",
  proposedPlan: "Mission-Critical",
  footerNote: "note",
  primaryActionLabel: "Approve",
  primaryActionKey: "approve",
};

function suggestion(id, source) {
  return {
    id,
    type: "suggestion",
    category: "Protection Health Check",
    title: "Consider a more frequent plan for this source",
    timestamp: "20 min ago",
    description: "desc",
    source,
    sourceType: "Windows (Agent)",
    currentPlan: "Standard",
    proposedPlan: "Business-Essential",
    footerNote: "Suggest only · no action taken",
    primaryActionLabel: "Apply in Plans",
    primaryActionKey: "apply-in-plans",
    primaryVariant: "outlined",
    primaryColor: "secondary",
  };
}

/** Mirrors how ArcGenieOverviewPage/ArcGenieWaitingOnYouPage wire the cards. */
function Harness({ items, onConfirmDismiss = vi.fn(), onDismiss = vi.fn() }) {
  const disclosure = useExclusiveDisclosure();
  return items.map((item) => (
    <WaitingOnYouCard
      key={item.id}
      item={item}
      onAction={vi.fn()}
      onDismiss={onDismiss}
      isDismissPanelOpen={disclosure.isOpen(item.id)}
      onOpenDismissPanel={() => disclosure.open(item.id)}
      onCloseDismissPanel={disclosure.close}
      onConfirmDismiss={onConfirmDismiss}
    />
  ));
}

describe("WaitingOnYouCard — approval/exception cards (unchanged)", () => {
  it("Not Now calls onDismiss directly, with no reason panel", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Harness items={[APPROVAL_ITEM]} onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: "Not Now" }));

    expect(onDismiss).toHaveBeenCalledWith(APPROVAL_ITEM);
    expect(screen.queryByText(/Why are you dismissing this/)).not.toBeInTheDocument();
  });
});

describe("WaitingOnYouCard — suggestion card dismiss panel", () => {
  it("clicking Dismiss opens the inline reason panel instead of dismissing immediately", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Harness items={[suggestion("s1", "sample_machine_05")]} onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.getByText(/Why are you dismissing this/)).toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("only one card's panel is open at a time", async () => {
    const user = userEvent.setup();
    render(
      <Harness
        items={[suggestion("s1", "sample_machine_05"), suggestion("s2", "sample_machine_09")]}
      />,
    );

    const [dismissA, dismissB] = screen.getAllByRole("button", { name: "Dismiss" });
    await user.click(dismissA);
    expect(screen.getAllByText(/Why are you dismissing this/)).toHaveLength(1);

    await user.click(dismissB);
    // Panel A's Collapse plays an exit transition before unmountOnExit
    // actually removes it, so give it a moment before asserting.
    await waitFor(() =>
      expect(screen.getAllByText(/Why are you dismissing this/)).toHaveLength(1),
    );
    // The first card's Dismiss trigger is back in the document (panel A closed).
    expect(screen.getAllByRole("button", { name: "Dismiss" })).toHaveLength(1);
  });

  it("Cancel closes the panel and returns focus to the Dismiss button", async () => {
    const user = userEvent.setup();
    render(<Harness items={[suggestion("s1", "sample_machine_05")]} />);

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    await user.click(dismissButton);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByText(/Why are you dismissing this/)).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: "Dismiss" })).toHaveFocus();
  });

  it("confirming calls onConfirmDismiss with the item and the panel's answer", async () => {
    const user = userEvent.setup();
    const onConfirmDismiss = vi.fn();
    const item = suggestion("s1", "sample_machine_05");
    render(<Harness items={[item]} onConfirmDismiss={onConfirmDismiss} />);

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await user.click(screen.getByRole("button", { name: "Dismiss suggestion" }));

    expect(onConfirmDismiss).toHaveBeenCalledWith(item, { reason: null, note: null });
  });
});
