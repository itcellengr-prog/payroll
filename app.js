const express = require('express');
const firebaseRoutes = require('./firebase-routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Firebase Routes
app.use(firebaseRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send(`
    <h1>Firebase App Running</h1>
    <p>Test Firebase: <a href="/api/test">/api/test</a></p>
    <p>Get Users: <a href="/api/users">/api/users</a></p>
  `);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
