"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  Boxes,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("danielsmlopes@hotmail.com");
  const [password, setPassword] = useState("Gabriel2006");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qwihbotlqxpufqsbibvm.supabase.co";
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_qGn08MvpkoAg8PfqTU7iYQ_ZZHuLJlt";

      const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      // Login especial para a empresa TESTE LTDA (Ambiente Academy / Demonstração sem travas)
      if (email.trim().toLowerCase() === "teste@teste" && password === "teste") {
        const demoSession = {
          access_token: "demo-token-teste-ltda-" + Date.now(),
          user: {
            email: "teste@teste",
            role: "TENANT_OWNER",
            is_demo_tenant: true,
            tenant_name: "TESTE LTDA",
            tenant_cnpj: "00.000.000/0001-91",
            user_metadata: { 
              full_name: "Operador de Treinamento", 
              role: "TENANT_OWNER",
              is_demo_tenant: true,
              company: "TESTE LTDA"
            }
          }
        };
        // Inicializa/Reseta os dados fictícios da empresa TESTE LTDA
        localStorage.setItem("gadap_auth_token", demoSession.access_token);
        localStorage.setItem("gadap_user", JSON.stringify(demoSession.user));
        localStorage.setItem("gadap_is_demo", "true");
        router.push("/dashboard/academy");
        return;
      }

      if (!res.ok) {
        // Fallback especial caso tente logar com o teste@teste e o endpoint backend não reconheça
        if (email.trim().toLowerCase() === "teste@teste" && password === "teste") {
          const demoSession = {
            access_token: "demo-token-teste-ltda-" + Date.now(),
            user: {
              email: "teste@teste",
              role: "TENANT_OWNER",
              is_demo_tenant: true,
              tenant_name: "TESTE LTDA",
              tenant_cnpj: "00.000.000/0001-91",
              user_metadata: { 
                full_name: "Operador de Treinamento", 
                role: "TENANT_OWNER",
                is_demo_tenant: true,
                company: "TESTE LTDA"
              }
            }
          };
          localStorage.setItem("gadap_auth_token", demoSession.access_token);
          localStorage.setItem("gadap_user", JSON.stringify(demoSession.user));
          localStorage.setItem("gadap_is_demo", "true");
          router.push("/dashboard/academy");
          return;
        }

        // Fallback para ambiente local/demo se o banco ainda não rodou a migration de auth
        if (email.trim() === "danielsmlopes@hotmail.com" && password === "Gabriel2006") {
          const mockSession = {
            access_token: "mock-superadmin-token-" + Date.now(),
            user: {
              email: "danielsmlopes@hotmail.com",
              role: "SUPERADMIN",
              user_metadata: { full_name: "Daniel Souto Lopes", role: "SUPERADMIN" }
            }
          };
          localStorage.setItem("gadap_auth_token", mockSession.access_token);
          localStorage.setItem("gadap_user", JSON.stringify(mockSession.user));
          router.push("/dashboard/torre-controle");
          return;
        }
        throw new Error(data.error_description || data.msg || "Credenciais inválidas. Verifique seu e-mail e senha.");
      }

      // Login bem sucedido com Supabase Auth
      localStorage.setItem("gadap_auth_token", data.access_token);
      localStorage.setItem("gadap_user", JSON.stringify(data.user));

      const role = data.user?.app_metadata?.role || data.user?.user_metadata?.role || "SUPERADMIN";

      if (role === "CLIENT") {
        router.push("/portal-cliente");
      } else {
        router.push("/dashboard/torre-controle");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão ao autenticar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Elementos visuais de background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Header da Marca */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-2 shadow-inner">
            <Boxes className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider uppercase">
            GADAP Armazém
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Enterprise WMS & Logistics Suite
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Autenticação Segura
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Acesso corporativo unificado para operadores, auditores e superusuários.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo E-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@gadap.com.br"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Campo Senha com Toggle Visibility Obrigatório */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Palavra-passe / Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
                {/* Botão de Olhinho (Toggle Visibility) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 hover:text-slate-200 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Informação sobre credencial padrão & Empresa TESTE LTDA */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  Superadmin Produção:
                </span>
                <span className="text-slate-300 font-mono text-[11px]">danielsmlopes@hotmail.com</span>
              </div>

              <div 
                onClick={() => { setEmail("teste@teste"); setPassword("teste"); }}
                className="p-3 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-300 cursor-pointer transition"
                title="Clique para preencher as credenciais da empresa TESTE LTDA"
              >
                <div className="flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">Ambiente Academy (TESTE LTDA):</span>
                </div>
                <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
                  teste@teste / teste
                </span>
              </div>
            </div>

            {/* Botão de Entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A autenticar...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          GADAP Armazém • Multi-Tenant & RLS Enforcement • 2026
        </div>
      </div>
    </div>
  );
}

