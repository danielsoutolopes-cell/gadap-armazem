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
    analytics_bi,
    advanced_modules,
    zero_trust_rbac,
    onboarding,
    reports_export,
    fiscal_engine,
    tax_radar,
    fiscal_native,
    customs_services,
    lgpd_compliance,
    hr_enterprise,
    finance_enterprise
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
api_router.include_router(advanced_modules.router, prefix="/enterprise")
api_router.include_router(zero_trust_rbac.router, prefix="/zero-trust")
api_router.include_router(onboarding.router, prefix="/tenant-setup")
api_router.include_router(reports_export.router, prefix="/bi-export")
api_router.include_router(fiscal_engine.router, prefix="/fiscal-core")
api_router.include_router(tax_radar.router, prefix="/tax-intelligence")
api_router.include_router(fiscal_native.router, prefix="/fiscal-native")
api_router.include_router(customs_services.router, prefix="/customs-catalog")
api_router.include_router(lgpd_compliance.router, prefix="/privacy-lgpd")
api_router.include_router(hr_enterprise.router, prefix="/hr-advanced")
api_router.include_router(finance_enterprise.router, prefix="/finance-advanced")
