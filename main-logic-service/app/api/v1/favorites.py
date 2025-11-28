from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from app.schemas.favorites import FavoriteAddRequest, FavoritesResponse
from app.services.favorites_service import favorites_service
import jwt
from app.core.config import settings

router = APIRouter(prefix="/favorites", tags=["favorites"])


def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """Extraer user_id del JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No autorizado")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Decodificar el JWT (usa el mismo secret que auth-service)
        payload = jwt.decode(
            token,
            "NS8st&2/baNS82LLAKS82KMS92M1L$%&S21&%$2WCN239Y2R39CN9QN8SRNC8OACFEWC2ZBIVCDSIAF7Q32R23",
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


@router.get("", response_model=FavoritesResponse)
async def get_favorites(user_id: str = Depends(get_current_user)):
    """Obtener lista de favoritos del usuario"""
    favorites = await favorites_service.get_favorites(user_id)
    return FavoritesResponse(favorites=favorites)


@router.post("", response_model=FavoritesResponse)
async def add_favorite(
    request: FavoriteAddRequest,
    user_id: str = Depends(get_current_user)
):
    """Agregar jugador a favoritos"""
    favorites = await favorites_service.add_favorite(user_id, request.playerId)
    return FavoritesResponse(favorites=favorites)


@router.delete("/{player_id}", response_model=FavoritesResponse)
async def remove_favorite(
    player_id: str,
    user_id: str = Depends(get_current_user)
):
    """Eliminar jugador de favoritos"""
    favorites = await favorites_service.remove_favorite(user_id, player_id)
    return FavoritesResponse(favorites=favorites)
