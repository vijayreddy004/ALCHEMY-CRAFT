require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const mixRoutes = require('./routes/mix');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/mix', mixRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
