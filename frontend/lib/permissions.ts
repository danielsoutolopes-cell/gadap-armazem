"use client";

import { useEffect, useState } from "react";

export type Role = "SUPERADMIN" | "TENANT_OWNER" | "MANAGER" | "FINANCE" | "OPERATOR" | "CLIENT_B2B";

export interface DemoTenantState {
  isDemoTenant: boolean;
  tenant_name: string;
  cnpj: string;
  initial_reset_time: string;
}

// Matriz Oficial de Permissões por Grupo / Módulo
export const ROLE_PERMISSIONS: Record<Role, { label: string; allowedPrefixes: string[] }> = {
  SUPERADMIN: {
    label: "Superadministrador (Acesso Irrestrito / Zero-Trust)",
    allowedPrefixes: ["*"] // Acessa tudo
  },
  TENANT_OWNER: {
    label: "Diretor do Armazém / Proprietário",
    allowedPrefixes: [
      "/dashboard/torre-controle",
      "/doca",
      "/dashboard/scheduling",
      "/dashboard/auditoria",
      "/dashboard/inventario",
      "/dashboard/tms",
      "/dashboard/fiscal",
      "/dashboard/faturamento",
      "/dashboard/contratos",
      "/dashboard/financeiro",
      "/dashboard/compras",
      "/dashboard/configuracoes",
      "/dashboard/cadastros",
      "/dashboard/comercial",
      "/dashboard/relatorios",
      "/dashboard/qualidade",
      "/dashboard/manutencao",
      "/dashboard/rh",
      "/dashboard/auditoria-sistema",
      "/dashboard/academy"
    ]
  },
  MANAGER: {
    label: "Gerente de Logística e Operações",
    allowedPrefixes: [
      "/dashboard/torre-controle",
      "/doca",
      "/dashboard/scheduling",
      "/dashboard/auditoria",
      "/dashboard/inventario",
      "/dashboard/tms",
      "/dashboard/cadastros",
      "/dashboard/relatorios",
      "/dashboard/qualidade",
      "/dashboard/manutencao",
      "/dashboard/academy"
    ]
  },
  FINANCE: {
    label: "Controladoria & Billing Fiscal",
    allowedPrefixes: [
      "/dashboard/fiscal",
      "/dashboard/faturamento",
      "/dashboard/contratos",
      "/dashboard/financeiro",
      "/dashboard/compras",
      "/dashboard/relatorios",
      "/dashboard/cadastros",
      "/dashboard/rh/folha",
      "/dashboard/academy"
    ]
  },
  OPERATOR: {
    label: "Operador de Doca / Conferente",
    allowedPrefixes: [
      "/doca/recebimento",
      "/doca/expedicao",
      "/dashboard/torre-controle",
      "/dashboard/inventario/conciliacao",
      "/dashboard/academy"
    ]
  },
  CLIENT_B2B: {
    label: "Depositante / Importador (Portal B2B)",
    allowedPrefixes: [
      "/portal-cliente",
      "/dashboard/academy"
    ]
  }
};

export const INITIAL_DEMO_DATA = {
  isDemoTenant: true,
  company_name: "TESTE LTDA",
  trade_name: "Armazéns Gerais Teste (Ambiente Academy)",
  cnpj: "00.000.000/0001-91",
  cnae: "5211-7/99 - Depósitos de Mercadorias para Terceiros",
  balance_positions: 1200,
  occupied_positions: 450,
  free_positions: 750,
  active_lots: [
    { id: "LOT-DEMO-01", doc: "DI-2026/001-DEMO", product: "Smartphone Pro 256GB", depositante: "Demo Tech S.A.", qty: 500, status: "STORED", rack: "RUA01-P02-N01" },
    { id: "LOT-DEMO-02", doc: "NF-2026/998-DEMO", product: "Refrigerador Duplex Frost Free", depositante: "Demo Varejo LTDA", qty: 40, status: "STORED", rack: "RUA02-P01-N02" },
    { id: "LOT-DEMO-03", doc: "DI-2026/003-DEMO", product: "Medicamento Controlado 50ml", depositante: "Demo Farma S.A.", qty: 150, status: "QUARANTINE", rack: "CAMARA-FRIA-01" },
  ],
  bills_pending: [
    { id: "AP-DEMO-01", desc: "Conta de Energia Galpão Teste", amount: 4500.00, due: "2026-11-20" },
    { id: "AP-DEMO-02", desc: "Manutenção Preventiva Empilhadeira Hyster", amount: 1800.00, due: "2026-11-25" }
  ]
};

export function isRouteAllowed(role: Role, pathname: string, isDemoTenant: boolean): boolean {
  // A EMPRESA TESTE LTDA NÃO TEM TRAVAS DE ACESSO: O usuário pode navegar por todo o sistema livremente no Academy
  if (isDemoTenant) {
    return true;
  }

  if (role === "SUPERADMIN") {
    return true;
  }

  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.allowedPrefixes.some(prefix => {
    if (prefix === "*") return true;
    return pathname.startsWith(prefix);
  });
}

export function resetDemoTenantState() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("gadap_demo_lots");
    localStorage.removeItem("gadap_demo_invoices");
    localStorage.removeItem("gadap_demo_financials");
    localStorage.setItem("gadap_demo_state", JSON.stringify(INITIAL_DEMO_DATA));
  }
}

