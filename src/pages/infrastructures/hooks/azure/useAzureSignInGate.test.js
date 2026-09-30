import { describe, expect, it } from "vitest";
import { DEMO_ACCOUNTS, SUBSCRIPTIONS } from "./azureMockData";
import { hasRight } from "./useAzureSignInGate";

const [itAdmin, backupOperator] = DEMO_ACCOUNTS;
const [production, development] = SUBSCRIPTIONS;

describe("hasRight", () => {
  it("checks role rights per subscription", () => {
    expect(hasRight(itAdmin, "assignRoles", { subscriptionId: production.id })).toBe(true);
    expect(hasRight(itAdmin, "assignRoles", { subscriptionId: development.id })).toBe(false);
  });

  it("checks app ownership by app name", () => {
    expect(hasRight(backupOperator, "appOwner", { appName: "Contoso-Backup-Automation" })).toBe(true);
    expect(hasRight(backupOperator, "appOwner", { appName: "Arcserve-Backup-App" })).toBe(false);
  });
});
