/**
 * @file templateRenderer.js
 * @description Lightweight template rendering engine for merge tag replacement.
 */

/**
 * Replaces double-curly tags in HTML/text strings with recipient attributes.
 * @param {string} template - HTML string containing {{variable}} placeholders
 * @param {Object} context - Recipient merge data dictionary
 * @returns {string} Rendered content
 */
function renderTemplate(template, context = {}) {
  if (!template) return "";

  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (match, key) => {
    const keys = key.split(".");
    let value = context;

    for (const k of keys) {
      if (value && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    return value !== undefined && value !== null ? String(value) : "";
  });
}

module.exports = {
  renderTemplate,
};
