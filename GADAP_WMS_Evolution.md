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
| **Cadastros CRM** | Escritório | `/dashboard/cadastros/*` | Gestão de Clientes, Fornecedores e Catálogo de Serviços |
| **Financeiro AP/AR** | Escritório | `/dashboard/financeiro/*` | Contas a Pagar, Contas a Receber e Conciliação Pix |
| **Compras / Suprimentos**| Escritório | `/dashboard/compras/pedidos` | Requisições de Insumos com integração automática no AP |
| **Autenticação Segura**| Portal / Login | `/login` | Supabase Auth, Toggle de Senha e Redirecionamento RBAC |
| **Gestão de Usuários RBAC**| Painel Armazém | `/dashboard/configuracoes/usuarios` | Gestão de membros do armazém, papéis e convites |
| **Console Superadmin**| SaaS Global | `/admin/empresas` | Gestão e provisionamento de Armazéns/Tenants |
| **RH Colaboradores** | Gestão CLT | `/dashboard/rh/colaboradores` | Matrícula, CBO, Importação CSV e eSocial S-2200 |
| **Folha & Holerites**| Folha CLT | `/dashboard/rh/folha` | INSS/IRRF progressivo, Horas Extras vs Doca, S-1200 |
| **Contratos & Pricing**| Billing Engine | `/dashboard/contratos` | Construtor Visual de Tarifas, Pró-rata e Simulador |

---

## 6. Autenticação, Perfis e Superusuário (Prompt 13)

### 6.1. Superadministrador Inicial
O sistema conta com seed de autenticação via Supabase Auth e tabela `public.users`:
- **E-mail:** `danielsmlopes@hotmail.com`
- **Nível de Acesso:** `SUPERADMIN`
- **Ambiente:** Acesso irrestrito a todos os galpões, cadastros fiscais, faturamento em lote e torre de controle.

### 6.2. Tela Corporativa de Login (`/login`)
- **Toggle Visibility:** Campo de senha protegido com botão de alternância (ícone de olho) para conferência de digitação.
- **Integração de Sessão:** Token de autenticação persistido de forma segura com roteamento baseado em função (`SUPERADMIN`/`OPERATOR` direcionados para a Torre de Controle; `CLIENT` para o Portal B2B).

---

## 7. Gestão de Acessos e Matriz de Permissões RBAC (Prompt 14)

### 7.1. Papéis e Escopos de Permissão
O sistema implementa **Role-Based Access Control (RBAC)** estrito, com validação no backend (FastAPI) e Row Level Security (RLS) no PostgreSQL:

1. **`SUPERADMIN` (Dono da Plataforma SaaS):**
   - Acesso cross-tenant irrestrito a todas as empresas do ecossistema.
   - Provisionamento, ativação e suspensão de armazéns/galpões (`/admin/empresas`).
   - Gestão de cotas de licenças e parâmetros globais.

2. **`TENANT_ADMIN` (Administrador do Armazém Local):**
   - Gestão restrita aos dados e equipe da sua própria empresa (`company_id`).
   - Convidar novos colaboradores, definir papéis operacionais e inativar contas (`/dashboard/configuracoes/usuarios`).
   - Visualização integral da Torre de Controle, conciliações de inventário e compras internas.

3. **`OPERATOR` (Operador de Doca e Estoque):**
   - Acesso restrito ao PWA móvel de Recebimento (`/doca/recebimento`) e Expedição (`/doca/expedicao`).
   - Leitura de código de barras, registro fotográfico de avarias efêmero e packing list.
   - Bloqueado para dados financeiros e cadastros de fornecedores.

4. **`FINANCE` (Controladoria e Faturamento):**
   - Gestão de Contas a Pagar (`/dashboard/financeiro/pagar`) e Contas a Receber (`/dashboard/financeiro/receber`).
   - Emissão de NFS-e, faturamento decendial/quinzenal de armazenagem e conciliação bancária Pix.

5. **`CLIENT` (Importador / Depositante B2B):**
   - Acesso exclusivo ao autoatendimento B2B (`/portal-cliente`).
   - Consulta restrita às suas próprias cargas estocadas e faturas geradas.

---

## 8. Módulo de Recursos Humanos, Folha CLT e Integração eSocial (Prompt 15)

