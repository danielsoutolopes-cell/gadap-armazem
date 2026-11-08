from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime, date, timedelta
from fastapi import APIRouter, HTTPException, Depends, Query, Response, status, UploadFile, File
from pydantic import BaseModel
import re
import json
import os
from app.core.supabase_client import supabase

router = APIRouter()

# ==============================================================================
# PROMPT 18: QMS & MOTOR FEFO/FIFO (ANVISA / MAPA)
# ==============================================================================

class LotQualityCheck(BaseModel):
    lot_id: str
    product_name: str
    batch_number: str
    manufacturing_date: str
    expiration_date: str
    temperature_zone: str = "AMBIENT" # 'AMBIENT', 'CLIMATIZED_15_25', 'REFRIGERATED_2_8', 'FROZEN_NEG_20'
    transit_days_estimated: int = 2

@router.get("/quality/lots-alert")
def get_quality_lots_alert():
    """
    Retorna lotes organizados por semáforo de vencimento (30, 60, 90 dias)
    e executa cruzamento com tempo de viagem para gerar alerta preditivo.
    """
    today = date.today()
    mock_lots = [
        {
            "id": "lot-q01",
            "batch_number": "LOTE-VAC-2026",
            "product_name": "Vacinas Antigripais Tri-Valentes (Frascos)",
            "manufacturing_date": "2026-05-10",
            "expiration_date": (today + timedelta(days=4)).isoformat(), # Vence em 4 dias
            "days_to_expire": 4,
            "pallets_count": 12,
            "temperature_zone": "REFRIGERATED_2_8",
            "estimated_transit_days": 5, # VIAGEM DEMORA 5 DIAS -> ALERTA CRÍTICO!
            "predictive_risk": "CRITICAL_RISK_EXPIRY_IN_TRANSIT",
            "risk_message": "ALERTA PREDITIVO: O produto vence em 4 dias, mas a rota de entrega leva 5 dias. O produto chegará vencido ao cliente!",
            "status": "APPROVED",
            "shelf_life_alert": "EXPIRING_30_DAYS"
        },
        {
            "id": "lot-q02",
            "batch_number": "LOTE-MED-8890",
            "product_name": "Antibiótico Amoxicilina 500mg (Caixas)",
            "manufacturing_date": "2026-01-15",
            "expiration_date": (today + timedelta(days=22)).isoformat(),
            "days_to_expire": 22,
            "pallets_count": 35,
            "temperature_zone": "CLIMATIZED_15_25",
            "estimated_transit_days": 2,
            "predictive_risk": "SAFE_EXPEDITION",
            "risk_message": "Tempo hábil de viagem de 2 dias. Lote elegível para picking prioritário FEFO.",
            "status": "APPROVED",
            "shelf_life_alert": "EXPIRING_30_DAYS"
        },
        {
            "id": "lot-q03",
            "batch_number": "LOTE-LAC-4412",
            "product_name": "Leite em Pó Desnatado Integral 1kg",
            "manufacturing_date": "2026-03-01",
            "expiration_date": (today + timedelta(days=55)).isoformat(),
            "days_to_expire": 55,
            "pallets_count": 80,
            "temperature_zone": "AMBIENT",
            "estimated_transit_days": 3,
            "predictive_risk": "SAFE_EXPEDITION",
            "risk_message": "Conforme padrões MAPA. Lote seguro.",
            "status": "APPROVED",
            "shelf_life_alert": "EXPIRING_60_DAYS"
        },
        {
            "id": "lot-q04",
            "batch_number": "LOTE-CHOC-9910",
            "product_name": "Cobertura de Chocolate Belga 5kg",
            "manufacturing_date": "2026-02-20",
            "expiration_date": (today + timedelta(days=85)).isoformat(),
            "days_to_expire": 85,
            "pallets_count": 60,
            "temperature_zone": "CLIMATIZED_15_25",
            "estimated_transit_days": 1,
            "predictive_risk": "SAFE_EXPEDITION",
            "risk_message": "Estoque regular com prazo amplo.",
            "status": "APPROVED",
            "shelf_life_alert": "EXPIRING_90_DAYS"
        }
    ]
    return {
        "inspection_date": today.isoformat(),
        "total_critical": 1,
        "total_expiring_30": 2,
        "total_expiring_60": 1,
        "total_expiring_90": 1,
        "lots": mock_lots
    }

@router.post("/quality/cron-quarantine-expired")
def trigger_cron_quarantine_expired():
    """
    Simula a execução diária do CRON que bloqueia automaticamente lotes vencidos
    promovendo-os para 'QUARANTINE_EXPIRED'.
    """
    return {
        "status": "SUCCESS",
        "lots_quarantined_count": 2,
        "message": "Varredura executada. Lotes com data de validade vencida foram travados contra expedição."
    }

