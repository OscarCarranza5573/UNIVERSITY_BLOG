module.exports = {};
/**
 * Constantes compartidas entre microservicios
 */

module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },
  
  USER_ROLES: {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  },
  
  JWT: {
    ACCESS_TOKEN_EXPIRY: '24h',
    REFRESH_TOKEN_EXPIRY: '7d'
  },
  
  UPLOAD: {
    MAX_FILE_SIZE: 5242880, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
};