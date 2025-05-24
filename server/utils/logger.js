// server/utils/logger.js

/**
 * Logs a message with a timestamp.
 * @param {string} message
 */
function logMessage(message) {
  console.log(`[LOG ${new Date().toISOString()}] ${message}`);
}

module.exports = {
  logMessage
};