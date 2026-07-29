// server/shared/utils/emailValidator.js

/**
 * Basic Email Format Validator
 */

export const isValidEmail = (email) => {
  if (!email) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
};

/**
 * Normalize Email
 * Used before storing emails
 */

export const normalizeEmail = (email) => {
  if (!email) {
    return null;
  }

  return email.trim().toLowerCase();
};

/**
 * Validate Multiple Emails
 * Useful for CSV contact import
 */

export const validateEmailList = (emails) => {
  if (!Array.isArray(emails)) {
    return {
      valid: false,

      invalid: [],
    };
  }

  const invalidEmails = emails.filter((email) => !isValidEmail(email));

  return {
    valid: invalidEmails.length === 0,

    invalid: invalidEmails,
  };
};

/**
 * Disposable Email Detection
 * Prevent temporary emails
 */

const disposableDomains = [
  "mailinator.com",

  "tempmail.com",

  "10minutemail.com",

  "guerrillamail.com",

  "throwawaymail.com",

  "yopmail.com",
];

export const isDisposableEmail = (email) => {
  if (!email) {
    return false;
  }

  const domain = email.split("@")[1]?.toLowerCase();

  return disposableDomains.includes(domain);
};

/**
 * Business Email Check
 * Reject free email providers
 */

const freeEmailProviders = [
  "gmail.com",

  "yahoo.com",

  "hotmail.com",

  "outlook.com",

  "icloud.com",
];

export const isBusinessEmail = (email) => {
  const domain = email?.split("@")[1]?.toLowerCase();

  return domain && !freeEmailProviders.includes(domain);
};

/**
 * Extract Domain
 */

export const getEmailDomain = (email) => {
  if (!email) {
    return null;
  }

  return email.split("@")[1]?.toLowerCase();
};

/**
 * Complete Email Validation
 * Used before sending campaigns
 */

export const validateEmail = (email, options = {}) => {
  const normalized = normalizeEmail(email);

  if (!isValidEmail(normalized)) {
    return {
      valid: false,

      reason: "Invalid email format",
    };
  }

  if (options.blockDisposable && isDisposableEmail(normalized)) {
    return {
      valid: false,

      reason: "Disposable email not allowed",
    };
  }

  if (options.businessOnly && !isBusinessEmail(normalized)) {
    return {
      valid: false,

      reason: "Business email required",
    };
  }

  return {
    valid: true,

    email: normalized,

    domain: getEmailDomain(normalized),
  };
};
