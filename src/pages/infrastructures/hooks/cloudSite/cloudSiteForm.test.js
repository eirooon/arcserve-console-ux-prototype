import { describe, expect, it } from "vitest";
import {
  INITIAL_CLOUD_SITE_VALUES,
  applyFieldChange,
  buildCloudSiteRow,
  estimateMonthlyCost,
  firstInvalidField,
  formatMonthlyCost,
  generateGatewayAuthCode,
  validateCloudSite,
} from "./cloudSiteForm";

const valid = {
  ...INITIAL_CLOUD_SITE_VALUES,
  name: "east-site-01",
  cloudAccount: "Sample Account Name 01",
  region: "East US",
  resourceGroup: "backup-rg",
  hostName: "east-host-01",
  network: "contoso-prod-vnet",
  subnet: "default",
  securityGroup: "arcserve-site-nsg",
  password: "Str0ngPassw0rd",
  confirmPassword: "Str0ngPassw0rd",
  containerName: "arcserve-backups",
  encryptionPassword: "An0therSecret!",
  confirmEncryptionPassword: "An0therSecret!",
};

describe("validateCloudSite", () => {
  it("accepts a complete form", () => {
    expect(validateCloudSite(valid)).toEqual({});
  });

  it("requires every starred field on an empty form, reporting the topmost first", () => {
    const errors = validateCloudSite(INITIAL_CLOUD_SITE_VALUES);
    expect(Object.keys(errors).sort()).toEqual(
      [
        "name",
        "cloudAccount",
        "region",
        "resourceGroup",
        "hostName",
        "network",
        "securityGroup",
        "password",
        "confirmPassword",
        "containerName",
        "encryptionPassword",
        "confirmEncryptionPassword",
      ].sort(),
    );
    expect(firstInvalidField(errors)).toBe("name");
  });

  it("asks for a subnet only once a network is chosen", () => {
    expect(validateCloudSite({ ...valid, network: "", subnet: "" }).subnet).toBeUndefined();
    expect(validateCloudSite({ ...valid, subnet: "" }).subnet).toBe("Select a subnet.");
  });

  it("skips encryption passwords when encryption is off", () => {
    const errors = validateCloudSite({ ...valid, encryptData: false, encryptionPassword: "", confirmEncryptionPassword: "" });
    expect(errors).toEqual({});
  });

  it("rejects weak and mismatched passwords", () => {
    expect(validateCloudSite({ ...valid, password: "short", confirmPassword: "short" }).password).toMatch(/12 characters/);
    expect(validateCloudSite({ ...valid, confirmPassword: "Different0ne" }).confirmPassword).toBe("Passwords don't match.");
  });

  it("enforces name, host and container rules", () => {
    expect(validateCloudSite({ ...valid, name: "bad name" }).name).toBeDefined();
    expect(validateCloudSite({ ...valid, hostName: "-host" }).hostName).toBeDefined();
    expect(validateCloudSite({ ...valid, containerName: "Upper" }).containerName).toBeDefined();
    expect(validateCloudSite({ ...valid, containerName: "a--b" }).containerName).toBeDefined();
  });

  it("allows storage to be blank but not invalid", () => {
    expect(validateCloudSite({ ...valid, storageSize: "" }).storageSize).toBeUndefined();
    expect(validateCloudSite({ ...valid, storageSize: "1.5" }).storageSize).toBeDefined();
    expect(validateCloudSite({ ...valid, storageSize: "0" }).storageSize).toBeDefined();
  });
});

describe("estimateMonthlyCost", () => {
  it("is zero until a deployment size is picked", () => {
    expect(estimateMonthlyCost({ deploymentSize: "", storageSize: "100" })).toBe(0);
  });

  it("adds storage cost to the size's cost (design: Small + 340 GB = ~USD 9.60)", () => {
    expect(formatMonthlyCost(estimateMonthlyCost({ deploymentSize: "small", storageSize: "340" }))).toBe(
      "~USD 9.60/month",
    );
    expect(formatMonthlyCost(0)).toBe("~USD 0.00/month");
  });
});

describe("buildCloudSiteRow", () => {
  it("creates a deploying cloud site without any passwords", () => {
    const row = buildCloudSiteRow(valid, { registeredEmail: "me@mail.com", now: new Date("2026-01-01T00:00:00Z") });
    expect(row).toMatchObject({
      type: "site",
      siteType: "cloud_site",
      name: "east-site-01",
      host: "east-host-01",
      status: "deploying",
      deployProgress: 0,
      registeredEmail: "me@mail.com",
      lastContact: "2026-01-01T00:00:00.000Z",
    });
    expect(JSON.stringify(row)).not.toMatch(/Str0ng|An0ther/);
  });
});

describe("generateGatewayAuthCode", () => {
  it("returns a fresh URL-safe code each time", () => {
    const code = generateGatewayAuthCode();
    expect(code).toMatch(/^[A-Za-z0-9%]+$/);
    expect(code.length).toBeGreaterThan(150);
    expect(generateGatewayAuthCode()).not.toBe(code);
  });
});

describe("applyFieldChange", () => {
  it("fills in a deployment size's default storage", () => {
    const next = applyFieldChange(INITIAL_CLOUD_SITE_VALUES, "deploymentSize", "medium");
    expect(next).toMatchObject({ deploymentSize: "medium", storageSize: "525" });
  });

  it("clears the subnet when the network changes", () => {
    const next = applyFieldChange({ ...valid }, "network", "contoso-dev-vnet");
    expect(next).toMatchObject({ network: "contoso-dev-vnet", subnet: "" });
  });

  it("leaves other fields alone", () => {
    expect(applyFieldChange({ ...valid }, "name", "x")).toEqual({ ...valid, name: "x" });
  });
});
