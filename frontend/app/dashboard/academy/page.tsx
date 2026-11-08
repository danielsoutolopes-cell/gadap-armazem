"use client";

import React, { useState } from "react";
import { 
  GraduationCap, 
  Smartphone, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Award,
  ChevronRight,
  ClipboardCheck,
  Truck,
  CreditCard,
  Building2
} from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  category: "Doca & Campo" | "IA & Backoffice" | "Fiscal & ERP";
  duration: string;
  description: string;
  icon: React.ReactNode;
  badgeColor: string;
  steps: string[];
}

export default function AcademyPage() {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);

  const modules: TrainingModule[] = [
    {
      id: "doca-pwa",
      title: "Recebimento Cego & Avarias Zero-Storage",
      category: "Doca & Campo",
      duration: "10 min",
      description: "Conferência física na doca pelo coletor, registro de avaria fotográfica em memória e lançamento de serviços extras spot.",
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      steps: [
        "1. Abra o PWA de doca e informe o número do documento/DI.",
        "2. Digite os volumes físicos contados na descarga.",
        "3. Em caso de avaria, capture a foto diretamente da câmera nativa.",
        "4. Lance serviços extras executados (paletização, filme stretch).",
        "5. Confirme o lote para gerar o termo de avaria PDF."
      ]
    },
    {
      id: "cycle-counting-abc",
      title: "Inventário Cego Rotativo (Curva ABC)",
      category: "Fiscal & ERP",
      duration: "12 min",
      description: "Como estruturar ciclos de contagem cega priorizando itens Curva A e reconciliar quebras e sobras de estoque no ERP.",
      icon: <ClipboardCheck className="w-6 h-6 text-amber-400" />,
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      steps: [
        "1. Gere a ordem de contagem rotativa selecionando a classe ABC.",
        "2. O conferente audita a posição sem saber a meta do sistema (contagem cega).",
        "3. O sistema calcula a divergência automática.",
        "4. Se houver divergência, acesse a tela de Conciliação de Inventário.",
        "5. Aprove o ajuste fiscal para atualizar o saldo contábil."
      ]
    },
    {
      id: "tms-lite",
      title: "TMS Lite: Etiquetas ZPL e Rastreio",
      category: "Fiscal & ERP",
      duration: "10 min",
      description: "Geração de etiquetas térmicas industriais ZPL para impressoras Zebra e rastreamento consolidado via webhooks de transportadoras.",
      icon: <Truck className="w-6 h-6 text-cyan-400" />,
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      steps: [
        "1. No pedido expedido, selecione a transportadora e nível de serviço.",
        "2. Clique em 'Etiqueta ZPL' para envio direto à impressora térmica.",
        "3. Acompanhe a carga pelo código de rastreio integrado no painel TMS.",
        "4. Atualizações das transportadoras são capturadas via webhook automático."
      ]
    },
    {
      id: "billing-fiscal",
      title: "Fechamento Mensal, NFS-e e NF-e Simbólica",
      category: "Fiscal & ERP",
      duration: "15 min",
      description: "Consolidação de diárias de armazenagem, disparo de cobrança via gateway e emissão simultânea de NFS-e (ISS) e NF-e de Retorno Simbólico (CFOP 5.906).",
      icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      steps: [
        "1. No encerramento da competência, acesse a tela de Fechamento Financeiro.",
        "2. Revise os valores consolidados de armazenagem, handling e extras.",
        "3. Clique em 'Fechar Fatura & Emitir NF-e'.",
        "4. O sistema gera a fatura Asaas com Pix/Boleto.",
        "5. A NFS-e e a NF-e de Retorno Simbólico são transmitidas à SEFAZ."
      ]
    },
    {
      id: "portal-b2b",
      title: "Portal B2B de Autoatendimento do Cliente",
      category: "IA & Backoffice",
      duration: "8 min",
      description: "Como o depositante acessa suas cargas, consulta laudos de quarentena e exporta a posição consolidada de estoque em PDF.",
      icon: <Building2 className="w-6 h-6 text-indigo-400" />,
      badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
      steps: [
        "1. O cliente faz login com credenciais de acesso restrito (RLS).",
        "2. Visualiza volumes estocados, em quarentena e expedidos.",
        "3. Acompanha faturas em aberto e histórico de pagamentos.",
        "4. Clica em 'Exportar Posição (PDF)' para relatório contábil sob demanda."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              GADAP Academy • Treinamento WMS / ERP Backoffice
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Trilhas completas de capacitação operacional, inventário cego, TMS e compliance fiscal
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Certificação Backoffice ERP 3.0</span>
        </div>
      </header>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedModule(m)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  {m.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${m.badgeColor}`}>
                  {m.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {m.duration}
              </span>
              <span className="text-cyan-400 font-bold flex items-center gap-1 hover:underline">
                Acessar Guia <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Passo a Passo */}
      {selectedModule && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                {selectedModule.icon}
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{selectedModule.title}</h2>
                <p className="text-xs text-slate-400">{selectedModule.category} • Duração estimada: {selectedModule.duration}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedModule(null)}
              className="text-slate-400 hover:text-white text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              Fechar
            </button>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Roteiro Operacional de Execução:
            </h4>
            <div className="space-y-2 pt-1">
              {selectedModule.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
