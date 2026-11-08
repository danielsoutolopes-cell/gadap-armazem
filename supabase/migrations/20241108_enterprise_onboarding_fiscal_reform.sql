-- ==============================================================================
-- MIGRATION: 20241108_enterprise_onboarding_fiscal_reform.sql
-- GADAP Armazém & WMS - Módulos 22, 23, 24 e 25
-- 1. Onboarding de Empresa & Representantes Legais
-- 2. Motor Fiscal (CFOP, NCM, Tax Rules com suporte à Reforma Tributária IBS, CBS, IS)
-- 3. Histórico de Alertas do Radar Tributário (IA Scraping)
-- ==============================================================================

-- 1. Expansão de companies e Representantes Legais (Prompt 22)
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS cnae VARCHAR(20),
  ADD COLUMN IF NOT EXISTS address_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS legal_nature VARCHAR(100);

CREATE TABLE IF NOT EXISTS public.legal_representatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Sócio Administrador',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_rep_tenant ON public.legal_representatives(tenant_id);

-- 2. Motor Fiscal Paramétrico e Catálogos (Prompt 24 e Prompt 25)
CREATE TABLE IF NOT EXISTS public.cfop_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    operation_type VARCHAR(20) NOT NULL, -- 'INBOUND', 'OUTBOUND'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ncm_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(12) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    aliquota_nacional NUMERIC(5,2) DEFAULT 0.00,
    aliquota_importado NUMERIC(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tax_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    rule_name VARCHAR(150) NOT NULL,
    cfop_code VARCHAR(10) REFERENCES public.cfop_catalog(code),
    operation_type VARCHAR(50) NOT NULL, -- 'ARMAZENAGEM', 'RETORNO_SIMBOLICO', 'SERVICO_LOGISTICO'
    cst_icms VARCHAR(10) DEFAULT '00',
    aliquota_icms NUMERIC(5,2) DEFAULT 0.00,
    cst_pis VARCHAR(10) DEFAULT '01',
    aliquota_pis NUMERIC(5,2) DEFAULT 1.65,
    cst_cofins VARCHAR(10) DEFAULT '01',
    aliquota_cofins NUMERIC(5,2) DEFAULT 7.60,
    aliquota_iss NUMERIC(5,2) DEFAULT 5.00,
    -- Campos OBRIGATÓRIOS da Nova Reforma Tributária Brasileira (IVA Dual) - Prompt 25
    aliquota_ibs NUMERIC(5,2) DEFAULT 0.00, -- Imposto sobre Bens e Serviços (Estados/Municípios)
    aliquota_cbs NUMERIC(5,2) DEFAULT 0.00, -- Contribuição sobre Bens e Serviços (Federal)
    aliquota_is NUMERIC(5,2) DEFAULT 0.00,  -- Imposto Seletivo ("Sin Tax")
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_rules_tenant ON public.tax_rules(tenant_id);

-- 3. Documentos Fiscais Emitidos (NF-e de Retorno / NFS-e de Serviços)
CREATE TABLE IF NOT EXISTS public.fiscal_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    invoice_type VARCHAR(20) NOT NULL, -- 'NFE_RETORNO', 'NFSE_SERVICO'
    environment VARCHAR(20) NOT NULL DEFAULT 'homologacao', -- 'homologacao', 'producao'
    invoice_number VARCHAR(50),
    series VARCHAR(10) DEFAULT '1',
    access_key VARCHAR(60),
    client_id UUID REFERENCES public.clients(id),
    contract_id UUID REFERENCES public.contracts(id),
    total_amount NUMERIC(15,2) NOT NULL,
    tax_amount NUMERIC(15,2) DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'AUTORIZADA', -- 'RASCUNHO', 'TRANSMITIDA', 'AUTORIZADA', 'REJEITADA', 'CANCELADA'
    xml_url TEXT,
    pdf_url TEXT,
    sefaz_protocol VARCHAR(100),
    sefaz_response JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fiscal_invoices_tenant ON public.fiscal_invoices(tenant_id);

-- 4. Radar Tributário da IA & Web Scraping (Prompt 25)
CREATE TABLE IF NOT EXISTS public.tax_radar_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    source_portal VARCHAR(150) NOT NULL, -- 'SEFAZ/SP', 'Receita Federal', 'Diário Oficial da União', 'Portal da Reforma Tributária'
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    impact_level VARCHAR(20) NOT NULL DEFAULT 'ALTO', -- 'BAIXO', 'MEDIO', 'ALTO', 'CRITICO'
    category VARCHAR(50) NOT NULL, -- 'REFORMA_TRIBUTARIA', 'ICMS_SUBSTITUICAO', 'ISS_ARMAZEM', 'CBS_IBS'
    affected_cfops TEXT[] DEFAULT '{}',
    suggested_changes JSONB DEFAULT '{}'::jsonb,
    is_applied BOOLEAN DEFAULT false,
    applied_at TIMESTAMPTZ,
    applied_by UUID REFERENCES public.users(id),
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_radar_tenant ON public.tax_radar_alerts(tenant_id);

-- 5. Seeds de CFOP, NCM e Regras Tributárias
INSERT INTO public.cfop_catalog (code, description, operation_type)
VALUES 
  ('5905', 'Remessa para depósito fechado ou armazém geral', 'INBOUND'),
  ('1905', 'Entrada de mercadoria recebida para depósito em depósito fechado ou armazém geral', 'INBOUND'),
  ('5906', 'Retorno de mercadoria depositada em depósito fechado ou armazém geral', 'OUTBOUND'),
  ('6906', 'Retorno de mercadoria depositada em depósito fechado interestadual', 'OUTBOUND'),
  ('5907', 'Retorno simbólico de mercadoria depositada em armazém geral', 'OUTBOUND'),
  ('6907', 'Retorno simbólico de mercadoria depositada interestadual', 'OUTBOUND'),
  ('5949', 'Outra saída de mercadoria ou prestação de serviço não especificado', 'OUTBOUND'),
  ('1949', 'Outra entrada de mercadoria ou prestação de serviço não especificado', 'INBOUND')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.ncm_catalog (code, description, aliquota_nacional, aliquota_importado)
VALUES 
  ('00000000', 'Serviço Puro de Armazenagem e Logística (NFS-e)', 0.00, 0.00),
  ('84181000', 'Combinados refrigeradores-congeladores', 12.00, 4.00),
  ('30049099', 'Outros medicamentos para medicina humana', 4.00, 4.00),
  ('85285220', 'Monitores de vídeo capazes de conexão direta a computadores', 12.00, 4.00),
  ('22042100', 'Vinhos de uvas frescas em recipientes de até 2 litros (Sujeito a IS)', 25.00, 25.00)
ON CONFLICT (code) DO NOTHING;

