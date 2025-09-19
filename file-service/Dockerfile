FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

# Crear carpeta shared internamente
RUN mkdir -p ./shared/utils ./shared/constants ./shared/types && \
    echo "module.exports = { responseHelper: { success: (data, message = 'Success') => ({ success: true, message, data }), error: (message = 'Error', code = 500) => ({ success: false, message, code }) } };" > ./shared/utils/index.js && \
    echo "module.exports = { HTTP_STATUS: { OK: 200, CREATED: 201, BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404, INTERNAL_SERVER_ERROR: 500 }, USER_ROLES: { ADMIN: 'admin', SUPER_ADMIN: 'super_admin' } };" > ./shared/constants/index.js && \
    echo "module.exports = {};" > ./shared/types/index.js

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

CMD ["npm", "start"]