import time
from typing import Dict, Tuple
from uuid import UUID
from fastapi import HTTPException, status

# Estrutura em memória de rastreamento por tenant: { tenant_id: [timestamp1, timestamp2, ...] }
_TENANT_REQUEST_TIMESTAMPS: Dict[str, list] = {}

def check_tenant_export_rate_limit(tenant_id: UUID, max_requests: int = 100, window_seconds: int = 60) -> Tuple[bool, int]:
    """
    Controlador de Taxa (Rate Limiting) por Tenant para Rotas de Exportação Pesadas (.xlsx/PDF).
    Garante que nenhum processo de BI automatizado sobrecarregue CPU/Memória dos demais clientes.
    Teto padrão: 100 requisições por minuto por empresa.
    """
    now = time.time()
    t_key = str(tenant_id)
    
    if t_key not in _TENANT_REQUEST_TIMESTAMPS:
        _TENANT_REQUEST_TIMESTAMPS[t_key] = []
        
    # Limpa requisições fora da janela de tempo (últimos 60s)
    cutoff = now - window_seconds
    _TENANT_REQUEST_TIMESTAMPS[t_key] = [ts for ts in _TENANT_REQUEST_TIMESTAMPS[t_key] if ts > cutoff]
    
    current_count = len(_TENANT_REQUEST_TIMESTAMPS[t_key])
    
    if current_count >= max_requests:
        retry_after = int(window_seconds - (now - _TENANT_REQUEST_TIMESTAMPS[t_key][0]))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit excedido para exportação de dados ({max_requests} req/{window_seconds}s por organização). Tente novamente em {max(retry_after, 1)}s.",
            headers={"Retry-After": str(max(retry_after, 1))}
        )
        
    _TENANT_REQUEST_TIMESTAMPS[t_key].append(now)
    remaining = max_requests - (current_count + 1)
    return True, remaining
