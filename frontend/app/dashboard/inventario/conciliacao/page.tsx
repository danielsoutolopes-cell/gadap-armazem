"use client";

import React, { useState } from "react";
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  Filter, 
  RefreshCw,
  Building2,
  HelpCircle,
  X
} from "lucide-react";

export default function ConciliacaoInventarioPage() {
  const [items, setItems] = useState([
    {
      id: "11111111-2222-3333-4444-555555555551",
      audit_number: "AUD-ABC-A-2026110701",
      abc_category: "A",
      sku: "SAM-DISP-AMOLED-65",
      description: "Display AMOLED 6.5 Pol - Samsung",
      position: "RUA01-P02-N1",
      expected_qty: 100.0,
      blind_counted_qty: 97.0,
      difference_qty: -3.0,
      status: "DIVERGENT",
      alert: "QUEBRA DE ESTOQUE (-3 UN)",
      counted_at: "Hoje às 15:30"
    },
    {
      id: "11111111-2222-3333-4444-555555555552",
      audit_number: "AUD-ABC-A-2026110702",
      abc_category: "A",
      sku: "HUA-MOD-5G-ANT",
      description: "Módulo Transmissor 5G Huawei",
      position: "RUA02-P04-N2",
      expected_qty: 40.0,
      blind_counted_qty: 42.0,
      difference_qty: 2.0,
      status: "DIVERGENT",
      alert: "SOBRA FÍSICA (+2 UN)",
      counted_at: "Hoje às 16:10"
    }
  ]);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  const handleApprove = async (auditId: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/logistics/inventory/audits/reconciliation/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          audit_id: auditId,
          adjustment_reason: "Ajuste de inventário rotativo aprovado pelo auditor fiscal."
        })
      });
      if (!res.ok) throw new Error("Erro na aprovação fiscal");
      setItems((prev) => prev.filter((i) => i.id !== auditId));
      alert("Ajuste fiscal e conciliação aprovados no ERP!");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Conciliação de Inventário Cego • Curva ABC
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Confronto entre contagens cegas de campo e estoque contábil do ERP para homologação fiscal
          </p>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl hover:border-slate-700"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Como Funciona o Ciclo ABC
        </button>
      </header>

      {/* Grid de Itens com Divergência */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Auditorias Divergentes Pendentes de Ajuste Fiscal
          </h2>
          <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full border border-rose-500/30">
            {items.length} pendentes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Ordem / SKU</th>
                <th className="py-4 px-4">Posição</th>
                <th className="py-4 px-4 text-center">Meta ERP</th>
                <th className="py-4 px-4 text-center">Contagem Cega</th>
                <th className="py-4 px-4 text-center">Diferença</th>
                <th className="py-4 px-6 text-center">Diagnóstico</th>
                <th className="py-4 px-6 text-right">Ação Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {items.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{row.sku}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Curva {row.abc_category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{row.description}</p>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs text-slate-300">{row.position}</td>

                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-300">
                    {row.expected_qty} un
                  </td>

                  <td className="py-4 px-4 text-center font-mono font-black text-white">
                    {row.blind_counted_qty} un
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className={`font-mono font-black text-xs px-2.5 py-1 rounded border ${
                      row.difference_qty < 0 
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                    }`}>
                      {row.difference_qty > 0 ? `+${row.difference_qty}` : row.difference_qty} un
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="text-[11px] font-bold text-rose-400 uppercase">
                      {row.alert}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleApprove(row.id)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition-all active:scale-95"
                    >
                      Aprovar Ajuste
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajuda Curva ABC */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-amber-400 uppercase">Algoritmo de Inventário Curva ABC</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>Curva A (Alto Valor / Alto Giro):</b> Representa 80% do valor do estoque. Auditado semanalmente por contagem cega.</p>
              <p>• <b>Curva B (Médio Impacto):</b> Representa 15% do valor. Auditado quinzenalmente.</p>
              <p>• <b>Curva C (Baixo Impacto / Cauda Longa):</b> Representa 5% do valor. Auditado mensalmente.</p>
              <p>• <b>Aprovação Fiscal:</b> Divergências aprovadas aqui lançam o estorno contábil no ERP e reajustam o saldo físico do armazém.</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

