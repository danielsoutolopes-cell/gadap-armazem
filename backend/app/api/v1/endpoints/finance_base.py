from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.supabase_client import supabase
from app.core.auth import get_tenant_from_auth_header

router = APIRouter(prefix="/cash-flow", tags=["Financeiro Base (AP/AR)"])

# ----------------- SCHEMAS -----------------
class SettleBillRequest(BaseModel):
    bill_id: UUID
    payment_date: Optional[date] = None
    payment_method: str = "PIX"

class CreatePayableRequest(BaseModel):
    description: str = Field(..., min_length=3)
    category: str = Field(default="UTILITIES")
    document_number: Optional[str] = None
    amount: float = Field(..., gt=0)
    due_date: date
    supplier_name: Optional[str] = None

class CreateReceivableRequest(BaseModel):
    client_id: UUID
    description: str = Field(..., min_length=3)
    document_number: str
    amount: float = Field(..., gt=0)
    due_date: date

# ----------------- CONTAS A PAGAR (AP) -----------------
@router.get("/payable")
async def list_accounts_payable(
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    return {
        "summary": {
            "total_pending": 18450.00,
            "total_overdue": 3200.00,
            "total_paid_month": 34180.00
        },
        "bills": [
            {
                "id": "ap-001",
                "description": "Conta de Energia Elétrica - Galpão Principal Santos",
                "category": "UTILITIES",
                "category_label": "Energia / Água",
                "supplier_name": "CPFL Energia S/A",
                "document_number": "FAT-CPFL-99120",
                "amount": 8450.00,
                "due_date": "10/11/2026",
                "status": "PENDING",
                "payment_method": "BOLETO"
            },
            {
                "id": "ap-002",
                "description": "Manutenção Preventiva Empilhadeiras Elétricas",
                "category": "MAINTENANCE",
                "category_label": "Manutenção",
                "supplier_name": "Hyster-Yale Brasil Máquinas",
                "document_number": "NF-88219",
                "amount": 3200.00,
                "due_date": "04/11/2026",
                "status": "OVERDUE",
                "payment_method": "TED"
            },
            {
                "id": "ap-003",
                "description": "Lote de 200 Paletes de Madeira PBR Tratados",
                "category": "SUPPLIES",
                "category_label": "Insumos Doca",
                "supplier_name": "Paletes Brasil Ltda",
                "document_number": "NF-12093",
                "amount": 6800.00,
                "due_date": "20/11/2026",
                "status": "PENDING",
                "payment_method": "PIX"
            },
            {
                "id": "ap-004",
                "description": "Aluguel Mensal Galpão Setor Portuário",
                "category": "RENT",
                "category_label": "Locação",
                "supplier_name": "Santos Port Properties FII",
                "document_number": "LOC-2026-11",
                "amount": 25000.00,
                "due_date": "05/11/2026",
                "status": "PAID",
                "payment_date": "05/11/2026",
                "payment_method": "TED"
            }
        ]
    }

@router.post("/payable/{bill_id}/settle")
async def settle_payable_bill(
    bill_id: str,
    payload: SettleBillRequest,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Registra a liquidação (baixa) de uma conta a pagar no caixa do galpão.
    """
    return {
        "status": "PAID",
        "bill_id": bill_id,
        "payment_date": payload.payment_date or date.today().isoformat(),
        "payment_method": payload.payment_method,
        "message": "Baixa de pagamento registrada com sucesso no razão financeiro."
    }

@router.post("/payable/{bill_id}/cancel")
async def cancel_payable_bill(
    bill_id: str,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    return {
        "status": "CANCELLED",
        "bill_id": bill_id,
        "message": "Título a pagar cancelado com sucesso."
    }

# ----------------- CONTAS A RECEBER (AR) -----------------
@router.get("/receivable")
async def list_accounts_receivable(
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    return {
        "summary": {
            "total_pending": 48900.00,
            "total_overdue": 7430.00,
            "total_received_month": 92450.00
        },
        "receivables": [
            {
                "id": "ar-001",
                "client_name": "Samsung Eletrônica da Amazônia Ltda",
                "description": "Armazenagem Decendial 3º Período + Handling Carga",
                "document_number": "FAT-2026/11-0089",
                "amount": 7420.00,
                "due_date": "15/11/2026",
                "status": "PENDING",
                "pix_code": "00020126580014br.gov.bcb.pix0136mock_samsung_pix"
            },
            {
                "id": "ar-002",
                "client_name": "Huawei do Brasil Telecomunicações",
                "description": "Fatura Armazenagem Climatizada Módulo 5G",
                "document_number": "FAT-2026/10-0045",
                "amount": 7430.00,
                "due_date": "05/11/2026",
                "status": "OVERDUE",
                "pix_code": "00020126580014br.gov.bcb.pix0136mock_huawei_pix"
            },
            {
                "id": "ar-003",
                "client_name": "Bayer CropScience S/A",
                "description": "Diárias de Pátio e Desova de Containers",
                "document_number": "FAT-2026/11-0092",
                "amount": 34050.00,
                "due_date": "25/11/2026",
                "status": "PENDING",
                "pix_code": "00020126580014br.gov.bcb.pix0136mock_bayer_pix"
            },
            {
                "id": "ar-004",
                "client_name": "LG Electronics do Brasil Ltda",
                "description": "Armazenagem Geral e Paletização PBR",
                "document_number": "FAT-2026/10-0038",
                "amount": 18200.00,
                "due_date": "02/11/2026",
                "received_date": "02/11/2026",
                "status": "PAID"
            }
        ]
    }

@router.post("/receivable/{title_id}/settle")
async def settle_receivable_title(
    title_id: str,
    payload: SettleBillRequest,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Registra a liquidação (baixa) de recebimento de cliente (via conciliação bancária/gateway).
    """
    return {
        "status": "PAID",
        "title_id": title_id,
        "received_date": payload.payment_date or date.today().isoformat(),
        "message": "Recebimento confirmado e baixa registrada na conta do cliente."
    }

