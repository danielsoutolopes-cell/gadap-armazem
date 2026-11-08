# 🚀 MANUAL DEFINITIVO DE IMPLANTAÇÃO E MIGRAÇÃO AUTÔNOMA (GADAP WMS / ERP)
> **Missão Zero-Stress:** Guia passo a passo, autoexplicativo e à prova de falhas, projetado para que o próprio cliente (gestor, equipe de TI ou operador de armazém) execute a implantação, migração de dados e início da operação sem dependência técnica externa ou atritos operacionais.

---

## 🧭 Índice Rápido
1. [Visão Geral & Filosofia "Sem Dor"](#-1-visão-geral--filosofia-sem-dor)
2. [Pré-requisitos e Checklist Inicial](#-2-pré-requisitos-e-checklist-inicial)
3. [Etapa 1: Ativação do Ambiente em Nuvem (10 Minutos)](#-etapa-1-ativação-do-ambiente-em-nuvem-10-minutos)
4. [Etapa 2: Cadastro Inicial da Empresa & Configuração Fiscal](#-etapa-2-cadastro-inicial-da-empresa--configuração-fiscal)
5. [Etapa 3: Desenho do Armazém (Torre 2D e Endereçamento)](#-etapa-3-desenho-do-armazém-torre-2d-e-endereçamento)
6. [Etapa 4: Migração Massiva de Dados (Planilhas e Saldos Iniciais)](#-etapa-4-migração-massiva-de-dados-planilhas-e-saldos-iniciais)
7. [Etapa 5: Serviços, Tributação e Tabela de Cobrança Aduaneira](#-etapa-5-serviços-tributação-e-tabela-de-cobrança-aduaneira)
8. [Etapa 6: Homologação SEFAZ & Emissão do Primeiro Documento](#-etapa-6-homologação-sefaz--emissão-do-primeiro-documento)
9. [Etapa 7: Treinamento Operacional dos Usuários](#-etapa-7-treinamento-operacional-dos-usuários)
10. [Resolução de Dúvidas Comuns (FAQ Zero-Stress)](#-resolução-de-dúvidas-comuns-faq-zero-stress)

---

## 🎯 1. Visão Geral & Filosofia "Sem Dor"

A implantação tradicional de sistemas WMS/ERP costuma ser longa e desgastante. O **GADAP WMS** foi concebido sob três princípios:
1. **Self-Service Intuitivo:** Todas as telas possuem validações instantâneas, exemplos visuais e bloqueios inteligentes que impedem erros operacionais graves.
2. **Carga Inteligente de Dados:** Modelos prontos em Excel (.xlsx) e CSV para você preencher apenas o essencial. O sistema sanitiza CPFs, CNPJs, NCMs e chaves de acesso automaticamente.
3. **Rollout Gradual:** É possível operar primeiro o inventário e a conferência física e, em seguida, ativar o faturamento, cobrança alfandegária e folha de pagamento.

---

## 📋 2. Pré-requisitos e Checklist Inicial

Antes de começar, reúna estes itens simples:
- [ ] **Dados da Empresa:** Razão Social, CNPJ, Inscrição Estadual, CNAE e Endereço Oficial.
- [ ] **Certificado Digital A1:** Arquivo `.pfx` ou `.p12` com a respectiva senha (necessário para emissão de NF-e, NFS-e, CT-e e MDF-e).
- [ ] **Relação de Produtos / SKUs:** Planilha com código interno, descrição, código de barras (EAN), NCM e unidade de medida (CX, UN, PALLET, KG).
- [ ] **Inventário Físico Inicial:** Quantidade em estoque por SKU e lote/validade atual.
- [ ] **Navegador Recomendado:** Google Chrome, Microsoft Edge ou Firefox atualizados. Computadores com conexão à internet estável.

---

## ☁️ Etapa 1: Ativação do Ambiente em Nuvem (10 Minutos)

Seu sistema opera com banco de dados isolado (Multi-Tenant) com criptografia ponta a ponta:

1. **Acesso ao Portal:** Abra o link fornecido para a sua organização (ex: `https://gadap.suaempresa.com.br` ou link do servidor local).
2. **Primeiro Acesso do Administrador:**
   - Faça login com o e-mail cadastrado como Gestor Geral.
   - O sistema solicitará a criação de uma senha forte pessoal (mínimo de 8 dígitos, contendo maiúsculas, minúsculas e números).
3. **Segurança de Acesso:**
   - O sistema utiliza autenticação segura via Supabase Auth com suporte a MFA (Autenticação em Duas Etapas) para proteger dados alfandegários e fiscais.

---

## 🏢 Etapa 2: Cadastro Inicial da Empresa & Configuração Fiscal

1. No menu lateral, acesse **Configurações > Dados do Armazém / Empresa**.
2. **Preencha os Campos Fiscais:**
   - CNPJ, Regime Tributário (Simples Nacional, Lucro Presumido ou Lucro Real).
   - CNAE Principal (ex: Armazéns Gerais 5211-7/99 ou Operadores Logísticos).
3. **Upload do Certificado Digital A1:**
   - Clique em **Certificados SEFAZ > Carregar Certificado A1 (.pfx)**.
   - Digite a senha do certificado. O sistema valida imediatamente a validade e a conexão com a Secretaria de Fazenda.
4. **Alíquotas Padrão:**
   - Confirme as alíquotas padrão de ISS do município do armazém (ex: 2% a 5%) e alíquota de retenção aplicável.

---

## 🗺️ Etapa 3: Desenho do Armazém (Torre 2D e Endereçamento)

Para que os operadores saibam exatamente onde guardar ou coletar cada palete:

1. Acesse **Operações > Torre de Controle / Mapa 2D**.
2. **Criar Ruas e Níveis:**
   - O sistema permite desenhar o layout por meio de blocos visuais ou importação rápida de endereços no formato `RUA-PREDIO-NIVEL-POSICAO` (ex: `A-01-02-04`).
3. **Tipos de Posições:**
   - Marque áreas especiais: *Blocado*, *Porta-Palete*, *Câmara Fria*, *Área Segregada Alfandegada / Perdimento*, *Doca de Recebimento* e *Doca de Expedição*.
4. **Capacidade Máxima:**
   - O sistema já aplica controle de peso máximo e restrições de empilhamento para evitar sobrecargas estruturais.

---

## 📊 Etapa 4: Migração Massiva de Dados (Planilhas e Saldos Iniciais)

Esta é a etapa mais importante para uma transição suave. O GADAP possui importadores com validação em tempo real:

### 1. Importação de Clientes e Depositantes:
- Acesse **Cadastros > Clientes e Depositantes > Importar via Planilha**.
- Baixe o modelo padrão clicando em **"Baixar Modelo de Clientes (.xlsx)"**.
- Cole os dados de seus clientes (CNPJ, Razão Social, E-mail de Notificação).
- Clique em **"Processar Arquivo"**. O sistema identifica CNPJs duplicados e corrige pontuações automaticamente.

### 2. Importação do Catálogo de Produtos / SKUs:
- Acesse **Cadastros > Produtos / SKUs > Importar**.
- Baixe o modelo **"Modelo_Produtos_GADAP.xlsx"**.
- Preencha:
  - `Código SKU`: Código único interno.
  - `Descrição`: Nome completo do item.
  - `NCM`: 8 dígitos fiscais.
  - `Controle de Lote/Validade`: Marque `SIM` se for perecível, cosmético ou químico.
  - `Cliente Proprietário`: CNPJ do depositante dono do produto.

### 3. Carga do Saldo Inicial de Estoque (Inventário de Corte):
- No dia do "Go-Live" (início da operação), realize uma contagem física ou extraia o saldo final do sistema legado.
- Acesse **Estoque > Inventário Inicial de Implantação**.
- Carregue a planilha com: `SKU`, `Lote`, `Validade`, `Quantidade` e `Endereço Inicial` (opcional — caso não informe o endereço, os itens vão para a "Doca de Entrada" para alocação guiada).

---

## 💰 Etapa 5: Serviços, Tributação e Tabela de Cobrança Aduaneira

O GADAP já vem equipado com uma **base de dados pré-configurada** com mais de 10 serviços alfandegários e de armazenagem geral:

1. Acesse **Faturamento & Aduana > Tabela de Serviços e Tarifas**.
2. **Serviços Nativos Disponíveis:**
   - *Armazenagem Geral (Ad-Valorem % sobre o valor CIF/FOB)*.
   - *Movimentação / In & Out (Cobrança por tonelada ou por palete movimentado)*.
   - *Estufagem e Desova de Contêineres (Dry, Reefer, Open Top)*.
   - *Pesagem Oficial em Balança Rodoviária*.
   - *Serviços Extraordinários (Etiquetagem, Paletização, Filme Stretch)*.
3. **Personalização por Cliente:**
   - É possível definir tabelas de preços exclusivas por cliente (acordo comercial fechado).
   - Defina os dias de franquia de armazenagem (ex: 7 dias livres após o desembaraço) e valor da diária excedente.

---

## 🧾 Etapa 6: Homologação SEFAZ & Emissão do Primeiro Documento

1. Acesse **Fiscal > Painel de Emissão**.
2. **Ambiente de Testes (Homologação):**
   - O sistema inicia configurado em modo *Homologação* para que você possa emitir notas de teste sem validade jurídica.
3. **Emissão de Teste:**
   - Crie uma NF-e de entrada ou saída simbólica e clique em **"Emitir Documento"**.
   - O sistema valida schema XML, certificado e retorna a autorização SEFAZ em menos de 2 segundos.
4. **Virada para Produção:**
   - Vá em **Configurações > Parâmetros Fiscais** e altere o ambiente para **"Produção"**. A partir deste momento, todos os documentos emitidos terão validade fiscal oficial.

---

## 👥 Etapa 7: Treinamento Operacional dos Usuários

Defina os perfis de acesso para sua equipe em **Configurações > Usuários & Permissões**:

| Perfil | Telas Acessadas | Função no Dia a Dia |
| :--- | :--- | :--- |
| **Operador de Doca / Conferente** | Coletor Mobile, Recebimento, Expedição | Bipar códigos de barras, registrar avarias, conferir cegas de entrada. |
| **Operador de Empilhadeira** | Torre 2D, Alocação, Reabastecimento | Guardar paletes nos endereços sugeridos pelo sistema. |
| **Faturista / Fiscal** | Emissão NF-e/CT-e, Cobrança de Serviços | Gerar faturas de armazenagem e emitir documentos fiscais. |
| **Gerente de Logística** | Dashboard Geral, Relatórios, Auditoria | Monitorar ocupação do armazém, produtividade e SLA. |

---

## ❓ Resolução de Dúvidas Comuns (FAQ Zero-Stress)

#### **1. E se faltar internet no armazém durante a conferência?**
O módulo de conferência móvel possui buffer local. O operador pode continuar a bipagem de caixas e paletes; assim que o sinal Wi-Fi ou 4G for restabelecido, os dados são sincronizados automaticamente.

#### **2. O que acontece se uma planilha de importação tiver erros?**
O sistema não aborta o arquivo inteiro. Ele aceita todas as linhas corretas e gera um relatório automático apontando exatamente em qual linha e coluna está a inconsistência (ex: "Linha 42: CNPJ com 13 dígitos inválido"), permitindo corrigir somente a linha afetada.

#### **3. Como fica o cálculo do DSR, comissões ou horas extras da equipe?**
O módulo de RH/Folha já calcula automaticamente o DSR e integra os proventos e descontos extraordinários direto no Contas a Pagar do armazém.

#### **4. Como garantir que os dados de um cliente depositante não vazem para outro?**
A arquitetura do GADAP é blindada por **Row-Level Security (RLS)** nativo no banco de dados. Cada cliente cadastrado só enxerga seus próprios saldos, lotes e extratos, inclusive no Portal do Cliente.

#### **5. Como funciona a impressão de DANFEs e o envio para a contabilidade?**
O sistema permite imprimir o DANFE individual imediatamente após a autorização ou em lotes completos para a equipe de expedição. Além disso, em **Fiscal > Emissão**, basta clicar em **"Baixar Pacote do Contador (.ZIP)"** para obter todos os XMLs e PDFs do mês com o manifesto consolidado.

#### **6. Como o sistema protege relatórios contra cópias não autorizadas (LGPD)?**
Todas as planilhas Excel (`.xlsx`) e PDFs gerados contam com **Marca D'água Digital e Hash SHA-256 no rodapé**, carimbando o CNPJ da empresa, data/hora e identificador forense. Adicionalmente, há **Rate-Limiting de 100 req/min por empresa** para proteger o servidor contra scripts de extração massiva não supervisionada.

---

### 📞 Suporte e Acompanhamento
- **Logs e Diagnóstico em Tempo Real:** Disponíveis no menu lateral em **Gestão, RH & Qualidade > Auditoria do Sistema & Logs** (rota `/dashboard/auditoria-sistema`), onde é possível acompanhar o fluxo ao vivo de logs, status de conexões, latências de banco/cache e executar health checks automáticos com um clique.
- **Auditoria Aduaneira e 3-Way Match:** Disponível em **Torre & Operações > Auditoria 3-Way Match** (rota `/dashboard/auditoria`) para confronto físico vs fiscal de DI/NF.
- **Testes de Resiliência via Terminal:** Execute a suíte de auditoria (`python scripts/run_stress_chaos_benchmark.py` e `python scripts/run_multi_tenant_security_audit.py`) para gerar os laudos técnicos em PDF com Score 100/100.

