-- ==============================================================================
-- MIGRATION: HIERARQUIA DE PERFIS REALISTA E POLÍTICA ZERO-TRUST PARA SUPERADMIN
-- ==============================================================================

-- 1. Atualização do Tipo/Check de Roles em public.users
-- Roles para Tenant: TENANT_OWNER, MANAGER, FINANCE, OPERATOR, CLIENT_B2B
-- Role Global SaaS: SUPERADMIN (Isolado de dados de negócio via Zero-Trust)
DO $$
BEGIN
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE public.users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('SUPERADMIN', 'TENANT_OWNER', 'MANAGER', 'FINANCE', 'OPERATOR', 'CLIENT_B2B', 'TENANT_ADMIN', 'CLIENT'));
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- 2. Atualizar tabela public.companies com métricas de infraestrutura SaaS para o Superadmin
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'ENTERPRISE', -- 'STARTER', 'PRO', 'ENTERPRISE'
ADD COLUMN IF NOT EXISTS storage_used_mb NUMERIC(10, 2) DEFAULT 48.50, -- Armazenamento consumido no BD
ADD COLUMN IF NOT EXISTS database_nodes INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS monthly_subscription_fee NUMERIC(12, 2) DEFAULT 4990.00;

-- 3. Função Helper para verificar se o usuário é um membro operacional do Tenant
CREATE OR REPLACE FUNCTION public.is_tenant_member()
RETURNS BOOLEAN AS $$
    SELECT public.get_current_user_role() IN ('TENANT_OWNER', 'MANAGER', 'FINANCE', 'OPERATOR', 'TENANT_ADMIN')
       AND public.get_current_tenant() IS NOT NULL;
$$ LANGUAGE sql STABLE;

-- ------------------------------------------------------------------------------
-- 4. POLÍTICAS ZERO-TRUST: SUPERADMIN É EXCLUSIVAMENTE ADMINISTRADOR DO SAAS
-- O SUPERADMIN NÃO PODE LER NEM ALTERAR DADOS OPERACIONAIS OU FINANCEIROS.
-- ------------------------------------------------------------------------------

-- (A) INVENTÁRIO & LOTES (inbound_lots)
ALTER TABLE public.inbound_lots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation inbound_lots" ON public.inbound_lots;
DROP POLICY IF EXISTS "Zero trust inbound_lots" ON public.inbound_lots;

CREATE POLICY "Zero trust inbound_lots" ON public.inbound_lots
FOR ALL USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_OWNER', 'MANAGER', 'OPERATOR', 'TENANT_ADMIN')
    AND public.get_current_user_role() != 'SUPERADMIN' -- ZERO-TRUST: SUPERADMIN É CEGO
);

-- (B) FINANCEIRO (accounts_payable & accounts_receivable)
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation accounts_payable" ON public.accounts_payable;
DROP POLICY IF EXISTS "Zero trust accounts_payable" ON public.accounts_payable;

CREATE POLICY "Zero trust accounts_payable" ON public.accounts_payable
FOR ALL USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_OWNER', 'FINANCE', 'TENANT_ADMIN')
    AND public.get_current_user_role() != 'SUPERADMIN' -- ZERO-TRUST: SUPERADMIN NÃO VÊ FINANCEIRO
);

ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation accounts_receivable" ON public.accounts_receivable;
DROP POLICY IF EXISTS "Zero trust accounts_receivable" ON public.accounts_receivable;

CREATE POLICY "Zero trust accounts_receivable" ON public.accounts_receivable
FOR ALL USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_OWNER', 'FINANCE', 'TENANT_ADMIN')
    AND public.get_current_user_role() != 'SUPERADMIN' -- ZERO-TRUST: SUPERADMIN NÃO VÊ FATURAMENTO
);

-- (C) CONTRATOS & REGRAS TARIFÁRIAS (contracts & tariff_rules)
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation contracts" ON public.contracts;
DROP POLICY IF EXISTS "Zero trust contracts" ON public.contracts;

CREATE POLICY "Zero trust contracts" ON public.contracts
FOR ALL USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_OWNER', 'FINANCE', 'TENANT_ADMIN')
    AND public.get_current_user_role() != 'SUPERADMIN' -- ZERO-TRUST: SEGREDOS COMERCIAIS PROTEGIDOS
);

-- (D) AUDITORIAS DE INVENTÁRIO (inventory_audits)
ALTER TABLE public.inventory_audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation inventory_audits" ON public.inventory_audits;
DROP POLICY IF EXISTS "Zero trust inventory_audits" ON public.inventory_audits;

CREATE POLICY "Zero trust inventory_audits" ON public.inventory_audits
FOR ALL USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_OWNER', 'MANAGER', 'TENANT_ADMIN')
    AND public.get_current_user_role() != 'SUPERADMIN'
);

-- (E) GESTÃO DE USUÁRIOS (public.users)
-- TENANT_OWNER tem gestão total do seu tenant
-- SUPERADMIN só pode gerenciar os dados mestres de autenticação sem invadir o tenant
DROP POLICY IF EXISTS "Tenant owner manage users" ON public.users;
CREATE POLICY "Tenant owner manage users" ON public.users
FOR ALL USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_OWNER', 'TENANT_ADMIN')
)
WITH CHECK (
    company_id = public.get_current_tenant()
    AND role != 'SUPERADMIN' -- O dono do galpão não pode criar Superadmins do SaaS
);

-- (F) EMPRESAS (public.companies)
-- O SUPERADMIN tem acesso exclusivo aos metadados do SaaS
DROP POLICY IF EXISTS "Superadmin infra access companies" ON public.companies;
CREATE POLICY "Superadmin infra access companies" ON public.companies
FOR ALL USING (
    public.get_current_user_role() = 'SUPERADMIN'
    OR id = public.get_current_tenant()
);

