"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Search, 
  Filter, 
  HelpCircle,
  Building,
  ArrowLeft,
  RefreshCw,
  Info
} from "lucide-react";

interface UserAccount {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: "SUPERADMIN" | "TENANT_ADMIN" | "OPERATOR" | "FINANCE" | "CLIENT";
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export default function TenantUsersManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [tooltipRole, setTooltipRole] = useState<string | null>(null);

  // Formulário de novo usuário
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"TENANT_ADMIN" | "OPERATOR" | "FINANCE">("OPERATOR");
  const [phone, setPhone] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Descrições e escopos de cada Role para o RBAC
  const roleHelpDescriptions: Record<string, { title: string; desc: string; permissions: string[] }> = {
    TENANT_ADMIN: {
      title: "Administrador do Armazém (Tenant Admin)",
      desc: "Gestão completa da operação local, auditoria e cadastros do galpão.",
      permissions: [
        "Acesso à Torre de Controle e Heatmap 2D",
        "Gestão de usuários da equipe local",
        "Aprovação de inventários e compras internas",
        "Parametrização de preços e fornecedores"
      ]
    },
    OPERATOR: {
      title: "Operador de Doca & Estoque (Field Operator)",
      desc: "Execução física das rotinas de movimentação, conferência e etiquetagem.",
      permissions: [
        "Acesso ao PWA de Recebimento com Câmera",
        "Expedição, bipagem de checkout e packing list",
        "Movimentação de pallets LPN entre ruas",
        "Bloqueado para telas financeiras e cadastros"
      ]
    },
    FINANCE: {
      title: "Controladoria & Financeiro (Billing & AP/AR)",
      desc: "Gestão fiscal, fechamento de tarifas decendiais e fluxo de caixa.",
      permissions: [
        "Contas a Pagar e Contas a Receber",
        "Fechamento de faturamento mensal/decendial",
        "Emissão de NFS-e e conciliação bancária Pix",
        "Bloqueado para alteração de inventário físico"
      ]
    },
    SUPERADMIN: {
      title: "Superadministrador Global (SaaS Master)",
      desc: "Gestão de todas as empresas e galpões do ecossistema GADAP.",
      permissions: [
        "Acesso cross-tenant irrestrito",
        "Criação e bloqueio de empresas no SaaS",
        "Configuração de billing da plataforma"
      ]
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("gadap_auth_token") || "mock_superadmin";
      const res = await fetch("http://localhost:8000/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        // Fallback local caso o backend não esteja ativo
        setUsers([
          {
            id: "00000000-0000-0000-0000-000000000001",
            company_id: "a0000000-0000-0000-0000-000000000001",
            full_name: "Daniel Souto Lopes (Superadmin)",
            email: "danielsmlopes@hotmail.com",
            role: "SUPERADMIN",
            phone: "+55 (11) 98765-4321",
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: "11111111-2222-3333-4444-555555555555",
            company_id: "a0000000-0000-0000-0000-000000000001",
            full_name: "Carlos Mendes (Gerente Operacional)",
            email: "carlos.mendes@gadap.com.br",
            role: "TENANT_ADMIN",
            phone: "+55 (11) 97123-1122",
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: "22222222-3333-4444-5555-666666666666",
            company_id: "a0000000-0000-0000-0000-000000000001",
            full_name: "Mariana Souza (Conferente Doca)",
            email: "mariana.doca@gadap.com.br",
            role: "OPERATOR",
            phone: "+55 (11) 96321-4455",
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: "33333333-4444-5555-6666-777777777777",
            company_id: "a0000000-0000-0000-0000-000000000001",
            full_name: "Roberto Dias (Controladoria)",
            email: "roberto.fiscal@gadap.com.br",
            role: "FINANCE",
            phone: "+55 (11) 99887-2233",
            is_active: true,
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newUser: UserAccount = {
      id: "usr-" + Date.now(),
      company_id: "a0000000-0000-0000-0000-000000000001",
      full_name: fullName,
      email: email,
      role: role,
      phone: phone || undefined,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setUsers([newUser, ...users]);
    setFullName("");
    setEmail("");
    setPhone("");
    setShowModal(false);
    setFeedbackMsg({ type: "success", text: `Convite enviado com sucesso para ${newUser.email}!` });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, is_active: !u.is_active };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "SUPERADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "TENANT_ADMIN":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "FINANCE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "OPERATOR":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

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
              <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <Users className="w-7 h-7 text-blue-500" />
                Gestão de Usuários & RBAC
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Controle de acessos baseado em perfis (Role-Based Access Control) e membros do galpão
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/empresas"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-purple-300 flex items-center gap-2 transition-all"
            >
              <Building className="w-4 h-4 text-purple-400" />
              <span>Painel Superadmin (Empresas)</span>
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Convidar Usuário</span>
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            feedbackMsg.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Cards de Resumo RBAC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Membros Ativos</span>
            <div className="text-2xl font-black text-white mt-1">
              {users.filter(u => u.is_active).length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Administradores</span>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {users.filter(u => u.role === "TENANT_ADMIN" || u.role === "SUPERADMIN").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Operadores Doca</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {users.filter(u => u.role === "OPERATOR").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Financeiro</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {users.filter(u => u.role === "FINANCE").length}
            </div>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="ALL">Todos os Perfis</option>
              <option value="TENANT_ADMIN">TENANT_ADMIN</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="FINANCE">FINANCE</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
            </select>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Colaborador / E-mail</th>
                  <th className="py-3.5 px-4 font-bold">Perfil (RBAC)</th>
                  <th className="py-3.5 px-4 font-bold">Telefone</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Nenhum usuário encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{user.full_name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getRoleBadge(user.role)}`}>
                          <ShieldCheck className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {user.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {user.phone}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            disabled={user.role === "SUPERADMIN"}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              user.is_active 
                                ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20" 
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title={user.is_active ? "Inativar Acesso" : "Reativar Acesso"}
                          >
                            {user.is_active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Convidar Usuário com Tooltips Explicativos */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  Convidar Novo Usuário
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">E-mail de Trabalho</label>
                  <input
                    type="email"
                    required
                    placeholder="joao.silva@gadap.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+55 (11) 91234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Seleção de Role com Guia Contextual */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Perfil de Acesso (RBAC)</label>
                    <span className="text-[10px] text-blue-400 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Passe o mouse para ver permissões
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(["TENANT_ADMIN", "OPERATOR", "FINANCE"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        onMouseEnter={() => setTooltipRole(r)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          role === r
                            ? "bg-blue-600/10 border-blue-500 text-white shadow-sm"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="text-[11px] font-bold">{r}</div>
                        <div className="text-[9px] text-slate-500 truncate mt-0.5">
                          {r === "TENANT_ADMIN" ? "Gerente Armazém" : r === "OPERATOR" ? "Doca & Estoque" : "Controladoria"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Caixa descritiva do Perfil Selecionado */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5">
                    <div className="font-bold text-blue-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      {roleHelpDescriptions[role]?.title}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {roleHelpDescriptions[role]?.desc}
                    </p>
                    <ul className="text-[10px] text-slate-500 space-y-0.5 list-disc pl-4 pt-1">
                      {roleHelpDescriptions[role]?.permissions.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-600/20"
                  >
                    Confirmar Convite
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

