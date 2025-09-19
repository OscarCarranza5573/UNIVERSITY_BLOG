module.exports = {};
/**
 * Tipos y interfaces compartidas entre microservicios
 */

module.exports = {
  UserRoles: ['admin', 'super_admin'],
  
  APIResponse: {
    success: 'boolean',
    message: 'string',
    data: 'any',
    code: 'number'
  }
};