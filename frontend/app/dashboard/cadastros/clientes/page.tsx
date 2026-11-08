"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  X,
  FileText
} from "lucide-react";

export default function ClientesPage() {
  const [clients, setClients] = useState([
    {
      id: "b2c3d4e5-0000-0000-0000-000000000002",
      name: "Samsung Eletrônica da Amazônia Ltda",
      document: "02.345.678/0001-99",
      created_at: "15/10/2026"
    },
    {
      id: "b2c3d4e5-0000-0000-0000-000000000003",
      name: "Huawei do Brasil Telecomunicações Ltda",
      document: "05.123.456/0001-88",
      created_at: "18/10/2026"
    },
    {
      id: "b2c3d4e5-0000-0000-0000-000000000004",
      name: "Bayer CropScience S/A",
      document: "18.998.776/0001-12",
      created_at: "22/10/2026"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/crm/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_token"
        },
        body: JSON.stringify({
          name: name,
          document: documentNumber
        })
      });
      const data = await res.json();
      setClients((prev) => [data.client || {
        id: String(Date.now()),
        name: name,
        document: documentNumber,
        created_at: "Agora"
      }, ...prev]);
      setIsModalOpen(false);
      setName("");
      setDocumentNumber("");
    } catch (err: any) {
      alert("Erro ao cadastrar cliente: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Cadastro de Clientes • Donos da Carga
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de depositantes, importadores e titulares contratuais de armazenagem
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Dono da Carga
        </button>
      </header>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar por Razão Social ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grid de Clientes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Razão Social / Nome</th>
              <th className="py-4 px-6">CNPJ / CPF</th>
              <th className="py-4 px-6">Data de Ingresso</th>
              <th className="py-4 px-6 text-center">Status Contratual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {c.name}
                </td>
                <td className="py-4 px-6 font-mono text-slate-300">{c.document}</td>
                <td className="py-4 px-6 text-xs text-slate-400">{c.created_at}</td>
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
          <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-indigo-400 uppercase">Novo Depositante (Dono da Carga)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Razão Social / Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Samsung Eletrônica da Amazônia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  CNPJ ou CPF (Obrigatório para NF-e/DI)
                </label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0001-00"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                {isSaving ? "Gravando..." : "Salvar Dono da Carga"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

