import logger from "./logger.js";

/**
 * Basic template interpolation replacing {{key}} with values from payload.
 *
 * @param {string} template - The HTML or plain text string template.
 * @param {Object} data - The contact/variables object to interpolate.
 * @returns {string} Rendered template.
 */
export const renderTemplate = (template = "", data = {}) => {
  try {
    if (!template) return "";

    return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
      const value = key
        .split(".")
        .reduce(
          (obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined),
          data,
        );
      return value !== undefined ? value : "";
    });
  } catch (error) {
    logger.error(
      `[TemplateRenderer] Error rendering template: ${error.message}`,
    );
    return template;
  }
};

export default renderTemplate;
