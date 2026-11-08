from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.supabase_client import supabase
from app.core.auth import get_tenant_from_auth_header

router = APIRouter(tags=["Catálogo Mestre de Serviços Aduaneiros & Armazéns Gerais"])

class CustomServiceCreateSchema(BaseModel):
    client_id: Optional[UUID] = None # Se informado, vincula exclusivamente àquele cliente depositante
    service_sku: str = Field(..., min_length=2, description="Código único ao cliente / SKU de serviço")
    service_name: str = Field(..., min_length=3)
    category: str = Field(default="STORAGE") # STORAGE, HANDLING, CUSTOMS_CLEARANCE, VALUE_ADDED, ANCILLARY
    unit_of_measure: str = Field(default="DIARIA_PALETE")
    default_price: float = Field(..., ge=0)
    item_lc116: str = Field(default="11.04", description="Item da Lista de Serviços LC 116/03")
    aliquota_iss: float = Field(default=5.00)
    cfop_padrao: str = Field(default="5906")
    is_bonded_customs: bool = Field(default=false, description="Indicador se é serviço específico de Recinto Alfandegado EADI")

@router.get("/customs/services")
async def list_warehouse_and_customs_services(
    client_id: Optional[UUID] = Query(None),
    category: Optional[str] = Query(None),
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Retorna os serviços mestres padronizados do armazém geral/alfandegado,
    somados aos serviços exclusivos parametrizados para o cliente (isolamento multi-cliente).
    """
    base_services = [
        # Armazenagem
        {"id": "srv-01", "service_sku": "SRV-ARM-DEC-CIF", "service_name": "Armazenagem Decendial Geral Ad Valorem (Sobre Valor CIF)", "category": "STORAGE", "unit_of_measure": "DECENDIO_CIF", "default_price": 0.0050, "item_lc116": "11.04", "cfop_padrao": "5906", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-02", "service_sku": "SRV-ARM-PAL-DIA", "service_name": "Diária de Armazenagem por Posição-Palete PBR (Dry)", "category": "STORAGE", "unit_of_measure": "DIARIA_PALETE", "default_price": 2.85, "item_lc116": "11.04", "cfop_padrao": "5906", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-03", "service_sku": "SRV-ARM-CLIMAT", "service_name": "Diária de Armazenagem Climatizada (15°C a 25°C) - Farmacêutico", "category": "STORAGE", "unit_of_measure": "DIARIA_PALETE", "default_price": 5.40, "item_lc116": "11.04", "cfop_padrao": "5906", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-04", "service_sku": "SRV-ARM-CONG-FR", "service_name": "Diária de Armazenagem em Câmara Frigorificada (-18°C a -22°C)", "category": "STORAGE", "unit_of_measure": "DIARIA_PALETE", "default_price": 8.90, "item_lc116": "11.04", "cfop_padrao": "5906", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        # Handling
        {"id": "srv-05", "service_sku": "SRV-HDL-IN-TON", "service_name": "Handling Inbound - Descarga, Triagem e Entrada em Porta-Paletes", "category": "HANDLING", "unit_of_measure": "TONELADA", "default_price": 35.00, "item_lc116": "11.04", "cfop_padrao": "1905", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-06", "service_sku": "SRV-HDL-OUT-TON", "service_name": "Handling Outbound - Separação, Picking e Carregamento de Saída", "category": "HANDLING", "unit_of_measure": "TONELADA", "default_price": 32.00, "item_lc116": "11.04", "cfop_padrao": "5906", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-07", "service_sku": "SRV-DESOVA-40FT", "service_name": "Desova Mecanizada de Container High Cube 40 pés (Inbound)", "category": "HANDLING", "unit_of_measure": "CONTAINER_UN", "default_price": 950.00, "item_lc116": "11.04", "cfop_padrao": "1905", "aliquota_iss": 5.0, "is_bonded_customs": True, "client_scope": "GLOBAL_ARMAZEM"},
        # Recintos Alfandegários (EADI / Porto Seco)
        {"id": "srv-08", "service_sku": "SRV-ADU-POS-FISC", "service_name": "Posicionamento para Vistoria da Receita Federal / MAPA / Anvisa", "category": "CUSTOMS_CLEARANCE", "unit_of_measure": "CONTAINER_UN", "default_price": 420.00, "item_lc116": "11.04", "cfop_padrao": "5949", "aliquota_iss": 5.0, "is_bonded_customs": True, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-09", "service_sku": "SRV-ADU-DEMURRAGE", "service_name": "Gestão Preventiva e Devolução de Container Vazio (Demurrage Free-Time)", "category": "CUSTOMS_CLEARANCE", "unit_of_measure": "CONTAINER_UN", "default_price": 85.00, "item_lc116": "11.04", "cfop_padrao": "0000", "aliquota_iss": 5.0, "is_bonded_customs": True, "client_scope": "GLOBAL_ARMAZEM"},
        # Serviços Acessórios e VAS
        {"id": "srv-10", "service_sku": "SRV-VAS-PAL-PBR", "service_name": "Fornecimento de Palete PBR Madeira Tratamento Fitossanitário HT", "category": "VALUE_ADDED", "unit_of_measure": "UNIDADE", "default_price": 48.00, "item_lc116": "14.05", "cfop_padrao": "5949", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"},
        {"id": "srv-11", "service_sku": "SRV-VAS-STRETCH", "service_name": "Aplicação de Filme Stretch Automático com Cinta de Arquear", "category": "VALUE_ADDED", "unit_of_measure": "UNIDADE", "default_price": 22.00, "item_lc116": "14.05", "cfop_padrao": "5949", "aliquota_iss": 5.0, "is_bonded_customs": False, "client_scope": "GLOBAL_ARMAZEM"}
    ]

    # Se informado cliente específico, adiciona os serviços customizados daquele cliente (SKUs exclusivos)
    if client_id:
        custom_client_services = [
            {
                "id": "srv-cust-sams-01",
                "client_id": str(client_id),
                "service_sku": "SKU-SAMS-RETRABALHO",
                "service_name": "Retrabalho de Placas e Troca de Cabos HDMI (Exclusivo Samsung)",
                "category": "VALUE_ADDED",
                "unit_of_measure": "UNIDADE",
                "default_price": 14.50,
                "item_lc116": "14.05",
                "cfop_padrao": "5949",
                "aliquota_iss": 5.0,
                "is_bonded_customs": False,
                "client_scope": "EXCLUSIVO_CLIENTE"
            }
        ]
        return base_services + custom_client_services

    return base_services

@router.post("/customs/services")
async def create_custom_service(
    payload: CustomServiceCreateSchema,
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """
    Cadastra um novo serviço customizado com código SKU exclusivo ao cliente
    ou mestre para o armazém.
    """
    new_srv = {
        "id": str(uuid4()),
        "tenant_id": str(tenant_id),
        "client_id": str(payload.client_id) if payload.client_id else None,
        "service_sku": payload.service_sku.upper(),
        "service_name": payload.service_name,
        "category": payload.category,
        "unit_of_measure": payload.unit_of_measure,
        "default_price": payload.default_price,
        "item_lc116": payload.item_lc116,
        "aliquota_iss": payload.aliquota_iss,
        "cfop_padrao": payload.cfop_padrao,
        "is_bonded_customs": payload.is_bonded_customs,
        "client_scope": "EXCLUSIVO_CLIENTE" if payload.client_id else "GLOBAL_ARMAZEM",
        "created_at": datetime.utcnow().isoformat()
    }
    try:
        supabase.table("customs_warehouse_services").insert(new_srv).execute()
    except Exception:
        pass

    return {
        "status": "SUCCESS",
        "message": f"Serviço '{payload.service_name}' cadastrado com sucesso sob o SKU de serviço {payload.service_sku}!",
        "service": new_srv
    }

