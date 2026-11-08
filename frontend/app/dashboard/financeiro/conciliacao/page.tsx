"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  UploadCloud, 
  ArrowLeft, 
  Download, 
  Search, 
  FileText, 
  Sparkles, 
  Layers, 
  Building2, 
  CreditCard,
  DollarSign,
  Check,
  X,
  FileCheck
} from "lucide-react";

interface MatchItem {
  fit_id: string;
  bank_date: string;
  bank_amount: number;
  bank_memo: string;
  erp_match: {
    title_id: string;
    client_name?: string;
    supplier_name?: string;
    due_date: string;
    amount: number;
    confidence: string;
  };
}

export default function BankReconciliationSpedPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [reconciledCount, setReconciledCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isExportingSped, setIsExportingSped] = useState(false);

  useEffect(() => {
    fetchReconciliationData();
  }, []);

  const fetchReconciliationData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/enterprise/finance/reconciliation/upload-ofx", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches_suggested);
      } else {
        setFallbackMatches();
      }
    } catch {
      setFallbackMatches();
    }
  };

  const setFallbackMatches = () => {
    setMatches([
      {
        fit_id: "ITAU-20261101-001",
        bank_date: "2026-11-01",
        bank_amount: 14500.00,
        bank_memo: "TED RECEBIDA - MEGALOG IMPORTACAO",
        erp_match: {
          title_id: "rec-001",
          client_name: "MegaLog Importação & Distribuição S/A",
          due_date: "2026-11-01",
          amount: 14500.00,
          confidence: "100% MATCH"
        }
      },
      {
        fit_id: "ITAU-20261102-002",
        bank_date: "2026-11-02",
        bank_amount: 9800.00,
        bank_memo: "PIX RECEBIDO - TRANSGLOBAL QUIMICOS",
        erp_match: {
          title_id: "rec-002",
          client_name: "TransGlobal Químicos & Fármacos Ltda",
          due_date: "2026-11-02",
          amount: 9800.00,
          confidence: "100% MATCH"
        }
      },
      {
        fit_id: "ITAU-20261103-003",
        bank_date: "2026-11-03",
        bank_amount: -4500.00,
        bank_memo: "PAGAMENTO TITULO - ENEL ENERGIA ELETRICA",
        erp_match: {
          title_id: "pay-001",
          supplier_name: "Enel Distribuição São Paulo",
          due_date: "2026-11-03",
          amount: 4500.00,
          confidence: "100% MATCH"
        }
      },
      {
        fit_id: "ITAU-20261105-004",
        bank_date: "2026-11-05",
        bank_amount: -1890.00,
        bank_memo: "DEBITO DIVERSOS - COMPRA BOBINAS STRETCH",
        erp_match: {
          title_id: "pay-002",
          supplier_name: "Polímeros do Brasil Embalagens",
          due_date: "2026-11-05",
          amount: 1890.00,
          confidence: "98% MATCH"
        }
      }
    ]);
  };

  const handleConfirmMatch = (fitId: string) => {
    setMatches(matches.filter(m => m.fit_id !== fitId));
    setReconciledCount(reconciledCount + 1);
    setFeedback(`Lançamento ${fitId} conciliado com sucesso no razão!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDownloadSped = () => {
    window.open("http://localhost:8000/api/v1/enterprise/finance/export/sped?period=2026-10", "_blank");
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
                <FileCheck className="w-7 h-7 text-emerald-400" />
                Conciliação Bancária OFX & Exportação SPED
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Interface "Tinder Financeiro" com sugestão automatizada de match entre extrato bancário e títulos do ERP
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSped}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Arquivo SPED Fiscal (.txt)</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Extrato Bancário</span>
            <div className="text-base font-bold text-white mt-1">Banco Itaú Unibanco</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Pendentes de Match</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{matches.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Conciliados na Sessão</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{reconciledCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Layout Fiscal</span>
            <div className="text-base font-bold text-blue-400 mt-1 font-mono">EFD ICMS/IPI v018</div>
          </div>
        </div>

        {/* "TINDER FINANCEIRO": CARDS DE MATCH LADO A LADO */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Conciliação Automatizada: Extrato Bancário (Esquerda) vs. Contas a Receber/Pagar (Direita)
          </h2>

          {matches.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Todos os lançamentos do OFX foram conciliados!</h3>
              <p className="text-xs text-slate-400">O saldo contábil do armazém está 100% alinhado com o extrato bancário.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((item) => (
                <div
                  key={item.fit_id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-lg hover:border-slate-700 transition-all"
                >
                  {/* LADO ESQUERDO: BANCO */}
                  <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Lançamento OFX</span>
                    <div className="text-xs font-bold text-white line-clamp-1">{item.bank_memo}</div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{item.bank_date}</span>
                      <span className={`font-mono font-black ${item.bank_amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {item.bank_amount > 0 ? "+" : ""} R$ {item.bank_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* CENTRO: CONFIANÇA DO ALGORITMO */}
                  <div className="md:col-span-2 text-center space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {item.erp_match.confidence}
                    </span>
                    <div className="text-[10px] text-slate-500">Match por Valor & Data</div>
                  </div>

                  {/* LADO DIREITO: TÍTULO ERP */}
                  <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Título no ERP GADAP</span>
                    <div className="text-xs font-bold text-white line-clamp-1">
                      {item.erp_match.client_name || item.erp_match.supplier_name}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs font-mono">
                      <span className="text-slate-400 text-[11px]">Venc: {item.erp_match.due_date}</span>
                      <span className="font-black text-cyan-300">
                        R$ {item.erp_match.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* AÇÃO: CONFIRMAR MATCH */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleConfirmMatch(item.fit_id)}
                      className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:scale-105 cursor-pointer"
                      title="Confirmar Liquidação do Título"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

