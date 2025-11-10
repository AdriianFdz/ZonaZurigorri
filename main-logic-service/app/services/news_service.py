from app.core.config import settings
from app.core.redis_client import redis_client
from app.schemas.news import NewsResponse, NewsArticle
import httpx
import feedparser
from typing import List, Optional
from datetime import date, datetime
import hashlib


class NewsService:
    """
    Servicio para recuperar noticias desde feeds RSS con caché Redis
    """
    RSS_URL = settings.baseurl_rss_news
    CACHE_KEY_PREFIX = "news:"
    
    def _generate_cache_key(
        self,
        limit: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> str:
        """Genera una clave única para la combinación de parámetros"""
        params = f"{limit}_{start_date}_{end_date}"
        hash_suffix = hashlib.md5(params.encode()).hexdigest()[:8]
        return f"{self.CACHE_KEY_PREFIX}{hash_suffix}"
    
    async def _fetch_news_from_rss(
        self,
        limit: int = 5,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> NewsResponse:
        """
        Método interno para obtener noticias directamente del RSS sin usar caché
        
        Args:
            limit: Número máximo de noticias a recuperar
            start_date: Fecha inicial para filtrar (opcional)
            end_date: Fecha final para filtrar (opcional)
            
        Returns:
            NewsResponse con las noticias recuperadas
        """
        try:
            # Headers para simular un navegador real
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
            
            # Hacer la petición HTTP al feed RSS
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(settings.baseurl_rss_news, headers=headers)
                response.raise_for_status()
                
                # Verificar que recibimos contenido
                if not response.text:
                    raise Exception("El feed RSS está vacío")
            
            # Parsear el contenido RSS
            feed = feedparser.parse(response.text)
            
            # Verificar que el feed tiene entradas
            if not feed.entries:
                raise Exception("El feed RSS no contiene noticias")
            
            # Extraer las noticias
            articles: List[NewsArticle] = []
            
            # Procesar todas las entradas del feed
            for entry in feed.entries:
                # Filtrar por fechas si se especifican
                if start_date or end_date:
                    published_str = entry.get('published')
                    if published_str:
                        try:
                            # Formato fijo
                            published_datetime = datetime.strptime(published_str, '%a, %d %b %Y %H:%M:%S %z')
                            published_date = published_datetime.date()
                            
                            # Aplicar filtros de fecha
                            if start_date and published_date < start_date:
                                continue
                            if end_date and published_date > end_date:
                                continue
                        except Exception:
                            # Si no se puede parsear la fecha, incluir la noticia
                            pass
                
                # Extraer información de la imagen (media:content)
                image_url = None
                image_title = None
                if hasattr(entry, 'media_content') and len(entry.media_content) > 0:
                    image_url = entry.media_content[0].get('url')
                # El título de la imagen está en content[0]['value']
                if hasattr(entry, 'content') and len(entry.content) > 0:
                    image_title = entry.content[0].get('value')
                
                # El autor está en authors[0]['name'] o en el campo author directo
                author = entry.get('author')
                if not author and hasattr(entry, 'authors') and len(entry.authors) > 0:
                    author = entry.authors[0].get('name')
                
                article = NewsArticle(
                    id=entry.get('id', ''),
                    title=entry.get('title', 'Sin título'),
                    link=entry.get('link', ''),
                    description=entry.get('summary', ''),
                    published=entry.get('published', None),
                    author=author,
                    image_url=image_url,
                    image_title=image_title
                )
                articles.append(article)
                
                # Limitar al número solicitado
                if len(articles) >= limit:
                    break
            
            return NewsResponse(
                total=len(articles),
                articles=articles,
                source=self.RSS_URL
            )
            
        except httpx.HTTPError as e:
            raise Exception(f"Error al recuperar el feed RSS: {str(e)}")
        except Exception as e:
            raise Exception(f"Error al procesar las noticias: {str(e)}")
    
    async def get_latest_news(
        self, 
        limit: int = 5,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> NewsResponse:
        """
        Recupera las últimas noticias desde el feed RSS con caché
        
        Args:
            limit: Número máximo de noticias a recuperar
            start_date: Fecha inicial para filtrar (opcional)
            end_date: Fecha final para filtrar (opcional)
            
        Returns:
            NewsResponse con las noticias recuperadas
        """
        # Generar clave de caché
        cache_key = self._generate_cache_key(limit, start_date, end_date)
        
        # Intentar obtener desde caché
        if redis_client.is_connected:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                print(f"[CACHE HIT] {cache_key}")
                return NewsResponse(**cached_data)
            print(f"[CACHE MISS] {cache_key}")
        
        # Obtener datos frescos del RSS
        response_data = await self._fetch_news_from_rss(limit, start_date, end_date)
        
        # Guardar en caché
        if redis_client.is_connected:
            redis_client.set(
                cache_key,
                response_data.model_dump(),
                ttl=settings.news_cache_ttl
            )
            print(f"[CACHE SAVED] {cache_key}")
        
        return response_data
    
    async def refresh_all_news_cache(self) -> dict:
        """
        Refresca la caché de noticias con los datos más recientes del RSS.
        Obtiene hasta 100 noticias y las guarda en caché.
        
        Returns:
            dict con el estado de la operación
        """
        try:
            # Obtener noticias frescas directamente del RSS
            news_response = await self._fetch_news_from_rss(limit=100)
            
            # Guardar en caché
            cache_key = self._generate_cache_key(limit=100)
            if redis_client.is_connected:
                redis_client.set(
                    cache_key,
                    news_response.model_dump(),
                    ttl=settings.news_cache_ttl
                )
                print(f"[CACHE REFRESHED] {cache_key}")
            
            return {
                "status": "success",
                "message": f"Caché actualizada con {news_response.total} noticias",
                "total_articles": news_response.total,
                "cache_ttl": settings.news_cache_ttl
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error al actualizar caché: {str(e)}"
            }
        