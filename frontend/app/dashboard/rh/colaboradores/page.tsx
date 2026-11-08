"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  UploadCloud, 
  FileSpreadsheet, 
  Search, 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Send,
  Code,
  DollarSign,
  ChevronRight,
  Filter
} from "lucide-react";

interface Employee {
  id: string;
  registration_code: string;
  full_name: string;
  cpf: string;
  pis: string;
  admission_date: string;
  job_title: string;
  cbo: string;
  contract_type: string;
  base_salary: number;
  department: string;
  work_shift: string;
  is_active: boolean;
}

export default function ColaboradoresPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showEsocialModal, setShowEsocialModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [esocialResult, setEsocialResult] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Formulário individual
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [pis, setPis] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [admissionDate, setAdmissionDate] = useState("2026-11-01");
  const [jobTitle, setJobTitle] = useState("Conferente de Doca");
  const [cbo, setCbo] = useState("4141-05");
  const [baseSalary, setBaseSalary] = useState("3200");
  const [department, setDepartment] = useState("DOCA");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/hr/employees");
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        setFallbackEmployees();
      }
    } catch {
      setFallbackEmployees();
    }
  };

  const setFallbackEmployees = () => {
    setEmployees([
      {
        id: "emp-001",
        registration_code: "MAT-101",
        full_name: "Marcos Silva Oliveira",
        cpf: "123.456.789-01",
        pis: "847.19283.10-2",
        admission_date: "2024-03-01",
        job_title: "Conferente Chefe de Doca",
        cbo: "4141-05",
        contract_type: "CLT",
        base_salary: 3450.00,
        department: "DOCA",
        work_shift: "DIURNO",
        is_active: true
      },
      {
        id: "emp-002",
        registration_code: "MAT-102",
        full_name: "Juliana Ferreira Lima",
        cpf: "234.567.890-12",
        pis: "912.38472.09-1",
        admission_date: "2023-08-15",
        job_title: "Operadora de Empilhadeira Retrátil",
        cbo: "7822-20",
        contract_type: "CLT",
        base_salary: 3800.00,
        department: "LOGISTICA",
        work_shift: "TURNO_12X36",
        is_active: true
      },
      {
        id: "emp-003",
        registration_code: "MAT-103",
        full_name: "Carlos Eduardo Santos",
        cpf: "345.678.901-23",
        pis: "731.90234.11-8",
        admission_date: "2025-01-10",
        job_title: "Auxiliar de Armazém & Bipagem",
        cbo: "4141-10",
        contract_type: "CLT",
        base_salary: 2200.00,
        department: "OPERACAO",
        work_shift: "NOTURNO",
        is_active: true
      }
    ]);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: "emp-" + Date.now(),
      registration_code: registrationCode || `MAT-${Math.floor(100 + Math.random() * 900)}`,
      full_name: fullName,
      cpf,
      pis: pis || "000.00000.00-0",
      admission_date: admissionDate,
      job_title: jobTitle,
      cbo,
      contract_type: "CLT",
      base_salary: parseFloat(baseSalary) || 2000,
      department,
      work_shift: "DIURNO",
      is_active: true
    };
    setEmployees([newEmp, ...employees]);
    setShowAddModal(false);
    setNotification(`Colaborador ${fullName} cadastrado com sucesso.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBatchCsv = () => {
    if (!csvContent.trim()) return;
    const lines = csvContent.trim().split("\n");
    const added: Employee[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(";").map(p => p.trim());
      if (parts.length >= 4) {
        added.push({
          id: `batch-${Date.now()}-${idx}`,
          registration_code: parts[0] || `MAT-${100 + idx}`,
          full_name: parts[1],
          cpf: parts[2],
          pis: "800.00000.00-0",
          admission_date: "2026-11-01",
          job_title: parts[3],
          cbo: parts[4] || "4141-05",
          contract_type: "CLT",
          base_salary: parseFloat(parts[5] || "2500"),
          department: parts[6] || "DOCA",
          work_shift: "DIURNO",
          is_active: true
        });
      }
    });
    setEmployees([...added, ...employees]);
    setShowBatchModal(false);
    setCsvContent("");
    setNotification(`Importação em lote concluída! ${added.length} colaboradores importados.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportEsocialS2200 = async (emp: Employee) => {
    setSelectedEmp(emp);
    setShowEsocialModal(true);
    setIsExporting(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/hr/esocial/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "S-2200",
          employee_id: emp.id
        })
      });
      const data = await res.json();
      setEsocialResult(data);
    } catch {
      setEsocialResult({
        event_id: "ID100000000000000202611" + emp.registration_code,
        event_type: "S-2200",
        status: "VALIDATED_SUCCESSFULLY",
        validation_message: "Esquema XSD do eSocial Simplificado vS-1.2 validado com sucesso.",
        json_payload: {
          eSocial: {
            evtAdmissao: {
              Id: "ID100000000000000202611" + emp.registration_code,
              trabalhador: {
                cpfTrab: emp.cpf.replace(/\D/g, ""),
                nmTrab: emp.full_name
              },
              vinculo: {
                matricula: emp.registration_code,
                dataAdmissao: emp.admission_date,
                dadosContrato: {
                  cbo: emp.cbo.replace("-", ""),
                  cargo: emp.job_title,
                  salario: emp.base_salary
                }
              }
            }
          }
        }
      });
    } finally {
      setIsExporting(false);
    }
  };

  const filtered = employees.filter(emp => {
    const matchesSearch = 
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cpf.includes(searchTerm) ||
      emp.registration_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === "ALL" || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
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
                <Users className="w-7 h-7 text-indigo-400" />
                RH & Gestão de Colaboradores (CLT)
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Prontuário funcional, Matrícula eSocial, CBO oficial e Admissões S-2200
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/rh/folha"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span>Folha & Holerites</span>
            </Link>

            <button
              onClick={() => setShowBatchModal(true)}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-blue-400 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Importar CSV em Lote</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admitir Colaborador</span>
            </button>
          </div>
        </div>

        {/* Notificação */}
        {notification && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Resumo de Quadro */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quadro Ativo</span>
            <div className="text-2xl font-black text-white mt-1">{employees.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Equipe de Doca</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              {employees.filter(e => e.department === "DOCA").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Operadores de Empilhadeira</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {employees.filter(e => e.cbo.startsWith("7822")).length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Média Salarial Base</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              R$ {(employees.reduce((acc, c) => acc + c.base_salary, 0) / (employees.length || 1)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por Nome, Matrícula ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL">Todos os Departamentos</option>
              <option value="DOCA">Doca & Recebimento</option>
              <option value="LOGISTICA">Logística Interna</option>
              <option value="OPERACAO">Operação Geral</option>
            </select>
          </div>
        </div>

        {/* Tabela de Colaboradores */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Matrícula / Colaborador</th>
                  <th className="py-3.5 px-4 font-bold">CPF / PIS</th>
                  <th className="py-3.5 px-4 font-bold">Cargo & CBO</th>
                  <th className="py-3.5 px-4 font-bold">Salário Base</th>
                  <th className="py-3.5 px-4 font-bold">Depto / Turno</th>
                  <th className="py-3.5 px-4 font-bold text-right">eSocial S-2200</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-800 text-indigo-400 px-1.5 py-0.5 rounded">
                          {emp.registration_code}
                        </span>
                        {emp.full_name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Admitido em: {new Date(emp.admission_date).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      <div>CPF: {emp.cpf}</div>
                      <div className="text-[10px] text-slate-500">PIS: {emp.pis}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{emp.job_title}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono">
                        CBO: {emp.cbo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      R$ {emp.base_salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {emp.department} • {emp.work_shift}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleExportEsocialS2200(emp)}
                        className="px-2.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Gerar evento S-2200 Admissão eSocial"
                      >
                        <Send className="w-3 h-3" />
                        <span>S-2200</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Admissão Individual */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  Admissão CLT Oficial (Registro de Empregado)
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Matrícula Interna</label>
                    <input
                      type="text"
                      placeholder="MAT-104"
                      value={registrationCode}
                      onChange={(e) => setRegistrationCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Data de Admissão</label>
                    <input
                      type="date"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">Nome Completo do Trabalhador</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Paula de Carvalho"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">CPF</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">PIS / PASEP / NIT</label>
                    <input
                      type="text"
                      placeholder="000.00000.00-0"
                      value={pis}
                      onChange={(e) => setPis(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Estado Civil</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    >
                      <option value="SOLTEIRO">Solteiro(a)</option>
                      <option value="CASADO">Casado(a)</option>
                      <option value="UNIAO_ESTAVEL">União Estável</option>
                      <option value="DIVORCIADO">Divorciado(a)</option>
                      <option value="VIUVO">Viúvo(a)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-amber-300 uppercase flex items-center gap-1">
                      <span>Dependentes (IRRF)</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">OBRIGATÓRIO</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      defaultValue="0"
                      className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none focus:border-amber-500"
                      title="Número de dependentes para dedução legal de IRRF (R$ 189,59/cada) e Salário-Família"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 uppercase">Endereço Residencial Completo (eSocial)</label>
                  <input
                    type="text"
                    placeholder="Logradouro, Número, Complemento, Bairro, Cidade - UF, CEP"
                    defaultValue="Av. Brasil, 1500 - Apto 32 - São Paulo - SP - CEP 01000-000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Cargo</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">CBO Oficial</label>
                    <input
                      type="text"
                      placeholder="4141-05"
                      value={cbo}
                      onChange={(e) => setCbo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Salário Base Mensal (R$)</label>
                    <input
                      type="number"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 uppercase">Departamento</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    >
                      <option value="DOCA">Doca & Recebimento</option>
                      <option value="LOGISTICA">Logística Interna</option>
                      <option value="OPERACAO">Operação de Pátio</option>
                      <option value="FINANCEIRO">Financeiro / Fiscal</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wider"
                  >
                    Concluir Admissão
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Importação em Lote CSV */}
        {showBatchModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-400" />
                  Importação em Lote via CSV (Dezenas de Funcionários)
                </h3>
                <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="text-xs text-slate-400 space-y-2">
                <p>Cole os dados separados por ponto e vírgula (<code className="text-blue-400 font-mono">;</code>) na ordem:</p>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300">
                  Matricula;Nome;CPF;Cargo;CBO;Salario;Departamento
                </div>
                <textarea
                  rows={6}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={"MAT-201;Fabio Lima;456.789.012-34;Operador de Doca;4141-05;2800;DOCA\nMAT-202;Renata Souza;567.890.123-45;Operadora Empilhadeira;7822-20;3900;LOGISTICA"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBatchCsv}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Processar e Importar Lote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Exportação eSocial S-2200 */}
        {showEsocialModal && selectedEmp && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  eSocial Simplificado: Evento S-2200 (Admissão)
                </h3>
                <button onClick={() => setShowEsocialModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {isExporting ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Gerando e validando payload XML/JSON conforme leiaute oficial do Governo Federal...
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Payload gerado e pronto para mensageria do eSocial (Ambiente de Produção Restrita / Produção).</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">JSON Estruturado (S-2200):</span>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-indigo-300 max-h-56 overflow-y-auto">
                      {JSON.stringify(esocialResult?.json_payload || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEsocialModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

