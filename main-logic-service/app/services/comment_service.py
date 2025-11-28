from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
import uuid
from fastapi import HTTPException

class CommentService:
    @staticmethod
    def create_comment(db: Session, user_id: str, comment_data: CommentCreate) -> Comment:
        new_comment = Comment(
            id=str(uuid.uuid4()),
            userId=user_id,
            playerId=comment_data.playerId,
            comment=comment_data.comment
        )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
    
    @staticmethod
    def get_comments_by_player(db: Session, player_id: str):
        return db.query(Comment).filter(Comment.playerId == player_id).order_by(Comment.createdAt.desc()).all()
    
    @staticmethod
    def delete_comment(db: Session, comment_id: str, user_id: str):
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(status_code=404, detail="Comentario no encontrado")
        
        if comment.userId != user_id:
            raise HTTPException(status_code=403, detail="No puedes eliminar este comentario")
        
        db.delete(comment)
        db.commit()
