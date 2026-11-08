import Link from "next/link";
import { 
  Package, 
  ShieldAlert, 
  Truck, 
  Sparkles, 
  Activity, 
  DollarSign, 
  ClipboardCheck, 
  Building2, 
  GraduationCap, 
  CreditCard,
  Tag,
  Users
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
          GADAP Armazém • WMS & ERP Logístico
        </h1>
        <p className="text-sm text-slate-400">
          Plataforma Integrada: Cadastros Base, Doca Mobile, Torre 2D, Inventário ABC, TMS, Billing Fiscal e Portal B2B
        </p>
      </header>

      {/* SEÇÃO 0: CADASTROS BASE & CRM (NOVA SEÇÃO) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Cadastros Base & CRM Logístico
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/cadastros/clientes"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Donos da Carga (Clientes)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cadastro e gestão contratual de depositantes e importadores habilitados para emissão e armazenagem.
            </p>
          </Link>

          <Link
            href="/dashboard/cadastros/fornecedores"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Fornecedores & Transportadoras</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Frotas homologadas, transportadoras parceiras e fornecedores de embalagens, paletes e insumos de doca.
            </p>
          </Link>

          <Link
            href="/dashboard/cadastros/servicos"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-white">Tabela de Preços & Serviços</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Catálogo tarifário oficial: diária decendial CIF, paletização PBR, stretch, desova manual e handling.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 1: OPERAÇÃO DE CAMPO / DOCA (PWA) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Operação de Campo & Doca (Mobile-First)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/doca/recebimento"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Doca • Recebimento (PWA)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conferência física na descarga, captura de avarias com câmera nativa (Zero-Storage) e faturamento de extras spot.
            </p>
          </Link>

          <Link
            href="/doca/expedicao"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Doca • Expedição & Checkout</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conferência cega por leitor de código de barras, separação de picking, lacres de portaria e emissão do Packing List em PDF.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 2: TORRE DE CONTROLE & GESTÃO VISUAL DE PÁTIO */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Inteligência de Pátio & Monitoramento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/torre-controle"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Torre de Controle (Heatmap)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mapa visual 2D das ruas (aisles) e prateleiras em tempo real, capacidade estática e alertas de retenção de doca.
            </p>
          </Link>

          <Link
            href="/dashboard/auditoria"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-rose-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <h3 className="text-base font-bold text-white">Auditoria 3-Way Match</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cruzamento de 3 vias (NF/DI vs Doca vs OS) com bloqueio automático em Quarentena Fiscal (Art. 107 DL 37/66).
            </p>
          </Link>

          <Link
            href="/dashboard/scheduling"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-white">Smart Scheduling (IA)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leitura semântica de WhatsApp e romaneios OCR por LLM com dimensionamento e alocação automática de docas.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 3: SUPPLY CHAIN, ERP FISCAL & TMS */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> ERP Backoffice, TMS & Faturamento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/inventario/conciliacao"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-white">Inventário Cego (Curva ABC)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ordens de Cycle Counting rotativas, detecção de quebra/sobra de estoque e aprovação de ajustes fiscais no ERP.
            </p>
          </Link>

          <Link
            href="/dashboard/tms"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">TMS Lite & Etiquetas ZPL</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Roteirização de entregas, impressão de etiquetas térmicas Zebra (ZPL/GS1-128) e captura de telemetria por webhook.
            </p>
          </Link>

          <Link
            href="/dashboard/faturamento"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Billing Fiscal em Lote</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fechamento mensal consolidado, cobrança com gateway Asaas (Pix/Boleto) e emissão de NFS-e e NF-e de Retorno Simbólico (CFOP 5.906).
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 4: CLIENTE EXTERNO B2B & ACADEMY */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Autoatendimento B2B & Onboarding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/portal-cliente"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Portal B2B do Depositante</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Área restrita por RLS onde o dono da carga consulta o status do estoque, rastreabilidade, faturas decendiais e exporta relatórios em PDF.
            </p>
          </Link>

          <Link
            href="/dashboard/academy"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">GADAP Academy (Manuais)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trilhas interativas de treinamento de campo e backoffice: Doca Zero-Storage, Inventário ABC, TMS e compliance tributário.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
