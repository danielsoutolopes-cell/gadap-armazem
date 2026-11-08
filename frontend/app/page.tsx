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
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  LogIn,
  Users,
  ShieldCheck,
  Briefcase,
  FileSpreadsheet,
  Calculator
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 text-center space-y-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
              GADAP Armazém • WMS & ERP
            </h1>
            <p className="text-sm text-slate-400">
              Plataforma Integrada: Cadastros Base, Suprimentos, Financeiro AP/AR, Doca Mobile, Torre 2D e Inventário ABC
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/configuracoes/usuarios"
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shrink-0"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Equipe & RBAC</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all hover:scale-105 shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Área de Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* SEÇÃO NOBRE: GESTÃO DE ACESSOS (RBAC) & ADMINISTRAÇÃO SAAS */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span> Administração SaaS & Controle de Acessos (RBAC)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/configuracoes/usuarios"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-base font-bold text-white">Gestão da Equipe & Papéis (Tenant RBAC)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Controle de acessos dos membros do armazém: Administradores de Galpão, Operadores de Doca e Controladoria Financeira. Convite com envio de senha temporária.
            </p>
          </Link>

          <Link
            href="/admin/empresas"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-400" />
              <h3 className="text-base font-bold text-white">Superadmin • Gestão de Armazéns & Tenants</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Console exclusivo para o Superusuário provisionar múltiplos armazéns gerais, CLIAs e operadores logísticos no SaaS com isolamento estrito de dados via RLS.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO PRICING & CONTRATOS: MOTOR DE TARIFAS E SIMULADOR */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Motor de Contratos, Pricing & Simulador Preditivo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/contratos"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-white">Contratos & Construtor Visual de Tarifas</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parametrização de diárias pró-rata de armazenagem (palete/m³/m²), índices de reajuste (IPCA/IGP-M) e regras condicionais por tipo de carga.
            </p>
          </Link>

          <Link
            href="/dashboard/contratos"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Simulador Preditivo de Faturamento</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aba dedicada para o gestor comercial simular cenários operacionais fictícios, calculando freetime, handling e franquia mínima antes de emitir a proposta.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO RH INTELIGENTE: FOLHA DE PAGAMENTO CLT & ESOCIAL */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Recursos Humanos (CLT), Folha Inteligente & eSocial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/rh/colaboradores"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Prontuário de Colaboradores & Admissão S-2200</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registro de empregados com CBO oficial, Matrícula eSocial, Importação em Lote via CSV e mensageria de admissão S-2200.
            </p>
          </Link>

          <Link
            href="/dashboard/rh/folha"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Folha CLT, Holerite Oficial & RH Inteligente</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cálculo com tabelas progressivas de INSS e IRRF, Horas Extras 50%/100%, DSR e gráfico preditivo de cruzamento de HE versus volume da doca.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 0: SUPRIMENTOS & COMPRAS INTERNAS (NOVA SEÇÃO) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Suprimentos & Compras Internas do Armazém
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/compras/pedidos"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-white">Pedidos de Compra (Insumos Doca & EPIs)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Requisições de compra de bobinas de filme stretch, paletes vazios PBR, fitas adesivas e EPIs. Ao aprovar, gera título automático no Contas a Pagar.
            </p>
          </Link>

          <Link
            href="/dashboard/cadastros/servicos"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-white">Catálogo de Serviços & Tabela de Preços</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precificação de paletização, aplicação de stretch e desova manual para repasse e cobrança imediata dos depositantes na doca.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 1: FINANCEIRO BASE (AP/AR) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Financeiro Base & Gestão de Caixa (AP/AR)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/financeiro/pagar"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-rose-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ArrowDownCircle className="w-6 h-6 text-rose-500" />
              <h3 className="text-base font-bold text-white">Contas a Pagar (Despesas)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gestão de despesas operacionais do armazém: concessionárias de energia/água, manutenção de empilhadeiras, aluguel e títulos de insumos.
            </p>
          </Link>

          <Link
            href="/dashboard/financeiro/receber"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl space-y-2 transition-all hover:scale-[1.01] block shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Contas a Receber (Clientes)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cobranças de armazenagem decendial, handling de carga, paletização spot e controle de conciliação com QR Code Pix.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 2: CADASTROS BASE & CRM */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Cadastros Base & CRM Logístico
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <h3 className="text-base font-bold text-white">Fornecedores & Frotas</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Frotas homologadas, transportadoras parceiras e fornecedores de embalagens, paletes e insumos de doca.
            </p>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 3: OPERAÇÃO DE CAMPO / DOCA (PWA) */}
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

      {/* SEÇÃO 4: TORRE DE CONTROLE & GESTÃO VISUAL DE PÁTIO */}
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

      {/* SEÇÃO 5: SUPPLY CHAIN, ERP FISCAL & TMS */}
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

      {/* SEÇÃO 6: CLIENTE EXTERNO B2B & ACADEMY */}
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
