-- ==============================================================================
-- MIGRATION: PROMPTS 18, 19, 20 & 21 (QMS, CMMS, CONCILIAÇÃO/SPED & CRM B2B)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROMPT 18: QMS & CONTROLE REGULATÓRIO ANVISA/MAPA (FEFO/FIFO)
-- ------------------------------------------------------------------------------
ALTER TABLE public.inbound_lots
ADD COLUMN IF NOT EXISTS batch_number TEXT,
ADD COLUMN IF NOT EXISTS manufacturing_date DATE,
ADD COLUMN IF NOT EXISTS expiration_date DATE,
ADD COLUMN IF NOT EXISTS temperature_zone TEXT DEFAULT 'AMBIENT', -- 'AMBIENT', 'CLIMATIZED_15_25', 'REFRIGERATED_2_8', 'FROZEN_NEG_20'
ADD COLUMN IF NOT EXISTS quality_status TEXT DEFAULT 'APPROVED'; -- 'APPROVED', 'QUARANTINE_EXPIRED', 'REJECTED', 'INSPECTION'

-- Função para o CRON diário bloquear lotes vencidos
CREATE OR REPLACE FUNCTION public.cron_quarantine_expired_lots()
RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    UPDATE public.inbound_lots
    SET quality_status = 'QUARANTINE_EXPIRED',
        status = 'QUARANTINE'
    WHERE expiration_date < CURRENT_DATE
      AND quality_status != 'QUARANTINE_EXPIRED';
      
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. PROMPT 19: CMMS - GESTÃO DE ATIVOS E MANUTENÇÃO (GATILHO POR HORÍMETRO)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    asset_code TEXT NOT NULL, -- 'EMP-01', 'DOCA-03', 'PORTA-PALETE-A'
    name TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- 'FORKLIFT', 'DOCK_LEVELER', 'RACK_STRUCTURE', 'STRETCH_MACHINE'
    status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'IN_MAINTENANCE', 'BROKEN'
    current_hourmeter NUMERIC(10, 2) DEFAULT 0.0, -- Horímetro atual em horas
    hourmeter_limit_preventive NUMERIC(10, 2) DEFAULT 250.0, -- Gatilho a cada 250 horas
    last_preventive_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, asset_code)
);

CREATE TABLE IF NOT EXISTS public.maintenance_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    order_type TEXT NOT NULL DEFAULT 'CORRECTIVE', -- 'PREVENTIVE', 'CORRECTIVE'
    priority TEXT NOT NULL DEFAULT 'HIGH', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    reported_by TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'
    cost NUMERIC(12, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 3. PROMPT 20: CONCILIAÇÃO BANCÁRIA OFX E SPED
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bank_statements_ofx (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    fit_id TEXT NOT NULL, -- ID único do lançamento no banco
    transaction_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_type TEXT NOT NULL, -- 'CREDIT', 'DEBIT'
    memo TEXT,
    reconciled_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'MATCHED', 'IGNORED'
    matched_receivable_id UUID REFERENCES public.accounts_receivable(id),
    matched_payable_id UUID REFERENCES public.accounts_payable(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, fit_id)
);

-- ------------------------------------------------------------------------------
-- 4. PROMPT 21: CRM B2B E FUNIL DE VENDAS DO ARMAZÉM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lead_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    stage TEXT NOT NULL DEFAULT 'PROSPECTION', -- 'PROSPECTION', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'
    estimated_pallets INT DEFAULT 100,
    estimated_months INT DEFAULT 3,
    expected_mrr NUMERIC(12, 2) DEFAULT 0.0,
    ai_proposal_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statements_ofx ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant assets isolation" ON public.assets;
CREATE POLICY "Tenant assets isolation" ON public.assets FOR ALL
USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

DROP POLICY IF EXISTS "Tenant maintenance isolation" ON public.maintenance_orders;
CREATE POLICY "Tenant maintenance isolation" ON public.maintenance_orders FOR ALL
USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

DROP POLICY IF EXISTS "Tenant ofx isolation" ON public.bank_statements_ofx;
CREATE POLICY "Tenant ofx isolation" ON public.bank_statements_ofx FOR ALL
USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

DROP POLICY IF EXISTS "Tenant crm deals isolation" ON public.crm_deals;
CREATE POLICY "Tenant crm deals isolation" ON public.crm_deals FOR ALL
USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

