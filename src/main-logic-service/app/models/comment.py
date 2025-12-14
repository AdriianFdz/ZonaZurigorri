from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=False), primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String, nullable=True)
    provider = Column(String)
    providerId = Column(String, unique=True, index=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    
    comments = relationship("Comment", back_populates="user")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(UUID(as_uuid=False), primary_key=True, index=True)
    userId = Column(UUID(as_uuid=False), ForeignKey("users.id"))
    playerId = Column(String, index=True)
    comment = Column(Text)
    createdAt = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="comments")
