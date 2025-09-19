const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Database connection
let dbPool;
const initDatabase = async () => {
  try {
    dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    });
    
    // Test connection
    const connection = await dbPool.getConnection();
    await connection.ping();
    connection.release();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos de login por IP
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts, please try again later'
  }
});

app.use('/login', authLimiter);
app.use('/register', authLimiter);

// Basic middlewares
app.use(express.json({ limit: '1mb' }));
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
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const connection = await dbPool.getConnection();
    await connection.ping();
    connection.release();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Basic routes
app.get('/', (req, res) => {
  res.json({
    service: 'University Blog Auth Service',
    version: '1.0.0',
    status: 'running'
  });
});

// Placeholder routes (implementaremos mañana)
app.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - Coming soon' });
});

app.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - Coming soon' });
});

app.post('/refresh', (req, res) => {
  res.json({ message: 'Token refresh endpoint - Coming soon' });
});

app.get('/verify', (req, res) => {
  res.json({ message: 'Token verification endpoint - Coming soon' });
});

// Error handling
app.use((error, req, res, next) => {
  logger.error('Auth service error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Authentication service error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Auth endpoint not found'
  });
});

// Start server
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    logger.info(`Auth Service running on port ${PORT}`);
  });
};

startServer();

module.exports = app;