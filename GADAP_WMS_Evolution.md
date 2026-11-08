# GADAP Armazém - Documento de Evolução WMS & Core Aduaneiro
**Gerado em:** 07/11/2026  
**Versão:** 3.0.0-PRO  
**Status do Projeto:** Homologado / Doca, Expedição, IA Scheduling, Blindagem Aduaneira, Torre de Controle, Faturamento e Portal B2B

---

## 1. Visão Geral da Arquitetura Logística

O sistema **GADAP Armazém** opera como uma plataforma WMS (Warehouse Management System) Multi-tenant, com suporte completo a Recintos Alfandegados (EADI, CLIAs, Portos Secos) e Centros de Distribuição Gerais. O isolamento de dados é estrito por Armazém/Galpão através de Row Level Security (RLS) no PostgreSQL/Supabase, acionado pela função `public.get_current_tenant()`.

---

## 2. Walkthrough da Torre de Controle Logística (Prompt 04)

A Torre de Controle (`app/dashboard/torre-controle/page.tsx`) oferece ao gerente operacional a gestão visual e analítica de todo o armazém:
1. **Capacidade Estática e Dinâmica:** Cálculo automático da taxa de ocupação percentual e do saldo de posições livres versus ocupadas.
2. **Mapa de Calor 2D por Ruas (Aisle Heatmap):** Cada rua é mapeada dinamicamente, permitindo visualizar os endereços físicos (ex: `RUA01-P1-N1`). Vagas em verde indicam disponibilidade; em vermelho indicam ocupação física por LPN.
3. **Monitoramento de Gargalos:** Alertas automáticos notificam quando uma doca permanece retida além do tempo limite (ex: descarga de container retida há mais de 4 horas).

---

## 3. Walkthrough de Expedição (Outbound) e Faturamento Recorrente (Prompt 05)

### 3.1. Motor de Separação (Picking & Packing)
- Operadores recebem ordens de picking fracionadas ou por palete completo.
- Na doca de saída, a leitura por coletor de código de barras realiza a **Conferência Cega**.
- Quando 100% dos itens requisitados são conferidos, a ordem de saída é promovida para `DISPATCHED` / `LOADED`, com emissão instantânea do Packing List / Romaneio oficial em PDF.

### 3.2. Faturamento Recorrente de Armazenagem
- As mercadorias armazenadas são faturadas automaticamente por períodos decendiais (10 dias) ou quinzenais.
- A fórmula de faturamento cruza o **Valor CIF da Mercadoria** (Ad Valorem), os dias de permanência e a taxa de movimentação (handling in/out por tonelada).
- O módulo de **Demurrage de Containers** audita diariamente o término do *Free Time*, aplicando a sobreestadia em USD caso o casco do container vazio não seja devolvido no prazo.

---

## 4. Walkthrough do Portal B2B do Depositante (Prompt 06)

O Portal B2B (`app/portal-cliente/page.tsx`) oferece autoatendimento integral para importadores e depositantes:
1. **Isolamento B2B via RLS:** Usuários com perfil `CLIENT` têm visão estritamente restrita aos seus próprios lotes e faturas.
2. **Rastreabilidade em Tempo Real:** Consulta transparente do status da mercadoria (`Armazenado`, `Quarentena Fiscal`, `Expedido`).
3. **Exportação de Relatórios:** Botão com emissão instantânea de relatórios consolidados de posição de estoque em PDF para auditoria externa.
4. **Visão Financeira:** Controle de boletos e faturas decendiais em aberto e histórico de pagamentos.

---

## 5. Tabela Geral de Componentes e Rotas

| Módulo | Tipo | Rota / Localização | Responsabilidade |
| :--- | :--- | :--- | :--- |
| **Doca Recebimento** | PWA Mobile | `/doca/recebimento` | Conferência com Câmera Nativa Zero-Storage e Extras |
| **Doca Expedição** | PWA Mobile | `/doca/expedicao` | Bipagem de código de barras e baixa de estoque |
| **Torre de Controle** | Dashboard | `/dashboard/torre-controle` | Heatmap 2D de ruas, prateleiras e alertas de gargalo |
| **Auditoria Fiscal** | Dashboard | `/dashboard/auditoria` | 3-Way Match com trava de Quarentena Fiscal |
| **Smart Scheduling**| Dashboard | `/dashboard/scheduling` | Parser de WhatsApp com IA e alocação de doca |
| **Tarifação Recinto** | Dashboard | `/dashboard/billing` | Cálculo de armazenagem e monitor de Demurrage |
| **Portal B2B** | Autoatendimento | `/portal-cliente` | Consulta de estoque e faturas do cliente final |
| **Academy** | Treinamento | `/dashboard/academy` | Manuais e capacitação de operadores de campo |
