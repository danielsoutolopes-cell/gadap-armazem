"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  DollarSign, 
  Building2, 
  QrCode,
  HelpCircle,
  X
} from "lucide-react";

export default function FechamentoLotePage() {
  const [closures, setClosures] = useState([
    {
      client_id: "b2c3d4e5-0000-0000-0000-000000000002",
      client_name: "Samsung Eletrônica da Amazônia Ltda",
      cnpj: "02.345.678/0001-99",
      period: "2026-11",
      estimated_storage: 7420.00,
      estimated_handling: 1250.00,
      estimated_extras: 360.00,
      total_due: 9030.00,
      status: "READY_TO_CLOSE"
    },
    {
      client_id: "b2c3d4e5-0000-0000-0000-000000000003",
      client_name: "Huawei do Brasil Telecomunicações",
      cnpj: "05.123.456/0001-88",
      period: "2026-11",
      estimated_storage: 4850.00,
      estimated_handling: 800.00,
      estimated_extras: 180.00,
      total_due: 5830.00,
      status: "READY_TO_CLOSE"
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleCloseMonthBatch = async (clientId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/finance/billing/close-month", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          client_id: clientId,
          period_year_month: "2026-11",
          gateway_provider: "ASAAS"
        })
      });
      const data = await res.json();
      setSuccessResult(data);
      setClosures((prev) => prev.filter((c) => c.client_id !== clientId));
    } catch (err: any) {
      alert("Erro ao fechar mês: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Fechamento Financeiro em Lote & Emissão Fiscal
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Consolidação mensal de armazenagem, geração de cobrança (Asaas) e transmissão de NFS-e / NF-e Simbólica
          </p>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl hover:border-slate-700"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Regras Fiscais & CFOP
        </button>
      </header>

      {/* Lista de Fechamento */}
      <div className="space-y-4">
        {closures.map((c) => (
          <div key={c.client_id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <span className="font-bold text-white text-base">{c.client_name}</span>
              <p className="text-xs text-slate-400 font-mono">CNPJ: {c.cnpj} • Competência: {c.period}</p>
              <div className="flex gap-4 text-xs text-slate-400 pt-1">
                <span>Armazenagem: R$ {c.estimated_storage.toFixed(2)}</span>
                <span>Movimentação: R$ {c.estimated_handling.toFixed(2)}</span>
                <span>Extras: R$ {c.estimated_extras.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase">Fatura Total</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  R$ {c.total_due.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleCloseMonthBatch(c.client_id)}
                disabled={isProcessing}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {isProcessing ? "Transmitindo..." : "FECHAR FATURA & EMITIR NF-E"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Card de Sucesso da Emissão */}
      {successResult && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Fatura Fechada e Documentos Fiscais Transmitidos!
            </h3>
            <button onClick={() => setSuccessResult(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-semibold">NFS-e de Serviços (Prefeitura)</span>
              <p className="font-mono font-bold text-white text-sm">{successResult.fiscal_documents.nfse_service.number}</p>
              <p className="text-emerald-400 font-bold">Status: AUTORIZADA</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-semibold">NF-e de Retorno Simbólico (CFOP 5.906)</span>
              <p className="font-mono font-bold text-white text-sm">{successResult.fiscal_documents.nfe_symbolic_return.number}</p>
              <p className="text-emerald-400 font-bold">Status: TRANSMITIDA SEFAZ</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajuda Fiscal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400 uppercase">Diretrizes Tributárias de Armazém Geral</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>NFS-e (Nota de Serviço):</b> Tributa os serviços de armazenagem física, diárias, paletização e movimentação interna (ISSQN).</p>
              <p>• <b>NF-e de Retorno Simbólico (CFOP 5.906 / 6.906):</b> Emissão sem destaque de ICMS que encerra o depósito fiscal da mercadoria quando ela é expedida para terceiros por ordem do depositante.</p>
              <p>• <b>Gateway de Cobrança:</b> Dispara o boleto registrado e a chave Pix Copia e Cola para conciliação bancária automática.</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

