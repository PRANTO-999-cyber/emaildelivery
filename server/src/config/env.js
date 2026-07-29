import dotenv from "dotenv";
dotenv.config();

const required = (key, fallback = undefined) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: required("NODE_ENV", "development"),
  port: Number(required("PORT", 5000)),
  clientUrl: required("CLIENT_URL", "http://localhost:5173"),

  mongoUri: required("MONGO_URI"),

  redis: {
    host: required("REDIS_HOST", "127.0.0.1"),
    port: Number(required("REDIS_PORT", 6379)),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    accessExpires: required("JWT_ACCESS_EXPIRES", "15m"),
    refreshExpires: required("JWT_REFRESH_EXPIRES", "7d"),
  },

  sendgrid: {
    apiKey: required("SENDGRID_API_KEY"),
    webhookVerificationKey: process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY || "",
    defaultFromEmail: required("DEFAULT_FROM_EMAIL"),
    defaultFromName: required("DEFAULT_FROM_NAME", "Your Company"),
  },

  appBaseUrl: required("APP_BASE_URL", "http://localhost:5000"),
};
