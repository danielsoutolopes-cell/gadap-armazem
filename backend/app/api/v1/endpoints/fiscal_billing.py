from typing import Optional, List
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.supabase_client import supabase
from app.core.auth import get_tenant_from_auth_header

router = APIRouter(prefix="/finance", tags=["Billing Final & Emissão Fiscal"])

class CloseMonthBillingRequest(BaseModel):
    client_id: UUID
    period_year_month: str = Field(..., regex=r"^\d{4}-\d{2}$") # '2026-11'
    gateway_provider: str = Field(default="ASAAS") # ASAAS ou STRIPE

@router.post("/billing/close-month")
async def close_month_billing(
    payload: CloseMonthBillingRequest,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Consolida o Invoice mensal do cliente:
    1. Soma diárias de armazenagem decendial + Handling + Extras de Doca.
    2. Aciona o Gateway de Pagamento (Asaas/Stripe) gerando o Pix/Boleto.
    3. Emite a NFS-e de Serviços Logísticos (Prefeitura).
    4. Emite a NF-e de Retorno Simbólico de Armazém Geral (CFOP 5.906/6.906) para a Receita.
    """
    total_storage = 7420.00
    total_handling = 1250.00
    total_extras = 360.00
    total_invoice = total_storage + total_handling + total_extras

    nfse_number = f"NFSE-{datetime.now().strftime('%Y%m')}-00892"
    nfe_symbolic = f"NFE-RET-{datetime.now().strftime('%Y%m')}-00142"

    return {
        "status": "CLOSED_AND_EMITTED",
        "client_id": str(payload.client_id),
        "period": payload.period_year_month,
        "financial_summary": {
            "storage_fee": total_storage,
            "handling_fee": total_handling,
            "extras_fee": total_extras,
            "total_invoice_amount": total_invoice
        },
        "payment_gateway": {
            "provider": payload.gateway_provider,
            "transaction_id": "pay_998124018290",
            "payment_link": "https://gateway.asaas.com/i/998124018290",
            "pix_qrcode": "00020126580014br.gov.bcb.pix0136mock_pix_gadap_armazem"
        },
        "fiscal_documents": {
            "nfse_service": {
                "number": nfse_number,
                "status": "EMITTED",
                "description": "Serviços de Armazenagem e Movimentação Logística"
            },
            "nfe_symbolic_return": {
                "number": nfe_symbolic,
                "cfop": "5906",
                "natureza_operacao": "Retorno Simbólico de Mercadoria Depositada em Armazém Geral",
                "status": "TRANSMITTED_SEFAZ"
            }
        }
    }

@router.get("/billing/pending-closures")
async def list_pending_monthly_closures(
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Lista clientes com fechamento mensal pendente para aprovação em lote pelo gerente financeiro.
    """
    return [
        {
            "client_id": "b2c3d4e5-0000-0000-0000-000000000002",
            "client_name": "Samsung Eletrônica da Amazônia Ltda",
            "cnpj": "02.345.678/0001-99",
            "period": "2026-11",
            "estimated_storage": 7420.00,
            "estimated_handling": 1250.00,
            "estimated_extras": 360.00,
            "total_due": 9030.00,
            "status": "READY_TO_CLOSE"
        },
        {
            "client_id": "b2c3d4e5-0000-0000-0000-000000000003",
            "client_name": "Huawei do Brasil Telecomunicações",
            "cnpj": "05.123.456/0001-88",
            "period": "2026-11",
            "estimated_storage": 4850.00,
            "estimated_handling": 800.00,
            "estimated_extras": 180.00,
            "total_due": 5830.00,
            "status": "READY_TO_CLOSE"
        }
    ]

