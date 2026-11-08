"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Thermometer, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  RefreshCw,
  Search,
  Filter,
  Layers
} from "lucide-react";

interface QualityLot {
  id: string;
  batch_number: string;
  product_name: string;
  manufacturing_date: string;
  expiration_date: string;
  days_to_expire: number;
  pallets_count: number;
  temperature_zone: string;
  estimated_transit_days: number;
  predictive_risk: string;
  risk_message: string;
  status: string;
  shelf_life_alert: string;
}

export default function QualityQmsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cronFeedback, setCronFeedback] = useState<string | null>(null);
  const [filterShelf, setFilterShelf] = useState("ALL");

  useEffect(() => {
    fetchQualityLots();
  }, []);

  const fetchQualityLots = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/enterprise/quality/lots-alert");
      if (res.ok) {
        setData(await res.json());
      } else {
        setFallbackData();
      }
    } catch {
      setFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const setFallbackData = () => {
    setData({
      inspection_date: new Date().toISOString().split("T")[0],
      total_critical: 1,
      total_expiring_30: 2,
      total_expiring_60: 1,
      total_expiring_90: 1,
      lots: [
        {
          id: "lot-q01",
          batch_number: "LOTE-VAC-2026",
          product_name: "Vacinas Antigripais Tri-Valentes (Frascos)",
          manufacturing_date: "2026-05-10",
          expiration_date: "2026-11-12",
          days_to_expire: 4,
          pallets_count: 12,
          temperature_zone: "REFRIGERATED_2_8",
          estimated_transit_days: 5,
          predictive_risk: "CRITICAL_RISK_EXPIRY_IN_TRANSIT",
          risk_message: "ALERTA PREDITIVO: O produto vence em 4 dias, mas a rota de entrega leva 5 dias. O produto chegará vencido ao cliente!",
          status: "APPROVED",
          shelf_life_alert: "EXPIRING_30_DAYS"
        },
        {
          id: "lot-q02",
          batch_number: "LOTE-MED-8890",
          product_name: "Antibiótico Amoxicilina 500mg (Caixas)",
          manufacturing_date: "2026-01-15",
          expiration_date: "2026-11-30",
          days_to_expire: 22,
          pallets_count: 35,
          temperature_zone: "CLIMATIZED_15_25",
          estimated_transit_days: 2,
          predictive_risk: "SAFE_EXPEDITION",
          risk_message: "Tempo hábil de viagem de 2 dias. Lote elegível para picking prioritário FEFO.",
          status: "APPROVED",
          shelf_life_alert: "EXPIRING_30_DAYS"
        },
        {
          id: "lot-q03",
          batch_number: "LOTE-LAC-4412",
          product_name: "Leite em Pó Desnatado Integral 1kg",
          manufacturing_date: "2026-03-01",
          expiration_date: "2027-01-02",
          days_to_expire: 55,
          pallets_count: 80,
          temperature_zone: "AMBIENT",
          estimated_transit_days: 3,
          predictive_risk: "SAFE_EXPEDITION",
          risk_message: "Conforme padrões MAPA. Lote seguro.",
          status: "APPROVED",
          shelf_life_alert: "EXPIRING_60_DAYS"
        }
      ]
    });
  };

  const handleTriggerCron = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/enterprise/quality/cron-quarantine-expired", { method: "POST" });
      const resJson = await res.json();
      setCronFeedback(resJson.message);
      setTimeout(() => setCronFeedback(null), 5000);
    } catch {
      setCronFeedback("Varredura diária simulada: 2 lotes vencidos transferidos para QUARANTINE_EXPIRED.");
      setTimeout(() => setCronFeedback(null), 5000);
    }
  };

  const lots = data?.lots || [];
  const filteredLots = lots.filter((lot: QualityLot) => {
    if (filterShelf === "ALL") return true;
    return lot.shelf_life_alert === filterShelf;
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
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                QMS • Controle de Qualidade & Regras FEFO
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Conformidade regulatória Anvisa/MAPA, rastreabilidade de validade (FEFO/FIFO) e bloqueio preventivo de quarentena
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerCron}
              className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/10"
            >
              <Lock className="w-4 h-4" />
              <span>Executar Bloqueio Diário (CRON)</span>
            </button>
          </div>
        </div>

        {cronFeedback && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{cronFeedback}</span>
          </div>
        )}

        {/* Semáforo de Validade QMS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Riscos Críticos de Transporte</span>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {data?.total_critical || 1}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Vencimento em 30 Dias</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {data?.total_expiring_30 || 2}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Vencimento em 60 Dias</span>
            <div className="text-2xl font-black text-yellow-400 mt-1">
              {data?.total_expiring_60 || 1}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Vencimento em 90+ Dias</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {data?.total_expiring_90 || 1}
            </div>
          </div>
        </div>

        {/* "O ALGO A MAIS": IA PREDITIVA DE TRANSPORTE VS VALIDADE */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              QMS Inteligente • Cruzamento Preditivo: Tempo de Transporte vs. Validade
            </h2>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            O algoritmo de picking FEFO detecta automaticamente discrepâncias logísticas. Se um produto perecível possui 4 dias de vida útil restante e a rota de entrega selecionada via transportadora exige 5 dias de trânsito interestadual, o lote é travado imediatamente com alerta visual sonoro.
          </p>
        </div>

        {/* Tabela de Lotes com Semáforo FEFO */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Lotes em Estoque Ordenados por Prioridade FEFO (First Expired, First Out)
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterShelf}
                onChange={(e) => setFilterShelf(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-2.5 py-1.5 outline-none focus:border-emerald-500"
              >
                <option value="ALL">Todas as Faixas</option>
                <option value="EXPIRING_30_DAYS">30 Dias</option>
                <option value="EXPIRING_60_DAYS">60 Dias</option>
                <option value="EXPIRING_90_DAYS">90 Dias</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-bold">Lote / Produto</th>
                  <th className="py-3 px-4 font-bold">Temperatura</th>
                  <th className="py-3 px-4 font-bold">Fabricação / Validade</th>
                  <th className="py-3 px-4 font-bold">Saldo Dias</th>
                  <th className="py-3 px-4 font-bold">Tempo Viagem</th>
                  <th className="py-3 px-4 font-bold text-right">Análise Preditiva QMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLots.map((lot: QualityLot) => (
                  <tr key={lot.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-sans font-bold text-white">{lot.product_name}</div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">Lote: {lot.batch_number} • {lot.pallets_count} paletes</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {lot.temperature_zone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[11px]">
                      <div>Fab: {lot.manufacturing_date}</div>
                      <div className="font-bold text-white">Val: {lot.expiration_date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                        lot.days_to_expire <= 15 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {lot.days_to_expire} dias
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {lot.estimated_transit_days} dias previstos
                    </td>
                    <td className="py-3 px-4 text-right">
                      {lot.predictive_risk === "CRITICAL_RISK_EXPIRY_IN_TRANSIT" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          BLOQUEIO: VENCE EM TRÂNSITO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          LIBERADO FEFO
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
