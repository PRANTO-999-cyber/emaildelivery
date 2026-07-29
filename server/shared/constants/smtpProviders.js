/**
 * ==========================================================
 * SMTP Providers
 * ==========================================================
 */

const SMTP_PROVIDERS = {
  GMAIL: {
    id: "gmail",
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },

  OUTLOOK: {
    id: "outlook",
    name: "Outlook",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },

  HOTMAIL: {
    id: "hotmail",
    name: "Hotmail",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },

  YAHOO: {
    id: "yahoo",
    name: "Yahoo",
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },

  ZOHO: {
    id: "zoho",
    name: "Zoho Mail",
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },

  BREVO: {
    id: "brevo",
    name: "Brevo",
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "api-key",
  },

  MAILGUN: {
    id: "mailgun",
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },

  SENDGRID: {
    id: "sendgrid",
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    tls: true,
    authType: "api-key",
  },

  AMAZON_SES: {
    id: "amazon_ses",
    name: "Amazon SES",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "access-key",
  },

  POSTMARK: {
    id: "postmark",
    name: "Postmark",
    host: "smtp.postmarkapp.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "api-key",
  },

  MAILJET: {
    id: "mailjet",
    name: "Mailjet",
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "api-key",
  },

  SPARKPOST: {
    id: "sparkpost",
    name: "SparkPost",
    host: "smtp.sparkpostmail.com",
    port: 587,
    secure: false,
    tls: true,
    authType: "api-key",
  },

  ELASTIC_EMAIL: {
    id: "elastic_email",
    name: "Elastic Email",
    host: "smtp.elasticemail.com",
    port: 2525,
    secure: false,
    tls: true,
    authType: "api-key",
  },

  CUSTOM: {
    id: "custom",
    name: "Custom SMTP",
    host: "",
    port: 587,
    secure: false,
    tls: true,
    authType: "password",
  },
};

export default SMTP_PROVIDERS;
