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
| **Relatórios BI & DRE**| Inteligência | `/dashboard/relatorios` | DRE Gerencial, Curva ABC, RevPAR e Ask the Data (NLP) |
| **QMS & Validade FEFO**| Qualidade | `/dashboard/qualidade` | Semáforo de validade, FEFO/FIFO, Anvisa e IA de trânsito |
| **CMMS Manutenção** | Ativos & Frota | `/dashboard/manutencao` | Horímetro de empilhadeiras, preventivas e chamados com foto |
| **Conciliação OFX/SPED**| Fiscal & Bancário | `/dashboard/financeiro/conciliacao` | Tinder Financeiro, Match automático e SPED EFD ICMS/IPI |
| **CRM B2B & Propostas**| Comercial | `/dashboard/comercial/pipeline` | Funil Kanban e Propostas com IA (margem de 25%) |

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
- **Recuperação de Credenciais:** Link direto *"Esqueci minha senha"* integrado com os fluxos `/recuperar-senha` e `/reset-password`.

### 6.3. Fluxo de Recuperação e Redefinição de Senha
1. **Solicitação do Link Seguro (`/recuperar-senha`):** O usuário informa seu e-mail corporativo. O sistema aciona o endpoint `/auth/v1/recover` do Supabase Auth para disparar o token/link mágico de redefinição.
2. **Redefinição de Palavra-passe (`/reset-password`):** O usuário digita a nova senha com confirmação, validação de complexidade mínima (8 dígitos) e botão de alternância de visibilidade. A nova credencial é gravada criptograficamente no schema `auth.users`.

---

## 7. Hierarquia Realista de Perfis (RBAC) e Isolamento Zero-Trust (Prompt 23)

### 7.1. Hierarquia Funcional Realista do Armazém
O sistema adota o organograma corporativo de Centros de Distribuição e Operadores 3PL:

1. **`TENANT_OWNER` (Diretor Geral do Armazém):**
   - Acesso total e irrestrito a todos os módulos do seu tenant (`company_id`).
   - Gestão do organograma, criação e inativação de gerentes, operadores e financeiro.
   - Aprovação de fechamento de faturamento, conciliação e relatórios estratégicos (DRE).

2. **`MANAGER` (Gerente de Logística e Operações):**
   - Acesso pleno à Torre de Controle, Heatmap 2D, Auditoria 3-Way Match e inventário físico.
   - Supervisão das docas de recebimento e expedição.
   - **Restrição de Segurança:** Cego para as telas financeiras (Contas a Pagar/Receber, faturamento decendial e DRE).

3. **`FINANCE` (Controladoria & Faturamento):**
   - Acesso ao contas a pagar, contas a receber, conciliação de extrato OFX, SPED Fiscal e faturamento em lote.
   - **Restrição de Segurança:** Bloqueado para alteração de estoque físico, endereçamento de ruas e conferência de doca.

4. **`OPERATOR` (Conferente de Doca & Operador de Campo):**
   - Acesso restrito ao PWA móvel (`/doca/recebimento` e `/doca/expedicao`) para conferência cega e bipagem.
   - Totalmente bloqueado para telas de cadastros, faturamento e relatórios gerenciais.

5. **`CLIENT_B2B` (Depositante / Dono da Carga):**
   - Acesso restrito e isolado ao Portal do Cliente (`/portal-cliente`), visualizando exclusivamente seus próprios lotes estocados e faturas.

### 7.2. Política Zero-Trust para o Superusuário (SaaS Master)
Para garantir conformidade com LGPD, sigilo fiscal e auditorias aduaneiras (OEA):
- O **`SUPERADMIN`** administra **EXCLUSIVAMENTE a infraestrutura SaaS** (planos de assinatura, limites de disco, nós de banco de dados e provisionamento de galpões).
- **Isolamento Absoluto RLS:** Todas as tabelas de negócio e dados confidenciais (`inbound_lots`, `accounts_payable`, `accounts_receivable`, `contracts`, `inventory_audits`) possuem travas de segurança ativas:
  ```sql
  AND public.get_current_user_role() != 'SUPERADMIN' -- Zero-Trust Enforcement
  ```
