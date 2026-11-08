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
  Info,
  Layers,
  Crown,
  Briefcase,
  DollarSign,
  Truck,
  Globe
} from "lucide-react";

interface RealisticMember {
  id: string;
  full_name: string;
  email: string;
  role: "TENANT_OWNER" | "MANAGER" | "FINANCE" | "OPERATOR" | "CLIENT_B2B";
  role_title: string;
  phone?: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

export default function TenantUsersManagementPage() {
  const [members, setMembers] = useState<RealisticMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MANAGER" | "FINANCE" | "OPERATOR" | "CLIENT_B2B">("OPERATOR");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Doca & Recebimento Físico");

  // Matriz de Governança Realista
  const rolePermissionsMatrix: Record<string, { title: string; subtitle: string; icon: any; permissions: string[]; restrictions: string[] }> = {
    TENANT_OWNER: {
      title: "TENANT_OWNER (Diretor Geral)",
      subtitle: "Acesso total irrestrito ao tenant e todos os módulos",
      icon: Crown,
      permissions: [
        "Gestão do organograma completo do armazém",
        "Acesso à Torre de Controle, Heatmap e Inventário",
        "Aprovação de fechamento de faturamento e DRE",
        "Configuração de contratos e tabelas de preços"
      ],
      restrictions: []
    },
    MANAGER: {
      title: "MANAGER (Gerente de Logística)",
      subtitle: "Gestão operacional, conferência, expedição e auditorias",
      icon: Briefcase,
      permissions: [
        "Visualização da Torre de Controle e Heatmap 2D",
        "Auditoria Fiscal 3-Way Match e Quarentena",
        "Supervisão de tarefas de expedição e recebimento",
        "Relatórios operacionais de ocupação e giro"
      ],
      restrictions: [
        "Sem acesso às telas de faturamento, DRE e pagamentos"
      ]
    },
    FINANCE: {
      title: "FINANCE (Controladoria & Faturamento)",
      subtitle: "Acesso exclusivo ao faturamento, cobrança e conciliação",
      icon: DollarSign,
      permissions: [
        "Contas a Pagar, Contas a Receber e DRE",
        "Conciliação bancária de extrato OFX",
        "Faturamento em lote de armazenagem e NFS-e",
        "Geração de arquivo texto do SPED Fiscal"
      ],
      restrictions: [
        "Bloqueado para alteração de estoque físico e bipagem de doca"
      ]
    },
    OPERATOR: {
      title: "OPERATOR (Conferente de Doca & Operador)",
      subtitle: "Acesso restrito ao PWA móvel e execução de campo",
      icon: Truck,
      permissions: [
        "Acesso ao PWA de Recebimento com Câmera Zero-Storage",
        "Bipagem de código de barras no Checkout de Saída",
        "Emissão de laudo fotográfico de avaria na doca"
      ],
      restrictions: [
        "Totalmente bloqueado para telas financeiras e cadastros"
      ]
    },
    CLIENT_B2B: {
      title: "CLIENT_B2B (Depositante / Dono da Carga)",
      subtitle: "Visão estrita e isolada apenas de seus próprios lotes",
      icon: Globe,
      permissions: [
        "Consulta de status de cargas no Portal do Cliente",
        "Visualização de boletos e faturas decendiais próprias",
        "Emissão de relatório consolidado em PDF"
      ],
      restrictions: [
        "Cego para dados de qualquer outro depositante ou galpão"
      ]
    }
  };

  useEffect(() => {
    fetchOrganogram();
  }, []);

