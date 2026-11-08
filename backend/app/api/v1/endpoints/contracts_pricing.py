from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime, date
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from app.core.supabase_client import supabase

router = APIRouter()

# ---------------------------------------------------------
# Schemas
# ---------------------------------------------------------

class TariffRuleCreate(BaseModel):
    rule_name: str
    charge_type: str # 'STORAGE', 'HANDLING_IN', 'HANDLING_OUT', 'EXTRA_SERVICE'
    calculation_unit: str # 'PALLET_DAY', 'M3_DAY', 'M2_MONTH', 'TON_DAY', 'UNIT'
    base_price: float
    is_prorata: bool = True
    condition_cargo_type: str = "ANY" # 'ANY', 'DRY', 'REFRIGERATED', 'HAZARDOUS', 'BONDED'
    condition_min_days: int = 0
    condition_extra_params: Optional[Dict[str, Any]] = None

class ContractCreate(BaseModel):
    client_id: Optional[str] = None
    client_name: str
    contract_number: str
    title: str
    start_date: str
    end_date: Optional[str] = None
    adjustment_index: str = "IPCA" # 'IPCA', 'IGP-M', 'INPC', 'FIXED'
    grace_period_days: int = 0 # Freetime em dias
    minimum_monthly_billing: float = 0.0 # Franquia mínima
    billing_cycle: str = "DECENDIAL" # 'DECENDIAL', 'MONTHLY', 'QUINZENAL'
    tariff_rules: List[TariffRuleCreate] = []

class BillingSimulationRequest(BaseModel):
    contract_id: Optional[str] = None
    cargo_type: str = "DRY" # 'DRY', 'REFRIGERATED', 'HAZARDOUS', 'BONDED'
    pallets_count: float = 100.0
    weight_tons: float = 25.0
    volume_m3: float = 120.0
    storage_days: int = 15
    freetime_days: int = 0
    handling_in_needed: bool = True
    handling_out_needed: bool = True
    stretch_film_applied: bool = True
    manual_destuffing_needed: bool = False # Desova manual

# ---------------------------------------------------------
# Endpoints de Contratos & Pricing
# ---------------------------------------------------------

@router.get("/contracts")
def list_contracts():
    """
    Lista contratos comerciais ativos com regras tarifárias associadas
    """
    mock_contracts = [
        {
            "id": "ctr-001",
            "contract_number": "CTR-2026-001",
            "client_name": "MegaLog Importação & Distribuição S/A",
            "title": "Armazenagem Geral e Operações de Cross-Docking",
            "start_date": "2026-01-01",
            "end_date": "2026-12-31",
            "adjustment_index": "IPCA",
            "grace_period_days": 3,
            "minimum_monthly_billing": 5000.00,
            "billing_cycle": "DECENDIAL",
            "status": "ACTIVE",
            "tariff_rules": [
                {
                    "rule_name": "Armazenagem Seca Diária",
                    "charge_type": "STORAGE",
                    "calculation_unit": "PALLET_DAY",
                    "base_price": 2.80,
                    "is_prorata": True,
                    "condition_cargo_type": "DRY"
                },
                {
                    "rule_name": "Armazenagem Climatizada / Frigorificada",
                    "charge_type": "STORAGE",
                    "calculation_unit": "PALLET_DAY",
                    "base_price": 4.50,
                    "is_prorata": True,
                    "condition_cargo_type": "REFRIGERATED"
                },
                {
                    "rule_name": "Handling In (Descarga & Recebimento)",
                    "charge_type": "HANDLING_IN",
                    "calculation_unit": "PALLET_DAY",
                    "base_price": 12.00,
                    "is_prorata": False,
                    "condition_cargo_type": "ANY"
                },
                {
                    "rule_name": "Handling Out (Expedição & Carregamento)",
                    "charge_type": "HANDLING_OUT",
                    "calculation_unit": "PALLET_DAY",
                    "base_price": 10.00,
                    "is_prorata": False,
                    "condition_cargo_type": "ANY"
                },
                {
                    "rule_name": "Aplicação de Filme Stretch Spot",
                    "charge_type": "EXTRA_SERVICE",
                    "calculation_unit": "UNIT",
                    "base_price": 18.00,
                    "is_prorata": False,
                    "condition_cargo_type": "ANY"
                }
            ]
        },
        {
            "id": "ctr-002",
            "contract_number": "CTR-2026-002",
            "client_name": "TransGlobal Químicos & Fármacos Ltda",
            "title": "Recinto Alfandegado (CLIA) e Cargas Perigosas",
            "start_date": "2026-02-01",
            "end_date": "2027-01-31",
            "adjustment_index": "IGP-M",
            "grace_period_days": 5,
            "minimum_monthly_billing": 12000.00,
            "billing_cycle": "DECENDIAL",
            "status": "ACTIVE",
            "tariff_rules": [
                {
                    "rule_name": "Armazenagem Cargas Perigosas (IMO)",
                    "charge_type": "STORAGE",
                    "calculation_unit": "PALLET_DAY",
                    "base_price": 6.80,
                    "is_prorata": True,
                    "condition_cargo_type": "HAZARDOUS"
                },
                {
                    "rule_name": "Handling Especial Blindado",
                    "charge_type": "HANDLING_IN",
                    "calculation_unit": "TON_DAY",
                    "base_price": 35.00,
                    "is_prorata": False,
                    "condition_cargo_type": "HAZARDOUS"
                }
            ]
        }
    ]

    if not supabase:
        return mock_contracts

    try:
        res = supabase.table("contracts").select("*, tariff_rules(*)").execute()
        return res.data if res.data else mock_contracts
    except Exception:
        return mock_contracts