- O Superadministrador é **completamente cego** aos dados de faturamento, clientes depositantes, notas fiscais e estoques dos armazéns.


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

---

## 10. BI Estratégico, DRE Gerencial Logístico e IA "Ask the Data" (Prompt 17)

### 10.1. DRE Gerencial Logístico (Receitas vs. Custos Diretos)
O DRE operacional consolida as rubricas de faturamento e custos específicos do armazém:
- **Receita Bruta Operacional:** Armazenagem pró-rata, Handling Inbound/Outbound e Serviços Extras spot (stretch/paletização).
- **Deduções Tributárias:** Provisão de ISS municipal e PIS/COFINS.
- **Custos Diretos Operacionais:** Despesas com folha da equipe de doca (CLT), adicionais de horas extras/noturno e consumo de insumos (bobinas de filme stretch e paletes vazios).
- **Margem EBITDA:** Apuração de resultado operacional e eficiência de margem sobre a receita líquida.

### 10.2. Curva ABC de Rentabilidade de Clientes (Depositantes)
- Classificação dos clientes em Classes A, B e C cruzando receita gerada vs. custos de movimentação alocados.
- Visibilidade sobre clientes que geram mais volume físico versus os que entregam maior margem de lucro líquido.

### 10.3. Taxa de Ocupação vs. RevPAR (Revenue per Available Rack)
- **Fórmula Oficial do RevPAR Logístico:**
  $$\text{RevPAR} = \frac{\text{Receita Total de Armazenagem}}{\text{Total de Posições Físicas Existentes}}$$
- Mede a monetização real de cada endereço do porta-paletes instalado no armazém (cheio ou vazio), permitindo à diretoria avaliar a ociosidade do ativo imobiliário.

### 10.4. "O Algo a Mais": Ask the Data (NLP to SQL com Gemini)
- Barra de pesquisa em linguagem natural alimentada pelo modelo oficial do Google Gemini.
- O executivo formula perguntas livres como *"Qual foi o faturamento total em outubro?"* ou *"Qual o RevPAR atual?"*.
- O motor traduz em consulta SQL estruturada e devolve o resumo sintetizado com painel de pré-visualização de dados.
- Exportação nativa dos relatórios em formato estruturado `.csv` e compatível com Excel.

---

## 11. Módulo QMS & Algoritmo FEFO/FIFO Regulatório (Prompt 18)
- **Rastreabilidade Obrigatória:** Inclusão dos campos de lote (`batch_number`), fabricação (`manufacturing_date`), validade (`expiration_date`) e zona térmica (`temperature_zone`) no inventário.
- **Motor FEFO (First Expired, First Out):** Ordenação dinâmica da separação pelo lote com data de vencimento mais próxima, mitigando perdas financeiras em produtos farmacêuticos e alimentícios.
- **Bloqueio de Qualidade por CRON:** Rotina diária que reclassifica lotes vencidos para `QUARANTINE_EXPIRED`, travando fisicamente a emissão de romaneio de expedição.
- **"O Algo a Mais" (IA Preditiva de Trânsito):** Cruzamento automático do tempo estimado de trânsito rodoviário com o shelf-life restante do lote, impedindo expedições que chegariam vencidas ao cliente.

---

## 12. CMMS - Gestão de Frotas e Ativos por Horímetro (Prompt 19)
- **Controle de Ativos Físicos:** Monitoramento de empilhadeiras elétricas/combustão, niveladoras de doca e máquinas de stretch.
- **"O Algo a Mais" (Gatilho por Horímetro):** Cada ciclo de picking concluído no PWA incrementa o horímetro do equipamento. Ao atingir o ciclo limite de 250 horas, uma ordem de manutenção preventiva é disparada automaticamente.
- **Chamados Corretivos com Foto:** Abertura rápida de ordens de serviço corretivas com upload de imagens de peças danificadas.

---

