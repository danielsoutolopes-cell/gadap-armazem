"use client";

import React, { useState } from "react";
import OfficeErpLayout from "@/components/OfficeErpLayout";
import {
  Users,
  Sun,
  UserX,
  Send,
  HardHat,
  Clock,
  DollarSign,
  Calculator,
  CheckCircle,
  AlertTriangle,
  FileText,
  Shield,
  Layers,
  Award,
  Calendar
} from "lucide-react";

export default function HrEnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState<"vacations" | "terminations" | "esocial" | "sst" | "timebank">("vacations");

  // --- STATE DE FÉRIAS ---
  const [vacEmployee, setVacEmployee] = useState("Carlos Silva Oliveira");
  const [vacSalary, setVacSalary] = useState<number>(3850.00);
  const [vacStartDate, setVacStartDate] = useState("2026-12-15");
  const [vacDays, setVacDays] = useState<number>(30);
  const [vacAllowance, setVacAllowance] = useState<number>(0); // Abono pecuniário (venda)
  const [vac13th, setVac13th] = useState(false);
  const [vacCalcResult, setVacCalcResult] = useState<any>(null);

  // --- STATE DE RESCISÃO ---
  const [termEmployee, setTermEmployee] = useState("Juliana Ferreira Lima");
  const [termAdmDate, setTermAdmDate] = useState("2023-04-10");
  const [termDate, setTermDate] = useState("2026-11-08");
  const [termSalary, setTermSalary] = useState<number>(4500.00);
  const [termType, setTermType] = useState("DISPENSA_SEM_JUSTA_CAUSA");
  const [termFgtsBalance, setTermFgtsBalance] = useState<number>(14200.00);
  const [termCalcResult, setTermCalcResult] = useState<any>(null);

  // --- STATE DE SST & EPI ---
  const [epiList, setEpiList] = useState<any[]>([
    { id: "EPI-01", colaborador: "Carlos Silva Oliveira", epi: "Botina de Segurança com Biqueira de Composite", ca: "41.234", data: "15/01/2026", validade: "12 meses", status: "VIGENTE" },
    { id: "EPI-02", colaborador: "Juliana Ferreira Lima", epi: "Colete Refletivo Alta Visibilidade", ca: "38.990", data: "10/02/2026", validade: "24 meses", status: "VIGENTE" },
    { id: "EPI-03", colaborador: "Rodrigo Almeida", epi: "Capacete com Carneira e Jugular", ca: "29.412", data: "05/03/2026", validade: "36 meses", status: "VIGENTE" },
    { id: "EPI-04", colaborador: "Marcos Paulo Souza", epi: "Luva Nitrílica Resistente a Abrasão", ca: "44.510", data: "20/10/2026", validade: "6 meses", status: "VIGENTE" },
  ]);

  // Função Cálculo de Férias
  const handleCalculateVacation = (e: React.FormEvent) => {
    e.preventDefault();
    const dailyRate = vacSalary / 30.0;
    const enjoymentDays = vacDays - vacAllowance;
    const vacationAmount = dailyRate * enjoymentDays;
    const oneThird = vacationAmount / 3.0;
    const allowanceVal = dailyRate * vacAllowance;
    const allowanceOneThird = allowanceVal / 3.0;
    const advance13Val = vac13th ? vacSalary * 0.5 : 0.0;
    
    const taxableBase = vacationAmount + oneThird;
    const inss = taxableBase * 0.11;
    const irrf = Math.max(0, (taxableBase - inss - 2259.20) * 0.15);
    const gross = vacationAmount + oneThird + allowanceVal + allowanceOneThird + advance13Val;
    const net = gross - inss - irrf;

    setVacCalcResult({
      salario: vacSalary,
      diasGozo: enjoymentDays,
      valorFerias: vacationAmount,
      tercoConstitucional: oneThird,
      abonoPecuniario: allowanceVal + allowanceOneThird,
      adiantamento13: advance13Val,
      descontoInss: inss,
      descontoIrrf: irrf,
      totalBruto: gross,
      totalLiquido: net,
      prazoPagamento: "13/12/2026 (Impreterível 2 dias antes do início)"
    });
  };

  // Função Cálculo de Rescisão
  const handleCalculateTermination = (e: React.FormEvent) => {
    e.preventDefault();
    const adm = new Date(termAdmDate);
    const term = new Date(termDate);
    const diffYears = Math.max(0, Math.floor((term.getTime() - adm.getTime()) / (1000 * 60 * 60 * 24 * 365)));
    
    const noticeDays = Math.min(90, 30 + (diffYears * 3));
    const dailySalary = termSalary / 30.0;
    const noticeValue = termType === "DISPENSA_SEM_JUSTA_CAUSA" ? dailySalary * noticeDays : 0;
    const salaryBalance = dailySalary * 8; // 8 dias de novembro
    const prop13th = (termSalary / 12) * 10; // 10 meses
    const propVac = (termSalary / 12) * 10;
    const propVacThird = propVac / 3.0;
    
    const fineRate = termType === "DISPENSA_SEM_JUSTA_CAUSA" ? 0.40 : (termType === "ACORDO" ? 0.20 : 0.0);
    const fgtsFine = termFgtsBalance * fineRate;

    const totalGross = salaryBalance + noticeValue + prop13th + propVac + propVacThird;
    const inss = salaryBalance * 0.09;
    const net = totalGross - inss;

    setTermCalcResult({
      tempoServicoAnos: diffYears,
      diasAviso: noticeDays,
      saldoSalario: salaryBalance,
      avisoIndenizado: noticeValue,
      decimoTerceiroProp: prop13th,
      feriasProp: propVac,
      tercoProp: propVacThird,
      multaFgts: fgtsFine,
      aliquotaMulta: `${fineRate * 100}%`,
      descontoInss: inss,
      totalBruto: totalGross,
      totalLiquido: net,
      prazoPagamento: "10 dias corridos após o término (Art. 477 § 6º CLT)"
    });
  };

  return (
    <OfficeErpLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> RH & HCM ENTERPRISE
              </span>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-xs text-slate-500 font-medium">Padrão Mercado (SAP / TOTVS / Senior)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestão Estratégica de Pessoas & eSocial
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Motor avançado de Férias CLT, Simulador Rescisório (TRCT), Mensageria Oficial eSocial, SST (NR-06/11/35) e Banco de Horas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-right shadow-sm">
              <span className="block text-xs font-semibold text-slate-500 uppercase">Ambiente eSocial</span>
              <span className="text-sm font-bold text-emerald-700 flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> CONECTADO A1
              </span>
            </div>
          </div>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Férias a Vencer (30d)</span>
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">3 Colaboradores</div>
            <p className="text-xs text-amber-600 font-medium mt-1">Evita pagamento em dobro (Art. 137)</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Eventos eSocial</span>
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">100% Homologados</div>
            <p className="text-xs text-blue-600 font-medium mt-1">S-1200 / S-1210 / S-2299 transmitidos</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">EPIs com CA Válido</span>
              <HardHat className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">42 Fichas Assinadas</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Conformidade NR-06 MTE</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Banco de Horas Armazém</span>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">+142h Saldo Total</div>
            <p className="text-xs text-slate-500 font-medium mt-1">2 com vencimento próximo</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("vacations")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "vacations"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Férias CLT & 1/3 Constitucional
          </button>
          <button
            onClick={() => setActiveTab("terminations")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "terminations"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Simulador de Rescisão (TRCT / Multa FGTS)
          </button>
          <button
            onClick={() => setActiveTab("esocial")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "esocial"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Hub Oficial eSocial (Eventos S-1000 a S-2299)
          </button>
          <button
            onClick={() => setActiveTab("sst")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "sst"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            SST & Ficha EPI NR-06
          </button>
          <button
            onClick={() => setActiveTab("timebank")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "timebank"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Banco de Horas & Compensação
          </button>
        </div>

        {/* TAB 1: FÉRIAS */}
        {activeTab === "vacations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" /> Parâmetros de Cálculo de Férias CLT
              </h2>

              <form onSubmit={handleCalculateVacation} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Colaborador</label>
                  <input
                    type="text"
                    value={vacEmployee}
                    onChange={(e) => setVacEmployee(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Salário Base (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={vacSalary}
                      onChange={(e) => setVacSalary(parseFloat(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Início das Férias</label>
                    <input
                      type="date"
                      value={vacStartDate}
                      onChange={(e) => setVacStartDate(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duração Total (Dias)</label>
                    <select
                      value={vacDays}
                      onChange={(e) => setVacDays(parseInt(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
                    >
                      <option value="30">30 Dias (Integral)</option>
                      <option value="20">20 Dias</option>
                      <option value="15">15 Dias (Fracionamento CLT)</option>
                      <option value="10">10 Dias</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Abono Pecuniário (Vender Dias)</label>
                    <select
                      value={vacAllowance}
                      onChange={(e) => setVacAllowance(parseInt(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
                    >
                      <option value="0">Sem Abono (0 dias)</option>
                      <option value="10">Vender 10 dias (Máximo CLT)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="advance13th"
                    checked={vac13th}
                    onChange={(e) => setVac13th(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="advance13th" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Adiantar 1ª Parcela do 13º Salário (50%)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
                >
                  Calcular Recibo Oficial de Férias
                </button>
              </form>
            </div>

            {/* Resultado do Recibo */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Demonstrativo do Recibo de Férias</span>
                {vacCalcResult && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">
                    CONFORME CLT
                  </span>
                )}
              </h2>

              {vacCalcResult ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Remuneração Base:</span>
                      <span className="font-semibold text-slate-800">R$ {vacCalcResult.salario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dias de Gozo Efetivo:</span>
                      <span className="font-semibold text-slate-800">{vacCalcResult.diasGozo} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Provento de Férias ({vacCalcResult.diasGozo}d):</span>
                      <span className="font-semibold text-slate-800">R$ {vacCalcResult.valorFerias.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">1/3 Constitucional (Art. 7º XVII CF):</span>
                      <span className="font-semibold text-emerald-700">+ R$ {vacCalcResult.tercoConstitucional.toFixed(2)}</span>
                    </div>
                    {vacCalcResult.abonoPecuniario > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Abono Pecuniário + 1/3 (Isento de Encargos):</span>
                        <span className="font-semibold text-emerald-700">+ R$ {vacCalcResult.abonoPecuniario.toFixed(2)}</span>
                      </div>
                    )}
                    {vacCalcResult.adiantamento13 > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Adiantamento 50% do 13º Salário:</span>
                        <span className="font-semibold text-blue-700">+ R$ {vacCalcResult.adiantamento13.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                      <span>Total Bruto:</span>
                      <span>R$ {vacCalcResult.totalBruto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Dedução INSS:</span>
                      <span>- R$ {vacCalcResult.descontoInss.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Dedução IRRF:</span>
                      <span>- R$ {vacCalcResult.descontoIrrf.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
                      <span>LÍQUIDO A PAGAR AO COLABORADOR:</span>
                      <span className="text-emerald-700">R$ {vacCalcResult.totalLiquido.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                    <span><strong>Prazo Legal (Art. 145 CLT):</strong> Pagamento até {vacCalcResult.prazoPagamento}.</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Preencha os parâmetros e clique em calcular para gerar o demonstrativo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RESCISÃO */}
        {activeTab === "terminations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserX className="w-5 h-5 text-rose-600" /> Simulador de Desligamento / Rescisão (TRCT)
              </h2>

              <form onSubmit={handleCalculateTermination} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Colaborador</label>
                  <input
                    type="text"
                    value={termEmployee}
                    onChange={(e) => setTermEmployee(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Data de Admissão</label>
                    <input
                      type="date"
                      value={termAdmDate}
                      onChange={(e) => setTermAdmDate(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Data de Desligamento</label>
                    <input
                      type="date"
                      value={termDate}
                      onChange={(e) => setTermDate(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Último Salário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={termSalary}
                      onChange={(e) => setTermSalary(parseFloat(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Saldo Conta FGTS (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={termFgtsBalance}
                      onChange={(e) => setTermFgtsBalance(parseFloat(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motivo do Desligamento</label>
                  <select
                    value={termType}
                    onChange={(e) => setTermType(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="DISPENSA_SEM_JUSTA_CAUSA">Dispensa sem Justa Causa (Aviso Indenizado + Multa 40%)</option>
                    <option value="PEDIDO_DEMISSAO">Pedido de Demissão pelo Empregado</option>
                    <option value="ACORDO">Acordo Consensual (Reforma Trabalhista Art. 484-A CLT)</option>
                    <option value="JUSTA_CAUSA">Demissão com Justa Causa (Art. 482 CLT)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
                >
                  Simular Verbas Rescisórias Oficiais
                </button>
              </form>
            </div>

            {/* Demonstrativo Rescisório */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Termo Rescisório (TRCT Homologado)</span>
                {termCalcResult && (
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded">
                    LEI 12.506 / CLT
                  </span>
                )}
              </h2>

              {termCalcResult ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tempo de Empresa:</span>
                      <span className="font-semibold text-slate-800">{termCalcResult.tempoServicoAnos} anos completos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Aviso Prévio Proporcional:</span>
                      <span className="font-semibold text-slate-800">{termCalcResult.diasAviso} dias (Lei 12.506/11)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Saldo de Salário (8 dias):</span>
                      <span className="font-semibold text-slate-800">R$ {termCalcResult.saldoSalario.toFixed(2)}</span>
                    </div>
                    {termCalcResult.avisoIndenizado > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Aviso Prévio Indenizado:</span>
                        <span className="font-semibold text-emerald-700">+ R$ {termCalcResult.avisoIndenizado.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">13º Salário Proporcional (10/12):</span>
                      <span className="font-semibold text-emerald-700">+ R$ {termCalcResult.decimoTerceiroProp.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Férias Proporcionais + 1/3 (10/12):</span>
                      <span className="font-semibold text-emerald-700">+ R$ {(termCalcResult.feriasProp + termCalcResult.tercoProp).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                      <span>Total Bruto das Verbas:</span>
                      <span>R$ {termCalcResult.totalBruto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Dedução INSS sobre Saldo:</span>
                      <span>- R$ {termCalcResult.descontoInss.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
                      <span>VALOR LÍQUIDO RESCISÓRIO:</span>
                      <span className="text-rose-700">R$ {termCalcResult.totalLiquido.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Guia GRRF (Multa Rescisória {termCalcResult.aliquotaMulta}):</span>
                      <span>R$ {termCalcResult.multaFgts.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      Emitir guia GRRF na Conectividade Social ICP da Caixa Econômica Federal.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Configure a admissão, desligamento e motivo para ver o cálculo rescisório.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ESOCIAL */}
        {activeTab === "esocial" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Painel de Mensageria eSocial Oficial</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Assinatura digital automática com Certificado A1 e transmissão direta aos servidores do Serpro</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded">
                  TRANSMISSÃO AUTOMÁTICA ATIVA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800 text-sm">Eventos Não Periódicos (SST & Cadastros)</div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex justify-between"><span>S-2200 (Admissão):</span> <span className="font-bold text-emerald-700">42 Transmitidos</span></li>
                    <li className="flex justify-between"><span>S-2206 (Alteração Contratual):</span> <span className="font-bold text-emerald-700">8 Transmitidos</span></li>
                    <li className="flex justify-between"><span>S-2220 (Monitoramento ASO):</span> <span className="font-bold text-emerald-700">42 Vigentes</span></li>
                    <li className="flex justify-between"><span>S-2240 (Condições Ambientais):</span> <span className="font-bold text-emerald-700">Laudo Ativo</span></li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800 text-sm">Eventos Periódicos de Folha</div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex justify-between"><span>S-1200 (Remuneração Mensal):</span> <span className="font-bold text-emerald-700">Competência Fechada</span></li>
                    <li className="flex justify-between"><span>S-1210 (Pagamentos Realizados):</span> <span className="font-bold text-emerald-700">Recibo Serpro OK</span></li>
                    <li className="flex justify-between"><span>S-1299 (Fechamento Periódico):</span> <span className="font-bold text-emerald-700">Homologado</span></li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800 text-sm">DCTFWeb & Guias Unificadas</div>
                  <p className="text-slate-600 leading-relaxed">
                    Geração automática da guia DAE / DARF Previdenciário integrando INSS patronal, RAT e terceiros com exportação para o Contas a Pagar.
                  </p>
                  <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
                    Sincronizar Protocolos Serpro
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SST & EPI */}
        {activeTab === "sst" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Livro Eletrônico de EPI & SST (NR-06 / NR-11)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Controle de Certificados de Aprovação (CA) do MTE e assinaturas de entrega</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm">
                  + Registrar Entrega de EPI
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Protocolo</th>
                      <th className="p-3">Colaborador</th>
                      <th className="p-3">Equipamento de Proteção (EPI)</th>
                      <th className="p-3">CA (MTE)</th>
                      <th className="p-3">Data de Entrega</th>
                      <th className="p-3">Validade</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {epiList.map((epi) => (
                      <tr key={epi.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">{epi.id}</td>
                        <td className="p-3 font-semibold text-slate-800">{epi.colaborador}</td>
                        <td className="p-3">{epi.epi}</td>
                        <td className="p-3 font-mono font-bold text-indigo-700">{epi.ca}</td>
                        <td className="p-3">{epi.data}</td>
                        <td className="p-3">{epi.validade}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            {epi.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BANCO DE HORAS */}
        {activeTab === "timebank" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Banco de Horas do Armazém & Prazos de Compensação</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Monitoramento de horas extras acumuladas com alertas preventivos de vencimento</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded">
                  REGIME CONVENÇÃO COLETIVA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-800 text-sm mb-1">Carlos Silva Oliveira</div>
                  <div className="text-slate-500">Operador de Empilhadeira</div>
                  <div className="mt-3 text-2xl font-black text-emerald-700">+18h 45min</div>
                  <div className="text-[11px] text-slate-500 mt-1">Expira em: 31/12/2026 • Status: Regular</div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="font-bold text-amber-900 text-sm mb-1">Juliana Ferreira Lima</div>
                  <div className="text-amber-700">Conferente de Doca</div>
                  <div className="mt-3 text-2xl font-black text-amber-700">+24h 10min</div>
                  <div className="text-[11px] text-amber-800 font-bold mt-1">⚠️ Expira em 30/11/2026 (Compensar Folga)</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-800 text-sm mb-1">Fernando Souza Mendes</div>
                  <div className="text-slate-500">Assistente Logístico</div>
                  <div className="mt-3 text-2xl font-black text-rose-600">-04h 30min</div>
                  <div className="text-[11px] text-slate-500 mt-1">Saldo a compensar pelo colaborador</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </OfficeErpLayout>
  );
}

