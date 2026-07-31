/**
 * Promisified timeout helper to pause execution.
 *
 * @param {number} ms - Time to delay in milliseconds
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default delay;
