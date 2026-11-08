import hashlib
from datetime import datetime
from uuid import UUID
from typing import Dict, Any

# Cadastro corporativo padrão de identificação de tenants para carimbo de auditoria LGPD
TENANT_DIRECTORY: Dict[str, Dict[str, str]] = {
    "10000000-0000-0000-0000-000000000001": {"name": "Santos Port Logistics S.A.", "cnpj": "11.222.333/0001-01"},
    "10000000-0000-0000-0000-000000000002": {"name": "Paranaguá Cold Storage LTDA", "cnpj": "22.333.444/0001-02"},
    "10000000-0000-0000-0000-000000000003": {"name": "Itajaí Bonded Terminal S.A.", "cnpj": "33.444.555/0001-03"},
    "10000000-0000-0000-0000-000000000004": {"name": "Campinas Cargo Hub Armazéns", "cnpj": "44.555.666/0001-04"},
    "10000000-0000-0000-0000-000000000005": {"name": "Manaus Free Zone Logistics", "cnpj": "55.666.777/0001-05"},
    "10000000-0000-0000-0000-000000000006": {"name": "Rio Grande Bulk Terminal", "cnpj": "66.777.888/0001-06"},
    "10000000-0000-0000-0000-000000000007": {"name": "Suape Operações Portuárias", "cnpj": "77.888.999/0001-07"},
    "10000000-0000-0000-0000-000000000008": {"name": "Vitória VitóriaLog Armazéns", "cnpj": "88.999.000/0001-08"},
    "10000000-0000-0000-0000-000000000009": {"name": "Goiás AgroLog Distribuição", "cnpj": "99.000.111/0001-09"},
    "10000000-0000-0000-0000-000000000010": {"name": "Belo Horizonte MinasLog S.A.", "cnpj": "10.111.222/0001-10"},
}

def generate_watermark_metadata(tenant_id: UUID, report_name: str) -> Dict[str, str]:
    """
    Gera marca d'água digital e hash criptográfico SHA-256 com base no tenant autenticado,
    timestamp e nome do documento, garantindo rastreabilidade contra vazamentos físicos ou digitais (LGPD).
    """
    t_key = str(tenant_id)
    tenant_info = TENANT_DIRECTORY.get(t_key, {
        "name": "GADAP Armazéns Gerais & Logística S.A.",
        "cnpj": "11.222.333/0001-44"
    })
    
    timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    raw_payload = f"TENANT:{tenant_info['cnpj']}|NAME:{tenant_info['name']}|DOC:{report_name}|TS:{timestamp_str}|SALT:GADAP_LGPD_SECURITY"
    sha256_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest().upper()
    
    return {
        "tenant_name": tenant_info["name"],
        "tenant_cnpj": tenant_info["cnpj"],
        "timestamp": timestamp_str,
        "sha256_hash": sha256_hash,
        "watermark_text": f"DOCUMENTO AUDITADO (LGPD) | EMPRESA: {tenant_info['name']} (CNPJ: {tenant_info['cnpj']}) | HASH SHA-256: {sha256_hash[:16]}...{sha256_hash[-8:]} | EMISSÃO: {timestamp_str}"
    }
