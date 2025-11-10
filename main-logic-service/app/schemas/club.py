from pydantic import BaseModel, Field
from typing import Optional


class Club(BaseModel):
    id: str = Field(..., description="Wikidata ID of the club")
    name: str = Field(..., description="Name of the club")
    country: Optional[str] = Field(None, description="Country where the club is located")
    founded_year: Optional[int] = Field(None, description="Year the club was founded")
    stadium: Optional[str] = Field(None, description="Name of the club's stadium")