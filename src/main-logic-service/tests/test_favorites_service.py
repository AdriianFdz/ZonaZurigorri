import pytest
from unittest.mock import MagicMock, patch
from app.services.favorites_service import FavoritesService


@pytest.fixture
def mock_redis():
    with patch('app.services.favorites_service.redis_client') as mock:
        mock.is_connected = True
        mock.get = MagicMock(return_value=[])
        mock.set = MagicMock()
        yield mock


class TestGetFavoritesKey:
    def test_key_format(self):
        key = FavoritesService._get_favorites_key("user_123")
        assert key == "user:user_123:favorites"


class TestGetFavorites:
    @pytest.mark.asyncio
    async def test_get_empty(self, mock_redis):
        mock_redis.get.return_value = []
        
        result = await FavoritesService.get_favorites("user_123")
        
        assert result == []
        mock_redis.get.assert_called_once_with("user:user_123:favorites")
    
    @pytest.mark.asyncio
    async def test_get_with_data(self, mock_redis):
        mock_redis.get.return_value = ["player_1", "player_2"]
        
        result = await FavoritesService.get_favorites("user_123")
        
        assert len(result) == 2
        assert "player_1" in result
    
    @pytest.mark.asyncio
    async def test_get_redis_disconnected(self):
        with patch('app.services.favorites_service.redis_client') as mock_redis:
            mock_redis.is_connected = False
            
            result = await FavoritesService.get_favorites("user_123")
            
            assert result == []


class TestAddFavorite:
    @pytest.mark.asyncio
    async def test_add_new(self, mock_redis):
        mock_redis.get.return_value = ["player_1"]
        
        result = await FavoritesService.add_favorite("user_123", "player_2")
        
        assert "player_1" in result
        assert "player_2" in result
        mock_redis.set.assert_called_once_with(
            "user:user_123:favorites",
            ["player_1", "player_2"],
            ttl=0
        )
    
    @pytest.mark.asyncio
    async def test_add_duplicate(self, mock_redis):
        mock_redis.get.return_value = ["player_1"]
        
        result = await FavoritesService.add_favorite("user_123", "player_1")
        
        assert len(result) == 1
        mock_redis.set.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_add_redis_disconnected(self):
        with patch('app.services.favorites_service.redis_client') as mock_redis:
            mock_redis.is_connected = False
            
            with pytest.raises(Exception, match="Redis no está conectado"):
                await FavoritesService.add_favorite("user_123", "player_1")


class TestRemoveFavorite:
    @pytest.mark.asyncio
    async def test_remove_existing(self, mock_redis):
        mock_redis.get.return_value = ["player_1", "player_2"]
        
        result = await FavoritesService.remove_favorite("user_123", "player_2")
        
        assert len(result) == 1
        assert "player_1" in result
        assert "player_2" not in result
        mock_redis.set.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_remove_non_existing(self, mock_redis):
        mock_redis.get.return_value = ["player_1"]
        
        result = await FavoritesService.remove_favorite("user_123", "player_2")
        
        assert len(result) == 1
        mock_redis.set.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_remove_redis_disconnected(self):
        with patch('app.services.favorites_service.redis_client') as mock_redis:
            mock_redis.is_connected = False
            
            with pytest.raises(Exception, match="Redis no está conectado"):
                await FavoritesService.remove_favorite("user_123", "player_1")
