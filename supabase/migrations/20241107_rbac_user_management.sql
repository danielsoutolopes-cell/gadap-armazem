-- ==============================================================================
-- MIGRATION: RBAC & GESTÃO DE USUÁRIOS MULTI-TENANT E MULTI-EMPRESA
-- ==============================================================================

-- 1. Garante enum de papéis (RBAC) ou constraint em public.users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('SUPERADMIN', 'TENANT_ADMIN', 'OPERATOR', 'FINANCE', 'CLIENT');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Atualizar ou garantir a tabela public.companies com atributos corporativos
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    trade_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'TRIAL'
    max_users INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Atualizar tabela public.users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'OPERATOR',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Função auxiliar para identificar o papel do usuário na requisição atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
    SELECT COALESCE(
        current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role',
        current_setting('request.jwt.claims', true)::jsonb->'user_metadata'->>'role',
        'OPERATOR'
    );
$$ LANGUAGE sql STABLE;

-- 5. RLS para public.companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmin full access companies" ON public.companies;
CREATE POLICY "Superadmin full access companies"
ON public.companies
FOR ALL
USING (
    public.get_current_user_role() = 'SUPERADMIN' 
    OR auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Tenant view own company" ON public.companies;
CREATE POLICY "Tenant view own company"
ON public.companies
FOR SELECT
USING (
    id = public.get_current_tenant()
);

-- 6. RLS para public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmin full access users" ON public.users;
CREATE POLICY "Superadmin full access users"
ON public.users
FOR ALL
USING (
    public.get_current_user_role() = 'SUPERADMIN' 
    OR auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Tenant admin manage own users" ON public.users;
CREATE POLICY "Tenant admin manage own users"
ON public.users
FOR ALL
USING (
    company_id = public.get_current_tenant()
    AND public.get_current_user_role() IN ('TENANT_ADMIN', 'SUPERADMIN')
)
WITH CHECK (
    company_id = public.get_current_tenant()
    AND role != 'SUPERADMIN' -- Tenant admin não pode criar superadmins
);

DROP POLICY IF EXISTS "Users view members of same tenant" ON public.users;
CREATE POLICY "Users view members of same tenant"
ON public.users
FOR SELECT
USING (
    company_id = public.get_current_tenant()
);

