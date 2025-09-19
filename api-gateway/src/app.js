const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar logger
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
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    error: 'Too many requests from this IP, please try again later'
  }
});
app.use(limiter);

// Middlewares básicos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      cv: process.env.CV_SERVICE_URL,
      files: process.env.FILE_SERVICE_URL
    }
  });
});

// Middleware de verificación de servicios
const checkServiceHealth = async (serviceUrl, serviceName) => {
  try {
    const axios = require('axios');
    await axios.get(`${serviceUrl}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    logger.error(`Service ${serviceName} is down: ${error.message}`);
    return false;
  }
};

// Proxy configurations
const proxyOptions = {
  changeOrigin: true,
  timeout: 30000,
  onError: (err, req, res) => {
    logger.error('Proxy error:', err);
    res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'Please try again later'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.debug(`Proxying ${req.method} ${req.path} to ${proxyReq.path}`);
  }
};

// Rutas del API Gateway
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  pathRewrite: {
    '^/api/auth': ''
  },
  ...proxyOptions
}));

app.use('/api/professors', createProxyMiddleware({
  target: process.env.CV_SERVICE_URL || 'http://localhost:3002',
  pathRewrite: {
    '^/api/professors': '/professors'
  },
  ...proxyOptions
}));

app.use('/api/careers', createProxyMiddleware({
  target: process.env.CV_SERVICE_URL || 'http://localhost:3002',
  pathRewrite: {
    '^/api/careers': '/careers'
  },
  ...proxyOptions
}));

app.use('/api/files', createProxyMiddleware({
  target: process.env.FILE_SERVICE_URL || 'http://localhost:3003',
  pathRewrite: {
    '^/api/files': '/files'
  },
  ...proxyOptions
}));

// Ruta de información de la API
app.get('/api', (req, res) => {
  res.json({
    name: 'University Blog API Gateway',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      professors: '/api/professors',
      careers: '/api/careers',
      files: '/api/files'
    },
    documentation: '/api/docs'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  logger.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info('Environment:', process.env.NODE_ENV);
  logger.info('Services configuration:', {
    auth: process.env.AUTH_SERVICE_URL,
    cv: process.env.CV_SERVICE_URL,
    files: process.env.FILE_SERVICE_URL
  });
});

module.exports = app;