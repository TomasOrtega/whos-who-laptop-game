const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json());
app.use('/api', require('./routes/api'));
app.use(express.static(path.join(__dirname, '../client')));
app.use((error, req, res, next) => {
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  if (status === 500) console.error(error);
  res.status(status).json({
    message: status === 500 ? 'Unable to load the game.' : 'Invalid request body.'
  });
});

module.exports = app;

if (require.main === module) {
  const server = app.listen(process.env.PORT || 3000, () => {
    const { port } = server.address();
    console.log(`Server listening on http://localhost:${port}`);
    const address = Object.values(os.networkInterfaces()).flat()
      .find(iface => iface.family === 'IPv4' && !iface.internal)?.address;
    if (address) console.log(`Local network: http://${address}:${port}`);
  });
}
