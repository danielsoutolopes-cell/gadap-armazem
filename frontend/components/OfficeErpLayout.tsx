"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Activity,
  ShieldCheck,
  Calendar,
  Layers,
  DollarSign,
  FileText,
  CreditCard,
  ShoppingCart,
  Users,
  Briefcase,
  FileSpreadsheet,
  Calculator,
  BarChart3,
  Wrench,
  FileCheck,
  Building2,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  LogOut,
  User,
  ExternalLink,
  Sparkles,
  Lock,
  Clock
} from "lucide-react";

interface NavGroup {
  label: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    isExternal?: boolean;
  }[];
}

const navigationGroups: NavGroup[] = [
  {
    label: "TORRE & OPERAÇÕES",
    items: [
      { name: "Torre de Controle 2D", href: "/dashboard/torre-controle", icon: Activity, badge: "Tempo Real" },
      { name: "Doca • Recebimento (PWA)", href: "/doca/recebimento", icon: Boxes },
      { name: "Doca • Expedição & Picking", href: "/doca/expedicao", icon: Truck },
      { name: "Smart Scheduling (IA)", href: "/dashboard/scheduling", icon: Calendar },
      { name: "Auditoria 3-Way Match", href: "/dashboard/auditoria", icon: ShieldCheck },
      { name: "Inventário Cego ABC", href: "/dashboard/inventario/conciliacao", icon: Layers },
      { name: "TMS Lite & Etiquetas", href: "/dashboard/tms", icon: Truck },
    ]
  },
  {
    label: "CONTROLADORIA & BILLING",
    items: [
      { name: "Emissão Direct-to-SEFAZ", href: "/dashboard/fiscal/emissao", icon: FileText, badge: "Nativo" },
      { name: "Cofre Certificado A1", href: "/dashboard/fiscal/configuracao", icon: Lock, badge: "A1" },
      { name: "Radar Tributário (IBS/CBS)", href: "/dashboard/fiscal/radar", icon: ShieldCheck, badge: "IA Radar" },
      { name: "Faturamento em Lote", href: "/dashboard/faturamento", icon: DollarSign },
      { name: "Contratos & Pricing", href: "/dashboard/contratos", icon: Calculator },
      { name: "Contas a Pagar (AP)", href: "/dashboard/financeiro/pagar", icon: CreditCard },
      { name: "Contas a Receber (AR)", href: "/dashboard/financeiro/receber", icon: DollarSign },
      { name: "Conciliação OFX & SPED", href: "/dashboard/financeiro/conciliacao", icon: FileCheck },
      { name: "Suprimentos & Compras", href: "/dashboard/compras/pedidos", icon: ShoppingCart },
    ]
  },
  {
    label: "CADASTROS & CRM",
    items: [
      { name: "Setup Empresa & CNPJ", href: "/dashboard/configuracoes/empresa", icon: Building2, badge: "Setup" },
      { name: "Clientes Depositantes", href: "/dashboard/cadastros/clientes", icon: Building2 },
      { name: "Fornecedores & Transportes", href: "/dashboard/cadastros/fornecedores", icon: Truck },
      { name: "Catálogo de Serviços", href: "/dashboard/cadastros/servicos", icon: Layers },
      { name: "CRM B2B • Funil de Vendas", href: "/dashboard/comercial/pipeline", icon: Briefcase, badge: "IA" },
      { name: "Portal do Cliente (B2B)", href: "/portal-cliente", icon: ExternalLink, isExternal: true },
    ]
  },
  {
    label: "GESTÃO, RH & QUALIDADE",
    items: [
      { name: "Central Relatórios Excel", href: "/dashboard/relatorios/exportacao", icon: FileSpreadsheet, badge: ".xlsx" },
      { name: "BI Estratégico & DRE", href: "/dashboard/relatorios", icon: BarChart3, badge: "Ask Data" },
      { name: "QMS • Qualidade & FEFO", href: "/dashboard/qualidade", icon: ShieldCheck },
      { name: "CMMS • Frotas & Ativos", href: "/dashboard/manutencao", icon: Wrench },
      { name: "RH Colaboradores (CLT)", href: "/dashboard/rh/colaboradores", icon: Users },
      { name: "Importação Ponto AFD (REP)", href: "/dashboard/rh/ponto/importacao", icon: Clock, badge: "Port. 671" },
      { name: "Folha & Holerites eSocial", href: "/dashboard/rh/folha", icon: FileSpreadsheet },
      { name: "Organograma do Armazém", href: "/dashboard/configuracoes/usuarios", icon: User },
      { name: "Superadmin SaaS (Zero-Trust)", href: "/admin/empresas", icon: Lock },
      { name: "GADAP Academy (Manuais)", href: "/dashboard/academy", icon: FileText },
    ]
  }
];

export default function OfficeErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Páginas em tela cheia que dispensam a barra lateral do escritório
  const isAuthPage = pathname === "/login" || pathname === "/recuperar-senha" || pathname === "/reset-password";
  const isPwaPage = pathname.startsWith("/doca/");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Sidebar Desktop Fixa */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-wider uppercase block leading-none">
                GADAP ERP
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1 block">
                Office & Logistics
              </span>
            </div>
          </Link>
        </div>

        {/* Informações da Empresa & Tenant Ativo */}
        <div className="p-4 mx-3 my-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-white line-clamp-1">GADAP Matriz Alphaville</div>
              <div className="text-[10px] text-slate-400 font-mono">CNPJ: 00.000.000/0001-91</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            TENANT OWNER
          </span>
        </div>

        {/* Menu de Navegação Vertical com Agrupamentos */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scrollbar">
          {navigationGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
              DL
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white line-clamp-1">Daniel Souto Lopes</div>
              <div className="text-[10px] text-slate-400">danielsmlopes@hotmail.com</div>
            </div>
          </div>
          <Link
            href="/login"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sair do ERP"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal do Escritório */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar do Escritório */}
        <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          {/* Botão Mobile para Abrir Sidebar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-200 font-semibold">GADAP Armazém</span>
              <span>/</span>
              <span className="text-slate-400 capitalize">{pathname.replace("/", "").replace(/-/g, " ") || "Home"}</span>
            </div>
          </div>

          {/* Quick Actions no Topo */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/torre-controle"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Torre em Tempo Real</span>
            </Link>

            <Link
              href="/doca/recebimento"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>PWA Doca</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

            <Link
              href="/dashboard/academy"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Manual do Usuário & Academy"
            >
              <FileText className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Sidebar Mobile Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800 p-4 space-y-4 z-50 overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Boxes className="w-6 h-6 text-blue-500" />
                  <span className="font-bold text-white text-sm">GADAP ERP</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-4 text-xs">
                {navigationGroups.map((g, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{g.label}</span>
                    <div className="space-y-1">
                      {g.items.map((i, iIdx) => (
                        <Link
                          key={iIdx}
                          href={i.href}
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:bg-slate-800"
                        >
                          <i.icon className="w-4 h-4 text-blue-400" />
                          <span>{i.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Viewport */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

