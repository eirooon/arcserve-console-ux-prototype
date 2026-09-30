import { MAX_STORAGE_GB, STORAGE_COST_PER_GB, getDeploymentSize } from "./cloudSiteOptions";

/**
 * @typedef {object} CloudSiteValues
 * @property {string} name
 * @property {string} cloudAccount
 * @property {string} deploymentSize
 * @property {string} storageSize
 * @property {string} region
 * @property {string} resourceGroup
 * @property {string} hostName
 * @property {string} network
 * @property {string} subnet
 * @property {string} securityGroup
 * @property {boolean} autoAssignPublicIp
 * @property {string} password
 * @property {string} confirmPassword
 * @property {string} containerName
 * @property {boolean} encryptData
 * @property {string} encryptionPassword
 * @property {string} confirmEncryptionPassword
 */

/** @type {CloudSiteValues} */
export const INITIAL_CLOUD_SITE_VALUES = {
  name: "",
  cloudAccount: "",
  deploymentSize: "",
  storageSize: "",
  region: "",
  resourceGroup: "",
  hostName: "",
  network: "",
  subnet: "",
  securityGroup: "",
  autoAssignPublicIp: false,
  password: "",
  confirmPassword: "",
  containerName: "",
  encryptData: true,
  encryptionPassword: "",
  confirmEncryptionPassword: "",
};

// Field order on screen — validation errors are reported (and focused) in
// this order so the first one is the topmost on the form.
export const CLOUD_SITE_FIELD_ORDER = Object.keys(INITIAL_CLOUD_SITE_VALUES);

const VM_NAME_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,62}[A-Za-z0-9])?$/;
const HOST_NAME_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const CONTAINER_NAME_PATTERN = /^(?!.*--)[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

export const CONTAINER_NAME_RULES =
  "3–63 characters: lowercase letters, numbers and single hyphens, starting and ending with a letter or number.";

const MIN_PASSWORD_LENGTH = 12;
const PASSWORD_CHARACTER_CLASSES = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/];

// Cloud VM admin passwords need 12+ characters from at least 3 of the 4
// character classes.
function isStrongPassword(password) {
  const classes = PASSWORD_CHARACTER_CLASSES.filter((pattern) => pattern.test(password)).length;
  return password.length >= MIN_PASSWORD_LENGTH && classes >= 3;
}

const WEAK_PASSWORD_MESSAGE = `Use at least ${MIN_PASSWORD_LENGTH} characters with 3 of: uppercase, lowercase, number, symbol.`;

function validatePasswordPair(password, confirm, errors, [passwordKey, confirmKey]) {
  if (!password) errors[passwordKey] = "Enter a password.";
  else if (!isStrongPassword(password)) errors[passwordKey] = WEAK_PASSWORD_MESSAGE;
  if (!confirm) errors[confirmKey] = "Confirm the password.";
  else if (confirm !== password) errors[confirmKey] = "Passwords don't match.";
}

/**
 * Every problem with `values`, keyed by field. An empty object means the
 * Site Properties step can move on.
 * @param {CloudSiteValues} values
 * @returns {Partial<Record<keyof CloudSiteValues, string>>}
 */
