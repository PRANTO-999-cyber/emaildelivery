const logger = require("./logger");
const { redisOptions } = require("./redis.connection");
const { getSmtpTransport, closeAllPools } = require("./smtpPool");
const { renderTemplate } = require("./templateRenderer");

module.exports = {
  logger,
  redisOptions,
  getSmtpTransport,
  closeAllPools,
  renderTemplate,
};
