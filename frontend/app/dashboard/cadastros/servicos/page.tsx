"use client";

import React, { useState } from "react";
import { 
  Tag, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  X,
  DollarSign,
  Building2,
  Lock,
  Globe,
  ShieldCheck,
  FileCode,
  Layers,
  Sparkles
} from "lucide-react";

interface ServiceItem {
  id: string;
  service_sku: string;
  name: string;
  category: string;
  category_label: string;
  unit_of_measure: string;
  unit_label: string;
  base_price: number;
  item_lc116: string;
  cfop: string;
  aliquota_iss: number;
  is_bonded_customs: boolean;
  client_scope: "GLOBAL_ARMAZEM" | "EXCLUSIVO_CLIENTE";
  client_name?: string;
  description: string;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-01",
    service_sku: "SRV-ARM-DEC-CIF",
    name: "Armazenagem Decendial Geral Ad Valorem (Sobre Valor CIF)",
    category: "STORAGE",
    category_label: "Armazenagem",
    unit_of_measure: "DECENDIO_CIF",
    unit_label: "% sobre CIF (10 dias)",
    base_price: 0.0050,
    item_lc116: "11.04",
    cfop: "5906",
    aliquota_iss: 5.0,
    is_bonded_customs: false,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Tarifa decendial de permanência calculada sobre o valor aduaneiro/comercial CIF da mercadoria."
  },
  {
    id: "srv-02",
    service_sku: "SRV-ARM-PAL-DIA",
    name: "Diária de Armazenagem por Posição-Palete PBR (Dry)",
    category: "STORAGE",
    category_label: "Armazenagem",
    unit_of_measure: "DIARIA_PALETE",
    unit_label: "Diária / Palete",
    base_price: 2.85,
    item_lc116: "11.04",
    cfop: "5906",
    aliquota_iss: 5.0,
    is_bonded_customs: false,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Cobrança unitária por palete padrão PBR armazenado em estrutura porta-paletes convencional."
  },
  {
    id: "srv-03",
    service_sku: "SRV-ARM-CLIMAT",
    name: "Diária de Armazenagem Climatizada (15°C a 25°C) - Farmacêutico",
    category: "STORAGE",
    category_label: "Armazenagem Especial",
    unit_of_measure: "DIARIA_PALETE",
    unit_label: "Diária / Palete",
    base_price: 5.40,
    item_lc116: "11.04",
    cfop: "5906",
    aliquota_iss: 5.0,
    is_bonded_customs: false,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Armazenamento com controle estrito de temperatura e umidade com monitoramento 24h certificado ANVISA."
  },
  {
    id: "srv-04",
    service_sku: "SRV-ARM-CONG-FR",
    name: "Diária de Armazenagem em Câmara Frigorificada (-18°C a -22°C)",
    category: "STORAGE",
    category_label: "Armazenagem Especial",
    unit_of_measure: "DIARIA_PALETE",
    unit_label: "Diária / Palete",
    base_price: 8.90,
    item_lc116: "11.04",
    cfop: "5906",
    aliquota_iss: 5.0,
    is_bonded_customs: false,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Câmara de congelados com controle de temperatura para produtos alimentícios e carnes com SIF."
  },
  {
    id: "srv-05",
    service_sku: "SRV-HDL-IN-TON",
    name: "Handling Inbound - Descarga, Triagem e Entrada em Porta-Paletes",
    category: "HANDLING",
    category_label: "Movimentação Doca",
    unit_of_measure: "TONELADA",
    unit_label: "Por Tonelada",
    base_price: 35.00,
    item_lc116: "11.04",
    cfop: "1905",
    aliquota_iss: 5.0,
    is_bonded_customs: false,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Operação física de descarregamento de carreta, conferência cega e endereçamento vertical no estoque."
  },
  {
    id: "srv-06",
    service_sku: "SRV-DESOVA-40FT",
    name: "Desova Mecanizada de Container High Cube 40 pés (Inbound)",
    category: "HANDLING",
    category_label: "Movimentação Doca",
    unit_of_measure: "CONTAINER_UN",
    unit_label: "Por Container",
    base_price: 950.00,
    item_lc116: "11.04",
    cfop: "1905",
    aliquota_iss: 5.0,
    is_bonded_customs: true,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Retirada da carga do container marítimo de 40 pés, paletização primária e remoção do casco da doca."
  },
  {
    id: "srv-07",
    service_sku: "SRV-ADU-POS-FISC",
    name: "Posicionamento para Vistoria da Receita Federal / MAPA / Anvisa",
    category: "CUSTOMS_CLEARANCE",
    category_label: "Aduaneiro / EADI",
    unit_of_measure: "CONTAINER_UN",
    unit_label: "Por Vistoria",
    base_price: 420.00,
    item_lc116: "11.04",
    cfop: "5949",
    aliquota_iss: 5.0,
    is_bonded_customs: true,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Deslocamento de container para a área de inspeção física dos órgãos anuentes no recinto alfandegado."
  },
  {
    id: "srv-08",
    service_sku: "SRV-ADU-DEMURRAGE",
    name: "Gestão Preventiva e Devolução de Container Vazio (Demurrage Free-Time)",
    category: "CUSTOMS_CLEARANCE",
    category_label: "Aduaneiro / EADI",
    unit_of_measure: "CONTAINER_UN",
    unit_label: "Por Casco",
    base_price: 85.00,
    item_lc116: "11.04",
    cfop: "0000",
    aliquota_iss: 5.0,
    is_bonded_customs: true,
    client_scope: "GLOBAL_ARMAZEM",
    description: "Controle diário do free-time com o armador marítimo e coordenação de agendamento de devolução no porto."
  },
  {
    id: "srv-09",
    service_sku: "SKU-SAMS-RETRABALHO",
    name: "Retrabalho de Placas e Troca de Cabos HDMI (Exclusivo Samsung)",
    category: "VALUE_ADDED",
    category_label: "Serviço Customizado",
    unit_of_measure: "UNIDADE",
    unit_label: "Por Aparelho",
    base_price: 14.50,
    item_lc116: "14.05",
    cfop: "5949",
    aliquota_iss: 5.0,
    is_bonded_customs: false,
    client_scope: "EXCLUSIVO_CLIENTE",
    client_name: "Samsung Eletrônica da Amazônia Ltda",
    description: "Linha de montagem especial interna para substituição de cabos de força e testes de conformidade elétrica."
  }
];

