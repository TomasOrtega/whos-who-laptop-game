// server/index.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client')));

// Mount your API routes
app.use('/api', apiRoutes);

// Export for tests/docs
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
  });
}