export function validateCloudSite(values) {
  const errors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Enter a site name.";
  else if (!VM_NAME_PATTERN.test(name))
    errors.name = "Use up to 64 letters, numbers or hyphens, starting and ending with a letter or number.";

  if (!values.cloudAccount) errors.cloudAccount = "Select a cloud account.";

  const storage = values.storageSize.trim();
  if (storage) {
    const gb = Number(storage);
    if (!Number.isInteger(gb) || gb < 1 || gb > MAX_STORAGE_GB)
      errors.storageSize = `Enter a whole number from 1 to ${MAX_STORAGE_GB}.`;
  }

  if (!values.region) errors.region = "Select a region.";
  if (!values.resourceGroup) errors.resourceGroup = "Select a resource group.";

  const hostName = values.hostName.trim();
  if (!hostName) errors.hostName = "Enter a host name.";
  else if (!HOST_NAME_PATTERN.test(hostName))
    errors.hostName = "Use up to 63 letters, numbers or hyphens, starting and ending with a letter or number.";

  if (!values.network) errors.network = "Select a network.";
  // Subnet can't be chosen until there's a network, whose own error covers it.
  if (values.network && !values.subnet) errors.subnet = "Select a subnet.";
  if (!values.securityGroup) errors.securityGroup = "Select a security group.";

  validatePasswordPair(values.password, values.confirmPassword, errors, ["password", "confirmPassword"]);

  const container = values.containerName.trim();
  if (!container) errors.containerName = "Enter a container/bucket name.";
  else if (!CONTAINER_NAME_PATTERN.test(container)) errors.containerName = CONTAINER_NAME_RULES;

  if (values.encryptData) {
    validatePasswordPair(values.encryptionPassword, values.confirmEncryptionPassword, errors, [
      "encryptionPassword",
      "confirmEncryptionPassword",
    ]);
  }
  return errors;
}

// Fields that change along with another: a new network clears the subnet
// (subnets belong to a network); a new deployment size fills in its default
// storage, which the user can still edit.
const DEPENDENT_UPDATES = {
  network: () => ({ subnet: "" }),
  deploymentSize: (value) => {
    const size = getDeploymentSize(value);
    return size ? { storageSize: String(size.storageGb) } : {};
  },
};

/**
 * `values` with `field` set to `value`, plus any dependent field updates.
 * @param {CloudSiteValues} values
 * @param {keyof CloudSiteValues} field
 * @returns {CloudSiteValues}
 */
export function applyFieldChange(values, field, value) {
  return { ...values, [field]: value, ...DEPENDENT_UPDATES[field]?.(value) };
}

/** First field with an error, in on-screen order, or null. */
export function firstInvalidField(errors) {
  return CLOUD_SITE_FIELD_ORDER.find((field) => errors[field]) ?? null;
}

/**
 * Estimated USD/month for the chosen size and storage; 0 until a size is
 * picked. Invalid storage input counts as none.
 */
export function estimateMonthlyCost({ deploymentSize, storageSize }) {
  const size = getDeploymentSize(deploymentSize);
  if (!size) return 0;
  const gb = Number(storageSize);
  const storageCost = Number.isFinite(gb) && gb > 0 ? gb * STORAGE_COST_PER_GB : 0;
  return size.monthlyCost + storageCost;
}

const usdFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "~USD 70.08/month" — the Estimated Cost format in the design. */
export function formatMonthlyCost(amount) {
  return `~USD ${usdFormatter.format(amount)}/month`;
}

/**
 * The Sites table row created for a new cloud site. Passwords are never
 * stored on the row. It starts deploying at 0%.
 * @param {CloudSiteValues} values
 * @param {{ registeredEmail: string, now?: Date }} context
 */
export function buildCloudSiteRow(values, { registeredEmail, now = new Date() }) {
  return {
    type: "site",
    siteType: "cloud_site",
    name: values.name.trim(),
    cloudAccount: values.cloudAccount,
    registeredEmail,
    host: values.hostName.trim(),
    version: "1.1",
    status: "deploying",
    deployProgress: 0,
    lastContact: now.toISOString(),
    deployment: {
      size: values.deploymentSize || null,
      storageGb: values.storageSize.trim() ? Number(values.storageSize) : null,
      region: values.region,
      resourceGroup: values.resourceGroup,
      network: values.network,
      subnet: values.subnet,
      securityGroup: values.securityGroup,
      autoAssignPublicIp: values.autoAssignPublicIp,
      containerName: values.containerName.trim(),
      encryptData: values.encryptData,
    },
  };
}

// Stand-in for the gateway authorization code a real "configure cloud site"
// API would return: 144 random bytes, base64 + URL-encoded like the design's
// sample. Shown once on Summary and never stored on the Sites row.
const AUTH_CODE_BYTES = 144;

export function generateGatewayAuthCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(AUTH_CODE_BYTES));
  return encodeURIComponent(btoa(String.fromCharCode(...bytes)));
}
