import { describe, expect, it } from "vitest";
import { getAccountNameError, isValidClientId } from "./useAzureAccountDetails";

describe("isValidClientId", () => {
  it("accepts an Application (client) ID GUID", () => {
    expect(isValidClientId(" 7d2f9a41-3c8e-4b6d-a1f0-9e5c2b8d4a73 ")).toBe(true);
  });

  it("rejects anything that isn't a GUID", () => {
    expect(isValidClientId("Arcserve-Backup-App")).toBe(false);
    expect(isValidClientId("7d2f9a41-3c8e-4b6d-a1f0")).toBe(false);
  });
});

describe("getAccountNameError", () => {
  it("requires a name that no other cloud account uses", () => {
    expect(getAccountNameError("  ", [])).toMatch(/Enter/);
    expect(getAccountNameError("sample account name 02", ["Sample Account Name 02"])).toMatch(/already uses/);
    expect(getAccountNameError("Contoso Azure", ["Sample Account Name 02"])).toBeNull();
  });
});
