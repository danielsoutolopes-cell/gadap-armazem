-- ==============================================================================
-- MIGRATION: MÓDULO DE RECURSOS HUMANOS, FOLHA CLT E INTEGRAÇÃO ESOCIAL
-- ==============================================================================

-- 1. Tabela de Colaboradores (Employees)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    registration_code TEXT NOT NULL, -- Matrícula interna
    full_name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    pis TEXT,
    rg TEXT,
    birth_date DATE,
    admission_date DATE NOT NULL,
    job_title TEXT NOT NULL, -- Cargo (ex: Conferente de Doca, Operador de Empilhadeira)
    cbo TEXT NOT NULL, -- Código Brasileiro de Ocupações (ex: 4141-05 Almoxarife, 7822-20 Operador de Empilhadeira)
    contract_type TEXT NOT NULL DEFAULT 'CLT', -- 'CLT', 'PJ', 'ESTAGIO', 'TEMPORARIO'
    base_salary NUMERIC(12, 2) NOT NULL,
    department TEXT NOT NULL DEFAULT 'OPERACAO', -- 'OPERACAO', 'DOCA', 'LOGISTICA', 'FINANCEIRO', 'ADMINISTRATIVO'
    work_shift TEXT NOT NULL DEFAULT 'DIURNO', -- 'DIURNO', 'NOTURNO', 'TURNO_12X36'
    bank_name TEXT,
    bank_agency TEXT,
    bank_account TEXT,
    pix_key TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, registration_code),
    UNIQUE(company_id, cpf)
);

-- 2. Tabela de Espelho de Ponto (Time Tracking)
CREATE TABLE IF NOT EXISTS public.time_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    clock_in_1 TIME,
    clock_out_1 TIME,
    clock_in_2 TIME,
    clock_out_2 TIME,
    overtime_50_hours NUMERIC(5, 2) DEFAULT 0, -- Horas extras dias úteis (50%)
    overtime_100_hours NUMERIC(5, 2) DEFAULT 0, -- Horas extras domingos/feriados (100%)
    night_hours NUMERIC(5, 2) DEFAULT 0, -- Horas noturnas (22h às 05h)
    dsr_discount_hours NUMERIC(5, 2) DEFAULT 0, -- Faltas não justificadas que impactam DSR
    justification TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Folhas de Pagamento / Holerites (Payroll Records)
CREATE TABLE IF NOT EXISTS public.payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    competence_month TEXT NOT NULL, -- '2026-11'
    base_salary NUMERIC(12, 2) NOT NULL,
    overtime_50_value NUMERIC(12, 2) DEFAULT 0,
    overtime_100_value NUMERIC(12, 2) DEFAULT 0,
    night_additional_value NUMERIC(12, 2) DEFAULT 0,
    dsr_value NUMERIC(12, 2) DEFAULT 0,
    gross_salary NUMERIC(12, 2) NOT NULL, -- Total Vencimentos
    inss_discount NUMERIC(12, 2) NOT NULL, -- Tabela progressiva
    irrf_discount NUMERIC(12, 2) NOT NULL, -- Tabela progressiva com dedução por dependente
    transport_voucher_discount NUMERIC(12, 2) DEFAULT 0, -- VT até 6%
    meal_discount NUMERIC(12, 2) DEFAULT 0,
    other_discounts NUMERIC(12, 2) DEFAULT 0,
    net_salary NUMERIC(12, 2) NOT NULL, -- Salário Líquido
    fgts_provision NUMERIC(12, 2) NOT NULL, -- 8% (informativo da empresa)
    payment_status TEXT NOT NULL DEFAULT 'PROCESSED', -- 'DRAFT', 'PROCESSED', 'PAID'
    payment_date DATE,
    esocial_s1200_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'TRANSMITTED', 'ERROR'
    esocial_receipt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS para Isolamento Multi-Tenant
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation employees" ON public.employees;
CREATE POLICY "Tenant isolation employees" ON public.employees
FOR ALL USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

DROP POLICY IF EXISTS "Tenant isolation time_tracking" ON public.time_tracking;
CREATE POLICY "Tenant isolation time_tracking" ON public.time_tracking
FOR ALL USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

DROP POLICY IF EXISTS "Tenant isolation payroll_records" ON public.payroll_records;
CREATE POLICY "Tenant isolation payroll_records" ON public.payroll_records
FOR ALL USING (company_id = public.get_current_tenant() OR public.get_current_user_role() = 'SUPERADMIN');

