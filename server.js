const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { generateAuthToken } = require('./utils/authToken');
const paymentRoutes = require('./routes/paymentRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Generate token initially and refresh every 5 minutes
generateAuthToken();
setInterval(() => {
  console.log('🔄 Refreshing token...');
  generateAuthToken();
}, 5 * 60 * 1000);

// Routes
app.use('/api', paymentRoutes);
app.use('/api', statusRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running 🫡  on http://localhost:${port}`);
});
