"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Truck, 
  Clock, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldAlert, 
  Upload, 
  Camera, 
  Flame, 
  Cpu,
  Search,
  Filter
} from "lucide-react";

interface Asset {
  id: string;
  asset_code: string;
  name: string;
  asset_type: string;
  status: "AVAILABLE" | "IN_MAINTENANCE" | "BROKEN";
  current_hourmeter: number;
  hourmeter_limit: number;
  hours_until_preventive: number;
  alert: string;
  last_preventive_date: string;
}

interface MaintenanceOrder {
  id: string;
  asset_code: string;
  order_type: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  reported_by: string;
  created_at: string;
}

export default function CmmsMaintenancePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orders, setOrders] = useState<MaintenanceOrder[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedAssetCode, setSelectedAssetCode] = useState("EMP-01");
  const [orderTitle, setOrderTitle] = useState("");
  const [orderDesc, setOrderDesc] = useState("");
  const [orderPriority, setOrderPriority] = useState("HIGH");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchCmmsData();
  }, []);

  const fetchCmmsData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/enterprise/cmms/assets");
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets);
        setOrders(data.recent_orders);
      } else {
        setFallbackCmms();
      }
    } catch {
      setFallbackCmms();
    }
  };

  const setFallbackCmms = () => {
    setAssets([
      {
        id: "ast-01",
        asset_code: "EMP-01",
        name: "Empilhadeira Elétrica Retrátil Still 2.0T",
        asset_type: "FORKLIFT",
        status: "AVAILABLE",
        current_hourmeter: 242.5,
        hourmeter_limit: 250.0,
        hours_until_preventive: 7.5,
        alert: "PREVENTIVE_DUE_SOON",
        last_preventive_date: "2026-08-10"
      },
      {
        id: "ast-02",
        asset_code: "EMP-02",
        name: "Empilhadeira a Combustão Hyster 2.5T",
        asset_type: "FORKLIFT",
        status: "IN_MAINTENANCE",
        current_hourmeter: 512.0,
        hourmeter_limit: 500.0,
        hours_until_preventive: 0,
        alert: "PREVENTIVE_OVERDUE",
        last_preventive_date: "2026-06-15"
      },
      {
        id: "ast-03",
        asset_code: "DOCA-01",
        name: "Niveladora Hidráulica de Doca 01",
        asset_type: "DOCK_LEVELER",
        status: "AVAILABLE",
        current_hourmeter: 120.0,
        hourmeter_limit: 300.0,
        hours_until_preventive: 180.0,
        alert: "OK",
        last_preventive_date: "2026-09-01"
      },
      {
        id: "ast-04",
        asset_code: "DOCA-04",
        name: "Niveladora Mecânica de Doca 04",
        asset_type: "DOCK_LEVELER",
        status: "BROKEN",
        current_hourmeter: 340.0,
        hourmeter_limit: 300.0,
        hours_until_preventive: 0,
        alert: "CORRECTIVE_REQUIRED",
        last_preventive_date: "2026-05-20"
      }
    ]);

    setOrders([
      {
        id: "ord-m01",
        asset_code: "DOCA-04",
        order_type: "CORRECTIVE",
        priority: "CRITICAL",
        title: "Ruptura no cabo de aço da niveladora",
        description: "Durante a descarga de carreta pesada, a mola de retorno rompeu.",
        status: "IN_PROGRESS",
        reported_by: "Carlos (Supervisor Doca)",
        created_at: "2026-11-06T14:20:00Z"
      },
      {
        id: "ord-m02",
        asset_code: "EMP-01",
        order_type: "PREVENTIVE",
        priority: "MEDIUM",
        title: "Troca de óleo hidráulico e engraxe das torres (Gatilho 250h)",
        description: "Alerta automático gerado pelo horímetro ao atingir 242 horas de giro de picking.",
        status: "OPEN",
        reported_by: "Sistema CMMS (Horímetro)",
        created_at: "2026-11-07T08:00:00Z"
      }
    ]);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle) return;

    const newOrd: MaintenanceOrder = {
      id: "ord-" + Date.now(),
      asset_code: selectedAssetCode,
      order_type: "CORRECTIVE",
      priority: orderPriority,
      title: orderTitle,
      description: orderDesc,
      status: "OPEN",
      reported_by: "Operador de Turno",
      created_at: new Date().toISOString()
    };

    setOrders([newOrd, ...orders]);
    setShowOrderModal(false);
    setOrderTitle("");
    setOrderDesc("");
    setFeedback(`Chamado de manutenção corretiva para ${selectedAssetCode} aberto com sucesso!`);
    setTimeout(() => setFeedback(null), 4000);
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
                <Wrench className="w-7 h-7 text-amber-500" />
                CMMS • Gestão de Manutenção de Frotas & Ativos
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Disponibilidade operacional de empilhadeiras, niveladoras de doca e gatilhos preventivos por horímetro
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Abrir Chamado Corretivo</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Quadro de Saúde dos Ativos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total de Ativos</span>
            <div className="text-2xl font-black text-white mt-1">{assets.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Disponíveis / Operando</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {assets.filter(a => a.status === "AVAILABLE").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Em Manutenção</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {assets.filter(a => a.status === "IN_MAINTENANCE").length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Quebrados / Fora de Uso</span>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {assets.filter(a => a.status === "BROKEN").length}
            </div>
          </div>
        </div>

        {/* "O ALGO A MAIS": GATILHO AUTOMÁTICO POR HORÍMETRO */}
        <div className="bg-gradient-to-r from-slate-900 to-amber-950/20 border border-amber-500/20 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400">
            <Cpu className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Gatilho de Horímetro em Tempo Real (Controle de Horas de Picking)
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ao invés de apenas datas de calendário, cada palete movimentado ou ordem de picking finalizada pelos operadores no PWA incrementa o horímetro do ativo vinculado. Ao atingir o ciclo limite de <b>250 horas de uso</b>, o sistema CMMS emite uma ordem preventiva prioritária para troca de óleo hidráulico e engraxe.
          </p>
        </div>

        {/* Grid de Ativos Físicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`p-5 rounded-2xl border space-y-3 shadow-lg transition-all ${
                asset.status === "BROKEN" 
                  ? "bg-rose-950/20 border-rose-500/40" 
                  : asset.status === "IN_MAINTENANCE"
                  ? "bg-amber-950/20 border-amber-500/40"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {asset.asset_code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  asset.status === "AVAILABLE"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : asset.status === "IN_MAINTENANCE"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}>
                  {asset.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-xs line-clamp-1">{asset.name}</h3>
                <span className="text-[10px] text-slate-500 block mt-0.5 uppercase">{asset.asset_type}</span>
              </div>

              {/* Barra de Progresso do Horímetro */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Horímetro:</span>
                  <span className="text-white font-bold">{asset.current_hourmeter}h / {asset.hourmeter_limit}h</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all ${
                      asset.current_hourmeter >= asset.hourmeter_limit ? "bg-rose-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${Math.min(100, (asset.current_hourmeter / asset.hourmeter_limit) * 100)}%` }}
                  />
                </div>
                {asset.hours_until_preventive > 0 ? (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Restam {asset.hours_until_preventive}h para a próxima preventiva
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-400 block font-bold font-mono">
                    MANUTENÇÃO PREVENTIVA VENCIDA
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tabela de Ordens Recentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Ordens de Serviço Abertas (Preventivas & Corretivas)
          </h2>

          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-bold">Ativo</th>
                  <th className="py-3 px-4 font-bold">Tipo</th>
                  <th className="py-3 px-4 font-bold">Título / Sintoma do Defeito</th>
                  <th className="py-3 px-4 font-bold">Solicitante</th>
                  <th className="py-3 px-4 font-bold">Prioridade</th>
                  <th className="py-3 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{ord.asset_code}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.order_type === "CORRECTIVE" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {ord.order_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{ord.title}</td>
                    <td className="py-3 px-4 text-slate-400">{ord.reported_by}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[10px] text-amber-400">{ord.priority}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Abertura de Corretiva com Foto */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  Abrir Chamado Corretivo
                </h3>
                <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-semibold">Ativo com Defeito</label>
                  <select
                    value={selectedAssetCode}
                    onChange={(e) => setSelectedAssetCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.asset_code}>{a.asset_code} - {a.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-semibold">Título do Problema</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Vazamento de óleo hidráulico nas mangueiras"
                    value={orderTitle}
                    onChange={(e) => setOrderTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-semibold">Descrição do Defeito</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o barulho, vazamento ou comportamento anômalo..."
                    value={orderDesc}
                    onChange={(e) => setOrderDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-semibold">Foto da Peça / Dano</label>
                  <div className="p-4 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl text-center text-slate-500 flex flex-col items-center gap-1 cursor-pointer">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span>Clique para fotografar com a câmera do celular</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl uppercase tracking-wider"
                  >
                    Registrar Chamado
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

