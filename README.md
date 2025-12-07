# Zona Zurigorri

Aplicación web para validar jugadores según la filosofía del Athletic Club de Bilbao.

## Arquitectura

El proyecto está compuesto por:
- **Frontend**: Next.js 15 con TypeScript
- **Auth Service**: NestJS para autenticación OAuth (Google, Discord, Twitter)
- **Main Logic Service**: FastAPI para lógica de negocio (validación de jugadores, noticias, comentarios)
- **Kong Gateway**: API Gateway para enrutamiento
- **PostgreSQL**: Base de datos
- **Redis**: Caché

---

## Requisitos Previos

### Software Necesario

1. **Docker** y **Docker Compose** instalados
2. **Node.js** (v20 o superior) y **pnpm**
   - Instalar pnpm: `npm install -g pnpm`
   - O usar npx: `npx pnpm install`
3. **Python** (v3.11 o superior) y **pip**

---

## Configuración Inicial

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

#### PostgreSQL
```env
DB_DATABASE="zona_zurigorri"
DB_HOST="localhost"              # o "postgres" si usas Docker
DB_PASSWORD="tu_password"
DB_PORT="5432"
DB_USERNAME="postgres"
```

#### Redis
```env
REDIS_HOST="localhost"           # o "redis" si usas Docker
REDIS_PASSWORD=""                # dejar vacío si no tiene password
REDIS_PORT="6379"
REDIS_DB="0"
NEWS_CACHE_TTL="3600"            # 1 hora en segundos
```

#### JWT
```env
JWT_SECRET="cambia_esto_en_produccion_por_algo_muy_seguro_y_largo"
```

#### URLs Base
```env
BASEURL_OPENSTREETMAP="https://nominatim.openstreetmap.org/reverse"
BASEURL_WIKIDATA="https://www.wikidata.org/w/api.php"
BASEURL_RSS_NEWS="https://www.elcorreo.com/rss/2.0/?section=athletic"
```

#### CORS y Frontend
```env
CORS_ORIGINS_MAIN_LOGIC_SERVICE="http://localhost:3000,http://localhost:8000"
CORS_ORIGINS_AUTH_SERVICE="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

#### Puertos
```env
APP_PORT_MAIN_LOGIC_SERVICE="5000"
APP_PORT_AUTH_SERVICE="5001"
APP_PORT_FRONTEND="3000"
HOST_MAIN_LOGIC_SERVICE="0.0.0.0"
```

### 2. Configurar OAuth (Google y Discord)

#### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs & Services** > **Credentials**
4. Clic en **Create Credentials** > **OAuth 2.0 Client ID**
5. Configura:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
6. Copia el **Client ID** y **Client Secret** y añádelos al `.env`:

```env
GOOGLE_CLIENT_ID="tu_client_id_de_google.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu_client_secret_de_google"
GOOGLE_CALLBACK_URL="http://localhost:8000/api/auth/google/callback"
```

#### Discord OAuth
1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Clic en **New Application**
3. Dale un nombre y acepta los términos
4. En el menú lateral, ve a **OAuth2**
5. Copia el **Client ID** y **Client Secret**
6. En **Redirects**, añade: `http://localhost:8000/api/auth/discord/callback`
7. Añade las credenciales al `.env`:

```env
DISCORD_CLIENT_ID="tu_discord_client_id"
DISCORD_CLIENT_SECRET="tu_discord_client_secret"
DISCORD_CALLBACK_URL="http://localhost:8000/api/auth/discord/callback"
```

### 3. Configurar Kong Gateway

El proyecto incluye dos archivos de configuración de Kong:

#### `kong-gateway/kong.yml` - Producción
Usa URLs de producción (Railway):
```yaml
services:
  - name: microservicio-logica-principal
    url: https://main-logic-service-production.up.railway.app
  - name: microservicio-auth
    url: https://auth-service-production-f9bf.up.railway.app
```

#### `kong-gateway/kong-local.yml` - Desarrollo Local
Usa nombres de contenedores Docker:
```yaml
services:
  - name: microservicio-logica-principal
    url: http://zona-zurigorri-main-logic-service:5000
  - name: microservicio-auth
    url: http://zona-zurigorri-auth-service:5001
```

**Para desarrollo local**, asegúrate de que `docker-compose.yml` use `kong-local.yml`:

```yaml
# En la sección de kong-gateway del docker-compose.yml
volumes:
  - ./kong-gateway/kong-local.yml:/usr/local/kong/declarative/kong.yml:ro
```

**Para producción**, cambia a `kong.yml` y actualiza las URLs con tus dominios/IPs reales.

---

## Instalación de Dependencias

### Auth Service (NestJS)
```bash
cd auth-service
pnpm install
```

### Main Logic Service (FastAPI)
```bash
cd main-logic-service
pip install -r requirements.txt
```

### Frontend (Next.js)
```bash
cd frontend
pnpm install
```

---

## Ejecutar el Proyecto

### Opción 1: Con Docker Compose (Recomendado)

