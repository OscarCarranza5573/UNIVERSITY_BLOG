# University Blog System

Sistema de blog universitario con arquitectura de microservicios para mostrar CVs de catedráticos.

## 🏗️ Arquitectura

- **API Gateway** (Puerto 3000): Punto único de entrada
- **Auth Service** (Puerto 3001): Autenticación con MySQL
- **CV Service** (Puerto 3002): Gestión de CVs con MongoDB
- **File Service** (Puerto 3003): Gestión de archivos con GridFS

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Git

### Instalación

1. Clonar repositorio:
\`\`\`bash
git clone <repository-url>
cd university-blog
\`\`\`

2. Configurar variables de entorno:
\`\`\`bash
cp .env.example .env
# Editar .env con tus configuraciones
\`\`\`

3. Iniciar servicios:
\`\`\`bash
docker-compose up -d
\`\`\`

4. Verificar servicios:
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

## 🔗 Endpoints

### API Gateway (http://localhost:3000)
- GET `/health` - Estado del gateway
- GET `/api` - Información de la API

### Servicios
- **Auth**: http://localhost:3001
- **CVs**: http://localhost:3002  
- **Files**: http://localhost:3003

## 🧪 Testing

\`\`\`bash
# Instalar dependencias en todos los servicios
./scripts/install-all.sh

# Ejecutar tests
npm run test:all
\`\`\`

## 📚 Documentación

- [Arquitectura](docs/architecture/)
- [API Documentation](docs/api/)
- [Deployment](docs/deployment/)

## 🔒 Seguridad

- Autenticación JWT
- Rate limiting
- CORS configurado
- Headers de seguridad (Helmet)
- Validación de datos

## 🐳 Docker

Cada servicio tiene su propio Dockerfile optimizado. Ver `docker-compose.yml` para la configuración completa.

## 📝 Licencia

MIT License