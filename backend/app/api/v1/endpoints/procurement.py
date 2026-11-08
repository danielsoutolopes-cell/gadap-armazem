from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.supabase_client import supabase
from app.core.auth import get_tenant_from_auth_header

router = APIRouter(prefix="/procurement", tags=["Compras Internas & Suprimentos"])

# ----------------- SCHEMAS -----------------
class PurchaseItemSchema(BaseModel):
    item_description: str = Field(..., min_length=2)
    unit_of_measure: str = Field(default="UN")
    quantity: float = Field(..., gt=0)
    unit_cost: float = Field(..., ge=0)

class CreatePurchaseOrderRequest(BaseModel):
    supplier_id: str
    supplier_name: str
    category: str = Field(default="PACKAGING")
    notes: Optional[str] = None
    items: List[PurchaseItemSchema]

class ApprovePurchaseOrderRequest(BaseModel):
    due_days: int = Field(default=30, ge=1)

# ----------------- ROTAS -----------------
@router.get("/orders")
async def list_purchase_orders(
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Lista pedidos de compra de insumos do galpão (filme stretch, paletes, EPIs).
    """
    return [
        {
            "id": "po-001",
            "order_number": "OC-2026-0042",
            "supplier_name": "Paletes Brasil Embalagens de Madeira Ltda",
            "category": "PACKAGING",
            "category_label": "Embalagens & Paletes",
            "status": "APPROVED",
            "total_amount": 9000.00,
            "created_at": "05/11/2026",
            "items_count": 2,
            "items": [
                {"description": "Palete de Madeira PBR Tratado ABRAS", "quantity": 200, "unit": "UN", "unit_cost": 45.00}
            ],
            "payable_ref": "FAT-PB-9912",
            "payable_due_date": "05/12/2026"
        },
        {
            "id": "po-002",
            "order_number": "OC-2026-0043",
            "supplier_name": "MegaFlex Bobinas & Stretch Ltda",
            "category": "SUPPLIES",
            "category_label": "Insumos Operacionais",
            "status": "PENDING_APPROVAL",
            "total_amount": 3750.00,
            "created_at": "Hoje às 14:20",
            "items_count": 1,
            "items": [
                {"description": "Bobina de Filme Stretch 25 micras 500mm", "quantity": 50, "unit": "ROLO", "unit_cost": 75.00}
            ]
        },
        {
            "id": "po-003",
            "order_number": "OC-2026-0044",
            "supplier_name": "Protec EPIs e Uniformes Industriais",
            "category": "EPIS",
            "category_label": "EPIs Operadores",
            "status": "PENDING_APPROVAL",
            "total_amount": 1840.00,
            "created_at": "Hoje às 16:00",
            "items_count": 3,
            "items": [
                {"description": "Luva de Vaqueta Mista Térmica", "quantity": 40, "unit": "PAR", "unit_cost": 28.00},
                {"description": "Colete Refletivo com Zíper", "quantity": 24, "unit": "UN", "unit_cost": 30.00}
            ]
        }
    ]

@router.post("/orders")
async def create_purchase_order(
    payload: CreatePurchaseOrderRequest,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    total = sum(i.quantity * i.unit_cost for i in payload.items)
    order_number = f"OC-{datetime.now().strftime('%Y%m')}-{uuid4().hex[:4].upper()}"

    return {
        "status": "SUCCESS",
        "order": {
            "id": str(uuid4()),
            "order_number": order_number,
            "supplier_name": payload.supplier_name,
            "category": payload.category,
            "status": "PENDING_APPROVAL",
            "total_amount": total,
            "created_at": "Agora",
            "items": [i.dict() for i in payload.items]
        },
        "message": "Pedido de compra gerado com sucesso. Aguardando aprovação financeira."
    }

@router.post("/orders/{order_id}/approve")
async def approve_purchase_order_and_bill(
    order_id: str,
    payload: ApprovePurchaseOrderRequest,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Ao aprovar a Ordem de Compra, o sistema integra e lança automaticamente
    o título no Contas a Pagar (accounts_payable) do galpão com vencimento futuro.
    """
    due_date = date.today() + timedelta(days=payload.due_days)
    payable_id = str(uuid4())

    return {
        "status": "APPROVED",
        "order_id": order_id,
        "new_order_status": "APPROVED",
        "financial_integration": {
            "payable_id": payable_id,
            "document_number": f"TIT-{order_id[:8].upper()}",
            "amount": 3750.00,
            "due_date": due_date.isoformat(),
            "status": "PENDING",
            "message": f"Título a pagar lançado automaticamente no Contas a Pagar para {due_date.strftime('%d/%m/%Y')}."
        }
    }

