from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    app_name: str = "Main Logic Service"
    api_version: str = "v1"

    football_api_key: str = ""

    baseurl_openstreetmap: str = "https://nominatim.openstreetmap.org/reverse"

    baseurl_wikidata: str = "https://www.wikidata.org/w/api.php"

    baseurl_rss_news: str = "https://www.elcorreo.com/rss/2.0/?section=athletic"
    
    class Config:
        env_file = ".env"


settings = Settings()