## 13. Conciliação Bancária OFX e Integração SPED Fiscal (Prompt 20)
- **Tinder Financeiro:** Interface interativa comparando lançamentos de extrato bancário (.OFX) com contas a pagar/receber do ERP.
- **Algoritmo de Match Inteligente:** Reconhecimento automatizado por paridade de valor e proximidade de data de vencimento.
- **Exportação SPED EFD ICMS/IPI:** Geração em lote do arquivo texto oficial (blocos 0000, 0001, C100, C190, 9999) pronto para importação no PVA da Receita Federal.

---

## 14. CRM B2B e Funil de Vendas do Armazém com IA (Prompt 21)
- **Pipeline Kanban de Vendas:** Gestão de oportunidades logísticas nas fases de Prospecção, Proposta Enviada, Negociação e Contrato Fechado.
- **"O Algo a Mais" (Gerador de Propostas com IA):** Motor com inteligência artificial que lê solicitações em linguagem natural (ex: *"500 paletes de geladeiras por 3 meses"*), calcula custos operacionais e gera cartas-proposta completas com margem garantida de 25% e botão de envio por WhatsApp.

---

## 15. Nova UX/UI Corporativa para ERP de Escritório & Matriz de Permissões RBAC (Prompt 23/24)

### 15.1. Redesign de Interface para Estações de Trabalho (Desktop Office)
- **Layout Corporativo Unificado (`OfficeErpLayout.tsx`):**
  - **Sidebar Persistente Expansível/Recolhível:** Navegação lateral com categorização funcional:
    - *Torre & Operações:* Dashboard Geral, Torre 2D, Agendamentos, TMS e Auditoria.
    - *Controladoria & Billing:* Faturamento em Lote, Contratos & Pricing, Contas a Pagar, Contas a Receber e Conciliação OFX/SPED.
    - *Cadastros & CRM:* Funil B2B, Clientes, Fornecedores, Serviços & Catálogo e Compras.
    - *Gestão, RH & Qualidade:* Colaboradores, Folha CLT/eSocial, QMS & FEFO, Manutenção CMMS, Relatórios BI & DRE e Academy.
  - **Isolamento de Rotas Operacionais e Públicas:** O layout detecta automaticamente as telas mobile de coletor de doca (`/doca/*`) e telas de autenticação (`/login`, `/recuperar-senha`, `/reset-password`), fornecendo a experiência tela-cheia sem distrações.
  - **Topbar Corporativo:** Breadcrumbs dinâmicos com a rota atual, indicador de status online/offline, identificação do operador logado e atalho rápido de logout seguro.

### 15.2. Matriz de Permissões RBAC e Política Zero-Trust
| Perfil (Role) | Âmbito de Acesso | Operação / Doca | Faturamento / Financeiro | RH & Folha | Gestão Multi-tenant |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **SUPERADMIN** | SaaS Global (Infra) | ❌ Zero-Trust | ❌ Zero-Trust | ❌ Zero-Trust |  Total |
| **TENANT_OWNER** | Diretoria do Armazém |  Total |  Total |  Total | ❌ Próprio Tenant |
| **MANAGER** | Gerência Operacional |  Total | ❌ Restrito |  Operacional | ❌ Sem Acesso |
| **FINANCE** | Controladoria & Billing | ❌ Leitura |  Total | ❌ Restrito | ❌ Sem Acesso |
| **OPERATOR** | Conferente / Coletor |  PWA Doca | ❌ Sem Acesso | ❌ Sem Acesso | ❌ Sem Acesso |
| **CLIENT_B2B** | Depositante Externo |  Próprio Estoque |  Próprias Faturas | ❌ Sem Acesso | ❌ Sem Acesso |

> [!IMPORTANT]
> **Garantia de Isolamento Zero-Trust:** O `SUPERADMIN` possui permissão estritamente restrita à governança da infraestrutura (ativação e provisionamento de novos armazéns/tenants e suporte técnico). As regras de Row Level Security (RLS) bloqueiam expressamente o acesso do `SUPERADMIN` a extratos bancários, dados financeiros, informações salariais de funcionários e volumes confidenciais de terceiros.

---

