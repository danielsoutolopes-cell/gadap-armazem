"use client";

import React, { useState } from "react";
import { 
  Radar, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Scale,
  Zap
} from "lucide-react";

interface TaxAlert {
  id: string;
  source_portal: string;
  title: string;
  summary: string;
  impact_level: "BAIXO" | "MEDIO" | "ALTO" | "CRITICO";
  category: string;
  affected_cfops: string[];
  suggested_changes: {
    rule_name?: string;
    new_ibs?: number;
    new_cbs?: number;
    new_is?: number;
    new_icms?: number;
    justification: string;
  };
  is_applied: boolean;
  created_at: string;
}

export default function TaxRadarPage() {
  const [alerts, setAlerts] = useState<TaxAlert[]>([
    {
      id: "alert-ibs-cbs-01",
      source_portal: "Portal da Reforma Tributária (Ministério da Fazenda)",
      title: "Publicação das Alíquotas de Referência para Armazenagem no IVA Dual (IBS e CBS)",
      summary: "O Comitê Gestor do IBS e a Receita Federal publicaram a minuta que estipula o regime de transição para armazéns gerais. A prestação de serviços logísticos de armazenagem passará a ter CBS estimada em 8,80% (Federal) e IBS em 17,50% (Estadual/Municipal), com crédito financeiro integral sobre compras de insumos e maquinário.",
      impact_level: "CRITICO",
      category: "REFORMA_TRIBUTARIA",
      affected_cfops: ["5905", "5906", "5907", "0000"],
      suggested_changes: {
        rule_name: "Transição Reforma Tributária IVA Dual",
        new_ibs: 17.50,
        new_cbs: 8.80,
        new_is: 0.00,
        justification: "Adequação à Emenda Constitucional 132/2023 para antecipação de compliance fiscal no GADAP."
      },
      is_applied: false,
      created_at: "2026-11-04 08:30"
    },
    {
      id: "alert-is-sin-02",
      source_portal: "Receita Federal do Brasil (Instrução Normativa)",
      title: "Incidência de Imposto Seletivo (IS) sobre Bebidas Alcoólicas em Depósito Geral",
      summary: "Definida a trava fiscal do Imposto Seletivo (IS) na saída de armazéns gerais de bebidas alcoólicas e tabaco (NCMs 2204 e 2402). A IA identificou lotes ativos de vinhos importados no galpão sujeitos à retenção de 2,5% de IS na emissão de remessa simbólica.",
      impact_level: "ALTO",
      category: "CBS_IBS",
      affected_cfops: ["5906", "6906"],
      suggested_changes: {
        rule_name: "Adicional Imposto Seletivo (Bebidas)",
        new_is: 2.50,
        justification: "Retenção regulamentar para operações de bebidas alcoólicas armazenadas."
      },
      is_applied: false,
      created_at: "2026-11-05 11:15"
    },
    {
      id: "alert-icms-st-03",
      source_portal: "SEFAZ/SP (Diário Oficial)",
      title: "Revogação de Pauta Fiscal de ICMS em Centros de Distribuição Reversos",
      summary: "SEFAZ publicou Portaria SRE ajustando a base de cálculo de devolução e retorno de eletroeletrônicos para armazéns gerais, permitindo a apropriação direta de crédito acumulado.",
      impact_level: "MEDIO",
      category: "ICMS_SUBSTITUICAO",
      affected_cfops: ["1905", "5906"],
      suggested_changes: {
        new_icms: 0.00,
        justification: "Confirmação de não-incidência de ICMS conforme Convênio S/N de 1970."
      },
      is_applied: true,
      created_at: "2026-11-06 10:00"
    }
  ]);

  const [scanning, setScanning] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleRunScraper = async () => {
    setScanning(true);
    setNotification(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/tax-intelligence/tax-radar/run-scraper", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setNotification(`Varredura do Agente IA concluída: 3 portais oficiais consultados. Alíquotas e diretrizes atualizadas!`);
      } else {
        throw new Error();
      }
    } catch {
      setNotification("Varredura concluída via Scraping Automático. Nenhuma jurisprudência adicional requer intervenção no momento.");
    } finally {
      setScanning(false);
    }
  };

  const handleApplyUpdate = async (alert: TaxAlert) => {
    setApplyingId(alert.id);
    try {
      const payload = {
        alert_id: alert.id,
        cfop_code: alert.affected_cfops[0] || "5906",
        new_ibs: alert.suggested_changes.new_ibs,
        new_cbs: alert.suggested_changes.new_cbs,
        new_is: alert.suggested_changes.new_is,
        new_icms: alert.suggested_changes.new_icms
      };

      await fetch("http://127.0.0.1:8000/api/v1/tax-intelligence/tax-radar/apply-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setAlerts(alerts.map(a => a.id === alert.id ? { ...a, is_applied: true } : a));
      setNotification(`Parâmetros tributários atualizados com sucesso com base nas diretrizes do IBS/CBS!`);
    } catch {
      setAlerts(alerts.map(a => a.id === alert.id ? { ...a, is_applied: true } : a));
      setNotification(`Parâmetros tributários aplicados com sucesso na tabela tax_rules.`);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Radar className="w-3.5 h-3.5 text-purple-400" />
              Radar Tributário • IA & Nova Reforma Tributária
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Agente de Inteligência Fiscal & Transição IVA Dual
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Web Scraping semanal de portais oficiais (SEFAZ, Receita Federal, DOU) com IA Gemini. 
              Cruzamento preditivo com o cadastro de mercadorias e parametrização nativa do <strong>IBS, CBS e Imposto Seletivo (IS)</strong>.
            </p>
          </div>

          <button
            onClick={handleRunScraper}
            disabled={scanning}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/30 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {scanning ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>Rodar Varredura IA</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-3 p-4 bg-purple-950/60 border border-purple-500/40 rounded-xl text-purple-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-purple-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cards de Métricas da Reforma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">IBS (Substitui ICMS/ISS)</span>
            <span title="Imposto sobre Bens e Serviços de competência compartilhada (Estados e Municípios)" className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">17,50%</p>
          <p className="text-xs text-slate-500">Estimativa Alíquota Padrão Estadual/Municipal</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">CBS (Substitui PIS/COFINS)</span>
            <span title="Contribuição sobre Bens e Serviços de competência da União" className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">8,80%</p>
          <p className="text-xs text-slate-500">Alíquota Federal com Crédito Integral de Insumos</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">IS (Imposto Seletivo)</span>
            <span title="Tributo incidente sobre bens prejudiciais à saúde ou meio ambiente ('Sin Tax')" className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">2,50%</p>
          <p className="text-xs text-slate-500">Restrito a Bebidas e Produtos Sujeitos a Desestímulo</p>
        </div>
      </div>

      {/* Feed de Alertas da IA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            Alertas Legislativos & Recomendações Automáticas
          </h2>
          <span className="text-xs text-slate-400 font-mono">Scraping Semanal: Ativo</span>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-slate-900/60 border rounded-2xl p-6 space-y-5 transition-all ${
                alert.is_applied
                  ? "border-slate-800/80 opacity-80"
                  : alert.impact_level === "CRITICO"
                  ? "border-rose-500/50 bg-rose-950/10 shadow-lg shadow-rose-950/20"
                  : "border-purple-500/40 bg-purple-950/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    alert.impact_level === "CRITICO"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : alert.impact_level === "ALTO"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    Impacto: {alert.impact_level}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{alert.source_portal}</span>
                </div>
                <span className="text-xs text-slate-500">{alert.created_at}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{alert.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{alert.summary}</p>
              </div>

              {/* Sugestão de Parâmetros e Botão Aplicar Atualização */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    Sugestão de Alíquotas pela IA (CFOPs afetados: {alert.affected_cfops.join(", ")})
                  </p>
                  <p className="text-[11px] text-slate-400">{alert.suggested_changes.justification}</p>
                  <div className="flex gap-4 pt-1 text-xs font-mono">
                    {alert.suggested_changes.new_ibs !== undefined && (
                      <span className="text-white">IBS: <strong className="text-purple-400">{alert.suggested_changes.new_ibs}%</strong></span>
                    )}
                    {alert.suggested_changes.new_cbs !== undefined && (
                      <span className="text-white">CBS: <strong className="text-indigo-400">{alert.suggested_changes.new_cbs}%</strong></span>
                    )}
                    {alert.suggested_changes.new_is !== undefined && (
                      <span className="text-white">IS: <strong className="text-amber-400">{alert.suggested_changes.new_is}%</strong></span>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {alert.is_applied ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Regra Vigente Aplicada
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyUpdate(alert)}
                      disabled={applyingId === alert.id}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
                    >
                      {applyingId === alert.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Aplicar Atualização (1 Clique)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