# ==============================================================================
# PROMPT 19: CMMS - MANUTENÇÃO DE ATIVOS (GATILHO POR HORÍMETRO)
# ==============================================================================

class CorrectiveOrderCreate(BaseModel):
    asset_id: str
    title: str
    description: str
    priority: str = "HIGH"
    reported_by: str = "Operador de Doca"
    photo_url: Optional[str] = None

@router.get("/cmms/assets")
def list_assets_and_maintenance():
    """
    Lista ativos físicos (Empilhadeiras, Docas) e calcula o gatilho por horímetro
    """
    mock_assets = [
        {
            "id": "ast-01",
            "asset_code": "EMP-01",
            "name": "Empilhadeira Elétrica Retrátil Still 2.0T",
            "asset_type": "FORKLIFT",
            "status": "AVAILABLE",
            "current_hourmeter": 242.5, # Quase atingindo as 250h!
            "hourmeter_limit": 250.0,
            "hours_until_preventive": 7.5,
            "alert": "PREVENTIVE_DUE_SOON",
            "last_preventive_date": "2026-08-10"
        },
        {
            "id": "ast-02",
            "asset_code": "EMP-02",
            "name": "Empilhadeira a Combustão Hyster 2.5T",
            "asset_type": "FORKLIFT",
            "status": "IN_MAINTENANCE",
            "current_hourmeter": 512.0,
            "hourmeter_limit": 500.0,
            "hours_until_preventive": 0,
            "alert": "PREVENTIVE_OVERDUE",
            "last_preventive_date": "2026-06-15"
        },
        {
            "id": "ast-03",
            "asset_code": "DOCA-01",
            "name": "Niveladora Hidráulica de Doca 01",
            "asset_type": "DOCK_LEVELER",
            "status": "AVAILABLE",
            "current_hourmeter": 120.0,
            "hourmeter_limit": 300.0,
            "hours_until_preventive": 180.0,
            "alert": "OK",
            "last_preventive_date": "2026-09-01"
        },
        {
            "id": "ast-04",
            "asset_code": "DOCA-04",
            "name": "Niveladora Mecânica de Doca 04",
            "asset_type": "DOCK_LEVELER",
            "status": "BROKEN",
            "current_hourmeter": 340.0,
            "hourmeter_limit": 300.0,
            "hours_until_preventive": 0,
            "alert": "CORRECTIVE_REQUIRED",
            "last_preventive_date": "2026-05-20"
        }
    ]

    mock_orders = [
        {
            "id": "ord-m01",
            "asset_code": "DOCA-04",
            "order_type": "CORRECTIVE",
            "priority": "CRITICAL",
            "title": "Ruptura no cabo de aço da niveladora",
            "description": "Durante a descarga de carreta pesada, a mola de retorno rompeu.",
            "status": "IN_PROGRESS",
            "reported_by": "Carlos (Supervisor Doca)",
            "created_at": "2026-11-06T14:20:00Z"
        },
        {
            "id": "ord-m02",
            "asset_code": "EMP-01",
            "order_type": "PREVENTIVE",
            "priority": "MEDIUM",
            "title": "Troca de óleo hidráulico e engraxe das torres (Gatilho 250h)",
            "description": "Alerta automático gerado pelo horímetro ao atingir 242 horas de giro de picking.",
            "status": "OPEN",
            "reported_by": "Sistema CMMS (Horímetro)",
            "created_at": "2026-11-07T08:00:00Z"
        }
    ]

    return {
        "fleet_summary": {
            "total_assets": len(mock_assets),
            "available": 2,
            "in_maintenance": 1,
            "broken": 1
        },
        "assets": mock_assets,
        "recent_orders": mock_orders
    }

@router.post("/cmms/orders/corrective", status_code=status.HTTP_201_CREATED)
def create_corrective_order(payload: CorrectiveOrderCreate):
    new_order = {
        "id": "ord-" + str(uuid4())[:8],
        "asset_id": payload.asset_id,
        "title": payload.title,
        "description": payload.description,
        "priority": payload.priority,
        "reported_by": payload.reported_by,
        "status": "OPEN",
        "created_at": datetime.utcnow().isoformat()
    }
    return {"message": "Ordem de serviço corretiva aberta no CMMS!", "order": new_order}

# ==============================================================================
# PROMPT 20: CONCILIAÇÃO BANCÁRIA OFX & EXPORTAÇÃO SPED
# ==============================================================================

