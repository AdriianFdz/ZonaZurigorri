from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.club_dto import ClubDTO


class ClubSeasons(BaseModel):
    """Represents a club and the total seasons played there"""
    club: ClubDTO
    seasons: int = Field(..., description="Total seasons played at this club")


class Player(BaseModel):
    name: str
    clubs: List[ClubSeasons] = Field(default_factory=list, description="List of clubs and seasons played")
    born_place: str
    birth_date: str
    position: str
    image_url: Optional[str] = Field(default=None, description="Image URL from Wikidata (P18)")