### 8.1. Motor de Cálculo Trabalhista (CLT Oficial)
O motor de cálculo brasileiro aplica as regras vigentes do Ministério do Trabalho e da Receita Federal:
- **Tabela Progressiva do INSS:** Aplicação em faixas móveis (7,5% a 14%) com incidência progressiva sobre o teto do RGPS.
- **Tabela Progressiva do IRRF:** Cálculo após abatimento da contribuição previdenciária e dedução legal por dependente (R$ 189,59).
- **Horas Extras de Doca (50% e 100%):** Valor hora apurado pelo divisor mensal 220h (`Salário Base / 220`), com acréscimo de 50% em dias úteis e 100% aos domingos e feriados.
- **Reflexo em DSR (Descanso Semanal Remunerado):** Fórmula legal: `(Total de Horas Extras e Adicional Noturno / Dias Úteis) * Dias de Repouso/Feriados`.
- **Vale-Transporte:** Desconto limitado ao teto legal de 6% sobre o salário básico.

### 8.2. RH Inteligente: Horas Extras vs. Volume da Doca ("O Algo a Mais")
- Algoritmo preditivo que cruza os apontamentos do espelho de ponto com a quantidade de lotes e containers recebidos por semana.
- Detecção de gargalos operacionais: identifica se o excesso de horas extras é decorrente de sobreestadia de carretas no pátio ou atrasos aduaneiros na alfândega.

### 8.3. Integração com o eSocial Simplificado (vS-1.2)
- **Evento S-2200 (Admissão de Trabalhador):** Geração de payload estruturado (JSON/XML) com CBO oficial, matrícula, vínculos e remuneração.
- **Evento S-1200 / S-1210 (Remuneração e Pagamentos):** Transmissão de rubricas detalhadas de vencimentos (`001`, `105`, `106`, `120`, `130`) e retenções fiscais (`501`, `502`, `520`).
- **Holerite PDF Oficial:** Layout homologado com demonstrativo de bases de INSS/FGTS, depósito de 8% do empregador e canhoto para assinatura do trabalhador.

---

## 9. Motor de Contratos Comerciais e Tarifação Flexível (Prompt 16)

### 9.1. Estrutura Contratual e Índices Financeiros
O motor de cobrança atende às exigências de operadores logísticos modernos (3PL) e recintos alfandegados:
- **Índices de Reajuste Automático:** Suporte nativo para indexação anual por IPCA, IGP-M, INPC ou contratos com tarifas fixas.
- **Grace Period (Freetime):** Período de isenção de armazenagem parametrizável em dias por contrato (ex: 3 a 5 dias livres na chegada).
- **Franquia Mínima Mensal:** Garantia contratual de faturamento mínimo para reserva de área no galpão.
- **Ciclos de Faturamento:** Compatibilidade com fechamento decendial (10 dias - padrão alfandegado), quinzenal ou mensal.

### 9.2. Regras Tarifárias Condicionais e Pró-rata
O motor calcula a armazenagem com precisão matemática:
- **Rateio Pró-rata Diário:** Mercadorias que entram no decorrer do mês pagam estritamente a fração dos dias ocupados.
- **Unidades Parametrizáveis:** Cobrança por posição-palete/dia (`PALLET_DAY`), metro cúbico/dia (`M3_DAY`), área locada/mês (`M2_MONTH`) e tonelada/dia (`TON_DAY`).
- **Regras Condicionais de Carga:** Sobretaxas automáticas parametrizadas por regras visuais no estilo:
  - *SE* carga for Frigorificada/Climatizada (+4°C a -20°C) -> *ENTÃO* tarifa base de R$ 4,50/palete/dia.
  - *SE* carga for Perigosa/Química (IMO) -> *ENTÃO* tarifa base de R$ 6,80/palete/dia + handling especial blindado.
  - *SE* carga for Alfandegada/DI -> *ENTÃO* tarifa ad valorem decendial.

### 9.3. Simulador Preditivo de Faturas ("O Algo a Mais")
- Disponível na aba `/dashboard/contratos` para a equipe comercial testar cenários hipotéticos antes da celebração da proposta.
- O gestor informa o perfil de carga (paletes, peso, dias previstos de armazenagem e serviços extras como filme stretch e desova manual).
- O motor calcula instantaneamente o demonstrativo discriminado de rubricas e verifica se o subtotal atinge a franquia mínima contratual.




