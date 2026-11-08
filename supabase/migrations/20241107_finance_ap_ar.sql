-- ============================================================================
-- PROJETO: GADAP Armazém (WMS/ERP)
-- MÓDULO: Financeiro Base (Contas a Pagar / Contas a Receber)
-- ============================================================================

-- 1. TABELA: ACCOUNTS_PAYABLE (Contas a Pagar - Despesas do Galpão)
CREATE TABLE IF NOT EXISTS public.accounts_payable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    description VARCHAR(255) NOT NULL, -- Ex: "Conta de Energia Galpão Principal", "Manutenção Empilhadeira"
    category VARCHAR(50) NOT NULL DEFAULT 'UTILITIES'
        CHECK (category IN ('UTILITIES', 'MAINTENANCE', 'SUPPLIES', 'PAYROLL', 'TAXES', 'RENT', 'OTHER')),
    document_number VARCHAR(100),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    payment_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
    payment_method VARCHAR(50) DEFAULT 'BOLETO', -- PIX, BOLETO, TED, CARTAO
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. TABELA: ACCOUNTS_RECEIVABLE (Contas a Receber - Títulos de Clientes)
CREATE TABLE IF NOT EXISTS public.accounts_receivable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    storage_invoice_id UUID REFERENCES public.storage_invoices(id) ON DELETE SET NULL,
    description VARCHAR(255) NOT NULL, -- Ex: "Fatura Decendial Armazenagem - Samsung"
    document_number VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    received_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
    payment_gateway_id VARCHAR(100),
    pix_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- RLS
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_payable FORCE ROW LEVEL SECURITY;

ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_receivable FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS accounts_payable_isolation ON public.accounts_payable;
CREATE POLICY accounts_payable_isolation ON public.accounts_payable AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

DROP POLICY IF EXISTS accounts_receivable_isolation ON public.accounts_receivable;
CREATE POLICY accounts_receivable_isolation ON public.accounts_receivable AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

