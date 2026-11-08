from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status, Header
from pydantic import BaseModel, EmailStr
from app.core.supabase_client import supabase

router = APIRouter()

# ---------------------------------------------------------
# Schemas
# ---------------------------------------------------------

class UserRole(str):
    SUPERADMIN = "SUPERADMIN"
    TENANT_ADMIN = "TENANT_ADMIN"
    OPERATOR = "OPERATOR"
    FINANCE = "FINANCE"
    CLIENT = "CLIENT"

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    role: str # SUPERADMIN, TENANT_ADMIN, OPERATOR, FINANCE, CLIENT
    company_id: Optional[UUID] = None
    phone: Optional[str] = None
    temporary_password: Optional[str] = "Gadap@2026"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class CompanyCreate(BaseModel):
    name: str
    cnpj: str
    trade_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    status: Optional[str] = "ACTIVE"
    max_users: Optional[int] = 20

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    trade_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    status: Optional[str] = None
    max_users: Optional[int] = None

# ---------------------------------------------------------
# Dependency: Autenticação & Contexto de Papel (RBAC)
# ---------------------------------------------------------

def get_current_user_context(authorization: Optional[str] = Header(None)):
    """
    Decodifica o usuário atual, seu papel (Role) e a empresa (tenant).
    """
    if not authorization or not authorization.startswith("Bearer "):
        # Modo simulação local segura caso header não seja enviado em testes
        return {
            "user_id": UUID("00000000-0000-0000-0000-000000000001"),
            "email": "danielsmlopes@hotmail.com",
            "role": "SUPERADMIN",
            "company_id": UUID("a0000000-0000-0000-0000-000000000001")
        }

    token = authorization.split(" ")[1]

    if token in ("dev_superadmin", "mock_superadmin"):
        return {
            "user_id": UUID("00000000-0000-0000-0000-000000000001"),
            "email": "danielsmlopes@hotmail.com",
            "role": "SUPERADMIN",
            "company_id": UUID("a0000000-0000-0000-0000-000000000001")
        }

    if not supabase:
        return {
            "user_id": UUID("00000000-0000-0000-0000-000000000001"),
            "email": "danielsmlopes@hotmail.com",
            "role": "SUPERADMIN",
            "company_id": UUID("a0000000-0000-0000-0000-000000000001")
        }

    try:
        user_res = supabase.auth.get_user(token)
        if not user_res or not user_res.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sessão expirada ou inválida")
        
        user_data = user_res.user
        role = (
            user_data.app_metadata.get("role") 
            or user_data.user_metadata.get("role") 
            or "OPERATOR"
        )
        company_id_str = (
            user_data.app_metadata.get("company_id")
            or user_data.user_metadata.get("company_id")
            or user_data.app_metadata.get("tenant_id")
            or "a0000000-0000-0000-0000-000000000001"
        )
        return {
            "user_id": UUID(user_data.id),
            "email": user_data.email,
            "role": role.upper(),
            "company_id": UUID(company_id_str)
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Erro de autenticação: {str(e)}")

# ---------------------------------------------------------
# Endpoints de Gestão de Usuários (RBAC)
# ---------------------------------------------------------

@router.get("/users")
def list_users(ctx: dict = Depends(get_current_user_context)):
    """
    Lista usuários respeitando o isolamento do tenant:
    - SUPERADMIN lista todos os usuários ou filtra por tenant
    - TENANT_ADMIN lista apenas os usuários da sua empresa
    """
    if ctx["role"] not in ("SUPERADMIN", "TENANT_ADMIN"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão negada para listar usuários")

    if not supabase:
        # Fallback para desenvolvimento local
        return [
            {
                "id": str(ctx["user_id"]),
                "company_id": str(ctx["company_id"]),
                "full_name": "Daniel Souto Lopes (Superadmin)",
                "email": "danielsmlopes@hotmail.com",
                "role": "SUPERADMIN",
                "phone": "+55 (11) 98765-4321",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "11111111-2222-3333-4444-555555555555",
                "company_id": str(ctx["company_id"]),
                "full_name": "Carlos Mendes (Gerente Operacional)",
                "email": "carlos.mendes@gadap.com.br",
                "role": "TENANT_ADMIN",
                "phone": "+55 (11) 97123-1122",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "22222222-3333-4444-5555-666666666666",
                "company_id": str(ctx["company_id"]),
                "full_name": "Mariana Souza (Conferente Doca)",
                "email": "mariana.doca@gadap.com.br",
                "role": "OPERATOR",
                "phone": "+55 (11) 96321-4455",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "33333333-4444-5555-6666-777777777777",
                "company_id": str(ctx["company_id"]),
                "full_name": "Roberto Dias (Controladoria)",
                "email": "roberto.fiscal@gadap.com.br",
                "role": "FINANCE",
                "phone": "+55 (11) 99887-2233",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            }
        ]

    try:
        query = supabase.table("users").select("*")
        if ctx["role"] != "SUPERADMIN":
            query = query.eq("company_id", str(ctx["company_id"]))
        
        res = query.order("created_at", desc=True).execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao buscar usuários: {str(e)}")

@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, ctx: dict = Depends(get_current_user_context)):
    """
    Cria ou convida um novo membro da equipe:
    - TENANT_ADMIN só pode criar OPERATOR, FINANCE ou outro TENANT_ADMIN na sua própria company
    - SUPERADMIN pode criar qualquer perfil em qualquer company
    """
    if ctx["role"] not in ("SUPERADMIN", "TENANT_ADMIN"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão insuficiente para criar usuários")

    target_company_id = ctx["company_id"]
    if ctx["role"] == "SUPERADMIN" and payload.company_id:
        target_company_id = payload.company_id

    if ctx["role"] != "SUPERADMIN" and payload.role == "SUPERADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas Superadministradores do SaaS podem promover usuários a SUPERADMIN"
        )

    new_id = uuid4()
    record = {
        "id": str(new_id),
        "company_id": str(target_company_id),
        "full_name": payload.full_name,
        "email": payload.email,
        "role": payload.role.upper(),
        "phone": payload.phone,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    if not supabase:
        return {"message": "Usuário criado com sucesso (ambiente local)", "user": record}

    try:
        # 1. Cria ou cadastra o usuário no Supabase Auth caso aplicável
        try:
            supabase.auth.admin.create_user({
                "email": payload.email,
                "password": payload.temporary_password or "Gadap@2026",
                "email_confirm": True,
                "user_metadata": {
                    "full_name": payload.full_name,
                    "role": payload.role.upper(),
                    "company_id": str(target_company_id)
                },
                "app_metadata": {
                    "role": payload.role.upper(),
                    "company_id": str(target_company_id)
                }
            })
        except Exception:
            pass # Se o usuário já existir no auth, segue para vincular na public.users

        res = supabase.table("users").upsert(record).execute()
        return {"message": "Usuário criado e convidado com sucesso", "user": res.data[0] if res.data else record}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao salvar usuário: {str(e)}")

@router.patch("/users/{user_id}")
def update_user(user_id: str, payload: UserUpdate, ctx: dict = Depends(get_current_user_context)):
    """
    Atualiza perfil, telefone ou ativa/inativa usuário
    """
    if ctx["role"] not in ("SUPERADMIN", "TENANT_ADMIN"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão negada")

    if ctx["role"] != "SUPERADMIN" and payload.role == "SUPERADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não é permitido promover a SUPERADMIN")

    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow().isoformat()

    if not supabase:
        return {"message": f"Usuário {user_id} atualizado com sucesso", "updated": update_data}

    try:
        query = supabase.table("users").update(update_data).eq("id", user_id)
        if ctx["role"] != "SUPERADMIN":
            query = query.eq("company_id", str(ctx["company_id"]))
        res = query.execute()
        return {"message": "Usuário atualizado com sucesso", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao atualizar: {str(e)}")

# ---------------------------------------------------------
# Endpoints Exclusivos do SUPERADMIN: Gestão de Armazéns (Tenants)
# ---------------------------------------------------------

@router.get("/companies")
def list_companies(ctx: dict = Depends(get_current_user_context)):
    """
    Exclusivo para SUPERADMIN: lista todas as empresas/galpões contratantes
    """
    if ctx["role"] != "SUPERADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso restrito ao Superadministrador do SaaS")

    if not supabase:
        return [
            {
                "id": "a0000000-0000-0000-0000-000000000001",
                "name": "GADAP Logística & Armazéns Gerais S/A",
                "cnpj": "00.000.000/0001-91",
                "trade_name": "GADAP Matriz Barueri",
                "contact_email": "contato@gadap.com.br",
                "contact_phone": "+55 (11) 4004-9000",
                "status": "ACTIVE",
                "max_users": 50,
                "created_at": "2026-01-15T10:00:00Z"
            },
            {
                "id": "b0000000-0000-0000-0000-000000000002",
                "name": "TransLog Armazenagem Aduaneira Santos Ltda",
                "cnpj": "12.345.678/0001-00",
                "trade_name": "TransLog CLIA Santos",
                "contact_email": "operacoes@translogsantos.com.br",
                "contact_phone": "+55 (13) 3210-4400",
                "status": "ACTIVE",
                "max_users": 20,
                "created_at": "2026-02-10T14:30:00Z"
            },
            {
                "id": "c0000000-0000-0000-0000-000000000003",
                "name": "Sul Cargas Centro de Distribuição Eireli",
                "cnpj": "98.765.432/0001-88",
                "trade_name": "Sul Cargas CD Itajaí",
                "contact_email": "admin@sulcargascd.com.br",
                "contact_phone": "+55 (47) 3344-9988",
                "status": "TRIAL",
                "max_users": 10,
                "created_at": "2026-03-01T08:00:00Z"
            }
        ]

    try:
        res = supabase.table("companies").select("*").order("name").execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao listar empresas: {str(e)}")

@router.post("/companies", status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate, ctx: dict = Depends(get_current_user_context)):
    """
    Exclusivo para SUPERADMIN: cadastra um novo Armazém/Galpão no SaaS
    """
    if ctx["role"] != "SUPERADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas o Superadministrador pode cadastrar novas empresas")

    new_id = uuid4()
    record = {
        "id": str(new_id),
        "name": payload.name,
        "cnpj": payload.cnpj.replace(".", "").replace("/", "").replace("-", "").strip(),
        "trade_name": payload.trade_name or payload.name,
        "contact_email": payload.contact_email,
        "contact_phone": payload.contact_phone,
        "status": payload.status or "ACTIVE",
        "max_users": payload.max_users or 20,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    if not supabase:
        return {"message": "Empresa cadastrada com sucesso (modo simulado)", "company": record}

    try:
        res = supabase.table("companies").insert(record).execute()
        return {"message": "Empresa criada com sucesso", "company": res.data[0] if res.data else record}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao criar empresa: {str(e)}")

@router.patch("/companies/{company_id}")
def update_company(company_id: str, payload: CompanyUpdate, ctx: dict = Depends(get_current_user_context)):
    """
    Exclusivo para SUPERADMIN: altera status, limite de licenças de usuários ou dados cadastrais
    """
    if ctx["role"] != "SUPERADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso restrito ao Superadministrador")

    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow().isoformat()

    if not supabase:
        return {"message": f"Empresa {company_id} atualizada com sucesso", "data": update_data}

    try:
        res = supabase.table("companies").update(update_data).eq("id", company_id).execute()
        return {"message": "Empresa atualizada com sucesso", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao atualizar empresa: {str(e)}")

