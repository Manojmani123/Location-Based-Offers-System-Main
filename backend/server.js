require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const globalErrorHandler = require('./src/middlewares/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const businessRoutes = require('./src/routes/businessRoutes');
const offerRoutes = require('./src/routes/offerRoutes');

const app = express();

// Connect to Database
connectDB();

// Global Middlewares
app.use(helmet()); 
app.use(cors());     
app.use(express.json({ limit: '10kb' })); // Body parser

// Global Rate Limiting
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// API Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/businesses', businessRoutes);
app.use('/api/v1/offers', offerRoutes);

// Handle unhandled routes
app.use((req, res, next) => {
  const AppError = require('./src/utils/AppError');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
