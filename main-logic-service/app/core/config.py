from pydantic_settings import BaseSettings
from typing import List, Union
import os


class Settings(BaseSettings):
    """Application settings"""
    
    app_name: str = "Main Logic Service"
    api_version: str = "v1"
    host: str = "0.0.0.0"
    app_port: int = 5000

    baseurl_openstreetmap: str = "https://nominatim.openstreetmap.org/reverse"

    baseurl_wikidata: str = "https://www.wikidata.org/w/api.php"

    baseurl_rss_news: str = "https://www.elcorreo.com/rss/2.0/?section=athletic"
    
    # Redis Configuration
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: str = ""
    news_cache_ttl: int = 3600  # 1 hour in seconds
    
    # PostgreSQL Configuration
    db_host: str = "localhost"
    db_port: int = 5432
    db_username: str = "postgres"
    db_password: str = "postgres"
    db_database: str = "ZonaZurigorri"
    
    # JWT Configuration
    jwt_secret: str = ""
    
    # CORS Configuration
    cors_origins: Union[str, List[str]] = "http://localhost:3000,http://localhost:8000"
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from string or list"""
        if isinstance(self.cors_origins, str):
            return [origin.strip() for origin in self.cors_origins.split(',')]
        return self.cors_origins
    
    class Config:
        env_file = ".env"


settings = Settings()