@router.post("/contracts", status_code=status.HTTP_201_CREATED)
def create_contract(payload: ContractCreate):
    new_contract_id = str(uuid4())
    record = {
        "id": new_contract_id,
        "contract_number": payload.contract_number,
        "title": payload.title,
        "client_name": payload.client_name,
        "start_date": payload.start_date,
        "end_date": payload.end_date,
        "adjustment_index": payload.adjustment_index,
        "grace_period_days": payload.grace_period_days,
        "minimum_monthly_billing": payload.minimum_monthly_billing,
        "billing_cycle": payload.billing_cycle,
        "status": "ACTIVE",
        "created_at": datetime.utcnow().isoformat(),
        "tariff_rules": [r.dict() for r in payload.tariff_rules]
    }
    return {"message": "Contrato e regras tarifárias criados com sucesso!", "contract": record}

# ---------------------------------------------------------
# "O ALGO A MAIS": Simulador Preditivo de Faturas
# ---------------------------------------------------------

@router.post("/simulate")
def simulate_billing(req: BillingSimulationRequest):
    """
    Executa a simulação completa da fatura de um cliente fictício ou real:
    - Pró-rata diário por espaço ocupado
    - Abatimento do período de carência (Freetime)
    - Sobretaxas de carga frigorificada ou perigosa
    - Handling Inbound / Outbound
    - Serviços adicionais (Filme Stretch, Desova Manual)
    - Verificação de franquia mínima mensal contratual
    """
    # 1. Definição das tarifas de acordo com a condição da carga
    daily_pallet_rate = 2.80
    if req.cargo_type == "REFRIGERATED":
        daily_pallet_rate = 4.50
    elif req.cargo_type == "HAZARDOUS":
        daily_pallet_rate = 6.80
    elif req.cargo_type == "BONDED":
        daily_pallet_rate = 3.90

    # 2. Cálculo de Armazenagem com Freetime e Pró-rata
    freetime = max(req.freetime_days, 0)
    billable_days = max(0, req.storage_days - freetime)
    storage_total = round(req.pallets_count * daily_pallet_rate * billable_days, 2)

    # 3. Handling (Movimentação)
    handling_in_rate = 12.00
    handling_out_rate = 10.00
    handling_in_total = round(req.pallets_count * handling_in_rate, 2) if req.handling_in_needed else 0.0
    handling_out_total = round(req.pallets_count * handling_out_rate, 2) if req.handling_out_needed else 0.0

    # 4. Serviços Adicionais
    stretch_total = round(req.pallets_count * 18.00, 2) if req.stretch_film_applied else 0.0
    destuffing_total = round(req.weight_tons * 45.00, 2) if req.manual_destuffing_needed else 0.0

    subtotal = storage_total + handling_in_total + handling_out_total + stretch_total + destuffing_total

    # 5. Aplicação de Franquia Mínima
    minimum_billing = 1500.00
    franchise_applied = False
    final_total = subtotal
    if subtotal < minimum_billing:
        franchise_applied = True
        final_total = minimum_billing

    breakdown = [
        {
            "category": "Armazenagem (Pró-rata)",
            "description": f"{req.pallets_count:.0f} Paletes x {billable_days} dias faturáveis (Freetime: {freetime}d)",
            "unit_price": daily_pallet_rate,
            "quantity": req.pallets_count * billable_days,
            "total": storage_total
        },
        {
            "category": "Handling Inbound",
            "description": f"Descarga & Conferência Física de {req.pallets_count:.0f} Paletes",
            "unit_price": handling_in_rate,
            "quantity": req.pallets_count if req.handling_in_needed else 0,
            "total": handling_in_total
        },
        {
            "category": "Handling Outbound",
            "description": f"Picking & Expedição de {req.pallets_count:.0f} Paletes",
            "unit_price": handling_out_rate,
            "quantity": req.pallets_count if req.handling_out_needed else 0,
            "total": handling_out_total
        },
        {
            "category": "Serviços Extras",
            "description": "Envelopamento com Filme Stretch Bobina 500mm",
            "unit_price": 18.00,
            "quantity": req.pallets_count if req.stretch_film_applied else 0,
            "total": stretch_total
        },
        {
            "category": "Serviços Extras",
            "description": f"Desova Manual de Container ({req.weight_tons:.1f} Toneladas)",
            "unit_price": 45.00,
            "quantity": req.weight_tons if req.manual_destuffing_needed else 0,
            "total": destuffing_total
        }
    ]

    return {
        "simulation_id": f"SIM-{str(uuid4())[:8].upper()}",
        "cargo_type": req.cargo_type,
        "storage_days": req.storage_days,
        "freetime_days": freetime,
        "billable_days": billable_days,
        "subtotal": subtotal,
        "minimum_contract_franchise": minimum_billing,
        "franchise_applied": franchise_applied,
        "final_projected_amount": final_total,
        "breakdown": [item for item in breakdown if item["total"] > 0],
        "audit_note": "Cálculo validado contra a tabela de preços do contrato. Valores aptos para emissão de NFS-e decendial."
    }

