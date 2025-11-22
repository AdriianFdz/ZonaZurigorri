from pydantic import BaseModel, Field
from typing import Optional, Dict, Literal
from app.schemas.player import Player


class PhilosophyValidationRequest(BaseModel):
    """Request schema for philosophy validation"""
    player_wikidata_id: Optional[str] = None
    

class PhilosophyValidationResponse(BaseModel):
    """Response schema for philosophy validation"""
    jugador: Player = Field(..., description="Player information")
    status: Literal["valid", "invalid", "doubt"] = Field(
        ..., 
        description="Validation status: 'valid' (cumple la filosofía), 'invalid' (no cumple), 'doubt' (hay dudas por falta de información)"
    )
    reason: str = Field(..., description="Reason for the validation status")