## 16. Onboarding do Armazém, Integração CNPJ e Base Jurídica (Prompt 22)
- **Assistente de Onboarding Corporativo (`app/dashboard/configuracoes/empresa/page.tsx`):**
  - **Consulta em Tempo Real de CNPJ:** Rota `GET /api/v1/tenant-setup/integrations/cnpj/{cnpj}` integrando a BrasilAPI e ReceitaWS com fallback resiliente, autopreenchendo Razão Social, Nome Fantasia, CNAE Fiscal, Natureza Jurídica, Endereço Completo e Quadro Societário (QSA).
  - **Injeção de Logotipo:** Upload e armazenamento da identidade visual do galpão/armazém, injetada dinamicamente nos contratos e romaneios em PDF.
  - **Painel de Representantes Legais (`legal_representatives`):** Cadastro de sócios administradores e procuradores com CPF, e-mail e cargo para a assinatura eletrônica de contratos comerciais e propostas B2B.

---

## 17. Central de Relatórios Setoriais 360º & Exportação Excel (Prompt 23)
- **Motor de Dados com Pandas & Openpyxl (`app/dashboard/relatorios/exportacao/page.tsx`):**
  - **Geração de Arquivos `.xlsx` Nativos e Estilizados:** Largura de colunas autoajustável, cabeçalhos congelados e tipagem estrita de datas e valores monetários.
  - **Catálogo de Relatórios Disponíveis:**
    1. *Estoque & Logística - Extrato de Movimentação:* Histórico completo de Inbound e Outbound por LPN, produto, peso, endereço e conferente.
    2. *Estoque & Logística - SLA de Doca:* Tempos de espera, carga e descarga de carretas versus metas, identificando gargalos.
    3. *Estoque & Logística - Posições Vazias:* Ocupação de porta-paletes por rua, nível e dias de vacância física.
    4. *Financeiro - Inadimplência & Aging List:* Títulos vencidos agrupados por faixas (1-15, 16-30, 31-60 dias), cálculo de juros/multas e status.
    5. *Financeiro - DRE Logística Detalhada:* Cruzamento de receitas operacionais contra custos de pessoal, energia, locação e manutenção CMMS.
    6. *Compras Internas - Saving de Suprimentos:* Comparativo entre orçamentos médios e valores finais negociados.

---

## 18. Motor Fiscal Nativo, Cofre de Certificados A1 & Mensageria Própria (Direct-to-SEFAZ) (Prompt 24)
- **Arquitetura Fiscal 100% Proprietária:**
  - O GADAP ERP opera com mensageria e gerador XML nativo (Layout 4.00), eliminando intermediários pagos ou dependências de terceiros.
  - **Cofre Criptografado de Certificados (`app/dashboard/fiscal/configuracao/page.tsx`):**
    - Armazena arquivos `.pfx`/`.p12` de Certificados A1 (ICP-Brasil) e senhas protegidas via algoritmo AES-256 no banco de dados.
    - Tooltips detalham a finalidade das chaves criptográficas e padrões do PKCS#12.
  - **Assinatura e Transmissão Direct-to-SEFAZ:**
    - Assinatura digital direta do nó `<infNFe>` utilizando `cryptography` e `signxml` (padrão RSA-SHA1 / Enveloped Signature).
    - Conexão direta aos webservices oficiais da SEFAZ (SOAP/REST) com chaveamento automático de ambiente:
      - *Homologação:* `https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx`
      - *Produção:* `https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx`
  - **Tela de Emissão (`app/dashboard/fiscal/emissao/page.tsx`):**
    - Toggle Switch global Homologação vs Produção.
    - Dropdowns dinâmicos sincronizados com o CRM, contratos e tabelas paramétricas de CFOP/NCM.
    - Modal integrado para auditoria imediata do XML assinado antes do download.

---

