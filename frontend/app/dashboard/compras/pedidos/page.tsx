"use client";

import React, { useState } from "react";
import { 
  ShoppingCart, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  X, 
  Package, 
  Layers, 
  Check, 
  ArrowRight
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_name: string;
  category_label: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "RECEIVED";
  total_amount: number;
  created_at: string;
  items_count: number;
  items: Array<{ description: string; quantity: number; unit: string; unit_cost: number }>;
}

export default function PedidosCompraPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: "po-001",
      order_number: "OC-2026-0042",
      supplier_name: "Paletes Brasil Embalagens de Madeira Ltda",
      category_label: "Embalagens & Paletes",
      status: "APPROVED",
      total_amount: 9000.00,
      created_at: "05/11/2026",
      items_count: 1,
      items: [
        { description: "Palete de Madeira PBR Tratado ABRAS", quantity: 200, unit: "UN", unit_cost: 45.00 }
      ]
    },
    {
      id: "po-002",
      order_number: "OC-2026-0043",
      supplier_name: "MegaFlex Bobinas & Stretch Ltda",
      category_label: "Insumos Operacionais",
      status: "PENDING_APPROVAL",
      total_amount: 3750.00,
      created_at: "Hoje às 14:20",
      items_count: 1,
      items: [
        { description: "Bobina de Filme Stretch 25 micras 500mm", quantity: 50, unit: "ROLO", unit_cost: 75.00 }
      ]
    },
    {
      id: "po-003",
      order_number: "OC-2026-0044",
      supplier_name: "Protec EPIs e Uniformes Industriais",
      category_label: "EPIs Operadores",
      status: "PENDING_APPROVAL",
      total_amount: 1840.00,
      created_at: "Hoje às 16:00",
      items_count: 2,
      items: [
        { description: "Luva de Vaqueta Mista Térmica", quantity: 40, unit: "PAR", unit_cost: 28.00 },
        { description: "Colete Refletivo com Zíper", quantity: 24, unit: "UN", unit_cost: 30.00 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Form states
  const [supplierName, setSupplierName] = useState("");
  const [category, setCategory] = useState("PACKAGING");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(100);
  const [unitCost, setUnitCost] = useState<number>(45.00);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const total = quantity * unitCost;
    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      order_number: `OC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier_name: supplierName,
      category_label: category === "PACKAGING" ? "Paletes & Embalagens" : category === "EPIS" ? "EPIs" : "Insumos Gerais",
      status: "PENDING_APPROVAL",
      total_amount: total,
      created_at: "Agora",
      items_count: 1,
      items: [
        { description: itemDescription, quantity: quantity, unit: "UN", unit_cost: unitCost }
      ]
    };

    setOrders([newOrder, ...orders]);
    setIsSaving(false);
    setIsModalOpen(false);
    setSupplierName("");
    setItemDescription("");
  };

  const handleApprove = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/procurement/orders/${orderId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({ due_days: 30 })
      });
      const data = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "APPROVED" as const } : o));
      alert(`Ordem de compra aprovada!\n${data.financial_integration.message}`);
    } catch (err: any) {
      alert("Erro ao aprovar pedido: " + err.message);
    }
  };

  const filtered = orders.filter(o =>
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Suprimentos & Compras Internas
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Requisição de insumos de doca (paletes PBR, filme stretch, fitas) e EPIs com lançamento automático no Contas a Pagar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl hover:border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Fluxo de Aprovação
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Novo Pedido de Compra
          </button>
        </div>
      </header>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por Número da Ordem ou Fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Grid de Pedidos de Compra */}
      <div className="space-y-4">
        {filtered.map((order) => {
          const isPending = order.status === "PENDING_APPROVAL";
          return (
            <div
              key={order.id}
              className={`p-6 rounded-2xl border transition-all ${
                isPending ? "bg-slate-900 border-amber-500/40" : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-black text-white">{order.order_number}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                      isPending ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}>
                      {isPending ? "Aguardando Aprovação" : "Aprovado / Faturado"}
                    </span>
                    <span className="text-xs text-slate-400">{order.category_label}</span>
                  </div>

                  <p className="text-sm font-semibold text-slate-200">{order.supplier_name}</p>

                  <div className="text-xs text-slate-400 space-y-0.5 pt-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span>• {it.description}:</span>
                        <span className="font-bold text-slate-300">{it.quantity} {it.unit} (R$ {it.unit_cost.toFixed(2)} un)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase">Valor Total</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      R$ {order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  {isPending && (
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Aprovar Compra
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Cadastro de Pedido */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-amber-400 uppercase">Novo Pedido de Compra Interna</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Fornecedor Homologado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paletes Brasil Ltda ou MegaFlex"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Categoria de Suprimentos</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="PACKAGING">Paletes de Madeira PBR & Embalagens</option>
                  <option value="SUPPLIES">Filme Stretch, Fitas & Insumos</option>
                  <option value="EPIS">EPIs (Luvas, Coletes, Botinas)</option>
                  <option value="MAINTENANCE_PARTS">Peças de Reposição de Empilhadeiras</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Descrição do Item Solicitado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paletes PBR ABRAS padrão ou Bobinas 25 micras"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Quantidade</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-400 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <span>Total Estimado da Requisição: </span>
                <span className="font-bold text-amber-400 font-mono">R$ {(quantity * unitCost).toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                {isSaving ? "Gerando Pedido..." : "Emitir Pedido de Compra"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajuda Compras */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-amber-400 uppercase">Ciclo de Suprimentos & Contas a Pagar</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <b>Requisição de Compra:</b> Envolve a compra de materiais de consumo do armazém (paletes para repaletização, filme stretch para doca, EPIs).</p>
              <p>• <b>Automação Financeira:</b> Ao clicar no botão <b>Aprovar Compra</b>, o WMS gera automaticamente uma obrigação no módulo <b>Contas a Pagar</b> com prazo padrão de 30 dias.</p>
              <p>• <b>Entrada Físico-Estoque:</b> Os insumos comprados ficam disponíveis para os operadores de doca cobrarem como serviço extra dos depositantes.</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

