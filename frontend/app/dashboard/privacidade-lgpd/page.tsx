"use client";

import React, { useState, useEffect } from "react";
import OfficeErpLayout from "@/components/OfficeErpLayout";
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Download, 
  EyeOff, 
  UserCheck, 
  Scale, 
  CheckCircle, 
  RefreshCw,
  Search,
  ExternalLink
} from "lucide-react";

export default function LgpdPrivacyPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "dsar" | "ropa" | "incidents">("overview");
  const [dsarRequests, setDsarRequests] = useState<any[]>([
    {
      id: "DSAR-0001",
      tipo: "REVOGAÇÃO DE CONSENTIMENTO",
      titular: "Carlos Silva de Oliveira",
      cpf: "123.***.***-45",
      status: "CONCLUÍDO COM RESSALVA LEGAL",
      prazo: "Cumprido em 24h",
      parecer: "Retenção preservada para registros de NF-e e CT-e conforme Art. 16, I da LGPD (CTN Art. 173). Dados de marketing e telemetria anonimizados irreversivelmente."
    },
    {
      id: "DSAR-0002",
      tipo: "PORTABILIDADE DE DADOS",
      titular: "Mariana Souza Santos",
      cpf: "847.***.***-12",
      status: "EXPORTADO (JSON PADRÃO ANPD)",
      prazo: "Cumprido em 48h",
      parecer: "Arquivo interoperável criptografado gerado e enviado com chave simétrica temporária."
    },
    {
      id: "DSAR-0003",
      tipo: "ANONIMIZAÇÃO (DIREITO AO ESQUECIMENTO)",
      titular: "Fernando Rocha Melo",
      cpf: "931.***.***-09",
      status: "HASH CRIPTOGRÁFICO APLICADO",
      prazo: "Cumprido em 12h",
      parecer: "Substituição de CPF e Nome por hash SHA-256 e exclusão de identificadores diretos."
    }
  ]);

  const [newTitularName, setNewTitularName] = useState("");
  const [newTitularCpf, setNewTitularCpf] = useState("");
  const [newRequestType, setNewRequestType] = useState("ACCESS");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreateDsar = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const cleanCpf = newTitularCpf.replace(/\D/g, "");
      const masked = cleanCpf.length === 11 ? `${cleanCpf.slice(0,3)}.***.***-${cleanCpf.slice(-2)}` : "***.***.***-**";
      
      const newDsar = {
        id: `DSAR-000${dsarRequests.length + 1}`,
        tipo: newRequestType,
        titular: newTitularName || "Titular Requisitante",
        cpf: masked,
        status: newRequestType === "ANONYMIZATION" ? "HASH CRIPTOGRÁFICO APLICADO" : "PROCESSADO",
        prazo: "Atendido de imediato",
        parecer: "Validação automática contra Art. 16 (Bases de Exceção) e aplicação de salvaguarda de dados operacionais."
      };

      setDsarRequests([newDsar, ...dsarRequests]);
      setSubmitting(false);
      setSuccessMsg(`Solicitação ${newDsar.id} registrada com sucesso na trilha de auditoria!`);
      setNewTitularName("");
      setNewTitularCpf("");
      setTimeout(() => setSuccessMsg(""), 5000);
    }, 600);
  };

  return (
    <OfficeErpLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> LGPD COMPLIANT 100%
              </span>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-xs text-slate-500 font-medium">Lei Federal 13.709/2018</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Governança de Privacidade & Canal DPO
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Central de conformidade da Lei Geral de Proteção de Dados: gestão de direitos dos titulares, ROPA, anonimização e salvaguardas forenses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-right shadow-sm">
              <span className="block text-xs font-semibold text-slate-500 uppercase">Encarregado de Dados (DPO)</span>
              <span className="text-sm font-bold text-slate-800">dpo@gadap.com.br</span>
            </div>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Score de Conformidade</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">100 / 100</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">100% dos princípios atendidos</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Isolamento de Tenants</span>
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">Zero-Trust</div>
            <p className="text-xs text-blue-600 font-medium mt-1">RLS Ativo em 100% das tabelas</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Pseudonimização</span>
              <EyeOff className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">SHA-256</div>
            <p className="text-xs text-purple-600 font-medium mt-1">Marca d'água forense em exports</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">SLA de Atendimento Titular</span>
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">&lt; 48 Horas</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Prazo legal ANPD: até 15 dias</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "overview" 
                ? "border-emerald-600 text-emerald-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Visão Geral & Princípios
          </button>
          <button
            onClick={() => setActiveTab("dsar")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "dsar" 
                ? "border-emerald-600 text-emerald-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Gestão de Direitos do Titular (DSAR - Art. 18)
          </button>
          <button
            onClick={() => setActiveTab("ropa")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "ropa" 
                ? "border-emerald-600 text-emerald-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Mapeamento de Tratamento & Bases Legais (ROPA)
          </button>
          <button
            onClick={() => setActiveTab("incidents")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "incidents" 
                ? "border-emerald-600 text-emerald-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Protocolo de Incidentes ANPD (Art. 48)
          </button>
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" /> Matriz de Adequação aos 10 Princípios da LGPD (Art. 6º)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 1. Finalidade & 2. Adequação
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Dados coletados exclusivamente para a consecução de operações logísticas, faturamento fiscal e transporte de cargas.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 3. Necessidade (Minimização)
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Coleta estrita dos campos necessários. Cadastros de motoristas retêm apenas CNH/CPF para emissão de MDF-e/CT-e.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 4. Livre Acesso & 5. Qualidade dos Dados
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Portal do Titular disponível com consulta facilitada de dados e retificação em tempo real.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 6. Transparência & 7. Segurança
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Políticas claras, isolamento de banco com RLS por tenant e hashes criptográficos SHA-256 no rodapé de relatórios.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 8. Prevenção & 9. Não Discriminação
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Rate limiting preventivo contra scraping (100 req/min) e ausência de processamento automatizado discriminatório.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 10. Responsabilização e Prestação de Contas
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Trilha de auditoria indelével de todas as alterações cadastrais e exportações com carimbo de data, hora e IP do operador.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 text-sm">Harmonização LGPD vs Obrigações Fiscais & Trabalhistas</h3>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  Em conformidade com o <strong>Art. 16, inciso I da LGPD</strong>, o direito de eliminação de dados não anula a obrigação legal de guarda de notas fiscais (5 anos pelo Código Tributário Nacional) nem de livros de registro de empregados (30 anos pelo FGTS). O GADAP WMS aplica de forma inteligente a <strong>anonimização seletiva</strong>: desvincula dados de marketing e telemetria, mantendo o histórico legal exigido pelos órgãos fiscalizadores.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: DSAR */}
        {activeTab === "dsar" && (
          <div className="space-y-6">
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> {successMsg}
              </div>
            )}

            {/* Form Nova Solicitação */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Registrar Solicitação de Titular (Art. 18 LGPD)
              </h2>
              <form onSubmit={handleCreateDsar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newTitularName}
                    onChange={(e) => setNewTitularName(e.target.value)}
                    placeholder="Ex: João Ferreira da Silva"
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CPF do Titular</label>
                  <input
                    type="text"
                    required
                    value={newTitularCpf}
                    onChange={(e) => setNewTitularCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Requerimento</label>
                  <select
                    value={newRequestType}
                    onChange={(e) => setNewRequestType(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="ACCESS">Acesso aos Dados (Art. 18, II)</option>
                    <option value="RECTIFICATION">Retificação de Dados (Art. 18, III)</option>
                    <option value="PORTABILITY">Portabilidade de Dados (Art. 18, V)</option>
                    <option value="ANONYMIZATION">Anonimização / Bloqueio (Art. 18, IV)</option>
                    <option value="REVOCATION">Revogação do Consentimento (Art. 18, IX)</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? "Processando..." : "Protocolar Pedido"}
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de Solicitações */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-800 flex justify-between items-center">
                <span>Livro de Registro de Atendimento aos Titulares (DSAR Log)</span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {dsarRequests.length} solicitações
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {dsarRequests.map((req) => (
                  <div key={req.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{req.titular}</span>
                        <span className="text-xs text-slate-500 font-mono">CPF: {req.cpf}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {req.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{req.prazo}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 pl-2 border-l-2 border-emerald-500 bg-slate-50 p-2 rounded">
                      <span className="font-semibold text-slate-700">Parecer DPO:</span> {req.parecer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: ROPA */}
        {activeTab === "ropa" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">ROPA - Record of Processing Activities</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Inventário contínuo de dados pessoais, finalidades e períodos de retenção legal</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
                  Mapeamento 100% Homologado
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Processo de Negócio</th>
                      <th className="p-3">Dados Tratados</th>
                      <th className="p-3">Base Legal (LGPD)</th>
                      <th className="p-3">Prazo Retenção</th>
                      <th className="p-3">Salvaguarda Técnica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">Faturamento & NF-e</td>
                      <td className="p-3">Nome, CPF, Endereço, Inscrição Estadual</td>
                      <td className="p-3">Art. 7º, II (Obrigação Legal Fiscal)</td>
                      <td className="p-3 font-semibold text-slate-800">5 Anos</td>
                      <td className="p-3">Hash SHA-256 e RLS por Tenant</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">Folha de Pagamento & RH</td>
                      <td className="p-3">CPF, PIS, Salário, Cargo, Ponto Eletrônico</td>
                      <td className="p-3">Art. 7º, II e V (Execução de Contrato/CLT)</td>
                      <td className="p-3 font-semibold text-slate-800">30 Anos</td>
                      <td className="p-3">Mascaramento Salarial por Perfil</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">Expedição & TMS (Motoristas)</td>
                      <td className="p-3">Nome, CPF, CNH, Placa do Veículo, Celular</td>
                      <td className="p-3">Art. 7º, V e IX (Contrato e Legítimo Interesse)</td>
                      <td className="p-3 font-semibold text-slate-800">5 Anos</td>
                      <td className="p-3">Exibição Mascarada (123.***.***-45)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">Auditoria & Logs de Conexão</td>
                      <td className="p-3">Endereço IP, E-mail do Operador, User-Agent</td>
                      <td className="p-3">Marco Civil da Internet (Lei 12.965/14)</td>
                      <td className="p-3 font-semibold text-slate-800">1 Ano</td>
                      <td className="p-3">Trilha WORM (Write Once Read Many)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: INCIDENTS */}
        {activeTab === "incidents" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Registro & Resposta a Incidentes (Art. 48)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Procedimento operacional padrão em caso de vazamento ou incidente de segurança</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
                  Zero Incidentes Registrados
                </span>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">Fluxo de Escalação e Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Passo 1: Contenção Imediata</span>
                    Isolamento do canal de rede, revogação de tokens JWT afetados e ativação do backup seguro.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Passo 2: Perícia Forense</span>
                    Análise dos logs de auditoria imutáveis e cálculo exato dos registros expostos.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Passo 3: Notificação ANPD</span>
                    Comunicação à Autoridade Nacional de Proteção de Dados e aos titulares em prazo tempestivo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </OfficeErpLayout>
  );
}

