const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Basic middlewares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: dbState === 1 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    service: 'University Blog CV Service',
    version: '1.0.0',
    status: 'running'
  });
});

// Placeholder routes
app.get('/professors', (req, res) => {
  res.json({ 
    message: 'Get professors endpoint - Coming soon',
    professors: []
  });
});

app.get('/professors/:id', (req, res) => {
  res.json({ 
    message: `Get professor ${req.params.id} - Coming soon`
  });
});

app.get('/careers', (req, res) => {
  res.json({ 
    message: 'Get careers endpoint - Coming soon',
    careers: []
  });
});

// Error handling
app.use((error, req, res, next) => {
  logger.error('CV service error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'CV service error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'CV endpoint not found'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`CV Service running on port ${PORT}`);
  });
};

startServer();

module.exports = app;