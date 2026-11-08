"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Search, 
  ArrowLeft, 
  ExternalLink,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  Server
} from "lucide-react";

interface CompanyItem {
  id: string;
  name: string;
  cnpj: string;
  trade_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: "ACTIVE" | "SUSPENDED" | "TRIAL";
  max_users: number;
  created_at: string;
}

export default function SuperadminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [maxUsers, setMaxUsers] = useState(25);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("gadap_auth_token") || "mock_superadmin";
      const res = await fetch("http://localhost:8000/api/v1/admin/companies", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      } else {
        setCompanies([
          {
            id: "a0000000-0000-0000-0000-000000000001",
            name: "GADAP Logística & Armazéns Gerais S/A",
            cnpj: "00.000.000/0001-91",
            trade_name: "GADAP Matriz Barueri",
            contact_email: "contato@gadap.com.br",
            contact_phone: "+55 (11) 4004-9000",
            status: "ACTIVE",
            max_users: 50,
            created_at: "2026-01-15T10:00:00Z"
          },
          {
            id: "b0000000-0000-0000-0000-000000000002",
            name: "TransLog Armazenagem Aduaneira Santos Ltda",
            cnpj: "12.345.678/0001-00",
            trade_name: "TransLog CLIA Santos",
            contact_email: "operacoes@translogsantos.com.br",
            contact_phone: "+55 (13) 3210-4400",
            status: "ACTIVE",
            max_users: 25,
            created_at: "2026-02-10T14:30:00Z"
          },
          {
            id: "c0000000-0000-0000-0000-000000000003",
            name: "Sul Cargas Centro de Distribuição Eireli",
            cnpj: "98.765.432/0001-88",
            trade_name: "Sul Cargas CD Itajaí",
            contact_email: "admin@sulcargascd.com.br",
            contact_phone: "+55 (47) 3344-9988",
            status: "TRIAL",
            max_users: 10,
            created_at: "2026-03-01T08:00:00Z"
          }
        ]);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cnpj) return;

    const newCompany: CompanyItem = {
      id: "comp-" + Date.now(),
      name,
      cnpj,
      trade_name: tradeName || name,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      status: "ACTIVE",
      max_users: Number(maxUsers) || 20,
      created_at: new Date().toISOString()
    };

    setCompanies([newCompany, ...companies]);
    setName("");
    setCnpj("");
    setTradeName("");
    setContactEmail("");
    setContactPhone("");
    setShowModal(false);
  };

  const toggleCompanyStatus = (id: string) => {
    setCompanies(companies.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
        };
      }
      return c;
    }));
  };

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj.includes(searchTerm)
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
                  SUPERADMIN CONSOLE
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                  <Building2 className="w-7 h-7 text-purple-400" />
                  Gestão Global de Empresas (Tenants)
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Provisionamento de armazéns, controle de licenças por galpão e isolamento de banco de dados
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/configuracoes/usuarios"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-blue-300 flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Gerenciar Usuários</span>
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Armazém / Galpão</span>
            </button>
          </div>
        </div>

        {/* Métricas do SaaS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total de Galpões</span>
            <div className="text-2xl font-black text-white mt-1">{companies.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Galpões Ativos</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {companies.filter(c => c.status === "ACTIVE").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Em Trial / Teste</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {companies.filter(c => c.status === "TRIAL").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Total Assentos Contratados</span>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {companies.reduce((acc, curr) => acc + (curr.max_users || 0), 0)}
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar por Razão Social ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Grid de Armazéns Cadastrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <div
              key={company.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm line-clamp-1">
                    {company.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    CNPJ: {company.cnpj}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                  company.status === "ACTIVE" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : company.status === "TRIAL"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}>
                  {company.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1.5 border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Nome Fantasia:</span>
                  <span className="text-slate-300 font-semibold">{company.trade_name || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Licenças Máximas:</span>
                  <span className="text-purple-300 font-semibold">{company.max_users} operadores</span>
                </div>
                {company.contact_email && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Contato:</span>
                    <span className="text-slate-300 truncate max-w-[160px]">{company.contact_email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => toggleCompanyStatus(company.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                    company.status === "ACTIVE"
                      ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                      : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  {company.status === "ACTIVE" ? "Suspender Acesso" : "Reativar Galpão"}
                </button>

                <span className="text-[10px] text-slate-500 font-mono">
                  ID: {company.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Nova Empresa */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  Cadastrar Novo Armazém (Tenant)
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">Razão Social</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Porto Seco Logística S/A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">CNPJ</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">Nome Fantasia / Unidade</label>
                  <input
                    type="text"
                    placeholder="Ex: CD Logístico Guarulhos"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">E-mail Operacional</label>
                    <input
                      type="email"
                      placeholder="admin@armazem.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Limite de Licenças</label>
                    <input
                      type="number"
                      value={maxUsers}
                      onChange={(e) => setMaxUsers(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all"
                  >
                    Salvar Armazém
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

