"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Layers, 
  AlertOctagon, 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  Warehouse, 
  RefreshCw 
} from "lucide-react";

export default function TorreControlePage() {
  const [metrics, setMetrics] = useState<any>({
    total_positions: 48,
    occupied_positions: 32,
    empty_positions: 16,
    occupancy_rate_pct: 66.7,
    critical_alerts: [
      {
        severity: "CRITICAL",
        message: "Doca 01 retida com container em operação há mais de 4h15m",
        detected_at: "16:45"
      },
      {
        severity: "WARNING",
        message: "Área de Quarentena com 3 lotes aguardando retificação RFB",
        detected_at: "16:20"
      }
    ],
    aisles_heatmap: {
      "RUA 01": { total: 12, occupied: 11, rate: 91.7 },
      "RUA 02": { total: 12, occupied: 8, rate: 66.7 },
      "RUA 03": { total: 12, occupied: 9, rate: 75.0 },
      "RUA 04": { total: 12, occupied: 4, rate: 33.3 }
    }
  });

  const [selectedCell, setSelectedCell] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Torre de Controle Logística • Mapa 2D/3D
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visibilidade dinâmica da capacidade instalada, mapa de calor por rua e monitor de gargalos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-slate-300">Atualização em Tempo Real</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Capacidade Estática</span>
          <p className="text-2xl font-black text-white">{metrics.total_positions} Posições</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Posições Ocupadas</span>
          <p className="text-2xl font-black text-rose-400">{metrics.occupied_positions} Ocupadas</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Vagas Livres (Empty)</span>
          <p className="text-2xl font-black text-emerald-400">{metrics.empty_positions} Livres</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Taxa de Ocupação</span>
          <p className="text-2xl font-black text-cyan-400">{metrics.occupancy_rate_pct}%</p>
        </div>
      </div>

      {/* Mapa Visual 2D / Heatmap de Ruas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-cyan-400" />
              Mapa Visual de Ocupação por Rua (Aisle / Racks)
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-slate-400">Vazio (Empty)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500"></span>
                <span className="text-slate-400">Ocupado</span>
              </div>
            </div>
          </div>

          {/* Grid de Ruas e Prateleiras */}
          <div className="space-y-4">
            {Object.entries(metrics.aisles_heatmap).map(([aisle, data]: any) => (
              <div key={aisle} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-black text-white">{aisle}</span>
                  <span className={`font-bold ${data.rate > 80 ? "text-rose-400" : "text-emerald-400"}`}>
                    Ocupação: {data.rate}% ({data.occupied}/{data.total})
                  </span>
                </div>

                {/* Slots das Prateleiras */}
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {Array.from({ length: data.total }).map((_, idx) => {
                    const isOccupied = idx < data.occupied;
                    const addressCode = `${aisle.replace(" ", "")}-P${idx + 1}-N1`;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCell({ address: addressCode, isOccupied, aisle })}
                        className={`h-9 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer transition-all hover:scale-110 relative group ${
                          isOccupied
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/10"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        }`}
                      >
                        {idx + 1}
                        {/* Tooltip Informativo */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 p-1.5 bg-slate-900 border border-slate-700 text-[9px] text-center text-white rounded shadow-xl z-20 pointer-events-none">
                          {addressCode} • {isOccupied ? "OCUPADO" : "LIVRE"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Críticos de Gargalo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            Alertas Operacionais & Gargalos
          </h2>

          <div className="space-y-3">
            {metrics.critical_alerts.map((al: any, i: number) => (
              <div
                key={i}
                className="p-3.5 bg-slate-950 border border-rose-500/30 rounded-xl space-y-1.5"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-rose-400 uppercase tracking-wider">{al.severity}</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {al.detected_at}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">{al.message}</p>
              </div>
            ))}
          </div>

          {selectedCell && (
            <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-2 animate-in fade-in">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">Posição Selecionada</span>
              <p className="font-mono text-base font-black text-white">{selectedCell.address}</p>
              <div className="text-xs text-slate-300 flex justify-between">
                <span>Status da Vaga:</span>
                <span className={`font-bold ${selectedCell.isOccupied ? "text-rose-400" : "text-emerald-400"}`}>
                  {selectedCell.isOccupied ? "OCUPADO (LPN Presente)" : "LIVRE PARA ARMAZENAMENTO"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

