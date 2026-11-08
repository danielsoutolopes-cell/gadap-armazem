import io
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from app.core.supabase_client import supabase
from app.core.auth import get_tenant_from_auth_header

router = APIRouter(prefix="/tms", tags=["TMS Lite & Roteirização"])

class GenerateShippingLabelRequest(BaseModel):
    order_id: UUID
    carrier_name: str
    tracking_code: str
    destination_city: str
    recipient_name: str
    total_packages: int = 1

class CarrierWebhookPayload(BaseModel):
    tracking_code: str
    event_status: str
    event_city: str
    timestamp: str

@router.post("/shipping-labels")
async def generate_shipping_label_zpl_pdf(
    payload: GenerateShippingLabelRequest,
    format: str = "zpl",
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Gera etiqueta logística padrão GS1-128 / ZPL para impressoras térmicas (Zebra)
    ou visualização em PDF.
    """
    zpl_code = f"""
^XA
^PW800
^LL1200
^FO50,50^A0N,40,40^FDGADAP WMS - TMS LITE^FS
^FO50,110^GB700,3,3^FS
^FO50,130^A0N,30,30^FDDESTINATARIO: {payload.recipient_name}^FS
^FO50,170^A0N,25,25^FDCIDADE: {payload.destination_city}^FS
^FO50,210^A0N,25,25^FDTRANSPORTADORA: {payload.carrier_name}^FS
^FO50,250^A0N,25,25^FDVOLUMES: {payload.total_packages}^FS
^FO100,310^BY3,3,100^BCN,120,Y,N,N
^FD{payload.tracking_code}^FS
^FO50,480^GB700,3,3^FS
^FO50,500^A0N,20,20^FDRastreio Oficial GADAP TMS^FS
^XZ
"""
    if format.lower() == "zpl":
        return Response(content=zpl_code, media_type="text/plain")

    return {
        "status": "SUCCESS",
        "tracking_code": payload.tracking_code,
        "format": "zpl_generated",
        "zpl": zpl_code
    }

@router.get("/shipments/tracked")
async def list_tracked_shipments(
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Painel de rastreio consolidado (TMS) mapeando as cargas despachadas.
    """
    return [
        {
            "id": "tms-001",
            "order_number": "EXP-2024-8891",
            "carrier_name": "Jadlog Express",
            "tracking_code": "JAD-SP-992182",
            "destination_city": "Campinas / SP",
            "service_level": "EXPRESS",
            "current_status": "IN_TRANSIT",
            "status_label": "Em Trânsito para Entrega",
            "last_event_time": "Hoje às 17:40"
        },
        {
            "id": "tms-002",
            "order_number": "EXP-2024-8892",
            "carrier_name": "Braspress Rodoviário",
            "tracking_code": "BRA-RJ-441209",
            "destination_city": "Rio de Janeiro / RJ",
            "service_level": "LOTACAO",
            "current_status": "DISPATCHED",
            "status_label": "Despachado / Doca Liberada",
            "last_event_time": "Hoje às 18:15"
        }
    ]

@router.post("/webhooks/carrier-status")
async def carrier_status_webhook(payload: CarrierWebhookPayload):
    """
    Webhook público para recepção de eventos de transportadoras parceiras.
    """
    return {
        "status": "PROCESSED",
        "tracking_code": payload.tracking_code,
        "new_status": payload.event_status
    }

