import pytest
from unittest.mock import Mock, MagicMock
from app.services.comment_service import CommentService
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
import uuid


@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)


@pytest.fixture
def sample_comment_data():
    return CommentCreate(
        playerId="Q123456",
        comment="Gran jugador del Athletic Club"
    )


@pytest.fixture
def sample_comment():
    comment = Comment()
    comment.id = str(uuid.uuid4())
    comment.userId = "user_123"
    comment.playerId = "Q123456"
    comment.comment = "Gran jugador"
    comment.createdAt = datetime.now()
    return comment


class TestCreateComment:
    def test_create_success(self, mock_db, sample_comment_data):
        mock_db.add = Mock()
        mock_db.commit = Mock()
        mock_db.refresh = Mock()
        
        result = CommentService.create_comment(
            db=mock_db,
            user_id="user_123",
            comment_data=sample_comment_data
        )
        
        assert result.userId == "user_123"
        assert result.playerId == "Q123456"
        assert result.comment == "Gran jugador del Athletic Club"
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
    
    def test_create_with_different_user(self, mock_db):
        comment_data = CommentCreate(
            playerId="Q123456",
            comment="Totalmente de acuerdo"
        )
        
        mock_db.add = Mock()
        mock_db.commit = Mock()
        mock_db.refresh = Mock()
        
        result = CommentService.create_comment(
            db=mock_db,
            user_id="user_456",
            comment_data=comment_data
        )
        
        assert result.userId == "user_456"


class TestGetCommentsByPlayer:
    def test_get_empty(self, mock_db):
        mock_query = Mock()
        mock_query.filter.return_value.order_by.return_value.all.return_value = []
        mock_db.query.return_value = mock_query
        
        result = CommentService.get_comments_by_player(mock_db, "Q999999")
        
        assert result == []
    
    def test_get_with_data(self, mock_db, sample_comment):
        mock_query = Mock()
        mock_query.filter.return_value.order_by.return_value.all.return_value = [sample_comment]
        mock_db.query.return_value = mock_query
        
        result = CommentService.get_comments_by_player(mock_db, "Q123456")
        
        assert len(result) == 1
        assert result[0].playerId == "Q123456"


class TestDeleteComment:
    def test_delete_success(self, mock_db, sample_comment):
        mock_query = Mock()
        mock_query.filter.return_value.first.return_value = sample_comment
        mock_db.query.return_value = mock_query
        mock_db.delete = Mock()
        mock_db.commit = Mock()
        
        CommentService.delete_comment(
            db=mock_db,
            comment_id=sample_comment.id,
            user_id="user_123"
        )
        
        mock_db.delete.assert_called_once_with(sample_comment)
        mock_db.commit.assert_called_once()
    
    def test_delete_not_found(self, mock_db):
        mock_query = Mock()
        mock_query.filter.return_value.first.return_value = None
        mock_db.query.return_value = mock_query
        
        with pytest.raises(HTTPException) as exc_info:
            CommentService.delete_comment(
                db=mock_db,
                comment_id="nonexistent_id",
                user_id="user_123"
            )
        
        assert exc_info.value.status_code == 404
    
    def test_delete_unauthorized(self, mock_db, sample_comment):
        mock_query = Mock()
        mock_query.filter.return_value.first.return_value = sample_comment
        mock_db.query.return_value = mock_query
        
        with pytest.raises(HTTPException) as exc_info:
            CommentService.delete_comment(
                db=mock_db,
                comment_id=sample_comment.id,
                user_id="different_user"
            )
        
        assert exc_info.value.status_code == 403
