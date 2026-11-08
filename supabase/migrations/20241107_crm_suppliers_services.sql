-- ============================================================================
-- PROJETO: GADAP Armazém (WMS/CRM)
-- MÓDULO: Cadastros Base (Fornecedores & Catálogo de Serviços)
-- ============================================================================

-- 1. TABELA: SUPPLIERS (Transportadoras e Fornecedores de Insumos)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    corporate_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    document VARCHAR(20) NOT NULL, -- CNPJ ou CPF
    supplier_type VARCHAR(50) NOT NULL DEFAULT 'CARRIER' 
        CHECK (supplier_type IN ('CARRIER', 'PACKAGING', 'MAINTENANCE', 'EQUIPMENT', 'OTHER')),
    email VARCHAR(150),
    phone VARCHAR(30),
    contact_person VARCHAR(150),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_suppliers_tenant_document UNIQUE (tenant_id, document)
);

-- 2. TABELA: SERVICES_CATALOG (Tabela de Preços e Serviços Logísticos)
CREATE TABLE IF NOT EXISTS public.services_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    service_code VARCHAR(50) NOT NULL, -- Ex: "SRV-ARMAZ-DEC", "SRV-PALET-PBR"
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'STORAGE'
        CHECK (category IN ('STORAGE', 'HANDLING', 'PACKAGING', 'LABELING', 'CUSTOMS_EXTRA')),
    unit_of_measure VARCHAR(20) NOT NULL DEFAULT 'DIARIA_PALETE', -- DIARIA_PALETE, DECENDIO_CIF, UNIDADE, TONELADA, HORA
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (base_price >= 0),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_services_tenant_code UNIQUE (tenant_id, service_code)
);

-- RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers FORCE ROW LEVEL SECURITY;

ALTER TABLE public.services_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_catalog FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS suppliers_isolation ON public.suppliers;
CREATE POLICY suppliers_isolation ON public.suppliers AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

DROP POLICY IF EXISTS services_catalog_isolation ON public.services_catalog;
CREATE POLICY services_catalog_isolation ON public.services_catalog AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

