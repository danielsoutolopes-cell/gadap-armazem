"""
GADAP WMS - LGPD Engine (Lei Geral de Proteção de Dados - Lei 13.709/2018)
Módulo centralizado de Privacidade, Mascaramento Dinâmico, DPO, Consentimento e Auditoria Forense.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# ==============================================================================
# 1. FUNÇÕES DE MASCARAMENTO DINÂMICO DE DADOS PESSOAIS (PII / PSEUDONIMIZAÇÃO)
# Art. 13 e 16 da LGPD
# ==============================================================================

def mask_cpf(cpf: Optional[str]) -> str:
    """Mascara CPF preservando apenas dígitos iniciais e finais: 123.***.***-45"""
    if not cpf:
        return ""
    clean = re.sub(r"\D", "", str(cpf))
    if len(clean) == 11:
        return f"{clean[:3]}.***.***-{clean[-2:]}"
    return "***.***.***-**"

def mask_email(email: Optional[str]) -> str:
    """Mascara e-mail preservando as 2 primeiras letras do nome e o domínio: jo***@empresa.com"""
    if not email or "@" not in email:
        return "***@***.***"
    parts = email.split("@")
    user = parts[0]
    domain = parts[1]
    masked_user = user[:2] + "***" if len(user) > 2 else user[0] + "***"
    return f"{masked_user}@{domain}"

def mask_phone(phone: Optional[str]) -> str:
    """Mascara telefone preservando DDD e últimos dígitos: (11) 9****-1234"""
    if not phone:
        return ""
    clean = re.sub(r"\D", "", str(phone))
    if len(clean) >= 10:
        ddd = clean[:2]
        tail = clean[-4:]
        return f"({ddd}) 9****-{tail}"
    return "(**) *****-****"

def mask_financial_value(val: float, role: str) -> Any:
    """Oculta valores salariais e bancários caso a role não seja autorizada"""
    if role in ["SUPERADMIN", "TENANT_OWNER", "FINANCE"]:
        return val
    return "[CONFIDENCIAL LGPD]"

def generate_anonymized_hash(value: str, salt: str = "GADAP_LGPD_SALT_2026") -> str:
    """Gera hash criptográfico irreversível para anonimização irrevogável (Art. 12 LGPD)"""
    return hashlib.sha256(f"{value}:{salt}".encode("utf-8")).hexdigest()

# ==============================================================================
# 2. MODELOS PYDANTIC E ESQUEMAS LGPD
# ==============================================================================

class ConsentRecord(BaseModel):
    tenant_id: str
    user_id: str
    purpose: str = Field(..., description="Finalidade explícita conforme Art. 7, I e V da LGPD")
    legal_basis: str = Field(..., description="Consentimento, Execução de Contrato ou Obrigação Legal")
    accepted: bool = True
    accepted_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    ip_address: Optional[str] = "127.0.0.1"
    user_agent: Optional[str] = "GADAP-WMS/Enterprise"
    version_term: str = "v2.0-2026"

class DataSubjectAccessRequest(BaseModel):
    """Art. 18 LGPD - Direitos do Titular (DSAR - Data Subject Access Request)"""
    request_type: str = Field(..., description="ACCESS, PORTABILITY, RECTIFICATION, ANONYMIZATION, DELETION, REVOCATION")
    titular_cpf: str
    titular_name: str
    titular_email: str
    justification: Optional[str] = "Exercício de direito de titular conforme Art. 18 Lei 13.709/2018"

class PrivacyIncidentNotification(BaseModel):
    """Art. 48 LGPD - Notificação à ANPD e aos Titulares de Incidente de Segurança"""
    severity: str = Field(..., description="BAIXA, MEDIA, ALTA, CRITICA")
    affected_category: str = Field(..., description="DADOS_CADASTRAIS, FINANCEIROS, LOGISTICOS, RH")
    description: str
    immediate_actions_taken: str
    dpo_responsible: str = "DPO Encarregado - dpo@gadap.com.br"
    notified_anpd: bool = False

# ==============================================================================
# 3. BASE DE CONHECIMENTO DE BASES LEGAIS E RETENÇÃO FISCAL / TRABALHISTA
# ==============================================================================

LGPD_LEGAL_BASES = {
    "NF_EMISSAO": {
        "artigo": "Art. 7º, II (Cumprimento de Obrigação Legal)",
        "retencao_anos": 5,
        "justificativa": "Guarda obrigatória de Documentos Fiscais Eletrônicos (CTN Art. 173 e Ajuste SINIEF 07/05). Anonimização antes de 5 anos vedada pela Receita Federal."
    },
    "FOLHA_PAGAMENTO": {
        "artigo": "Art. 7º, II e V (Obrigação Legal e Execução de Contrato de Trabalho)",
        "retencao_anos": 30,
        "justificativa": "Registros trabalhistas e FGTS conforme Lei 8.036/1990 e CLT Art. 11."
    },
    "MOTORISTA_EXPEDICAO": {
        "artigo": "Art. 7º, V e IX (Execução de Contrato de Transporte e Legítimo Interesse para Segurança Patrimonial)",
        "retencao_anos": 5,
        "justificativa": "Segurança da carga, auditoria de sinistros de seguro e comprovação de entrega perante embarcador."
    },
    "TELEMETRIA_SISTEMA": {
        "artigo": "Art. 7º, IX (Legítimo Interesse) e Marco Civil da Internet (Lei 12.965/14 Art. 15)",
        "retencao_anos": 1,
        "justificativa": "Guarda de logs de acesso a aplicações pelo prazo legal de 6 meses a 1 ano para rastreabilidade de incidentes."
    }
}