Levanta todos los servicios:

```bash
docker compose up --build
```

O en segundo plano:

```bash
docker compose up -d --build
```

**Servicios disponibles:**
- Frontend: http://localhost:3000
- Kong Gateway: http://localhost:8000
- Auth Service: http://localhost:5001
- Main Logic Service: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

Para detener los servicios:

```bash
docker compose down
```

### Opción 2: Desarrollo Local (Sin Docker)

#### 1. Iniciar PostgreSQL y Redis
```bash
docker compose up postgres redis -d
```

#### 2. Auth Service
```bash
cd auth-service
pnpm install
pnpm run start:dev
```

#### 3. Main Logic Service
```bash
cd main-logic-service
pip install -r requirements.txt
python -m app.main
```

#### 4. Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

#### 5. Kong Gateway (Opcional)
```bash
docker compose up kong-gateway -d
```

---

## Ejecutar Tests

### Auth Service (Jest)

**Localmente:**
```bash
cd auth-service
pnpm test
```

**Con cobertura:**
```bash
pnpm run test:cov
```

**En modo watch:**
```bash
pnpm run test:watch
```

**Con Docker:**
```bash
docker compose run --rm auth-service pnpm test
```

### Main Logic Service (pytest)

**Localmente:**
```bash
cd main-logic-service
pytest
```

**Con verbosidad:**
```bash
pytest -v
```

**Con cobertura:**
```bash
pytest --cov=app --cov-report=html
```

**Con Docker:**
```bash
docker compose run --rm main-logic-service pytest
```

### Ejecutar Todos los Tests

**Localmente:**
```bash
cd auth-service && pnpm test && cd ../main-logic-service && pytest
```

**Con Docker:**
```bash
docker compose run --rm auth-service pnpm test
docker compose run --rm main-logic-service pytest
```

---

## Estructura del Proyecto

```
zona-zurigorri/
├── auth-service/           # Servicio de autenticación (NestJS)
│   ├── src/
│   │   ├── auth/          # Módulo de autenticación OAuth
│   │   └── entities/      # Entidades TypeORM
│   ├── test/              # Tests unitarios
│   ├── package.json
│   └── Dockerfile
├── main-logic-service/     # Servicio de lógica principal (FastAPI)
│   ├── app/
│   │   ├── api/           # Endpoints API
│   │   ├── core/          # Configuración y base de datos
│   │   ├── models/        # Modelos SQLAlchemy
│   │   ├── schemas/       # Schemas Pydantic
│   │   └── services/      # Lógica de negocio
│   ├── tests/             # Tests unitarios
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Aplicación Next.js
│   ├── app/               # App Router (Next.js 15)
│   ├── components/        # Componentes React
│   ├── lib/               # Utilidades
│   ├── package.json
│   └── Dockerfile
├── kong-gateway/           # Configuración Kong
│   ├── kong.yml           # Config producción
│   ├── kong-local.yml     # Config local
│   └── Dockerfile
├── docker-compose.yml      # Orquestación de servicios
├── .env.example            # Ejemplo de variables de entorno
└── README.md               # Este archivo
```

---

## API Documentation

Una vez levantados los servicios, puedes acceder a:

- **FastAPI Docs (Swagger)**: http://localhost:8000/api/docs
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## Solución de Problemas

### Error: "Jest not found"
Asegúrate de haber ejecutado `pnpm install` en `auth-service/` y reconstruir Docker:
```bash
docker compose build auth-service
```

### Error: "No tests found" en pytest
Verifica que el Dockerfile de `main-logic-service` copie la carpeta `tests/`:
```dockerfile
COPY ./tests ./tests
COPY pytest.ini .
```

### Error de conexión a PostgreSQL/Redis
- Verifica que los contenedores estén corriendo: `docker compose ps`
- Si usas servicios locales fuera de Docker, cambia `DB_HOST` y `REDIS_HOST` a `localhost`
- Si usas Docker, usa `postgres` y `redis` como hosts

### Kong no redirige correctamente
- Verifica que estés usando `kong-local.yml` para desarrollo local
- Revisa que los nombres de los servicios en `kong-local.yml` coincidan con los del `docker-compose.yml`
- Para producción, actualiza las URLs en `kong.yml` con tus dominios reales

### Puerto ya en uso
Si algún puerto está ocupado (3000, 5000, 5001, 8000), puedes cambiarlos en el `.env`:
```env
APP_PORT_MAIN_LOGIC_SERVICE="5050"
APP_PORT_AUTH_SERVICE="5051"
APP_PORT_FRONTEND="3001"
```

---

## Comandos Útiles

### Ver logs de los contenedores
```bash
docker compose logs -f [servicio]
```

### Reconstruir un servicio específico
```bash
docker compose build [servicio]
```

### Acceder a la shell de un contenedor
```bash
docker compose exec [servicio] sh
```

### Limpiar volúmenes y contenedores
```bash
docker compose down -v
```

### Ver estado de los servicios
```bash
docker compose ps
```