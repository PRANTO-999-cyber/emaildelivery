// server/worker/config/logger.js

const timestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message) => {
  return `[${timestamp()}] [${level}] ${message}`;
};

const logger = {
  info(message, ...args) {
    console.log(formatMessage("INFO", message), ...args);
  },

  success(message, ...args) {
    console.log(formatMessage("SUCCESS", message), ...args);
  },

  warn(message, ...args) {
    console.warn(formatMessage("WARN", message), ...args);
  },

  error(message, error = null) {
    console.error(formatMessage("ERROR", message));

    if (error) {
      console.error(error);
    }
  },

  debug(message, ...args) {
    if (process.env.NODE_ENV !== "production") {
      console.log(formatMessage("DEBUG", message), ...args);
    }
  },
};

export default logger;
