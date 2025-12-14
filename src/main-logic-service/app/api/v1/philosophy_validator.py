from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.philosophy import PhilosophyValidationResponse
from app.schemas.player_search import PlayerSearchResponse
from app.services.philosophy_service import PhilosophyService

router = APIRouter()


@router.get("/validate/{player_id}", response_model=PhilosophyValidationResponse)
async def validate_player_philosophy(
    player_id: str,
    service: PhilosophyService = Depends()
):
    """
    Valida si un jugador se ajusta a la filosofía del club usando su ID de Wikidata
    
    - **player_id**: ID de Wikidata del jugador (ej: Q12345)
    """
    try:
        result = await service.validate_philosophy_by_id(player_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/players/search", response_model=PlayerSearchResponse)
async def search_players(
    q: str = Query(..., min_length=1, description="Nombre del jugador a buscar"),
    service: PhilosophyService = Depends()
):
    """
    Busca jugadores por nombre para autocompletado (máximo 10 resultados).
    
    - **q**: Nombre del jugador a buscar (mínimo 1 carácter)
    """
    try:
        result = await service.search_players_for_autocomplete(q)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))