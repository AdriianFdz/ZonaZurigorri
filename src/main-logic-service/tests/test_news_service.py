import pytest
from unittest.mock import Mock, AsyncMock, patch
from app.services.news_service import NewsService
from datetime import date


@pytest.fixture
def news_service():
    return NewsService()


@pytest.fixture
def mock_feed_entries():
    return [
        {
            'title': 'Athletic Club gana 2-1',
            'link': 'https://example.com/noticia-1',
            'published': 'Mon, 15 Jan 2024 10:30:00 +0000',
            'summary': 'El Athletic consigue una importante victoria...',
            'media_content': [{'url': 'https://example.com/image1.jpg'}],
            'content': [{'value': 'Athletic Club campeón'}]
        },
        {
            'title': 'Nueva incorporación',
            'link': 'https://example.com/noticia-2',
            'published': 'Tue, 16 Jan 2024 14:00:00 +0000',
            'summary': 'El club ficha a un nuevo jugador...',
            'media_content': [{'url': 'https://example.com/image2.jpg'}],
            'content': [{'value': 'Nueva incorporación'}]
        }
    ]


class TestGenerateCacheKey:
    def test_same_params_same_key(self, news_service):
        key1 = news_service._generate_cache_key(5, date(2024, 1, 1), date(2024, 1, 31))
        key2 = news_service._generate_cache_key(5, date(2024, 1, 1), date(2024, 1, 31))
        assert key1 == key2
    
    def test_different_params_different_key(self, news_service):
        key1 = news_service._generate_cache_key(5, date(2024, 1, 1), date(2024, 1, 31))
        key2 = news_service._generate_cache_key(10, date(2024, 1, 1), date(2024, 1, 31))
        assert key1 != key2
    
    def test_cache_key_prefix(self, news_service):
        key = news_service._generate_cache_key(5)
        assert key.startswith("news:")


class TestFetchNewsFromRSS:
    @pytest.mark.asyncio
    async def test_fetch_success(self, news_service, mock_feed_entries):
        with patch('httpx.AsyncClient') as mock_client, \
             patch('feedparser.parse') as mock_parse:
            
            mock_response = AsyncMock()
            mock_response.text = '<rss>mock content</rss>'
            mock_response.raise_for_status = Mock()
            
            mock_client_instance = AsyncMock()
            mock_client_instance.get.return_value = mock_response
            mock_client.return_value.__aenter__.return_value = mock_client_instance
            
            mock_feed = Mock()
            mock_feed.entries = mock_feed_entries
            mock_parse.return_value = mock_feed
            
            result = await news_service._fetch_news_from_rss(limit=2)
            
            assert result.total == 2
            assert len(result.articles) == 2
            assert result.articles[0].title == 'Athletic Club gana 2-1'
    
    @pytest.mark.asyncio
    async def test_fetch_with_date_filter(self, news_service, mock_feed_entries):
        with patch('httpx.AsyncClient') as mock_client, \
             patch('feedparser.parse') as mock_parse:
            
            mock_response = AsyncMock()
            mock_response.text = '<rss>mock content</rss>'
            mock_response.raise_for_status = Mock()
            
            mock_client_instance = AsyncMock()
            mock_client_instance.get.return_value = mock_response
            mock_client.return_value.__aenter__.return_value = mock_client_instance
            
            mock_feed = Mock()
            mock_feed.entries = mock_feed_entries
            mock_parse.return_value = mock_feed
            
            result = await news_service._fetch_news_from_rss(
                limit=10,
                start_date=date(2024, 1, 16)
            )
            
            assert result.total == 1
            assert result.articles[0].title == 'Nueva incorporación'
    
    @pytest.mark.asyncio
    async def test_fetch_empty_feed(self, news_service):
        with patch('httpx.AsyncClient') as mock_client, \
             patch('feedparser.parse') as mock_parse:
            
            mock_response = AsyncMock()
            mock_response.text = '<rss></rss>'
            mock_response.raise_for_status = Mock()
            
            mock_client_instance = AsyncMock()
            mock_client_instance.get.return_value = mock_response
            mock_client.return_value.__aenter__.return_value = mock_client_instance
            
            mock_feed = Mock()
            mock_feed.entries = []
            mock_parse.return_value = mock_feed
            
            with pytest.raises(Exception, match="no contiene noticias"):
                await news_service._fetch_news_from_rss()
