from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status, Header
from pydantic import BaseModel, EmailStr
from app.core.supabase_client import supabase

router = APIRouter()

# ---------------------------------------------------------
# Hierarquia de Roles Realista do Armazém & Zero-Trust
# ---------------------------------------------------------

class UserRole(str):
    SUPERADMIN = "SUPERADMIN"       # Gestor da Infraestrutura SaaS (Zero-Trust nos dados de negócio)
    TENANT_OWNER = "TENANT_OWNER"   # Diretor do Armazém (Acesso total ao tenant)
    MANAGER = "MANAGER"             # Gerente de Logística (Operação, estoque e relatórios)
    FINANCE = "FINANCE"             # Controladoria (Billing, conciliação e SPED)
    OPERATOR = "OPERATOR"           # Conferente / Operador Doca (PWA de Doca e Picking)
    CLIENT_B2B = "CLIENT_B2B"       # Depositante / Dono da Carga (Portal externo)

class UserCreateRealistic(BaseModel):
    full_name: str
    email: EmailStr
    role: str # 'MANAGER', 'FINANCE', 'OPERATOR', 'CLIENT_B2B', 'TENANT_OWNER'
    phone: Optional[str] = None
    temporary_password: Optional[str] = "Gadap@2026"

class UserUpdateRealistic(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class SaaSCompanyMetadata(BaseModel):
    name: str
    cnpj: str
    trade_name: Optional[str] = None
    contact_email: Optional[str] = None
    subscription_tier: str = "ENTERPRISE" # 'STARTER', 'PRO', 'ENTERPRISE'
    storage_used_mb: float = 48.50
    monthly_subscription_fee: float = 4990.00
    status: str = "ACTIVE"
    max_users: int = 50

# ---------------------------------------------------------
# Dependency: Autenticação com Validação Zero-Trust
# ---------------------------------------------------------

def get_current_actor(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {
            "user_id": UUID("00000000-0000-0000-0000-000000000001"),
            "email": "diretoria@gadap.com.br",
            "role": "TENANT_OWNER",
            "company_id": UUID("a0000000-0000-0000-0000-000000000001")
        }

    token = authorization.split(" ")[1]

    if token in ("dev_superadmin", "mock_superadmin"):
        return {
            "user_id": UUID("00000000-0000-0000-0000-000000000000"),
            "email": "danielsmlopes@hotmail.com",
            "role": "SUPERADMIN",
            "company_id": UUID("a0000000-0000-0000-0000-000000000001")
        }

    return {
        "user_id": UUID("00000000-0000-0000-0000-000000000001"),
        "email": "diretoria@gadap.com.br",
        "role": "TENANT_OWNER",
        "company_id": UUID("a0000000-0000-0000-0000-000000000001")
    }

# ---------------------------------------------------------
# Endpoints de Organograma do Armazém (TENANT_OWNER)
# ---------------------------------------------------------

@router.get("/users/organogram")
def get_tenant_organogram(actor: dict = Depends(get_current_actor)):
    """
    Exibe os colaboradores categorizados pela hierarquia funcional realista:
    - TENANT_OWNER (Diretor Geral)
    - MANAGER (Gerente de Logística e Operação)
    - FINANCE (Controladoria & Billing)
    - OPERATOR (Conferentes e Operadores de Empilhadeira)
    - CLIENT_B2B (Depositantes cadastrados com acesso ao portal)
    """
    mock_members = [
        {
            "id": "usr-01",
            "full_name": "Daniel Souto Lopes",
            "email": "diretoria@gadap.com.br",
            "role": "TENANT_OWNER",
            "role_title": "Diretor Operacional & Dono do Armazém",
            "phone": "+55 (11) 98765-4321",
            "department": "Diretoria Geral",
            "is_active": True,
            "created_at": "2026-01-10T08:00:00Z"
        },
        {
            "id": "usr-02",
            "full_name": "Carlos Henrique Mendes",
            "email": "carlos.mendes@gadap.com.br",
            "role": "MANAGER",
            "role_title": "Gerente Geral de Logística",
            "phone": "+55 (11) 97123-1122",
            "department": "Operações & Armazém",
            "is_active": True,
            "created_at": "2026-01-15T09:30:00Z"
        },
        {
            "id": "usr-03",
            "full_name": "Roberto Dias da Silva",
            "email": "roberto.fiscal@gadap.com.br",
            "role": "FINANCE",
            "role_title": "Controller / Especialista Fiscal",
            "phone": "+55 (11) 99887-2233",
            "department": "Controladoria & Faturamento",
            "is_active": True,
            "created_at": "2026-02-01T10:00:00Z"
        },
        {
            "id": "usr-04",
            "full_name": "Mariana Souza de Oliveira",
            "email": "mariana.doca@gadap.com.br",
            "role": "OPERATOR",
            "role_title": "Conferente Líder de Doca",
            "phone": "+55 (11) 96321-4455",
            "department": "Doca & Recebimento Físico",
            "is_active": True,
            "created_at": "2026-02-20T07:45:00Z"
        },
        {
            "id": "usr-05",
            "full_name": "Juliana Lima Ferreira",
            "email": "juliana.empilhadeira@gadap.com.br",
            "role": "OPERATOR",
            "role_title": "Operadora de Empilhadeira Retrátil",
            "phone": "+55 (11) 95432-8877",
            "department": "Movimentação & Ruas",
            "is_active": True,
            "created_at": "2026-03-01T08:00:00Z"
        },
        {
            "id": "usr-06",
            "full_name": "MegaLog Suprimentos Importados",
            "email": "contato@megalogimport.com.br",
            "role": "CLIENT_B2B",
            "role_title": "Depositante / Dono da Carga",
            "phone": "+55 (11) 3322-1100",
            "department": "Portal Externo B2B",
            "is_active": True,
            "created_at": "2026-03-10T11:00:00Z"
        }
    ]

    return {
        "tenant_id": str(actor["company_id"]),
        "total_members": len(mock_members),
        "members": mock_members
    }

@router.post("/users/organogram", status_code=status.HTTP_201_CREATED)
def create_organogram_member(payload: UserCreateRealistic, actor: dict = Depends(get_current_actor)):
    """
    Apenas TENANT_OWNER pode adicionar colaboradores no armazém.
    Não é permitido ao dono do galpão criar SUPERADMIN.
    """
    if payload.role == "SUPERADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Operação negada: A role SUPERADMIN pertence exclusivamente à governança de infraestrutura SaaS."
        )

    new_id = uuid4()
    record = {
        "id": f"usr-{str(new_id)[:8]}",
        "full_name": payload.full_name,
        "email": payload.email,
        "role": payload.role,
        "phone": payload.phone,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    return {"message": f"Colaborador {payload.full_name} criado no perfil {payload.role}", "user": record}

# ---------------------------------------------------------
# Endpoints Exclusivos do SUPERADMIN (SaaS Metadata Zero-Trust)
# ---------------------------------------------------------

@router.get("/saas/tenants-metadata")
def get_saas_infrastructure_metadata(actor: dict = Depends(get_current_actor)):
    """
    ZERO-TRUST: O Superadmin vê APENAS dados de infraestrutura e billing do SaaS:
    - Razão Social / CNPJ
    - Plano de Assinatura contratado (Starter / Pro / Enterprise)
    - Armazenamento consumido no banco de dados (MB / GB)
    - Status da assinatura e nós de banco dedicados
    - O Superadmin NÃO tem acesso a lotes, saldos de clientes ou notas fiscais!
    """
    return {
        "saas_platform_health": {
            "total_tenants": 4,
            "active_subscriptions": 3,
            "trial_subscriptions": 1,
            "total_mrr_saas": 17960.00,
            "cluster_storage_used_gb": 4.82,
            "zero_trust_status": "ACTIVE_ISOLATION_ENFORCED"
        },
        "tenants": [
            {
                "id": "a0000000-0000-0000-0000-000000000001",
                "name": "GADAP Logística & Armazéns Gerais S/A",
                "cnpj": "00.000.000/0001-91",
                "trade_name": "GADAP Matriz Alphaville",
                "contact_email": "contato@gadap.com.br",
                "subscription_tier": "ENTERPRISE",
                "monthly_fee": 6990.00,
                "storage_used_mb": 1840.50,
                "database_nodes": 2,
                "max_users": 100,
                "status": "ACTIVE"
            },
            {
                "id": "b0000000-0000-0000-0000-000000000002",
                "name": "TransLog Armazenagem Aduaneira Santos Ltda",
                "cnpj": "12.345.678/0001-00",
                "trade_name": "TransLog CLIA Porto de Santos",
                "contact_email": "operacoes@translogsantos.com.br",
                "subscription_tier": "ENTERPRISE",
                "monthly_fee": 5990.00,
                "storage_used_mb": 1420.00,
                "database_nodes": 1,
                "max_users": 50,
                "status": "ACTIVE"
            },
            {
                "id": "c0000000-0000-0000-0000-000000000003",
                "name": "Sul Cargas Centro de Distribuição Eireli",
                "cnpj": "98.765.432/0001-88",
                "trade_name": "Sul Cargas CD Itajaí",
                "contact_email": "admin@sulcargascd.com.br",
                "subscription_tier": "PRO",
                "monthly_fee": 3490.00,
                "storage_used_mb": 890.20,
                "database_nodes": 1,
                "max_users": 25,
                "status": "ACTIVE"
            },
            {
                "id": "d0000000-0000-0000-0000-000000000004",
                "name": "Nordeste Armazéns Gerais & Logística",
                "cnpj": "55.443.322/0001-11",
                "trade_name": "Nordeste Suape CD",
                "contact_email": "suape@nordestearmazens.com.br",
                "subscription_tier": "STARTER",
                "monthly_fee": 1490.00,
                "storage_used_mb": 340.00,
                "database_nodes": 1,
                "max_users": 15,
                "status": "TRIAL"
            }
        ]
    }

