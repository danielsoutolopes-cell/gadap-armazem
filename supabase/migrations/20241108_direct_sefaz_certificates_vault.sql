-- ==============================================================================
-- MIGRATION: 20241108_direct_sefaz_certificates_vault.sql
-- GADAP Armazém & WMS - Prompt 24 Nativo Direct-to-SEFAZ
-- 1. Cofre de Certificados Digitais A1 (.pfx / .p12) Criptografados
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.digital_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    certificate_name VARCHAR(150) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    encrypted_pfx_base64 TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    issuer VARCHAR(255),
    serial_number VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_digital_certs_tenant ON public.digital_certificates(tenant_id);

