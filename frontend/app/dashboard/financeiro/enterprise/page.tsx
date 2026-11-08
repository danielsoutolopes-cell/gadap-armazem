"use client";

import React, { useState } from "react";
import OfficeErpLayout from "@/components/OfficeErpLayout";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Landmark,
  QrCode,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  FileText,
  Clock,
  PieChart,
  RefreshCw,
  Wallet
} from "lucide-react";

export default function FinanceEnterprisePage() {
  const [activeTab, setActiveTab] = useState<"cashflow" | "dre" | "cnab" | "pix" | "budget">("cashflow");

  // State PIX Dinâmico
  const [pixDoc, setPixDoc] = useState("FAT-2026-9812");
  const [pixPayer, setPixPayer] = useState("Sams Logística Global S.A.");
  const [pixCnpj, setPixCnpj] = useState("04.123.456/0001-99");
  const [pixAmount, setPixAmount] = useState<number>(14850.00);
  const [pixGenerated, setPixGenerated] = useState<any>(null);

  // State CNAB
  const [selectedBank, setSelectedBank] = useState("341");
  const [cnabType, setCnabType] = useState("RETORNO");
  const [cnabResult, setCnabResult] = useState<any>(null);
  const [processingCnab, setProcessingCnab] = useState(false);

  // State Alçada de Orçamento
  const [costCenter, setCostCenter] = useState("CC-LOG-01");
  const [requestedAmount, setRequestedAmount] = useState<number>(18500.00);
  const [budgetEval, setBudgetEval] = useState<any>(null);

  const handleGeneratePix = (e: React.FormEvent) => {
    e.preventDefault();
    const txid = `GADAP${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const emvPayload = `00020101021226580014br.gov.bcb.pix2536api.gadap.com.br/pix/v2/${txid}520400005303986540${pixAmount.toFixed(2)}5802BR5913GADAP ARMAZEM6006SANTOS62070503***6304`;
    setPixGenerated({
      txid,
      documento: pixDoc,
      pagador: pixPayer,
      valor: pixAmount,
      payload: emvPayload,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(emvPayload)}`
    });
  };

  const handleProcessCnab = () => {
    setProcessingCnab(true);
    setTimeout(() => {
      setCnabResult({
        lote: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        banco: selectedBank === "341" ? "341 - Itaú Unibanco" : (selectedBank === "001" ? "001 - Banco do Brasil" : "237 - Bradesco"),
        totalTitulos: 32,
        baixadosSucesso: 30,
        rejeitados: 2,
        valorCreditado: 218450.80,
        tarifas: 98.40,
        status: "BAIXA AUTOMÁTICA CONCLUÍDA EM CONTA"
      });
      setProcessingCnab(false);
    }, 700);
  };

  const handleEvaluateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const available = costCenter === "CC-LOG-01" ? 21600.00 : (costCenter === "CC-MAINT-03" ? 1100.00 : 17900.00);
    const approved = requestedAmount <= available;
    setBudgetEval({
      centro: costCenter,
      valor: requestedAmount,
      disponivel: available,
      aprovado: approved,
      decisao: approved ? "APROVADO AUTOMATICAMENTE" : "REQUER ALÇADA DA DIRETORIA FINANCEIRA",
      parecer: approved
        ? `Despesa de R$ ${requestedAmount.toFixed(2)} está dentro da verba remanescente de R$ ${available.toFixed(2)}.`
        : `Despesa excede a verba remanescente em R$ ${(requestedAmount - available).toFixed(2)}. Alçada escalonada.`
    });
  };

  return (
    <OfficeErpLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> CONTROLADORIA & TESOURARIA ENTERPRISE
              </span>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-xs text-slate-500 font-medium">Padrão Mercado (SAP S/4HANA / Oracle NetSuite)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestão Financeira Estratégica & Tesouraria
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Fluxo de Caixa Preditivo D+30/60/90, DRE Contábil com EBITDA, Motor CNAB 240/400, PIX Dinâmico e Controle Orçamentário por Alçada.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-right shadow-sm">
              <span className="block text-xs font-semibold text-slate-500 uppercase">Saldo de Caixa Disponível</span>
              <span className="text-lg font-black text-emerald-700">R$ 348.520,80</span>
            </div>
          </div>
        </div>

        {/* Indicadores Topo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">EBITDA do Exercício</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">R$ 368.700</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Margem EBITDA: 58.6% da receita</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Projeção Caixa (D+30)</span>
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">+ R$ 412.300</div>
            <p className="text-xs text-blue-600 font-medium mt-1">Liquidez segura sem necessidade de crédito</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Cobrança PIX Bacen</span>
              <QrCode className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">Liquidação D+0</div>
            <p className="text-xs text-purple-600 font-medium mt-1">Webhook automático de conciliação</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Intercâmbio CNAB</span>
              <Landmark className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">100% FEBRABAN</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Layouts 240 e 400 integrados</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("cashflow")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "cashflow"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Fluxo de Caixa Preditivo (D+30)
          </button>
          <button
            onClick={() => setActiveTab("dre")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "dre"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            DRE Gerencial & EBITDA
          </button>
          <button
            onClick={() => setActiveTab("cnab")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "cnab"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Motor CNAB 240/400 (Remessa & Retorno)
          </button>
          <button
            onClick={() => setActiveTab("pix")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "pix"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            PIX Dinâmico com QR Code Bacen
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "budget"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Orçamento & Alçadas por Centro de Custo
          </button>
        </div>

        {/* TAB 1: FLUXO DE CAIXA PREDITIVO */}
        {activeTab === "cashflow" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Projeção de Tesouraria e Liquidez Diária (Próximos 15 Dias)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Cruza contas a receber com taxa de inadimplência, folha, contas a pagar e calendário fiscal</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded font-semibold">
                    Índice de Liquidez: 2.45 (Excelente)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Data Prevista</th>
                      <th className="p-3">Entradas (AR)</th>
                      <th className="p-3">Fornecedores (AP)</th>
                      <th className="p-3">Impostos / Folha</th>
                      <th className="p-3">Saldo Líquido Dia</th>
                      <th className="p-3">Saldo Final Acumulado</th>
                      <th className="p-3">Status Liquidez</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">09/11/2026 (Segunda)</td>
                      <td className="p-3 text-emerald-700 font-bold">+ R$ 23.350,00</td>
                      <td className="p-3 text-rose-600">- R$ 9.820,00</td>
                      <td className="p-3 text-slate-400">R$ 0,00</td>
                      <td className="p-3 font-bold text-emerald-700">+ R$ 13.530,00</td>
                      <td className="p-3 font-black text-slate-900">R$ 362.050,80</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">SEGURA</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">10/11/2026 (Terça)</td>
                      <td className="p-3 text-emerald-700 font-bold">+ R$ 24.300,00</td>
                      <td className="p-3 text-rose-600">- R$ 10.440,00</td>
                      <td className="p-3 text-slate-400">R$ 0,00</td>
                      <td className="p-3 font-bold text-emerald-700">+ R$ 13.860,00</td>
                      <td className="p-3 font-black text-slate-900">R$ 375.910,80</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">SEGURA</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-amber-50/40">
                      <td className="p-3 font-semibold text-slate-800">15/11/2026 (Pico Fiscal)</td>
                      <td className="p-3 text-emerald-700 font-bold">+ R$ 18.200,00</td>
                      <td className="p-3 text-rose-600">- R$ 8.100,00</td>
                      <td className="p-3 text-rose-700 font-bold">- R$ 28.400,00 (DARF/ISS)</td>
                      <td className="p-3 font-bold text-rose-600">- R$ 18.300,00</td>
                      <td className="p-3 font-black text-slate-900">R$ 357.610,80</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">COBERTA</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-rose-50/30">
                      <td className="p-3 font-semibold text-slate-800">20/11/2026 (Pico DCTFWeb)</td>
                      <td className="p-3 text-emerald-700 font-bold">+ R$ 29.500,00</td>
                      <td className="p-3 text-rose-600">- R$ 12.300,00</td>
                      <td className="p-3 text-rose-700 font-bold">- R$ 34.800,00 (Previdenciário)</td>
                      <td className="p-3 font-bold text-rose-600">- R$ 17.600,00</td>
                      <td className="p-3 font-black text-slate-900">R$ 340.010,80</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">SEGURA</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DRE GERENCIAL */}
        {activeTab === "dre" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">DRE Estruturada & Indicadores EBITDA (Competência 10/2026)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Visão vertical e analítica das margens de contribuição e lucratividade líquida</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded">
                  REGIME DE COMPETÊNCIA CONTÁBIL
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-2 font-bold text-slate-900 text-sm">
                  <span>1. RECEITA OPERACIONAL BRUTA</span>
                  <span>R$ 684.200,00 <span className="text-xs text-slate-500 font-normal">(100%)</span></span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Tributos sobre Vendas e Serviços (ISS, PIS, COFINS)</span>
                  <span className="text-rose-600">- R$ 54.736,00 (8.0%)</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-slate-900">
                  <span>2. RECEITA OPERACIONAL LÍQUIDA</span>
                  <span>R$ 629.464,00 (100.0%)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Custos dos Serviços Prestados - CSP (Mão de Obra, Energia, Locação de Empilhadeiras)</span>
                  <span className="text-rose-600">- R$ 220.700,00 (35.1%)</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-slate-900 bg-slate-50 px-2 rounded">
                  <span>3. LUCRO BRUTO OPERACIONAL</span>
                  <span className="text-emerald-700">R$ 408.764,00 (Margem Bruta: 64.9%)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Despesas Operacionais Administrativas, Comerciais e TI</span>
                  <span className="text-rose-600">- R$ 82.400,00 (13.1%)</span>
                </div>
                <div className="flex justify-between py-2 font-black text-slate-900 bg-emerald-50 px-3 py-2.5 rounded-lg border border-emerald-200 text-sm">
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-600" /> 4. EBITDA / LAJIDA OFICIAL</span>
                  <span className="text-emerald-800">R$ 326.364,00 (Margem EBITDA: 51.8%)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Depreciação e Amortizações</span>
                  <span className="text-rose-600">- R$ 18.200,00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(+/-) Resultado Financeiro Líquido</span>
                  <span className="text-rose-600">- R$ 6.400,00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Provisão IRPJ / CSLL (Lucro Real)</span>
                  <span className="text-rose-600">- R$ 42.100,00</span>
                </div>
                <div className="flex justify-between py-3 font-black text-slate-900 bg-slate-900 text-white px-4 rounded-lg text-sm">
                  <span>5. LUCRO LÍQUIDO DO EXERCÍCIO</span>
                  <span className="text-emerald-400">R$ 259.664,00 (Margem Líquida: 41.2%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CNAB 240 / 400 */}
        {activeTab === "cnab" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" /> Processador de Lotes Bancários CNAB
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instituição Bancária</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="341">341 - Itaú Unibanco S.A.</option>
                    <option value="001">001 - Banco do Brasil S.A.</option>
                    <option value="237">237 - Banco Bradesco S.A.</option>
                    <option value="033">033 - Banco Santander Brasil</option>
                    <option value="756">756 - Banco Cooperativo Sicoob</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Padrão FEBRABAN</label>
                    <select className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white">
                      <option value="CNAB_240">CNAB 240 (Multiserviço)</option>
                      <option value="CNAB_400">CNAB 400 (Cobrança Clássica)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Movimento</label>
                    <select
                      value={cnabType}
                      onChange={(e) => setCnabType(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
                    >
                      <option value="RETORNO">Arquivo RETORNO (Baixas)</option>
                      <option value="REMESSA">Arquivo REMESSA (Cobrança)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700">Arraste o arquivo .RET / .REM bancário</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ou selecione para processamento em lote</p>
                </div>

                <button
                  type="button"
                  onClick={handleProcessCnab}
                  disabled={processingCnab}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
                >
                  {processingCnab ? "Processando e Conciliando Lote..." : "Processar Arquivo Bancário"}
                </button>
              </div>
            </div>

            {/* Resultado do Processamento */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Relatório de Conciliação CNAB</span>
                {cnabResult && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">
                    BAIXA EM D+0
                  </span>
                )}
              </h2>

              {cnabResult ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Protocolo de Lote:</span>
                      <span className="font-mono font-bold text-slate-800">{cnabResult.lote}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Banco:</span>
                      <span className="font-semibold text-slate-800">{cnabResult.banco}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Títulos Processados:</span>
                      <span className="font-bold text-slate-900">{cnabResult.totalTitulos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Títulos Liquidados com Sucesso:</span>
                      <span className="font-bold text-emerald-700">{cnabResult.baixadosSucesso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ocorrências de Rejeição:</span>
                      <span className="font-bold text-rose-600">{cnabResult.rejeitados}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                      <span>Valor Total Creditado em Conta:</span>
                      <span className="text-emerald-700">R$ {cnabResult.valorCreditado.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Baixas integradas automaticamente ao Contas a Receber (AR) e ao Extrato Bancário.</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Selecione o banco e clique em processar para simular a conciliação automática.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PIX DINÂMICO */}
        {activeTab === "pix" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" /> Emissor de Cobrança PIX Bacen (EMV)
              </h2>

              <form onSubmit={handleGeneratePix} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fatura / Documento</label>
                  <input
                    type="text"
                    value={pixDoc}
                    onChange={(e) => setPixDoc(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cliente / Pagador</label>
                    <input
                      type="text"
                      value={pixPayer}
                      onChange={(e) => setPixPayer(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CNPJ / CPF</label>
                    <input
                      type="text"
                      value={pixCnpj}
                      onChange={(e) => setPixCnpj(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valor da Cobrança (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pixAmount}
                    onChange={(e) => setPixAmount(parseFloat(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
                >
                  Gerar QR Code PIX Dinâmico (Bacen)
                </button>
              </form>
            </div>

            {/* Exibição QR Code */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
              <h2 className="text-base font-bold text-slate-900 mb-4">QR Code de Pagamento Instantâneo</h2>

              {pixGenerated ? (
                <div className="space-y-4">
                  <div className="inline-block p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <img src={pixGenerated.qrUrl} alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                  </div>
                  <div className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded border border-slate-200 break-all text-left">
                    <span className="font-bold text-slate-800 block mb-1">Chave Copia e Cola:</span>
                    {pixGenerated.payload}
                  </div>
                  <div className="flex justify-between items-center text-xs p-3 bg-purple-50 text-purple-900 rounded-lg border border-purple-200">
                    <span>Identificador TxID: <strong>{pixGenerated.txid}</strong></span>
                    <span className="font-bold text-emerald-700">AGUARDANDO WEBHOOK (D+0)</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Informe os dados da fatura para gerar o QR Code Dinâmico do Banco Central.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ORÇAMENTO & ALÇADAS */}
        {activeTab === "budget" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Validador de Alçadas & Centro de Custo
              </h2>

              <form onSubmit={handleEvaluateBudget} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Centro de Custo Solicitante</label>
                  <select
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="CC-LOG-01">CC-LOG-01 • Operações de Pátio e Armazenagem (Saldo: R$ 21.600)</option>
                    <option value="CC-ADM-02">CC-ADM-02 • Administração Central e Jurídico (Saldo: R$ 17.900)</option>
                    <option value="CC-MAINT-03">CC-MAINT-03 • Manutenção Predial e Frotas (Saldo: R$ 1.100)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valor da Despesa / Requisição (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(parseFloat(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
                >
                  Verificar Alçada de Aprovação
                </button>
              </form>
            </div>

            {/* Parecer Alçada */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Parecer da Controladoria</h2>

              {budgetEval ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Centro de Custo:</span>
                      <span className="font-bold text-slate-800">{budgetEval.centro}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valor Solicitado:</span>
                      <span className="font-semibold text-slate-800">R$ {budgetEval.valor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Saldo Orçamentário Remanescente:</span>
                      <span className="font-semibold text-emerald-700">R$ {budgetEval.disponivel.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm">
                      <span>Decisão de Alçada:</span>
                      <span className={budgetEval.aprovado ? "text-emerald-700" : "text-amber-600"}>
                        {budgetEval.decisao}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs ${budgetEval.aprovado ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                    <span className="font-semibold">Parecer:</span> {budgetEval.parecer}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Submeta uma despesa para testar o travamento automático de orçamento.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </OfficeErpLayout>
  );
}
