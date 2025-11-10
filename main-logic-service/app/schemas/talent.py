from pydantic import BaseModel, Field
from typing import Optional


class TalentPredictionRequest(BaseModel):
    """Request schema for talent prediction"""
    player_id: str
    player_name: str
    age: int
    position: str
    current_stats: dict
    

class TalentPredictionResponse(BaseModel):
    """Response schema for talent prediction"""
    player_id: str
    talent_score: float = Field(..., ge=0.0, le=100.0)
    potential_level: str  # e.g., "high", "medium", "low"
    confidence: float = Field(..., ge=0.0, le=1.0)
    factors: Optional[dict] = None
