-- ==============================================================================
-- MIGRATION: MOTOR DE CONTRATOS E TABELAS TARIFÁRIAS (BILLING/PRICING)
-- ==============================================================================

-- 1. Tabela de Contratos Comerciais
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    contract_number TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    adjustment_index TEXT NOT NULL DEFAULT 'IPCA', -- 'IPCA', 'IGP-M', 'INPC', 'FIXED'
    grace_period_days INT DEFAULT 0, -- Freetime de armazenagem em dias
    minimum_monthly_billing NUMERIC(12, 2) DEFAULT 0, -- Franquia mínima mensal
    billing_cycle TEXT NOT NULL DEFAULT 'DECENDIAL', -- 'DECENDIAL' (10 dias), 'MONTHLY', 'QUINZENAL'
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'DRAFT', 'ACTIVE', 'EXPIRED', 'SUSPENDED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, contract_number)
);

-- 2. Tabela de Regras Tarifárias (Tariff Tables)
CREATE TABLE IF NOT EXISTS public.tariff_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    charge_type TEXT NOT NULL, -- 'STORAGE', 'HANDLING_IN', 'HANDLING_OUT', 'EXTRA_SERVICE'
    calculation_unit TEXT NOT NULL, -- 'PALLET_DAY', 'M3_DAY', 'M2_MONTH', 'TON_DAY', 'UNIT', 'HOUR'
    base_price NUMERIC(12, 4) NOT NULL,
    is_prorata BOOLEAN NOT NULL DEFAULT true, -- Cálculo pró-rata diário
    condition_cargo_type TEXT DEFAULT 'ANY', -- 'ANY', 'DRY', 'REFRIGERATED', 'HAZARDOUS', 'BONDED'
    condition_min_days INT DEFAULT 0,
    condition_extra_params JSONB DEFAULT '{}'::jsonb, -- Regras dinâmicas JSON
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS para Isolamento Multi-Tenant
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariff_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation contracts" ON public.contracts;
CREATE POLICY "Tenant isolation contracts" ON public.contracts
FOR ALL USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

DROP POLICY IF EXISTS "Tenant isolation tariff_rules" ON public.tariff_rules;
CREATE POLICY "Tenant isolation tariff_rules" ON public.tariff_rules
FOR ALL USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

