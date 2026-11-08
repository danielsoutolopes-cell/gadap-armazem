-- ==============================================================================
-- MIGRATION: 20241108_hr_employees_rep_afd_esocial.sql
-- GADAP Armazém & WMS - Módulo RH eSocial Completo & Importação REP AFD
-- ==============================================================================

-- 1. Ampliação da tabela employees com campos obrigatórios eSocial
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50) DEFAULT 'SOLTEIRO',
  ADD COLUMN IF NOT EXISTS dependents_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS address_street VARCHAR(255),
  ADD COLUMN IF NOT EXISTS address_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS address_complement VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address_neighborhood VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address_city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address_state VARCHAR(2),
  ADD COLUMN IF NOT EXISTS address_zip VARCHAR(10),
  ADD COLUMN IF NOT EXISTS rg VARCHAR(30),
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
  ADD COLUMN IF NOT EXISTS ctps_number VARCHAR(30),
  ADD COLUMN IF NOT EXISTS ctps_series VARCHAR(20),
  ADD COLUMN IF NOT EXISTS education_level VARCHAR(100) DEFAULT 'ENSINO_MEDIO_COMPLETO';

-- 2. Tabela de Logs de Importação de Arquivos AFD (Portaria 671 / 1510 MTE)
CREATE TABLE IF NOT EXISTS public.rep_afd_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    rep_manufacturer VARCHAR(100) NOT NULL, -- 'DIMEP', 'CONTROL_ID', 'HENRY', 'TELEMATICA'
    filename VARCHAR(255) NOT NULL,
    nsr_initial VARCHAR(20),
    nsr_final VARCHAR(20),
    records_count INT NOT NULL DEFAULT 0,
    matched_records INT NOT NULL DEFAULT 0,
    unmatched_records INT NOT NULL DEFAULT 0,
    imported_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rep_afd_tenant ON public.rep_afd_imports(tenant_id);

