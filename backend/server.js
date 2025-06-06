const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const paymentRoutes = require('./routes/paymentRoutes'); // Import paymentRoutes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import analyticsRoutes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // To handle CORS issues between frontend and backend

// Routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth', authRoutes); // Register auth routes
app.use('/api/payments', paymentRoutes); // Register payment routes
app.use('/api/analytics', analyticsRoutes); // Register analytics routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Listen on dynamic port provided by Render or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
