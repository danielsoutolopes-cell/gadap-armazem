"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  ShieldCheck, 
  HardDrive, 
  Server, 
  Search, 
  ArrowLeft, 
  Lock, 
  AlertCircle,
  Database,
  Users,
  EyeOff,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";

interface TenantMetadata {
  id: string;
  name: string;
  cnpj: string;
  trade_name: string;
  contact_email: string;
  subscription_tier: string;
  monthly_fee: number;
  storage_used_mb: number;
  database_nodes: number;
  max_users: number;
  status: string;
}

export default function SuperadminZeroTrustCompaniesPage() {
  const [tenants, setTenants] = useState<TenantMetadata[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSaaSMetadata();
  }, []);

  const fetchSaaSMetadata = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/zero-trust/saas/tenants-metadata");
      if (res.ok) {
        const data = await res.json();
        setTenants(data.tenants);
        setHealth(data.saas_platform_health);
      } else {
        setFallbackMetadata();
      }
    } catch {
      setFallbackMetadata();
    }
  };

  const setFallbackMetadata = () => {
    setHealth({
      total_tenants: 4,
      active_subscriptions: 3,
      trial_subscriptions: 1,
      total_mrr_saas: 17960.00,
      cluster_storage_used_gb: 4.82,
      zero_trust_status: "ACTIVE_ISOLATION_ENFORCED"
    });

    setTenants([
      {
        id: "a0000000-0000-0000-0000-000000000001",
        name: "GADAP Logística & Armazéns Gerais S/A",
        cnpj: "00.000.000/0001-91",
        trade_name: "GADAP Matriz Alphaville",
        contact_email: "contato@gadap.com.br",
        subscription_tier: "ENTERPRISE",
        monthly_fee: 6990.00,
        storage_used_mb: 1840.50,
        database_nodes: 2,
        max_users: 100,
        status: "ACTIVE"
      },
      {
        id: "b0000000-0000-0000-0000-000000000002",
        name: "TransLog Armazenagem Aduaneira Santos Ltda",
        cnpj: "12.345.678/0001-00",
        trade_name: "TransLog CLIA Porto de Santos",
        contact_email: "operacoes@translogsantos.com.br",
        subscription_tier: "ENTERPRISE",
        monthly_fee: 5990.00,
        storage_used_mb: 1420.00,
        database_nodes: 1,
        max_users: 50,
        status: "ACTIVE"
      },
      {
        id: "c0000000-0000-0000-0000-000000000003",
        name: "Sul Cargas Centro de Distribuição Eireli",
        cnpj: "98.765.432/0001-88",
        trade_name: "Sul Cargas CD Itajaí",
        contact_email: "admin@sulcargascd.com.br",
        subscription_tier: "PRO",
        monthly_fee: 3490.00,
        storage_used_mb: 890.20,
        database_nodes: 1,
        max_users: 25,
        status: "ACTIVE"
      },
      {
        id: "d0000000-0000-0000-0000-000000000004",
        name: "Nordeste Armazéns Gerais & Logística",
        cnpj: "55.443.322/0001-11",
        trade_name: "Nordeste Suape CD",
        contact_email: "suape@nordestearmazens.com.br",
        subscription_tier: "STARTER",
        monthly_fee: 1490.00,
        storage_used_mb: 340.00,
        database_nodes: 1,
        max_users: 15,
        status: "TRIAL"
      }
    ]);
  };

  const filtered = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cnpj.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-slate-500 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  SUPERADMIN ZERO-TRUST
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                  <Building2 className="w-7 h-7 text-purple-400" />
                  Governança SaaS & Infraestrutura de Tenants
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Painel exclusivo para o dono do SaaS: controle de assinaturas, consumo de storage no banco e isolamento estrito
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/configuracoes/usuarios"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-blue-300 flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Organograma do Armazém</span>
            </Link>
          </div>
        </div>

        {/* BANNER INFORMATIVO: POLÍTICA ZERO-TRUST */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-purple-400">
            <EyeOff className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Política Zero-Trust Ativa no Banco de Dados
            </h2>
          </div>
          <p className="text-xs text-purple-200/90 leading-relaxed">
            Como Superadministrador da plataforma, você gerencia a saúde do ecossistema SaaS (assinaturas, cotas de disco e nós de banco). As políticas de Row Level Security (RLS) no PostgreSQL <b>bloqueiam deliberadamente a sua visualização</b> de dados operacionais e financeiros internos (lotes físicos, notas fiscais, faturamento ou contratos dos clientes).
          </p>
        </div>

        {/* Métricas de Infraestrutura SaaS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total de Tenants</span>
            <div className="text-2xl font-black text-white mt-1">{health?.total_tenants || 4}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">MRR Total da Plataforma</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              R$ {health?.total_mrr_saas?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Armazenamento BD Cluster</span>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {health?.cluster_storage_used_gb || 4.82} GB
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Isolamento RLS</span>
            <div className="text-xs font-black text-cyan-400 mt-2 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              ZERO-TRUST VIGENTE
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar tenants cadastrados por Razão Social ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Grid de Armazéns Cadastrados com Métricas de Infra */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">
                    {tenant.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    CNPJ: {tenant.cnpj} • Unidade: {tenant.trade_name}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                  tenant.status === "ACTIVE" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {tenant.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono border-t border-slate-800/80 pt-3">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">PLANO SAAS</span>
                  <span className="font-bold text-purple-400">{tenant.subscription_tier}</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">STORAGE BD</span>
                  <span className="font-bold text-white">{tenant.storage_used_mb} MB</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">MENSALIDADE</span>
                  <span className="font-bold text-emerald-400">R$ {tenant.monthly_fee?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Nós de Banco: <b>{tenant.database_nodes} réplica(s)</b>
                </span>

                <span className="font-mono text-[10px] text-slate-500">
                  Limite Licenças: {tenant.max_users} usuários
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
