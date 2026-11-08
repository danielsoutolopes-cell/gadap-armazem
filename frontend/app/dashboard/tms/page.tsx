"use client";

import React, { useState } from "react";
import { 
  Truck, 
  MapPin, 
  Package, 
  Printer, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ExternalLink,
  X
} from "lucide-react";

export default function TMSDashboardPage() {
  const [shipments] = useState([
    {
      id: "tms-001",
      order_number: "EXP-2024-8891",
      carrier_name: "Jadlog Express",
      tracking_code: "JAD-SP-992182",
      destination_city: "Campinas / SP",
      service_level: "EXPRESS",
      current_status: "IN_TRANSIT",
      status_label: "Em Trânsito para Entrega",
      last_event_time: "Hoje às 17:40"
    },
    {
      id: "tms-002",
      order_number: "EXP-2024-8892",
      carrier_name: "Braspress Rodoviário",
      tracking_code: "BRA-RJ-441209",
      destination_city: "Rio de Janeiro / RJ",
      service_level: "LOTACAO",
      current_status: "DISPATCHED",
      status_label: "Despachado / Doca Liberada",
      last_event_time: "Hoje às 18:15"
    }
  ]);

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handlePrintZpl = async (trackingCode: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/logistics/tms/shipping-labels?format=zpl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          order_id: "c3d4e5f6-0000-0000-0000-000000000003",
          carrier_name: "Jadlog",
          tracking_code: trackingCode,
          destination_city: "Campinas/SP",
          recipient_name: "Samsung Filial SP",
          total_packages: 12
        })
      });
      const zplText = await res.text();
      const blob = new Blob([zplText], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `etiqueta_${trackingCode}.zpl`;
      a.click();
    } catch (err: any) {
      alert("Erro ao gerar etiqueta ZPL: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              TMS Lite • Roteirização e Despacho
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de fretes, impressão de etiquetas térmicas ZPL/GS1 e telemetria de entregas
          </p>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl hover:border-slate-700"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Ajuda TMS & Webhooks
        </button>
      </header>

      {/* Grid de Despachos */}
      <div className="space-y-4">
        {shipments.map((shp) => (
          <div key={shp.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-black text-white">{shp.order_number}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {shp.service_level}
                </span>
                <span className="text-xs text-slate-400 font-mono">Rastreio: {shp.tracking_code}</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" /> Destino: {shp.destination_city} • {shp.carrier_name}
              </p>
              <p className="text-xs text-slate-500">Última atualização: {shp.last_event_time}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {shp.status_label}
              </span>

              <button
                onClick={() => handlePrintZpl(shp.tracking_code)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 rounded-lg active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                Etiqueta ZPL
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajuda TMS */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-cyan-400 uppercase">Arquitetura TMS Lite & Webhooks</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>Etiquetas ZPL (Zebra Programming Language):</b> Podem ser enviadas diretamente a impressoras térmicas industriais ou convertidas em PDF.</p>
              <p>• <b>Webhooks de Telemetria:</b> As transportadoras enviam o status em tempo real via endpoint <code>/api/v1/logistics/tms/webhooks/carrier-status</code>.</p>
              <p>• <b>Rastreio do Cliente:</b> O código de rastreamento é disponibilizado instantaneamente no Portal B2B do depositante.</p>
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

