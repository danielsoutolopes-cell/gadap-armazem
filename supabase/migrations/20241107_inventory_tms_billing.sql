-- ============================================================================
-- PROJETO: GADAP Armazém (WMS/ERP Backoffice)
-- ETAPAS 06 a 08: Inventário Cego (ABC), TMS Lite & Billing Fiscal (NFS-e/NF-e)
-- ============================================================================

-- 1. TABELA: INVENTORY_AUDITS (Ordens de Contagem Cega / Cycle Counting ABC)
CREATE TABLE IF NOT EXISTS public.inventory_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    audit_number VARCHAR(50) NOT NULL,
    abc_category VARCHAR(1) NOT NULL CHECK (abc_category IN ('A', 'B', 'C')),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    position_id UUID NOT NULL REFERENCES public.warehouse_positions(id) ON DELETE RESTRICT,
    expected_qty NUMERIC(14, 4) NOT NULL CHECK (expected_qty >= 0),
    blind_counted_qty NUMERIC(14, 4),
    difference_qty NUMERIC(14, 4) GENERATED ALWAYS AS (blind_counted_qty - expected_qty) STORED,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'COUNTED', 'DIVERGENT', 'APPROVED_FISCAL_ADJUSTMENT', 'REJECTED')),
    counter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    fiscal_approver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_audit_number UNIQUE (tenant_id, audit_number)
);

-- 2. TABELA: TMS_SHIPMENTS (TMS Lite: Despachos, Etiquetas e Rastreabilidade)
CREATE TABLE IF NOT EXISTS public.tms_shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    order_id UUID NOT NULL REFERENCES public.outbound_orders(id) ON DELETE RESTRICT,
    carrier_name VARCHAR(150) NOT NULL,
    tracking_code VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(20),
    service_level VARCHAR(50) NOT NULL DEFAULT 'STANDARD', -- EXPRESS, STANDARD, FRACIONADO, LOTACAO
    current_status VARCHAR(50) NOT NULL DEFAULT 'DISPATCHED'
        CHECK (current_status IN ('DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'INCIDENT')),
    origin_city VARCHAR(100) NOT NULL DEFAULT 'Armazém Geral Santos',
    destination_city VARCHAR(100) NOT NULL,
    zpl_label_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_tracking_code UNIQUE (tenant_id, tracking_code)
);

-- 3. TABELA: FISCAL_CLOSURES (Billing Final, Emissão de NFS-e e NF-e de Retorno Simbólico)
CREATE TABLE IF NOT EXISTS public.fiscal_closures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    period_year_month VARCHAR(7) NOT NULL, -- Ex: '2026-11'
    total_storage_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_handling_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_extras_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    nfse_service_number VARCHAR(100),
    nfse_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (nfse_status IN ('PENDING', 'EMITTED', 'CANCELLED')),
    nfe_symbolic_return_number VARCHAR(100), -- CFOP 5.906 / 6.906 Retorno Simbólico de Armazém Geral
    nfe_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (nfe_status IN ('PENDING', 'EMITTED', 'CANCELLED')),
    payment_gateway_id VARCHAR(100),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'OVERDUE')),
    closed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_client_closure_period UNIQUE (tenant_id, client_id, period_year_month)
);

-- RLS
ALTER TABLE public.inventory_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_audits FORCE ROW LEVEL SECURITY;

ALTER TABLE public.tms_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tms_shipments FORCE ROW LEVEL SECURITY;

ALTER TABLE public.fiscal_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_closures FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inventory_audits_isolation ON public.inventory_audits;
CREATE POLICY inventory_audits_isolation ON public.inventory_audits AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

DROP POLICY IF EXISTS tms_shipments_isolation ON public.tms_shipments;
CREATE POLICY tms_shipments_isolation ON public.tms_shipments AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

DROP POLICY IF EXISTS fiscal_closures_isolation ON public.fiscal_closures;
CREATE POLICY fiscal_closures_isolation ON public.fiscal_closures AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

