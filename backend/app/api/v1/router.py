from fastapi import APIRouter
from app.api.v1.endpoints import (
    inbound,
    extras,
    outbound,
    scheduling_audit,
    billing,
    control_tower,
    client_portal,
    inventory_audit,
    tms,
    fiscal_billing,
    crm,
    finance_base,
    procurement,
    rbac_admin,
    hr_payroll,
    contracts_pricing,
    analytics_bi
)

api_router = APIRouter()

api_router.include_router(inbound.router, prefix="/logistics")
api_router.include_router(extras.router, prefix="/logistics")
api_router.include_router(outbound.router, prefix="/logistics")
api_router.include_router(scheduling_audit.router, prefix="/logistics")
api_router.include_router(billing.router, prefix="/logistics")
api_router.include_router(control_tower.router, prefix="/logistics")
api_router.include_router(inventory_audit.router, prefix="/logistics")
api_router.include_router(tms.router, prefix="/logistics")
api_router.include_router(fiscal_billing.router, prefix="/finance")
api_router.include_router(finance_base.router, prefix="/finance")
api_router.include_router(procurement.router, prefix="/procurement")
api_router.include_router(client_portal.router, prefix="/b2b")
api_router.include_router(crm.router, prefix="/crm")
api_router.include_router(rbac_admin.router, prefix="/admin")
api_router.include_router(hr_payroll.router, prefix="/hr")
api_router.include_router(contracts_pricing.router, prefix="/pricing")
api_router.include_router(analytics_bi.router, prefix="/analytics")
