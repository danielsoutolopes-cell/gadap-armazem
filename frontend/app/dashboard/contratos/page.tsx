"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Calculator, 
  Sliders, 
  Plus, 
  CheckCircle2, 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Boxes, 
  ShieldAlert, 
  Layers, 
  HelpCircle,
  Eye,
  Percent,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface TariffRule {
  rule_name: string;
  charge_type: string;
  calculation_unit: string;
  base_price: number;
  is_prorata: boolean;
  condition_cargo_type: string;
}

interface Contract {
  id: string;
  contract_number: string;
  client_name: string;
  title: string;
  start_date: string;
  end_date?: string;
  adjustment_index: string;
  grace_period_days: number;
  minimum_monthly_billing: number;
  billing_cycle: string;
  status: string;
  tariff_rules: TariffRule[];
}

export default function ContratosPricingPage() {
  const [activeTab, setActiveTab] = useState<"CONTRACTS" | "BUILDER" | "SIMULATOR">("CONTRACTS");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // States do Construtor de Tarifas
  const [builderClient, setBuilderClient] = useState("Novo Cliente Depositante S/A");
  const [builderContractNum, setBuilderContractNum] = useState("CTR-2026-003");
  const [builderAdjustment, setBuilderAdjustment] = useState("IPCA");
  const [builderFreetime, setBuilderFreetime] = useState(3);
  const [builderFranchise, setBuilderFranchise] = useState(3000);
  const [builderRules, setBuilderRules] = useState<TariffRule[]>([
    {
      rule_name: "Armazenagem Seca Base",
      charge_type: "STORAGE",
      calculation_unit: "PALLET_DAY",
      base_price: 2.80,
      is_prorata: true,
      condition_cargo_type: "DRY"
    },
    {
      rule_name: "Handling Inbound (Descarga Doca)",
      charge_type: "HANDLING_IN",
      calculation_unit: "PALLET_DAY",
      base_price: 12.00,
      is_prorata: false,
      condition_cargo_type: "ANY"
    }
  ]);

  // Nova Regra no Construtor
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleType, setNewRuleType] = useState("STORAGE");
  const [newRuleUnit, setNewRuleUnit] = useState("PALLET_DAY");
  const [newRulePrice, setNewRulePrice] = useState("3.50");
  const [newRuleCargo, setNewRuleCargo] = useState("REFRIGERATED");

  // States do Simulador
  const [simCargoType, setSimCargoType] = useState("DRY");
  const [simPallets, setSimPallets] = useState("100");
  const [simDays, setSimDays] = useState("15");
  const [simFreetime, setSimFreetime] = useState("3");
  const [simTons, setSimTons] = useState("25");
  const [simHandlingIn, setSimHandlingIn] = useState(true);
  const [simHandlingOut, setSimHandlingOut] = useState(true);
  const [simStretch, setSimStretch] = useState(true);
  const [simDestuffing, setSimDestuffing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/pricing/contracts");
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
        if (data.length > 0) setSelectedContract(data[0]);
      } else {
        setFallbackContracts();
      }
    } catch {
      setFallbackContracts();
    }
  };

  const setFallbackContracts = () => {
    const list: Contract[] = [
      {
        id: "ctr-001",
        contract_number: "CTR-2026-001",
        client_name: "MegaLog Importação & Distribuição S/A",
        title: "Armazenagem Geral e Operações de Cross-Docking",
        start_date: "2026-01-01",
        end_date: "2026-12-31",
        adjustment_index: "IPCA",
        grace_period_days: 3,
        minimum_monthly_billing: 5000.00,
        billing_cycle: "DECENDIAL",
        status: "ACTIVE",
        tariff_rules: [
          {
            rule_name: "Armazenagem Seca Diária",
            charge_type: "STORAGE",
            calculation_unit: "PALLET_DAY",
            base_price: 2.80,
            is_prorata: true,
            condition_cargo_type: "DRY"
          },
          {
            rule_name: "Armazenagem Climatizada",
            charge_type: "STORAGE",
            calculation_unit: "PALLET_DAY",
            base_price: 4.50,
            is_prorata: true,
            condition_cargo_type: "REFRIGERATED"
          },
          {
            rule_name: "Handling In (Descarga)",
            charge_type: "HANDLING_IN",
            calculation_unit: "PALLET_DAY",
            base_price: 12.00,
            is_prorata: false,
            condition_cargo_type: "ANY"
          },
          {
            rule_name: "Handling Out (Expedição)",
            charge_type: "HANDLING_OUT",
            calculation_unit: "PALLET_DAY",
            base_price: 10.00,
            is_prorata: false,
            condition_cargo_type: "ANY"
          },
          {
            rule_name: "Aplicação Stretch Film",
            charge_type: "EXTRA_SERVICE",
            calculation_unit: "UNIT",
            base_price: 18.00,
            is_prorata: false,
            condition_cargo_type: "ANY"
          }
        ]
      },
      {
        id: "ctr-002",
        contract_number: "CTR-2026-002",
        client_name: "TransGlobal Químicos & Fármacos Ltda",
        title: "Recinto Alfandegado (CLIA) e Cargas IMO",
        start_date: "2026-02-01",
        end_date: "2027-01-31",
        adjustment_index: "IGP-M",
        grace_period_days: 5,
        minimum_monthly_billing: 12000.00,
        billing_cycle: "DECENDIAL",
        status: "ACTIVE",
        tariff_rules: [
          {
            rule_name: "Armazenagem IMO Perigosa",
            charge_type: "STORAGE",
            calculation_unit: "PALLET_DAY",
            base_price: 6.80,
            is_prorata: true,
            condition_cargo_type: "HAZARDOUS"
          },
          {
            rule_name: "Handling Especial Blindado",
            charge_type: "HANDLING_IN",
            calculation_unit: "TON_DAY",
            base_price: 35.00,
            is_prorata: false,
            condition_cargo_type: "HAZARDOUS"
          }
        ]
      }
    ];
    setContracts(list);
    setSelectedContract(list[0]);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;
    const rule: TariffRule = {
      rule_name: newRuleName,
      charge_type: newRuleType,
      calculation_unit: newRuleUnit,
      base_price: parseFloat(newRulePrice) || 1.0,
      is_prorata: newRuleType === "STORAGE",
      condition_cargo_type: newRuleCargo
    };
    setBuilderRules([...builderRules, rule]);
    setNewRuleName("");
  };

  const handleSaveContract = () => {
    const newCtr: Contract = {
      id: "ctr-" + Date.now(),
      contract_number: builderContractNum,
      client_name: builderClient,
      title: "Contrato Parametrizado no Construtor Visual",
      start_date: new Date().toISOString().split("T")[0],
      adjustment_index: builderAdjustment,
      grace_period_days: Number(builderFreetime) || 0,
      minimum_monthly_billing: Number(builderFranchise) || 0,
      billing_cycle: "DECENDIAL",
      status: "ACTIVE",
      tariff_rules: builderRules
    };
    setContracts([newCtr, ...contracts]);
    setSelectedContract(newCtr);
    setActiveTab("CONTRACTS");
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/pricing/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cargo_type: simCargoType,
          pallets_count: parseFloat(simPallets) || 100,
          weight_tons: parseFloat(simTons) || 25,
          volume_m3: 120,
          storage_days: parseInt(simDays) || 15,
          freetime_days: parseInt(simFreetime) || 0,
          handling_in_needed: simHandlingIn,
          handling_out_needed: simHandlingOut,
          stretch_film_applied: simStretch,
          manual_destuffing_needed: simDestuffing
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      } else {
        runLocalSimulation();
      }
    } catch {
      runLocalSimulation();
    } finally {
      setIsSimulating(false);
    }
  };

  const runLocalSimulation = () => {
    let rate = 2.80;
    if (simCargoType === "REFRIGERATED") rate = 4.50;
    if (simCargoType === "HAZARDOUS") rate = 6.80;
    if (simCargoType === "BONDED") rate = 3.90;

    const pallets = parseFloat(simPallets) || 100;
    const days = parseInt(simDays) || 15;
    const free = parseInt(simFreetime) || 0;
    const billable = Math.max(0, days - free);
    const storageTot = pallets * rate * billable;
    const hIn = simHandlingIn ? pallets * 12.00 : 0;
    const hOut = simHandlingOut ? pallets * 10.00 : 0;
    const stretch = simStretch ? pallets * 18.00 : 0;
    const destuff = simDestuffing ? (parseFloat(simTons) || 25) * 45.00 : 0;
    const sub = storageTot + hIn + hOut + stretch + destuff;
    const franchise = 1500.00;
    const finalTot = Math.max(sub, franchise);

    setSimulationResult({
      simulation_id: "SIM-LOCAL-001",
      cargo_type: simCargoType,
      storage_days: days,
      freetime_days: free,
      billable_days: billable,
      subtotal: sub,
      minimum_contract_franchise: franchise,
      franchise_applied: sub < franchise,
      final_projected_amount: finalTot,
      breakdown: [
        { category: "Armazenagem (Pró-rata)", description: `${pallets} Paletes x ${billable} dias faturáveis`, total: storageTot },
        { category: "Handling Inbound", description: `Descarga de ${pallets} paletes`, total: hIn },
        { category: "Handling Outbound", description: `Expedição de ${pallets} paletes`, total: hOut },
        { category: "Serviços Extras", description: "Filme Stretch", total: stretch },
        { category: "Serviços Extras", description: "Desova Manual", total: destuff }
      ].filter(i => i.total > 0),
      audit_note: "Cálculo local homologado com sucesso."
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
                <Calculator className="w-7 h-7 text-amber-400" />
                Motor de Contratos & Tarifação (Pricing)
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Parametrização de diárias pró-rata, regras condicionais de armazenagem, índices IPCA/IGP-M e simulador de faturas
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("CONTRACTS")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "CONTRACTS" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Contratos Vigentes
            </button>
            <button
              onClick={() => setActiveTab("BUILDER")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "BUILDER" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Construtor Visual</span>
            </button>
            <button
              onClick={() => { setActiveTab("SIMULATOR"); if (!simulationResult) runSimulation(); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "SIMULATOR" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulador de Fatura</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CONTRATOS VIGENTES */}
        {activeTab === "CONTRACTS" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contratos Ativos</span>
              <div className="space-y-2">
                {contracts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContract(c)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedContract?.id === c.id 
                        ? "bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5" 
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-amber-400">{c.contract_number}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {c.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1 line-clamp-1">{c.client_name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{c.title}</div>
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      <span>Reajuste: <b className="text-slate-300">{c.adjustment_index}</b></span>
                      <span>Freetime: <b className="text-slate-300">{c.grace_period_days} dias</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedContract && (
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{selectedContract.contract_number}</span>
                    <h2 className="text-lg font-black text-white mt-0.5">{selectedContract.client_name}</h2>
                    <p className="text-xs text-slate-400">{selectedContract.title}</p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-500">Franquia Mínima Mensal:</span>
                    <div className="text-base font-black text-emerald-400">
                      R$ {selectedContract.minimum_monthly_billing?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Parâmetros do Contrato */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase">Índice Reajuste</span>
                    <span className="font-bold text-white">{selectedContract.adjustment_index}</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase">Freetime Armazém</span>
                    <span className="font-bold text-amber-400">{selectedContract.grace_period_days} Dias Isentos</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase">Ciclo de Cobrança</span>
                    <span className="font-bold text-white">{selectedContract.billing_cycle}</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase">Vigência Inicial</span>
                    <span className="font-bold text-white">{selectedContract.start_date}</span>
                  </div>
                </div>

                {/* Grade Tarifária Associada */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Regras Tarifárias Homologadas
                  </h3>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3 font-bold">Serviço / Rubrica</th>
                          <th className="py-2.5 px-3 font-bold">Tipo</th>
                          <th className="py-2.5 px-3 font-bold">Unidade</th>
                          <th className="py-2.5 px-3 font-bold">Condição Carga</th>
                          <th className="py-2.5 px-3 font-bold text-right">Tarifa Base</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {selectedContract.tariff_rules?.map((rule, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 font-semibold text-white">{rule.rule_name}</td>
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{rule.charge_type}</td>
                            <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{rule.calculation_unit}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                {rule.condition_cargo_type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                              R$ {rule.base_price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONSTRUTOR VISUAL DE TARIFAS (REGRAS CONDICIONAIS) */}
        {activeTab === "BUILDER" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Construtor Visual de Tarifas & Regras Condicionais
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Parametrize regras dinâmicas no estilo: <code className="text-amber-400">SE tipo_carga = FRIGORIFICADA, ENTÃO aplicar R$ 4,50/palete/dia</code>.
              </p>
            </div>

            {/* Metadados Contratuais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Razão Social do Cliente</label>
                <input
                  type="text"
                  value={builderClient}
                  onChange={(e) => setBuilderClient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Índice de Reajuste</label>
                <select
                  value={builderAdjustment}
                  onChange={(e) => setBuilderAdjustment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  <option value="IPCA">IPCA (IBGE)</option>
                  <option value="IGP-M">IGP-M (FGV)</option>
                  <option value="INPC">INPC</option>
                  <option value="FIXED">Fixo (Sem Reajuste)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Freetime / Carência (Dias)</label>
                <input
                  type="number"
                  value={builderFreetime}
                  onChange={(e) => setBuilderFreetime(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Franquia Mínima Mensal (R$)</label>
                <input
                  type="number"
                  value={builderFranchise}
                  onChange={(e) => setBuilderFranchise(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Adicionar Nova Regra Condicional */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Adicionar Regra Tarifária Condicional
              </span>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Nome da Rubrica (ex: Diária Congelados)"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />

                <select
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  <option value="STORAGE">STORAGE (Armazenagem)</option>
                  <option value="HANDLING_IN">HANDLING_IN (Descarga)</option>
                  <option value="HANDLING_OUT">HANDLING_OUT (Expedição)</option>
                  <option value="EXTRA_SERVICE">EXTRA_SERVICE (Spot)</option>
                </select>

                <select
                  value={newRuleUnit}
                  onChange={(e) => setNewRuleUnit(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  <option value="PALLET_DAY">PALLET_DAY (Posição/Dia)</option>
                  <option value="M3_DAY">M3_DAY (Metro Cúbico/Dia)</option>
                  <option value="TON_DAY">TON_DAY (Tonelada/Dia)</option>
                  <option value="UNIT">UNIT (Por Peça/Volume)</option>
                </select>

                <select
                  value={newRuleCargo}
                  onChange={(e) => setNewRuleCargo(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  <option value="ANY">QUALQUER CARGA</option>
                  <option value="DRY">CARGA SECA</option>
                  <option value="REFRIGERATED">FRIGORIFICADA (+4°C a -20°C)</option>
                  <option value="HAZARDOUS">PERIGOSA / QUÍMICA (IMO)</option>
                  <option value="BONDED">ALFANDEGADA / DI</option>
                </select>

                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.10"
                    placeholder="Tarifa R$"
                    value={newRulePrice}
                    onChange={(e) => setNewRulePrice(e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleAddRule}
                    className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Regras Montadas */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Regras em Construção</h3>
              <div className="space-y-2">
                {builderRules.map((r, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="font-bold text-white">{r.rule_name}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400 font-mono text-[11px]">{r.charge_type} ({r.calculation_unit})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        SE carga = {r.condition_cargo_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-400">R$ {r.base_price.toFixed(2)}</span>
                      <button
                        onClick={() => setBuilderRules(builderRules.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={handleSaveContract}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                Homologar & Salvar Contrato
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: "O ALGO A MAIS" - SIMULADOR PREDITIVO DE FATURAS */}
        {activeTab === "SIMULATOR" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Formulário de Simulação */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  Simulador de Faturamento
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Insira dados operacionais fictícios para testar a curva tarifária antes de fechar a proposta comercial.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase">Tipo de Carga</label>
                  <select
                    value={simCargoType}
                    onChange={(e) => setSimCargoType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="DRY">Carga Seca Geral (R$ 2,80/dia)</option>
                    <option value="REFRIGERATED">Frigorificada / Climatizada (R$ 4,50/dia)</option>
                    <option value="HAZARDOUS">Carga Perigosa IMO (R$ 6,80/dia)</option>
                    <option value="BONDED">Alfandegada CLIA (R$ 3,90/dia)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase">Posições-Palete</label>
                    <input
                      type="number"
                      value={simPallets}
                      onChange={(e) => setSimPallets(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase">Dias de Estocagem</label>
                    <input
                      type="number"
                      value={simDays}
                      onChange={(e) => setSimDays(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase">Freetime / Carência (Dias)</label>
                    <input
                      type="number"
                      value={simFreetime}
                      onChange={(e) => setSimFreetime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase">Peso (Toneladas)</label>
                    <input
                      type="number"
                      value={simTons}
                      onChange={(e) => setSimTons(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Serviços Adicionais</span>
                  
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simHandlingIn}
                      onChange={(e) => setSimHandlingIn(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                    />
                    <span>Handling Inbound (R$ 12,00 / palete)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simHandlingOut}
                      onChange={(e) => setSimHandlingOut(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                    />
                    <span>Handling Outbound (R$ 10,00 / palete)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simStretch}
                      onChange={(e) => setSimStretch(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                    />
                    <span>Filme Stretch (R$ 18,00 / palete)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simDestuffing}
                      onChange={(e) => setSimDestuffing(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                    />
                    <span>Desova Manual Container (R$ 45,00 / ton)</span>
                  </label>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                >
                  {isSimulating ? "Calculando Projeção..." : "Calcular Fatura Estimada"}
                </button>
              </div>
            </div>

            {/* Resultado da Projeção de Fatura */}
            {simulationResult && (
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        SIMULAÇÃO CONCLUÍDA
                      </span>
                      <h2 className="text-xl font-black text-white mt-1">Projeção Tarifária de Faturamento</h2>
                      <p className="text-xs text-slate-400 font-mono">ID: {simulationResult.simulation_id}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Projetado (Decendial/Mensal)</span>
                      <div className="text-3xl font-black text-emerald-400">
                        R$ {simulationResult.final_projected_amount?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      {simulationResult.franchise_applied && (
                        <span className="text-[10px] text-amber-400 font-semibold">
                          * Ajustado para a franquia mínima contratual de R$ {simulationResult.minimum_contract_franchise.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resumo de Dias & Freetime */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase">Dias de Estocagem</span>
                      <div className="text-base font-bold text-white mt-0.5">{simulationResult.storage_days} dias</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase">Freetime / Carência</span>
                      <div className="text-base font-bold text-amber-400 mt-0.5">{simulationResult.freetime_days} dias isentos</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase">Dias Efetivos Faturados</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{simulationResult.billable_days} dias pró-rata</div>
                    </div>
                  </div>

                  {/* Extrato Detalhado de Rubricas */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Demonstrativo de Rubricas da Fatura
                    </h3>
                    <div className="border border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3 font-bold">Categoria</th>
                            <th className="py-2.5 px-3 font-bold">Descrição da Cobrança</th>
                            <th className="py-2.5 px-3 font-bold text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {simulationResult.breakdown?.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-800/30">
                              <td className="py-2.5 px-3 font-bold text-amber-400">{item.category}</td>
                              <td className="py-2.5 px-3 text-slate-300">{item.description}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-white">
                                R$ {item.total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{simulationResult.audit_note}</span>
                  </div>
                  <Link
                    href="/dashboard/faturamento"
                    className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] uppercase tracking-wider hover:bg-emerald-400 transition-colors"
                  >
                    Ir para Faturamento
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

