"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Sparkles, 
  Send, 
  DollarSign, 
  ArrowLeft, 
  Plus, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  UserCheck,
  Building,
  Phone,
  Clock,
  Layers
} from "lucide-react";

interface Deal {
  id: string;
  title: string;
  company_name: string;
  contact_phone: string;
  estimated_pallets: number;
  expected_mrr: number;
  ai_summary: string;
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
}

export default function CrmPipelinePage() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("EletroLux Distribuição Brasil");
  const [inquiryText, setInquiryText] = useState("Cliente quer armazenar 500 paletes de geladeira por 3 meses");
  const [targetMargin, setTargetMargin] = useState("25");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/enterprise/crm/pipeline");
      if (res.ok) {
        const data = await res.json();
        setStages(data.stages);
      } else {
        setFallbackPipeline();
      }
    } catch {
      setFallbackPipeline();
    }
  };

  const setFallbackPipeline = () => {
    setStages([
      {
        id: "PROSPECTION",
        name: "Prospecção",
        deals: [
          {
            id: "deal-01",
            title: "Armazenagem 500 Paletes Eletrodomésticos",
            company_name: "EletroLux Distribuição Brasil",
            contact_phone: "+55 11 98888-1111",
            estimated_pallets: 500,
            expected_mrr: 45000.00,
            ai_summary: "500 paletes de geladeiras por 3 meses com 25% de margem recomendada."
          }
        ]
      },
      {
        id: "PROPOSAL_SENT",
        name: "Proposta Enviada",
        deals: [
          {
            id: "deal-02",
            title: "Cross-Docking Alimentos Secos",
            company_name: "Moinho Paulista Grãos",
            contact_phone: "+55 11 97777-2222",
            estimated_pallets: 300,
            expected_mrr: 28000.00,
            ai_summary: "Proposta enviada com R$ 2,80/diária e handling de R$ 11,50."
          }
        ]
      },
      {
        id: "NEGOTIATION",
        name: "Em Negociação",
        deals: [
          {
            id: "deal-03",
            title: "Recinto CLIA Cargas Químicas",
            company_name: "Dow Chemical Importadora",
            contact_phone: "+55 11 96666-3333",
            estimated_pallets: 800,
            expected_mrr: 82000.00,
            ai_summary: "Aguardando aprovação jurídica das cláusulas de seguro aduaneiro."
          }
        ]
      },
      {
        id: "CLOSED_WON",
        name: "Contrato Fechado",
        deals: [
          {
            id: "deal-04",
            title: "Operação Farmacêutica Climatizada",
            company_name: "Eurofarma Laboratórios",
            contact_phone: "+55 11 95555-4444",
            estimated_pallets: 650,
            expected_mrr: 65000.00,
            ai_summary: "Contrato CTR-2026-001 homologado e integrado ao faturamento."
          }
        ]
      }
    ]);
  };

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/enterprise/crm/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: selectedClientName,
          inquiry_text: inquiryText,
          target_margin_percentage: parseFloat(targetMargin) || 25
        })
      });
      if (res.ok) {
        setGeneratedProposal(await res.json());
      } else {
        handleLocalProposalFallback();
      }
    } catch {
      handleLocalProposalFallback();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLocalProposalFallback = () => {
    setGeneratedProposal({
      client_name: selectedClientName,
      pricing_recommended: {
        daily_pallet_rate: 2.53,
        handling_in: 11.33,
        handling_out: 10.00,
        monthly_mrr_estimated: 37950.00,
        total_contract_value: 124515.00
      },
      proposal_text: `PROPOSTA COMERCIAL DE PRESTAÇÃO DE SERVIÇOS LOGÍSTICOS\nGADAP Armazém & Recinto Logístico S/A\n\nÀ: ${selectedClientName}\nArmazenagem de 500 paletes por 3 meses com 25% de margem.\nDiária por palete: R$ 2,53 (Pró-rata)\nHandling In: R$ 11,33 | Handling Out: R$ 10,00\nValor Total: R$ 124.515,00`,
      whatsapp_share_url: "https://api.whatsapp.com/send?text=Proposta%20GADAP"
    });
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
                <Briefcase className="w-7 h-7 text-indigo-400" />
                CRM B2B • Funil de Vendas do Armazém & Propostas com IA
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Pipeline Kanban de negociação de contratos de armazenagem com gerador inteligente de propostas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowProposalModal(true); setGeneratedProposal(null); }}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Proposta com IA</span>
            </button>
          </div>
        </div>

        {/* Funil Kanban de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300">{stage.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono font-bold">
                  {stage.deals.length}
                </span>
              </div>

              <div className="space-y-3">
                {stage.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3.5 bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl space-y-2 shadow-sm transition-all"
                  >
                    <div className="font-bold text-white text-xs line-clamp-1">{deal.company_name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{deal.title}</div>
                    
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>{deal.estimated_pallets} paletes</span>
                      <span className="text-emerald-400 font-bold">
                        R$ {deal.expected_mrr?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                      </span>
                    </div>

                    <div className="text-[9px] text-indigo-300/80 bg-indigo-950/30 p-1.5 rounded border border-indigo-900/30">
                      {deal.ai_summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Gerador de Proposta com IA */}
        {showProposalModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Motor de Propostas Comerciais com IA (Gemini)
                </h3>
                <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleGenerateProposal} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase">Empresa / Lead B2B</label>
                  <input
                    type="text"
                    required
                    value={selectedClientName}
                    onChange={(e) => setSelectedClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase">Demanda do Cliente (Linguagem Natural)</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder='Ex: "Cliente quer armazenar 500 paletes de geladeira por 3 meses"'
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase">Margem Alvo Desejada (%)</label>
                    <input
                      type="number"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold uppercase transition-all shadow-md shadow-indigo-600/20"
                    >
                      {isGenerating ? "Calculando com IA..." : "Gerar Proposta Comercial"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Pré-visualização da Proposta Gerada */}
              {generatedProposal && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Diária Sugerida</span>
                      <span className="font-bold text-white">R$ {generatedProposal.pricing_recommended?.daily_pallet_rate?.toFixed(2)}/palete</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">MRR Armazenagem</span>
                      <span className="font-bold text-emerald-400">R$ {generatedProposal.pricing_recommended?.monthly_mrr_estimated?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Valor Contrato</span>
                      <span className="font-bold text-cyan-300">R$ {generatedProposal.pricing_recommended?.total_contract_value?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Carta Proposta Oficial:</span>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-200 max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {generatedProposal.proposal_text}
                    </pre>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generatedProposal.proposal_text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enviar por WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowProposalModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
