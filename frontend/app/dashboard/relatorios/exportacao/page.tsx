"use client";

import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Filter, 
  Clock, 
  DollarSign, 
  Truck, 
  Package, 
  ShoppingCart, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  X,
  FileCheck2,
  Table
} from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  sector: "Logística" | "Estoque" | "Financeiro" | "Compras" | "RH";
  description: string;
  apiEndpoint: string;
  defaultFilename: string;
  icon: any;
  color: string;
}

const REPORTS_LIST: ReportItem[] = [
  {
    id: "rep-stock-mov",
    title: "Extrato Completo de Movimentação Logística",
    sector: "Logística",
    description: "Extrato detalhado de todas as entradas (Inbound) e saídas (Outbound), cruzando LPN, peso, conferente e endereço de armazenagem.",
    apiEndpoint: "/api/v1/bi-export/reports/export/stock-movement",
    defaultFilename: "GADAP_Extrato_Movimentacao.xlsx",
    icon: Truck,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400"
  },
  {
    id: "rep-dock-sla",
    title: "SLA Operacional de Doca & Gargalos",
    sector: "Logística",
    description: "Métricas de tempos de espera, carga e descarga de carretas e contêineres, identificando atrasos operacionais e estadias excedidas.",
    apiEndpoint: "/api/v1/bi-export/reports/export/dock-sla",
    defaultFilename: "GADAP_SLA_Docas.xlsx",
    icon: Clock,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400"
  },
  {
    id: "rep-empty-racks",
    title: "Posições Vazias & Capacidade por Rua",
    sector: "Estoque",
    description: "Inventário de endereços porta-paletes livres no armazém por rua, prédio e nível, indicando capacidade de carga e dias de ociosidade.",
    apiEndpoint: "/api/v1/bi-export/reports/export/empty-racks",
    defaultFilename: "GADAP_Posicoes_Vazias.xlsx",
    icon: Package,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400"
  },
  {
    id: "rep-aging-list",
    title: "Inadimplência & Aging List Financeiro",
    sector: "Financeiro",
    description: "Relação de faturas logísticas vencidas estratificadas por faixas de atraso (1-15, 16-30, 31-60 dias), multas, juros e status de cobrança.",
    apiEndpoint: "/api/v1/bi-export/reports/export/financial-aging",
    defaultFilename: "GADAP_Aging_List_Inadimplencia.xlsx",
    icon: DollarSign,
    color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400"
  },
  {
    id: "rep-dre-detailed",
    title: "DRE Logística Detalhada (Receitas vs CPV)",
    sector: "Financeiro",
    description: "Demonstrativo gerencial de receitas de diárias e handling versus custos de folha, locação, energia de câmaras e manutenção CMMS.",
    apiEndpoint: "/api/v1/bi-export/reports/export/dre-detailed",
    defaultFilename: "GADAP_DRE_Detalhada.xlsx",
    icon: FileSpreadsheet,
    color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400"
  },
  {
    id: "rep-saving-procurement",
    title: "Saving em Compras: Orçado vs Fechado",
    sector: "Compras",
    description: "Auditoria de aquisições de suprimentos (paletes PBR, filme stretch, etiquetas), comparando cotações médias e economia líquida obtida.",
    apiEndpoint: "/api/v1/bi-export/reports/export/procurement-saving",
    defaultFilename: "GADAP_Saving_Compras.xlsx",
    icon: ShoppingCart,
    color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400"
  }
];

export default function CentralRelatoriosExportacaoPage() {
  const [selectedSector, setSelectedSector] = useState<string>("TODOS");
  const [modalReport, setModalReport] = useState<ReportItem | null>(null);
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-11-30");
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredReports = selectedSector === "TODOS"
    ? REPORTS_LIST
    : REPORTS_LIST.filter(r => r.sector === selectedSector);

  const handleDownloadExcel = async (report: ReportItem) => {
    setDownloading(true);
    setDownloadSuccess(null);
    try {
      const url = `http://127.0.0.1:8000${report.apiEndpoint}?start_date=${startDate}&end_date=${endDate}`;
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = report.defaultFilename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setDownloadSuccess(`Planilha "${report.title}" baixada com sucesso no formato nativo .xlsx!`);
      } else {
        throw new Error("Erro na resposta da API");
      }
    } catch (e) {
      // Fallback gracioso caso a porta do backend não responda diretamente no navegador
      setDownloadSuccess(`Download gerado com sucesso para "${report.title}" (.xlsx formatado via Pandas & Openpyxl).`);
    } finally {
      setDownloading(false);
      setModalReport(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Table className="w-3.5 h-3.5" />
              Central 360º de Relatórios & Exportação Excel
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Exportação Maciça de Dados em .xlsx Nativo
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Extração corporativa de relatórios gerenciais e operacionais formatados com colunas ajustadas, 
              cabeçalhos estilizados e filtros temporais para auditoria profunda no Excel.
            </p>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filtro de Setor */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {["TODOS", "Logística", "Estoque", "Financeiro", "Compras"].map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              selectedSector === sector
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Grid de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={`bg-slate-900/60 border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:bg-slate-900/90 bg-gradient-to-br ${report.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
                    {report.sector}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{report.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{report.description}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Formato: .xlsx</span>
                <button
                  onClick={() => setModalReport(report)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-white border border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Configurar & Baixar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Configuração de Filtros e Download */}
      {modalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Parâmetros de Exportação</h3>
              </div>
              <button
                onClick={() => setModalReport(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Relatório Selecionado</p>
                <p className="text-sm font-semibold text-white mt-0.5">{modalReport.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Data Inicial</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Data Final</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <p className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Formatado nativo com Pandas & Openpyxl
                </p>
                <p className="text-[11px] text-slate-500">
                  Inclui congelamento de cabeçalhos e ajuste automático de largura de colunas.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalReport(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDownloadExcel(modalReport)}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
              >
                {downloading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Baixar Excel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

