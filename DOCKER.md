# Zona Zurigorri - Guía de Docker

## 🐳 Requisitos Previos

- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Docker Compose V2
- Al menos 4GB de RAM disponible

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura al menos:
- `JWT_SECRET` - Una clave secreta segura
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` - Credenciales de Google OAuth
- `DISCORD_CLIENT_ID` y `DISCORD_CLIENT_SECRET` - Credenciales de Discord OAuth

### 2. Construir y Levantar los Servicios

```bash
# Construir todas las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d
```

### 3. Verificar el Estado

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f auth-service
docker-compose logs -f main-logic-service
docker-compose logs -f frontend
```

## 📦 Servicios Disponibles

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 3000 | Aplicación Next.js |
| Auth Service | 5001 | Servicio de autenticación NestJS |
| Main Logic Service | 8001 | Servicio principal FastAPI |
| Kong Gateway | 8000 | API Gateway |
| Kong Admin | 8002 | Panel de administración de Kong |
| PostgreSQL | 5432 | Base de datos |
| Redis | 6379 | Caché |

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Auth Service Swagger**: http://localhost:8000/api/auth/docs
- **Main Logic Service Docs**: http://localhost:8000/api/docs
- **Kong Admin API**: http://localhost:8002

## 🛠️ Comandos Útiles

### Detener los Servicios

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes
docker-compose down -v
```

### Reconstruir un Servicio

```bash
# Reconstruir un servicio específico
docker-compose build auth-service
docker-compose up -d auth-service

# Reconstruir todos los servicios
docker-compose build
docker-compose up -d
```

### Ejecutar Comandos en Contenedores

```bash
# Acceder a la shell de un contenedor
docker-compose exec auth-service sh
docker-compose exec main-logic-service sh

# Ejecutar comandos de base de datos
docker-compose exec postgres psql -U postgres -d zona_zurigorri

# Ejecutar comandos de Redis
docker-compose exec redis redis-cli
```

### Ver Logs

```bash
# Logs en tiempo real de todos los servicios
docker-compose logs -f

# Logs de los últimos 100 registros
docker-compose logs --tail=100

# Logs de un servicio específico
docker-compose logs -f frontend
```

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar un volumen
docker volume inspect zona-zurigorri_postgres_data

# Eliminar volúmenes no utilizados
docker volume prune
```

## 🔧 Desarrollo

### Modo Desarrollo con Hot Reload

Para desarrollo, puedes montar los directorios locales como volúmenes:

```yaml
# Añadir a docker-compose.yml bajo el servicio deseado
volumes:
  - ./auth-service/src:/app/src
  - ./frontend/app:/app/app
  - ./main-logic-service/app:/app/app
```

### Variables de Entorno por Servicio

Puedes crear archivos `.env` específicos para cada servicio:
- `auth-service/.env`
- `frontend/.env.local`
- `main-logic-service/.env`

## 🐛 Solución de Problemas

### Los contenedores no inician

```bash
# Ver logs detallados
docker-compose logs

# Verificar el estado de salud
docker-compose ps

# Reiniciar servicios
docker-compose restart
```

### Error de conexión a la base de datos

```bash
# Verificar que PostgreSQL esté saludable
docker-compose ps postgres

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Puertos ya en uso

Si algún puerto está ocupado, puedes cambiarlos en el `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Cambia el puerto host (izquierda)
```

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Monitoreo

### Uso de recursos

```bash
# Ver estadísticas de recursos en tiempo real
docker stats

# Ver uso de recursos de contenedores específicos
docker stats zona-zurigorri-frontend zona-zurigorri-auth-service
```

## 🔒 Producción

Para producción, recuerda:

1. ✅ Cambiar todas las contraseñas y secretos en `.env`
2. ✅ Usar HTTPS con certificados SSL/TLS
3. ✅ Configurar backups automáticos de PostgreSQL
4. ✅ Implementar logging centralizado
5. ✅ Configurar límites de recursos en `docker-compose.yml`
6. ✅ Usar variables de entorno seguras (no archivos `.env`)
7. ✅ Implementar health checks apropiados
8. ✅ Configurar redes de Docker segmentadas

## 📝 Notas Adicionales

- Los datos de PostgreSQL y Redis se persisten en volúmenes Docker
- Kong Gateway enruta todas las peticiones API
- Los servicios se comunican a través de la red interna `zona-zurigorri-network`
- Los health checks aseguran que las dependencias estén listas antes de iniciar servicios dependientes
