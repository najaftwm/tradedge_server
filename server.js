const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { generateAuthToken } = require('./utils/authToken');
const paymentRoutes = require('./routes/paymentRoutes');
const statusRoutes = require('./routes/statusRoutes');
const callbackRoutes = require('./routes/callbackRoutes');
const dbRoutes = require('./routes/dbRoutes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Generate token initially and refresh every 5 minutes
generateAuthToken();
setInterval(() => {
  console.log('🔄 Refreshing token...');
  generateAuthToken();
}, 5 * 60 * 1000);

// Routes
app.use('/api', paymentRoutes);
app.use('/api', statusRoutes);
app.use('/api', callbackRoutes);
app.use('/api', dbRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running 🫡  on http://localhost:${port}`);
});
