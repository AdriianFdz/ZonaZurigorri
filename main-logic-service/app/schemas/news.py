from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime
from typing import List, Optional


class NewsArticle(BaseModel):
    """
    Esquema para un artículo de noticia individual
    """
    id: str = Field(..., description="ID único de la noticia (GUID)")
    title: str = Field(..., description="Título de la noticia")
    link: str = Field(..., description="URL del artículo completo")
    description: Optional[str] = Field(None, description="Descripción o resumen de la noticia")
    published: Optional[str] = Field(None, description="Fecha de publicación")
    author: Optional[str] = Field(None, description="Autor de la noticia")
    image_url: Optional[str] = Field(None, description="URL de la imagen principal")
    image_title: Optional[str] = Field(None, description="Título de la imagen")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "https://www.elcorreo.com/athletic/ejemplo-20251103-nt.html",
                "title": "El Athletic gana 2-0 al Barcelona",
                "link": "https://www.elcorreo.com/athletic/ejemplo",
                "description": "El Athletic Club consigue una importante victoria",
                "published": "Mon, 03 Nov 2025 15:30:00 +0100",
                "author": "Javier Ortiz de Lazcano",
                "image_url": "https://s2.ppllstatics.com/elcorreo/www/multimedia/ejemplo.jpg",
                "image_title": "Celebración del gol del Athletic"
            }
        }


class NewsResponse(BaseModel):
    """
    Respuesta con lista de noticias
    """
    total: int = Field(..., description="Número total de noticias recuperadas")
    articles: List[NewsArticle] = Field(..., description="Lista de artículos de noticias")
    source: str = Field(..., description="Fuente del feed RSS")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 5,
                "articles": [
                    {
                        "id": "https://www.elcorreo.com/athletic/ejemplo-20251103-nt.html",
                        "title": "El Athletic gana 2-0 al Barcelona",
                        "link": "https://www.elcorreo.com/athletic/ejemplo",
                        "description": "El Athletic Club consigue una importante victoria",
                        "published": "Mon, 03 Nov 2025 14:30:00 +0100",
                        "author": "Javier Ortiz de Lazcano",
                        "image_url": "https://s2.ppllstatics.com/elcorreo/www/multimedia/ejemplo.jpg",
                        "image_title": "Celebración del gol del Athletic"
                    }
                ],
                "source": "https://www.elcorreo.com/rss/2.0/?section=athletic/bilbao-athletic"
            }
        }
