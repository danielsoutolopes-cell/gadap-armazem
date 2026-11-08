import "./globals.css";
import type { Metadata } from "next";
import OfficeErpLayout from "@/components/OfficeErpLayout";

export const metadata: Metadata = {
  title: "GADAP ERP & WMS | Sistema Corporativo Integrado",
  description: "ERP & WMS Logístico Corporativo Multi-tenant com Gestão Completa de Escritório e Operação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <OfficeErpLayout>{children}</OfficeErpLayout>
      </body>
    </html>
  );
}