## 19. IA Tributária, Web Scraping e Nova Reforma Tributária Brasileira (Prompt 25)
- **Radar Tributário da IA (`app/dashboard/fiscal/radar/page.tsx`):**
  - **Web Scraping Semanal Automatizado:** Consulta periódica a portais oficiais (SEFAZ, Receita Federal, DOU) com sumarização jurídica via Google Gemini e cruzamento com as tabelas de tributação do armazém.
  - **Preparação Nativa para o IVA Dual:** Suporte no schema de dados para os novos tributos constitucionais:
    - **IBS (Imposto sobre Bens e Serviços):** Substitui ICMS e ISS com competência compartilhada entre Estados e Municípios (alíquota estimada de 17,50%).
    - **CBS (Contribuição sobre Bens e Serviços):** Substitui PIS e COFINS no âmbito federal (alíquota padrão de 8,80% com crédito pleno).
    - **IS (Imposto Seletivo):** Aplicação automatizada de "Sin Tax" (2,50%) sobre categorias reguladas armazenadas (bebidas alcoólicas e tabaco).
  - **Botão "Aplicar Atualização" em 1 Clique:** O CFO aprova recomendações da IA que atualizam imediatamente a tabela `tax_rules`.

---

## 20. Infraestrutura e DevOps: GitHub Action Keep-Alive (Prompt 26)
- **Garantia de Alta Disponibilidade (Supabase Keep-Alive):**
  - Workflow automatizado em `.github/workflows/supabase-keep-alive.yml`.
  - Agendamento CRON a cada 3 dias (`0 0 */3 * *`) e suporte a execução sob demanda via `workflow_dispatch`.
  - Disparo de requisição `curl` para a REST API do Supabase (`/rest/v1/`), validando o status HTTP 200 para evitar suspensão de instâncias por inatividade.
  - **Configuração Obrigatória no GitHub:**
    - O administrador do armazém deve acessar o repositório no **GitHub > Settings > Secrets and variables > Actions** e cadastrar os segredos:
      - `SUPABASE_URL`: Endpoint REST oficial do projeto (ex: `https://xyz.supabase.co`).
      - `SUPABASE_ANON_KEY`: Chave anônima / pública de autenticação.

---

## 📍 STATUS DO ROADMAP

- [x] **Módulo 01-12:** Core WMS, LPNs, PWA de Doca, Torre 2D, Agendamento Inteligente via WhatsApp, Inventário ABC, Billing em Lote e Compras.
- [x] **Módulo 13:** Autenticação e Seed de Superusuário (`danielsmlopes@hotmail.com`).
- [x] **Módulo 14 & 23:** RBAC Corporativo Realista e Política Zero-Trust do Superadmin.
- [x] **Módulo 15:** RH, Folha CLT, Cálculos INSS/IRRF, Holerite PDF, Integração eSocial (S-2200/S-1200) e Predição HE vs Doca.
- [x] **Módulo 16:** Motor de Contratos, Pricing Flexível por Regras e Simulador de Faturamento.
- [x] **Módulo 17:** Relatórios Gerenciais, DRE Logístico, Curva ABC, RevPAR e IA "Ask the Data".
- [x] **Módulo 18:** Qualidade QMS, FEFO/FIFO Regulatório e Bloqueio Preditivo de Validade vs Trânsito.
- [x] **Módulo 19:** CMMS Frotas, Horímetro com Gatilho a 250h e Manutenções Corretivas com Foto.
- [x] **Módulo 20:** Conciliação OFX (Tinder Financeiro) e Exportação SPED EFD ICMS/IPI.
- [x] **Módulo 21:** CRM B2B Logístico, Funil Kanban e Gerador de Propostas com IA (WhatsApp).
- [x] **Módulo 22:** Onboarding do Armazém, Integração CNPJ (BrasilAPI/ReceitaWS), Injeção de Logo e Procuradores Legais.
- [x] **Módulo 23:** Central de Relatórios Setoriais 360º com Geração Nativa de Planilhas Excel (`.xlsx` via Pandas/Openpyxl).
- [x] **Módulo 24:** Motor Fiscal Nativo Proprietário (Direct-to-SEFAZ), Cofre de Certificado Digital A1 com Criptografia AES-256 e Assinatura XML Nativa.
- [x] **Módulo 25:** IA Tributária, Web Scraping Semanal de Legislação e Preparação Estrutural para a Reforma Tributária (IBS/CBS/IS).
- [x] **Módulo 26:** Infraestrutura DevOps com GitHub Action Keep-Alive para Alta Disponibilidade do Banco Supabase.