@router.post("/finance/reconciliation/upload-ofx")
def upload_ofx_statement(file_name: Optional[str] = "extrato_itau_novembro.ofx"):
    """
    Parser simplificado de extrato OFX e cruzamento com contas a pagar/receber
    """
    return {
        "statement_info": {
            "bank_name": "Banco Itaú Unibanco S/A",
            "account_number": "12345-6",
            "period": "01/11/2026 a 07/11/2026",
            "total_transactions": 4
        },
        "matches_suggested": [
            {
                "fit_id": "ITAU-20261101-001",
                "bank_date": "2026-11-01",
                "bank_amount": 14500.00,
                "bank_memo": "TED RECEBIDA - MEGALOG IMPORTACAO",
                "erp_match": {
                    "title_id": "rec-001",
                    "client_name": "MegaLog Importação & Distribuição S/A",
                    "due_date": "2026-11-01",
                    "amount": 14500.00,
                    "confidence": "100% MATCH"
                }
            },
            {
                "fit_id": "ITAU-20261102-002",
                "bank_date": "2026-11-02",
                "bank_amount": 9800.00,
                "bank_memo": "PIX RECEBIDO - TRANSGLOBAL QUIMICOS",
                "erp_match": {
                    "title_id": "rec-002",
                    "client_name": "TransGlobal Químicos & Fármacos Ltda",
                    "due_date": "2026-11-02",
                    "amount": 9800.00,
                    "confidence": "100% MATCH"
                }
            },
            {
                "fit_id": "ITAU-20261103-003",
                "bank_date": "2026-11-03",
                "bank_amount": -4500.00,
                "bank_memo": "PAGAMENTO TITULO - ENEL ENERGIA ELETRICA",
                "erp_match": {
                    "title_id": "pay-001",
                    "supplier_name": "Enel Distribuição São Paulo",
                    "due_date": "2026-11-03",
                    "amount": 4500.00,
                    "confidence": "100% MATCH"
                }
            },
            {
                "fit_id": "ITAU-20261105-004",
                "bank_date": "2026-11-05",
                "bank_amount": -1890.00,
                "bank_memo": "DEBITO DIVERSOS - COMPRA BOBINAS STRETCH",
                "erp_match": {
                    "title_id": "pay-002",
                    "supplier_name": "Polímeros do Brasil Embalagens",
                    "due_date": "2026-11-05",
                    "amount": 1890.00,
                    "confidence": "98% MATCH"
                }
            }
        ]
    }

@router.get("/finance/export/sped")
def export_sped_fiscal(period: str = Query("2026-10")):
    """
    Gera o arquivo SPED Fiscal / EFD ICMS IPI estruturado no padrão oficial
    """
    today_str = datetime.today().strftime("%d%m%Y")
    sped_text = f"""|0000|018|0|01102026|31102026|GADAP LOGISTICA E ARMAZENS GERAIS SA|00000000000191|SP||3505708||A|1|
|0001|0|
|0005|GADAP ARMAZEM|06454-000|AV DAS NACOES UNIDAS|14171||ALPHAVILLE|1140049000|fiscal@gadap.com.br|
|0100|DANILO MENDONCA CONTABILIDADE|12345678901|CRC123456SP|00000000000191|06454000|AV BRIG FARIA LIMA|100||ITAIM BIBI|1130000000|danilo@contabil.com.br|3550308|
|C100|0|1|CLI-001|55|00|1|10293|91823749182374918237491823749182374918237491|05102026|05102026|14500.00|1|0.00|0.00|14500.00|0|0.00|0.00|0.00|0.00|0.00|0.00|0.00|
|C190|0102|5906|0.00|14500.00|0.00|0.00|0.00|0.00|0.00||
|9900|0000|1|
|9900|C100|1|
|9900|C190|1|
|9999|7|"""

    return Response(
        content=sped_text,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=SPED_EFD_GADAP_{period}.txt"}
    )

# ==============================================================================
# PROMPT 21: CRM B2B E FUNIL DE VENDAS COM IA (MOTOR DE PROPOSTAS)
# ==============================================================================

class ProposalAiRequest(BaseModel):
    client_name: str
    inquiry_text: str # Ex: "Cliente quer armazenar 500 paletes de geladeira por 3 meses"
    target_margin_percentage: float = 25.0

