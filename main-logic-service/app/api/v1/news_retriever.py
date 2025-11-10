from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.news import NewsResponse
from app.services.news_service import NewsService
from datetime import date
from typing import Optional

router = APIRouter()


@router.get("/", response_model=NewsResponse)
async def get_latest_news(
    limit: int = Query(default=5, ge=1, le=100, description="Número máximo de noticias a recuperar"),
    start_date: Optional[date] = Query(None, description="Fecha inicial para filtrar (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Fecha final para filtrar (YYYY-MM-DD)"),
    service: NewsService = Depends()
):
    """
    Recupera las últimas noticias del Athletic Club desde el feed RSS de El Correo.
    """
    try:
        result = await service.get_latest_news(
            limit=limit,
            start_date=start_date,
            end_date=end_date
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
