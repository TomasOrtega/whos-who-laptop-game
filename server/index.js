// server/index.js
const express = require('express');
const path = require('path');
const os = require('os');
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client')));

// Mount your API routes
app.use('/api', apiRoutes);

// Export for tests/docs
module.exports = app;

/**
 * Gets the first available external (non-internal) IPv4 address.
 * @returns {string|null} The IPv4 address, or null if none found.
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