from pydantic import BaseModel, Field


class ClubDTO(BaseModel):
    """Data Transfer Object for Club with minimal information"""
    id: str = Field(..., description="Wikidata ID of the club")
    name: str = Field(..., description="Name of the club")
