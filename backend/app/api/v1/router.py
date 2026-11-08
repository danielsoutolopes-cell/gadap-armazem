from fastapi import APIRouter
from app.api.v1.endpoints import (
    inbound,
    extras,
    outbound,
    scheduling_audit,
    billing,
    control_tower,
    client_portal
)

api_router = APIRouter()

api_router.include_router(inbound.router, prefix="/logistics")
api_router.include_router(extras.router, prefix="/logistics")
api_router.include_router(outbound.router, prefix="/logistics")
api_router.include_router(scheduling_audit.router, prefix="/logistics")
api_router.include_router(billing.router, prefix="/logistics")
api_router.include_router(control_tower.router, prefix="/logistics")
api_router.include_router(client_portal.router, prefix="/b2b")
