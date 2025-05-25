// server/index.js

const express = require('express');
const path = require('path');
const os = require('os');
const apiRoutes = require('./routes/api');

const app = express();

/**
 * Configure Express to parse JSON bodies, URL-encoded data, and serve static files
 * from the client directory.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client')));

/**
 * Mount the application's API routes at /api.
 */
app.use('/api', apiRoutes);

/**
 * The Express app instance, exported for use in tests or external scripts.
 * @module app
 */
module.exports = app;

/**
 * Gets the first available external (non-internal) IPv4 address of the local machine.
 *
 * @function getFirstLocalIPv4Address
 * @returns {string|null} The IPv4 address found, or null if none.
 */
function getFirstLocalIPv4Address() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  // Return null if no external IPv4 address is found.
  return null;
}

// If this file is run directly (node server/index.js), start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  // Retrieve the first available external IPv4 address.
  const localHost = getFirstLocalIPv4Address();

  if (localHost) {
    app.listen(PORT, localHost, () => {
      console.log(`Server listening on http://${localHost}:${PORT}`);
    });
  } else {
    // Fallback to binding on all available interfaces if no specific IP is found.
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`No external IPv4 address found. Server listening on http://0.0.0.0:${PORT}`);
    });
  }
}