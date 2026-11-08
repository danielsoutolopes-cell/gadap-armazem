-- ============================================================================
-- PROJETO: GADAP Armazém (WMS/ERP)
-- MÓDULO: Suprimentos e Compras Internas de Galpão
-- ============================================================================

-- 1. TABELA: PURCHASE_ORDERS (Pedidos de Compra de Insumos/EPIs/Paletes)
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    order_number VARCHAR(50) NOT NULL, -- Ex: "OC-2026-0042"
    category VARCHAR(50) NOT NULL DEFAULT 'SUPPLIES' 
        CHECK (category IN ('SUPPLIES', 'EPIS', 'PACKAGING', 'MAINTENANCE_PARTS', 'OTHER')),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'RECEIVED', 'CANCELLED')),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    payment_terms VARCHAR(100) DEFAULT '30 Dias Boleto',
    notes TEXT,
    buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    payable_id UUID REFERENCES public.accounts_payable(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_po_number UNIQUE (tenant_id, order_number)
);

-- 2. TABELA: PURCHASE_ORDER_ITEMS (Itens Requisitados no Pedido de Compra)
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    item_description VARCHAR(255) NOT NULL, -- Ex: "Bobina Filme Stretch 25 micras", "Palete PBR ABRAS"
    unit_of_measure VARCHAR(20) NOT NULL DEFAULT 'UN', -- UN, CX, ROLO, PAR
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
    total_cost NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- RLS
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders FORCE ROW LEVEL SECURITY;

ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS purchase_orders_isolation ON public.purchase_orders;
CREATE POLICY purchase_orders_isolation ON public.purchase_orders AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

DROP POLICY IF EXISTS purchase_order_items_isolation ON public.purchase_order_items;
CREATE POLICY purchase_order_items_isolation ON public.purchase_order_items AS RESTRICTIVE FOR ALL
USING (tenant_id = public.get_current_tenant()) WITH CHECK (tenant_id = public.get_current_tenant());

