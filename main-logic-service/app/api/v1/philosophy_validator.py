from fastapi import APIRouter, Depends, HTTPException
from app.schemas.philosophy import PhilosophyValidationRequest, PhilosophyValidationResponse
from app.services.philosophy_service import PhilosophyService

router = APIRouter()


@router.post("/validate", response_model=PhilosophyValidationResponse)
async def validate_player_philosophy(
    request: PhilosophyValidationRequest,
    service: PhilosophyService = Depends()
):
    """
    Valida si un jugador se ajusta a la filosofía del club
    """
    try:
        result = await service.validate_philosophy(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
