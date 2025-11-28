from pydantic_settings import BaseSettings


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
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USERNAME: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_DATABASE: str = "auth_db"
    
    # JWT Configuration
    JWT_SECRET: str = ""
    
    class Config:
        env_file = ".env"


settings = Settings()
