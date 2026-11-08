# 📖 MANUAL DO USUÁRIO — GADAP WMS / ERP
> **Versão Oficial:** 3.0.0-PRO  
> **Público-alvo:** Diretores, Gerentes Logísticos, Conferentes, Faturistas e Depositantes B2B.  
> **Objetivo:** Guia completo de utilização de todas as ferramentas e interfaces do sistema, detalhando perfis, funcionalidades e boas práticas operacionais.

---

## 🧭 Índice do Manual
1. [Arquitetura de Perfis e Hierarquia de Acesso](#1-arquitetura-de-perfis-e-hierarquia-de-acesso)
2. [Ambiente de Demonstração (Empresa TESTE LTDA)](#2-ambiente-de-demonstração-empresa-teste-ltda)
3. [Operações de Doca e Campo (PWA)](#3-operações-de-doca-e-campo-pwa)
4. [Torre de Controle 2D e Gestão de Pátio](#4-torre-de-controle-2d-e-gestão-de-pátio)
5. [Auditoria 3-Way Match & Quarentena Aduaneira](#5-auditoria-3-way-match--quarentena-aduaneira)
6. [Inventário Cego e Conciliação ABC](#6-inventário-cego-e-conciliação-abc)
7. [Faturamento, Billing & Motor de Contratos](#7-faturamento-billing--motor-de-contratos)
8. [Emissão Fiscal Direct-to-SEFAZ e DANFE](#8-emissão-fiscal-direct-to-sefaz-e-danfe)
9. [RH, Folha eSocial e Ponto Eletrônico AFD](#9-rh-folha-esocial-e-ponto-eletrônico-afd)
10. [Segurança Zero-Trust & Portal do Cliente B2B](#10-segurança-zero-trust--portal-do-cliente-b2b)
11. [Governança LGPD, Privacidade & Canal DPO](#11-governança-lgpd-privacidade--canal-dpo)

---

## 1. Arquitetura de Perfis e Hierarquia de Acesso

O **GADAP WMS** opera com controle rigoroso de acesso baseado em funções (RBAC) com isolamento no banco via **Row-Level Security (RLS)**:

| Perfil | Nível de Acesso | Módulos Liberados | Restrições Principais |
| :--- | :---: | :--- | :--- |
| **SUPERADMIN** | Nível 0 | Acesso irrestrito ao SaaS, provisionamento de empresas e parametrizações de infraestrutura. | Zero-Trust em dados de clientes de produção. |
| **TENANT_OWNER** | Nível 1 | Acesso total à organização do armazém: Torre 2D, Financeiro, Fiscal, RH, Contratos e Configurações. | Não enxerga dados de outros armazéns concorrentes. |
| **MANAGER** | Nível 2 | Torre 2D, Doca, Smart Scheduling, Inventário, Qualidade QMS, CMMS de Frotas e Relatórios. | Bloqueado para parametrização bancária e RH confidencial. |
| **FINANCE** | Nível 3 | Emissão Direct-to-SEFAZ, Contas a Pagar/Receber, Billing, Contratos, DRE e Folha de Pagamento. | Bloqueado para liberação de avarias de doca e mapa de calor. |
| **OPERATOR** | Nível 4 | PWA de Doca (Recebimento/Expedição), Leitura de LPNs e contagem cega de inventário. | Acesso estritamente operacional via mobile/coletor. |
| **CLIENT_B2B** | Nível 5 | Portal B2B: visualização dos próprios lotes, extratos de faturamento e relatórios de posição. | RLS estrito: enxerga apenas seus próprios produtos/notas. |

---

## 2. Ambiente de Demonstração (Empresa TESTE LTDA)

Para treinamentos internos, homologação e aprendizado sem risco à operação real:
- **E-mail de Acesso:** `teste@teste`
- **Senha:** `teste`
- **Comportamento Especial:** É a **única organização sem travas de acesso**. O usuário navega livremente por todas as telas do sistema para conhecer todos os recursos.
- **Auto-Reset ao Sair:** Ao clicar em **"Sair do ERP" (Logout)**, quaisquer lançamentos, alterações de saldo ou emissões de teste realizadas são descartadas, restaurando o estado original da base de demonstração.

---

## 3. Operações de Doca e Campo (PWA)

### 3.1. Recebimento de Cargas (`/doca/recebimento`)
1. **Identificação do Documento:** Informe o número da DI (Declaração de Importação), CT-e ou NF-e de entrada.
2. **Conferência Cega:** O conferente digita a quantidade física descarregada sem visualização prévia da meta fiscal, garantindo imparcialidade.
3. **Registro Fotográfico de Avarias:** Se houver amassamento ou caixa violada, clique em **"Anexar Foto"** diretamente da câmera do coletor.
4. **Lançamento de Serviços Extras Spot:** Selecione se houve necessidade de paletização, aplicação de filme stretch ou reembalagem.
5. **Geração do Termo de Entrada:** Ao concluir, o sistema gera o Romaneio de Entrada com código LPN exclusivo.

### 3.2. Expedição e Picking (`/doca/expedicao`)
1. Bipagem do LPN no palete ou caixa para validação de lote e validade (FEFO/FIFO).
2. O sistema bloqueia a expedição se o lote estiver em quarentena ou vencido.
3. Ao finalizar a carga do caminhão, é emitido o Romaneio de Saída com assinatura digital do motorista.

---

## 4. Torre de Controle 2D e Gestão de Pátio (`/dashboard/torre-controle`)

- **Mapa de Calor Visual (Aisle Heatmap):** Visualize ruas, prédios e níveis em verde (livre) e vermelho (ocupado).
- **Taxa de Ocupação:** Acompanhe a capacidade estática e dinâmica em tempo real (atualizada via cache ultrarrápido de 3 segundos).
- **Alertas de Gargalo:** Alertas automáticos notificam quando uma doca excede o tempo limite de permanência do veículo.

---

## 5. Auditoria 3-Way Match & Quarentena Aduaneira (`/dashboard/auditoria`)

- Confronta automaticamente: **Quantidade da DI/NF** vs **Contagem da Doca** vs **Saldo Físico no Porta-Palete**.
- Divergências de falta ou sobra colocam o lote instantaneamente em `QUARANTINE`, impedindo faturamento ou expedição até a liberação pelo Auditor Fiscal.

---

## 6. Inventário Cego e Conciliação ABC (`/dashboard/inventario/conciliacao`)

- **Contagem Cega:** A equipe de pátio não vê o saldo teórico do sistema.
- **Classificação Curva ABC:** Permite focar auditorias semanais nos itens Curva A (80% do valor do armazém).
- **Aprovação de Ajuste:** Somente o Gerente Operacional pode aprovar quebras e sobras, gerando o respectivo lançamento contábil.

---

## 7. Faturamento, Billing & Motor de Contratos (`/dashboard/faturamento`)

- **Ad-Valorem:** Cálculo sobre o valor CIF da mercadoria proporcional aos decêndios ou quinzena de armazenagem.
- **Handling In/Out:** Cobrança por tonelada ou por palete movimentado.
- **Demurrage de Containers:** Contagem regressiva de *Free Time* com cálculo diário de sobreestadia em USD/BRL.

---

## 8. Emissão Fiscal Direct-to-SEFAZ e DANFE (`/dashboard/fiscal/emissao`)

- **Conexão Nativa:** Transmissão sem intermediários para os webservices da SEFAZ Estadual.
- **Cofre A1 Criptografado:** Assinatura digital XML em milissegundos com padrão ICP-Brasil.
- **Impressão de DANFEs:** Impressão instantânea de notas individuais ou emissão em lote para caminhões de expedição.
- **Exportação para Contabilidade:** Botão **"Baixar Pacote do Contador (.ZIP)"** com todos os XMLs e PDFs do mês.

---

## 9. RH Enterprise, Folha eSocial, Ponto AFD e HCM (`/dashboard/rh/folha` e `/dashboard/rh/enterprise`)

O módulo de Recursos Humanos do GADAP WMS opera no mesmo padrão dos líderes globais e nacionais de HCM (SAP SuccessFactors, TOTVS Protheus e Senior HCM):

- **Importação Portaria 671 MTE:** Leitura do arquivo AFD (.txt) emitido por qualquer relógio de ponto físico REP-C, REP-A ou REP-P.
- **Tabelas Oficiais Vigentes:** Cálculo automático das alíquotas progressivas do INSS e deduções por dependente do IRRF.
- **DSR e Horas Extras:** Cálculo automático de DSR sobre horas extras (50% e 100%), adicional noturno e integração dos encargos direto no Contas a Pagar (AP).
- **Gestão de Férias CLT (Art. 129 a 153):**
  - Controle automático de períodos aquisitivos e concessivos para evitar o pagamento de férias em dobro (Art. 137 CLT);
  - Adicional de 1/3 Constitucional (Art. 7º, XVII da CF);
  - Abono Pecuniário (venda legal de até 10 dias) com isenção de tributos;
  - Adiantamento opcional da 1ª parcela do 13º salário;
  - Alerta de prazo legal de pagamento em até 2 dias antes do início do descanso (Art. 145 CLT).
- **Simulador e Motor de Rescisão Trabalhista (TRCT Homologado):**
  - Dispensa sem justa causa, pedido de demissão, demissão com justa causa (Art. 482) e acordo mútuo da Reforma Trabalhista (Art. 484-A da CLT);
  - Aviso Prévio Proporcional escalonado conforme a Lei 12.506/2011 (30 a 90 dias);
  - Saldo de salário, 13º proporcional, férias vencidas e proporcionais com 1/3;
  - Multa rescisória de 40% (ou 20% no acordo) do FGTS para geração da guia GRRF.
- **Hub Oficial eSocial (Mensageria A1):**
  - Rastreamento dos eventos cadastrais e contratuais (`S-2200`, `S-2205`, `S-2206`, `S-2299`);
  - Eventos periódicos da folha (`S-1200`, `S-1210`, `S-1299`) com recibo oficial do Serpro;
  - Eventos de Segurança e Saúde no Trabalho - SST (`S-2210` CAT, `S-2220` ASO e `S-2240` LTCAT).
- **Medicina e Segurança do Trabalho (SST & EPI NR-06):**
  - Ficha eletrônica de entrega de EPI com número de Certificado de Aprovação (CA) expedido pelo MTE e assinatura biométrica/digital;
  - Controle de treinamentos obrigatórios (NR-11 Operador de Empilhadeira, NR-12 e NR-35 Trabalho em Altura).
- **Banco de Horas Inteligente & Acordo Coletivo:**
  - Extrato detalhado com alertas de compensação preventiva (30 dias antes do vencimento do prazo da CCT).

---

## 10. Segurança Zero-Trust & Portal do Cliente B2B (`/portal-cliente`)

- O depositante acompanha a posição de seus estoques, extratos decendiais e laudos fiscais 24/7 sem visualizar dados de nenhum outro concorrente.
- Toda planilha Excel e PDF exportado recebe **marca d'água com CNPJ e hash SHA-256** para auditoria de vazamento conforme a LGPD.

---

## 11. Governança LGPD, Privacidade & Canal DPO (`/dashboard/privacidade-lgpd`)

O GADAP WMS opera em **Conformidade Plena com a Lei Federal 13.709/2018 (LGPD)**, com módulo oficial para salvaguarda de dados pessoais e gestão de riscos:

- **Canal Oficial do DPO (Encarregado):** Atendimento e parecer técnico via `dpo@gadap.com.br` com SLA &lt; 48 horas.
- **Gestão de Direitos do Titular (Art. 18):** Protocolo automatizado para requisições de:
  - *Acesso e Confirmação de Tratamento* (Art. 18, I e II);
  - *Retificação de Dados Incompletos* (Art. 18, III);
  - *Anonimização e Bloqueio* (Art. 18, IV);
  - *Portabilidade Interoperável* no padrão oficial ANPD em JSON (Art. 18, V);
  - *Revogação de Consentimento* (Art. 18, IX).
- **Harmonização com Bases Legais Concorrentes (Art. 16, I):** O direito ao esquecimento respeita o prazo legal compulsório de 5 anos para documentos fiscais (CTN Art. 173) e 30 anos para livros trabalhistas (CLT/FGTS). Nestes casos, o sistema aplica **anonimização seletiva irreversível via SHA-256**, preservando as obrigações regulatórias da empresa.
- **Mascaramento Dinâmico de PII:** Exibição protegida de CPFs (`123.***.***-45`), e-mails (`ca***@dominio.com`) e telefones em telas operacionais de doca e TMS.
- **Rate-Limiting Preventivo Anti-Scraping:** Teto de 100 requisições por minuto em rotas analíticas para impedir extrações automatizadas de bancos de dados.
- **Protocolo de Resposta a Incidentes (Art. 48):** Trilha formal para registro, contenção e comunicação imediata à Autoridade Nacional de Proteção de Dados (ANPD) se houver risco relevante aos titulares.


