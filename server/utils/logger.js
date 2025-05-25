// server/utils/logger.js

/**
 * Logs a message to the console with a timestamp in ISO format.
 *
 * @param {string} message - The message to log.
 * @returns {void} This function does not return anything.
 */
function logMessage(message) {
  console.log(`[LOG ${new Date().toISOString()}] ${message}`);
}

module.exports = {
  logMessage
};