const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF Utility API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
