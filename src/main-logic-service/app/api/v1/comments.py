from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.comment_service import CommentService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_data: CommentCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["userId"]
    comment = CommentService.create_comment(db, user_id, comment_data)
    return comment

@router.get("/player/{player_id}", response_model=List[CommentResponse])
async def get_comments_by_player(
    player_id: str,
    db: Session = Depends(get_db)
):
    comments = CommentService.get_comments_by_player(db, player_id)
    return comments

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["userId"]
    CommentService.delete_comment(db, comment_id, user_id)
    return None
