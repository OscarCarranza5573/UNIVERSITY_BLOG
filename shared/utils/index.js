module.exports = {};

/**
 * Utilidades compartidas entre microservicios
 */

const responseHelper = {
  success: (data, message = 'Success') => ({
    success: true,
    message,
    data
  }),
  
  error: (message = 'Error', code = 500, details = null) => ({
    success: false,
    message,
    code,
    details
  })
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  responseHelper,
  validateEmail
};
