"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Package, 
  FileText, 
  Download, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  HelpCircle,
  X
} from "lucide-react";

export default function PortalClientePage() {
  const [activeTab, setActiveTab] = useState<"cargas" | "faturas">("cargas");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [data] = useState({
    client_name: "Samsung Eletrônica da Amazônia Ltda",
    cnpj: "02.345.678/0001-99",
    summary: {
      stored_volumes: 482,
      quarantine_lots: 1,
      dispatched_this_month: 1240,
      open_invoices_amount: 14850.00
    },
    active_lots: [
      {
        id: "a1b2c3d4-1111-4444-8888-000000000001",
        document_number: "DI-24/0987654-1",
        received_volumes: 118,
        expected_volumes: 120,
        status: "QUARANTINE",
        status_label: "Quarentena Fiscal (Divergência de 2 volumes)",
        gate_in_date: "04/11/2026",
        has_damage_photo: true
      },
      {
        id: "f5e4d3c2-2222-4444-8888-000000000002",
        document_number: "DI-24/0765432-8",
        received_volumes: 364,
        expected_volumes: 364,
        status: "STORED",
        status_label: "Armazenado e Disponível para Expedição",
        gate_in_date: "28/10/2026",
        has_damage_photo: false
      }
    ],
    invoices: [
      {
        invoice_number: "FAT-2026/11-0089",
        period: "21/10/2026 a 31/10/2026 (3º Decêndio)",
        amount: 7420.00,
        status: "PENDING",
        due_date: "15/11/2026"
      },
      {
        invoice_number: "FAT-2026/10-0045",
        period: "11/10/2026 a 20/10/2026 (2º Decêndio)",
        amount: 7430.00,
        status: "PAID",
        due_date: "05/11/2026"
      }
    ]
  });

  const handleDownloadReport = () => {
    window.open("http://localhost:8000/api/v1/b2b/portal/report/export-pdf", "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header B2B */}
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                Portal do Depositante B2B
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {data.client_name} • CNPJ: {data.cnpj}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 rounded-xl"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Ajuda do Portal
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            Exportar Posição (PDF)
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Volumes Estocados</span>
          <p className="text-2xl font-black text-white mt-1">{data.summary.stored_volumes} vol</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Lotes em Quarentena</span>
          <p className="text-2xl font-black text-rose-500 mt-1">{data.summary.quarantine_lots} lote</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Expedidos no Mês</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{data.summary.dispatched_this_month} vol</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Faturas a Vencer</span>
          <p className="text-2xl font-black text-amber-400 mt-1">R$ {data.summary.open_invoices_amount.toFixed(2)}</p>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("cargas")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "cargas" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400"
          }`}
        >
          Minhas Cargas & Rastreabilidade
        </button>
        <button
          onClick={() => setActiveTab("faturas")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "faturas" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400"
          }`}
        >
          Faturas de Armazenagem & Decêndios
        </button>
      </div>

      {/* Conteúdo Aba Cargas */}
      {activeTab === "cargas" && (
        <div className="space-y-4">
          {data.active_lots.map((lot) => {
            const isQuarantine = lot.status === "QUARANTINE";
            return (
              <div
                key={lot.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isQuarantine
                    ? "bg-rose-950/20 border-rose-500/40"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-black text-white">{lot.document_number}</span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                          isQuarantine ? "bg-rose-600 text-white" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {isQuarantine ? "Quarentena Fiscal" : "Disponível"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{lot.status_label}</p>
                    <p className="text-[11px] text-slate-500">Entrada no Galpão: {lot.gate_in_date}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Volumes</span>
                      <span className="font-mono font-bold text-white text-base">
                        {lot.received_volumes} / {lot.expected_volumes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conteúdo Aba Faturas */}
      {activeTab === "faturas" && (
        <div className="space-y-4">
          {data.invoices.map((inv) => (
            <div key={inv.invoice_number} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-white text-base">{inv.invoice_number}</span>
                <p className="text-xs text-slate-400">{inv.period}</p>
                <p className="text-[11px] text-slate-500">Vencimento: {inv.due_date}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-lg font-black text-amber-400">R$ {inv.amount.toFixed(2)}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  inv.status === "PAID" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                }`}>
                  {inv.status === "PAID" ? "Pago" : "Aguardando Pagamento"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajuda do Portal B2B */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-cyan-400 uppercase">Guia de Autoatendimento B2B</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>Quarentena Fiscal:</b> Lotes em vermelho sofreram bloqueio do 3-Way Match devido a divergência com a Declaração de Importação.</p>
              <p>• <b>Exportação de Posição:</b> Gere relatórios em PDF atualizados para fins de auditoria interna ou contabilidade.</p>
              <p>• <b>Decêndios de Armazenagem:</b> As cobranças ocorrem por períodos de 10 dias com base no valor CIF e peso bruto da carga.</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

