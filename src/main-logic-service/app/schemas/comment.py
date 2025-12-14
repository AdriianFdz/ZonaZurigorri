from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    playerId: str
    comment: str

class UserInComment(BaseModel):
    id: str
    name: str
    picture: str | None = None
    
    class Config:
        from_attributes = True

class CommentResponse(BaseModel):
    id: str
    userId: str
    playerId: str
    comment: str
    createdAt: datetime
    user: UserInComment
    
    class Config:
        from_attributes = True
