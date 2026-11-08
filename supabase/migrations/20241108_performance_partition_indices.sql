-- ==============================================================================
-- MIGRATION: 20241108_performance_partition_indices.sql
-- GADAP Armazém & WMS - Otimização de Performance e Índices Compostos
-- ==============================================================================

-- 1. Índices Compostos e Particionados por Data (Ano/Mês) para Inbound Lots
CREATE INDEX IF NOT EXISTS idx_inbound_lots_tenant_created 
  ON public.inbound_lots(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inbound_lots_date_status
  ON public.inbound_lots(created_at, status);

CREATE INDEX IF NOT EXISTS idx_inbound_lots_lpn_covering
  ON public.inbound_lots(lpn_code, pallet_address, current_weight_kg);

-- 2. Índices Compostos e Particionados para Outbound Orders
CREATE INDEX IF NOT EXISTS idx_outbound_orders_tenant_created
  ON public.outbound_orders(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_outbound_orders_status_date
  ON public.outbound_orders(status, created_at);

-- 3. Índices Compostos para Histórico e Faturamento de Armazenagem
CREATE INDEX IF NOT EXISTS idx_fiscal_invoices_created_env
  ON public.fiscal_invoices(created_at DESC, environment, status);

CREATE INDEX IF NOT EXISTS idx_time_tracking_emp_date
  ON public.time_tracking(employee_id, timestamp DESC);
