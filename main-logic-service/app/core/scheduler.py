"""Background scheduler for periodic tasks"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.services.news_service import NewsService
import asyncio


class TaskScheduler:
    """Scheduler for background tasks"""
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.news_service = NewsService()
    
    async def refresh_news_cache_job(self):
        """Job que refresca la caché de noticias cada hora"""
        try:
            print("Iniciando actualización automática de caché de noticias...")
            result = await self.news_service.refresh_all_news_cache()
            print(f"{result['message']}")
        except Exception as e:
            print(f"Error en actualización automática de caché: {e}")
    
    def start(self):
        """Inicia el scheduler con todas las tareas configuradas"""
        # Tarea: Actualizar caché de noticias cada hora
        self.scheduler.add_job(
            self.refresh_news_cache_job,
            trigger=IntervalTrigger(hours=1),
            id='refresh_news_cache',
            name='Refresh news cache every hour',
            replace_existing=True
        )
        
        self.scheduler.start()
        print("Scheduler iniciado - Caché de noticias se actualizará cada hora")
    
    def shutdown(self):
        """Detiene el scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            print("Scheduler detenido")


# Instancia global del scheduler
task_scheduler = TaskScheduler()