  const fetchOrganogram = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/zero-trust/users/organogram");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members);
      } else {
        setFallbackOrganogram();
      }
    } catch {
      setFallbackOrganogram();
    }
  };

  const setFallbackOrganogram = () => {
    setMembers([
      {
        id: "usr-01",
        full_name: "Daniel Souto Lopes",
        email: "diretoria@gadap.com.br",
        role: "TENANT_OWNER",
        role_title: "Diretor Operacional & Dono do Armazém",
        phone: "+55 (11) 98765-4321",
        department: "Diretoria Geral",
        is_active: true,
        created_at: "2026-01-10T08:00:00Z"
      },
      {
        id: "usr-02",
        full_name: "Carlos Henrique Mendes",
        email: "carlos.mendes@gadap.com.br",
        role: "MANAGER",
        role_title: "Gerente Geral de Logística",
        phone: "+55 (11) 97123-1122",
        department: "Operações & Armazém",
        is_active: true,
        created_at: "2026-01-15T09:30:00Z"
      },
      {
        id: "usr-03",
        full_name: "Roberto Dias da Silva",
        email: "roberto.fiscal@gadap.com.br",
        role: "FINANCE",
        role_title: "Controller / Especialista Fiscal",
        phone: "+55 (11) 99887-2233",
        department: "Controladoria & Faturamento",
        is_active: true,
        created_at: "2026-02-01T10:00:00Z"
      },
      {
        id: "usr-04",
        full_name: "Mariana Souza de Oliveira",
        email: "mariana.doca@gadap.com.br",
        role: "OPERATOR",
        role_title: "Conferente Líder de Doca",
        phone: "+55 (11) 96321-4455",
        department: "Doca & Recebimento Físico",
        is_active: true,
        created_at: "2026-02-20T07:45:00Z"
      },
      {
        id: "usr-05",
        full_name: "Juliana Lima Ferreira",
        email: "juliana.empilhadeira@gadap.com.br",
        role: "OPERATOR",
        role_title: "Operadora de Empilhadeira Retrátil",
        phone: "+55 (11) 95432-8877",
        department: "Movimentação & Ruas",
        is_active: true,
        created_at: "2026-03-01T08:00:00Z"
      },
      {
        id: "usr-06",
        full_name: "MegaLog Suprimentos Importados",
        email: "contato@megalogimport.com.br",
        role: "CLIENT_B2B",
        role_title: "Depositante / Dono da Carga",
        phone: "+55 (11) 3322-1100",
        department: "Portal Externo B2B",
        is_active: true,
        created_at: "2026-03-10T11:00:00Z"
      }
    ]);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newMember: RealisticMember = {
      id: "usr-" + Date.now(),
      full_name: fullName,
      email: email,
      role: role,
      role_title: rolePermissionsMatrix[role]?.title || role,
      phone: phone || undefined,
      department: department,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setMembers([newMember, ...members]);
    setShowModal(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setFeedbackMsg(`Colaborador ${newMember.full_name} integrado ao organograma com a role ${role}!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "TENANT_OWNER":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "MANAGER":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "FINANCE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "OPERATOR":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "CLIENT_B2B":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
                <ShieldCheck className="w-7 h-7 text-blue-400" />
                Organograma do Armazém & Matriz RBAC
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Painel do TENANT_OWNER (Diretoria) com hierarquia funcional realista e segregação de deveres
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/empresas"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-purple-300 flex items-center gap-2 transition-all"
            >
              <Building className="w-4 h-4 text-purple-400" />
              <span>Painel Superadmin (SaaS Zero-Trust)</span>
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Adicionar ao Organograma</span>
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Quadro de Membros por Perfil */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-purple-400">Diretoria (Owner)</span>
            <div className="text-xl font-black text-white mt-1">
              {members.filter(m => m.role === "TENANT_OWNER").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-blue-400">Gerência Logística</span>
            <div className="text-xl font-black text-blue-400 mt-1">
              {members.filter(m => m.role === "MANAGER").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Controladoria</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {members.filter(m => m.role === "FINANCE").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-amber-400">Conferentes Doca</span>
            <div className="text-xl font-black text-amber-400 mt-1">
              {members.filter(m => m.role === "OPERATOR").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-cyan-400">Depositantes B2B</span>
            <div className="text-xl font-black text-cyan-400 mt-1">
              {members.filter(m => m.role === "CLIENT_B2B").length}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar colaborador por nome ou e-mail..."
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
              <option value="ALL">Todos os Níveis</option>
              <option value="TENANT_OWNER">TENANT_OWNER (Diretor)</option>
              <option value="MANAGER">MANAGER (Gerente)</option>
              <option value="FINANCE">FINANCE (Financeiro)</option>
              <option value="OPERATOR">OPERATOR (Conferente)</option>
              <option value="CLIENT_B2B">CLIENT_B2B (Depositante)</option>
            </select>
          </div>
        </div>

        {/* Tabela do Organograma */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Membro / E-mail</th>
                <th className="py-3.5 px-4 font-bold">Perfil RBAC</th>
                <th className="py-3.5 px-4 font-bold">Função / Departamento</th>
                <th className="py-3.5 px-4 font-bold">Telefone</th>
                <th className="py-3.5 px-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {member.role === "TENANT_OWNER" && <Crown className="w-3.5 h-3.5 text-purple-400" />}
                      {member.full_name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {member.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getRoleBadge(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="font-semibold text-slate-200">{member.role_title}</div>
                    <div className="text-[10px] text-slate-500">{member.department}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {member.phone || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Adição com Matriz Explicativa */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  Cadastrar Colaborador no Organograma
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Castro"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    placeholder="amanda@gadap.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">Hierarquia / Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["MANAGER", "FINANCE", "OPERATOR", "CLIENT_B2B"] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          role === r ? "bg-blue-600/10 border-blue-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <div className="font-bold text-[11px]">{r}</div>
                        <div className="text-[9px] text-slate-500 truncate">{rolePermissionsMatrix[r]?.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caixa explicativa dos privilégios e restrições */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Permissões do Perfil:</span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-400 space-y-0.5">
                    {rolePermissionsMatrix[role]?.permissions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                  {rolePermissionsMatrix[role]?.restrictions.length > 0 && (
                    <div className="pt-1 text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{rolePermissionsMatrix[role]?.restrictions[0]}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider"
                  >
                    Salvar no Organograma
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
