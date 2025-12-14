from pydantic import BaseModel, Field
from typing import List, Optional


class PlayerSearchResult(BaseModel):
    """Single player search result"""
    id: str = Field(..., description="Wikidata ID of the player")
    name: str = Field(..., description="First name")
    surname: str = Field(..., description="Last name / surname")
    full_name: str = Field(..., description="Full name")
    current_club: Optional[str] = Field(None, description="Current club name")
    age: Optional[int] = Field(None, description="Current age")
    birth_date: Optional[str] = Field(None, description="Birth date (YYYY-MM-DD)")
    image_url: Optional[str] = Field(None, description="Image URL from Wikidata (P18)")


class PlayerSearchResponse(BaseModel):
    """Response for player search (simple list for autocomplete)"""
    results: List[PlayerSearchResult] = Field(..., description="List of players matching the search (max 10)")
