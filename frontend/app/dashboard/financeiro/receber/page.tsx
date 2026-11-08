"use client";

import React, { useState } from "react";
import { 
  ArrowUpCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  QrCode, 
  Building2, 
  HelpCircle, 
  X 
} from "lucide-react";

interface ReceivableTitle {
  id: string;
  client_name: string;
  description: string;
  document_number: string;
  amount: number;
  due_date: string;
  received_date?: string;
  status: "PENDING" | "OVERDUE" | "PAID";
  pix_code?: string;
}

export default function ContasReceberPage() {
  const [receivables, setReceivables] = useState<ReceivableTitle[]>([
    {
      id: "ar-001",
      client_name: "Samsung Eletrônica da Amazônia Ltda",
      description: "Armazenagem Decendial 3º Período + Handling Carga",
      document_number: "FAT-2026/11-0089",
      amount: 7420.00,
      due_date: "15/11/2026",
      status: "PENDING",
      pix_code: "00020126580014br.gov.bcb.pix0136mock_samsung_pix"
    },
    {
      id: "ar-002",
      client_name: "Huawei do Brasil Telecomunicações",
      description: "Fatura Armazenagem Climatizada Módulo 5G",
      document_number: "FAT-2026/10-0045",
      amount: 7430.00,
      due_date: "05/11/2026",
      status: "OVERDUE",
      pix_code: "00020126580014br.gov.bcb.pix0136mock_huawei_pix"
    },
    {
      id: "ar-003",
      client_name: "Bayer CropScience S/A",
      description: "Diárias de Pátio e Desova de Containers",
      document_number: "FAT-2026/11-0092",
      amount: 34050.00,
      due_date: "25/11/2026",
      status: "PENDING",
      pix_code: "00020126580014br.gov.bcb.pix0136mock_bayer_pix"
    },
    {
      id: "ar-004",
      client_name: "LG Electronics do Brasil Ltda",
      description: "Armazenagem Geral e Paletização PBR",
      document_number: "FAT-2026/10-0038",
      amount: 18200.00,
      due_date: "02/11/2026",
      received_date: "02/11/2026",
      status: "PAID"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedPix, setSelectedPix] = useState<string | null>(null);

  const pendingAmount = receivables.filter(r => r.status === "PENDING").reduce((acc, curr) => acc + curr.amount, 0);
  const overdueAmount = receivables.filter(r => r.status === "OVERDUE").reduce((acc, curr) => acc + curr.amount, 0);
  const receivedMonthAmount = receivables.filter(r => r.status === "PAID").reduce((acc, curr) => acc + curr.amount, 0);

  const handleSettle = async (titleId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/finance/cash-flow/receivable/${titleId}/settle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          bill_id: titleId,
          payment_method: "PIX"
        })
      });
      if (!res.ok) throw new Error("Erro na liquidação");
      setReceivables(prev => prev.map(r => r.id === titleId ? { ...r, status: "PAID" as const, received_date: "Hoje" } : r));
      alert("Recebimento confirmado e baixado com sucesso!");
    } catch (err: any) {
      alert("Erro ao baixar recebimento: " + err.message);
    }
  };

  const filtered = receivables.filter(r =>
    r.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.document_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ArrowUpCircle className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Contas a Receber • Faturamento de Clientes
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Controle de liquidação de diárias de armazenagem, serviços extras e sobreestadia de containers
          </p>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl hover:border-slate-700"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Régua de Cobrança & Pix
        </button>
      </header>

      {/* Indicadores / Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>A Receber no Mês</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            R$ {pendingAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 p-5 rounded-2xl space-y-1 bg-rose-500/5">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase">
            <span>Títulos em Atraso</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-500 font-mono">
            R$ {overdueAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Recebido no Mês</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            R$ {receivedMonthAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por Cliente ou Número da Fatura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Tabela de Contas a Receber */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Cliente / Descrição</th>
              <th className="py-4 px-4">Fatura</th>
              <th className="py-4 px-4">Vencimento</th>
              <th className="py-4 px-4 text-right">Valor</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map((r) => {
              const isOverdue = r.status === "OVERDUE";
              const isPaid = r.status === "PAID";
              return (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {r.client_name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{r.description}</div>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs text-slate-300">{r.document_number}</td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-300">{r.due_date}</td>

                  <td className="py-4 px-4 text-right font-mono font-black text-emerald-400 text-base">
                    R$ {r.amount.toFixed(2)}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                      isPaid 
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
                        : isOverdue 
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                        : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    }`}>
                      {isPaid ? "Recebido" : isOverdue ? "Em Atraso" : "Aguardando"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.pix_code && !isPaid && (
                        <button
                          onClick={() => setSelectedPix(r.pix_code || null)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700"
                          title="Ver QR Code Pix"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}

                      {!isPaid ? (
                        <button
                          onClick={() => handleSettle(r.id)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition-all active:scale-95"
                        >
                          Confirmar Baixa
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Recebido em {r.received_date}</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal QR Code Pix */}
      {selectedPix && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400 uppercase">Pix Copia e Cola</h3>
              <button onClick={() => setSelectedPix(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 break-all">
              {selectedPix}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedPix);
                alert("Código Pix copiado para a área de transferência!");
              }}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Copiar Código Pix
            </button>
          </div>
        </div>
      )}

      {/* Modal Ajuda */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400 uppercase">Régua de Contas a Receber (AR)</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>Geração Automática:</b> O faturamento recorrente decendial e o fechamento em lote geram os títulos a receber vinculados a cada depositante.</p>
              <p>• <b>Baixa Automática / Conciliação:</b> Pagamentos liquidados via Pix ou Gateway (Asaas/Stripe) alteram o status do título imediatamente para <b>Recebido</b>.</p>
              <p>• <b>Inadimplência:</b> Lotes de clientes com faturas em atraso podem ter bloqueio de expedição preventiva no pátio.</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
