from pydantic import BaseModel
from typing import List


class FavoriteAddRequest(BaseModel):
    playerId: str


class FavoritesResponse(BaseModel):
    favorites: List[str]