export default function ServicosCatalogoPage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulário de Cadastro
  const [serviceSku, setServiceSku] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("STORAGE");
  const [unitOfMeasure, setUnitOfMeasure] = useState("DIARIA_PALETE");
  const [basePrice, setBasePrice] = useState("");
  const [itemLc116, setItemLc116] = useState("11.04");
  const [cfop, setCfop] = useState("5906");
  const [isBonded, setIsBonded] = useState(false);
  const [isClientExclusive, setIsClientExclusive] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("EletroMundo Varejo S.A.");
  const [description, setDescription] = useState("");

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.service_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || s.category === categoryFilter;
    const matchesScope = scopeFilter === "ALL" || s.client_scope === scopeFilter;
    return matchesSearch && matchesCategory && matchesScope;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceSku || !serviceName || !basePrice) {
      alert("Preencha Código SKU, Nome do Serviço e Preço Base.");
      return;
    }

    const newService: ServiceItem = {
      id: "srv-" + Date.now(),
      service_sku: serviceSku.toUpperCase(),
      name: serviceName,
      category,
      category_label: category === "STORAGE" ? "Armazenagem" : category === "HANDLING" ? "Movimentação" : category === "CUSTOMS_CLEARANCE" ? "Aduaneiro / EADI" : "Valor Agregado (VAS)",
      unit_of_measure: unitOfMeasure,
      unit_label: unitOfMeasure === "DIARIA_PALETE" ? "Diária / Palete" : unitOfMeasure === "DECENDIO_CIF" ? "% sobre CIF" : unitOfMeasure === "TONELADA" ? "Por Tonelada" : "Por Unidade",
      base_price: parseFloat(basePrice) || 0,
      item_lc116: itemLc116,
      cfop: cfop,
      aliquota_iss: 5.0,
      is_bonded_customs: isBonded,
      client_scope: isClientExclusive ? "EXCLUSIVO_CLIENTE" : "GLOBAL_ARMAZEM",
      client_name: isClientExclusive ? selectedClientName : undefined,
      description
    };

    setServices([newService, ...services]);
    setIsModalOpen(false);
    // Limpeza
    setServiceSku("");
    setServiceName("");
    setBasePrice("");
    setDescription("");
    setIsClientExclusive(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              Catálogo Mestre • Armazéns Gerais & EADI Alfandegado
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tabelas Tarifárias de Serviços & SKUs Exclusivos
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Catálogo pré-parametrizado com os serviços regulatórios de armazéns gerais e recintos alfandegados 
              (LC 116 Item 11.04, CFOPs e ISS), permitindo criar SKUs customizados e restritos a cada cliente depositante.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo SKU de Serviço</span>
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por SKU, nome do serviço ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:border-blue-500"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="STORAGE">Armazenagem</option>
            <option value="HANDLING">Movimentação / Doca</option>
            <option value="CUSTOMS_CLEARANCE">Aduaneiro / EADI</option>
            <option value="VALUE_ADDED">Valor Agregado (VAS)</option>
          </select>

          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:border-blue-500"
          >
            <option value="ALL">Todos os Escopos</option>
            <option value="GLOBAL_ARMAZEM">Globais do Armazém</option>
            <option value="EXCLUSIVO_CLIENTE">Exclusivos por Cliente (SKU)</option>
          </select>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {srv.service_sku}
                </span>

                {srv.client_scope === "EXCLUSIVO_CLIENTE" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    <Lock className="w-3 h-3" />
                    Exclusivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    <Globe className="w-3 h-3" />
                    Global
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-tight line-clamp-2">{srv.name}</h3>
                {srv.client_name && (
                  <p className="text-[11px] text-purple-400 font-semibold mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {srv.client_name}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{srv.description}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
              {/* Parâmetros Fiscais */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>LC 116: <strong className="text-slate-200">{srv.item_lc116}</strong></span>
                <span>CFOP: <strong className="text-slate-200">{srv.cfop}</strong></span>
                <span>ISS: <strong className="text-slate-200">{srv.aliquota_iss}%</strong></span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-sans">{srv.unit_label}</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {srv.unit_of_measure === "DECENDIO_CIF" 
                    ? `${(srv.base_price * 100).toFixed(2)}% CIF`
                    : `R$ ${srv.base_price.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação de Serviço com SKU Exclusivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Cadastrar Serviço & SKU Tarifário</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código Único (SKU de Serviço)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: SKU-CLI-001"
                    value={serviceSku}
                    onChange={(e) => setServiceSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria Operacional</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  >
                    <option value="STORAGE">Armazenagem</option>
                    <option value="HANDLING">Movimentação Doca</option>
                    <option value="CUSTOMS_CLEARANCE">Aduaneiro / EADI</option>
                    <option value="VALUE_ADDED">Valor Agregado (VAS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Armazenagem Climatizada Especial"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidade de Cobrança</label>
                  <select
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  >
                    <option value="DIARIA_PALETE">Diária por Palete</option>
                    <option value="DECENDIO_CIF">% CIF por Decêndio</option>
                    <option value="TONELADA">Por Tonelada</option>
                    <option value="CONTAINER_UN">Por Container</option>
                    <option value="UNIDADE">Por Unidade / Peça</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preço Base (R$ ou Fator)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="Ex: 45.00 ou 0.005"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-emerald-400 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Parâmetros Fiscais (LC 116 e CFOP) */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Enquadramento Tributário Municipal & Estadual
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Item LC 116/03</label>
                    <input
                      type="text"
                      value={itemLc116}
                      onChange={(e) => setItemLc116(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">CFOP Padrão</label>
                    <input
                      type="text"
                      value={cfop}
                      onChange={(e) => setCfop(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Escopo do Cliente: Isolamento de Dados */}
              <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="exclusiveClient"
                    checked={isClientExclusive}
                    onChange={(e) => setIsClientExclusive(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="exclusiveClient" className="text-xs font-semibold text-purple-300 cursor-pointer">
                    Serviço Exclusivo de um Cliente Depositante (SKU Privado)
                  </label>
                </div>

                {isClientExclusive && (
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Cliente Vinculado</label>
                    <select
                      value={selectedClientName}
                      onChange={(e) => setSelectedClientName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                    >
                      <option value="Samsung Eletrônica da Amazônia Ltda">Samsung Eletrônica da Amazônia Ltda</option>
                      <option value="EletroMundo Varejo S.A.">EletroMundo Varejo S.A.</option>
                      <option value="BioPharma Brasil LTDA">BioPharma Brasil LTDA</option>
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Este serviço só será visível no billing e nos contratos deste cliente depositante.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição Detalhada</label>
                <textarea
                  rows={2}
                  placeholder="Detalhamento operacional da execução do serviço..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
