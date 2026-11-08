"use client";

import React, { useState } from "react";
import { 
  ArrowDownCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Check, 
  X, 
  HelpCircle,
  Building2
} from "lucide-react";

export default function ContasPagarPage() {
  const [bills, setBills] = useState([
    {
      id: "ap-001",
      description: "Conta de Energia Elétrica - Galpão Principal Santos",
      category_label: "Energia / Água",
      supplier_name: "CPFL Energia S/A",
      document_number: "FAT-CPFL-99120",
      amount: 8450.00,
      due_date: "10/11/2026",
      status: "PENDING",
      payment_method: "BOLETO"
    },
    {
      id: "ap-002",
      description: "Manutenção Preventiva Empilhadeiras Elétricas",
      category_label: "Manutenção",
      supplier_name: "Hyster-Yale Brasil Máquinas",
      document_number: "NF-88219",
      amount: 3200.00,
      due_date: "04/11/2026",
      status: "OVERDUE",
      payment_method: "TED"
    },
    {
      id: "ap-003",
      description: "Lote de 200 Paletes de Madeira PBR Tratados",
      category_label: "Insumos Doca",
      supplier_name: "Paletes Brasil Ltda",
      document_number: "NF-12093",
      amount: 6800.00,
      due_date: "20/11/2026",
      status: "PENDING",
      payment_method: "PIX"
    },
    {
      id: "ap-004",
      description: "Aluguel Mensal Galpão Setor Portuário",
      category_label: "Locação",
      supplier_name: "Santos Port Properties FII",
      document_number: "LOC-2026-11",
      amount: 25000.00,
      due_date: "05/11/2026",
      status: "PAID",
      payment_date: "05/11/2026",
      payment_method: "TED"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const pendingAmount = bills.filter(b => b.status === "PENDING").reduce((acc, curr) => acc + curr.amount, 0);
  const overdueAmount = bills.filter(b => b.status === "OVERDUE").reduce((acc, curr) => acc + curr.amount, 0);
  const paidMonthAmount = bills.filter(b => b.status === "PAID").reduce((acc, curr) => acc + curr.amount, 0);

  const handleSettle = async (billId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/finance/cash-flow/payable/${billId}/settle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          bill_id: billId,
          payment_method: "PIX"
        })
      });
      if (!res.ok) throw new Error("Erro na liquidação");
      setBills(prev => prev.map(b => b.id === billId ? { ...b, status: "PAID", payment_date: "Hoje" } : b));
      alert("Título liquidado com sucesso!");
    } catch (err: any) {
      alert("Erro ao baixar título: " + err.message);
    }
  };

  const filtered = bills.filter(b =>
    b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ArrowDownCircle className="w-8 h-8 text-rose-500" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Contas a Pagar • Despesas do Galpão
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de despesas fixas, manutenção de frotas, contas de concessionárias e insumos operacionais
          </p>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl hover:border-slate-700"
        >
          <HelpCircle className="w-4 h-4 text-rose-400" />
          Ajuda & Critérios de Baixa
        </button>
      </header>

      {/* Indicadores / Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>A Vencer</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            R$ {pendingAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 p-5 rounded-2xl space-y-1 bg-rose-500/5">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase">
            <span>Títulos Vencidos</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-500 font-mono">
            R$ {overdueAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Pagos no Mês</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            R$ {paidMonthAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por Fornecedor ou Descrição da Despesa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Tabela de Contas a Pagar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Descrição / Fornecedor</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-4">Vencimento</th>
              <th className="py-4 px-4 text-right">Valor</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map((b) => {
              const isOverdue = b.status === "OVERDUE";
              const isPaid = b.status === "PAID";
              return (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{b.description}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{b.supplier_name} • {b.document_number}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {b.category_label}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs text-slate-300">{b.due_date}</td>

                  <td className="py-4 px-4 text-right font-mono font-black text-rose-400 text-base">
                    R$ {b.amount.toFixed(2)}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                      isPaid 
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
                        : isOverdue 
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                        : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    }`}>
                      {isPaid ? "Liquidado" : isOverdue ? "Vencido" : "A Vencer"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    {!isPaid ? (
                      <button
                        onClick={() => handleSettle(b.id)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all active:scale-95"
                      >
                        Dar Baixa
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">Pago em {b.payment_date}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Ajuda */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-rose-400 uppercase">Gestão de Contas a Pagar (AP)</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>Status Vencido:</b> Títulos com vencimento anterior à data de hoje acendem alerta vermelho de sobrecusto com juros de mora.</p>
              <p>• <b>Dar Baixa:</b> Registra o débito no razão contábil e deduz o saldo do fluxo de caixa do galpão.</p>
              <p>• <b>Conciliação de Compras:</b> Despesas com paletes e filme stretch alimentam o custo operacional das docas.</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-lg text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

