"use client";

import React, { useState } from "react";
import { 
  Truck, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  X,
  Phone,
  Mail
} from "lucide-react";

export default function FornecedoresPage() {
  const [suppliers, setSuppliers] = useState([
    {
      id: "sup-001",
      corporate_name: "Jadlog Logística S/A",
      trade_name: "Jadlog Express",
      document: "04.887.214/0001-90",
      supplier_type: "CARRIER",
      supplier_type_label: "Transportadora",
      email: "operacoes@jadlog.com.br",
      phone: "(11) 3988-1000",
      contact_person: "Carlos Mendes"
    },
    {
      id: "sup-002",
      corporate_name: "Braspress Transportes Urgentes Ltda",
      trade_name: "Braspress",
      document: "48.740.351/0001-65",
      supplier_type: "CARRIER",
      supplier_type_label: "Transportadora",
      email: "coletas@braspress.com.br",
      phone: "(11) 3429-8000",
      contact_person: "Fernanda Lima"
    },
    {
      id: "sup-003",
      corporate_name: "Paletes Brasil Embalagens de Madeira Ltda",
      trade_name: "Paletes Brasil",
      document: "12.443.129/0001-44",
      supplier_type: "PACKAGING",
      supplier_type_label: "Fornecedor de Paletes",
      email: "vendas@paletesbrasil.com.br",
      phone: "(13) 3221-4500",
      contact_person: "Ricardo Souza"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [corporateName, setCorporateName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [supplierType, setSupplierType] = useState("CARRIER");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/crm/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          corporate_name: corporateName,
          trade_name: tradeName,
          document: documentNumber,
          supplier_type: supplierType,
          email: email,
          phone: phone,
          contact_person: contactPerson
        })
      });
      const data = await res.json();
      setSuppliers((prev) => [data.supplier || {
        id: String(Date.now()),
        corporate_name: corporateName,
        trade_name: tradeName || corporateName,
        document: documentNumber,
        supplier_type: supplierType,
        supplier_type_label: supplierType === "CARRIER" ? "Transportadora" : "Insumos/Embalagens",
        email: email,
        phone: phone,
        contact_person: contactPerson
      }, ...prev]);
      setIsModalOpen(false);
      setCorporateName("");
      setTradeName("");
      setDocumentNumber("");
    } catch (err: any) {
      alert("Erro ao cadastrar fornecedor: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = suppliers.filter((s) =>
    s.corporate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.document.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Fornecedores & Transportadoras
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de frotas parceiras, transportadoras contratadas e fornecedores de paletes/insumos
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Parceiro / Transportador
        </button>
      </header>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por Empresa ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Lista de Fornecedores */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Razão Social / Nome Fantasia</th>
              <th className="py-4 px-4">CNPJ</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-6">Contato / Operações</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-white">{s.corporate_name}</div>
                  <div className="text-xs text-slate-400">{s.trade_name}</div>
                </td>
                <td className="py-4 px-4 font-mono text-slate-300 text-xs">{s.document}</td>
                <td className="py-4 px-4">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                    s.supplier_type === "CARRIER" 
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" 
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {s.supplier_type === "CARRIER" ? "Transportadora" : "Insumos"}
                  </span>
                </td>
                <td className="py-4 px-6 text-xs text-slate-300 space-y-0.5">
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {s.email}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> {s.phone}</div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Homologado
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
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-cyan-400 uppercase">Novo Fornecedor / Transportadora</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Braspress Transportes Urgentes Ltda"
                  value={corporateName}
                  onChange={(e) => setCorporateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">CNPJ</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Tipo de Parceiro</label>
                  <select
                    value={supplierType}
                    onChange={(e) => setSupplierType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CARRIER">Transportadora</option>
                    <option value="PACKAGING">Fornecedor Paletes/Filme</option>
                    <option value="MAINTENANCE">Manutenção Empilhadeiras</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">E-mail Operacional</label>
                  <input
                    type="email"
                    placeholder="operacao@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(00) 0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                {isSaving ? "Gravando..." : "Salvar Parceiro"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

