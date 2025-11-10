from fastapi import APIRouter
from app.api.v1 import philosophy_validator, talent_predictor, news_retriever

api_router = APIRouter()

api_router.include_router(
    philosophy_validator.router,
    prefix="/philosophy",
    tags=["philosophy"]
)

api_router.include_router(
    talent_predictor.router,
    prefix="/talent",
    tags=["talent"]
)

api_router.include_router(
    news_retriever.router,
    prefix="/news",
    tags=["news"]
)
