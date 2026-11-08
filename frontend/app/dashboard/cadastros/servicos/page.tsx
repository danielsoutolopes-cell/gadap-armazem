"use client";

import React, { useState } from "react";
import { 
  Tag, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  X,
  DollarSign
} from "lucide-react";

export default function ServicosCatalogoPage() {
  const [services, setServices] = useState([
    {
      id: "srv-001",
      service_code: "SRV-ARMAZ-DEC",
      name: "Armazenagem Decendial Geral",
      category: "STORAGE",
      category_label: "Armazenagem",
      unit_of_measure: "DECENDIO_CIF",
      unit_label: "Período 10 dias (% CIF)",
      base_price: 0.0050,
      description: "Diária decendial de permanência por período de 10 dias sobre valor CIF da carga."
    },
    {
      id: "srv-002",
      service_code: "SRV-PALET-PBR",
      name: "Paletização Padrão PBR",
      category: "PACKAGING",
      category_label: "Embalagem",
      unit_of_measure: "UNIDADE",
      unit_label: "Por Palete",
      base_price: 45.00,
      description: "Fornecimento de palete de madeira PBR tratado padrão ABRAS com amarração."
    },
    {
      id: "srv-003",
      service_code: "SRV-STRETCH-APL",
      name: "Aplicação de Filme Stretch",
      category: "PACKAGING",
      category_label: "Embalagem",
      unit_of_measure: "UNIDADE",
      unit_label: "Por Palete",
      base_price: 25.00,
      description: "Envelopamento com filme stretch 25 micras para estabilização de carga paletizada."
    },
    {
      id: "srv-004",
      service_code: "SRV-HANDLING-TON",
      name: "Movimentação Interna de Carga (Handling)",
      category: "HANDLING",
      category_label: "Movimentação",
      unit_of_measure: "TONELADA",
      unit_label: "Por Tonelada",
      base_price: 35.00,
      description: "Operação de empilhadeira e esteira para carga/descarga por tonelada métrica."
    },
    {
      id: "srv-005",
      service_code: "SRV-DESOVA-MANUAL",
      name: "Desova Manual de Container 20/40ft",
      category: "CUSTOMS_EXTRA",
      category_label: "Serviço Spot",
      unit_of_measure: "UNIDADE",
      unit_label: "Por Container",
      base_price: 450.00,
      description: "Equipe dedicada para desova de carga solta e estufagem manual de fardos e caixas."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceCode, setServiceCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("STORAGE");
  const [unitOfMeasure, setUnitOfMeasure] = useState("UNIDADE");
  const [basePrice, setBasePrice] = useState<number>(50.00);
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/crm/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          service_code: serviceCode,
          name: name,
          category: category,
          unit_of_measure: unitOfMeasure,
          base_price: basePrice,
          description: description
        })
      });
      const data = await res.json();
      setServices((prev) => [data.service || {
        id: String(Date.now()),
        service_code: serviceCode.toUpperCase(),
        name: name,
        category: category,
        category_label: category,
        unit_of_measure: unitOfMeasure,
        unit_label: unitOfMeasure,
        base_price: basePrice,
        description: description
      }, ...prev]);
      setIsModalOpen(false);
      setServiceCode("");
      setName("");
      setDescription("");
    } catch (err: any) {
      alert("Erro ao cadastrar serviço: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.service_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Tabela de Preços & Catálogo de Serviços
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Tarifário oficial de armazenagem, paletização, aplicação de stretch e serviços aduaneiros spot
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Item de Serviço
        </button>
      </header>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por Código ou Descrição do Serviço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Tabela de Serviços */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Código / Serviço</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-4">Unidade de Cobrança</th>
              <th className="py-4 px-6 text-right">Tarifa Base</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{s.service_code}</span>
                    <span className="font-bold text-white">{s.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {s.category_label || s.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs font-mono text-slate-300">
                  {s.unit_label || s.unit_of_measure}
                </td>
                <td className="py-4 px-6 text-right font-mono font-black text-emerald-400 text-base">
                  {s.unit_of_measure === "DECENDIO_CIF" 
                    ? `${(s.base_price * 100).toFixed(2)}% CIF`
                    : `R$ ${s.base_price.toFixed(2)}`
                  }
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-amber-400 uppercase">Novo Serviço / Tarifa Logística</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Código do Serviço</label>
                  <input
                    type="text"
                    required
                    placeholder="SRV-PALET-01"
                    value={serviceCode}
                    onChange={(e) => setServiceCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="STORAGE">Armazenagem</option>
                    <option value="HANDLING">Movimentação</option>
                    <option value="PACKAGING">Embalagem / Paletes</option>
                    <option value="CUSTOMS_EXTRA">Serviço Spot / Alfândega</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paletização PBR c/ Filme Stretch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Unidade</label>
                  <select
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="UNIDADE">Por Unidade / Palete</option>
                    <option value="TONELADA">Por Tonelada</option>
                    <option value="DECENDIO_CIF">Decêndio (% CIF)</option>
                    <option value="HORA">Por Hora</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Valor Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-400 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Detalhamento Operacional</label>
                <textarea
                  rows={2}
                  placeholder="Instruções e escopo deste serviço..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 mt-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                {isSaving ? "Gravando..." : "Salvar no Catálogo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

