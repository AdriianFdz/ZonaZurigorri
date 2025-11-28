from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.redis_client import redis_client
from app.core.scheduler import task_scheduler
from app.core.database import Base, engine
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestiona el ciclo de vida de la aplicación"""
    # Startup
    print("Iniciando aplicación...")
    
    # Crear tablas de base de datos
    Base.metadata.create_all(bind=engine)
    
    # Conectar a Redis
    redis_client.connect()
    
    # Iniciar scheduler para tareas programadas
    task_scheduler.start()
    
    # Hacer primera carga de caché
    if redis_client.is_connected:
        print("Realizando carga inicial de caché de noticias...")
        await task_scheduler.refresh_news_cache_job()
    
    yield
    
    # Shutdown
    print("Cerrando aplicación...")
    task_scheduler.shutdown()
    redis_client.disconnect()


app = FastAPI(
    title=settings.app_name,
    version=settings.api_version,
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=f"/api/{settings.api_version}")

@app.get("/health")
async def health_check():
    redis_status = "connected" if redis_client.is_connected else "disconnected"
    return {
        "status": "healthy",
        "redis": redis_status
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.app_port
    )