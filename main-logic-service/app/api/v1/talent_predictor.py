from fastapi import APIRouter, Depends, HTTPException
from app.schemas.talent import TalentPredictionRequest, TalentPredictionResponse
from app.services.talent_service import TalentService

router = APIRouter()


@router.post("/predict", response_model=TalentPredictionResponse)
async def predict_player_talent(
    request: TalentPredictionRequest,
    service: TalentService = Depends()
):
    """
    Predice el potencial de talento de un jugador
    """
    try:
        result = await service.predict_talent(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
