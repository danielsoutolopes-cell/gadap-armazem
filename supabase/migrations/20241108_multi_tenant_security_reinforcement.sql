-- Migração: Fortalecimento da Blindagem RLS Multi-Tenant (Zero-Trust Financeiro e Relatórios)
-- Garante isolamento estrito para pelo menos 10+ empresas concorrentes simultâneas

-- 1. Garante que a função get_current_tenant existe e é imutável no contexto da transação
CREATE OR REPLACE FUNCTION public.get_current_tenant()
RETURNS uuid
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_tenant_id uuid;
BEGIN
    -- 1. Tenta recuperar da variável de sessão (setada por conexão)
    BEGIN
        v_tenant_id := NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
    EXCEPTION WHEN OTHERS THEN
        v_tenant_id := NULL;
    END;

    IF v_tenant_id IS NOT NULL THEN
        RETURN v_tenant_id;
    END IF;

    -- 2. Tenta recuperar do JWT Claims do Supabase Auth
    BEGIN
        v_tenant_id := COALESCE(
            NULLIF(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')::uuid,
            NULLIF(auth.jwt() -> 'user_metadata' ->> 'tenant_id', '')::uuid,
            NULLIF(auth.jwt() -> 'app_metadata' ->> 'company_id', '')::uuid
        );
    EXCEPTION WHEN OTHERS THEN
        v_tenant_id := NULL;
    END;

    RETURN v_tenant_id;
END;
$$;

-- 2. Assegura RLS e Políticas Estritas na Tabela de Contas a Pagar e Receber
ALTER TABLE IF EXISTS accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payroll_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tariff_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_movements ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas caso existam para recriação limpa
DROP POLICY IF EXISTS tenant_isolation_accounts_payable ON accounts_payable;
DROP POLICY IF EXISTS tenant_isolation_accounts_receivable ON accounts_receivable;
DROP POLICY IF EXISTS tenant_isolation_payroll ON payroll_calculations;
DROP POLICY IF EXISTS tenant_isolation_contracts ON contracts;
DROP POLICY IF EXISTS tenant_isolation_tariff_rules ON tariff_rules;
DROP POLICY IF EXISTS tenant_isolation_stock_movements ON stock_movements;

-- Políticas Estritas de Isolamento: Apenas registros do próprio tenant_id podem ser lidos ou modificados
CREATE POLICY tenant_isolation_accounts_payable ON accounts_payable
    FOR ALL
    USING (tenant_id = public.get_current_tenant())
    WITH CHECK (tenant_id = public.get_current_tenant());

CREATE POLICY tenant_isolation_accounts_receivable ON accounts_receivable
    FOR ALL
    USING (tenant_id = public.get_current_tenant())
    WITH CHECK (tenant_id = public.get_current_tenant());

CREATE POLICY tenant_isolation_payroll ON payroll_calculations
    FOR ALL
    USING (tenant_id = public.get_current_tenant())
    WITH CHECK (tenant_id = public.get_current_tenant());

CREATE POLICY tenant_isolation_contracts ON contracts
    FOR ALL
    USING (tenant_id = public.get_current_tenant())
    WITH CHECK (tenant_id = public.get_current_tenant());

CREATE POLICY tenant_isolation_tariff_rules ON tariff_rules
    FOR ALL
    USING (tenant_id = public.get_current_tenant())
    WITH CHECK (tenant_id = public.get_current_tenant());

CREATE POLICY tenant_isolation_stock_movements ON stock_movements
    FOR ALL
    USING (tenant_id = public.get_current_tenant())
    WITH CHECK (tenant_id = public.get_current_tenant());
