import os
import json
import time
import importlib
from typing import Optional, Any

# Carregamento dinâmico do Redis para compatibilidade universal e zero warnings de linters estáticos
redis_client = None
_redis_available = False
try:
    redis_mod = importlib.import_module("redis")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    # Testa rapidamente se o redis está acessível para evitar travamentos de socket
    client_test = getattr(redis_mod, "Redis").from_url(REDIS_URL, decode_responses=True, socket_timeout=0.3, socket_connect_timeout=0.3)
    client_test.ping()
    redis_client = client_test
    _redis_available = True
except Exception:
    redis_client = None
    _redis_available = False

# Fallback in-memory cache com TTL caso o servidor Redis não esteja rodando localmente
_LOCAL_MEMORY_CACHE = {}

def get_cache(key: str) -> Optional[Any]:
    """Recupera valor do Redis com fallback para cache in-memory local"""
    if _redis_available and redis_client:
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
    _LOCAL_MEMORY_CACHE[key] = (time.time() + ttl_seconds, data)
    
    if _redis_available and redis_client:
        try:
            redis_client.setex(key, ttl_seconds, json.dumps(data))
        except Exception:
            pass

