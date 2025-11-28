from typing import List
from app.core.redis_client import redis_client
import json


class FavoritesService:
    @staticmethod
    def _get_favorites_key(user_id: str) -> str:
        return f"user:{user_id}:favorites"

    @staticmethod
    async def get_favorites(user_id: str) -> List[str]:
        """Obtener lista de favoritos del usuario"""
        if not redis_client.is_connected:
            return []
        
        key = FavoritesService._get_favorites_key(user_id)
        favorites = redis_client.get(key)
        
        if favorites:
            return favorites
        return []

    @staticmethod
    async def add_favorite(user_id: str, player_id: str) -> List[str]:
        """Agregar jugador a favoritos"""
        if not redis_client.is_connected:
            raise Exception("Redis no está conectado")
        
        favorites = await FavoritesService.get_favorites(user_id)
        
        if player_id not in favorites:
            favorites.append(player_id)
            key = FavoritesService._get_favorites_key(user_id)
            redis_client.set(key, favorites, ttl=0)  # Sin expiración
        
        return favorites

    @staticmethod
    async def remove_favorite(user_id: str, player_id: str) -> List[str]:
        """Eliminar jugador de favoritos"""
        if not redis_client.is_connected:
            raise Exception("Redis no está conectado")
        
        favorites = await FavoritesService.get_favorites(user_id)
        
        if player_id in favorites:
            favorites.remove(player_id)
            key = FavoritesService._get_favorites_key(user_id)
            redis_client.set(key, favorites, ttl=0)  # Sin expiración
        
        return favorites


favorites_service = FavoritesService()
