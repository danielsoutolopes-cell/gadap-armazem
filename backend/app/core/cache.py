import os
import json
import time
from typing import Optional, Any

try:
    import redis
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=1.5)
except Exception:
    redis_client = None

# Fallback in-memory cache com TTL caso o servidor Redis não esteja rodando localmente
_LOCAL_MEMORY_CACHE = {}

def get_cache(key: str) -> Optional[Any]:
    """Recupera valor do Redis com fallback para cache in-memory local"""
    if redis_client:
        try:
            val = redis_client.get(key)
            if val:
                return json.loads(val)
        except Exception:
            pass
            
    # Fallback local in-memory
    entry = _LOCAL_MEMORY_CACHE.get(key)
    if entry:
        expires_at, data = entry
        if time.time() < expires_at:
            return data
        else:
            del _LOCAL_MEMORY_CACHE[key]
    return None

def set_cache(key: str, data: Any, ttl_seconds: int = 3) -> None:
    """Salva valor no Redis com TTL curto (3s para Torre 2D) com fallback in-memory"""
    if redis_client:
        try:
            redis_client.setex(key, ttl_seconds, json.dumps(data))
            return
        except Exception:
            pass

    # Fallback local in-memory
    _LOCAL_MEMORY_CACHE[key] = (time.time() + ttl_seconds, data)
