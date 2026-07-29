import Handlebars from "handlebars";

/**
 * Compiles HTML and plain text email bodies with dynamic contact tags.
 *
 * @param {string} templateBody - Raw HTML template containing {{mustache}} tags
 * @param {Object} recipientVariables - Key-value pair of subscriber variables
 * @returns {string} Compiled output string
 */
export const compileTemplate = (templateBody, recipientVariables = {}) => {
  if (!templateBody) return "";
  try {
    const template = Handlebars.compile(templateBody);
    return template(recipientVariables);
  } catch (err) {
    console.error("Template compilation failure:", err.message);
    return templateBody; // Fallback to raw body on syntax failure
  }
};
