from fastapi import Depends
from app.core.config import settings
from app.services.news_service import NewsService
from app.services.philosophy_service import PhilosophyService
from app.services.talent_service import TalentService


def get_settings():
    """Dependency to get application settings"""
    return settings