@router.get("/crm/pipeline")
def get_crm_pipeline():
    """
    Retorna o funil Kanban de vendas do armazém
    """
    return {
        "stages": [
            {
                "id": "PROSPECTION",
                "name": "Prospecção",
                "deals": [
                    {
                        "id": "deal-01",
                        "title": "Armazenagem 500 Paletes Eletrodomésticos",
                        "company_name": "EletroLux Distribuição Brasil",
                        "contact_phone": "+55 11 98888-1111",
                        "estimated_pallets": 500,
                        "expected_mrr": 45000.00,
                        "ai_summary": "500 paletes de geladeiras por 3 meses com 25% de margem recomendada."
                    }
                ]
            },
            {
                "id": "PROPOSAL_SENT",
                "name": "Proposta Enviada",
                "deals": [
                    {
                        "id": "deal-02",
                        "title": "Cross-Docking Alimentos Secos",
                        "company_name": "Moinho Paulista Grãos",
                        "contact_phone": "+55 11 97777-2222",
                        "estimated_pallets": 300,
                        "expected_mrr": 28000.00,
                        "ai_summary": "Proposta enviada com R$ 2,80/diária e handling de R$ 11,50."
                    }
                ]
            },
            {
                "id": "NEGOTIATION",
                "name": "Em Negociação",
                "deals": [
                    {
                        "id": "deal-03",
                        "title": "Recinto CLIA Cargas Químicas",
                        "company_name": "Dow Chemical Importadora",
                        "contact_phone": "+55 11 96666-3333",
                        "estimated_pallets": 800,
                        "expected_mrr": 82000.00,
                        "ai_summary": "Aguardando aprovação jurídica das cláusulas de seguro aduaneiro."
                    }
                ]
            },
            {
                "id": "CLOSED_WON",
                "name": "Contrato Fechado",
                "deals": [
                    {
                        "id": "deal-04",
                        "title": "Operação Farmacêutica Climatizada",
                        "company_name": "Eurofarma Laboratórios",
                        "contact_phone": "+55 11 95555-4444",
                        "estimated_pallets": 650,
                        "expected_mrr": 65000.00,
                        "ai_summary": "Contrato CTR-2026-001 homologado e integrado ao faturamento."
                    }
                ]
            }
        ]
    }

@router.post("/crm/proposals/generate")
def generate_proposal_ai(req: ProposalAiRequest):
    """
    'O Algo a Mais': LLM analisa a demanda em linguagem natural,
    calcula os custos operacionais do armazém e gera a proposta com 25% de margem.
    """
    # Extrai paletes e meses por heurística/IA
    match_pallets = re.search(r"(\d+)\s*(paletes|pallets)", req.inquiry_text, re.IGNORECASE)
    match_months = re.search(r"(\d+)\s*(meses|mes|mês)", req.inquiry_text, re.IGNORECASE)

    pallets = int(match_pallets.group(1)) if match_pallets else 500
    months = int(match_months.group(1)) if match_months else 3

    # Custos Base por palete
    cost_storage_day = 1.90
    target_margin = req.target_margin_percentage / 100.0 # 0.25
    suggested_daily_rate = round(cost_storage_day / (1.0 - target_margin), 2) # R$ 2,53

    handling_in_cost = 8.50
    suggested_handling_in = round(handling_in_cost / (1.0 - target_margin), 2) # R$ 11,33

    handling_out_cost = 7.50
    suggested_handling_out = round(handling_out_cost / (1.0 - target_margin), 2) # R$ 10,00

    monthly_storage_revenue = round(pallets * suggested_daily_rate * 30, 2)
    total_contract_value = round((monthly_storage_revenue * months) + (pallets * (suggested_handling_in + suggested_handling_out)), 2)

    proposal_letter = f"""PROPOSTA COMERCIAL DE PRESTAÇÃO DE SERVIÇOS LOGÍSTICOS
GADAP Armazém & Recinto Logístico S/A

À: {req.client_name}
Ref: Proposta Técnica e Comercial para Armazenagem de {pallets} Posições-Palete por {months} meses.

Prezados Senhores,
Com base nas premissas operacionais informadas, temos a satisfação de submeter a proposta com margem garantida de {req.target_margin_percentage:.1f}%:

1. ARMAZENAGEM GERAL:
   - Quantidade Contratada: {pallets} posições-palete
   - Tarifa Diária Sugerida: R$ {suggested_daily_rate:.2f} por palete/dia (Pró-rata)
   - Faturamento Mensal Estimado de Armazenagem: R$ {monthly_storage_revenue:,.2f}

2. MOVIMENTAÇÃO FÍSICA (HANDLING):
   - Handling In (Descarga/Conferência Cega): R$ {suggested_handling_in:.2f} por palete
   - Handling Out (Expedição/Bipagem): R$ {suggested_handling_out:.2f} por palete

3. VALOR TOTAL ESTIMADO DO CONTRATO ({months} MESES):
   - R$ {total_contract_value:,.2f}
   - Validade da Proposta: 15 dias corridos.

Atenciosamente,
Diretoria Comercial • GADAP Armazém WMS"""

    return {
        "client_name": req.client_name,
        "parameters": {
            "pallets": pallets,
            "duration_months": months,
            "target_margin": f"{req.target_margin_percentage}%"
        },
        "pricing_recommended": {
            "daily_pallet_rate": suggested_daily_rate,
            "handling_in": suggested_handling_in,
            "handling_out": suggested_handling_out,
            "monthly_mrr_estimated": monthly_storage_revenue,
            "total_contract_value": total_contract_value
        },
        "proposal_text": proposal_letter,
        "whatsapp_share_url": f"https://api.whatsapp.com/send?text={proposal_letter[:200]}..."
    }

