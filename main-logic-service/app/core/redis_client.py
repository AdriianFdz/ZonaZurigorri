"""Redis client for caching"""
import json
import redis
from typing import Optional, Any
from app.core.config import settings


class RedisClient:
    """Redis client wrapper for caching operations"""
    
    def __init__(self):
        self._client: Optional[redis.Redis] = None
    
    def connect(self) -> None:
        """Establish connection to Redis"""
        try:
            self._client = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                db=settings.redis_db,
                password=settings.redis_password if settings.redis_password else None,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Test connection
            self._client.ping()
            print(f"Connected to Redis at {settings.redis_host}:{settings.redis_port}")
        except redis.ConnectionError as e:
            print(f"Failed to connect to Redis: {e}")
            self._client = None
    
    def disconnect(self) -> None:
        """Close Redis connection"""
        if self._client:
            self._client.close()
            print("Disconnected from Redis")
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self._client:
            return None
        
        try:
            value = self._client.get(key)
            if value:
                return json.loads(value)
            return None
        except (redis.RedisError, json.JSONDecodeError) as e:
            print(f"Error getting key {key} from Redis: {e}")
            return None
    
    def set(self, key: str, value: Any, ttl: int) -> bool:
        """Set value in cache with TTL (always expires)"""
        if not self._client:
            return False
        
        try:
            json_value = json.dumps(value)
            self._client.setex(key, ttl, json_value)
            return True
        except (redis.RedisError, TypeError) as e:
            print(f"Error setting key {key} in Redis: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self._client:
            return False
        
        try:
            self._client.delete(key)
            return True
        except redis.RedisError as e:
            print(f"Error deleting key {key} from Redis: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self._client:
            return False
        
        try:
            return self._client.exists(key) > 0
        except redis.RedisError as e:
            print(f"Error checking key {key} in Redis: {e}")
            return False
    
    def get_ttl(self, key: str) -> int:
        """Get remaining TTL for a key in seconds. Returns -1 if key doesn't exist, -2 if no TTL"""
        if not self._client:
            return -1
        
        try:
            return self._client.ttl(key)
        except redis.RedisError as e:
            print(f"Error getting TTL for key {key} from Redis: {e}")
            return -1
    
    @property
    def is_connected(self) -> bool:
        """Check if Redis client is connected"""
        if not self._client:
            return False
        
        try:
            self._client.ping()
            return True
        except redis.RedisError:
            return False


# Global Redis client instance
redis_client = RedisClient()
