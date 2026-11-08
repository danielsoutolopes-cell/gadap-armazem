-- ==============================================================================
-- MIGRATION: 20241108_payroll_benefits_deductions_ap.sql
-- GADAP Armazém & WMS - Descontos de Benefícios (Plano de Saúde, VT, VR/VA),
-- Dissídio Coletivo, PLR e Integração com Contas a Pagar (AP)
-- ==============================================================================

-- 1. Tabela de Benefícios e Descontos Recorrentes / Importados
CREATE TABLE IF NOT EXISTS public.employee_benefits_deductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    benefit_type VARCHAR(50) NOT NULL, -- 'HEALTH_PLAN', 'DENTAL_PLAN', 'TRANSPORT_VOUCHER', 'MEAL_VOUCHER', 'FOOD_VOUCHER', 'CONSIGNMENT', 'OTHER'
    provider_name VARCHAR(150), -- Ex: 'Bradesco Saúde', 'Unimed', 'Alelo', 'Ticket', 'VR Benefícios'
    competence_month VARCHAR(7) NOT NULL, -- '2026-11'
    employee_discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    company_cost_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    reference_percentage NUMERIC(5,2), -- Ex: 6% para VT
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_benefits_emp ON public.employee_benefits_deductions(employee_id, competence_month);

-- 2. Tabela de Dissídios Coletivos e PLR (Participação nos Lucros e Resultados)
CREATE TABLE IF NOT EXISTS public.payroll_special_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'DISSIDIO_RETROATIVO', 'PLR_SEMESTRAL', 'BONIFICACAO', 'PREMIO_PRODUTIVIDADE'
    title VARCHAR(150) NOT NULL,
    competence_month VARCHAR(7) NOT NULL,
    percentage NUMERIC(5,2) DEFAULT 0.00, -- Ex: 4.5% de dissídio
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    is_integrated_to_ap BOOLEAN DEFAULT false,
    ap_title_id UUID,
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Atualização de payroll_records para armazenar as novas rubricas
ALTER TABLE public.payroll_records
  ADD COLUMN IF NOT EXISTS health_plan_discount NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS dental_plan_discount NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS transport_voucher_discount NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS meal_voucher_discount NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS retro_dissidio_amount NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS plr_amount NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS integrated_to_ap BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ap_batch_id VARCHAR(50);

